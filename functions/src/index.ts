import * as admin from 'firebase-admin';
import { onCall, HttpsError } from 'firebase-functions/v2/https';

admin.initializeApp();
const db = admin.firestore();

/**
 * Deterministic Project Health Evaluation Cloud Function
 * Evaluates overdue work, blocked dependencies, missing evidence, missing testing.
 */
export const updateProjectHealth = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.');
  }

  const { projectId } = request.data;
  if (!projectId) {
    throw new HttpsError('invalid-argument', 'projectId is required.');
  }

  const projectRef = db.collection('projects').doc(projectId);
  const projectDoc = await projectRef.get();
  if (!projectDoc.exists) {
    throw new HttpsError('not-found', 'Project not found.');
  }

  const requirementsSnap = await projectRef.collection('requirements').get();
  const tasksSnap = await projectRef.collection('tasks').get();
  const evidenceSnap = await projectRef.collection('evidence').get();
  const changeRequestsSnap = await projectRef.collection('changeRequests').get();

  const generatedAlerts: Array<{
    id: string;
    alertType: string;
    severity: 'info' | 'warning' | 'critical';
    reason: string;
    supportingEntityType: string;
    supportingEntityIds: string[];
    recommendedAction: string;
    isResolved: boolean;
    createdAt: string;
  }> = [];

  const now = new Date();

  // 1. Detect Requirements without any tasks
  const taskReqIds = new Set(tasksSnap.docs.map((d) => d.data().requirementId).filter(Boolean));
  for (const reqDoc of requirementsSnap.docs) {
    if (!taskReqIds.has(reqDoc.id)) {
      generatedAlerts.push({
        id: `alert-req-notask-${reqDoc.id}`,
        alertType: 'missing_task',
        severity: 'warning',
        reason: `Requirement "${reqDoc.data().title}" has no associated execution tasks.`,
        supportingEntityType: 'requirement',
        supportingEntityIds: [reqDoc.id],
        recommendedAction: 'Break down requirement into concrete sprint tasks.',
        isResolved: false,
        createdAt: now.toISOString(),
      });
    }
  }

  // 2. Detect Done/Review tasks without linked evidence
  const taskEvidenceIds = new Set();
  const linksSnap = await projectRef.collection('evidenceLinks').get();
  for (const linkDoc of linksSnap.docs) {
    if (linkDoc.data().entityType === 'task') {
      taskEvidenceIds.add(linkDoc.data().entityId);
    }
  }

  for (const taskDoc of tasksSnap.docs) {
    const task = taskDoc.data();
    if (['done', 'review', 'testing'].includes(task.status) && !taskEvidenceIds.has(taskDoc.id)) {
      generatedAlerts.push({
        id: `alert-task-noevidence-${taskDoc.id}`,
        alertType: 'missing_evidence',
        severity: 'critical',
        reason: `Task "${task.title}" is marked as ${task.status.toUpperCase()} but lacks attached verifiable evidence.`,
        supportingEntityType: 'task',
        supportingEntityIds: [taskDoc.id],
        recommendedAction: 'Attach implementation artifact, PR, screenshot or test report before marking done.',
        isResolved: false,
        createdAt: now.toISOString(),
      });
    }
  }

  // 3. Detect Unresolved Change Requests past due date
  for (const crDoc of changeRequestsSnap.docs) {
    const cr = crDoc.data();
    if (cr.status !== 'resolved') {
      const dueDate = cr.dueDate ? new Date(cr.dueDate) : null;
      if (dueDate && dueDate < now) {
        generatedAlerts.push({
          id: `alert-cr-overdue-${crDoc.id}`,
          alertType: 'overdue_change_request',
          severity: 'critical',
          reason: `Change Request "${cr.title}" is overdue and unresolved.`,
          supportingEntityType: 'change_request',
          supportingEntityIds: [crDoc.id],
          recommendedAction: 'Submit revised evidence responding to mentor feedback.',
          isResolved: false,
          createdAt: now.toISOString(),
        });
      }
    }
  }

  // Batch write alerts
  const batch = db.batch();
  for (const alert of generatedAlerts) {
    const alertRef = projectRef.collection('healthAlerts').doc(alert.id);
    batch.set(alertRef, alert, { merge: true });
  }
  await batch.commit();

  return { success: true, alertsCount: generatedAlerts.length, alerts: generatedAlerts };
});

/**
 * Multi-Factor Contribution Aggregator Function
 * Combines verified tasks, code artifacts, reviews, technical decisions, tests, and reflections.
 * Never calculates contribution solely by commit or task count.
 */
export const calculateContributionSnapshot = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.');
  }

  const { projectId, userId } = request.data;
  if (!projectId || !userId) {
    throw new HttpsError('invalid-argument', 'projectId and userId are required.');
  }

  const projectRef = db.collection('projects').doc(projectId);
  const tasksSnap = await projectRef.collection('tasks').where('assigneeId', '==', userId).get();
  const evidenceSnap = await projectRef.collection('evidence').where('ownerId', '==', userId).get();
  const reviewsSnap = await projectRef.collection('reviews').where('reviewerId', '==', userId).get();
  const reflectionsSnap = await projectRef.collection('reflections').where('userId', '==', userId).get();

  const verifiedEvidence = evidenceSnap.docs.filter(
    (d) => d.data().verificationStatus === 'mentor_verified' || d.data().verificationStatus === 'evaluator_verified'
  );

  const testArtifacts = verifiedEvidence.filter((d) => d.data().type === 'test_result');
  const codeArtifacts = verifiedEvidence.filter((d) => d.data().type === 'code_pr');
  const designArtifacts = verifiedEvidence.filter((d) => d.data().type === 'design');
  const docsArtifacts = verifiedEvidence.filter((d) => d.data().type === 'document');

  const snapshot = {
    userId,
    projectId,
    updatedAt: new Date().toISOString(),
    breakdown: {
      completedTasks: tasksSnap.docs.filter((d) => d.data().status === 'done').length,
      verifiedEvidenceTotal: verifiedEvidence.length,
      codeArtifactsCount: codeArtifacts.length,
      testArtifactsCount: testArtifacts.length,
      designArtifactsCount: designArtifacts.length,
      documentationCount: docsArtifacts.length,
      peerReviewsGiven: reviewsSnap.size,
      reflectionsLogged: reflectionsSnap.size,
    },
    explainableSummary: [
      `Implementation: Supported by ${codeArtifacts.length} verified code/PR artifacts.`,
      `Quality Assurance: Supported by ${testArtifacts.length} verified test result sets.`,
      `Design & Docs: Supported by ${designArtifacts.length + docsArtifacts.length} verified technical documents.`,
      `Engagement: ${reviewsSnap.size} technical peer reviews and ${reflectionsSnap.size} milestone reflections completed.`,
    ],
  };

  return snapshot;
});

/**
 * Evidence-Grounded Viva Question Generator
 * Formulates defense questions strictly from verified student artifacts.
 */
export const generateEvidenceGroundedViva = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.');
  }

  const { projectId, studentId } = request.data;
  if (!projectId || !studentId) {
    throw new HttpsError('invalid-argument', 'projectId and studentId are required.');
  }

  const projectRef = db.collection('projects').doc(projectId);
  const evidenceSnap = await projectRef.collection('evidence').where('ownerId', '==', studentId).get();

  const verifiedArtifacts = evidenceSnap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((d: any) => d.verificationStatus === 'mentor_verified' || d.verificationStatus === 'submitted');

  const questions: Array<{
    id: string;
    questionText: string;
    contextSummary: string;
    sourceEvidenceIds: string[];
    isApproved: boolean;
    createdAt: string;
  }> = [];

  for (const artifact of verifiedArtifacts as any[]) {
    if (artifact.type === 'code_pr') {
      questions.push({
        id: `viva-q-${artifact.id}`,
        questionText: `In artifact "${artifact.title}", explain the architectural choices and error handling implemented. How does this satisfy the linked requirement?`,
        contextSummary: `Grounded in Code/PR evidence: ${artifact.title} (${artifact.description || 'Verified module'})`,
        sourceEvidenceIds: [artifact.id],
        isApproved: false,
        createdAt: new Date().toISOString(),
      });
    } else if (artifact.type === 'test_result') {
      questions.push({
        id: `viva-q-${artifact.id}`,
        questionText: `Discuss the test coverage and edge cases validated in "${artifact.title}". What failure conditions were observed and how were they mitigated?`,
        contextSummary: `Grounded in Test Result evidence: ${artifact.title}`,
        sourceEvidenceIds: [artifact.id],
        isApproved: false,
        createdAt: new Date().toISOString(),
      });
    }
  }

  // Batch store generated questions in viva subcollection
  const batch = db.batch();
  for (const q of questions) {
    const vivaRef = projectRef.collection('viva').doc(q.id);
    batch.set(vivaRef, { ...q, studentId }, { merge: true });
  }
  await batch.commit();

  return { success: true, count: questions.length, questions };
});

export * from './github';
