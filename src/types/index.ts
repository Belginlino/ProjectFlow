export type UserRole = 'student' | 'mentor' | 'evaluator' | 'dept_admin' | 'institution_admin';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  institutionId: string;
  department: string;
  rollNumber?: string;
  avatarUrl?: string;
  isActive: boolean;
  onboardingComplete?: boolean;
  createdAt: string;
}

export type ProjectStatus = 'draft' | 'mentor_pending' | 'mentor_rejected' | 'proposal' | 'approval' | 'active' | 'review' | 'completed' | 'archived';

export interface ProjectMember {
  uid: string;
  fullName: string;
  email: string;
  projectRole: 'lead' | 'member';
  joinedAt: string;
}

export interface Project {
  id: string;
  institutionId: string;
  title: string;
  description: string;
  status: ProjectStatus;
  academicYear: string;
  semester: string;
  mentorId?: string;
  mentorName?: string;
  team: {
    members: ProjectMember[];
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type MentorRequestStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';

export interface MentorRequest {
  id: string;
  projectId: string;
  studentLeadId: string;
  mentorId: string;
  institutionId: string;
  status: MentorRequestStatus;
  requestMessage?: string;
  mentorResponse?: string;
  requestedAt: string;
  respondedAt?: string;
}

export type RequirementPriority = 'low' | 'medium' | 'high' | 'critical';
export type RequirementStatus = 'draft' | 'approved' | 'in_progress' | 'verified';

export interface Requirement {
  id: string;
  projectId: string;
  title: string;
  description: string;
  priority: RequirementPriority;
  status: RequirementStatus;
  acceptanceCriteria: string[];
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'testing' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  projectId: string;
  requirementId?: string;
  milestoneId?: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  assigneeName?: string;
  dueDate?: string;
  dependencies: string[];
  createdAt: string;
  updatedAt: string;
}

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

export type VerificationStatus = 'unverified' | 'submitted' | 'under_review' | 'mentor_verified' | 'evaluator_verified' | 'needs_revision' | 'rejected';

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
  verifiedBy?: string;
  verifiedById?: string;
  verifiedByName?: string;
  verifiedAt?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export type EntityType =
  | 'requirement'
  | 'task'
  | 'review'
  | 'change_request'
  | 'rubric_criterion'
  | 'learning_outcome'
  | 'skill';

export type RelationshipType =
  | 'supports'
  | 'implements'
  | 'tests'
  | 'reviews'
  | 'revises'
  | 'verifies'
  | 'demonstrates'
  | 'maps_to'
  | 'contributes_to'
  | 'proves';

export interface EvidenceLink {
  id: string;
  projectId: string;
  evidenceId: string;
  entityType?: EntityType;
  targetType?: EntityType;
  entityId?: string;
  targetId?: string;
  relationshipType?: RelationshipType;
  relationship?: RelationshipType;
  createdAt: string;
}

export type ReviewStatus = 'approved' | 'changes_requested' | 'revision_requested' | 'rejected' | 'commented';

export interface Review {
  id: string;
  projectId: string;
  evidenceId: string;
  reviewerId: string;
  reviewerName: string;
  status: ReviewStatus;
  comments: string;
  changeRequestId?: string;
  createdAt: string;
  updatedAt?: string;
}

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
  resolvedEvidenceId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HealthAlert {
  id: string;
  projectId: string;
  alertType?: 'missing_task' | 'missing_evidence' | 'missing_testing' | 'overdue_change_request' | 'blocked_dependency';
  category?: string;
  severity: 'info' | 'warning' | 'critical';
  title?: string;
  description?: string;
  reason?: string;
  supportingEntityType?: string;
  supportingEntityIds?: string[];
  affectedEntityId?: string;
  affectedEntityType?: string;
  suggestedAction?: string;
  recommendedAction?: string;
  isResolved?: boolean;
  createdAt: string;
}

export interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  maxScore: number;
  weight?: number;
  weightage?: number;
}

export interface Rubric {
  id: string;
  institutionId: string;
  title: string;
  description: string;
  version?: string;
  isActive?: boolean;
  criteria: RubricCriterion[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CriterionScore {
  criterionId: string;
  criterionName: string;
  score: number;
  maxScore: number;
  comment: string;
  evidenceIds: string[];
}

export interface Evaluation {
  id: string;
  projectId: string;
  rubricId: string;
  rubricTitle: string;
  evaluatorId: string;
  evaluatorName: string;
  overallScore: number;
  maxTotalScore: number;
  feedback: string;
  status: 'draft' | 'submitted' | 'finalized';
  scores: CriterionScore[];
  createdAt: string;
  updatedAt: string;
}

export interface VivaQuestion {
  id: string;
  projectId: string;
  studentId: string;
  studentName?: string;
  questionText?: string;
  question?: string;
  contextSummary?: string;
  groundingContext?: string;
  groundingEvidenceId?: string;
  sourceEvidenceIds?: string[];
  isApproved?: boolean;
  studentAnswer?: string;
  evaluatorNotes?: string;
  score?: number;
  status?: string;
  createdAt: string;
}

export interface LearningOutcome {
  id: string;
  institutionId?: string;
  code: string;
  name?: string;
  title?: string;
  description: string;
  category?: string;
  outcomeType?: 'CO' | 'PO' | 'PSO';
  bloomLevel?: string;
}

export interface Skill {
  id: string;
  institutionId?: string;
  category: 'technical' | 'product' | 'professional' | string;
  name: string;
  description?: string;
  level?: 'introduced' | 'developing' | 'proficient' | 'advanced';
  verifiedEvidenceCount?: number;
}

export interface Reflection {
  id: string;
  projectId: string;
  userId: string;
  authorName: string;
  milestoneTitle: string;
  content: string;
  challenges: string;
  learnings: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  institutionId: string;
  projectId?: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: Record<string, any>;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface ProjectIdea {
  id: string;
  title: string;
  problemStatement: string;
  domain: string;
  requiredSkills: string[];
  proposedBy: string;
  proposedByName: string;
  institutionId?: string;
  role: 'student' | 'mentor';
  status: 'open' | 'in_review' | 'approved' | 'closed';
  joinRequests: {
    userId: string;
    userName: string;
    message: string;
    createdAt: string;
  }[];
  createdAt: string;
}
