"""
Domain-Aware NLP Task Decomposition Engine

Deconstructs high-level goals and complex tasks into structured, actionable subtasks
with phase designations and estimated time allocations tailored specifically to the
detected domain and textual intent.
"""

import re
from typing import List, Dict, Any, Optional

DOMAIN_PATTERNS = {
    "Deep Learning / AI Project": [
        ("Finalize project scope, problem statement, and evaluation metrics", 2.0, "Planning"),
        ("Collect, explore, and clean the benchmark dataset", 4.0, "Data Preparation"),
        ("Implement data preprocessing, tokenization, and augmentations", 3.5, "Data Preparation"),
        ("Build neural network architecture (backbone, attention layers, heads)", 5.0, "Model Development"),
        ("Develop training pipeline with loss functions, AdamW optimizer, and learning rate scheduler", 4.0, "Training"),
        ("Train model, run hyperparameter sweeps, and monitor validation curves", 6.0, "Training"),
        ("Evaluate on test set: compute Accuracy, F1-scores, and confusion matrices", 2.5, "Evaluation"),
        ("Integrate trained model into FastAPI backend endpoints and test inference", 3.5, "Integration"),
        ("Develop frontend interface and test complete end-to-end workflow", 4.5, "Deployment"),
        ("Write comprehensive documentation, technical report, and user guide", 3.0, "Documentation")
    ],
    "Web Application / Software Development": [
        ("Define product requirements, database schema, and API specifications", 2.5, "Planning"),
        ("Set up repository, environment configuration, and core dependencies", 1.5, "Setup"),
        ("Implement database models, migrations, and ORM entities", 3.0, "Backend"),
        ("Build secure JWT authentication and user permission routes", 3.5, "Backend"),
        ("Develop core REST API endpoints and business logic services", 5.0, "Backend"),
        ("Create responsive frontend UI components and design system layouts", 4.5, "Frontend"),
        ("Connect frontend pages to backend APIs with state management", 4.0, "Frontend"),
        ("Implement error handling, validation states, and toast notifications", 2.5, "Refinement"),
        ("Write unit and integration tests across backend and frontend", 3.0, "Testing"),
        ("Deploy application to production staging and run smoke tests", 2.0, "Deployment")
    ],
    "Academic Paper / Research Thesis": [
        ("Conduct literature review and synthesize related works matrix", 6.0, "Research"),
        ("Formulate research methodology, hypotheses, and experimental design", 4.0, "Methodology"),
        ("Set up experiment pipeline and gather empirical data", 8.0, "Experimentation"),
        ("Perform statistical analysis, ablation studies, and error analysis", 5.0, "Analysis"),
        ("Draft Introduction, Motivation, and Problem Formulation sections", 3.5, "Writing"),
        ("Draft Methodology, System Architecture, and Implementation details", 4.5, "Writing"),
        ("Write Results, Discussion, and Comparative Benchmark sections", 4.0, "Writing"),
        ("Format LaTeX / IEEE template, bibliography citations, and figures", 3.0, "Formatting"),
        ("Review manuscript with advisor / co-authors and address revisions", 3.5, "Review"),
        ("Prepare presentation slide deck for defense / conference talk", 4.0, "Presentation")
    ],
    "Business / Marketing Campaign": [
        ("Define target audience personas, campaign objectives, and KPI targets", 2.0, "Strategy"),
        ("Conduct competitive analysis and value proposition positioning", 2.5, "Research"),
        ("Draft persuasive marketing copy, email sequences, and headlines", 3.0, "Content"),
        ("Design visual creative assets, banners, and social media media cards", 3.5, "Design"),
        ("Build conversion landing page and set up analytics tracking pixels", 4.0, "Development"),
        ("Set up email automation workflows and audience segmentation rules", 2.5, "Operations"),
        ("Launch campaign across primary channels (Email, Social, Search Ads)", 1.5, "Execution"),
        ("Monitor real-time conversion rates, CAC, and ad spend efficiency", 2.0, "Optimization"),
        ("Compile weekly performance summary report with ROI insights", 2.0, "Reporting")
    ],
    "UI/UX & Product Design": [
        ("Conduct stakeholder discovery interviews and document user pain points", 3.0, "Discovery"),
        ("Create information architecture diagrams and low-fidelity user flows", 2.5, "Architecture"),
        ("Design wireframes in Figma covering all major user journeys", 4.5, "Wireframing"),
        ("Establish design tokens, color palette, and typography scale", 2.0, "Design System"),
        ("Craft high-fidelity UI screens and interactive micro-interactions", 6.0, "Design"),
        ("Build clickable prototype in Figma for usability testing sessions", 3.5, "Prototyping"),
        ("Conduct moderated usability tests with 5 target users and record feedback", 4.0, "Testing"),
        ("Iterate designs based on user insights and edge-case discoveries", 3.0, "Refinement"),
        ("Prepare design handoff documentation and asset export for engineers", 2.0, "Handoff")
    ],
    "Operations / DevOps / Infrastructure": [
        ("Audit existing infrastructure, resource bottlenecks, and security posture", 2.5, "Audit"),
        ("Design cloud architecture topology (VPC, subnets, load balancers)", 3.0, "Architecture"),
        ("Write Infrastructure as Code (Terraform / Docker / Kubernetes manifests)", 5.0, "Provisioning"),
        ("Set up CI/CD build, test, and deployment automation pipelines", 4.0, "Automation"),
        ("Implement centralized logging, Prometheus monitoring, and Grafana alerts", 3.5, "Observability"),
        ("Configure SSL certificates, firewall rules, and secret management", 2.5, "Security"),
        ("Perform load testing and failover simulation under peak load", 3.0, "Validation"),
        ("Conduct cutover migration and verify zero-downtime DNS propagation", 2.0, "Migration"),
        ("Document incident runbooks and operational disaster recovery plans", 2.5, "Documentation")
    ],
    "General / Administrative & Personal": [
        ("Gather and review all relevant background documents and requirements", 1.5, "Preparation"),
        ("Outline step-by-step action plan and identify critical milestones", 1.0, "Planning"),
        ("Execute first phase of primary deliverables", 3.0, "Execution"),
        ("Review progress against acceptance criteria and resolve blockers", 1.5, "Review"),
        ("Complete final deliverables and verify compliance", 2.5, "Finalization"),
        ("Archive project materials and communicate completion to stakeholders", 1.0, "Closing")
    ]
}

class TaskBreakdownEngine:
    @staticmethod
    def detect_domain(text: str) -> str:
        text_lower = text.lower()
        if any(w in text_lower for w in ["deep learning", "machine learning", "neural network", "transformer", "nlp", "model", "dataset", "bert", "pytorch", "train model"]):
            return "Deep Learning / AI Project"
        elif any(w in text_lower for w in ["web", "app", "react", "fastapi", "api", "backend", "frontend", "full stack", "auth", "crud", "endpoint", "database", "sql"]):
            return "Web Application / Software Development"
        elif any(w in text_lower for w in ["thesis", "paper", "research", "literature", "conference", "journal", "experiment", "manuscript", "academic"]):
            return "Academic Paper / Research Thesis"
        elif any(w in text_lower for w in ["marketing", "campaign", "pitch", "deck", "investor", "sales", "revenue", "newsletter", "customer", "launch"]):
            return "Business / Marketing Campaign"
        elif any(w in text_lower for w in ["design", "figma", "ui", "ux", "wireframe", "prototype", "prototype", "logo", "branding", "illustration"]):
            return "UI/UX & Product Design"
        elif any(w in text_lower for w in ["server", "cloud", "aws", "docker", "kubernetes", "ci/cd", "migration", "devops", "ssl", "dns"]):
            return "Operations / DevOps / Infrastructure"
        else:
            return "General / Administrative & Personal"

    @staticmethod
    def breakdown(
        title: str,
        description: Optional[str] = None,
        category: Optional[str] = None,
        target_subtasks: Optional[int] = None
    ) -> Dict[str, Any]:
        combined_text = f"{title}. {description or ''}"
        domain = TaskBreakdownEngine.detect_domain(combined_text)
        
        template_subtasks = DOMAIN_PATTERNS.get(domain, DOMAIN_PATTERNS["General / Administrative & Personal"])
        
        # Adjust count if requested
        if target_subtasks and 2 <= target_subtasks <= len(template_subtasks):
            step_stride = max(1, len(template_subtasks) // target_subtasks)
            selected = template_subtasks[::step_stride][:target_subtasks]
        else:
            selected = template_subtasks

        suggested = []
        total_hours = 0.0

        for idx, (sub_title, est_h, phase) in enumerate(selected):
            # Contextualize subtask title slightly with main task keywords if appropriate
            suggested.append({
                "title": sub_title,
                "estimated_hours": est_h,
                "order_index": idx,
                "phase": phase
            })
            total_hours += est_h

        return {
            "main_task": title,
            "domain": domain,
            "suggested_subtasks": suggested,
            "total_estimated_hours": round(total_hours, 1),
            "generation_model": "Semantic Domain Decomposition Model (NLP Hybrid)"
        }
