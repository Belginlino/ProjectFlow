# AI Specification

## Principle
AI is an assistant over project evidence, not the authority.

## Features

### Evidence-grounded summary
Summarize requirements, tasks, evidence, reviews and health findings with evidence references.

### Feedback-to-change-request
Convert mentor feedback into a suggested change request. Human approval required.

### Evidence-grounded viva
Generate questions from the student's real requirements, artifacts, decisions, tests and reviews. Store source evidence.

### Missing-evidence explanation
Summarize deterministic findings such as implemented requirements without tests.

### Reflection assistance
Generate prompts, never fabricate student experiences.

## Grounding rules
- Retrieve project evidence first.
- Reference evidence IDs in UI.
- Never invent project facts.
- Separate evidence from inference.
- Show uncertainty.
- Require human approval for consequential decisions.

## Prohibited uses
Do not automatically grade students, make academic eligibility decisions, infer sensitive traits or create punitive alerts without human review.

## Audit
Store model/provider, prompt version, source evidence IDs, output, reviewer, approval and timestamp.
