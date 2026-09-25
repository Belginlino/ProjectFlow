# ProjectFlow Firebase Data Model

## Database Choice
ProjectFlow uses **Cloud Firestore** as its primary application database.

## Main Collections
- `users` — profile, institution membership, role metadata
- `institutions` — institution configuration
- `projects` — project identity and lifecycle
- `projects/{projectId}/requirements` — requirements/outcomes
- `projects/{projectId}/tasks` — planned work
- `projects/{projectId}/evidence` — proof of work
- `projects/{projectId}/evidenceLinks` — graph relationships
- `projects/{projectId}/reviews` — mentor/peer/instructor reviews
- `projects/{projectId}/changeRequests` — actionable feedback
- `projects/{projectId}/reflections` — learning reflections
- `projects/{projectId}/evaluations` — rubric-based evaluation
- `projects/{projectId}/viva` — evidence-grounded viva records
- `projects/{projectId}/healthAlerts` — explainable health alerts
- `auditLogs` — important lifecycle/security actions

## Evidence Graph
Requirement → Task → Evidence → Review → Change Request → Revision → Verification → Contribution → Evaluation → Learning Outcome

Use stable IDs/document references for relationships. Avoid uncontrolled duplication of authoritative data.

## Security
All client reads/writes are protected by Firestore Security Rules. Server-only operations use Cloud Functions with the Admin SDK.

## Integrity
Use Firestore transactions/batched writes where related documents must change atomically. Use trusted Functions for cross-document workflows and derived metrics.

## Indexing
Create composite indexes only for real query patterns, such as project + status + updatedAt, project + assignee + status, and project + reviewer + status.

## Files
Store evidence files in Firebase Storage. Firestore stores metadata such as storage path, filename, MIME type, size, checksum when useful, uploader, timestamp, evidence type, and linked entity.
