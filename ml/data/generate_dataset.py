"""
Synthetic Dataset Generator for AI-Powered Task Prioritization & Deadline Risk Prediction

Generates a realistic, diverse, multi-domain dataset covering 6 categories with
EXACT class balance across High, Medium, and Low priorities:
1. Development (Software, microservices, databases, bugs, security, CI/CD, DevOps)
2. Academic & Research (Theses, papers, experiments, literature reviews, submissions)
3. Business & Marketing (Pitch decks, analytics, financial reviews, campaigns, client calls)
4. Design & Creative (UI/UX, wireframes, prototypes, brand identity, assets)
5. Operations & Admin (Taxes, compliance, migrations, renewals, sprint planning)
6. Personal & Health (Appointments, taxes, fitness, home maintenance, errands)
"""

import os
import json
import random

random.seed(42)

CATEGORIES = [
    "Development",
    "Academic & Research",
    "Business & Marketing",
    "Design & Creative",
    "Operations & Admin",
    "Personal & Health"
]

# (title, description, category, base_prio, base_urg, base_imp, base_dur, base_prox, base_risk)
HIGH_TEMPLATES = [
    ("Fix critical memory leak in authentication microservice", "Users report session crashes during peak traffic. Inspect heap dumps, close connection pools, and deploy hotfix.", "Development", "High", "Urgent", "High", 4.0, 0.4, "High"),
    ("Resolve critical SQL injection vulnerability in search endpoint", "Identified high severity vulnerability in raw SQL queries. Sanitize inputs and deploy parameterized queries immediately.", "Development", "High", "Urgent", "High", 2.5, 0.3, "High"),
    ("Fix critical production database connection leak by tonight", "The production database is down, affecting all customers. Restore service ASAP and patch the connection pool.", "Development", "High", "Urgent", "High", 3.0, 0.2, "High"),
    ("Investigate production 502 Bad Gateway alerts under heavy load", "Analyze Nginx logs, tune Gunicorn worker processes, and increase backend connection backlog.", "Development", "High", "Urgent", "High", 4.5, 0.4, "High"),
    ("Deploy critical security patch to production Kubernetes cluster", "Build hotfix Docker images, run rolling restart, and verify pod health checks immediately.", "Development", "High", "Urgent", "High", 2.0, 0.5, "High"),
    ("Submit camera-ready paper for Deep Learning conference", "Incorporate reviewer comments, format IEEE LaTeX template, check page limits, and generate final PDF before midnight.", "Academic & Research", "High", "Urgent", "High", 8.0, 0.6, "High"),
    ("Prepare presentation slides for thesis defense committee tomorrow", "Outline research motivation, model architecture diagrams, experimental evaluation tables, and rehearsed defense.", "Academic & Research", "High", "Urgent", "High", 9.0, 0.8, "High"),
    ("Submit urgent grant proposal before institutional deadline", "Compile budget breakdown, project milestones, principal investigator signatures, and upload PDF.", "Academic & Research", "High", "Urgent", "High", 6.0, 0.5, "High"),
    ("Finalize investor pitch deck for Series A fundraising round", "Update traction metrics, MRR growth charts, unit economics, competitor matrix, and executive summary before investor meeting.", "Business & Marketing", "High", "Urgent", "High", 10.0, 0.7, "High"),
    ("Prepare Q3 financial revenue projections and cash runway model", "Input updated payroll expenses, hosting costs, sales pipeline, and emergency runway forecast.", "Business & Marketing", "High", "Urgent", "High", 7.0, 0.8, "High"),
    ("Coordinate urgent client onboarding kickoff for enterprise customer", "Set up project Slack channel, share production credentials, and resolve integration blockers.", "Business & Marketing", "High", "Urgent", "High", 3.0, 0.4, "High"),
    ("Build clickable interactive prototype for client demo tomorrow morning", "Link Figma frames, animate transitions, set up test scenarios, and share preview link with executives.", "Design & Creative", "High", "Urgent", "High", 6.0, 0.7, "High"),
    ("Create promotional banner assets for upcoming product launch", "Design OG image cards, social headers, and animated GIF demonstrations before release.", "Design & Creative", "High", "Urgent", "High", 4.0, 0.8, "High"),
    ("File annual corporate tax returns and payroll compliance documentation", "Review balance sheet, compile deductible expenses, obtain accountant signatures, and submit before statutory deadline.", "Operations & Admin", "High", "Urgent", "High", 10.0, 0.6, "High"),
    ("Renew expiring SSL certificates and DNS reverse proxy records", "Verify auto-renewal settings on DNS providers, update wildcard SSL certificates to prevent outage.", "Operations & Admin", "High", "Urgent", "High", 2.0, 0.4, "High"),
    ("Migrate company email domains and DNS records to Google Workspace", "Configure MX, SPF, DKIM, and DMARC authentication records to prevent corporate email delivery failure.", "Operations & Admin", "High", "Urgent", "High", 4.0, 0.8, "High"),
    ("Pay quarterly property tax installment and home insurance policy", "Log in to municipal tax portal, verify assessed amount, and schedule immediate bank transfer.", "Personal & Health", "High", "Urgent", "High", 1.0, 0.4, "High"),
    ("Renew driver's license and vehicle registration before end of month", "Complete online DMV application form, upload proof of residency, and pay renewal fees before expiration.", "Personal & Health", "High", "Urgent", "High", 1.5, 0.8, "High"),
]

MEDIUM_TEMPLATES = [
    ("Implement OAuth2 social login with Google and GitHub", "Add third-party authentication buttons, handle callback tokens, and update user registration workflow for next sprint.", "Development", "Medium", "Moderate", "Medium", 8.0, 3.5, "Low"),
    ("Refactor legacy billing database queries", "Optimize slow JOIN queries on invoice items and add missing composite indexes to reduce latency.", "Development", "Medium", "Moderate", "Medium", 5.0, 3.0, "Low"),
    ("Migrate user sessions from local memory cache to Redis cluster", "Configure Redis cluster nodes, implement connection retry logic, and add telemetry for hit/miss ratio.", "Development", "Medium", "Moderate", "Medium", 10.0, 4.0, "Medium"),
    ("Build real-time WebSocket notifications service for collaborative editing", "Implement socket connection manager, broadcast room events, and handle client reconnect states.", "Development", "Medium", "Moderate", "Medium", 12.0, 4.5, "Medium"),
    ("Set up CI/CD pipeline with GitHub Actions for automated linting and testing", "Configure YAML workflows, cache dependencies, and configure Slack alerts on build failures.", "Development", "Medium", "Moderate", "Medium", 4.0, 3.0, "Low"),
    ("Write developer API documentation for external webhook integration", "Document request payloads, response headers, status codes, and error formats with code snippets.", "Development", "Medium", "Moderate", "Medium", 4.0, 3.5, "Low"),
    ("Review and approve team pull requests for upcoming sprint release", "Review backend PRs, verify test coverage, and merge approved changes.", "Development", "Medium", "Moderate", "Medium", 3.0, 2.0, "Low"),
    ("Conduct literature review on Transformer self-attention mechanisms", "Read and annotate 15 recent papers on sparse attention and linear transformers, synthesize comparative notes.", "Academic & Research", "Medium", "Moderate", "Medium", 12.0, 4.5, "Low"),
    ("Preprocess benchmark dataset for multilingual NLP experiments", "Clean raw text files, remove HTML artifacts, tokenize with BPE tokenizer, and split into train/val/test.", "Academic & Research", "Medium", "Moderate", "Medium", 6.0, 3.0, "Low"),
    ("Run 5-fold cross-validation benchmarks on GPU cluster", "Execute hyperparameter sweep script across learning rates and record macro F1-scores.", "Academic & Research", "Medium", "Moderate", "Medium", 14.0, 4.0, "Medium"),
    ("Review and summarize peer-review feedback on submitted manuscript", "Categorize comments, draft author rebuttal responses, and mark necessary revisions.", "Academic & Research", "Medium", "Moderate", "Medium", 6.0, 3.5, "Low"),
    ("Prepare quarterly sprint presentation and slide deck", "Draft presentation slides, format diagrams, and rehearse project demonstration.", "Academic & Research", "Medium", "Moderate", "Medium", 4.0, 2.5, "Low"),
    ("Draft quarterly marketing performance review report", "Analyze Google Analytics conversions, customer acquisition cost (CAC), ROI on ad spend, and channel attribution.", "Business & Marketing", "Medium", "Moderate", "Medium", 6.0, 3.0, "Low"),
    ("Send email newsletter to product subscribers", "Write copy, include link to new release changelog, test preview on mobile, and schedule broadcast.", "Business & Marketing", "Medium", "Moderate", "Medium", 3.0, 2.0, "Low"),
    ("Conduct user interviews with 5 churned enterprise accounts", "Schedule discovery calls, ask open-ended questions regarding feature gaps, and summarize pain points.", "Business & Marketing", "Medium", "Moderate", "Medium", 8.0, 4.0, "Medium"),
    ("Update company pricing page with new tier options", "Draft tier comparison matrix, calculate annual discount savings, and align feature list with product team.", "Business & Marketing", "Medium", "Moderate", "Medium", 4.0, 3.5, "Low"),
    ("Design high-fidelity UI wireframes for mobile dashboard overhaul", "Create Figma components with responsive auto-layout, interactive hover states, and clear hierarchy.", "Design & Creative", "Medium", "Moderate", "Medium", 12.0, 3.5, "Medium"),
    ("Create responsive icon set and illustrations for landing page", "Export scalable SVG icons in 24px and 32px grids with consistent stroke weights.", "Design & Creative", "Medium", "Moderate", "Medium", 6.0, 4.0, "Low"),
    ("Conduct heuristic usability audit of checkout flow", "Identify friction points, confusing error messages, and cognitive overload on payment screens.", "Design & Creative", "Medium", "Moderate", "Medium", 5.0, 3.0, "Low"),
    ("Record and edit 60-second product demo walkthrough video", "Record screen capture in 4K, add captions, smooth cursor movements, and export web-optimized MP4.", "Design & Creative", "Medium", "Moderate", "Medium", 6.0, 3.5, "Low"),
    ("Organize quarterly team sprint planning and retrospective meeting", "Gather feedback on sprint blockers, calculate team velocity, and prioritize product backlog items.", "Operations & Admin", "Medium", "Moderate", "Medium", 4.0, 2.5, "Low"),
    ("Conduct annual security and access permission audit across AWS and GitHub", "Revoke inactive developer credentials, enforce MFA on all accounts, and review audit logs.", "Operations & Admin", "Medium", "Moderate", "Medium", 5.0, 4.0, "Low"),
    ("Review vendor contract renewal terms and negotiate annual volume discount", "Evaluate usage analytics, schedule negotiation call with sales rep, and request updated quote.", "Operations & Admin", "Medium", "Moderate", "Medium", 3.5, 4.0, "Low"),
    ("Schedule comprehensive annual medical health checkup and blood tests", "Call clinic receptionist, book appointment for next available slot, and note fasting requirements.", "Personal & Health", "Medium", "Moderate", "Medium", 1.0, 3.0, "Low"),
    ("Complete 45-minute strength training workout and stretch routine", "Focus on compound barbell lifts, mobility drills, and hydrate adequately.", "Personal & Health", "Medium", "Moderate", "Medium", 1.0, 1.5, "Low"),
    ("Book flight tickets and accommodation for upcoming family vacation", "Compare airline flight timings, review hotel cancellation policies, and confirm booking reservations.", "Personal & Health", "Medium", "Moderate", "Medium", 3.5, 5.0, "Low"),
]

LOW_TEMPLATES = [
    ("Update outdated frontend npm dependencies and resolve audit warnings", "Upgrade packages, test for minor style regressions, and verify component builds when time permits.", "Development", "Low", "Flexible", "Low", 3.0, 8.0, "Low"),
    ("Fix minor button alignment glitch in mobile navigation header", "Adjust flexbox styles and padding on screens narrower than 480px when convenient.", "Development", "Low", "Flexible", "Low", 1.0, 10.0, "Low"),
    ("Clean up unused feature flags and legacy API endpoints", "Remove deprecated v1 controllers, dead routes, and unused configuration flags from the codebase.", "Development", "Low", "Flexible", "Low", 2.0, 12.0, "Low"),
    ("Add dark mode toggle theme to user settings", "Configure CSS custom variables, add theme provider context in React, and persist preference to storage.", "Development", "Low", "Flexible", "Low", 4.0, 9.0, "Low"),
    ("Format references and bibliography in BibTeX", "Verify citation keys, author names, and publication venues for all cited works in the manuscript.", "Academic & Research", "Low", "Flexible", "Low", 2.5, 8.0, "Low"),
    ("Organize research lab meeting agenda and paper presentation notes", "Select paper for weekly discussion and send meeting invite to research group.", "Academic & Research", "Low", "Flexible", "Low", 1.5, 7.0, "Low"),
    ("Archive experimental log files and model checkpoints to cold storage", "Compress tensorboard runs, remove intermediate epoch weights, and upload to cloud bucket.", "Academic & Research", "Low", "Flexible", "Low", 2.0, 12.0, "Low"),
    ("Brainstorm social media content calendar for next month", "Create list of 20 engaging tweet threads, LinkedIn thought leadership posts, and product teasers.", "Business & Marketing", "Low", "Flexible", "Low", 3.0, 10.0, "Low"),
    ("Write SEO blog post on best productivity practices for remote teams", "Target high volume keywords, structure with clear subheadings, and include workflow tips.", "Business & Marketing", "Low", "Flexible", "Low", 5.0, 9.0, "Low"),
    ("Review and approve influencer sponsorship agreements", "Verify deliverables, payment terms, exclusivity clauses, and FTC compliance disclosure requirements.", "Business & Marketing", "Low", "Flexible", "Low", 2.0, 7.0, "Low"),
    ("Design brand identity style guide and color tokens", "Document primary and secondary palettes, accessible contrast ratios, font pairings, and logo rules.", "Design & Creative", "Low", "Flexible", "Low", 8.0, 9.0, "Low"),
    ("Update design system component library in Figma", "Consolidate duplicate button variants, update modal sheet components, and publish updated library.", "Design & Creative", "Low", "Flexible", "Low", 4.0, 12.0, "Low"),
    ("Export social media avatar illustrations and stickers", "Render PNG assets in multiple resolutions for team Slack and community forum profiles.", "Design & Creative", "Low", "Flexible", "Low", 2.0, 8.0, "Low"),
    ("Update employee handbook with remote work and equipment expense policies", "Draft updated guidelines, align with legal requirements, and circulate PDF to team.", "Operations & Admin", "Low", "Flexible", "Low", 3.0, 10.0, "Low"),
    ("Order new ergonomic office chairs and monitor arms for coworking space", "Compare vendor quotes, verify shipping timelines, and submit invoice for approval.", "Operations & Admin", "Low", "Flexible", "Low", 1.5, 8.0, "Low"),
    ("Plan weekly healthy meal prep recipes and grocery shopping list", "Select balanced dinner recipes, inventory pantry ingredients, and place online grocery order.", "Personal & Health", "Low", "Flexible", "Low", 2.0, 6.0, "Low"),
    ("Organize home office workspace and archive physical tax receipts", "Sort paper documents into labeled folders, shred unnecessary records, and tidy desk cables.", "Personal & Health", "Low", "Flexible", "Low", 3.0, 14.0, "Low"),
    ("Optional: Research new keyboard shortcuts and clean up desktop icons", "Whenever possible, organize desktop folders and read exploratory productivity blog posts.", "Personal & Health", "Low", "Flexible", "Low", 1.0, 14.0, "Low"),
    ("Optional productivity app research and setup", "Explore new task management extensions and customize notification settings whenever possible.", "Personal & Health", "Low", "Flexible", "Low", 1.0, 12.0, "Low"),
]

HIGH_VARIATIONS = [
    ("Urgent: {title}", "Please resolve this emergency immediately. {desc}", 1.1, 0.4),
    ("Critical: {title}", "High severity blocking issue requiring immediate action. {desc}", 1.0, 0.3),
    ("ASAP: {title}", "Need this resolved today before end of day. {desc}", 1.0, 0.4),
    ("Due Today: {title}", "Critical milestone due by end of day. {desc}", 0.9, 0.3),
    ("Emergency: {title}", "Immediate blocker for production deployment. {desc}", 1.1, 0.2),
]

MEDIUM_VARIATIONS = [
    ("Prepare {title}", "Standard workflow deliverable for current sprint. {desc}", 1.0, 2.5),
    ("Review: {title}", "Review and coordinate with team members this week. {desc}", 0.9, 3.0),
    ("Draft {title}", "Create initial draft and iterate with stakeholders. {desc}", 1.0, 3.5),
    ("Coordinate {title}", "Schedule and align milestones with the team. {desc}", 1.0, 4.0),
    ("Standard: {title}", "Regular scheduled task for upcoming sprint cycle. {desc}", 1.0, 3.0),
    ("{title} (By End of Week)", "Important deliverable for current sprint schedule. {desc}", 1.0, 3.5),
]

LOW_VARIATIONS = [
    ("Optional: {title}", "Low priority exploratory item if time permits. {desc}", 0.8, 8.0),
    ("Backlog: {title}", "Nice to have when schedule clears. {desc}", 0.7, 10.0),
    ("Whenever possible: {title}", "No rush, exploratory backlog item. {desc}", 0.7, 12.0),
    ("Low priority: {title}", "Non-critical routine maintenance task. {desc}", 0.8, 9.0),
    ("Explore: {title}", "Self-directed research item for future reference. {desc}", 0.9, 14.0),
]

def generate_samples_for_class(templates, variations, target_priority, target_urgency, target_importance, count):
    samples = []
    while len(samples) < count:
        base_t, base_d, cat, _, _, _, base_dur, base_prox, _ = random.choice(templates)
        
        if random.random() < 0.6:
            var_t_fmt, var_d_fmt, dur_mult, prox_mult = random.choice(variations)
            title = var_t_fmt.format(title=base_t)
            desc = var_d_fmt.format(desc=base_d, title=base_t)
        else:
            title = base_t
            desc = base_d
            dur_mult = 1.0
            prox_mult = 1.0

        dur = max(0.5, round(base_dur * dur_mult * random.uniform(0.9, 1.15), 1))
        
        if target_priority == "High":
            prox = max(0.1, round(random.uniform(0.1, 1.2), 1))
            risk = "High" if dur / (prox * 24.0) > 0.25 else "Medium"
        elif target_priority == "Medium":
            prox = max(1.5, round(random.uniform(1.8, 5.0), 1))
            risk = "Medium" if dur / (prox * 24.0) > 0.15 else "Low"
        else: # Low
            prox = max(5.5, round(random.uniform(6.0, 14.0), 1))
            risk = "Low"

        text_content = f"{title}. {desc}".strip()

        samples.append({
            "task_title": title,
            "task_description": desc,
            "category": cat,
            "priority_label": target_priority,
            "urgency_label": target_urgency,
            "importance_label": target_importance,
            "estimated_duration_hours": dur,
            "deadline_proximity_days": prox,
            "risk_label": risk,
            "text_content": text_content
        })
    return samples

def main():
    output_dir = os.path.dirname(os.path.abspath(__file__))
    os.makedirs(output_dir, exist_ok=True)

    TARGET_PER_CLASS = 700 # Exactly 700 High, 700 Medium, 700 Low = 2,100 Total

    high_samples = generate_samples_for_class(HIGH_TEMPLATES, HIGH_VARIATIONS, "High", "Urgent", "High", TARGET_PER_CLASS)
    med_samples = generate_samples_for_class(MEDIUM_TEMPLATES, MEDIUM_VARIATIONS, "Medium", "Moderate", "Medium", TARGET_PER_CLASS)
    low_samples = generate_samples_for_class(LOW_TEMPLATES, LOW_VARIATIONS, "Low", "Flexible", "Low", TARGET_PER_CLASS)

    all_samples = high_samples + med_samples + low_samples
    random.shuffle(all_samples)
    total = len(all_samples)

    train_end = int(total * 0.70)
    val_end = int(total * 0.85)

    train_set = all_samples[:train_end]
    val_set = all_samples[train_end:val_end]
    test_set = all_samples[val_end:]

    def save_jsonl(filename, data):
        filepath = os.path.join(output_dir, filename)
        with open(filepath, "w", encoding="utf-8") as f:
            for record in data:
                f.write(json.dumps(record) + "\n")
        print(f"Saved {len(data)} records to {filepath}")

    save_jsonl("train.jsonl", train_set)
    save_jsonl("val.jsonl", val_set)
    save_jsonl("test.jsonl", test_set)

    prio_counts = {}
    cat_counts = {}
    for s in all_samples:
        p = s["priority_label"]
        c = s["category"]
        prio_counts[p] = prio_counts.get(p, 0) + 1
        cat_counts[c] = cat_counts.get(c, 0) + 1

    print("\n--- Balanced Dataset Generation Summary ---")
    print(f"Total samples generated: {total}")
    print(f"Train samples: {len(train_set)}")
    print(f"Val samples:   {len(val_set)}")
    print(f"Test samples:  {len(test_set)}")
    print(f"Priority distribution (Exact 1:1:1 Balance): {prio_counts}")
    print(f"Category distribution: {cat_counts}")

if __name__ == "__main__":
    main()
