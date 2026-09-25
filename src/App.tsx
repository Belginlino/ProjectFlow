import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { RequirementsPage } from './pages/RequirementsPage';
import { TasksPage } from './pages/TasksPage';
import { EvidencePage } from './pages/EvidencePage';
import { GraphPage } from './pages/GraphPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { HealthPage } from './pages/HealthPage';
import { ContributionPage } from './pages/ContributionPage';
import { EvaluationPage } from './pages/EvaluationPage';
import { OutcomesPage } from './pages/OutcomesPage';
import { AuditPage } from './pages/AuditPage';
import { IdeasPage } from './pages/IdeasPage';
import { TeamPage } from './pages/TeamPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { AdminPage } from './pages/AdminPage';

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-app)' }}>
        <div style={{ color: 'var(--text-muted)' }}>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const AuthRedirect: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
};

import { UserRole } from './types';

const RoleGuard: React.FC<{ allowedRoles: UserRole[], children: React.ReactNode }> = ({ allowedRoles, children }) => {
  const { currentRole } = useAuth();
  
  // If the user's role is not in the allowed list, redirect them to their respective dashboard
  if (currentRole && !allowedRoles.includes(currentRole as UserRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<AuthRedirect><LoginPage /></AuthRedirect>} />
          
          <Route element={<AuthGuard><AppLayout /></AuthGuard>}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/ideas" element={<RoleGuard allowedRoles={['student']}><IdeasPage /></RoleGuard>} />
            <Route path="/team" element={<RoleGuard allowedRoles={['student', 'institution_admin', 'dept_admin']}><TeamPage /></RoleGuard>} />
            <Route path="/requirements" element={<RoleGuard allowedRoles={['student', 'institution_admin', 'dept_admin']}><RequirementsPage /></RoleGuard>} />
            <Route path="/tasks" element={<RoleGuard allowedRoles={['student', 'mentor']}><TasksPage /></RoleGuard>} />
            <Route path="/evidence" element={<RoleGuard allowedRoles={['student', 'mentor', 'evaluator', 'institution_admin']}><EvidencePage /></RoleGuard>} />
            <Route path="/graph" element={<RoleGuard allowedRoles={['student', 'mentor', 'evaluator']}><GraphPage /></RoleGuard>} />
            <Route path="/reviews" element={<RoleGuard allowedRoles={['student', 'mentor']}><ReviewsPage /></RoleGuard>} />
            <Route path="/health" element={<RoleGuard allowedRoles={['student', 'mentor', 'institution_admin', 'dept_admin']}><HealthPage /></RoleGuard>} />
            <Route path="/contribution" element={<RoleGuard allowedRoles={['student', 'mentor', 'evaluator']}><ContributionPage /></RoleGuard>} />
            <Route path="/evaluation" element={<RoleGuard allowedRoles={['student', 'evaluator', 'institution_admin']}><EvaluationPage /></RoleGuard>} />
            <Route path="/outcomes" element={<RoleGuard allowedRoles={['student', 'mentor', 'evaluator', 'institution_admin', 'dept_admin']}><OutcomesPage /></RoleGuard>} />
            <Route path="/portfolio" element={<RoleGuard allowedRoles={['student']}><PortfolioPage /></RoleGuard>} />
            <Route path="/audit" element={<RoleGuard allowedRoles={['institution_admin']}><AuditPage /></RoleGuard>} />
            <Route path="/admin" element={<RoleGuard allowedRoles={['institution_admin', 'dept_admin']}><AdminPage /></RoleGuard>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
