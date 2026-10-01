import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Building2, GraduationCap, ArrowRight, User } from 'lucide-react';
import { Button } from '../components/common/Button';
import { db } from '../lib/firebase';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';

export const OnboardingPage: React.FC = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  
  const [role, setRole] = useState(currentUser?.role || 'student');
  const [institutionId, setInstitutionId] = useState(currentUser?.institutionId || '');
  const [department, setDepartment] = useState(currentUser?.department || '');
  const [customInstitution, setCustomInstitution] = useState('');
  const [customDepartment, setCustomDepartment] = useState('');
  const [rollNumber, setRollNumber] = useState(currentUser?.rollNumber || '');
  const [saving, setSaving] = useState(false);
  const [registeredInstitutions, setRegisteredInstitutions] = React.useState<string[]>([
    'St. Xavier\'s College',
    'Adithya Institute of Technology',
    'National Institute of Technology',
    'Indian Institute of Technology'
  ]);

  const DEPARTMENTS = [
    'Computer Science & Engineering',
    'Information Technology',
    'Electronics & Communication',
    'Electrical & Electronics',
    'Mechanical Engineering',
    'Civil Engineering',
    'Artificial Intelligence & Data Science'
  ];

  React.useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const snap = await getDocs(collection(db, 'institutions'));
        const instList = snap.docs.map(doc => doc.id);
        if (instList.length > 0) {
          setRegisteredInstitutions(prev => Array.from(new Set([...prev, ...instList])));
        }
      } catch (err) {
        console.error('Failed to fetch institutions', err);
      }
    };
    fetchInstitutions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const finalInstitution = institutionId === 'other' ? customInstitution : institutionId;
    const finalDepartment = department === 'other' ? customDepartment : department;

    await updateUserProfile({
      role,
      institutionId: finalInstitution,
      department: finalDepartment,
      rollNumber,
      onboardingComplete: true
    });
    
    // Register the institution if it's new
    try {
      if (finalInstitution.trim().length > 0) {
        await setDoc(doc(db, 'institutions', finalInstitution.trim()), { name: finalInstitution.trim() }, { merge: true });
      }
    } catch (err) {
      console.error('Failed to register institution', err);
    }

    setSaving(false);
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-app)' }}>
      <div className="card" style={{ width: '100%', maxWidth: 500, padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 48, height: 48, background: 'var(--bg-dark)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <User size={24} color="white" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Complete Your Profile</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            We need a few more details to set up your workspace.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Your Role</label>
            <select className="form-select" value={role} onChange={e => setRole(e.target.value as any)} required>
              <option value="student">Student</option>
              <option value="mentor">Mentor</option>
              <option value="evaluator">Evaluator</option>
              <option value="institution_admin">Institution Admin</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Institution</label>
            <select 
              className="form-select" 
              value={institutionId} 
              onChange={e => setInstitutionId(e.target.value)} 
              required
            >
              <option value="" disabled>Select your institution</option>
              {registeredInstitutions.map((inst) => (
                <option key={inst} value={inst}>{inst}</option>
              ))}
              <option value="other">Other (Add New)</option>
            </select>
            {institutionId === 'other' && (
              <div style={{ position: 'relative', marginTop: '0.75rem' }}>
                <Building2 size={16} style={{ position: 'absolute', left: 12, top: 13, color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ paddingLeft: '2.5rem' }} 
                  placeholder="Enter new institution name" 
                  value={customInstitution} 
                  onChange={e => setCustomInstitution(e.target.value)} 
                  required 
                />
              </div>
            )}
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Department</label>
            <select 
              className="form-select" 
              value={department} 
              onChange={e => setDepartment(e.target.value)} 
              required
            >
              <option value="" disabled>Select your department</option>
              {DEPARTMENTS.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
              <option value="other">Other (Specify)</option>
            </select>
            {department === 'other' && (
              <div style={{ marginTop: '0.75rem' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Enter department name" 
                  value={customDepartment} 
                  onChange={e => setCustomDepartment(e.target.value)} 
                  required 
                />
              </div>
            )}
          </div>

          {role === 'student' && (
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>Roll No / Emp No</label>
              <div style={{ position: 'relative' }}>
                <GraduationCap size={16} style={{ position: 'absolute', left: 12, top: 13, color: 'var(--text-muted)' }} />
                <input type="text" className="form-input" style={{ paddingLeft: '2.5rem' }} placeholder="e.g. CS26-042" value={rollNumber} onChange={e => setRollNumber(e.target.value)} required />
              </div>
            </div>
          )}

          <Button type="submit" variant="primary" style={{ marginTop: '1rem', justifyContent: 'center' }} disabled={saving} rightIcon={<ArrowRight size={16} />}>
            {saving ? 'Saving...' : 'Complete Setup'}
          </Button>
        </form>
      </div>
    </div>
  );
};
