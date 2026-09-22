# Deep Learning Architecture & Evaluation Documentation

## 1. Overview
The Deep Learning pipeline powers the core intelligence of the application:
1. **Smart Task Prioritization**: Predicts calibrated Priority (`High`, `Medium`, `Low`) and Domain Category from conversational natural language descriptions.
2. **AI Task Breakdown**: Decomposes high-level project goals into domain-specific structured milestones.
3. **Deadline Risk Forecasting**: Evaluates multi-factor temporal velocity, effort deficits, and urgency constraints to forecast deadline risks.

## 2. Neural Network Architecture

```
                       Input Task Text
                             ↓
                [Vocab Tokenizer & Padding]
                             ↓
              [Embedding Layer (128-dim)]
                             ↓
           [Bi-directional LSTM (2 layers, 128-dim)]
                             ↓
            [Multi-Head Self-Attention (4 Heads)]
                             ↓
               [Global Avg + Max Pooling] (256-dim)
                             ↓
    Auxiliary Features (Duration, Proximity, Urgency) → [Dense Linear (32-dim)]
                             ↓
              [Fused Representation: 288-dim]
                             ↓
          [Shared Dense + LayerNorm + GELU + Dropout]
                             ↓
             ┌───────────────┴───────────────┐
             ↓                               ↓
   [Priority Head: 3 logits]       [Category Head: 6 logits]
             ↓                               ↓
   [Softmax: High/Med/Low]         [Softmax: 6 Domains]
```

## 3. Dataset & Splits
- **Total Records**: 1,450 multi-domain task samples
- **Train Split (70%)**: 1,014 samples
- **Validation Split (15%)**: 218 samples
- **Test Split (15%)**: 218 samples
- **Domain Categories**: Development, Academic & Research, Business & Marketing, Design & Creative, Operations & Admin, Personal & Health.

## 4. Training Parameters
- **Optimizer**: AdamW (`lr=1e-3`, `weight_decay=1e-4`)
- **Loss Function**: Multi-task Weighted CrossEntropyLoss (`loss = loss_priority + 0.5 * loss_category`)
- **Scheduler**: Cosine Annealing Learning Rate Scheduler
- **Epochs**: 20 epochs with early validation checkpoint saving.

## 5. Evaluation Benchmarks on Unseen Test Split
- **Overall Priority Accuracy**: ~88%
- **Macro Precision**: ~87%
- **Macro Recall**: ~88%
- **Macro F1-Score**: ~87%
- **Confusion Matrix**: Fully documented in `ml/evaluation/metrics.json`.
