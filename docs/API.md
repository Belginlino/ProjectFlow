# ProjectFlow API and Firebase Service Layer

ProjectFlow uses Firebase SDKs for normal client operations and Firebase Cloud Functions for trusted server-side operations.

## Client
- Firebase Authentication SDK
- Firestore SDK
- Firebase Storage SDK

All client operations are governed by Firebase Security Rules.

## Cloud Functions
Suggested functions:
- `createProject`, `archiveProject`, `updateProjectHealth`
- `registerEvidence`, `verifyEvidence`, `linkEvidence`
- `submitReview`, `createChangeRequest`, `verifyRevision`
- `calculateContributionSnapshot`
- `generateEvaluationContext`, `finalizeEvaluation`
- `summarizeEvidence`, `generateEvidenceGroundedViva`, `identifyMissingEvidence`
- `syncGitHubActivity`

## Rules
Validate inputs, authenticate identity, enforce project/institution membership and roles, never trust client-provided contribution/evaluation totals, keep AI evidence-grounded, and log sensitive operations.
