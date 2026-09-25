# ProjectFlow — Antigravity Master Development Prompt

You are implementing **ProjectFlow**, an evidence-centered academic project intelligence platform.

## 1. Read the docs first
Read every Markdown file inside `/docs` before coding.

Treat:
1. `PRD.md` — product source of truth
2. `DEVELOPMENT_RULES.md` — mandatory engineering rules
3. `ARCHITECTURE.md` — technical architecture
4. `DATABASE.md` — Firestore data model
5. `EVIDENCE_GRAPH.md` — evidence relationships
6. `UI_UX.md` — interface requirements
7. `SECURITY.md` and `ACCESSIBILITY.md` — mandatory constraints

Do not code until you understand dependencies and identify ambiguities.

## 2. Mandatory backend
ProjectFlow uses **Firebase**, not Firebase Firestore and not a separate Firebase Cloud Functions backend.

Use:
- React + Vite + TypeScript
- Firebase Authentication
- Cloud Firestore
- Firebase Storage
- Firebase Cloud Functions
- Firebase Security Rules
- Firebase Hosting or the deployment platform defined by the project

Do not introduce another primary database or backend unless an explicit architecture decision documents why.

## 3. Core innovation
Do not turn ProjectFlow into a generic Jira clone. The key differentiator is the **Project Evidence Graph**:

Requirement → Task → Work → Evidence → Review → Feedback → Change Request → Revision → Verification → Contribution → Evaluation → Learning Outcome

A task marked `Done` is not automatically equivalent to verified completion.

## 4. Firebase data architecture
Use project-scoped collections:
- `projects/{projectId}/requirements`
- `projects/{projectId}/tasks`
- `projects/{projectId}/evidence`
- `projects/{projectId}/evidenceLinks`
- `projects/{projectId}/reviews`
- `projects/{projectId}/changeRequests`
- `projects/{projectId}/reflections`
- `projects/{projectId}/evaluations`
- `projects/{projectId}/viva`
- `projects/{projectId}/healthAlerts`

Use top-level collections such as `users`, `institutions`, `rubrics`, `skills`, `learningOutcomes`, and `auditLogs` where appropriate.

Store files in Firebase Storage and metadata in Firestore. Use transactions/batched writes when consistency requires them.

Use Cloud Functions for trusted mutations, GitHub synchronization, contribution calculation, health calculation, AI orchestration, notifications, and sensitive audit workflows.

## 5. Security
Implement Firebase Security Rules from the beginning. Enforce authentication, project membership, roles, institution boundaries, mentor/admin permissions, safe evidence access, and restricted evaluation finalization.

Never trust client-supplied scores, contribution totals, verification states, or privileged role claims.
Never expose Firebase Admin SDK credentials in frontend code.

## 6. Implementation order
### Phase 0 — Foundation
Firebase setup, environment configuration, authentication, Firestore, Storage, Security Rules, Functions, base UI, tests.

### Phase 1 — Project Management
Projects, teams, requirements, tasks, lifecycle states, dashboard.

### Phase 2 — Evidence Engine
Evidence upload, metadata, links, Evidence Graph UI, verification.

### Phase 3 — Mentor Workflow
Mentor dashboard, review inbox, feedback, change requests, revision verification.

### Phase 4 — Contribution
Multi-source contribution evidence, explainable snapshots, no simplistic commit-only leaderboard.

### Phase 5 — Evaluation
Configurable rubrics, evidence-linked criteria, evaluation workflow, “Why this score?” traceability.

### Phase 6 — Explainable Project Health
Deterministic health signals, evidence-backed reasons, actionable recommendations.

### Phase 7 — AI
Evidence-grounded summaries, feedback-to-change-request assistance, missing-evidence detection, evidence-grounded viva questions. Human review is required.

### Phase 8 — Learning Outcomes
Skills, outcomes, evidence mapping, student reflection.

### Phase 9 — Polish
Accessibility, responsive design, performance, security review, testing, deployment, demo data.

## 7. Non-destructive development
Before changing code, inspect the current structure and preserve working features. Avoid unnecessary rewrites. Make small, traceable changes.

## 8. Verify every phase
After each phase:
1. run tests
2. run TypeScript checks
3. run lint
4. run production build
5. verify Firebase rules
6. test important user flows
7. fix errors before continuing

Report changed files, implemented features, test/build results, known issues, and next phase.

## 9. UI
Build a professional academic product, not an AI-generated template. Prioritize hierarchy, evidence visibility, traceability, accessibility, responsive behavior, and meaningful loading/error/empty states.

## 10. Critical rules
Do not claim generic project management is unique. Do not treat task/commit counts alone as proof of contribution. Do not treat AI output as verified evidence. Do not hide why an evaluation score exists. Do not allow final verification without required evidence.

## 11. Final demonstration
Show the complete chain:
Requirement → Task → Evidence → Mentor Review → Change Request → Revision → Verification → Contribution → Explainable Health → Evidence-linked Evaluation → Evidence-grounded Viva → Learning Outcome.

This traceability is the heart of ProjectFlow.
