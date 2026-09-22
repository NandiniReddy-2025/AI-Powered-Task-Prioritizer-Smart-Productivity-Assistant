"""
Model Evaluation Script for DeepTaskPrioritizer

Evaluates the trained PyTorch Deep Learning model on the unseen test split.
Calculates Accuracy, Precision, Recall, Macro-F1, Per-class Metrics, and Confusion Matrix
using pure Python/NumPy for zero DLL overhead and maximum reliability.
Saves evaluated metrics to ml/evaluation/metrics.json.
"""

import os
import sys
import json

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

import torch
import numpy as np
from ml.models.task_classifier import DeepTaskPrioritizer
from ml.training.train import SimpleTokenizer, TaskDataset, PRIORITY_MAP, CATEGORY_MAP, REVERSE_PRIORITY, REVERSE_CATEGORY

def compute_metrics(y_true, y_pred, num_classes=3):
    total = len(y_true)
    accuracy = sum(1 for t, p in zip(y_true, y_pred) if t == p) / max(1, total)

    # Confusion matrix: rows = true, cols = pred
    cm = [[0] * num_classes for _ in range(num_classes)]
    for t, p in zip(y_true, y_pred):
        cm[t][p] += 1

    per_class = {}
    f1_list = []
    p_list = []
    r_list = []

    for c in range(num_classes):
        tp = cm[c][c]
        fp = sum(cm[r][c] for r in range(num_classes) if r != c)
        fn = sum(cm[c][col] for col in range(num_classes) if col != c)
        support = sum(cm[c])

        prec = tp / (tp + fp) if (tp + fp) > 0 else 0.0
        rec = tp / (tp + fn) if (tp + fn) > 0 else 0.0
        f1 = (2 * prec * rec) / (prec + rec) if (prec + rec) > 0 else 0.0

        label_name = REVERSE_PRIORITY.get(c, str(c))
        per_class[label_name] = {
            "precision": round(float(prec), 4),
            "recall": round(float(rec), 4),
            "f1": round(float(f1), 4),
            "support": int(support)
        }
        f1_list.append(f1)
        p_list.append(prec)
        r_list.append(rec)

    macro_p = sum(p_list) / num_classes
    macro_r = sum(r_list) / num_classes
    macro_f1 = sum(f1_list) / num_classes

    return {
        "accuracy": round(float(accuracy), 4),
        "macro_precision": round(float(macro_p), 4),
        "macro_recall": round(float(macro_r), 4),
        "macro_f1": round(float(macro_f1), 4),
        "per_class": per_class,
        "confusion_matrix": cm
    }

def evaluate():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_dir = os.path.join(base_dir, "data")
    save_dir = os.path.join(base_dir, "models", "saved_weights")
    eval_dir = os.path.join(base_dir, "evaluation")
    os.makedirs(eval_dir, exist_ok=True)

    test_path = os.path.join(data_dir, "test.jsonl")
    weights_path = os.path.join(save_dir, "best_model.pt")
    vocab_path = os.path.join(save_dir, "vocab.json")

    tokenizer = SimpleTokenizer.load(vocab_path)
    test_ds = TaskDataset(test_path, tokenizer)
    test_loader = torch.utils.data.DataLoader(test_ds, batch_size=32, shuffle=False)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = DeepTaskPrioritizer(
        vocab_size=len(tokenizer.word2idx),
        embed_dim=128,
        hidden_dim=128,
        num_lstm_layers=2,
        num_aux_features=4,
        num_priorities=3,
        num_categories=6,
        dropout=0.0
    ).to(device)

    model.load_state_dict(torch.load(weights_path, map_location=device))
    model.eval()

    all_prio_preds = []
    all_prio_targets = []
    all_cat_preds = []
    all_cat_targets = []

    with torch.no_grad():
        for input_ids, aux, prio_targets, cat_targets in test_loader:
            input_ids = input_ids.to(device)
            aux = aux.to(device)

            prio_logits, cat_logits = model(input_ids, aux)
            
            p_preds = torch.argmax(prio_logits, dim=1).cpu().tolist()
            c_preds = torch.argmax(cat_logits, dim=1).cpu().tolist()

            all_prio_preds.extend(p_preds)
            all_prio_targets.extend(prio_targets.tolist())
            all_cat_preds.extend(c_preds)
            all_cat_targets.extend(cat_targets.tolist())

    prio_metrics = compute_metrics(all_prio_targets, all_prio_preds, num_classes=3)
    prio_metrics["labels"] = ["High", "Medium", "Low"]

    cat_acc = sum(1 for t, p in zip(all_cat_targets, all_cat_preds) if t == p) / max(1, len(all_cat_targets))

    results = {
        "dataset_split": "test.jsonl",
        "total_test_samples": len(all_prio_targets),
        "priority_classification": prio_metrics,
        "category_classification": {
            "accuracy": round(float(cat_acc), 4)
        }
    }

    metrics_path = os.path.join(eval_dir, "metrics.json")
    with open(metrics_path, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)

    print("\n=======================================================")
    print("      DEEP LEARNING MODEL TEST EVALUATION REPORT       ")
    print("=======================================================")
    print(f"Total Test Samples: {results['total_test_samples']}")
    print(f"Priority Classification Accuracy: {prio_metrics['accuracy'] * 100:.2f}%")
    print(f"Priority Macro Precision:        {prio_metrics['macro_precision'] * 100:.2f}%")
    print(f"Priority Macro Recall:           {prio_metrics['macro_recall'] * 100:.2f}%")
    print(f"Priority Macro F1-Score:         {prio_metrics['macro_f1'] * 100:.2f}%")
    print("\nClass-wise Breakdown:")
    for label, m in prio_metrics["per_class"].items():
        print(f"  - {label:<7} | Precision: {m['precision']*100:5.1f}% | Recall: {m['recall']*100:5.1f}% | F1: {m['f1']*100:5.1f}% | Support: {m['support']}")
    
    print("\nConfusion Matrix (Rows=True, Cols=Predicted [High, Medium, Low]):")
    for row in prio_metrics["confusion_matrix"]:
        print(" ", row)

    print(f"\nDomain Category Accuracy:        {cat_acc * 100:.2f}%")
    print(f"Saved metrics to: {metrics_path}")
    print("=======================================================\n")

    return results

if __name__ == "__main__":
    evaluate()
