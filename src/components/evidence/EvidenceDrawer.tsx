import React from "react";
import { Evidence, Review, EvidenceLink } from "../../types";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";
import { X, ExternalLink, ShieldCheck, FileText, GitPullRequest, Image, CheckCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface EvidenceDrawerProps {
  evidence: Evidence | null;
  isOpen: boolean;
  onClose: () => void;
  onVerify?: (status: Evidence["verificationStatus"]) => void;
  reviews?: Review[];
  links?: EvidenceLink[];
}

const TIMELINE_STEPS = [
  { key:"req",     label:"Requirement created",  icon:"📋" },
  { key:"task",    label:"Task assigned",         icon:"✅" },
  { key:"submit",  label:"Evidence submitted",    icon:"📤" },
  { key:"review",  label:"Mentor reviewed",       icon:"👁" },
  { key:"change",  label:"Feedback recorded",     icon:"💬" },
  { key:"revise",  label:"Revision submitted",    icon:"🔄" },
  { key:"verify",  label:"Verified",              icon:"🛡" },
];

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({ evidence, isOpen, onClose, onVerify, reviews = [], links = [] }) => {
  const { currentRole } = useAuth();
  if (!isOpen || !evidence) return null;
  const canVerify = currentRole === "mentor" || currentRole === "evaluator" || currentRole === "dept_admin";

  const getTypeIcon = () => {
    switch (evidence.type) {
      case "code_pr":    return <GitPullRequest size={20} style={{ color:"var(--purple-500)" }} />;
      case "test_result":return <CheckCircle size={20} style={{ color:"var(--success)" }} />;
      case "screenshot": return <Image size={20} style={{ color:"var(--info)" }} />;
      default:           return <FileText size={20} style={{ color:"var(--warning)" }} />;
    }
  };

  const isVerified = evidence.verificationStatus === "mentor_verified" || evidence.verificationStatus === "evaluator_verified";
  const isSubmitted = evidence.verificationStatus === "submitted";
  const activeStep = isVerified ? 6 : isSubmitted ? 2 : 2;

  return (
    <div className="drawer-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="drawer-content">
        {/* Header */}
        <div style={{ padding:"1.375rem 1.5rem", borderBottom:"1px solid var(--border-subtle)", display:"flex", justifyContent:"space-between", alignItems:"flex-start", background:"var(--bg-surface)" }}>
          <div style={{ display:"flex", gap:"0.75rem", alignItems:"flex-start", flex:1, minWidth:0 }}>
            <div style={{ padding:"0.5rem", background:"var(--bg-surface-elevated)", border:"1px solid var(--border-subtle)", borderRadius:"var(--radius-sm)", flexShrink:0 }}>
              {getTypeIcon()}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"0.35rem", flexWrap:"wrap" }}>
                <Badge status={evidence.verificationStatus} />
                <span style={{ fontSize:"0.7rem", fontFamily:"var(--font-mono)", color:"var(--text-muted)", background:"var(--bg-surface-elevated)", padding:"0.1rem 0.4rem", borderRadius:"var(--radius-xs)", border:"1px solid var(--border-subtle)" }}>{evidence.id}</span>
              </div>
              <h2 style={{ fontSize:"1rem", fontWeight:700, color:"var(--text-primary)", lineHeight:1.3, wordBreak:"break-word" }}>{evidence.title}</h2>
            </div>
          </div>
          <button type="button" onClick={onClose} className="btn btn-icon btn-ghost" aria-label="Close drawer" style={{ marginLeft:"0.75rem", flexShrink:0 }}>
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding:"1.5rem", display:"flex", flexDirection:"column", gap:"1.5rem", flex:1 }}>

          {/* Metadata grid */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"0.75rem" }}>
            {[
              { label:"Submitted By",  value: evidence.ownerName, strong: true },
              { label:"Source Type",   value: evidence.sourceType.toUpperCase(), mono: true },
              { label:"Date Submitted",value: new Date(evidence.createdAt).toLocaleDateString("en",{year:"numeric",month:"short",day:"numeric"}) },
              { label:"Verified By",   value: evidence.verifiedByName || "Pending review", success: !!evidence.verifiedByName },
            ].map(({ label, value, strong, mono, success }) => (
              <div key={label} style={{ padding:"0.75rem", background:"var(--bg-surface-elevated)", border:"1px solid var(--border-subtle)", borderRadius:"var(--radius-sm)" }}>
                <div style={{ fontSize:"0.7rem", color:"var(--text-muted)", marginBottom:"0.25rem", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</div>
                <div style={{ fontSize:"0.875rem", fontWeight: strong ? 700 : 500, color: success ? "var(--success)" : "var(--text-primary)", fontFamily: mono ? "var(--font-mono)" : "var(--font-sans)" }}>
                  {value}
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <div style={{ fontSize:"0.7rem", fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"0.625rem" }}>Artifact Description</div>
            <div style={{ padding:"1rem", background:"var(--bg-surface-elevated)", borderRadius:"var(--radius-md)", border:"1px solid var(--border-subtle)", fontSize:"0.875rem", color:"var(--text-primary)", lineHeight:1.65 }}>
              {evidence.description}
            </div>
          </div>

          {/* Source link */}
          {evidence.sourceUrl && (
            <div>
              <div style={{ fontSize:"0.7rem", fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"0.625rem" }}>Source Repository</div>
              <a href={evidence.sourceUrl} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ width:"100%", justifyContent:"space-between" }}>
                <span>Open GitHub Pull Request</span>
                <ExternalLink size={15} />
              </a>
            </div>
          )}

          {/* Evidence Graph connections */}
          {links.length > 0 && (
            <div>
              <div style={{ fontSize:"0.7rem", fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"0.625rem" }}>Evidence Graph Connections</div>
              <div style={{ display:"flex", flexDirection:"column", gap:"0.4rem" }}>
                {links.map(link => (
                  <div key={link.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0.5rem 0.75rem", background:"var(--info-bg)", border:"1px solid var(--info-border)", borderRadius:"var(--radius-sm)", fontSize:"0.8125rem" }}>
                    <div>
                      <span style={{ fontWeight:700, color:"var(--info)" }}>{(link.relationshipType || link.relationship || 'connects').toUpperCase()}</span>
                      <span style={{ color:"var(--text-secondary)", marginLeft:"0.5rem" }}>{link.entityType || link.targetType} ({link.entityId || link.targetId})</span>
                    </div>
                    <Badge variant="verified">Connected</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Evidence Lifecycle Timeline */}
          <div>
            <div style={{ fontSize:"0.7rem", fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"0.875rem" }}>Evidence Lifecycle</div>
            <div className="timeline">
              {TIMELINE_STEPS.map((step, idx) => {
                const isDone = idx <= activeStep;
                const isCurrent = idx === activeStep;
                return (
                  <div key={step.key} className="timeline-item">
                    <div className={"timeline-dot" + (isDone ? (isCurrent ? " active" : " success") : "")}>
                      {isDone ? (isCurrent ? "●" : "✓") : <span style={{ fontSize:"0.5rem", color:"var(--text-muted)" }}>{idx+1}</span>}
                    </div>
                    <div className="timeline-content">
                      <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", paddingTop:"0.375rem" }}>
                        <span style={{ fontSize:"0.8125rem", fontWeight: isCurrent ? 700 : isDone ? 600 : 400, color: isCurrent ? "var(--text-primary)" : isDone ? "var(--text-secondary)" : "var(--text-muted)" }}>
                          {step.icon} {step.label}
                        </span>
                        {isCurrent && (
                          <span style={{ fontSize:"0.6rem", fontWeight:700, padding:"0.1rem 0.4rem", borderRadius:"99px", background:"var(--bg-dark)", color:"white", textTransform:"uppercase", letterSpacing:"0.05em" }}>current</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mentor Reviews */}
          {reviews.length > 0 && (
            <div>
              <div style={{ fontSize:"0.7rem", fontWeight:700, color:"var(--text-muted)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"0.625rem" }}>Mentor Feedback History</div>
              <div style={{ display:"flex", flexDirection:"column", gap:"0.625rem" }}>
                {reviews.map(r => (
                  <div key={r.id} style={{ padding:"0.875rem", background:"var(--bg-surface-elevated)", border:"1px solid var(--border-subtle)", borderRadius:"var(--radius-md)" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.35rem" }}>
                      <span style={{ fontSize:"0.8125rem", fontWeight:700, color:"var(--text-primary)" }}>{r.reviewerName}</span>
                      <Badge status={r.status} />
                    </div>
                    <p style={{ fontSize:"0.8125rem", color:"var(--text-secondary)", lineHeight:1.5 }}>{r.comments}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {reviews.length === 0 && (
            <p style={{ fontSize:"0.8125rem", color:"var(--text-muted)" }}>No mentor reviews logged for this artifact yet.</p>
          )}
        </div>

        {/* Footer Actions */}
        {canVerify && onVerify && (
          <div style={{ padding:"1.125rem 1.5rem", borderTop:"1px solid var(--border-subtle)", background:"var(--bg-surface-elevated)", display:"flex", gap:"0.75rem", justifyContent:"flex-end" }}>
            <Button variant="outline" size="sm" onClick={() => onVerify("unverified")}>Reset to Unverified</Button>
            <Button variant="primary" size="sm" leftIcon={<ShieldCheck size={15} />} onClick={() => onVerify("mentor_verified")}>Verify Artifact</Button>
          </div>
        )}
      </div>
    </div>
  );
};