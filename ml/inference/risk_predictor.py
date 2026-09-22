"""
Multi-Factor Deadline Risk Prediction Engine

Evaluates temporal constraints, effort requirements, completion velocity,
and progress deficits to predict schedule risks and prescribe actionable mitigations.
"""

from datetime import datetime, timezone
from typing import Dict, Any, Optional

class DeadlineRiskPredictor:
    @staticmethod
    def predict_risk(
        title: str,
        description: Optional[str] = None,
        priority: str = "Medium",
        deadline: Optional[datetime] = None,
        estimated_duration: float = 1.0,
        progress: int = 0,
        available_time: Optional[float] = None
    ) -> Dict[str, Any]:
        
        # Base case: completed
        if progress >= 100:
            return {
                "risk_level": "Low",
                "risk_score": 0.0,
                "risk_reason": "Task is already 100% completed.",
                "risk_factors": {
                    "time_pressure": 0.0,
                    "progress_lag": 0.0,
                    "effort_deficit": 0.0,
                    "priority_weight": 0.0
                },
                "suggested_action": "Task is complete. No further action needed.",
                "time_remaining_hours": None
            }

        remaining_effort = estimated_duration * (1.0 - (progress / 100.0))
        now = datetime.now(timezone.utc)

        time_remaining_hours = None
        time_pressure = 0.0
        progress_lag = 0.0
        effort_deficit = 0.0

        if deadline:
            dl = deadline if deadline.tzinfo else deadline.replace(tzinfo=timezone.utc)
            delta_sec = (dl - now).total_seconds()
            time_remaining_hours = max(-24.0, delta_sec / 3600.0)

            if time_remaining_hours <= 0:
                # Overdue
                time_pressure = 100.0
                progress_lag = 100.0
            else:
                # Ratio of effort required to hours remaining
                ratio = remaining_effort / time_remaining_hours
                if ratio >= 0.8:
                    time_pressure = min(100.0, ratio * 70.0)
                elif ratio >= 0.4:
                    time_pressure = 45.0 + (ratio - 0.4) * 50.0
                else:
                    time_pressure = max(5.0, ratio * 50.0)
        else:
            # No deadline set
            if priority == "High" and progress == 0:
                time_pressure = 35.0
            else:
                time_pressure = 15.0

        # Available time check
        if available_time is not None and available_time > 0:
            if remaining_effort > available_time:
                effort_deficit = min(100.0, ((remaining_effort - available_time) / remaining_effort) * 80.0)

        # Priority weight
        prio_weights = {"High": 1.3, "Medium": 1.0, "Low": 0.8}
        p_weight = prio_weights.get(priority, 1.0)

        # Composite risk score (0 to 100)
        raw_score = (time_pressure * 0.6 + effort_deficit * 0.25 + (100.0 - progress) * 0.15) * p_weight
        risk_score = round(min(100.0, max(0.0, raw_score)), 1)

        # Risk Tier Classification
        if risk_score >= 65.0 or (time_remaining_hours is not None and time_remaining_hours <= 0):
            risk_level = "High"
        elif risk_score >= 35.0:
            risk_level = "Medium"
        else:
            risk_level = "Low"

        # Actionable Suggestions & Reasons
        if risk_level == "High":
            if time_remaining_hours is not None and time_remaining_hours <= 0:
                risk_reason = f"Deadline has elapsed by {abs(time_remaining_hours):.1f} hours with {100 - progress}% remaining work."
                suggested_action = "Critical overdue deliverable. Request a deadline extension or immediately delegate non-essential subtasks."
            else:
                risk_reason = f"Critical time crunch: {time_remaining_hours:.1f} hours remain to complete {remaining_effort:.1f} hours of work."
                suggested_action = "Break remaining effort into granular 30-minute subtasks and enter focused deep work mode immediately."
        elif risk_level == "Medium":
            risk_reason = f"Moderate timeline buffer: {remaining_effort:.1f} hours of estimated work remaining with potential schedule bottleneck."
            suggested_action = "Block out uninterrupted calendar time today to ensure buffer is not consumed by unexpected delays."
        else:
            risk_reason = "Healthy schedule buffer and progress velocity."
            suggested_action = "Maintain regular work cadence and check off subtasks as you complete them."

        return {
            "risk_level": risk_level,
            "risk_score": risk_score,
            "risk_reason": risk_reason,
            "risk_factors": {
                "time_pressure_score": round(time_pressure, 1),
                "progress_deficit_score": round(100.0 - progress, 1),
                "effort_vs_capacity_deficit": round(effort_deficit, 1),
                "priority_multiplier": p_weight
            },
            "suggested_action": suggested_action,
            "time_remaining_hours": round(time_remaining_hours, 1) if time_remaining_hours is not None else None
        }
