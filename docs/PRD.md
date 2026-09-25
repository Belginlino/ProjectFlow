# ProjectFlow — Product Requirements Document

**Version:** 1.0

## 1. Problem
University project platforms commonly manage projects, tasks, milestones and evaluations. The remaining problem is connecting day-to-day project work with verifiable evidence of contribution, mentor feedback, revisions, learning and final evaluation.

## 2. Vision
ProjectFlow is an evidence-centered academic project operating system that turns project activity into connected, verifiable evidence for mentorship, contribution assessment, evaluation and learning outcomes.

## 3. Users
- **Student:** proposal, work, evidence, reflection, viva.
- **Team Lead:** project coordination and dependencies.
- **Mentor/Faculty:** review, feedback, milestone approval and health monitoring.
- **Evaluator:** evidence-backed rubric and viva evaluation.
- **Department Admin:** rubrics, outcomes, project cycles and reports.
- **Institution Admin:** organization configuration, permissions and audit.

## 4. Goals
- Track the complete academic project lifecycle.
- Make evidence a first-class entity.
- Connect requirements to actual evidence.
- Support evidence-backed individual contribution.
- Convert mentor feedback into traceable change requests.
- Explain project risks using observable evidence.
- Connect evaluation criteria to evidence.
- Generate viva questions from verified project work.
- Support configurable CO/PO/PSO mapping.
- Produce reusable evidence portfolios.

## 5. Non-goals for MVP
- Full LMS replacement
- Video conferencing
- Social network
- Student leaderboard
- Automatic final grading
- AI plagiarism detector
- Blockchain
- Complex predictive ML
- Native mobile app
- Full ERP replacement

## 6. Golden Path
Idea → Team → Proposal → Requirements → Tasks → Evidence → Mentor Review → Change Request → Revision → Health Alert → Contribution → Viva → Evaluation → Learning Outcome

## 7. Functional Requirements

### FR-01 Authentication and roles
Login/logout, role-based access, project/institution scoping and demo roles.

### FR-02 Project lifecycle
Proposal → Approval → Active → Review → Completed → Archived.

### FR-03 Team management
Create teams, invite members, assign roles and view evidence by member.

### FR-04 Requirements
Title, description, priority, status, acceptance criteria, owner, linked tasks and evidence.

### FR-05 Tasks
Assignment, priority, status, due date, dependencies, requirement link and evidence.

### FR-06 Evidence
Evidence types: code/PR, document, screenshot, test, design, dataset, demo, review record, reflection and external link.

Each evidence item stores owner, source, description, links, verification status, reviewer and history.

### FR-07 Mentor review
Review queue, evidence inspection, comments, approve/reject/request changes and review history.

### FR-08 Change requests
Create from feedback, assign owner, due date, required evidence, revision and verification.

### FR-09 Project health
Explainable rules for overdue work, blocked dependencies, approaching milestones, missing evidence, unresolved feedback, stale activity and missing testing.

Every alert must show its reason and supporting evidence.

### FR-10 Contribution
Combine verified tasks, artifacts, reviews, decisions, mentor observation, reflection and viva. Never use task count alone.

### FR-11 Evaluation
Configurable rubrics, criteria, scores, evidence links, comments, evaluator and versioned assessment.

### FR-12 Why this score?
Every score should be traceable to requirements, tasks, evidence, reviews, revisions and viva.

### FR-13 Viva
Generate questions from verified project evidence. Store source evidence, student answer and evaluator notes.

### FR-14 Outcomes
Skills, CO, PO, PSO, evidence mapping and reflection. Mappings are institution-configurable.

## 8. MVP screens
1. Login/Demo Roles
2. Project Dashboard
3. Proposal & Team
4. Requirements
5. Task Board
6. Evidence Drawer
7. Mentor Review Inbox
8. Project Health
9. Contribution & Viva
10. Evaluation & Outcome

## 9. Success metrics
- % requirements with evidence
- % evidence verified
- mentor review turnaround
- % feedback converted to completed change requests
- % evaluated criteria with supporting evidence
- missing-evidence issues resolved
- reflection completion rate

## 10. Acceptance principle
A feature is complete only when it works across the lifecycle and leaves traceable evidence.
