import os
import sys
import pytest

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from ml.training.train import SimpleTokenizer, train
from ml.evaluation.evaluate import evaluate
from ml.inference.predictor import TaskPriorityPredictor
from ml.inference.breakdown_engine import TaskBreakdownEngine
from ml.inference.risk_predictor import DeadlineRiskPredictor

def test_tokenizer():
    tokenizer = SimpleTokenizer(vocab_size=100, max_seq_len=16)
    texts = ["Fix memory leak in authentication", "Build React UI frontend"]
    tokenizer.build_vocab(texts)
    
    encoded = tokenizer.encode("Fix memory leak")
    assert len(encoded) == 16
    assert encoded[0] != 0 # not padding

def test_dataset_generation_and_training():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    assert os.path.exists(os.path.join(base_dir, "data", "train.jsonl"))
    assert os.path.exists(os.path.join(base_dir, "models", "saved_weights", "best_model.pt"))
    assert os.path.exists(os.path.join(base_dir, "models", "saved_weights", "vocab.json"))

def test_model_evaluation():
    results = evaluate()
    assert "priority_classification" in results
    assert results["priority_classification"]["accuracy"] > 0.60
    assert "confusion_matrix" in results["priority_classification"]

def test_priority_predictor_inference():
    predictor = TaskPriorityPredictor.get_instance()
    result = predictor.predict(
        title="Fix critical emergency database corruption",
        description="Users cannot log in. Immediate hotfix needed by tonight.",
        estimated_duration=3.0,
        user_importance="High"
    )
    assert result["predicted_priority"] in ["High", "Medium", "Low"]
    assert 0.0 <= result["confidence_score"] <= 1.0
    assert "model_predicted" in result["breakdown"]
    assert "system_calculated" in result["breakdown"]
    assert "user_provided" in result["breakdown"]

def test_task_breakdown_engine():
    result = TaskBreakdownEngine.breakdown(
        title="Build an AI Deep Learning Image Classifier"
    )
    assert result["domain"] == "Deep Learning / AI Project"
    assert len(result["suggested_subtasks"]) >= 5
    assert result["total_estimated_hours"] > 0

def test_deadline_risk_predictor():
    from datetime import datetime, timedelta, timezone
    
    # Near deadline with zero progress -> should predict High Risk
    near_dl = datetime.now(timezone.utc) + timedelta(hours=2)
    risk_res = DeadlineRiskPredictor.predict_risk(
        title="Write final thesis chapter",
        priority="High",
        deadline=near_dl,
        estimated_duration=8.0,
        progress=0
    )
    assert risk_res["risk_level"] == "High"
    assert risk_res["risk_score"] > 60.0
    assert "suggested_action" in risk_res
