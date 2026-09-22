"""
Deep Learning Multi-Task Neural Network for Task Prioritization and Domain Classification.

Architecture:
- Input: Tokenized text sequence (Vocab indices) + Auxiliary numeric features (Duration, Deadline proximity, Urgency, Importance).
- Text Backbone: Embedding layer (128d) -> Bi-directional LSTM (hidden 128d, 2 layers) -> Multi-Head Self-Attention (4 heads) -> Combined Pooling (256d) -> Text Projection (128d).
- Auxiliary Projection: 4 numeric/categorical features -> Dense Feature Projection (64d) with LayerNorm + GELU.
- Balanced Fusion: Fused vector (128 text + 64 aux = 192d) -> Shared Dense Representation (128d).
- Head 1 (Priority Classifier): Linear(128, 64) -> LayerNorm -> GELU -> Linear(64, 3) -> [High, Medium, Low].
- Head 2 (Category Classifier): Linear(128, 64) -> LayerNorm -> GELU -> Linear(64, 6) -> [6 Domain Classes].
"""

import math
import torch
import torch.nn as nn
import torch.nn.functional as F

class MultiHeadAttention(nn.Module):
    def __init__(self, embed_dim: int, num_heads: int = 4, dropout: float = 0.1):
        super().__init__()
        self.embed_dim = embed_dim
        self.num_heads = num_heads
        self.head_dim = embed_dim // num_heads
        assert self.head_dim * num_heads == embed_dim, "embed_dim must be divisible by num_heads"

        self.q_proj = nn.Linear(embed_dim, embed_dim)
        self.k_proj = nn.Linear(embed_dim, embed_dim)
        self.v_proj = nn.Linear(embed_dim, embed_dim)
        self.out_proj = nn.Linear(embed_dim, embed_dim)
        self.dropout = nn.Dropout(dropout)

    def forward(self, x, mask=None):
        batch_size, seq_len, embed_dim = x.size()
        
        q = self.q_proj(x).view(batch_size, seq_len, self.num_heads, self.head_dim).transpose(1, 2)
        k = self.k_proj(x).view(batch_size, seq_len, self.num_heads, self.head_dim).transpose(1, 2)
        v = self.v_proj(x).view(batch_size, seq_len, self.num_heads, self.head_dim).transpose(1, 2)

        scores = torch.matmul(q, k.transpose(-2, -1)) / math.sqrt(self.head_dim)
        if mask is not None:
            scores = scores.masked_fill(mask.unsqueeze(1).unsqueeze(2) == 0, -1e9)

        attn_weights = F.softmax(scores, dim=-1)
        attn_weights = self.dropout(attn_weights)

        context = torch.matmul(attn_weights, v)
        context = context.transpose(1, 2).contiguous().view(batch_size, seq_len, embed_dim)
        return self.out_proj(context)

class DeepTaskPrioritizer(nn.Module):
    def __init__(
        self,
        vocab_size: int = 5000,
        embed_dim: int = 128,
        hidden_dim: int = 128,
        num_lstm_layers: int = 2,
        num_aux_features: int = 4,
        num_priorities: int = 3,
        num_categories: int = 6,
        dropout: float = 0.3
    ):
        super().__init__()
        
        # 1. Text Embedding Layer
        self.embedding = nn.Embedding(vocab_size, embed_dim, padding_idx=0)
        
        # 2. Bi-directional LSTM
        self.lstm = nn.LSTM(
            input_size=embed_dim,
            hidden_size=hidden_dim,
            num_layers=num_lstm_layers,
            batch_first=True,
            bidirectional=True,
            dropout=dropout if num_lstm_layers > 1 else 0.0
        )
        
        # 3. Multi-Head Self-Attention on LSTM outputs (hidden_dim * 2 = 256)
        self.attention = MultiHeadAttention(embed_dim=hidden_dim * 2, num_heads=4, dropout=dropout)
        self.layer_norm_attn = nn.LayerNorm(hidden_dim * 2)

        # 4. Text Projection Layer (256d -> 128d)
        self.text_proj = nn.Sequential(
            nn.Linear(hidden_dim * 2, 128),
            nn.LayerNorm(128),
            nn.GELU(),
            nn.Dropout(dropout)
        )

        # 5. Auxiliary Feature Dense Projection (4d -> 64d)
        self.aux_proj = nn.Sequential(
            nn.Linear(num_aux_features, 64),
            nn.LayerNorm(64),
            nn.GELU(),
            nn.Dropout(dropout)
        )

        # 6. Balanced Fusion Layer (128 text + 64 aux = 192d -> 128d)
        self.shared_dense = nn.Sequential(
            nn.Linear(128 + 64, 128),
            nn.LayerNorm(128),
            nn.GELU(),
            nn.Dropout(dropout)
        )

        # 7. Priority Prediction Head (High, Medium, Low)
        self.priority_head = nn.Sequential(
            nn.Linear(128, 64),
            nn.LayerNorm(64),
            nn.GELU(),
            nn.Dropout(dropout),
            nn.Linear(64, num_priorities)
        )

        # 8. Domain Category Prediction Head (6 Categories)
        self.category_head = nn.Sequential(
            nn.Linear(128, 64),
            nn.LayerNorm(64),
            nn.GELU(),
            nn.Dropout(dropout),
            nn.Linear(64, num_categories)
        )

    def forward(self, input_ids: torch.Tensor, aux_features: torch.Tensor):
        # input_ids: [batch_size, seq_len]
        # aux_features: [batch_size, num_aux_features]
        
        # Text embedding
        embedded = self.embedding(input_ids) # [batch, seq_len, embed_dim]

        # BiLSTM representation
        lstm_out, _ = self.lstm(embedded) # [batch, seq_len, hidden_dim * 2]

        # Multi-Head Self Attention
        attn_out = self.attention(lstm_out)
        normed_attn = self.layer_norm_attn(lstm_out + attn_out)

        # Global average + max pooling across sequence
        avg_pool = torch.mean(normed_attn, dim=1)
        max_pool, _ = torch.max(normed_attn, dim=1)
        text_repr_raw = avg_pool + max_pool # [batch, hidden_dim * 2 = 256]
        text_repr = self.text_proj(text_repr_raw) # [batch, 128]

        # Auxiliary features projection
        aux_repr = self.aux_proj(aux_features) # [batch, 64]

        # Balanced Fusion
        fused = torch.cat([text_repr, aux_repr], dim=1) # [batch, 192]
        shared = self.shared_dense(fused) # [batch, 128]

        # Task Heads
        priority_logits = self.priority_head(shared) # [batch, 3]
        category_logits = self.category_head(shared) # [batch, 6]

        return priority_logits, category_logits
