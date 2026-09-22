"""
Model Training Script for DeepTaskPrioritizer

Trains the PyTorch multi-task neural network on the clean dataset splits.
Saves model checkpoints, vocabulary, label maps, and training history.
"""

import os
import sys
import re
import json
import math
import random
from collections import Counter
from typing import List, Dict, Tuple, Any

# Ensure project root is in sys.path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader
from ml.models.task_classifier import DeepTaskPrioritizer

# Determinism
torch.manual_seed(42)
random.seed(42)

PRIORITY_MAP = {"High": 0, "Medium": 1, "Low": 2}
REVERSE_PRIORITY = {0: "High", 1: "Medium", 2: "Low"}

CATEGORY_MAP = {
    "Development": 0,
    "Academic & Research": 1,
    "Business & Marketing": 2,
    "Design & Creative": 3,
    "Operations & Admin": 4,
    "Personal & Health": 5
}
REVERSE_CATEGORY = {v: k for k, v in CATEGORY_MAP.items()}

URGENCY_MAP = {"Urgent": 1.0, "Moderate": 0.5, "Flexible": 0.0}
IMPORTANCE_MAP = {"High": 1.0, "Medium": 0.5, "Low": 0.0}

class SimpleTokenizer:
    def __init__(self, vocab_size: int = 5000, max_seq_len: int = 64):
        self.vocab_size = vocab_size
        self.max_seq_len = max_seq_len
        self.word2idx = {"<PAD>": 0, "<UNK>": 1, "<SOS>": 2, "<EOS>": 3}
        self.idx2word = {0: "<PAD>", 1: "<UNK>", 2: "<SOS>", 3: "<EOS>"}

    @staticmethod
    def clean_text(text: str) -> List[str]:
        text = text.lower()
        tokens = re.findall(r"\b[a-z0-9\-\']+\b", text)
        return tokens

    def build_vocab(self, texts: List[str]):
        counter = Counter()
        for t in texts:
            tokens = self.clean_text(t)
            counter.update(tokens)
        
        most_common = counter.most_common(self.vocab_size - len(self.word2idx))
        for word, _ in most_common:
            idx = len(self.word2idx)
            self.word2idx[word] = idx
            self.idx2word[idx] = word
        print(f"Built vocabulary with {len(self.word2idx)} unique tokens.")

    def encode(self, text: str) -> List[int]:
        tokens = self.clean_text(text)
        ids = [self.word2idx.get(t, self.word2idx["<UNK>"]) for t in tokens[:self.max_seq_len]]
        if len(ids) < self.max_seq_len:
            ids += [self.word2idx["<PAD>"]] * (self.max_seq_len - len(ids))
        return ids

    def save(self, path: str):
        with open(path, "w", encoding="utf-8") as f:
            json.dump({"word2idx": self.word2idx, "max_seq_len": self.max_seq_len}, f, indent=2)

    @classmethod
    def load(cls, path: str):
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        tok = cls(max_seq_len=data["max_seq_len"])
        tok.word2idx = data["word2idx"]
        tok.idx2word = {int(v): k for k, v in tok.word2idx.items()}
        return tok

class TaskDataset(Dataset):
    def __init__(self, data_path: str, tokenizer: SimpleTokenizer):
        self.samples = []
        self.tokenizer = tokenizer
        
        with open(data_path, "r", encoding="utf-8") as f:
            for line in f:
                if line.strip():
                    self.samples.append(json.loads(line))

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        item = self.samples[idx]
        
        # Clean text tokenization (title + description)
        text = item.get("text_content", f"{item['task_title']}. {item.get('task_description', '')}")
        token_ids = torch.tensor(self.tokenizer.encode(text), dtype=torch.long)

        # Auxiliary features: [duration / 40.0, proximity / 14.0, urgency_val, importance_val]
        dur = min(40.0, item.get("estimated_duration_hours", 1.0)) / 40.0
        prox = min(14.0, item.get("deadline_proximity_days", 3.0)) / 14.0
        urg = URGENCY_MAP.get(item.get("urgency_label", "Moderate"), 0.5)
        imp = IMPORTANCE_MAP.get(item.get("importance_label", "Medium"), 0.5)
        aux = torch.tensor([dur, prox, urg, imp], dtype=torch.float32)

        # Labels
        prio_label = torch.tensor(PRIORITY_MAP.get(item["priority_label"], 1), dtype=torch.long)
        cat_label = torch.tensor(CATEGORY_MAP.get(item["category"], 0), dtype=torch.long)

        return token_ids, aux, prio_label, cat_label

def train():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_dir = os.path.join(base_dir, "data")
    save_dir = os.path.join(base_dir, "models", "saved_weights")
    os.makedirs(save_dir, exist_ok=True)

    train_path = os.path.join(data_dir, "train.jsonl")
    val_path = os.path.join(data_dir, "val.jsonl")

    # If data doesn't exist, generate it
    if not os.path.exists(train_path):
        from ml.data.generate_dataset import main as gen_data
        gen_data()

    # Build tokenizer on train texts
    train_texts = []
    with open(train_path, "r", encoding="utf-8") as f:
        for line in f:
            if line.strip():
                item = json.loads(line)
                train_texts.append(item.get("text_content", item["task_title"]))

    tokenizer = SimpleTokenizer(vocab_size=5000, max_seq_len=64)
    tokenizer.build_vocab(train_texts)
    tokenizer.save(os.path.join(save_dir, "vocab.json"))

    # Save label encoders
    with open(os.path.join(save_dir, "label_encoders.json"), "w", encoding="utf-8") as f:
        json.dump({
            "priority_map": PRIORITY_MAP,
            "reverse_priority": REVERSE_PRIORITY,
            "category_map": CATEGORY_MAP,
            "reverse_category": REVERSE_CATEGORY,
            "urgency_map": URGENCY_MAP,
            "importance_map": IMPORTANCE_MAP
        }, f, indent=2)

    # Dataloaders
    train_ds = TaskDataset(train_path, tokenizer)
    val_ds = TaskDataset(val_path, tokenizer)

    train_loader = DataLoader(train_ds, batch_size=64, shuffle=True)
    val_loader = DataLoader(val_ds, batch_size=64, shuffle=False)

    # Initialize Model
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Training on device: {device}")

    model = DeepTaskPrioritizer(
        vocab_size=len(tokenizer.word2idx),
        embed_dim=128,
        hidden_dim=128,
        num_lstm_layers=2,
        num_aux_features=4,
        num_priorities=3,
        num_categories=6,
        dropout=0.3
    ).to(device)

    # Use label smoothing to avoid overconfident saturated logits
    criterion_prio = nn.CrossEntropyLoss(label_smoothing=0.08)
    criterion_cat = nn.CrossEntropyLoss(label_smoothing=0.05)

    optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-4)
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=12, eta_min=1e-5)

    best_val_acc = 0.0
    num_epochs = 12

    print("\n--- Starting Deep Learning Model Training ---")
    history = []

    for epoch in range(1, num_epochs + 1):
        model.train()
        total_loss = 0.0
        correct_prio = 0
        correct_cat = 0
        total_samples = 0

        for input_ids, aux, prio_targets, cat_targets in train_loader:
            input_ids = input_ids.to(device)
            aux = aux.to(device)
            prio_targets = prio_targets.to(device)
            cat_targets = cat_targets.to(device)

            optimizer.zero_grad()
            prio_logits, cat_logits = model(input_ids, aux)

            loss_p = criterion_prio(prio_logits, prio_targets)
            loss_c = criterion_cat(cat_logits, cat_targets)
            loss = loss_p + 0.5 * loss_c

            loss.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
            optimizer.step()

            total_loss += loss.item() * input_ids.size(0)
            pred_p = torch.argmax(prio_logits, dim=1)
            pred_c = torch.argmax(cat_logits, dim=1)

            correct_prio += (pred_p == prio_targets).sum().item()
            correct_cat += (pred_c == cat_targets).sum().item()
            total_samples += input_ids.size(0)

        scheduler.step()

        train_loss = total_loss / total_samples
        train_prio_acc = (correct_prio / total_samples) * 100.0
        train_cat_acc = (correct_cat / total_samples) * 100.0

        # Validation
        model.eval()
        val_loss = 0.0
        val_prio_correct = 0
        val_cat_correct = 0
        val_samples = 0

        with torch.no_grad():
            for input_ids, aux, prio_targets, cat_targets in val_loader:
                input_ids = input_ids.to(device)
                aux = aux.to(device)
                prio_targets = prio_targets.to(device)
                cat_targets = cat_targets.to(device)

                prio_logits, cat_logits = model(input_ids, aux)
                loss_p = criterion_prio(prio_logits, prio_targets)
                loss_c = criterion_cat(cat_logits, cat_targets)
                loss = loss_p + 0.5 * loss_c

                val_loss += loss.item() * input_ids.size(0)
                pred_p = torch.argmax(prio_logits, dim=1)
                pred_c = torch.argmax(cat_logits, dim=1)

                val_prio_correct += (pred_p == prio_targets).sum().item()
                val_cat_correct += (pred_c == cat_targets).sum().item()
                val_samples += input_ids.size(0)

        val_loss /= val_samples
        val_prio_acc = (val_prio_correct / val_samples) * 100.0
        val_cat_acc = (val_cat_correct / val_samples) * 100.0

        print(f"Epoch {epoch:02d}/{num_epochs:02d} | Train Loss: {train_loss:.4f} | Train Prio Acc: {train_prio_acc:.1f}% | Val Loss: {val_loss:.4f} | Val Prio Acc: {val_prio_acc:.1f}% | Val Cat Acc: {val_cat_acc:.1f}%")

        history.append({
            "epoch": epoch,
            "train_loss": train_loss,
            "train_prio_acc": train_prio_acc,
            "val_loss": val_loss,
            "val_prio_acc": val_prio_acc,
            "val_cat_acc": val_cat_acc
        })

        if val_prio_acc >= best_val_acc:
            best_val_acc = val_prio_acc
            torch.save(model.state_dict(), os.path.join(save_dir, "best_model.pt"))

    # Save training history
    with open(os.path.join(save_dir, "train_history.json"), "w", encoding="utf-8") as f:
        json.dump(history, f, indent=2)

    print(f"\nTraining Complete! Best Validation Priority Accuracy: {best_val_acc:.2f}%")
    print(f"Saved weights to {os.path.join(save_dir, 'best_model.pt')}")

if __name__ == "__main__":
    train()
