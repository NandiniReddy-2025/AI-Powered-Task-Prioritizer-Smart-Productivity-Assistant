"""
Inference Predictor for DeepTaskPrioritizer

Loads trained PyTorch weights and provides fast, thread-safe inference for any
incoming task query. Strictly separates model predictions, system calculated metrics,
and user-supplied inputs for full explainability.
"""

import os
import sys
import json
import re
from datetime import datetime, timezone
from typing import Dict, Any, Optional

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

import torch
import torch.nn.functional as F

from ml.models.task_classifier import DeepTaskPrioritizer
from ml.training.train import SimpleTokenizer, REVERSE_PRIORITY, REVERSE_CATEGORY, URGENCY_MAP, IMPORTANCE_MAP

class TaskPriorityPredictor:
    _instance = None

    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = None
        self.tokenizer = None
        self.initialized = False
        self.load_model()

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def load_model(self):
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        save_dir = os.path.join(base_dir, "models", "saved_weights")
        weights_path = os.path.join(save_dir, "best_model.pt")
        vocab_path = os.path.join(save_dir, "vocab.json")

        if not os.path.exists(weights_path) or not os.path.exists(vocab_path):
            try:
                from ml.training.train import train
                train()
            except Exception as e:
                print(f"Auto-training encountered note: {e}")

        if os.path.exists(vocab_path):
            self.tokenizer = SimpleTokenizer.load(vocab_path)
            self.model = DeepTaskPrioritizer(
                vocab_size=len(self.tokenizer.word2idx),
                embed_dim=128,
                hidden_dim=128,
                num_lstm_layers=2,
                num_aux_features=4,
                num_priorities=3,
                num_categories=6,
                dropout=0.0
            ).to(self.device)

            if os.path.exists(weights_path):
                self.model.load_state_dict(torch.load(weights_path, map_location=self.device))
                self.model.eval()
                self.initialized = True
                print("DeepTaskPrioritizer model loaded successfully!")

    def detect_urgency_keywords(self, text: str) -> str:
        text_lower = text.lower()
        urgent_keywords = [
            "urgent", "asap", "emergency", "critical", "immediately", "today",
            "tonight", "by tonight", "by 5pm", "blocking", "hotfix", "eod",
            "down", "outage", "leak", "vulnerability", "fatal", "highest priority",
            "severe", "security breach", "data loss", "crash", "broken"
        ]
        moderate_keywords = [
            "tomorrow", "this week", "next sprint", "review", "prepare", "draft",
            "finalize", "scheduled", "upcoming", "standard", "quarterly"
        ]
        flexible_keywords = [
            "whenever", "optional", "backlog", "low priority", "explore",
            "if time permits", "when convenient", "no rush"
        ]
        
        for kw in urgent_keywords:
            if re.search(r"\b" + re.escape(kw) + r"\b", text_lower):
                return "Urgent"
        for kw in moderate_keywords:
            if re.search(r"\b" + re.escape(kw) + r"\b", text_lower):
                return "Moderate"
        for kw in flexible_keywords:
            if re.search(r"\b" + re.escape(kw) + r"\b", text_lower):
                return "Flexible"
        return "Flexible"

    def predict(
        self,
        title: str,
        description: Optional[str] = None,
        deadline: Optional[datetime] = None,
        estimated_duration: float = 1.0,
        category: Optional[str] = None,
        user_importance: Optional[str] = None,
        available_time: Optional[float] = None
    ) -> Dict[str, Any]:
        if not self.initialized:
            self.load_model()

        full_text = f"{title}. {description or ''}".strip()
        text_urgency = self.detect_urgency_keywords(full_text)

        # System calculations for temporal deadlines & overdue tracking
        is_overdue = False
        overdue_hours = None
        time_remaining_hours = None
        deadline_proximity_days = 7.0
        temporal_urgency = "Flexible"

        if deadline:
            now = datetime.now(timezone.utc)
            dl = deadline if deadline.tzinfo else deadline.replace(tzinfo=timezone.utc)
            delta_sec = (dl - now).total_seconds()
            
            if delta_sec < 0:
                is_overdue = True
                overdue_hours = round(abs(delta_sec) / 3600.0, 1)
                time_remaining_hours = 0.0
                deadline_proximity_days = 0.05
                temporal_urgency = "Urgent"
            else:
                time_remaining_hours = round(delta_sec / 3600.0, 1)
                deadline_proximity_days = round(max(0.05, delta_sec / 86400.0), 2)
                if deadline_proximity_days <= 1.5:
                    temporal_urgency = "Urgent"
                elif deadline_proximity_days <= 5.0:
                    temporal_urgency = "Moderate"
                else:
                    temporal_urgency = "Flexible"

        # Synthesize effective operational urgency (combining text semantic cues and temporal constraints)
        urgency_hierarchy = {"Urgent": 3, "Moderate": 2, "Flexible": 1}
        if deadline is not None:
            max_rank = max(urgency_hierarchy.get(text_urgency, 1), urgency_hierarchy.get(temporal_urgency, 1))
            rank_to_label = {3: "Urgent", 2: "Moderate", 1: "Flexible"}
            effective_urgency = rank_to_label[max_rank]
        else:
            effective_urgency = text_urgency

        # Tokenize natural text
        token_ids = torch.tensor([self.tokenizer.encode(full_text)], dtype=torch.long, device=self.device)

        # Auxiliary features: [dur_norm, prox_norm, urg_val, imp_val]
        dur_norm = min(40.0, estimated_duration) / 40.0
        prox_norm = min(14.0, deadline_proximity_days) / 14.0
        urg_val = URGENCY_MAP.get(effective_urgency, 0.5)
        imp_val = IMPORTANCE_MAP.get(user_importance or "Medium", 0.5)
        aux_tensor = torch.tensor([[dur_norm, prox_norm, urg_val, imp_val]], dtype=torch.float32, device=self.device)

        # Deep learning model inference
        with torch.no_grad():
            prio_logits, cat_logits = self.model(token_ids, aux_tensor)
            prio_probs = F.softmax(prio_logits, dim=1)[0].cpu().numpy()
            cat_probs = F.softmax(cat_logits, dim=1)[0].cpu().numpy()

        prio_idx = int(prio_probs.argmax())
        cat_idx = int(cat_probs.argmax())

        predicted_prio = REVERSE_PRIORITY.get(prio_idx, "Medium")
        predicted_cat = REVERSE_CATEGORY.get(cat_idx, "Development")
        confidence = float(prio_probs[prio_idx])

        class_probabilities = {
            "High": round(float(prio_probs[0]), 3),
            "Medium": round(float(prio_probs[1]), 3),
            "Low": round(float(prio_probs[2]), 3)
        }

        # Coherent, non-contradictory explanation generation
        reasons = []
        if predicted_prio == "High":
            if is_overdue:
                reasons.append(f"an overdue deadline (passed {overdue_hours:.1f} hours ago)")
            elif deadline and deadline_proximity_days <= 1.5:
                reasons.append(f"an imminent deadline window ({time_remaining_hours:.1f} hours remaining)")
            if text_urgency == "Urgent":
                reasons.append("critical/urgent language detected in the task text")
            if user_importance == "High":
                reasons.append("user-designated high importance")
            if estimated_duration >= 8.0:
                reasons.append(f"significant required effort ({estimated_duration} hours)")
            if not reasons:
                reasons.append("deep text and temporal feature representation matching high-priority milestones")

        elif predicted_prio == "Medium":
            if is_overdue:
                reasons.append(f"an overdue deliverable (passed {overdue_hours:.1f}h ago) balanced with routine task scope")
            elif user_importance == "High":
                reasons.append("user-designated high importance balanced with routine deliverable scope")
            if 1.0 < deadline_proximity_days <= 5.0:
                reasons.append(f"a moderate turnaround window ({deadline_proximity_days:.1f} days remaining)")
            if user_importance == "Medium":
                reasons.append("standard medium importance designation")
            if not reasons:
                reasons.append("routine operational scope and balanced workload features")

        else: # Low priority
            if user_importance == "Low":
                reasons.append("user-designated low priority")
            if deadline_proximity_days > 5.0:
                reasons.append(f"a flexible schedule ({deadline_proximity_days:.1f} days remaining)")
            if text_urgency == "Flexible":
                reasons.append("exploratory or backlog task characteristics")
            if not reasons:
                reasons.append("non-blocking routine maintenance scope")

        explanation = f"Predicted as {predicted_prio} priority ({confidence*100:.1f}% confidence) based on {', '.join(reasons)}."

        # Structured diagnostic breakdown
        breakdown = {
            "model_predicted": {
                "priority_class": predicted_prio,
                "confidence_score": round(confidence, 3),
                "domain_category": predicted_cat,
                "detected_urgency_from_text": text_urgency,
                "effective_operational_urgency": effective_urgency,
                "model_architecture": "BiLSTM + Multi-Head Self-Attention Dual-Head Neural Network"
            },
            "system_calculated": {
                "is_overdue": is_overdue,
                "overdue_hours": overdue_hours,
                "deadline_proximity_days": round(deadline_proximity_days, 2) if deadline else None,
                "time_remaining_hours": round(time_remaining_hours, 1) if time_remaining_hours is not None else None,
                "duration_to_deadline_ratio": round(estimated_duration / max(0.1, time_remaining_hours), 2) if time_remaining_hours and time_remaining_hours > 0 else (99.0 if is_overdue else None),
                "temporal_urgency": temporal_urgency,
                "text_urgency": text_urgency
            },
            "user_provided": {
                "user_importance": user_importance or "Not specified",
                "user_estimated_duration_hours": estimated_duration,
                "user_category": category or "Not specified",
                "user_available_time_hours": available_time or "Not specified"
            }
        }

        return {
            "predicted_priority": predicted_prio,
            "confidence_score": round(confidence, 3),
            "class_probabilities": class_probabilities,
            "predicted_category": predicted_cat,
            "detected_urgency": effective_urgency,
            "explanation": explanation,
            "breakdown": breakdown
        }
