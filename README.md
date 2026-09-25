# ProjectFlow — Academic Project Intelligence Platform

ProjectFlow is an **evidence-centered academic project intelligence platform** that wraps project execution in a verifiable, traceable evidence layer.

```text
Requirement ──► Task ──► Evidence Artifact ──► Mentor Review ──► Change Request
      ▲                                                               │
      │                                                               ▼
Learning Outcome ◄── Rubric Criterion ◄── Contribution ◄── Revision & Verification
```

---

## 1. Core Architecture

ProjectFlow is implemented using a **Firebase-first serverless architecture**:
- **Frontend**: React + Vite + TypeScript (Strict mode, pure CSS design tokens, WCAG 2.2 AA accessible).
- **Authentication**: Firebase Authentication with custom role claims and instant 1-click Demo Role Switching.
- **Primary Database**: Cloud Firestore (project-scoped subcollections and top-level institutional collections).
- **Evidence Storage**: Firebase Storage with strict MIME type and file-size constraints.
- **Serverless Compute**: Firebase Cloud Functions (TypeScript) for deterministic health calculations, contribution aggregation, and grounded viva generation.
- **Security Rules**: `firestore.rules` and `storage.rules` enforcing multi-tenant isolation, project boundaries, and role-based permissions.

---

## 2. Key Product Innovations & Differentiators

1. **The Project Evidence Graph**:
   - Every requirement connects to execution tasks, which connect to tangible artifacts (`code_pr`, `test_result`, `document`, `design`).
   - Revisions resolve specific Mentor Change Requests, closing the feedback loop.
2. **"Why This Score?" Bidirectional Traversal**:
   - In rubric evaluations, evaluators and students never see isolated scores.
   - Clicking **"Why this score?"** traverses: `Criterion Score ◄── Supporting Evidence ◄── Execution Task ◄── Requirement ◄── Mentor Sign-off`.
3. **Multi-Factor Contribution Synthesis**:
   - Contribution is **never** reduced to raw commit counts or task tallies.
   - Aggregates verified tasks, peer reviews, benchmark reports, code changes, and milestone reflections into an explainable qualitative profile.
4. **Explainable Project Health Diagnostics**:
   - Replaces opaque progress percentages with deterministic rule-based findings.
   - Every alert exposes: **Severity**, **Root Cause Reason**, **Linked Entity IDs**, and **Recommended Remedy Action**.
5. **Evidence-Grounded Viva Voce**:
   - Formulates defense questions directly citing the student's verified artifacts, preventing hallucinated evaluations.

---

## 3. Firestore Data Model

### Root Collections
- `/institutions/{institutionId}`: Academic institution profile and term settings.
- `/users/{uid}`: User profile, role (`student`, `mentor`, `evaluator`, `dept_admin`, `institution_admin`), department.
- `/rubrics/{rubricId}`: Versioned evaluation rubrics and criteria with weights.
- `/skills/{skillId}`: Technical, product, and professional competencies across 4 levels.
- `/learningOutcomes/{outcomeId}`: Course (CO), Program (PO), and Specific (PSO) outcomes.
- `/auditLogs/{logId}`: Immutable audit records of all lifecycle and grading operations.

### Project Hierarchy (`/projects/{projectId}`)
- Root Document: Project identity, lifecycle stage (`proposal`, `approval`, `active`, `review`, `completed`, `archived`), mentor assignment, team roster.
- **Subcollections**:
  - `requirements/{reqId}`: Academic requirements and acceptance criteria.
  - `tasks/{taskId}`: Kanban tasks (`backlog`, `todo`, `in_progress`, `review`, `testing`, `done`) with dependency DAGs.
  - `evidence/{evidenceId}`: Artifact metadata, source links, file paths, and verification state (`unverified` → `submitted` → `mentor_verified` → `evaluator_verified`).
  - `evidenceLinks/{linkId}`: Directed graph edges (`supports`, `implements`, `tests`, `reviews`, `revises`, `verifies`, `contributes_to`).
  - `reviews/{reviewId}`: Mentor critique, review status, and revision requests.
  - `changeRequests/{crId}`: Assigned change requests with deadlines, resolved by revision evidence.
  - `reflections/{reflectionId}`: Student metacognitive journals and challenge logs.
  - `evaluations/{evalId}`: Rubric evaluations with criterion scores and attached evidence links.
  - `viva/{vivaId}`: Evidence-grounded defense questions, student responses, and evaluator grading.
  - `healthAlerts/{alertId}`: Deterministic diagnostic signals with entity chips.

---

## 4. Demo Roles & Instant Persona Switching

The top banner includes an **Instant Demo Persona Switcher** for evaluations and defense walkthroughs:
- **Aarav Sharma (`student`)**: Final-year student & team lead (`student@projectflow.edu`).
- **Dr. Priya Raman (`mentor`)**: Faculty project guide & reviewer (`mentor@projectflow.edu`).
- **Prof. Rajesh Nair (`evaluator`)**: Project defense and viva evaluator (`evaluator@projectflow.edu`).
- **Dr. Sunita Kulkarni (`dept_admin`)**: Head of Department (`dept_admin@projectflow.edu`).
- **Vikram Malhotra (`institution_admin`)**: Academic Dean (`admin@projectflow.edu`).

---

## 5. Local Setup & Verification

### Running the Application
```bash
# Navigate to frontend
cd frontend

# Install dependencies (if not already installed)
npm install

# Start development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Running Test Suite
```bash
# Run system integrity and Evidence Graph invariant tests
node --test tests/system_integrity.test.mjs
```

### Production Build
```bash
cd frontend
npm run build
```
Builds verified assets into `frontend/dist/`.
