import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { dataService } from '../services/dataService';
import { useAuth } from '../context/AuthContext';
import { Evidence, Review, ChangeRequest } from '../types';
import {
  Inbox,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  ShieldCheck,
  FileEdit,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const ReviewsPage: React.FC = () => {
  const { onOpenEvidence } = useOutletContext<{ onOpenEvidence: (ev: Evidence) => void }>();
  const { currentUser, currentRole } = useAuth();
  const project = dataService.getProjects()[0];

  const [evidenceList, setEvidenceList] = useState<Evidence[]>(() => dataService.getEvidence(project.id));
  const [reviews, setReviews] = useState<Review[]>(() => dataService.getReviews(project.id));
  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>(() => dataService.getChangeRequests(project.id));

  // Review modal state
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
  const [reviewComments, setReviewComments] = useState('');
  const [reviewStatus, setReviewStatus] = useState<Review['status']>('approved');
  const [requiresCR, setRequiresCR] = useState(false);
  const [crTitle, setCrTitle] = useState('');
  const [crDescription, setCrDescription] = useState('');
  const [crDueDate, setCrDueDate] = useState('2026-10-10');

  const pendingSubmissions = evidenceList.filter((e) => e.verificationStatus === 'submitted');
  const verifiedSubmissions = evidenceList.filter((e) => e.verificationStatus === 'mentor_verified');

  const handleOpenReviewModal = (ev: Evidence) => {
    setSelectedEvidence(ev);
    setReviewComments('');
    setReviewStatus('approved');
    setRequiresCR(false);
    setCrTitle(`CR: Revise ${ev.title}`);
    setCrDescription(`Feedback: Address performance and testing shortcomings.`);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvidence || !reviewComments) return;

    dataService.createReview(
      {
        projectId: project.id,
        evidenceId: selectedEvidence.id,
        reviewerId: currentUser?.id || 'reviewer-01',
        reviewerName: currentUser?.fullName || 'Reviewer',
        status: reviewStatus,
        comments: reviewComments,
      },
      requiresCR
        ? {
            title: crTitle,
            description: crDescription,
            requiredEvidenceType: selectedEvidence.type,
            dueDate: crDueDate,
            assigneeId: selectedEvidence.ownerId,
            assigneeName: selectedEvidence.ownerName,
          }
        : undefined
    );

    // If approved, update evidence status
    if (reviewStatus === 'approved') {
      dataService.verifyEvidence(selectedEvidence.id, 'mentor_verified', currentUser?.id || 'reviewer-01', currentUser?.fullName || 'Reviewer');
    }

    setEvidenceList(dataService.getEvidence(project.id));
    setReviews(dataService.getReviews(project.id));
    setChangeRequests(dataService.getChangeRequests(project.id));
    setSelectedEvidence(null);
  };

  // Quick revision verification
  const handleVerifyRevision = (cr: ChangeRequest) => {
    if (cr.resolvedEvidenceId) {
      dataService.resolveChangeRequest(cr.id, cr.resolvedEvidenceId, currentUser?.id || 'reviewer-01', currentUser?.fullName || 'Reviewer');
      setChangeRequests(dataService.getChangeRequests(project.id));
      setEvidenceList(dataService.getEvidence(project.id));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Mentor Review Inbox & Change Requests
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Review submitted artifacts, provide traceable critique, spawn Change Requests and verify revisions
        </p>
      </div>

      {/* Pending Reviews Queue */}
      <div>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Inbox size={20} className="text-sky-400" />
          Pending Submissions Awaiting Mentor Review ({pendingSubmissions.length})
        </h3>

        {pendingSubmissions.length === 0 ? (
          <Card>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              ✓ All student submissions have been reviewed and verified.
            </p>
          </Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {pendingSubmissions.map((ev) => (
              <Card key={ev.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <Badge status={ev.verificationStatus} />
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {ev.id}
                      </span>
                    </div>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>{ev.title}</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                      {ev.description}
                    </p>
                    <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Submitted by: <strong style={{ color: 'var(--text-primary)' }}>{ev.ownerName}</strong> &bull; Type: {ev.type.toUpperCase()}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <Button variant="outline" size="sm" onClick={() => onOpenEvidence(ev)}>
                      Inspect Artifact
                    </Button>
                    <Button size="sm" onClick={() => handleOpenReviewModal(ev)}>
                      Conduct Mentor Review
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Change Requests Loop */}
      <div>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={20} className="text-amber-400" />
          Traceable Change Requests & Revisions ({changeRequests.length})
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {changeRequests.map((cr) => (
            <Card key={cr.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#f43f5e', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                      {cr.id}
                    </span>
                    <Badge variant={cr.status === 'resolved' ? 'verified' : 'warning'}>
                      {cr.status.toUpperCase()}
                    </Badge>
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{cr.title}</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                    {cr.description}
                  </p>
                  <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Assigned Student: <strong style={{ color: 'var(--text-primary)' }}>{cr.assigneeName}</strong> &bull; Due: {cr.dueDate}
                  </div>
                </div>

                <div>
                  {cr.status === 'resolved' ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', fontWeight: 700, fontSize: '0.8125rem' }}>
                      <ShieldCheck size={18} /> Revision Verified ({cr.resolvedEvidenceId})
                    </div>
                  ) : (
                    <Button size="sm" onClick={() => handleVerifyRevision(cr)}>
                      Sign-off & Verify Revision
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Review Modal with AI Change Request Assistant */}
      {selectedEvidence && (
        <Modal
          isOpen={Boolean(selectedEvidence)}
          onClose={() => setSelectedEvidence(null)}
          title={`Mentor Review: ${selectedEvidence.title}`}
          subtitle={`Submitted by ${selectedEvidence.ownerName} (${selectedEvidence.type})`}
        >
          <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Review Verdict</label>
              <select
                className="form-select"
                value={reviewStatus}
                onChange={(e) => {
                  const val = e.target.value as any;
                  setReviewStatus(val);
                  if (val === 'changes_requested') setRequiresCR(true);
                }}
              >
                <option value="approved">Approve & Mark Verified</option>
                <option value="changes_requested">Request Changes (Spawn Change Request)</option>
                <option value="commented">Add Technical Note Only</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Mentor Review Feedback & Critique</label>
              <textarea
                className="form-textarea"
                rows={4}
                value={reviewComments}
                onChange={(e) => setReviewComments(e.target.value)}
                placeholder="Detail technical strengths, benchmark deficiencies, or code refactor targets..."
                required
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                id="requiresCR"
                checked={requiresCR}
                onChange={(e) => setRequiresCR(e.target.checked)}
              />
              <label htmlFor="requiresCR" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Spawn Formal Change Request for student revision
              </label>
            </div>

            {requiresCR && (
              <div style={{ padding: '1rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 700, textTransform: 'uppercase' }}>
                    Change Request Parameters
                  </span>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', gap: '0.3rem', border: '1px dashed var(--info)', color: 'var(--info)', background: 'var(--info-bg)' }}
                    onClick={() => {
                      if (selectedEvidence) {
                        const cr = dataService.aiFeedbackToChangeRequest(reviewComments || 'Address validation and testing shortcomings.', selectedEvidence.title);
                        setCrTitle(cr.title);
                        setCrDescription(cr.description);
                      }
                    }}
                  >
                    <Sparkles size={12} /> AI Suggestion: Formulate CR
                  </button>
                </div>
                <Input
                  label="Change Request Title"
                  value={crTitle}
                  onChange={(e) => setCrTitle(e.target.value)}
                  required
                />
                <Input
                  label="Revision Due Date"
                  type="date"
                  value={crDueDate}
                  onChange={(e) => setCrDueDate(e.target.value)}
                  required
                />
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <Button variant="outline" type="button" onClick={() => setSelectedEvidence(null)}>
                Cancel
              </Button>
              <Button type="submit">Submit Review & Record in Graph</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
