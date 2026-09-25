# Project Evidence Graph

## Purpose
The Evidence Graph is ProjectFlow's central product concept. It connects project execution to verifiable evidence.

## Core graph

```text
Project
  ↓
Requirement
  ↓
Task
  ↓
Evidence
  ↓
Review
  ↓
Change Request
  ↓
Revision Evidence
  ↓
Verification
  ↓
Contribution
  ↓
Rubric Criterion
  ↓
Learning Outcome
```

## Evidence timeline
Show:
Requirement created → task assigned → artifact submitted → review → revision → test → verification.

## Missing evidence
Detect:
- requirement with no task
- task with no evidence
- evidence with no verification
- implementation without testing
- review with unresolved change request

## Why this score?
Traverse:
criterion → evidence → task → requirement → review/revision.

## MVP implementation
Use Firebase Firestore plus `evidence_links`. A graph database is not required for MVP.
