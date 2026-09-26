import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GitMerge, Mail, Lock, User, AlertCircle, Eye, EyeOff, Sparkles, GraduationCap, Award, ShieldCheck, Settings } from 'lucide-react';
import { Button } from '../components/common/Button';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
  </svg>
);

export const LoginPage: React.FC = () => {
  const { loginWithGoogle, loginWithEmail, signupWithEmail, isLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [selectedRole, setSelectedRole] = useState<import('../types').UserRole>('student');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (isLogin) {
        await loginWithEmail(email, password);
      } else {
        await signupWithEmail(email, password, fullName, selectedRole);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    try {
      await loginWithGoogle(isLogin ? undefined : selectedRole);
    } catch (err: any) {
      setError(err.message || 'Google authentication failed.');
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setError('');
    setSubmitting(true);
    try {
      await loginWithEmail(demoEmail, 'demo123');
    } catch (err: any) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setSubmitting(false);
    }
  };


  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-app)' }}>
        <div style={{ color: 'var(--text-muted)' }}>Loading workspace...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-app)', backgroundImage: 'radial-gradient(ellipse at 20% 10%, rgba(255,255,255,0.6) 0%, transparent 55%), radial-gradient(ellipse at 80% 90%, rgba(255,255,255,0.4) 0%, transparent 55%)' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        
        {/* Header Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '2.5rem' }}>
          <div style={{ width: 42, height: 42, background: 'var(--bg-dark)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            <GitMerge size={22} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>ProjectFlow</div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Evidence Platform</span>
          </div>
        </div>

        {/* Card */}
        <div className="card-glass" style={{ width: '100%', maxWidth: 420, padding: '2.5rem', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.06)' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem', textAlign: 'center', letterSpacing: '-0.02em' }}>
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '1.75rem' }}>
            {isLogin ? 'Enter your details to access your workspace' : 'Join ProjectFlow to manage verified evidence'}
          </p>

          <Button variant="outline" style={{ width: '100%', justifyContent: 'center', gap: '0.625rem', marginBottom: '1.5rem', height: '44px' }} onClick={handleGoogle}>
            <GoogleIcon />
            <span>Continue with Google</span>
          </Button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Or</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
          </div>

          {error && (
            <div style={{ padding: '0.75rem', background: 'var(--danger-bg)', border: '1px solid var(--danger-border)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <AlertCircle size={15} style={{ color: 'var(--danger)', marginTop: 2, flexShrink: 0 }} />
              <span style={{ fontSize: '0.8125rem', color: 'var(--danger)' }}>{error}</span>
            </div>
          )}

          {forgotSent && (
            <div style={{ padding: '0.75rem', background: 'var(--success-bg)', border: '1px solid var(--success-border)', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.8125rem', color: 'var(--success)' }}>
              Password reset link sent to your email address.
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
            {!isLogin && (
              <>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: 12, top: 13, color: 'var(--text-muted)' }} />
                    <input type="text" className="form-input" style={{ paddingLeft: '2.5rem' }} placeholder="John Doe" value={fullName} onChange={e => setFullName(e.target.value)} required />
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Role</label>
                  <select 
                    className="form-select" 
                    value={selectedRole} 
                    onChange={e => setSelectedRole(e.target.value as any)}
                  >
                    <option value="student">Student</option>
                    <option value="mentor">Mentor</option>
                    <option value="evaluator">Evaluator</option>
                    <option value="institution_admin">Admin</option>
                  </select>
                </div>
              </>
            )}
            
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 12, top: 13, color: 'var(--text-muted)' }} />
                <input type="email" className="form-input" style={{ paddingLeft: '2.5rem' }} placeholder="you@university.edu" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Password</label>
                {isLogin && (
                  <button type="button" onClick={() => setForgotSent(true)} style={{ background: 'none', border: 'none', fontSize: '0.75rem', color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'inherit' }}>
                    Forgot password?
                  </button>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 12, top: 13, color: 'var(--text-muted)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 12, top: 12, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button type="submit" variant="primary" style={{ width: '100%', justifyContent: 'center', height: '44px', marginTop: '0.5rem' }} disabled={submitting}>
              {submitting ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          {/* Toggle login / signup */}
          <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button type="button" onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </div>

        </div>
        </div>

        {/* Demo 1-Click Logins */}
        <div style={{ marginTop: '2rem', width: '100%', maxWidth: 420 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem', textAlign: 'center' }}>
            Hackathon Demo Quick Login
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            <Button variant="outline" size="sm" onClick={() => handleDemoLogin('belgin@ait.edu')} disabled={submitting}>
              Student
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleDemoLogin('meena@ait.edu')} disabled={submitting}>
              Mentor
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleDemoLogin('admin@projectflow.com')} disabled={submitting}>
              Admin
            </Button>
          </div>
        </div>
      </div>
  );
};
