import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// Test Core Domain Logic & Evidence Graph Invariants
describe('ProjectFlow Evidence Graph & Core Domain Invariants', () => {

  const mockProject = {
    id: 'proj-ai-attendance-01',
    status: 'active',
  };

  const mockRequirements = [
    { id: 'req-01', title: 'REQ-01: Face Embedding', status: 'verified' },
    { id: 'req-02', title: 'REQ-02: Anti-Spoofing', status: 'in_progress' },
    { id: 'req-03', title: 'REQ-03: Stress Testing', status: 'draft' },
  ];

  const mockTasks = [
    { id: 'task-101', requirementId: 'req-01', status: 'done', assigneeId: 'usr-aarav' },
    { id: 'task-102', requirementId: 'req-01', status: 'done', assigneeId: 'usr-aarav' },
    { id: 'task-103', requirementId: 'req-02', status: 'in_progress', assigneeId: 'usr-diya' },
    // req-03 has NO tasks
  ];

  const mockEvidence = [
    { id: 'evd-01', type: 'code_pr', title: 'PR #12', ownerId: 'usr-aarav', verificationStatus: 'submitted' },
    { id: 'evd-02', type: 'test_result', title: 'Benchmark v1', ownerId: 'usr-aarav', verificationStatus: 'submitted' },
    { id: 'evd-03', type: 'code_pr', title: 'PR #18 Revision', ownerId: 'usr-aarav', verificationStatus: 'mentor_verified', verifiedByName: 'Dr. Priya Raman' },
    { id: 'evd-04', type: 'test_result', title: 'Benchmark v2 97.4%', ownerId: 'usr-aarav', verificationStatus: 'mentor_verified', verifiedByName: 'Dr. Priya Raman' },
  ];

  const mockLinks = [
    { id: 'link-1', evidenceId: 'evd-01', entityType: 'task', entityId: 'task-101', relationshipType: 'implements' },
    { id: 'link-2', evidenceId: 'evd-02', entityType: 'task', entityId: 'task-101', relationshipType: 'tests' },
    { id: 'link-3', evidenceId: 'evd-03', entityType: 'change_request', entityId: 'cr-01', relationshipType: 'revises' },
    { id: 'link-4', evidenceId: 'evd-04', entityType: 'task', entityId: 'task-102', relationshipType: 'verifies' },
    { id: 'link-5', evidenceId: 'evd-04', entityType: 'requirement', entityId: 'req-01', relationshipType: 'supports' },
  ];

  test('Rule 1: Task completion is NOT equal to verified evidence', () => {
    const task101 = mockTasks.find(t => t.id === 'task-101');
    assert.equal(task101.status, 'done');

    const linkedEvidence = mockLinks
      .filter(l => l.entityType === 'task' && l.entityId === task101.id)
      .map(l => mockEvidence.find(e => e.id === l.evidenceId));

    // Both evd-01 and evd-02 are merely 'submitted', not 'mentor_verified'
    assert.ok(linkedEvidence.every(e => e.verificationStatus !== 'mentor_verified'));
  });

  test('Rule 2: "Why This Score?" graph traversal resolves full academic chain', () => {
    const criterionScore = {
      criterionId: 'crit-ml-accuracy',
      score: 9.5,
      evidenceIds: ['evd-04'],
    };

    // Traversal: Score -> Evidence -> Task -> Requirement -> Verifier
    const attachedEv = mockEvidence.find(e => criterionScore.evidenceIds.includes(e.id));
    assert.ok(attachedEv, 'Evidence item must exist');
    assert.equal(attachedEv.verificationStatus, 'mentor_verified');

    const taskLink = mockLinks.find(l => l.evidenceId === attachedEv.id && l.entityType === 'task');
    assert.ok(taskLink, 'Must traverse to execution task');
    assert.equal(taskLink.entityId, 'task-102');

    const reqLink = mockLinks.find(l => l.evidenceId === attachedEv.id && l.entityType === 'requirement');
    assert.ok(reqLink, 'Must traverse to originating requirement');
    assert.equal(reqLink.entityId, 'req-01');

    assert.equal(attachedEv.verifiedByName, 'Dr. Priya Raman');
  });

  test('Rule 3: Deterministic health engine flags missing tasks and missing tests', () => {
    // 1. Detect requirement without tasks
    const taskReqIds = new Set(mockTasks.map(t => t.requirementId));
    const missingTaskReqs = mockRequirements.filter(r => !taskReqIds.has(r.id));
    assert.equal(missingTaskReqs.length, 1);
    assert.equal(missingTaskReqs[0].id, 'req-03');

    // 2. Detect requirement in progress without test results
    const testEvidenceIds = new Set(mockEvidence.filter(e => e.type === 'test_result').map(e => e.id));
    const testedReqIds = new Set(
      mockLinks
        .filter(l => l.entityType === 'requirement' && testEvidenceIds.has(l.evidenceId))
        .map(l => l.entityId)
    );
    const inProgressUnverifiedReqs = mockRequirements.filter(
      r => r.status === 'in_progress' && !testedReqIds.has(r.id)
    );
    assert.equal(inProgressUnverifiedReqs.length, 1);
    assert.equal(inProgressUnverifiedReqs[0].id, 'req-02');
  });

  test('Rule 4: Multi-factor contribution synthesizes verified evidence without vanity leaderboards', () => {
    const userAaravEvidence = mockEvidence.filter(e => e.ownerId === 'usr-aarav');
    const verified = userAaravEvidence.filter(e => e.verificationStatus === 'mentor_verified');

    assert.equal(userAaravEvidence.length, 4);
    assert.equal(verified.length, 2);

    const codeCount = verified.filter(e => e.type === 'code_pr').length;
    const testCount = verified.filter(e => e.type === 'test_result').length;

    assert.equal(codeCount, 1);
    assert.equal(testCount, 1);

    // Contribution is an explainable profile, not an opaque score
    const explainableReport = [
      `Implementation: Supported by ${codeCount} verified PRs.`,
      `Quality Assurance: Supported by ${testCount} verified test suites.`,
    ];
    assert.equal(explainableReport.length, 2);
  });

  test('Rule 5: Grounded viva questions cite actual verified evidence IDs', () => {
    const studentVerified = mockEvidence.filter(
      e => e.ownerId === 'usr-aarav' && e.verificationStatus === 'mentor_verified'
    );

    const generatedQuestions = studentVerified.map(ev => ({
      question: `In artifact "${ev.title}", describe architectural tradeoffs.`,
      sourceEvidenceId: ev.id,
      isApproved: false,
    }));

    assert.equal(generatedQuestions.length, 2);
    assert.equal(generatedQuestions[0].sourceEvidenceId, 'evd-03');
    assert.equal(generatedQuestions[1].sourceEvidenceId, 'evd-04');
    assert.equal(generatedQuestions[0].isApproved, false, 'Human-in-the-loop approval required');
  });
});
