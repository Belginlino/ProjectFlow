# ProjectFlow — Stronger, Simpler, Product-Ready Specification

## 1. Product Vision

**ProjectFlow is an academic project lifecycle platform that creates a verifiable chain from a student's work to their final evaluation.**

### Tagline

> **Turn project work into verified evidence.**

### Core promise

ProjectFlow should make academic projects:

- Easy to start
- Easy to manage
- Easy to prove
- Easy for mentors to verify
- Easy for evaluators to understand
- Useful for students after graduation

The product must not feel like a collection of unrelated modules.

The main journey should be:

```text
Idea
→ Project
→ Team
→ Mentor Approval
→ Requirements
→ Tasks
→ Development
→ GitHub
→ Evidence
→ Mentor Verification
→ Contribution Evidence
→ Viva
→ Evaluation
→ Learning Outcomes
→ Verified Portfolio
```

---

## 2. Product Philosophy

ProjectFlow should follow:

# Work → Evidence → Verification → Learning

The system should answer four questions:

1. What are we building?
2. What work has actually been completed?
3. What evidence proves that work?
4. Who verified it and how does it contribute to evaluation and learning?

ProjectFlow should not become another generic Jira/Trello-style project management application.

The differentiator is the academic evidence and verification chain.

---

## 3. Core Differentiator

### Project Evidence Chain

The application should connect:

```text
Requirement
   ↓
Task
   ↓
Developer
   ↓
GitHub Commit / PR
   ↓
Test / Artifact
   ↓
Evidence
   ↓
Mentor Review
   ↓
Change Request
   ↓
Revision
   ↓
Verification
   ↓
Contribution Evidence
   ↓
Viva
   ↓
Evaluation
```

Use this positioning:

> **ProjectFlow connects academic work to evidence, mentor verification, contribution evidence, viva, and final evaluation as one continuous lifecycle.**

Do not claim that conventional project-management tools cannot manage individual features. The differentiation is the connected academic evidence lifecycle.

---

# 4. Primary User Roles

## Student

The student should be able to:

- Create projects
- Create/manage teams
- Become Project Lead
- Select a mentor
- Track mentor approval
- Define requirements
- Manage tasks
- Connect GitHub
- Submit evidence
- Respond to change requests
- View verified contribution
- Prepare for viva
- View evaluation
- Build a verified portfolio

## Mentor

The mentor should be able to:

- Receive project requests
- Accept/reject projects
- View assigned projects
- Review requirements
- Review evidence
- Create change requests
- Verify revisions
- Monitor project health
- Review student contribution
- Track student progress

## Evaluator

The evaluator should be able to:

- View assigned projects
- Understand project context quickly
- Inspect verified evidence
- Review contribution
- Conduct evidence-grounded viva
- Evaluate using a rubric
- Understand the evidence supporting each evaluation criterion

## Institution/Admin

The admin should be able to:

- Manage students
- Manage mentors
- Manage evaluators
- Manage departments
- Manage projects
- Control mentor assignments
- Configure rubrics
- Configure learning outcomes
- Monitor institutional project progress
- Access audit records
- Generate reports

---

# 5. Golden User Journey

This must become the main product journey.

## Step 1 — Student Creates Project

Student enters:

- Project title
- Problem statement
- Description
- Domain
- Expected outcome
- Team

Initial state:

```text
DRAFT
```

The project is not formally active yet.

---

# 6. Step 2 — Create Team

The Project Lead creates the team.

Each member should have:

- Name
- Institution
- Department
- Project role

Example:

```text
Belgin  → Full Stack Lead
Arun    → Backend Developer
Priya   → UI/UX & Frontend
Rahul   → Testing & Documentation
```

The Project Lead must be clearly visible.

---

# 7. Step 3 — Mentor Selection

Only mentors from the same institution should be selectable.

Required validation:

```text
student.institutionId === mentor.institutionId
```

This must be enforced by backend/database security as well as frontend filtering.

### Mentor Request

The student submits:

- Mentor
- Request message
- Project summary

Project status:

```text
MENTOR_PENDING
```

---

# 8. Step 4 — Mentor Approval Gate

The mentor receives the request.

Actions:

```text
ACCEPT
REJECT
```

### Accepted

```text
MENTOR_PENDING
        ↓
MENTOR_APPROVED
        ↓
ACTIVE
```

The accepted mentor becomes the official project mentor.

### Rejected

```text
MENTOR_PENDING
        ↓
MENTOR_REJECTED
        ↓
SELECT ANOTHER MENTOR
        ↓
MENTOR_PENDING
```

Students should not repeatedly manually assign mentors after approval.

---

# 9. Project Control Center

The **Project Control Center** should become the most important screen.

Instead of forcing users to navigate through many disconnected modules, provide one project-level workspace.

### Header

Show:

- Project name
- Project status
- Project Lead
- Mentor
- Team
- Overall progress

### Current Stage

Example:

```text
Current Stage
Evidence Verification
```

### Next Action

This is critical.

The system should tell the user exactly what needs to happen next.

Examples:

**Student**

> Submit evidence for Sensor Ingestion API.

**Mentor**

> Review 3 pending evidence submissions.

**Evaluator**

> Conduct viva for Smart Campus Energy Monitoring Platform.

**Admin**

> 4 projects are waiting for mentor assignment.

---

# 10. Attention Center

Do not force users to inspect every module.

Show:

## Needs Attention

Example:

```text
⚠ Evidence missing
Sensor Ingestion API

⚠ Mentor review pending
Energy Analytics

⚠ Change request overdue
PDF Export

✓ Authentication verified
```

Every item should be clickable.

The dashboard should be action-oriented rather than just a reporting dashboard.

---

# 11. Simplified Navigation

Avoid showing every feature in the main sidebar.

## Student

```text
Home
My Projects
My Tasks
Evidence
GitHub
Mentor
Health
Contribution
Portfolio
```

## Mentor

```text
Home
Mentor Requests
My Projects
Evidence Reviews
Change Requests
Student Progress
Health
Contribution
```

## Evaluator

```text
Home
Assigned Projects
Evidence
Contribution
Viva
Evaluation
```

## Admin

```text
Home
Institution
Students
Mentors
Evaluators
Projects
Mentor Assignments
Rubrics
Learning Outcomes
Analytics
Audit
```

---

# 12. Evidence Passport

Introduce a simple user-facing concept:

## Evidence Passport

Every important piece of work should have an evidence passport.

Example:

```text
Requirement:
Sensor Ingestion API

Task:
Implement sensor data endpoint

Developer:
Belgin

GitHub:
PR #42

Tests:
18 passed

Evidence:
API test screenshot + response artifact

Mentor Review:
Approved

Change Requests:
CR-01 → Resolved

Verification:
Verified by Mentor

Contribution:
Verified
```

The Evidence Passport should make the evidence chain understandable without requiring users to understand the technical term "Evidence Graph".

---

# 13. Evidence Graph

The Evidence Graph should remain the underlying technical engine.

Do not force normal users to understand graph terminology.

Instead of only:

> Open Evidence Graph

provide a user-friendly action:

> **Why is this work verified?**

Then show:

```text
Requirement
   ↓
Task
   ↓
GitHub PR
   ↓
Test Evidence
   ↓
Mentor Review
   ↓
Verification
```

The graph is the technical engine.

The explanation is the user experience.

---

# 14. GitHub Integration

Position GitHub as:

> **Proof of Development**

Not merely:

> GitHub Integration

Useful GitHub evidence includes:

- Repository
- Branch
- Commit
- Pull Request
- Author
- Review
- Changed files
- Tests
- Merge status

The goal is not to judge students from raw GitHub activity.

The goal is to connect actual development work to requirements and evidence.

---

# 15. Contribution Evidence

Avoid making contribution feel like a mysterious percentage.

Use:

## Contribution Evidence

Example:

```text
Verified PRs             8
Reviewed PRs             5
Testing Evidence         4
Documentation            3
Design Contributions     2
Mentor Verification      6
Viva Evidence            3
```

Every contribution item should explain how it was verified.

Do not display unsupported contribution scores.

---

# 16. Mentor Review

For each evidence submission:

```text
Evidence
↓
Review
```

Actions:

```text
Approve
Request Changes
Reject
```

If requesting changes, require:

- Issue
- Expected correction
- Priority
- Optional deadline

Example:

```text
CR-01

Issue:
API documentation does not contain error responses.

Required Change:
Add 400 and 500 response examples.

Status:
OPEN
```

---

# 17. Change Request Workflow

Use one consistent lifecycle:

```text
OPEN
↓
IN_PROGRESS
↓
SUBMITTED
↓
VERIFIED
```

Alternative path:

```text
OPEN
↓
REJECTED
↓
REVISED
↓
SUBMITTED
↓
VERIFIED
```

Every change request must remain connected to its original evidence.

---

# 18. Project Health

Project Health should not be only charts.

It must answer:

```text
What is wrong?
Why is it happening?
What should I do next?
```

Example:

### Problem

> Sensor Ingestion API has been marked complete but has no verified evidence.

### Cause

> Task completed without an evidence submission.

### Action

> Submit API test evidence and request mentor verification.

---

# 19. Health Rules

Health can detect:

- Missing evidence
- Overdue tasks
- Overdue change requests
- Blocked dependencies
- Untested implementation
- Mentor review pending
- Requirement without tasks
- Completed task without evidence
- Evidence without verification

Every alert should contain:

```text
Severity
Root Cause
Linked Requirement
Linked Task
Recommended Action
```

---

# 20. Evaluator Workspace

The evaluator should not manually explore the whole application.

Provide:

```text
Project Summary
↓
Requirements
↓
Verified Evidence
↓
Contribution Evidence
↓
Mentor Verification
↓
Viva
↓
Rubric
↓
Final Evaluation
```

The evaluator should understand the project quickly.

---

# 21. Evidence-Grounded Viva

Viva questions should be generated from actual project evidence.

Example:

```text
Evidence:
Sensor API PR #42

Question:
Why did you choose this API structure?

Supporting Evidence:
PR #42
Architecture documentation
Test results
```

Questions must remain connected to actual project work.

Do not create generic questions disconnected from evidence.

---

# 22. "Why This Score?" Feature

This should be one of the strongest demonstration features.

For each evaluation criterion, show the supporting evidence.

Example:

```text
Criterion:
Implementation Quality

Why?

✓ Requirement completed
✓ Task completed
✓ GitHub PR verified
✓ Tests passed
✓ Mentor verified
✓ Viva response demonstrated understanding
```

The evaluator remains responsible for the evaluation.

ProjectFlow provides the evidence trail.

---

# 23. AI Rules

Use AI only where it provides clear workflow value.

Good uses:

- Acceptance criteria suggestions
- Task breakdown suggestions
- Project health explanations
- Evidence-grounded viva questions
- Evidence summaries
- Evaluation evidence summaries

Avoid:

- Generic AI chatbot everywhere
- Fake AI features
- AI-generated grading without human control
- AI-generated contribution scores without evidence
- Unexplainable AI decisions

### AI Principle

> **AI assists. Evidence supports. Humans decide.**

---

# 24. Learning Outcomes

Learning outcomes should be downstream of verified work.

Use:

```text
Project Work
↓
Evidence
↓
Verification
↓
Contribution
↓
Evaluation
↓
Learning Outcomes
```

Students should not have to manually maintain duplicate learning-outcome information unnecessarily.

---

# 25. Verified Portfolio

The portfolio should be an output of ProjectFlow.

A verified portfolio item can contain:

```text
Project
↓
Role
↓
Requirements
↓
Verified Contributions
↓
Evidence
↓
Mentor Verification
↓
Skills / Outcomes
```

Students should not need to manually recreate every verified achievement.

---

# 26. Project Lifecycle States

Use one consistent lifecycle:

```text
DRAFT
↓
MENTOR_PENDING
↓
MENTOR_APPROVED
↓
ACTIVE
↓
IN_PROGRESS
↓
MENTOR_REVIEW
↓
REVISION_REQUIRED
↓
VERIFIED
↓
EVALUATION
↓
COMPLETED
```

Rejection path:

```text
MENTOR_PENDING
↓
MENTOR_REJECTED
↓
SELECT_ANOTHER_MENTOR
↓
MENTOR_PENDING
```

The current lifecycle state must always be visible.

---

# 27. Project Timeline

Every project should have a visible timeline:

```text
✓ Project Created
✓ Team Created
✓ Mentor Approved
✓ Requirements Defined
✓ Tasks Created
✓ GitHub Connected
✓ Evidence Submitted
● Mentor Verification
○ Viva
○ Evaluation
○ Portfolio
```

This makes the system easy to understand.

---

# 28. Notifications

Notifications should be actionable.

Examples:

```text
Mentor accepted your project request.

Mentor requested changes for Evidence #12.

Your evidence has been verified.

3 tasks have no evidence.

Viva has been assigned.

Evaluation is completed.
```

Avoid unnecessary notifications.

---

# 29. Search

Global search should cover:

- Projects
- Requirements
- Tasks
- Evidence
- Change requests
- Team members
- Mentors

Search results should include context.

Example:

```text
Sensor Ingestion API
Requirement
Project: Smart Campus Energy
Status: Verified
```

---

# 30. UX Rules

## Rule 1 — One primary action per screen

Do not overwhelm users with many equal buttons.

## Rule 2 — Always show context

When viewing evidence, show:

```text
Project
Requirement
Task
Student
Mentor
```

## Rule 3 — Always show status

Use clear states:

```text
Pending
In Progress
Needs Changes
Verified
Rejected
Completed
```

## Rule 4 — Use human language

Prefer:

> Submit Evidence

instead of:

> Create Evidence Node

## Rule 5 — Reduce navigation

Important actions should be reachable in one or two clicks.

## Rule 6 — Preserve history

Important changes must remain auditable.

---

# 31. Empty States

Never show blank screens.

Bad:

> No evidence.

Better:

> No evidence submitted yet.
>
> Submit evidence for completed tasks so your mentor can verify your work.

Button:

**Submit Evidence**

---

# 32. Loading and Error States

Every asynchronous operation must have:

- Loading state
- Success state
- Error state
- Retry option

Example:

```text
Uploading evidence...

✓ Evidence uploaded successfully.
```

or:

```text
Upload failed.

Please retry.
```

---

# 33. Security

Enforce:

- Authentication
- Institution membership
- Project membership
- Project Lead permissions
- Mentor permissions
- Evaluator permissions
- Admin permissions

Same-institution mentor selection must not rely only on frontend filtering.

---

# 34. Mentor Assignment Data

Recommended structure:

```text
mentor_assignments
------------------
id
project_id
student_lead_id
mentor_id
institution_id
status
request_message
mentor_response
requested_at
responded_at
```

Statuses:

```text
PENDING
ACCEPTED
REJECTED
CANCELLED
```

---

# 35. Audit Trail

Record important actions:

```text
Who
What
When
Project
Previous Value
New Value
```

Examples:

- Mentor request created
- Mentor accepted
- Mentor rejected
- Evidence submitted
- Evidence approved
- Change request created
- Change request resolved
- Evaluation completed

---

# 36. Core Domain Model

Core entities:

```text
Institution
User
Project
Team
Mentor Assignment
Requirement
Task
Evidence
GitHub Artifact
Mentor Review
Change Request
Contribution Evidence
Viva
Rubric
Evaluation
Learning Outcome
Portfolio
Audit Log
```

Avoid creating unnecessary entities for simple UI concepts.

---

# 37. Data Relationship

Important objects should always be traceable to their project.

```text
Project
 ├── Requirements
 │    └── Tasks
 │         └── Evidence
 │              ├── GitHub Artifact
 │              ├── Mentor Review
 │              └── Change Requests
 │
 ├── Team
 ├── Mentor Assignment
 ├── Contribution Evidence
 ├── Viva
 ├── Evaluation
 └── Learning Outcomes
```

---

# 38. Feature Priority

## P0 — Must Work Perfectly

- Authentication
- Institution
- Student profile
- Mentor profile
- Project creation
- Team creation
- Project Lead
- Mentor selection
- Mentor request
- Mentor accept/reject
- Project activation
- Requirements
- Tasks
- Evidence
- Mentor review
- Change requests
- GitHub connection
- Contribution evidence
- Evaluation

## P1 — Core Differentiation

- Evidence Passport
- Evidence Graph
- Project Health
- Evidence-grounded Viva
- Why This Score?
- Verified Portfolio

## P2 — Institutional Strength

- Learning outcomes
- Admin analytics
- Reports
- Audit dashboards
- Institutional configuration

## P3 — Optional

Only add features that clearly improve the core lifecycle.

---

# 39. Avoid Feature Bloat

Do not add features simply to make the application look bigger.

Avoid:

- Generic social feed
- Random chat system
- Leaderboards
- Unnecessary gamification
- Generic AI chatbot
- Excessive dashboards
- Decorative charts
- Features copied from Jira/Trello without academic value

Use this decision rule:

> **Does this feature help the institution plan, prove, verify, or evaluate academic project work?**

If the answer is no, do not add it.

---

# 40. Golden Demo Project

Use one realistic project throughout the complete demonstration:

**Smart Campus Energy Monitoring Platform**

Demo flow:

```text
1. Student logs in
2. Student creates project
3. Student creates team
4. Student selects same-institution mentor
5. Mentor receives request
6. Mentor accepts
7. Project becomes active
8. Student defines requirements
9. Requirements become tasks
10. GitHub repository is connected
11. Developer creates PR
12. Evidence is submitted
13. Mentor reviews evidence
14. Mentor requests a change
15. Student revises work
16. Mentor verifies evidence
17. Contribution evidence is updated
18. Health identifies remaining gaps
19. Evaluator opens project
20. Evaluator reviews verified evidence
21. Evidence-grounded viva is conducted
22. Evaluator completes rubric
23. Why This Score? shows evidence chain
24. Learning outcomes are mapped
25. Verified portfolio is created
```

This should be the primary product demonstration.

---

# 41. UX Success Criteria

A new student should understand:

> **What do I need to do now?**

within approximately 5 seconds of opening the project.

A mentor should understand:

> **Which projects need my attention?**

within approximately 5 seconds.

An evaluator should understand:

> **What evidence supports this project?**

within approximately 30 seconds.

---

# 42. Product Quality Checklist

Before considering a feature complete:

```text
[ ] Clear purpose
[ ] Belongs to academic project lifecycle
[ ] Correct role permissions
[ ] Loading state
[ ] Empty state
[ ] Error state
[ ] Success feedback
[ ] Responsive UI
[ ] Accessible UI
[ ] Audit history where required
[ ] Connected to evidence chain
[ ] Does not duplicate another feature
```

---

# 43. Implementation Order

## Phase 1 — Foundation

```text
Authentication
↓
Institution
↓
Users
↓
Roles
↓
Project
↓
Team
```

## Phase 2 — Approval

```text
Project Lead
↓
Mentor Discovery
↓
Mentor Request
↓
Mentor Accept/Reject
↓
Project Activation
```

## Phase 3 — Project Work

```text
Requirements
↓
Tasks
↓
GitHub
↓
Evidence
```

## Phase 4 — Verification

```text
Mentor Review
↓
Change Request
↓
Revision
↓
Verification
```

## Phase 5 — Intelligence

```text
Project Health
↓
Contribution Evidence
↓
Evidence Graph
↓
Viva
↓
Why This Score?
```

## Phase 6 — Institutional Output

```text
Evaluation
↓
Learning Outcomes
↓
Verified Portfolio
↓
Reports
```

---

# 44. Development Rules for AI Coding Agents

When implementing this specification:

1. Do not rebuild the application from scratch.
2. Inspect the existing project before changing it.
3. Preserve working functionality.
4. Reuse existing components where appropriate.
5. Do not duplicate business logic.
6. Keep role permissions centralized.
7. Keep database access secure.
8. Keep UI patterns consistent.
9. Do not use fake success messages.
10. Do not use hardcoded demo data in production flows.
11. Keep seed/test data separate from production data.
12. Do not introduce libraries unless necessary.
13. Do not add features outside the roadmap without justification.
14. Every workflow must connect to the project lifecycle.
15. Test the complete lifecycle after major changes.

---

# 45. Production Data Rule

Demo data must never silently appear in real user accounts.

Separate:

```text
Development Seed Data
Test Data
Production Data
```

Production should use real authenticated users and real project records.

If a presentation/demo mode is needed, it should be explicitly activated.

---

# 46. Final Product Positioning

Use this consistently:

> **ProjectFlow is an academic project lifecycle platform that creates a verifiable chain from a student's work to their final evaluation.**

Short version:

> **ProjectFlow turns project work into verified evidence.**

Technical description:

> **An evidence-centered academic project lifecycle platform connecting requirements, tasks, development artifacts, mentor verification, contribution evidence, viva, and evaluation.**

---

# 47. Final Product Test

ProjectFlow is strong enough when a complete project can move through this journey without disconnected manual steps:

```text
Student
  ↓
Project
  ↓
Team
  ↓
Mentor
  ↓
Approval
  ↓
Requirements
  ↓
Tasks
  ↓
GitHub
  ↓
Evidence
  ↓
Mentor Verification
  ↓
Contribution
  ↓
Health
  ↓
Viva
  ↓
Evaluation
  ↓
Learning Outcomes
  ↓
Verified Portfolio
```

The goal is not to have the largest number of screens.

The goal is:

> **Every screen should make the academic project lifecycle clearer, easier, more verifiable, or more useful.**

That is what should make ProjectFlow feel like a real product rather than a collection of features.
