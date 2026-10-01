import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { EvidenceDrawer } from '../evidence/EvidenceDrawer';
import { Evidence, Review, EvidenceLink } from '../../types';
import { dataService } from '../../services/dataService';
import { useAuth } from '../../context/AuthContext';

export const AppLayout: React.FC = () => {
  const [activeEvidence, setActiveEvidence] = useState<Evidence | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { currentUser } = useAuth();

  const handleOpenEvidence = (ev: Evidence) => {
    setActiveEvidence(ev);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setActiveEvidence(null);
  };

  // Get linked reviews & links for drawer
  const reviews: Review[] = activeEvidence
    ? dataService.getReviews(activeEvidence.projectId).filter((r) => r.evidenceId === activeEvidence.id)
    : [];

  const links: EvidenceLink[] = activeEvidence
    ? dataService.getEvidenceLinks(activeEvidence.projectId).filter((l) => l.evidenceId === activeEvidence.id)
    : [];

  const handleVerify = (status: Evidence['verificationStatus']) => {
    if (activeEvidence) {
      const updated = dataService.verifyEvidence(activeEvidence.id, status, currentUser?.id || 'usr-mentor', currentUser?.fullName || 'Mentor');
      setActiveEvidence({ ...updated });
    }
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="app-container">
      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-overlay" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className="main-content">
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="content-body" id="main-content">
          <Outlet context={{ onOpenEvidence: handleOpenEvidence }} />
        </main>
      </div>

      {activeEvidence && (
        <EvidenceDrawer
          evidence={activeEvidence}
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
          onVerify={handleVerify}
          reviews={reviews}
          links={links}
        />
      )}
    </div>
  );
};
