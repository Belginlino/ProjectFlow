# ProjectFlow — Comprehensive Project Documentation & Architecture Guide

> **Tagline:** Turn project work into verified evidence.  
> **Platform Classification:** Evidence-Centered Academic Project Intelligence & Verification Platform  
> **Architecture:** Firebase-First Serverless Architecture (React 18 + Vite + TypeScript + Cloud Firestore + Firebase Functions + Firebase Storage)

---

## Table of Contents
1. [Executive Summary & Problem Statement](#1-executive-summary--problem-statement)
2. [Core Architecture & Technology Stack](#2-core-architecture--technology-stack)
3. [The Core Innovation: Project Evidence Graph](#3-the-core-innovation-project-evidence-graph)
4. [Complete Data Models & Firestore Schema](#4-complete-data-models--firestore-schema)
5. [System Workings & Deep-Dive Module Breakdown](#5-system-workings--deep-dive-module-breakdown)
   - [5.1 Authentication & Multi-Role Access Control (RBAC)](#51-authentication--multi-role-access-control-rbac)
   - [5.2 Project Lifecycle & Team Coordination](#52-project-lifecycle--team-coordination)
   - [5.3 Requirements Engineering & Kanban Task Execution](#53-requirements-engineering--kanban-task-execution)
   - [5.4 Evidence Subsystem & Verification Pipeline](#54-evidence-subsystem--verification-pipeline)
   - [5.5 Mentor Review & Closed-Loop Change Requests](#55-mentor-review--closed-loop-change-requests)
   - [5.6 Deterministic Project Health & Diagnostic Engine](#56-deterministic-project-health--diagnostic-engine)
   - [5.7 Multi-Factor Contribution Assessment Engine](#57-multi-factor-contribution-assessment-engine)
   - [5.8 Evidence-Grounded Viva Voce Engine](#58-evidence-grounded-viva-voce-engine)
   - [5.9 Academic Rubric Evaluation & "Why This Score?" Traversal](#59-academic-rubric-evaluation--why-this-score-traversal)
   - [5.10 Institutional Learning Outcomes & Competency Framework](#510-institutional-learning-outcomes--competency-framework)
   - [5.11 GitHub Integration & Automated Webhook Ingestion](#511-github-integration--automated-webhook-ingestion)
   - [5.12 Student Verified Portfolio](#512-student-verified-portfolio)
   - [5.13 Idea Marketplace & Collaboration Hub](#513-idea-marketplace--collaboration-hub)
   - [5.14 Immutable Audit Trails & Compliance](#514-immutable-audit-trails--compliance)
6. [Grounded AI Architecture & Safety Rules](#6-grounded-ai-architecture--safety-rules)
7. [Cloud Functions & Serverless API Reference](#7-cloud-functions--serverless-api-reference)
8. [Security, Isolation & Storage Rules](#8-security-isolation--storage-rules)
9. [Installation, Configuration & Testing Guide](#9-installation-configuration--testing-guide)
10. [End-to-End Golden Demo Walkthrough](#10-end-to-end-golden-demo-walkthrough)

---

## 1. Executive Summary & Problem Statement

### 1.1 The Academic Project Dilemma
In traditional university engineering and capstone curricula:
- **Superficial Task Completion:** Generic project trackers (Trello, Jira) track whether a task is moved to "Done", but cannot prove **what** was built, **how** it was validated, or **who** genuinely contributed.
- **Opaque Contribution:** Individual grading frequently degrades into raw Git commit counts or subjective peer evaluations. Passive team members frequently free-ride while leads bear the burden without verifiable credit.
- **Fragmented Mentorship Feedback:** Faculty feedback provided during intermittent viva sessions or hallway meetings is rarely traceable to subsequent revisions.
- **Disjointed Final Evaluations:** Capstone defense examiners assess students on brief final slide decks rather than inspectable, verified day-to-day artifacts.
- **Accreditation Gaps:** Documenting Program Outcomes (POs), Course Outcomes (COs), and ABET/NBA criteria requires painful, retroactive paperwork.

### 1.2 The ProjectFlow Solution
ProjectFlow transforms academic project management into an **evidence-backed operating system**. Every requirement connects to execution tasks, which in turn connect to tangible, verifiable artifacts (code PRs, unit test outputs, system architectures, hardware schematics). 

```text
Requirement ──► Task ──► Evidence Artifact ──► Mentor Review ──► Change Request
      ▲                                                               │
      │                                                               ▼
Learning Outcome ◄── Rubric Criterion ◄── Contribution ◄── Revision & Verification
```

### 1.3 Scope & Strict Non-Goals
To preserve architectural purity and academic ethics:
- **No Automatic Grading:** AI never awards final scores or determines academic eligibility; humans remain the sole authority.
- **No Vanity Leaderboards:** No competitive gamification that incentivizes spammy commits or empty task completions.
- **No Plagiarism / Surveillance Witch-Hunts:** No opaque AI code detectors or intrusive desktop monitoring; focus is on explainable, verified chains of evidence.
- **Not a Generic LMS:** Focuses strictly on project intelligence, evidence verification, and defense readiness.

---

## 2. Core Architecture & Technology Stack

ProjectFlow uses a **Firebase-First Serverless Architecture**, designed for low latency, real-time collaboration, zero maintenance overhead, and strict institutional multi-tenancy.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        React 18 + Vite Frontend                        │
│   (TypeScript Strict Mode, Pure CSS Design Tokens, WCAG 2.2 AA)        │
└───────────────────▲─────────────────────────────────▲──────────────────┘
                    │                                 │
     Auth Token /   │ Real-time                       │ File Uploads /
     User Session   │ Subscriptions & Queries         │ Signed URLs
                    ▼                                 ▼
         ┌─────────────────────┐            ┌───────────────────┐
         │  Firebase Auth SDK  │            │ Firebase Storage  │
         │ (Custom Role Claims)│            │  (25MB, Strict    │
         └──────────┬──────────┘            │    MIME Filters)  │
                    │                       └─────────▲─────────┘
                    ▼                                 │
         ┌─────────────────────┐                      │
         │   Cloud Firestore   │                      │
         │ (Project Scoped &   │                      │
         │ Institutional Root) │                      │
         └──────────┬──────────┘                      │
                    │                                 │
                    ▼ Triggers / Callable RPCs        │ Metadata
         ┌────────────────────────────────────────────┴─────────┐
         │            Firebase Cloud Functions (v2)             │
         │  - Deterministic Health Engine                       │
         │  - Multi-Factor Contribution Aggregator              │
         │  - Evidence-Grounded Viva Generator                  │
         │  - GitHub Octokit App / Webhook Ingestion            │
         └──────────────────────────┬───────────────────────────┘
                                    │
                         ┌──────────┴──────────┐
                         │   GitHub REST API   │
                         │ (PRs, Commits, CI)  │
                         └─────────────────────┘
```

### 2.1 Technology Specifications

| Layer | Technology | Details & Justification |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 18 + TypeScript** | Strict typing, functional components with hooks, high performance. |
| **Build & Bundler** | **Vite 5** | Instant Hot Module Replacement (HMR) and optimized tree-shaken builds. |
| **Routing** | **React Router v7** | Client-side routing with guarded layouts and role-based redirects. |
| **Styling & Design** | **Pure Modern CSS** | Bespoke design system (`theme.css`, `index.css`, `style.css`), dark mode tokens, glassmorphism cards, zero Tailwind overhead. |
| **Icons & Visuals** | **Lucide React** | Consistent, accessible SVG iconography. |
| **Authentication** | **Firebase Auth** | Email/Password, Google OAuth, and Instant Demo Role switching. |
| **Database** | **Cloud Firestore** | NoSQL document database utilizing hierarchical subcollections for strict project boundaries. |
| **File Storage** | **Firebase Storage** | Validated file uploads with client-side drag-and-drop and size/type validation. |
| **Serverless Logic** | **Cloud Functions (Node 20)** | TypeScript v2 HTTPS callables and webhooks for deterministic computations and third-party integrations. |
| **Integrations** | **Octokit (@octokit/rest)** | Official GitHub App integration for linking pull requests and commits to tasks. |

---

## 3. The Core Innovation: Project Evidence Graph

The **Project Evidence Graph** is the foundational intellectual property of ProjectFlow. Instead of viewing tasks as isolated checkboxes, ProjectFlow enforces a continuous, directed acyclic graph (DAG) across the academic lifecycle.

### 3.1 The 13-Stage Relational Pipeline

1. **Concept / Idea (`/ideas`):** Proposed project concept, problem statement, required tech skills, and peer join requests.
2. **Project Workspace (`/projects`):** Formal workspace creation with academic year, semester, and institutional scope.
3. **Team Roster (`/team`):** Assignment of Project Lead and Collaborators.
4. **Requirements (`/requirements`):** Functional/non-functional specifications with verifiable acceptance criteria.
5. **Tasks (`/tasks`):** Kanban work units linked directly to parent requirements, with assignee and due dates.
6. **Evidence Artifacts (`/evidence`):** Tangible proof of work (Pull Requests, test logs, architecture diagrams, datasets, demo recordings).
7. **Mentor Review (`/reviews`):** Formal inspection by faculty guide with status (`approved`, `changes_requested`, `rejected`).
8. **Change Requests (`/changeRequests`):** Actionable modification tickets generated directly from mentor critique with hard deadlines.
9. **Revision & Verification:** Students upload revised artifacts linked via `revises` edges to resolve change requests.
10. **Project Health Diagnostics (`/health`):** Deterministic engine scanning for broken graph edges (e.g., tasks completed without evidence).
11. **Contribution Synthesis (`/contribution`):** Qualitative multi-dimensional profile summarizing verified contributions.
12. **Evidence-Grounded Viva (`/contribution`):** Defense questions auto-generated directly from the student's verified artifacts.
13. **Rubric Evaluation & "Why This Score?" (`/evaluation`):** Criterion-based assessment with instant recursive traversal from criterion to raw evidence.

### 3.2 Graph Link Types
Relationships between nodes are tracked in the `evidenceLinks` collection using explicit directed relationships:
- `supports`: Connects an evidence item to a requirement or rubric criterion.
- `implements`: Connects an evidence artifact (e.g., Code PR) to a task.
- `tests`: Connects a test result artifact to a code artifact or requirement.
- `reviews`: Connects a faculty review to an evidence item.
- `revises`: Connects a new evidence artifact to a prior change request.
- `verifies`: Connects mentor/evaluator approval to an evidence artifact.
- `contributes_to`: Connects student activity to a learning outcome or skill.

---

## 4. Complete Data Models & Firestore Schema

All entities reside in Google Cloud Firestore under a strict, institution-partitioned data model.

```
/institutions/{institutionId}
/users/{uid}
/rubrics/{rubricId}
/skills/{skillId}
/learningOutcomes/{outcomeId}
/auditLogs/{logId}
/github_installations/{projectId}
/github_repositories/{projectId_repoId}

/projects/{projectId}
  ├── /requirements/{requirementId}
  ├── /tasks/{taskId}
  ├── /evidence/{evidenceId}
  ├── /evidenceLinks/{linkId}
  ├── /reviews/{reviewId}
  ├── /changeRequests/{changeRequestId}
  ├── /reflections/{reflectionId}
  ├── /evaluations/{evaluationId}
  ├── /viva/{vivaId}
  └── /healthAlerts/{alertId}
```

### 4.1 Schema Definitions & Interfaces

#### User Profile (`/users/{uid}`)
```typescript
export type UserRole = 'student' | 'mentor' | 'evaluator' | 'dept_admin' | 'institution_admin';

export interface UserProfile {
  id: string;               // Auth UID
  email: string;
  fullName: string;
  role: UserRole;
  institutionId: string;    // e.g., 'inst-ait-01'
  department: string;       // e.g., 'Computer Science & Engineering'
  rollNumber?: string;      // e.g., 'CS2023-042'
  avatarUrl?: string;
  isActive: boolean;
  onboardingComplete?: boolean;
  createdAt: string;
}
```

#### Project Document (`/projects/{projectId}`)
```typescript
export type ProjectStatus = 'draft' | 'mentor_pending' | 'mentor_rejected' | 'proposal' | 'approval' | 'active' | 'review' | 'completed' | 'archived';

export interface Project {
  id: string;
  institutionId: string;
  title: string;
  description: string;
  status: ProjectStatus;
  academicYear: string;     // e.g., '2025-2026'
  semester: string;         // e.g., 'Semester 8'
  mentorId?: string;
  mentorName?: string;
  team: {
    members: Array<{
      uid: string;
      fullName: string;
      email: string;
      projectRole: 'lead' | 'member';
      joinedAt: string;
    }>;
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
```

#### Requirements (`/projects/{projectId}/requirements/{requirementId}`)
```typescript
export type RequirementPriority = 'low' | 'medium' | 'high' | 'critical';
export type RequirementStatus = 'draft' | 'approved' | 'in_progress' | 'verified';

export interface Requirement {
  id: string;
  projectId: string;
  title: string;
  description: string;
  priority: RequirementPriority;
  status: RequirementStatus;
  acceptanceCriteria: string[]; // Verifiable conditions
  createdAt: string;
  updatedAt: string;
}
```

#### Tasks (`/projects/{projectId}/tasks/{taskId}`)
```typescript
export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'testing' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  projectId: string;
  requirementId?: string;       // Foreign key to requirement
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  assigneeName?: string;
  dueDate?: string;
  dependencies: string[];       // Array of prerequisite task IDs
  createdAt: string;
  updatedAt: string;
}
```

#### Evidence Artifacts (`/projects/{projectId}/evidence/{evidenceId}`)
```typescript
export type EvidenceType =
  | 'code_pr'
  | 'github_pr'
  | 'document'
  | 'screenshot'
  | 'test_result'
  | 'design'
  | 'dataset'
  | 'demo'
  | 'demo_video'
  | 'reflection'
  | 'external_link';

export type VerificationStatus =
  | 'unverified'
  | 'submitted'
  | 'under_review'
  | 'mentor_verified'
  | 'evaluator_verified'
  | 'needs_revision'
  | 'rejected';

export interface Evidence {
  id: string;
  projectId: string;
  ownerId: string;
  ownerName: string;
  type: EvidenceType;
  title: string;
  description: string;
  sourceType: 'upload' | 'github' | 'url' | 'manual' | 'link';
  sourceUrl?: string;
  storagePath?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  verificationStatus: VerificationStatus;
  verificationComment?: string;
  verifiedById?: string;
  verifiedByName?: string;
  verifiedAt?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}
```

#### Graph Link Edges (`/projects/{projectId}/evidenceLinks/{linkId}`)
```typescript
export interface EvidenceLink {
  id: string;
  projectId: string;
  evidenceId: string;
  targetType: 'requirement' | 'task' | 'review' | 'change_request' | 'rubric_criterion' | 'learning_outcome' | 'skill';
  targetId: string;
  relationship: 'supports' | 'implements' | 'tests' | 'reviews' | 'revises' | 'verifies' | 'demonstrates' | 'contributes_to';
  createdAt: string;
}
```

#### Change Requests (`/projects/{projectId}/changeRequests/{changeRequestId}`)
```typescript
export type ChangeRequestStatus = 'pending' | 'in_revision' | 'submitted' | 'resolved' | 'verified';

export interface ChangeRequest {
  id: string;
  projectId: string;
  reviewId: string;
  assigneeId: string;
  assigneeName: string;
  title: string;
  description: string;
  requiredEvidenceType: EvidenceType;
  dueDate: string;
  status: ChangeRequestStatus;
  resolvedEvidenceId?: string; // Points to revision evidence artifact
  createdAt: string;
  updatedAt: string;
}
```

---

## 5. System Workings & Deep-Dive Module Breakdown

### 5.1 Authentication & Multi-Role Access Control (RBAC)
ProjectFlow supports five distinct institutional roles, each with strict permission boundaries enforced by both UI router guards and Cloud Firestore Security Rules:

1. **Student (`student`):**
   - Proposes project ideas, submits requirements, creates tasks, uploads evidence artifacts, resolves change requests, and logs milestone reflections.
   - Restricted from approving evidence, altering rubric scores, or accessing institutional audit logs.
2. **Mentor / Faculty Guide (`mentor`):**
   - Conducts technical reviews, approves/rejects evidence, issues actionable Change Requests, monitors project health diagnostics, and approves student viva responses.
3. **Evaluator (`evaluator`):**
   - Conducts milestone and final defense evaluations using institutional rubrics. Uses the **"Why This Score?"** evidence explorer to verify claims.
4. **Department Admin (`dept_admin`):**
   - Manages departmental project batches, assigns faculty mentors, tracks curriculum outcome coverage (NBA/ABET), and monitors faculty review velocity.
5. **Institution Admin (`institution_admin`):**
   - Manages institutional parameters, global rubrics, system settings, and inspects the immutable audit logs.

#### Instant Demo Role Switcher
To facilitate seamless evaluation by hackathon judges, the application includes a persistent 1-click **Persona Switcher** in the top navigation bar. Clicking any demo persona switches the session state instantly with zero mock data loss:
- **Aarav Sharma (`student`)**: Lead student developer on the campus energy monitoring project.
- **Dr. Priya Raman (`mentor`)**: Faculty guide responsible for milestone reviews and technical sign-offs.
- **Prof. Rajesh Nair (`evaluator`)**: External examiner conducting capstone rubric defenses.
- **Dr. Sunita Kulkarni (`dept_admin`)**: Head of Department analyzing departmental project health.
- **Vikram Malhotra (`institution_admin`)**: Dean of Academics overseeing compliance.

---

### 5.2 Project Lifecycle & Team Coordination
Projects progress through an academic state machine:
`draft` ➔ `mentor_pending` ➔ `proposal` ➔ `approval` ➔ `active` ➔ `review` ➔ `completed` ➔ `archived`

- **Team Workspace (`/team`):** Enables student leads to invite classmates via email, designate project roles (`lead`, `member`), assign subsystem ownership (e.g., IoT Firmware Lead, ML Engineer), and verify team skill distributions.
- **Mentor Matching:** Supports formal mentor requests where students submit their project charter, and faculty guides formally accept or request adjustments prior to project kickoff.

---

### 5.3 Requirements Engineering & Kanban Task Execution
Requirements are managed with software engineering rigor (`/requirements`):
- Each requirement contains: Title, Description, Priority (`low`, `medium`, `high`, `critical`), Status (`draft`, `approved`, `in_progress`, `verified`), and concrete **Acceptance Criteria**.
- **Kanban Task Board (`/tasks`):** Features 6 operational columns (`Backlog`, `To Do`, `In Progress`, `Review`, `Testing`, `Done`).
- **Graph Linkage:** Tasks reference their parent `requirementId`. A task cannot transition to `Done` without attaching an evidence artifact, otherwise the Project Health Engine triggers a **Critical Alert**.

---

### 5.4 Evidence Subsystem & Verification Pipeline
Evidence is the primary currency of ProjectFlow (`/evidence`).
- **Supported Formats:** Code Pull Requests (`code_pr`, `github_pr`), Technical Documentation (`document`), Benchmark/Unit Tests (`test_result`), UI/UX Schematics (`design`), Data Sets (`dataset`), and Video Demos (`demo`).
- **Storage Protection:** File uploads are checked for file size (< 25MB) and validated against permitted MIME types (PDF, PNG, JPG, JSON, ZIP, DOCX).
- **Verification Pipeline:**
  ```text
  Unverified ──► Submitted ──► Under Review ──► Mentor Verified ──► Evaluator Verified
                                     │
                                     └──► Needs Revision / Rejected
  ```
- **Evidence Drawer:** A slide-over panel displaying artifact metadata, direct source links, file previews, connected tasks/requirements, and reviewer comment histories.

---

### 5.5 Mentor Review & Closed-Loop Change Requests
ProjectFlow eliminates lost feedback by turning critique into traceable tickets:
1. When a mentor reviews an artifact in the **Review Inbox (`/reviews`)**, they can approve it or select **Request Changes**.
2. Requesting changes automatically creates a **Change Request (`/changeRequests`)** with an assigned student owner, deadline, and required evidence type.
3. The student submits a revision artifact with a `revises` relationship.
4. Once the mentor verifies the revision, the Change Request is automatically marked `resolved`, closing the feedback loop.

---

### 5.6 Deterministic Project Health & Diagnostic Engine
Unlike legacy project tools that display arbitrary "70% Progress" bars, ProjectFlow's **Health Diagnostic Engine (`/health`)** uses deterministic, rule-based logic to uncover risks:

```typescript
// Deterministic Health Diagnostics Rule Engine
1. Missing Task Alert: Requirement has 0 execution tasks.
2. Missing Evidence Alert: Task marked 'DONE' but has 0 linked evidence artifacts.
3. Overdue Change Request: Mentor requested changes past due date and unresolved.
4. Untested Implementation: Code PR artifact verified without linked test_result.
5. Blocked Dependency: Task in progress depends on an uncompleted prerequisite task.
```

**Every health alert provides 4 mandatory fields:**
1. **Severity:** `info`, `warning`, or `critical`.
2. **Root Cause Reason:** Explicit explanation of why the rule fired.
3. **Linked Entity IDs:** Clickable chips linking directly to the offending requirement, task, or change request.
4. **Recommended Remedy Action:** Concrete action required to resolve the diagnostic.

---

### 5.7 Multi-Factor Contribution Assessment Engine
ProjectFlow rejects raw commit counts and task tallies, which can be gamed. The **Contribution Engine (`/contribution`)** aggregates six distinct dimensions:

1. **Verified Code Deliverables:** Completed pull requests with mentor verification.
2. **Quality Assurance & Testing:** Automated unit test outputs and test coverage reports.
3. **Design & Architectural Documents:** System architecture diagrams, database schemas, and documentation.
4. **Peer Review & Collaboration:** Constructive technical reviews given to teammates' work.
5. **Metacognitive Milestone Reflections:** Submitted journals documenting technical hurdles and problem-solving steps.
6. **Defense & Viva Mastery:** Evidence-grounded viva responses scored during evaluations.

The UI displays an explainable timeline of verified evidence per student, giving evaluators full visibility into individual ownership.

---

### 5.8 Evidence-Grounded Viva Voce Engine
Viva voce (defense) examinations are frequently subjective or generic. ProjectFlow's Viva Engine formulates questions **strictly derived from the student's verified artifacts**:

- **Example Code Viva:** Formulates architecture questions citing specific PRs: *"In artifact PR #14 (FastAPI Sensor Ingestion Pipeline), explain how asynchronous worker pools were configured to prevent backpressure under load."*
- **Example Testing Viva:** Formulates verification questions citing test reports: *"In test report artifact #8 (Energy Disaggregation Unit Tests), what edge cases caused initial assertion failures and how did you resolve them?"*

Evaluators can grade student answers on a 5-point scale and record notes directly in the platform.

---

### 5.9 Academic Rubric Evaluation & "Why This Score?" Traversal
Examiners grade projects using institutional, weighted rubrics (`/evaluation`).
- Each criterion contains a name, description, weightage, and maximum score.
- **The "Why This Score?" Bidirectional Explorer:** Clicking this button opens a modal showing the entire evidence chain supporting the score:
  ```text
  [Criterion: Architecture & Scalability (20%)]
         ▲
         └── [Linked Evidence: Fast-API Backend PR #14 (Mentor Verified)]
                   ▲
                   └── [Task: Implement Ingestion REST Microservice (Done)]
                             ▲
                             └── [Requirement: REQ-02 Sub-second Sensor Ingestion]
                                       ▲
                                       └── [Mentor Review: Approved by Dr. Priya Raman]
  ```

---

### 5.10 Institutional Learning Outcomes & Competency Framework
ProjectFlow supports international engineering accreditation standards (ABET, NBA) via `/outcomes`:
- **Course Outcomes (COs):** Specific technical proficiencies gained in the course.
- **Program Outcomes (POs):** Graduate attributes (e.g., PO-1 Engineering Knowledge, PO-3 Design & Development, PO-5 Modern Tool Usage).
- **Program Specific Outcomes (PSOs):** Domain-specific competencies (e.g., IoT Systems, Distributed Cloud Computing).
- **Bloom's Taxonomy Levels:** Analyzed (`Analyze`, `Evaluate`, `Create`) and mapped directly to verified artifacts.

---

### 5.11 GitHub Integration & Automated Webhook Ingestion
The platform includes an automated GitHub App connector (`functions/src/github.ts` and `/integrations`):
1. **GitHub App Installation:** One-click OAuth handshake linking a GitHub repository to a ProjectFlow workspace.
2. **Webhook Listener (`/githubWebhook`):** Listens for `pull_request`, `push`, and `issues` events.
3. **HMAC Signature Verification:** Verifies incoming webhook payloads using SHA-256 HMAC digest validation.
4. **Automatic Evidence Generation:** When a PR tagged with a task ID (e.g., `fixes #TASK-102`) is merged, ProjectFlow automatically registers a `code_pr` evidence artifact and transitions the task to `Review`.

---

### 5.12 Student Verified Portfolio
Located at `/portfolio`, this feature generates an exportable, tamper-evident academic CV. Unlike LinkedIn or resumes where skills are self-proclaimed, every skill badge and milestone in the ProjectFlow portfolio is hyperlinked to a verified artifact in the Evidence Graph.

---

### 5.13 Idea Marketplace & Collaboration Hub
Located at `/ideas`, students and faculty can propose project concepts, specify domain tags (AI/ML, IoT, Web3, Healthcare), and outline prerequisite technical skills. Students seeking capstone groups can submit join requests with personalized intro notes.

---

### 5.14 Immutable Audit Trails & Compliance
Located at `/admin` and backed by the root `/auditLogs` collection, all sensitive lifecycle actions (evidence verification, rubric adjustments, grade finalization, role modifications) are immutably logged with actor UID, timestamp, IP context, and diff snapshots.

---

## 6. Grounded AI Architecture & Safety Rules

ProjectFlow incorporates serverless AI assistance under strict academic grounding guidelines (`docs/AI.md`):

### 6.1 Core Grounding Principles
1. **Evidence Precedence:** The AI only reasons over verified project documents in the Firestore database. It is forbidden from hallucinating facts.
2. **Citation Requirement:** Every AI-generated summary, viva question, or health diagnostic must output the explicit Firestore `evidenceId` or `taskId` backing its output.
3. **Human-in-the-Loop:** AI proposals (such as breaking down requirements into tasks or converting mentor comments into change requests) always require explicit human approval before being committed to the database.

---

## 7. Cloud Functions & Serverless API Reference

Backend compute is powered by Firebase Cloud Functions v2 (`functions/src/index.ts`):

### 7.1 `updateProjectHealth` (Callable HTTPS)
- **Description:** Deterministically evaluates missing tasks, unlinked evidence, overdue change requests, and dependency blocks.
- **Input:** `{ projectId: string }`
- **Output:** `{ success: boolean, alertsCount: number, alerts: HealthAlert[] }`

### 7.2 `calculateContributionSnapshot` (Callable HTTPS)
- **Description:** Aggregates verified tasks, code PRs, unit tests, peer reviews, and milestone reflections into a multidimensional profile.
- **Input:** `{ projectId: string, userId: string }`
- **Output:** `{ userId, projectId, breakdown: {...}, explainableSummary: string[] }`

### 7.3 `generateEvidenceGroundedViva` (Callable HTTPS)
- **Description:** Inspects verified student code and test artifacts to synthesize contextual defense questions.
- **Input:** `{ projectId: string, studentId: string }`
- **Output:** `{ success: boolean, count: number, questions: VivaQuestion[] }`

### 7.4 `githubCallback` & `githubWebhook` (HTTP Endpoints)
- **Description:** Manages GitHub App OAuth installation redirections and ingests live commit/PR webhooks with cryptographic HMAC verification.

---

## 8. Security, Isolation & Storage Rules

### 8.1 Multi-Tenant Isolation
Every query is scoped by `institutionId` and `projectId`. Cross-institutional data access is strictly blocked at the database engine level via `firestore.rules`.

### 8.2 Firestore Security Policy Highlights
```javascript
// Access control excerpt from firestore.rules
function isMemberOfProject(projectId) {
  let projectData = get(/databases/$(database)/documents/projects/$(projectId)).data;
  return isAuthenticated() && (
    request.auth.uid == projectData.createdBy ||
    request.auth.uid in projectData.memberIds ||
    getUserRole() in ['mentor', 'evaluator', 'dept_admin', 'institution_admin']
  );
}

function isProjectMentor(projectId) {
  let projectData = get(/databases/$(database)/documents/projects/$(projectId)).data;
  return isAuthenticated() && (
    request.auth.uid == projectData.mentorId ||
    getUserRole() in ['mentor', 'dept_admin', 'institution_admin']
  );
}
```

### 8.3 Storage Security Rules
Enforced in `storage.rules`:
- Maximum file size: **25 MB**.
- Permitted MIME types: `application/pdf`, `image/*`, `text/*`, `application/json`, `application/zip`, `application/vnd.openxmlformats-officedocument.*`.
- File execution: All uploaded files are stored as binary blobs with content disposition preventing in-browser execution.

---

## 9. Installation, Configuration & Testing Guide

### 9.1 Prerequisites
- **Node.js:** v18.0.0 or v20.x
- **npm:** v9.x or higher
- **Firebase CLI:** `npm install -g firebase-tools` (optional for cloud deployment)

### 9.2 Local Development Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Belginlino/ProjectFlow.git
   cd ProjectFlow
   ```

2. **Configure Environment Variables:**
   Copy `.env.example` to `frontend/.env` and populate your Firebase project credentials:
   ```env
   VITE_FIREBASE_API_KEY="your-api-key"
   VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
   VITE_FIREBASE_PROJECT_ID="your-project-id"
   VITE_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
   VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
   VITE_FIREBASE_APP_ID="your-app-id"
   ```

3. **Install Dependencies & Start Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The application will be live at `http://localhost:5173`.

4. **Run System Integrity & Graph Invariant Tests:**
   In the project root:
   ```bash
   node --test tests/system_integrity.test.mjs
   ```
   *Validates all graph traversals, data model invariants, and deterministic health rules.*

5. **Build for Production:**
   ```bash
   cd frontend
   npm run build
   ```
   Produces an optimized production bundle in `frontend/dist/`.

---

## 10. End-to-End Golden Demo Walkthrough

Follow this sequence to demonstrate the complete academic lifecycle to judges:

| Step | Persona | Action | Verification Check |
| :--- | :--- | :--- | :--- |
| **1** | **Student** (Aarav) | Navigate to `/requirements`. View acceptance criteria for *"REQ-01: Real-time IoT Ingestion"*. | Requirements are verified and linked to tasks. |
| **2** | **Student** (Aarav) | Go to `/tasks`. Drag a task from `Review` to `Done`. | Task links to verified GitHub Pull Request artifact. |
| **3** | **Mentor** (Dr. Priya) | Switch to Mentor role. Go to `/reviews`. Inspect PR #14. Click **Request Change** and specify *"Add rate-limiting tests"*. | Generates a new Change Request ticket in `/changeRequests`. |
| **4** | **Student** (Aarav) | Switch to Student role. View `/changeRequests`. Upload revised test artifact. | Change Request transitions to `Resolved`. |
| **5** | **Mentor** (Dr. Priya) | Switch to Mentor role. Go to `/health`. | View deterministic alerts: explainable reason, entity chips, and remedy action. |
| **6** | **Evaluator** (Prof. Rajesh)| Switch to Evaluator role. Go to `/contribution`. Select student. | Inspect multi-factor evidence timeline and auto-generated Viva Voce questions. |
| **7** | **Evaluator** (Prof. Rajesh)| Go to `/evaluation`. Click **"Why this score?"** on Criterion 1. | Inspect bidirectional traversal: Score ➔ Evidence ➔ Task ➔ Requirement ➔ Mentor Sign-off. |
| **8** | **Student** (Aarav) | Open `/portfolio`. | Review exportable verified evidence portfolio. |

---

## 11. Summary of Project Differentiators

| Capability | Generic Tools (Jira / Trello / Moodle) | ProjectFlow Academic Intelligence |
| :--- | :--- | :--- |
| **Task Completion** | Simple checkbox ("Done") | Requires attached, verifiable evidence artifact |
| **Contribution Tracking** | Commits count / task counts (easily gamed) | Multi-factor qualitative synthesis (code, tests, docs, reviews, reflections) |
| **Mentor Feedback** | Disconnected comments or emails | Structured Change Requests resolved by revision evidence |
| **Project Health** | Opaque percentage progress bars | Deterministic rule-based diagnostics with root cause and remedy actions |
| **Viva Examination** | Ad-hoc, subjective questioning | Auto-generated defense questions citing student's actual code and test artifacts |
| **Grading Transparency**| Isolated rubric score numbers | **"Why This Score?"** bidirectional traversal down to raw source code and tests |
| **Accreditation** | Disconnected manual spreadsheets | Native mapping to ABET / NBA Course & Program Outcomes (CO/PO/PSO) |
