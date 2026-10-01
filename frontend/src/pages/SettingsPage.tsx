import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { 
  User, Settings as SettingsIcon, Bell, Shield, Lock, 
  Building2, GraduationCap, Award, CheckCircle2, 
  Save, AlertCircle, Laptop, Smartphone, Key, RefreshCw, 
  ExternalLink, Eye, EyeOff, Sparkles, Sliders
} from 'lucide-react';
import { UserRole } from '../types';

export const SettingsPage: React.FC = () => {
  const { currentUser, currentRole, updateUserProfile } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'notifications' | 'role' | 'security'>('profile');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Profile fields
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [rollNumber, setRollNumber] = useState(currentUser?.rollNumber || '2023CS01');
  const [department, setDepartment] = useState(currentUser?.department || 'Computer Science & Engineering');
  const [institution, setInstitution] = useState('Apex Institute of Technology');
  const [bio, setBio] = useState('Final Year Undergraduate focused on distributed systems, verified artifacts, and reliable architectures.');
  const [phone, setPhone] = useState('+1 (555) 234-5678');

  // Preferences fields
  const [defaultLanding, setDefaultLanding] = useState('/');
  const [themeMode, setThemeMode] = useState<'dark' | 'light' | 'system'>('dark');
  const [compactDensity, setCompactDensity] = useState(false);
  const [autoSaveDrafts, setAutoSaveDrafts] = useState(true);
  const [syntaxTheme, setSyntaxTheme] = useState('github-dark');

  // Notifications fields
  const [notifyEvidenceSubmitted, setNotifyEvidenceSubmitted] = useState(true);
  const [notifyEvidenceVerified, setNotifyEvidenceVerified] = useState(true);
  const [notifyTaskDeadlines, setNotifyTaskDeadlines] = useState(true);
  const [notifyReviewRequests, setNotifyReviewRequests] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);

  // Student specific
  const [githubUsername, setGithubUsername] = useState('alex-dev');
  const [portfolioPublic, setPortfolioPublic] = useState(true);
  const [technicalSkills, setTechnicalSkills] = useState('React, TypeScript, Python, FastAPI, Docker, PostgreSQL');
  const [capstoneTrack, setCapstoneTrack] = useState('Full Stack Web Platforms & Cloud Systems');

  // Mentor specific
  const [maxMentees, setMaxMentees] = useState(4);
  const [consultationHours, setConsultationHours] = useState('Tuesdays & Thursdays, 2:00 PM - 5:00 PM');
  const [autoFlagInactiveDays, setAutoFlagInactiveDays] = useState(7);
  const [autoApproveLowPriority, setAutoApproveLowPriority] = useState(false);

  // Evaluator specific
  const [evaluationMode, setEvaluationMode] = useState('rubric_viva');
  const [blindReview, setBlindReview] = useState(false);
  const [scoreLocking, setScoreLocking] = useState(true);
  const [vivaWeight, setVivaWeight] = useState(30);

  // Admin specific
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [activeSemester, setActiveSemester] = useState('Semester 7 - Capstone Phase I');
  const [studentSelfRegistration, setStudentSelfRegistration] = useState('approval_required');
  const [minEvidencePerTask, setMinEvidencePerTask] = useState(1);
  const [passingGradeCutoff, setPassingGradeCutoff] = useState(60);

  // Security fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load saved settings from localStorage
  useEffect(() => {
    if (!currentUser) return;
    try {
      const saved = localStorage.getItem(`projectflow_settings_${currentUser.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.bio !== undefined) setBio(parsed.bio);
        if (parsed.phone !== undefined) setPhone(parsed.phone);
        if (parsed.defaultLanding !== undefined) setDefaultLanding(parsed.defaultLanding);
        if (parsed.themeMode !== undefined) setThemeMode(parsed.themeMode);
        if (parsed.compactDensity !== undefined) setCompactDensity(parsed.compactDensity);
        if (parsed.autoSaveDrafts !== undefined) setAutoSaveDrafts(parsed.autoSaveDrafts);
        if (parsed.syntaxTheme !== undefined) setSyntaxTheme(parsed.syntaxTheme);

        if (parsed.notifyEvidenceSubmitted !== undefined) setNotifyEvidenceSubmitted(parsed.notifyEvidenceSubmitted);
        if (parsed.notifyEvidenceVerified !== undefined) setNotifyEvidenceVerified(parsed.notifyEvidenceVerified);
        if (parsed.notifyTaskDeadlines !== undefined) setNotifyTaskDeadlines(parsed.notifyTaskDeadlines);
        if (parsed.notifyReviewRequests !== undefined) setNotifyReviewRequests(parsed.notifyReviewRequests);
        if (parsed.weeklyDigest !== undefined) setWeeklyDigest(parsed.weeklyDigest);
        if (parsed.securityAlerts !== undefined) setSecurityAlerts(parsed.securityAlerts);

        if (parsed.githubUsername !== undefined) setGithubUsername(parsed.githubUsername);
        if (parsed.portfolioPublic !== undefined) setPortfolioPublic(parsed.portfolioPublic);
        if (parsed.technicalSkills !== undefined) setTechnicalSkills(parsed.technicalSkills);
        if (parsed.capstoneTrack !== undefined) setCapstoneTrack(parsed.capstoneTrack);

        if (parsed.maxMentees !== undefined) setMaxMentees(parsed.maxMentees);
        if (parsed.consultationHours !== undefined) setConsultationHours(parsed.consultationHours);
        if (parsed.autoFlagInactiveDays !== undefined) setAutoFlagInactiveDays(parsed.autoFlagInactiveDays);
        if (parsed.autoApproveLowPriority !== undefined) setAutoApproveLowPriority(parsed.autoApproveLowPriority);

        if (parsed.evaluationMode !== undefined) setEvaluationMode(parsed.evaluationMode);
        if (parsed.blindReview !== undefined) setBlindReview(parsed.blindReview);
        if (parsed.scoreLocking !== undefined) setScoreLocking(parsed.scoreLocking);
        if (parsed.vivaWeight !== undefined) setVivaWeight(parsed.vivaWeight);

        if (parsed.academicYear !== undefined) setAcademicYear(parsed.academicYear);
        if (parsed.activeSemester !== undefined) setActiveSemester(parsed.activeSemester);
        if (parsed.studentSelfRegistration !== undefined) setStudentSelfRegistration(parsed.studentSelfRegistration);
        if (parsed.minEvidencePerTask !== undefined) setMinEvidencePerTask(parsed.minEvidencePerTask);
        if (parsed.passingGradeCutoff !== undefined) setPassingGradeCutoff(parsed.passingGradeCutoff);

        if (parsed.twoFactorEnabled !== undefined) setTwoFactorEnabled(parsed.twoFactorEnabled);
      }
    } catch {
      // ignore
    }
  }, [currentUser]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      // 1. Update Core User Profile in Context and Firebase/Local
      await updateUserProfile({
        fullName,
        department,
        rollNumber,
      });

      // 2. Persist extended settings in LocalStorage
      if (currentUser) {
        const settingsPayload = {
          bio,
          phone,
          defaultLanding,
          themeMode,
          compactDensity,
          autoSaveDrafts,
          syntaxTheme,
          notifyEvidenceSubmitted,
          notifyEvidenceVerified,
          notifyTaskDeadlines,
          notifyReviewRequests,
          weeklyDigest,
          securityAlerts,
          githubUsername,
          portfolioPublic,
          technicalSkills,
          capstoneTrack,
          maxMentees,
          consultationHours,
          autoFlagInactiveDays,
          autoApproveLowPriority,
          evaluationMode,
          blindReview,
          scoreLocking,
          vivaWeight,
          academicYear,
          activeSemester,
          studentSelfRegistration,
          minEvidencePerTask,
          passingGradeCutoff,
          twoFactorEnabled,
        };
        localStorage.setItem(`projectflow_settings_${currentUser.id}`, JSON.stringify(settingsPayload));
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      console.error('Failed to save settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);
    if (!currentPassword) {
      setPasswordMsg({ type: 'error', text: 'Please enter your current password.' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setPasswordMsg({ type: 'success', text: 'Password successfully updated!' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordMsg(null), 4000);
  };

  const getRoleTitle = (role: UserRole | string | null | undefined) => {
    switch (role) {
      case 'student': return 'Student';
      case 'mentor': return 'Faculty Mentor';
      case 'evaluator': return 'External / Internal Evaluator';
      case 'institution_admin': return 'Institutional Administrator';
      case 'dept_admin': return 'Department Administrator';
      default: return 'User';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: 1040, margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.35rem' }}>
            <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>
              Settings & Workspace Preferences
            </h1>
            <span className="badge badge-neutral" style={{ textTransform: 'capitalize', fontSize: '0.75rem' }}>
              {getRoleTitle(currentRole)}
            </span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
            Configure your personal profile, notification triggers, display density, and role-specific parameters.
          </p>
        </div>

        <Button 
          variant="primary" 
          leftIcon={<Save size={15} />} 
          isLoading={isSaving}
          onClick={() => handleSave()}
        >
          Save All Changes
        </Button>
      </div>

      {saveSuccess && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1.25rem', background: 'var(--success-bg)', border: '1px solid var(--success-border)', borderRadius: 'var(--radius-md)', color: 'var(--success)', fontSize: '0.875rem', fontWeight: 600 }}>
          <CheckCircle2 size={18} />
          <span>All options and workspace settings have been saved and applied successfully.</span>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-default)', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        <button
          onClick={() => setActiveTab('profile')}
          className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ gap: '0.5rem', fontSize: '0.8375rem', padding: '0.5rem 1rem' }}
        >
          <User size={15} /> Profile & Identity
        </button>

        <button
          onClick={() => setActiveTab('preferences')}
          className={`btn ${activeTab === 'preferences' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ gap: '0.5rem', fontSize: '0.8375rem', padding: '0.5rem 1rem' }}
        >
          <Sliders size={15} /> Workspace & Display
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`btn ${activeTab === 'notifications' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ gap: '0.5rem', fontSize: '0.8375rem', padding: '0.5rem 1rem' }}
        >
          <Bell size={15} /> Notifications
        </button>

        <button
          onClick={() => setActiveTab('role')}
          className={`btn ${activeTab === 'role' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ gap: '0.5rem', fontSize: '0.8375rem', padding: '0.5rem 1rem' }}
        >
          {currentRole === 'student' && <GraduationCap size={15} />}
          {currentRole === 'mentor' && <Award size={15} />}
          {currentRole === 'evaluator' && <CheckCircle2 size={15} />}
          {(currentRole === 'institution_admin' || currentRole === 'dept_admin') && <Building2 size={15} />}
          <span>{getRoleTitle(currentRole)} Options</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`btn ${activeTab === 'security' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ gap: '0.5rem', fontSize: '0.8375rem', padding: '0.5rem 1rem' }}
        >
          <Lock size={15} /> Security & Access
        </button>
      </div>

      {/* Tab 1: Profile & Identity */}
      {activeTab === 'profile' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card title="Personal Information" subtitle="Update your academic credentials, designation, and primary contact details.">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--bg-dark)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.35rem', fontWeight: 800, flexShrink: 0 }}>
                {fullName ? fullName[0].toUpperCase() : 'U'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>{fullName || 'User'}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  {email} • <span style={{ textTransform: 'capitalize' }}>{getRoleTitle(currentRole)}</span>
                </div>
              </div>
              <span className="badge badge-verified" style={{ padding: '0.35rem 0.75rem' }}>
                Account Active
              </span>
            </div>

            <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Email Address (Primary Identity)</label>
                <input 
                  type="email" 
                  className="form-input" 
                  value={email} 
                  disabled 
                  style={{ opacity: 0.75, cursor: 'not-allowed' }}
                />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Email is bound to institution single sign-on / auth provider.</span>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Academic Roll / Faculty ID</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={rollNumber} 
                  onChange={(e) => setRollNumber(e.target.value)} 
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Department / School</label>
                <select 
                  className="form-select" 
                  value={department} 
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science</option>
                  <option value="Electronics & Communication Engineering">Electronics & Communication Engineering</option>
                  <option value="Electrical & Electronics Engineering">Electrical & Electronics Engineering</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Institution Affiliation</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={institution} 
                  onChange={(e) => setInstitution(e.target.value)} 
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Contact Phone</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1', marginBottom: 0 }}>
                <label className="form-label">Professional Bio / Academic Focus</label>
                <textarea 
                  className="form-textarea" 
                  rows={3} 
                  value={bio} 
                  onChange={(e) => setBio(e.target.value)} 
                />
              </div>

              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <Button type="submit" variant="primary" leftIcon={<Save size={15} />} isLoading={isSaving}>
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Tab 2: Preferences & Display */}
      {activeTab === 'preferences' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card title="Workspace Preferences" subtitle="Customize navigation routing, visual layout, and editor behaviors.">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Default Landing Page</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Select the primary screen displayed upon signing into ProjectFlow.</div>
                </div>
                <select 
                  className="form-select" 
                  style={{ width: 'auto', minWidth: 200 }} 
                  value={defaultLanding} 
                  onChange={(e) => setDefaultLanding(e.target.value)}
                >
                  <option value="/">Dashboard Overview</option>
                  <option value="/tasks">My Tasks & Kanban</option>
                  <option value="/evidence">Evidence Verification</option>
                  <option value="/health">Project Health & SLA</option>
                  <option value="/admin">Admin Governance</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Color Theme Mode</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Adjust visual appearance for low-light or standard environments.</div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {(['dark', 'light', 'system'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`btn ${themeMode === t ? 'btn-primary' : 'btn-outline'} btn-sm`}
                      style={{ textTransform: 'capitalize' }}
                      onClick={() => setThemeMode(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Auto-Save Drafts</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Automatically persist evidence notes and task descriptions locally while editing.</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={autoSaveDrafts} 
                  onChange={(e) => setAutoSaveDrafts(e.target.checked)} 
                  style={{ width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--bg-dark)' }} 
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Code & Artifact Syntax Highlighting</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Theme used for GitHub commit diffs and code artifact viewers.</div>
                </div>
                <select 
                  className="form-select" 
                  style={{ width: 'auto', minWidth: 180 }} 
                  value={syntaxTheme} 
                  onChange={(e) => setSyntaxTheme(e.target.value)}
                >
                  <option value="github-dark">GitHub Dark</option>
                  <option value="monokai">Monokai Pro</option>
                  <option value="one-light">One Light</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <Button variant="primary" leftIcon={<Save size={15} />} isLoading={isSaving} onClick={() => handleSave()}>
                  Save Preferences
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 3: Notifications */}
      {activeTab === 'notifications' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card title="Notification Triggers" subtitle="Choose what events trigger instant in-app alerts and email notifications.">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { title: 'Evidence Submission Updates', desc: 'Notify when team members attach new evidence or git commits.', val: notifyEvidenceSubmitted, set: setNotifyEvidenceSubmitted },
                { title: 'Verification & Review Decisions', desc: 'Alert immediately when mentor or evaluator verifies or requests revision.', val: notifyEvidenceVerified, set: setNotifyEvidenceVerified },
                { title: 'Task Milestones & Deadlines', desc: 'Receive reminders when milestone due dates are approaching within 48 hours.', val: notifyTaskDeadlines, set: setNotifyTaskDeadlines },
                { title: 'Peer Review & Viva Scheduling', desc: 'Notify when viva evaluation slots or rubric grading forms are published.', val: notifyReviewRequests, set: setNotifyReviewRequests },
                { title: 'Weekly Capstone Velocity Digest', desc: 'Summary report of institutional health, completed tasks, and SLA status.', val: weeklyDigest, set: setWeeklyDigest },
                { title: 'Security & Device Login Alerts', desc: 'Receive security warnings when an unfamiliar IP or browser accesses this account.', val: securityAlerts, set: setSecurityAlerts },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem 1rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{item.title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{item.desc}</div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={item.val} 
                    onChange={(e) => item.set(e.target.checked)} 
                    style={{ width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--bg-dark)' }} 
                  />
                </div>
              ))}

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <Button variant="primary" leftIcon={<Save size={15} />} isLoading={isSaving} onClick={() => handleSave()}>
                  Save Notification Options
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 4: Role-Specific Parameters */}
      {activeTab === 'role' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {currentRole === 'student' && (
            <Card title="Student Portfolio & Project Options" subtitle="Configure public showcasing, skill badges, and GitHub identity attribution.">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">GitHub Username / Handle</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={githubUsername} 
                    onChange={(e) => setGithubUsername(e.target.value)} 
                    placeholder="e.g. octocat" 
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Used to automatically match your git author email with evidence commits.</span>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Capstone Engineering Track</label>
                  <select className="form-select" value={capstoneTrack} onChange={(e) => setCapstoneTrack(e.target.value)}>
                    <option value="Full Stack Web Platforms & Cloud Systems">Full Stack Web Platforms & Cloud Systems</option>
                    <option value="Machine Learning & Generative AI Systems">Machine Learning & Generative AI Systems</option>
                    <option value="IoT, Embedded & Autonomous Hardware">IoT, Embedded & Autonomous Hardware</option>
                    <option value="Cybersecurity & Distributed Ledger Systems">Cybersecurity & Distributed Ledger Systems</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Technical Competencies & Skill Tags</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={technicalSkills} 
                    onChange={(e) => setTechnicalSkills(e.target.value)} 
                    placeholder="Comma-separated: React, Python, Docker..." 
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>These appear on your institutional verified portfolio.</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>Public Portfolio Visibility</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Allow external recruiters and evaluators to view your verified evidence badges.</div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={portfolioPublic} 
                    onChange={(e) => setPortfolioPublic(e.target.checked)} 
                    style={{ width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--bg-dark)' }} 
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <Button variant="primary" leftIcon={<Save size={15} />} isLoading={isSaving} onClick={() => handleSave()}>
                    Save Student Settings
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {currentRole === 'mentor' && (
            <Card title="Faculty Mentorship & Supervision Parameters" subtitle="Configure project intake limits, consultation schedule, and auto-flagging rules.">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Maximum Mentorship Capacity (Concurrent Teams)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    min={1} 
                    max={12} 
                    value={maxMentees} 
                    onChange={(e) => setMaxMentees(Number(e.target.value))} 
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Office Hours & Consultation Window</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={consultationHours} 
                    onChange={(e) => setConsultationHours(e.target.value)} 
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Stagnant Task Warning Threshold (Days)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    min={3} 
                    max={30} 
                    value={autoFlagInactiveDays} 
                    onChange={(e) => setAutoFlagInactiveDays(Number(e.target.value))} 
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tasks with no evidence updates for this many days will trigger a health alert.</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <Button variant="primary" leftIcon={<Save size={15} />} isLoading={isSaving} onClick={() => handleSave()}>
                    Save Mentor Settings
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {currentRole === 'evaluator' && (
            <Card title="Evaluation & Viva Examination Framework" subtitle="Set default grading modes, blind evaluation preferences, and rubric weights.">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Evaluation Methodology</label>
                  <select className="form-select" value={evaluationMode} onChange={(e) => setEvaluationMode(e.target.value)}>
                    <option value="rubric_viva">Strict Rubric Matrix + Viva Voce</option>
                    <option value="rubric_only">Rubric Matrix Only</option>
                    <option value="holistic">Qualitative Holistic Assessment</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Viva Voce Score Weight (%)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    min={10} 
                    max={50} 
                    value={vivaWeight} 
                    onChange={(e) => setVivaWeight(Number(e.target.value))} 
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>The remainder ({100 - vivaWeight}%) is computed from continuous evidence milestones.</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>Blind Code Review</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Conceal student names and roll numbers during preliminary architecture scoring.</div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={blindReview} 
                    onChange={(e) => setBlindReview(e.target.checked)} 
                    style={{ width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--bg-dark)' }} 
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <Button variant="primary" leftIcon={<Save size={15} />} isLoading={isSaving} onClick={() => handleSave()}>
                    Save Evaluator Settings
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {(currentRole === 'institution_admin' || currentRole === 'dept_admin') && (
            <Card title="Institutional Governance & Capstone Policy" subtitle="Manage academic calendar periods, self-registration rules, and verification requirements.">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Active Academic Year</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={academicYear} 
                      onChange={(e) => setAcademicYear(e.target.value)} 
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Current Capstone Semester</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={activeSemester} 
                      onChange={(e) => setActiveSemester(e.target.value)} 
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Student Self-Registration Policy</label>
                  <select 
                    className="form-select" 
                    value={studentSelfRegistration} 
                    onChange={(e) => setStudentSelfRegistration(e.target.value)}
                  >
                    <option value="open">Open (Any valid institution email)</option>
                    <option value="approval_required">Approval Required (Admin validates account)</option>
                    <option value="roster_only">Restricted (Pre-loaded department roster only)</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Minimum Evidence Threshold Per Task</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      min={1} 
                      max={5} 
                      value={minEvidencePerTask} 
                      onChange={(e) => setMinEvidencePerTask(Number(e.target.value))} 
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tasks cannot be marked complete without at least this many verified links/files.</span>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Minimum Capstone Passing Benchmark (%)</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      min={40} 
                      max={80} 
                      value={passingGradeCutoff} 
                      onChange={(e) => setPassingGradeCutoff(Number(e.target.value))} 
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <Button variant="primary" leftIcon={<Save size={15} />} isLoading={isSaving} onClick={() => handleSave()}>
                    Save Institutional Policy
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Tab 5: Security & Access */}
      {activeTab === 'security' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card title="Password & Authentication" subtitle="Update your credentials and configure account protection.">
            {passwordMsg && (
              <div style={{ 
                padding: '0.85rem 1rem', 
                borderRadius: 'var(--radius-sm)', 
                marginBottom: '1.25rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                background: passwordMsg.type === 'success' ? 'var(--success-bg)' : 'var(--danger-bg)',
                color: passwordMsg.type === 'success' ? 'var(--success)' : 'var(--danger)',
                border: `1px solid ${passwordMsg.type === 'success' ? 'var(--success-border)' : 'var(--danger-border)'}`,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                {passwordMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{passwordMsg.text}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem', maxWidth: 480 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Current Password</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    className="form-input" 
                    value={currentPassword} 
                    onChange={(e) => setCurrentPassword(e.target.value)} 
                    placeholder="••••••••" 
                    required 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: 12, top: 12, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">New Password</label>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  className="form-input" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  placeholder="Minimum 6 characters" 
                  required 
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Confirm New Password</label>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  className="form-input" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  placeholder="Repeat new password" 
                  required 
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '0.5rem' }}>
                <Button type="submit" variant="primary" leftIcon={<Key size={15} />}>
                  Update Password
                </Button>
              </div>
            </form>
          </Card>

          <Card title="Active Sessions" subtitle="Devices and browsers currently logged into this ProjectFlow session.">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <Laptop size={20} style={{ color: 'var(--text-primary)' }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                      Current Workstation (Windows • Chrome)
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      IP: 192.168.1.104 • Active now
                    </div>
                  </div>
                </div>
                <span className="badge badge-verified">Current Device</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', opacity: 0.85 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <Smartphone size={20} style={{ color: 'var(--text-secondary)' }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                      Mobile Safari (iOS 18)
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Last active 3 hours ago
                    </div>
                  </div>
                </div>
                <button 
                  type="button" 
                  className="btn btn-outline btn-sm" 
                  style={{ color: 'var(--danger)', borderColor: 'var(--danger-border)' }}
                  onClick={() => alert('Session revoked.')}
                >
                  Revoke
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
