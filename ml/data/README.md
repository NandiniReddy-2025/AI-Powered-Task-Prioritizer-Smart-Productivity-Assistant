# Dataset Documentation & Methodology

## 1. Overview
This dataset contains structured, multi-domain task representations designed for training and evaluating Deep Learning Natural Language Processing (NLP) models on task prioritization, category detection, urgency classification, and deadline risk prediction.

## 2. Data Schema
Each record in `train.jsonl`, `val.jsonl`, and `test.jsonl` contains the following fields:

| Field Name | Type | Description | Values / Examples |
|---|---|---|---|
| `task_title` | `String` | Core title or action summary | e.g. "Fix critical memory leak in authentication service" |
| `task_description` | `String` | Detailed instructions or context | Technical details, background, blockers |
| `category` | `String` | Domain category | `Development`, `Academic & Research`, `Business & Marketing`, `Design & Creative`, `Operations & Admin`, `Personal & Health` |
| `priority_label` | `String` | Target priority level | `High`, `Medium`, `Low` |
| `urgency_label` | `String` | Semantic urgency signal | `Urgent`, `Moderate`, `Flexible` |
| `importance_label` | `String` | Strategic importance | `High`, `Medium`, `Low` |
| `estimated_duration_hours` | `Float` | Estimated duration in hours | `0.5` to `40.0` |
| `deadline_proximity_days` | `Float` | Days remaining until target deadline | `0.1` to `14.0` |
| `risk_label` | `String` | Calculated deadline risk | `High`, `Medium`, `Low` |
| `text_content` | `String` | Concatenated textual representation | Combined text input for NLP tokenizer |

## 3. Data Splits
- **Total Samples:** ~1,375 records
- **Train Split (70%):** 962 samples
- **Validation Split (15%):** 206 samples
- **Test Split (15%):** 207 samples

## 4. Synthetic Data Generation Process & Transparency
- **Methodology:** Generated using combinatorial domain templates covering real-world workflows in engineering, research, marketing, UI design, infrastructure operations, and personal administration.
- **Variations:** Synthesizes realistic prefixes, suffixes, duration scales, urgency modifiers, and deadline buffers.
- **Deterministic Reproducibility:** Uses a fixed random seed (`seed=42`) via `ml/data/generate_dataset.py`.

## 5. Known Limitations & Disclaimer
> [!NOTE]
> This dataset is synthetically generated for academic prototyping and reproducible evaluation. While it simulates realistic multi-domain task phrasing, genuine user production workflows may introduce colloquial abbreviations, typos, domain slang, or irregular deadline patterns not present in this dataset.
