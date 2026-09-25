# Testing Strategy

## Unit
Validation, health rules, contribution aggregation, permissions and evidence-link logic.

## API
Authentication, authorization, CRUD, invalid input, cross-project access and pagination.

## Integration
Test the golden path:
Create project → requirement → task → evidence → review → change request → revision → verification → evaluation → viva.

## UI
Navigation, forms, loading, empty/error states, evidence drawer and evaluation.

## Accessibility
Keyboard, focus, labels, contrast, screen-reader smoke tests and reduced motion.

## Security
IDOR, privilege escalation, upload security, auth bypass, injection and secret exposure.

## AI
Grounding, evidence references, hallucination rate, relevance, unsafe output and human approval.

## MVP acceptance
A complete project must be able to move from requirement creation through evidence, mentor review, revision, contribution, viva and evaluation without leaving the platform.
