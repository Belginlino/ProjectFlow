import {
  Project,
  Requirement,
  Task,
  Evidence,
  EvidenceLink,
  Review,
  ChangeRequest,
  HealthAlert,
  Evaluation,
  Rubric,
  VivaQuestion,
  LearningOutcome,
  Skill,
  Reflection,
  AuditLog,
  TaskStatus,
  VerificationStatus,
  ProjectIdea,
  AppNotification,
  MentorRequest,
  ProjectStatus,
} from '../types';

import {
  INITIAL_PROJECT,
  INITIAL_REQUIREMENTS,
  INITIAL_TASKS,
  INITIAL_EVIDENCE,
  INITIAL_EVIDENCE_LINKS,
  INITIAL_REVIEWS,
  INITIAL_CHANGE_REQUESTS,
  INITIAL_HEALTH_ALERTS,
  INITIAL_RUBRICS,
  INITIAL_EVALUATIONS,
  INITIAL_VIVA_QUESTIONS,
  INITIAL_OUTCOMES,
  INITIAL_SKILLS,
  INITIAL_REFLECTIONS,
  INITIAL_IDEAS,
  INITIAL_NOTIFICATIONS,
} from './seedData';

class ProjectFlowDataService {
  private currentUserContext: any = null;

  public setCurrentUserContext(user: any) {
    this.currentUserContext = user;
  }

  private projects: Project[] = [];
  private requirements: Requirement[] = [];
  private tasks: Task[] = [];
  private evidence: Evidence[] = [];
  private evidenceLinks: EvidenceLink[] = [];
  private reviews: Review[] = [];
  private changeRequests: ChangeRequest[] = [];
  private healthAlerts: HealthAlert[] = [];
  private rubrics: Rubric[] = [];
  private evaluations: Evaluation[] = [];
  private vivaQuestions: VivaQuestion[] = [];
  private outcomes: LearningOutcome[] = [];
  private skills: Skill[] = [];
  private reflections: Reflection[] = [];
  private auditLogs: AuditLog[] = [];
  private ideas: ProjectIdea[] = [];
  private notifications: AppNotification[] = [];
  private mentorRequests: MentorRequest[] = [];
  private institutions: string[] = ['Apex Institute of Technology', 'SXCCE'];

  constructor() {
    this.loadFromStorage();
  }

  public seedInitialData() {
    this.projects = [INITIAL_PROJECT];
    this.requirements = [...INITIAL_REQUIREMENTS];
    this.tasks = [...INITIAL_TASKS];
    this.evidence = [...INITIAL_EVIDENCE];
    this.evidenceLinks = [...INITIAL_EVIDENCE_LINKS];
    this.reviews = [...INITIAL_REVIEWS];
    this.changeRequests = [...INITIAL_CHANGE_REQUESTS];
    this.healthAlerts = [...INITIAL_HEALTH_ALERTS];
    this.rubrics = [...INITIAL_RUBRICS];
    this.evaluations = [...INITIAL_EVALUATIONS];
    this.vivaQuestions = [...INITIAL_VIVA_QUESTIONS];
    this.outcomes = [...INITIAL_OUTCOMES];
    this.skills = [...INITIAL_SKILLS];
    this.reflections = [...INITIAL_REFLECTIONS];
    this.ideas = [...INITIAL_IDEAS];
    this.notifications = [...INITIAL_NOTIFICATIONS];
    this.auditLogs = [];
    this.saveToStorage();
  }

  public resetDemoData() {
    localStorage.removeItem('projectflow_data_store_v2');
    this.seedInitialData();
  }

  public loadSampleProject() {
    this.seedInitialData();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('projectflow_data_store_v2');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.projects && parsed.projects.length > 0) {
          this.projects = parsed.projects;
          if (parsed.requirements) this.requirements = parsed.requirements;
          if (parsed.tasks) this.tasks = parsed.tasks;
          if (parsed.evidence) this.evidence = parsed.evidence;
          if (parsed.evidenceLinks) this.evidenceLinks = parsed.evidenceLinks;
          if (parsed.reviews) this.reviews = parsed.reviews;
          if (parsed.changeRequests) this.changeRequests = parsed.changeRequests;
          if (parsed.healthAlerts) this.healthAlerts = parsed.healthAlerts;
          if (parsed.rubrics) this.rubrics = parsed.rubrics;
          if (parsed.evaluations) this.evaluations = parsed.evaluations;
          if (parsed.vivaQuestions) this.vivaQuestions = parsed.vivaQuestions;
          if (parsed.outcomes) this.outcomes = parsed.outcomes;
          if (parsed.skills) this.skills = parsed.skills;
          if (parsed.reflections) this.reflections = parsed.reflections;
          if (parsed.auditLogs) this.auditLogs = parsed.auditLogs;
          if (parsed.ideas) this.ideas = parsed.ideas;
          if (parsed.notifications) this.notifications = parsed.notifications;
          if (parsed.mentorRequests) this.mentorRequests = parsed.mentorRequests;
          if (parsed.institutions) this.institutions = parsed.institutions;
          return;
        }
      }
      this.seedInitialData();
    } catch {
      this.seedInitialData();
    }
  }

  private saveToStorage() {
    try {
      const payload = {
        projects: this.projects,
        requirements: this.requirements,
        tasks: this.tasks,
        evidence: this.evidence,
        evidenceLinks: this.evidenceLinks,
        reviews: this.reviews,
        changeRequests: this.changeRequests,
        healthAlerts: this.healthAlerts,
        rubrics: this.rubrics,
        evaluations: this.evaluations,
        vivaQuestions: this.vivaQuestions,
        outcomes: this.outcomes,
        skills: this.skills,
        reflections: this.reflections,
        auditLogs: this.auditLogs,
        ideas: this.ideas,
        notifications: this.notifications,
        mentorRequests: this.mentorRequests,
        institutions: this.institutions,
      };
      localStorage.setItem('projectflow_data_store_v2', JSON.stringify(payload));
    } catch {
      // ignore
    }
  }

  public logAudit(userId: string, userName: string, action: string, entityType: string, entityId?: string, details?: any) {
    const entry: AuditLog = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      institutionId: 'inst-ait-01',
      userId,
      userName,
      action,
      entityType,
      entityId,
      details,
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.unshift(entry);
    this.saveToStorage();
  }

  public getAuditLogs(): AuditLog[] {
    return [...this.auditLogs];
  }

  // --- PROJECTS ---
  public getProjects(): Project[] {
    const user = this.currentUserContext;
    if (!user) return [...this.projects];
    
    if (user.role === 'institution_admin' || user.role === 'dept_admin') {
      return this.projects.filter(p => p.institutionId === user.institutionId);
    }
    
    return this.projects.filter(p => 
      p.team.members.some(m => m.uid === user.id) || 
      p.mentorId === user.id ||
      p.createdBy === user.id
    );
  }


  public getProject(id: string): Project | undefined {
    return this.projects.find((p) => p.id === id);
  }

  public createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>, userId: string, userName: string): Project {
    const newProj: Project = {
      ...project,
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.projects.push(newProj);
    this.logAudit(userId, userName, 'CREATE_PROJECT', 'project', newProj.id, { title: newProj.title });
    this.saveToStorage();
    return newProj;
  }

  public updateProjectStatus(projectId: string, status: ProjectStatus, userId: string, userName: string): Project {
    const p = this.getProject(projectId);
    if (!p) throw new Error('Project not found');
    p.status = status;
    p.updatedAt = new Date().toISOString();
    this.logAudit(userId, userName, 'UPDATE_PROJECT_STATUS', 'project', projectId, { status });
    this.saveToStorage();
    return p;
  }

  // --- MENTOR REQUESTS ---
  public getMentorRequestsForProject(projectId: string): MentorRequest[] {
    return this.mentorRequests.filter(mr => mr.projectId === projectId);
  }

  public getMentorRequestsForMentor(mentorId: string): MentorRequest[] {
    return this.mentorRequests.filter(mr => mr.mentorId === mentorId && mr.status === 'pending');
  }

  public createMentorRequest(
    projectId: string,
    mentorId: string,
    studentLeadId: string,
    institutionId: string,
    requestMessage: string
  ): MentorRequest {
    // Check if already pending
    const existing = this.mentorRequests.find(mr => mr.projectId === projectId && mr.status === 'pending');
    if (existing) throw new Error('A mentor request is already pending for this project.');

    const newReq: MentorRequest = {
      id: `mreq-${Date.now()}`,
      projectId,
      mentorId,
      studentLeadId,
      institutionId,
      status: 'pending',
      requestMessage,
      requestedAt: new Date().toISOString()
    };
    
    this.mentorRequests.push(newReq);
    
    // Update project status to mentor_pending
    this.updateProjectStatus(projectId, 'mentor_pending', studentLeadId, 'Student');
    
    this.addNotification({
      userId: mentorId,
      title: 'New Mentor Request',
      message: `You have received a new mentor request for a project.`,
      type: 'info'
    });
    
    this.saveToStorage();
    return newReq;
  }

  public respondToMentorRequest(
    requestId: string,
    status: 'accepted' | 'rejected',
    mentorId: string,
    mentorName: string,
    mentorResponse?: string
  ): MentorRequest {
    const req = this.mentorRequests.find(r => r.id === requestId);
    if (!req) throw new Error('Request not found');
    
    req.status = status;
    req.mentorResponse = mentorResponse;
    req.respondedAt = new Date().toISOString();

    const project = this.projects.find(p => p.id === req.projectId);
    
    if (status === 'accepted') {
      if (project) {
        project.mentorId = mentorId;
        project.mentorName = mentorName;
        this.updateProjectStatus(req.projectId, 'active', mentorId, mentorName);
        this.addNotification({
          userId: req.studentLeadId,
          title: 'Mentor Request Accepted',
          message: `${mentorName} has accepted your mentor request.`,
          type: 'success'
        });
      }
    } else if (status === 'rejected') {
      this.updateProjectStatus(req.projectId, 'mentor_rejected', mentorId, mentorName);
      this.addNotification({
        userId: req.studentLeadId,
        title: 'Mentor Request Rejected',
        message: `${mentorName} has rejected your mentor request.`,
        type: 'warning'
      });
    }

    this.saveToStorage();
    return req;
  }


  // --- REQUIREMENTS ---
  public getRequirements(projectId: string): Requirement[] {
    return this.requirements.filter((r) => r.projectId === projectId);
  }

  public createRequirement(req: Omit<Requirement, 'id' | 'createdAt' | 'updatedAt'>, userId: string, userName: string): Requirement {
    const newReq: Requirement = {
      ...req,
      id: `req-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.requirements.push(newReq);
    this.logAudit(userId, userName, 'CREATE_REQUIREMENT', 'requirement', newReq.id, { title: newReq.title });
    this.evaluateProjectHealth(req.projectId);
    this.saveToStorage();
    return newReq;
  }

  // --- TASKS ---
  public getTasks(projectId: string): Task[] {
    return this.tasks.filter((t) => t.projectId === projectId);
  }

  public createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>, userId: string, userName: string): Task {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.tasks.push(newTask);
    this.logAudit(userId, userName, 'CREATE_TASK', 'task', newTask.id, { title: newTask.title });
    this.evaluateProjectHealth(task.projectId);
    this.saveToStorage();
    return newTask;
  }

  public updateTaskStatus(taskId: string, status: TaskStatus, userId: string, userName: string): Task {
    const t = this.tasks.find((task) => task.id === taskId);
    if (!t) throw new Error('Task not found');
    t.status = status;
    t.updatedAt = new Date().toISOString();
    this.logAudit(userId, userName, 'UPDATE_TASK_STATUS', 'task', taskId, { status });
    this.evaluateProjectHealth(t.projectId);
    this.saveToStorage();
    return t;
  }

  // --- EVIDENCE & EVIDENCE LINKS (Core Innovation) ---
  public getEvidence(projectId: string): Evidence[] {
    return this.evidence.filter((e) => e.projectId === projectId);
  }

  public getEvidenceById(id: string): Evidence | undefined {
    return this.evidence.find((e) => e.id === id);
  }

  public createEvidence(
    ev: Omit<Evidence, 'id' | 'verificationStatus' | 'createdAt' | 'updatedAt'>,
    linkedEntityId?: string,
    linkedEntityType: 'task' | 'requirement' = 'task',
    relationshipType: 'implements' | 'tests' | 'supports' = 'implements',
    userId?: string,
    userName?: string
  ): Evidence {
    const newEv: Evidence = {
      ...ev,
      id: `evd-${Date.now()}`,
      verificationStatus: 'submitted',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.evidence.push(newEv);

    if (linkedEntityId) {
      this.createEvidenceLink(newEv.projectId, newEv.id, linkedEntityType, linkedEntityId, relationshipType);
    }

    this.logAudit(userId || ev.ownerId, userName || ev.ownerName, 'UPLOAD_EVIDENCE', 'evidence', newEv.id, { title: newEv.title, type: newEv.type });
    this.evaluateProjectHealth(ev.projectId);
    this.saveToStorage();
    return newEv;
  }

  public verifyEvidence(
    evidenceId: string,
    status: VerificationStatus,
    verifierId: string,
    verifierName: string
  ): Evidence {
    const ev = this.evidence.find((e) => e.id === evidenceId);
    if (!ev) throw new Error('Evidence not found');
    ev.verificationStatus = status;
    ev.verifiedById = verifierId;
    ev.verifiedByName = verifierName;
    ev.verifiedAt = new Date().toISOString();
    ev.updatedAt = new Date().toISOString();

    this.logAudit(verifierId, verifierName, 'VERIFY_EVIDENCE', 'evidence', evidenceId, { status });
    this.evaluateProjectHealth(ev.projectId);
    this.saveToStorage();
    return ev;
  }

  public getEvidenceLinks(projectId: string): EvidenceLink[] {
    return this.evidenceLinks.filter((l) => l.projectId === projectId);
  }

  public createEvidenceLink(
    projectId: string,
    evidenceId: string,
    entityType: EvidenceLink['entityType'],
    entityId: string,
    relationshipType: EvidenceLink['relationshipType']
  ): EvidenceLink {
    const link: EvidenceLink = {
      id: `link-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      projectId,
      evidenceId,
      entityType,
      entityId,
      relationshipType,
      createdAt: new Date().toISOString(),
    };
    this.evidenceLinks.push(link);
    this.saveToStorage();
    return link;
  }

  // --- MENTOR REVIEWS & CHANGE REQUESTS ---
  public getReviews(projectId: string): Review[] {
    return this.reviews.filter((r) => r.projectId === projectId);
  }

  public createReview(
    review: Omit<Review, 'id' | 'createdAt'>,
    createChangeRequestData?: { title: string; description: string; requiredEvidenceType: Evidence['type']; dueDate: string; assigneeId: string; assigneeName: string }
  ): Review {
    const newRev: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.reviews.push(newRev);

    if (createChangeRequestData) {
      this.createChangeRequest({
        projectId: review.projectId,
        reviewId: newRev.id,
        ...createChangeRequestData,
        status: 'pending',
      });
    }

    this.logAudit(review.reviewerId, review.reviewerName, 'SUBMIT_REVIEW', 'review', newRev.id, { status: review.status });
    this.evaluateProjectHealth(review.projectId);
    this.saveToStorage();
    return newRev;
  }

  public getChangeRequests(projectId: string): ChangeRequest[] {
    return this.changeRequests.filter((cr) => cr.projectId === projectId);
  }

  public createChangeRequest(cr: Omit<ChangeRequest, 'id' | 'createdAt' | 'updatedAt'>): ChangeRequest {
    const newCr: ChangeRequest = {
      ...cr,
      id: `cr-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.changeRequests.push(newCr);
    this.evaluateProjectHealth(cr.projectId);
    this.saveToStorage();
    return newCr;
  }

  public resolveChangeRequest(crId: string, revisionEvidenceId: string, verifierId: string, verifierName: string): ChangeRequest {
    const cr = this.changeRequests.find((c) => c.id === crId);
    if (!cr) throw new Error('Change request not found');
    cr.status = 'resolved';
    cr.resolvedEvidenceId = revisionEvidenceId;
    cr.updatedAt = new Date().toISOString();

    // Link revision evidence to change request
    this.createEvidenceLink(cr.projectId, revisionEvidenceId, 'change_request', crId, 'revises');
    this.verifyEvidence(revisionEvidenceId, 'mentor_verified', verifierId, verifierName);

    this.logAudit(verifierId, verifierName, 'RESOLVE_CHANGE_REQUEST', 'change_request', crId, { revisionEvidenceId });
    this.evaluateProjectHealth(cr.projectId);
    this.saveToStorage();
    return cr;
  }

  // --- HEALTH & EXPLAINABLE ALERTS ENGINE ---
  public getHealthAlerts(projectId: string): HealthAlert[] {
    return this.healthAlerts.filter((a) => a.projectId === projectId && !a.isResolved);
  }

  public evaluateProjectHealth(projectId: string): HealthAlert[] {
    const reqs = this.getRequirements(projectId);
    const tasks = this.getTasks(projectId);
    const evidence = this.getEvidence(projectId);
    const links = this.getEvidenceLinks(projectId);
    const crs = this.getChangeRequests(projectId);

    const generated: HealthAlert[] = [];

    // Rule 1: Requirement with no linked tasks
    const taskReqIds = new Set(tasks.map((t) => t.requirementId).filter(Boolean));
    for (const req of reqs) {
      if (!taskReqIds.has(req.id)) {
        generated.push({
          id: `alert-req-notask-${req.id}`,
          projectId,
          alertType: 'missing_task',
          severity: 'warning',
          reason: `Requirement "${req.title}" has zero planned execution tasks.`,
          supportingEntityType: 'requirement',
          supportingEntityIds: [req.id],
          recommendedAction: 'Break down requirement into concrete Kanban tasks.',
          isResolved: false,
          createdAt: new Date().toISOString(),
        });
      }
    }

    // Rule 2: Done or Review tasks with no evidence
    const taskEvidenceLinked = new Set(links.filter((l) => l.entityType === 'task').map((l) => l.entityId));
    for (const task of tasks) {
      if ((task.status === 'done' || task.status === 'review' || task.status === 'testing') && !taskEvidenceLinked.has(task.id)) {
        generated.push({
          id: `alert-task-noevidence-${task.id}`,
          projectId,
          alertType: 'missing_evidence',
          severity: 'critical',
          reason: `Task "${task.title}" is in "${task.status.toUpperCase()}" but lacks any linked evidence artifact.`,
          supportingEntityType: 'task',
          supportingEntityIds: [task.id],
          recommendedAction: 'Upload PR, document or test artifact before claiming completion.',
          isResolved: false,
          createdAt: new Date().toISOString(),
        });
      }
    }

    // Rule 3: Implemented requirements without test results
    const testedReqIds = new Set();
    const testEvidenceIds = new Set(evidence.filter((e) => e.type === 'test_result').map((e) => e.id));
    for (const link of links) {
      if (testEvidenceIds.has(link.evidenceId) && link.entityType === 'requirement') {
        testedReqIds.add(link.entityId);
      }
    }
    for (const req of reqs) {
      if (req.status === 'in_progress' && !testedReqIds.has(req.id)) {
        generated.push({
          id: `alert-req-notest-${req.id}`,
          projectId,
          alertType: 'missing_testing',
          severity: 'warning',
          reason: `Requirement "${req.title}" is in progress but has no attached empirical test or validation evidence.`,
          supportingEntityType: 'requirement',
          supportingEntityIds: [req.id],
          recommendedAction: 'Attach unit test logs or benchmarking data to validate acceptance criteria.',
          isResolved: false,
          createdAt: new Date().toISOString(),
        });
      }
    }

    // Rule 4: Overdue unresolved change requests
    const now = new Date();
    for (const cr of crs) {
      if (cr.status !== 'resolved' && cr.dueDate && new Date(cr.dueDate) < now) {
        generated.push({
          id: `alert-cr-overdue-${cr.id}`,
          projectId,
          alertType: 'overdue_change_request',
          severity: 'critical',
          reason: `Change Request "${cr.title}" is past due (${cr.dueDate}) without verified revision.`,
          supportingEntityType: 'change_request',
          supportingEntityIds: [cr.id],
          recommendedAction: 'Submit revised evidence responding to mentor feedback.',
          isResolved: false,
          createdAt: new Date().toISOString(),
        });
      }
    }

    this.healthAlerts = generated;
    this.saveToStorage();
    return generated;
  }

  // --- MULTI-FACTOR CONTRIBUTION ENGINE ---
  public getContributionSnapshot(projectId: string, userId: string) {
    const userTasks = this.tasks.filter((t) => t.projectId === projectId && t.assigneeId === userId);
    const userEvidence = this.evidence.filter((e) => e.projectId === projectId && e.ownerId === userId);
    const userReviews = this.reviews.filter((r) => r.projectId === projectId && r.reviewerId === userId);
    const userReflections = this.reflections.filter((rf) => rf.projectId === projectId && rf.userId === userId);

    const verified = userEvidence.filter(
      (e) => e.verificationStatus === 'mentor_verified' || e.verificationStatus === 'evaluator_verified'
    );
    const codeCount = verified.filter((e) => e.type === 'code_pr').length;
    const testCount = verified.filter((e) => e.type === 'test_result').length;
    const docCount = verified.filter((e) => e.type === 'document' || e.type === 'design').length;
    const doneTasks = userTasks.filter((t) => t.status === 'done').length;

    return {
      userId,
      projectId,
      metrics: {
        completedTasks: doneTasks,
        totalVerifiedEvidence: verified.length,
        codeArtifacts: codeCount,
        testArtifacts: testCount,
        documentationArtifacts: docCount,
        reviewsPerformed: userReviews.length,
        reflectionsSubmitted: userReflections.length,
      },
      verifiedEvidence: verified,
      explainablePoints: [
        `Implementation Rigor: Supported by ${codeCount} mentor-verified code/PR artifacts.`,
        `Quality Validation: Supported by ${testCount} verified test suites and benchmark reports.`,
        `Design & Architecture: Supported by ${docCount} technical documentation items.`,
        `Academic Engagement: ${userReviews.length} peer/technical reviews and ${userReflections.length} milestone reflections logged.`,
      ],
    };
  }

  // --- "WHY THIS SCORE?" BIDIRECTIONAL EVIDENCE GRAPH TRAVERSAL ---
  public traverseWhyThisScore(projectId: string, criterionId: string) {
    const evaluation = this.evaluations.find((e) => e.projectId === projectId);
    if (!evaluation) return null;

    const scoreItem = evaluation.scores.find((s) => s.criterionId === criterionId);
    if (!scoreItem) return null;

    // Traverse attached evidence
    const attachedEvidence = this.evidence.filter((e) => scoreItem.evidenceIds.includes(e.id));

    // For each evidence item, find linked tasks and requirements
    const chains = attachedEvidence.map((ev) => {
      const linkedReqLinks = this.evidenceLinks.filter((l) => l.evidenceId === ev.id && l.entityType === 'requirement');
      const linkedTaskLinks = this.evidenceLinks.filter((l) => l.evidenceId === ev.id && l.entityType === 'task');
      const linkedCrLinks = this.evidenceLinks.filter((l) => l.evidenceId === ev.id && l.entityType === 'change_request');

      const linkedReqs = this.requirements.filter((r) => linkedReqLinks.some((l) => l.entityId === r.id));
      const linkedTasks = this.tasks.filter((t) => linkedTaskLinks.some((l) => l.entityId === t.id));
      const linkedCrs = this.changeRequests.filter((cr) => linkedCrLinks.some((l) => l.entityId === cr.id));
      const linkedReviews = this.reviews.filter((r) => r.evidenceId === ev.id);

      return {
        evidence: ev,
        requirements: linkedReqs,
        tasks: linkedTasks,
        changeRequests: linkedCrs,
        reviews: linkedReviews,
      };
    });

    return {
      criterionName: scoreItem.criterionName,
      score: scoreItem.score,
      maxScore: scoreItem.maxScore,
      comment: scoreItem.comment,
      evidenceChains: chains,
    };
  }

  // --- RUBRICS & EVALUATIONS ---
  public getRubrics(): Rubric[] {
    return [...this.rubrics];
  }

  public getEvaluations(projectId: string): Evaluation[] {
    return this.evaluations.filter((e) => e.projectId === projectId);
  }

  public saveEvaluation(evaluation: Evaluation, userId: string, userName: string): Evaluation {
    const index = this.evaluations.findIndex((e) => e.id === evaluation.id);
    if (index >= 0) {
      this.evaluations[index] = { ...evaluation, updatedAt: new Date().toISOString() };
    } else {
      this.evaluations.push({ ...evaluation, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    this.logAudit(userId, userName, 'SAVE_EVALUATION', 'evaluation', evaluation.id, { overallScore: evaluation.overallScore, status: evaluation.status });
    this.saveToStorage();
    return evaluation;
  }

  // --- VIVA VOCE SUPPORT ---
  public getVivaQuestions(projectId: string): VivaQuestion[] {
    return this.vivaQuestions.filter((q) => q.projectId === projectId);
  }

  public generateEvidenceGroundedViva(projectId: string, studentId: string): VivaQuestion[] {
    const studentEvidence = this.evidence.filter((e) => e.projectId === projectId && e.ownerId === studentId);
    const newQuestions: VivaQuestion[] = [];

    for (const ev of studentEvidence) {
      if (ev.type === 'code_pr') {
        newQuestions.push({
          id: `viva-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          projectId,
          studentId,
          questionText: `In artifact "${ev.title}", describe how you handled edge-case error conditions and validated performance against acceptance criteria.`,
          contextSummary: `Grounded in Code/PR Evidence: ${ev.title}`,
          sourceEvidenceIds: [ev.id],
          isApproved: true,
          createdAt: new Date().toISOString(),
        });
      } else if (ev.type === 'test_result') {
        newQuestions.push({
          id: `viva-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          projectId,
          studentId,
          questionText: `Discuss the empirical test methodology in "${ev.title}". What failure modes were exposed during testing and how were they addressed?`,
          contextSummary: `Grounded in Test Report Evidence: ${ev.title}`,
          sourceEvidenceIds: [ev.id],
          isApproved: true,
          createdAt: new Date().toISOString(),
        });
      }
    }

    this.vivaQuestions.push(...newQuestions);
    this.saveToStorage();
    return newQuestions;
  }

  public saveVivaAnswer(questionId: string, answer: string, notes?: string, score?: number, evaluatorId?: string, evaluatorName?: string): VivaQuestion {
    const q = this.vivaQuestions.find((item) => item.id === questionId);
    if (!q) throw new Error('Viva question not found');
    q.studentAnswer = answer;
    if (notes !== undefined) q.evaluatorNotes = notes;
    if (score !== undefined) q.score = score;
    this.saveToStorage();
    return q;
  }

  // --- LEARNING OUTCOMES & SKILLS ---
  public getLearningOutcomes(): LearningOutcome[] {
    return [...this.outcomes];
  }

  public getSkills(): Skill[] {
    return [...this.skills];
  }

  public getReflections(projectId: string): Reflection[] {
    return this.reflections.filter((r) => r.projectId === projectId);
  }

  public addReflection(reflection: Omit<Reflection, 'id' | 'createdAt'>): Reflection {
    const newRefl: Reflection = {
      ...reflection,
      id: `refl-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.reflections.push(newRefl);
    this.saveToStorage();
    return newRefl;
  }

  // --- TEAM MANAGEMENT ---
  public addProjectMember(projectId: string, member: { fullName: string; email: string; projectRole: 'lead' | 'member' }, userId: string, userName: string): Project {
    const project = this.getProject(projectId);
    if (!project) throw new Error('Project not found');
    const newMember = {
      uid: `usr-${Date.now()}`,
      fullName: member.fullName,
      email: member.email,
      projectRole: member.projectRole,
      joinedAt: new Date().toISOString(),
    };
    project.team.members.push(newMember);
    project.updatedAt = new Date().toISOString();
    this.logAudit(userId, userName, 'ADD_PROJECT_MEMBER', 'project', projectId, { newMember });
    this.saveToStorage();
    return project;
  }

  public removeProjectMember(projectId: string, memberUid: string, userId: string, userName: string): Project {
    const project = this.getProject(projectId);
    if (!project) throw new Error('Project not found');
    project.team.members = project.team.members.filter((m) => m.uid !== memberUid);
    project.updatedAt = new Date().toISOString();
    this.logAudit(userId, userName, 'REMOVE_PROJECT_MEMBER', 'project', projectId, { memberUid });
    this.saveToStorage();
    return project;
  }

  public updateProjectMemberRole(projectId: string, memberUid: string, role: 'lead' | 'member', userId: string, userName: string): Project {
    const project = this.getProject(projectId);
    if (!project) throw new Error('Project not found');
    const member = project.team.members.find((m) => m.uid === memberUid);
    if (member) {
      member.projectRole = role;
      project.updatedAt = new Date().toISOString();
      this.logAudit(userId, userName, 'UPDATE_PROJECT_MEMBER_ROLE', 'project', projectId, { memberUid, role });
      this.saveToStorage();
    }
    return project;
  }

  // --- IDEA MARKETPLACE ---
  public getIdeas(): ProjectIdea[] {
    let filtered = [...this.ideas];
    if (this.currentUserContext && this.currentUserContext.role !== 'platform_admin') {
      const userInst = this.currentUserContext.institutionId;
      filtered = filtered.filter(i => {
        const ideaInst = i.institutionId || 'inst-ait-01'; // Default legacy ideas to inst-ait-01
        return ideaInst === userInst;
      });
    }
    return filtered;
  }

  public createIdea(idea: Omit<ProjectIdea, 'id' | 'createdAt' | 'joinRequests'>): ProjectIdea {
    const newIdea: ProjectIdea = {
      ...idea,
      id: `idea-${Date.now()}`,
      institutionId: idea.institutionId || this.currentUserContext?.institutionId || 'inst-default',
      joinRequests: [],
      createdAt: new Date().toISOString(),
    };
    this.ideas.unshift(newIdea);
    this.logAudit(idea.proposedBy, idea.proposedByName, 'CREATE_IDEA', 'idea', newIdea.id, { title: newIdea.title });
    this.saveToStorage();
    return newIdea;
  }

  public requestJoinIdea(ideaId: string, request: { userId: string; userName: string; message: string }): ProjectIdea {
    const idea = this.ideas.find((i) => i.id === ideaId);
    if (!idea) throw new Error('Idea not found');
    idea.joinRequests.push({
      ...request,
      createdAt: new Date().toISOString(),
    });
    this.saveToStorage();
    return idea;
  }

  // --- NOTIFICATIONS ---
  public getNotifications(userId?: string): AppNotification[] {
    if (!userId) return [...this.notifications];
    return this.notifications.filter((n) => n.userId === userId || n.userId === 'all');
  }

  public markNotificationRead(id: string): void {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) {
      notif.isRead = true;
      this.saveToStorage();
    }
  }

  public markAllNotificationsRead(userId?: string): void {
    this.notifications.forEach((n) => {
      if (!userId || n.userId === userId || n.userId === 'all') {
        n.isRead = true;
      }
    });
    this.saveToStorage();
  }

  public addNotification(notification: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>): AppNotification {
    const newNotif: AppNotification = {
      ...notification,
      id: `notif-${Date.now()}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    this.notifications.unshift(newNotif);
    this.saveToStorage();
    return newNotif;
  }

  // --- GLOBAL SEARCH ---
  public globalSearch(query: string) {
    const q = query.toLowerCase().trim();
    if (!q) return { projects: [], requirements: [], tasks: [], evidence: [] };

    const matchingProjects = this.projects.filter(
      (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
    const matchingRequirements = this.requirements.filter(
      (r) => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)
    );
    const matchingTasks = this.tasks.filter(
      (t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || (t.assigneeName && t.assigneeName.toLowerCase().includes(q))
    );
    const matchingEvidence = this.evidence.filter(
      (e) => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || e.ownerName.toLowerCase().includes(q)
    );

    return {
      projects: matchingProjects,
      requirements: matchingRequirements,
      tasks: matchingTasks,
      evidence: matchingEvidence,
    };
  }

  // --- GROUNDED AI HELPERS (PRD Section 24) ---
  public aiSuggestRequirements(title: string, description: string): { title: string; description: string; priority: Requirement['priority']; acceptanceCriteria: string[] }[] {
    return [
      {
        title: `Telemetry Scalability & Data Rate Limits for ${title}`,
        description: `Implement ingestion rate limiting and queue buffering to protect system components under burst loads.`,
        priority: 'high',
        acceptanceCriteria: [
          'Enforce sliding-window rate limit per client token',
          'Buffer sudden traffic spikes without dropping measurement packets',
          'Return 429 Too Many Requests with retry-after header',
        ],
      },
      {
        title: `Auditable Verification & Integrity Checksums`,
        description: `Ensure all uploaded artifacts and telemetry data streams include SHA-256 cryptographic hashes for academic defensibility.`,
        priority: 'medium',
        acceptanceCriteria: [
          'Generate SHA-256 hash immediately upon file or data receipt',
          'Store hash immutably in tamper-evident database table',
          'Display verification check in mentor audit interface',
        ],
      },
    ];
  }

  public aiSuggestTasks(req: Requirement): { title: string; description: string; priority: Task['priority'] }[] {
    return [
      {
        title: `Design Architecture & Interface Spec for ${req.title.split(':')[0]}`,
        description: `Draft API contracts and data models conforming to requirement criteria.`,
        priority: 'high',
      },
      {
        title: `Implement Core Engine & Logic for ${req.title.split(':')[0]}`,
        description: `Develop verified implementation matching all specified acceptance criteria.`,
        priority: 'high',
      },
      {
        title: `Author Automated Test Suite & Coverage Report`,
        description: `Create integration and load tests asserting correctness and edge cases.`,
        priority: 'medium',
      },
    ];
  }

  public aiFeedbackToChangeRequest(feedback: string, evidenceTitle: string): { title: string; description: string; suggestedAction: string } {
    return {
      title: `CR-${Date.now().toString().slice(-3)}: Address Feedback on ${evidenceTitle}`,
      description: `Mentor Feedback: "${feedback}". Update implementation, add defensive validation, and attach revised artifact.`,
      suggestedAction: `Resolve feedback by submitting a revised PR or test report with validation proof.`,
    };
  }
}

export const dataService = new ProjectFlowDataService();
