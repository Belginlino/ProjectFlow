# PROJECTFLOW — POST ROUND-2 FINAL DEVELOPMENT PROMPT

## 1. ROLE

You are working as a senior full-stack engineer, software architect, QA engineer, and product engineer on the existing **ProjectFlow** application.

Your task is to inspect the existing codebase and improve the current implementation.

IMPORTANT:

- Do NOT rebuild the application from scratch.
- Do NOT remove existing working functionality.
- Do NOT replace the current architecture unnecessarily.
- First inspect the complete project structure and understand how the existing application works.
- Reuse existing components, services, models, routes, authentication, UI patterns, and state management wherever possible.
- Make production-oriented changes instead of creating temporary demo implementations.
- Do not claim a feature is implemented unless it actually works.
- If something cannot be fully implemented because an external credential/configuration is required, implement the correct architecture and provide a clear configuration/setup path.

---

# 2. PROJECT CONTEXT

Project name:

**ProjectFlow**

Positioning:

> ProjectFlow is an Academic Project Lifecycle & Evidence Platform.

Tagline:

> Turn project work into verified evidence.

Problem:

University projects often lack structured tracking from idea generation to final evaluation.

ProjectFlow manages the complete academic project lifecycle:

```text
Project Concept
      ↓
Requirements & User Stories
      ↓
Acceptance Criteria
      ↓
Tasks
      ↓
Evidence / Deliverables
      ↓
Mentor Review
      ↓
Feedback / Change Request
      ↓
Revision
      ↓
Mentor Verification
      ↓
Project Health
      ↓
Contribution Evidence
      ↓
Viva
      ↓
Evaluation
      ↓
Learning Outcomes
```

The main differentiator is NOT simply project/task management.

The main differentiator is:

## PROJECT EVIDENCE GRAPH

ProjectFlow connects academic project work with evidence, verification, contribution, viva, and evaluation.

---

# 3. ROUND-2 FEEDBACK

The second-round evaluation has been completed.

The major feedback received was:

### Feedback 1
Add GitHub integration to help identify and verify student contribution.

### Feedback 2
Remove demo/sample data from the actual application.

### Feedback 3
Prepare a proper development/progress report for the mentor.

Your task is to make the implementation complete, reliable, clean, and final-demo ready.

---

# 4. CURRENT IMPORTANT STATUS

The application already contains major ProjectFlow functionality.

Existing areas may include:

- Authentication
- Student Dashboard
- Mentor Dashboard
- Evaluator Dashboard
- Admin Dashboard
- Requirements
- User Stories
- Tasks / Kanban
- Evidence Vault
- Evidence Graph
- Mentor Review
- Change Requests
- Project Health
- Contribution
- Viva
- Evaluation
- Idea Marketplace
- Team Management
- Student Portfolio
- Institutional Administration
- Notifications
- Global Search
- GitHub integration

IMPORTANT:

Before modifying anything, inspect which of these are actually implemented.

Do NOT assume that every feature is production-ready.

---

# 5. PRIMARY OBJECTIVE

Move ProjectFlow from a prototype/demo-oriented application toward a reliable final demonstration system.

The final system must demonstrate:

```text
REAL USER
   ↓
REAL PROJECT
   ↓
REAL REQUIREMENT
   ↓
REAL TASK
   ↓
REAL GITHUB ACTIVITY
   ↓
REAL EVIDENCE
   ↓
MENTOR VERIFICATION
   ↓
CONTRIBUTION EVIDENCE
   ↓
VIVA
   ↓
EVALUATION
```

This complete chain is more important than adding new unrelated features.

---

# 6. PHASE 1 — FULL CODEBASE AUDIT

Before making changes:

1. Inspect the entire repository.
2. Identify:
   - frontend
   - backend
   - Firebase configuration
   - authentication
   - database/state management
   - GitHub integration
   - routing
   - role management
   - evidence system
   - contribution system
   - evaluation system
   - demo/seed data
   - hardcoded values
   - API services
   - environment variables
3. Identify incomplete implementations.
4. Identify duplicate implementations.
5. Identify mock/fake data.
6. Identify dead code.
7. Identify broken routes.
8. Identify permission/security issues.
9. Identify build/type/lint errors.

Create an internal implementation checklist before modifying the application.

---

# 7. PHASE 2 — REMOVE DEMO DATA

The application must no longer depend on demo data.

Remove runtime/demo data such as:

- fake students
- fake mentors
- fake evaluators
- fake administrators
- fake projects
- fake tasks
- fake requirements
- fake evidence
- fake GitHub activity
- fake contribution percentages
- fake evaluation scores
- fake notifications
- fake project health statistics
- fake dashboard statistics
- hardcoded project names
- hardcoded team members

The application should work with actual authenticated users and actual created projects.

## IMPORTANT: DO NOT DESTROY DEVELOPMENT SEEDING

If demo data is useful for development/testing, keep it isolated.

Use something similar to:

```text
/scripts
    /seed
        seed-demo-data.*
```

OR an equivalent development-only mechanism.

Demo data must NEVER automatically appear in production.

Use a clear separation:

```text
Production
    ↓
Real Users
Real Projects
Real Data

Development/Test
    ↓
Optional Seed Data
```

Never mix the two.

---

# 8. PHASE 3 — EMPTY STATES

Because demo data is removed, every major screen must handle empty states correctly.

Examples:

### Student Dashboard

If the student has no projects:

> You don't have any projects yet.

Buttons:

```text
Create Project
Join Project
Explore Ideas
```

### Evidence Vault

If there is no evidence:

> No evidence submitted yet.

### Tasks

> No tasks created yet.

### GitHub

> No GitHub repository connected.

Button:

```text
Connect GitHub Repository
```

### Mentor Review

> No projects are currently assigned for review.

### Evaluation

> No projects are currently assigned for evaluation.

Do not show fake statistics to fill empty screens.

---

# 9. PHASE 4 — GITHUB INTEGRATION

GitHub integration is now a core ProjectFlow feature.

The integration must not exist as an isolated GitHub analytics page.

It must connect to the ProjectFlow evidence system.

Desired architecture:

```text
ProjectFlow Project
        ↓
Connect GitHub Repository
        ↓
Repository
        ↓
GitHub Activity
        ↓
Commits / PRs / Reviews
        ↓
ProjectFlow Task
        ↓
Evidence
        ↓
Mentor Verification
        ↓
Contribution Evidence
```

---

# 10. GITHUB SECURITY

Use a proper GitHub App architecture where possible.

Do NOT store personal GitHub access tokens in frontend/localStorage.

Sensitive credentials must remain server-side.

Use environment variables for secrets.

Example:

```env
GITHUB_APP_ID=
GITHUB_APP_CLIENT_ID=
GITHUB_APP_CLIENT_SECRET=
GITHUB_APP_PRIVATE_KEY=
GITHUB_WEBHOOK_SECRET=
GITHUB_APP_SLUG=
GITHUB_CALLBACK_URL=
```

Never expose private keys, client secrets, or webhook secrets to the frontend.

---

# 11. GITHUB REPOSITORY CONNECTION

Implement/verify:

```text
Connect GitHub
      ↓
Authorize
      ↓
Select Repository
      ↓
Connect Repository to Project
```

Project members should be able to map their GitHub accounts.

Example:

```text
ProjectFlow User       GitHub Account

Belgin                 belgin-dev
Arun                   arun-dev
Priya                  priya-dev
Rahul                  rahul-dev
```

Do not assume GitHub usernames automatically equal ProjectFlow usernames.

Provide an explicit mapping mechanism.

---

# 12. GITHUB ACTIVITY

Retrieve relevant development activity:

- commits
- pull requests
- merged pull requests
- pull request reviews
- repository information
- contributors

Store enough metadata to establish evidence relationships.

Avoid collecting unnecessary private information.

---

# 13. GITHUB → PROJECTFLOW LINKING

GitHub activity must be linkable to ProjectFlow work.

Support relationships such as:

```text
Requirement
     ↓
Task
     ↓
GitHub PR
     ↓
Commit
     ↓
Evidence
```

Example:

```text
Requirement:
Implement Authentication

Task:
Build JWT Authentication

GitHub:
PR #24 — Implement JWT Authentication

Evidence:
Authentication implementation

Mentor:
Verified
```

---

# 14. OPTIONAL TASK/CHANGE REQUEST REFERENCES

Where useful, support references such as:

```text
PF-TASK-123
PF-CR-01
```

Example PR:

```text
feat: implement authentication

PF-TASK-123
```

This can help establish traceability.

Do not make the entire system dependent on commit-message conventions.

---

# 15. GITHUB WEBHOOKS

If the current architecture supports server-side webhooks, implement/verify:

```text
POST /api/integrations/github/webhook
```

Validate:

```text
X-Hub-Signature-256
```

Use webhook delivery IDs to prevent duplicate processing.

Webhook events should be safely processed and stored.

Do not allow duplicate events to create duplicate activity/evidence.

---

# 16. MANUAL SYNC

Provide a clear UI action:

```text
Sync GitHub
```

Show the actual last sync timestamp and status.

During sync:

```text
Syncing GitHub activity...
```

On failure:

```text
GitHub synchronization failed.
Try again.
```

Do not silently fail.

---

# 17. CONTRIBUTION MODEL

IMPORTANT:

Do NOT calculate contribution using only the number of commits.

Do NOT create simplistic percentages based purely on GitHub activity.

Instead call the feature:

## Contribution Evidence

Possible evidence sources:

```text
GitHub Commits
GitHub Pull Requests
GitHub Reviews
Verified Tasks
Verified Evidence
Mentor Verification
Resolved Change Requests
Viva Responses
Peer Evidence (if implemented)
Student Reflection
```

The UI should explain where the contribution evidence came from.

---

# 18. CONTRIBUTION EXPLANATION

For each student show actual evidence, for example:

```text
Contribution Evidence

GitHub
- [actual commit count] commits
- [actual PR count] pull requests
- [actual review count] PR reviews

ProjectFlow
- [actual assigned task count] assigned tasks
- [actual verified task count] verified tasks
- [actual verified evidence count] verified evidence items
- [actual change request count] resolved change requests

Mentor Verification
- [actual verified contribution count] verified contributions

Viva
- Evidence-linked responses available
```

The exact numbers must come from actual data.

Never invent values.

---

# 19. PROJECT EVIDENCE GRAPH

The Evidence Graph should be one of the strongest parts of the application.

It should visually/structurally connect:

```text
PROJECT
   ↓
REQUIREMENT
   ↓
TASK
   ↓
GITHUB PR
   ↓
COMMIT
   ↓
EVIDENCE
   ↓
MENTOR REVIEW
   ↓
VERIFICATION
   ↓
CONTRIBUTION
   ↓
VIVA
   ↓
EVALUATION
```

Use existing graph architecture if available.

Do not create a separate unrelated graph system.

---

# 20. EVIDENCE STATES

Evidence should have clear states:

```text
Draft
   ↓
Submitted
   ↓
Under Review
   ↓
Verified
```

Alternative outcomes:

```text
Needs Revision
Rejected
```

Mentor actions:

```text
Verify
Request Revision
Reject
Comment
```

Every state transition should be stored correctly.

---

# 21. CHANGE REQUEST FLOW

Verify that change requests work correctly:

```text
Mentor Review
      ↓
Change Request CR-01
      ↓
Student Revision
      ↓
GitHub PR / Commit
      ↓
Evidence Update
      ↓
Mentor Re-review
      ↓
Verified
```

This should connect back to the Evidence Graph.

---

# 22. PROJECT HEALTH

Project Health should be explainable.

Do not display an unexplained percentage.

Instead explain indicators such as:

```text
Requirements:
[actual completed] / [actual total]

Tasks:
[actual completed] / [actual total]

Overdue Tasks:
[actual count]

Blocked Tasks:
[actual count]

Pending Mentor Reviews:
[actual count]

Missing Evidence:
[actual count]

Milestone Status:
[actual status]
```

All displayed values must be derived from actual project data.

---

# 23. ROLE-BASED WORKSPACES

Ensure distinct role experiences.

## STUDENT

```text
Dashboard
My Projects
Idea Marketplace
My Portfolio
Team
Requirements
Tasks
Evidence Vault
Evidence Graph
Mentor Feedback
Project Health
Contribution
Viva
Evaluation
Notifications
Settings
```

## MENTOR

```text
Dashboard
Assigned Projects
Review Inbox
Evidence Reviews
Change Requests
Pending Verifications
Project Health
Milestones
Student Progress
Contribution Evidence
Learning Outcomes
Meetings
Feedback
Notifications
Settings
```

## EVALUATOR

```text
Dashboard
Assigned Evaluations
Projects
Evidence Review
Evidence Graph
Contribution
Viva
Rubrics
Scorecards
Evaluation Summary
Learning Outcomes
```

## ADMIN

```text
Dashboard
Institution Analytics
Projects
Students
Mentors
Departments
Project Teams
Requirements
Rubrics
Evaluation Framework
Learning Outcomes
Project Health
Evidence Verification
Mentor Workload
Evaluation Status
Outcome Coverage
Audit Logs
Reports
User Management
Notifications
Settings
```

Do not simply hide student navigation with CSS.

Use actual role-aware navigation and route guards.

---

# 24. AUTHORIZATION

Verify that role-based access is enforced.

A user must not gain access to restricted functionality by manually entering a URL.

Test:

```text
Student → Mentor route
Student → Admin route
Mentor → Admin route
Evaluator → Admin route
```

Use the existing authentication system.

Do not create a second authentication system.

---

# 25. MENTOR REPORT

Create a proper mentor-facing report:

# ProjectFlow — Post Round-2 Development & Progress Report

Include:

1. Project Overview
2. Problem Statement
3. Proposed Solution
4. Current System
5. Features Implemented
6. Round-2 Evaluation Feedback
7. GitHub Integration
8. Updated Evidence Workflow
9. Updated Architecture
10. Demo Data Removal
11. Testing & Validation
12. Current Limitations
13. Next Development Milestones
14. Expected Final Demo
15. Conclusion

Document the Round-2 actions accurately:

```text
Feedback:
GitHub integration required.

Action:
GitHub integration implemented/verified.

Feedback:
Demo data should be removed.

Action:
Runtime demo data removed and real-data workflow established.

Feedback:
Progress report required.

Action:
This report has been prepared.
```

Do not claim anything as implemented unless it actually is.

---

# 26. DOCUMENTATION RULE

Documentation must always match the actual implementation.

Use:

```text
IMPLEMENTED
PARTIALLY IMPLEMENTED
PLANNED
```

Never document a planned feature as implemented.

---

# 27. ERROR / LOADING / EMPTY STATES

Every major asynchronous operation must have:

### Loading

```text
Loading...
```

### Success

```text
Successfully completed.
```

### Error

```text
Something went wrong.
Try again.
```

### Empty

```text
No data available yet.
```

Do not leave blank screens.

---

# 28. RESPONSIVE DESIGN

Verify:

```text
Desktop
Laptop
Tablet
Mobile
```

Pay particular attention to:

- sidebar
- tables
- Kanban
- Evidence Graph
- GitHub activity
- contribution screens
- evaluation scorecards
- modals
- forms

Do not redesign the entire UI unnecessarily.

Preserve the existing ProjectFlow visual identity.

---

# 29. SEARCH & NOTIFICATIONS

If these features already exist:

- Search only actual available data.
- Notifications must be generated from actual events.
- Remove all fake notifications.

Examples:

```text
New mentor feedback
Evidence needs revision
Task assigned
Change request created
Evidence verified
GitHub sync completed
```

---

# 30. DATA INTEGRITY

Ensure relationships remain consistent:

```text
Project
 ↓
Requirement
 ↓
Task
 ↓
Evidence
 ↓
Mentor Review
 ↓
Verification
```

Gracefully handle:

- missing references
- deleted tasks
- deleted evidence
- disconnected GitHub repository
- removed team member
- archived projects

---

# 31. SECURITY

Review:

- authentication
- authorization
- Firebase rules
- API authorization
- GitHub credentials
- environment variables
- sensitive data exposure
- client-side secrets
- webhook validation
- input validation
- Firestore access rules
- unauthorized document access

Never expose secrets in frontend code.

Never commit secrets.

Update `.env.example` instead of committing real credentials.

---

# 32. PERFORMANCE

Avoid:

- duplicate API calls
- duplicate GitHub synchronization
- infinite listeners
- repeated database queries
- unnecessary React re-renders

Use appropriate loading/caching patterns already present.

Do not introduce premature complexity.

---

# 33. TESTING

Run all available commands such as:

```text
npm run build
npm run lint
npm test
```

or the equivalent commands used by the repository.

Also manually test:

### Authentication

- Login
- Logout
- Invalid login
- Google sign-in if implemented

### Student

- Create project
- Create requirement
- Create task
- Submit evidence
- Connect GitHub

### Mentor

- View project
- Review evidence
- Create change request
- Verify evidence

### GitHub

- Connect repository
- Sync
- Display activity
- Link activity
- Disconnect
- Reconnect

### Contribution

- View evidence
- Verify source information
- Ensure no fake contribution values

### Evaluator

- View project
- View evidence
- View contribution evidence
- Conduct viva
- Evaluation

### Admin

- View institution data
- Manage users/projects
- Verify permissions

---

# 34. NO FAKE SUCCESS

Never implement fake behavior such as:

```text
Button clicked → show "Success"
```

without performing the actual operation.

If an external API is unavailable, show a proper error or configuration requirement.

Do not pretend GitHub is connected when it is not.

Do not pretend evidence is verified when it is not.

Do not pretend evaluation has been completed when it has not.

---

# 35. FINAL DEMO WORKFLOW

Prepare the application so the final demonstration can follow ONE coherent project:

```text
1. Login
      ↓
2. Create Project
      ↓
3. Add Team Members
      ↓
4. Create Requirement
      ↓
5. Create Task
      ↓
6. Connect GitHub Repository
      ↓
7. Show GitHub PR / Commit
      ↓
8. Link GitHub Activity to Task
      ↓
9. Submit Evidence
      ↓
10. Mentor Reviews Evidence
      ↓
11. Mentor Requests Change
      ↓
12. Student Revises
      ↓
13. GitHub Revision Activity
      ↓
14. Mentor Verifies
      ↓
15. Contribution Evidence Updated
      ↓
16. Evidence Graph Shows Complete Chain
      ↓
17. Viva Uses Evidence
      ↓
18. Evaluator Completes Scorecard
      ↓
19. Final Project Evaluation
```

This should be the main story of the final demo.

---

# 36. FINAL UI PRINCIPLE

Prioritize:

```text
What happened?
Why did it happen?
What evidence proves it?
Who verified it?
What should happen next?
```

ProjectFlow should feel like an academic project lifecycle platform, not a generic task-management clone.

---

# 37. IMPORTANT PRODUCT PRINCIPLES

1. ProjectFlow is not just a task manager.
2. GitHub is an evidence source, not the entire contribution system.
3. Contribution must be explainable.
4. Evidence must be traceable.
5. Mentor verification is important.
6. AI suggestions must remain explainable and assistive.
7. AI must not automatically decide student marks, pass/fail, or academic ranking.
8. Do not create misleading contribution leaderboards.
9. Real data must replace runtime demo data.
10. Important academic conclusions should be traceable to evidence.

---

# 38. FINAL VALIDATION CHECKLIST

## DATA

- [ ] Runtime demo data removed
- [ ] Real project creation works
- [ ] Real users work
- [ ] Empty states work
- [ ] Demo seed isolated from production

## GITHUB

- [ ] GitHub connection works
- [ ] Repository selection works
- [ ] Account mapping works
- [ ] Activity sync works
- [ ] PRs visible
- [ ] Commits visible
- [ ] Reviews visible
- [ ] Activity can connect to ProjectFlow work
- [ ] Disconnect works
- [ ] Errors handled
- [ ] Secrets protected

## EVIDENCE

- [ ] Evidence submission works
- [ ] Mentor review works
- [ ] Change request works
- [ ] Revision workflow works
- [ ] Verification works
- [ ] Evidence Graph reflects relationships

## CONTRIBUTION

- [ ] GitHub activity included
- [ ] ProjectFlow evidence included
- [ ] Mentor verification included
- [ ] Contribution is explainable
- [ ] No raw commit-count-only scoring
- [ ] No fake percentages
- [ ] No misleading leaderboard

## ROLES

- [ ] Student workspace works
- [ ] Mentor workspace works
- [ ] Evaluator workspace works
- [ ] Admin workspace works
- [ ] Route guards work
- [ ] Unauthorized access blocked

## PROJECT HEALTH

- [ ] Indicators use real data
- [ ] Missing evidence detected
- [ ] Pending reviews detected
- [ ] Overdue tasks detected
- [ ] Status is explainable

## REPORT

- [ ] Mentor report created
- [ ] Round-2 feedback documented
- [ ] Actions taken documented
- [ ] GitHub integration documented
- [ ] Demo-data removal documented
- [ ] Current limitations documented
- [ ] Next milestones documented

## QUALITY

- [ ] Build passes
- [ ] Type checking passes
- [ ] Lint passes
- [ ] Tests pass
- [ ] No console errors
- [ ] No broken routes
- [ ] No exposed secrets
- [ ] Responsive UI verified

---

# 39. FINAL OUTPUT REQUIRED

After implementation, provide a concise engineering summary containing:

## A. Files Changed

List important files changed.

## B. Features Completed

List actual completed features.

## C. GitHub Integration Status

Explain exactly what works.

## D. Demo Data Status

Explain what was removed and what remains only as development seed data.

## E. Evidence Graph Status

Explain the implemented relationships.

## F. Contribution System

Explain how contribution evidence is derived.

## G. Role & Security Status

Explain permission validation.

## H. Testing Results

Report actual:

- build result
- lint result
- test result
- manual validation result

Do not invent results.

## I. Remaining Limitations

Clearly identify anything still incomplete.

## J. Final Demo Steps

Give the exact sequence for demonstrating ProjectFlow.

---

# 40. MOST IMPORTANT INSTRUCTION

Do not keep adding random features.

The priority is:

```text
RELIABILITY
      ↓
REAL DATA
      ↓
GITHUB EVIDENCE
      ↓
TRACEABILITY
      ↓
VERIFICATION
      ↓
CONTRIBUTION
      ↓
EVALUATION
      ↓
FINAL DEMO
```

The final application must clearly demonstrate:

> **ProjectFlow turns academic project work into verified evidence.**
