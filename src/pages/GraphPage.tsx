import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { EvidenceGraphVisualizer } from '../components/graph/EvidenceGraphVisualizer';
import { Modal } from '../components/common/Modal';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { dataService } from '../services/dataService';
import { Evidence } from '../types';
import { Printer, Filter } from 'lucide-react';

export const GraphPage: React.FC = () => {
  const { onOpenEvidence } = useOutletContext<{ onOpenEvidence: (ev: Evidence) => void }>();
  const projects = dataService.getProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(projects[0]?.id || null);

  const project = projects.find(p => p.id === selectedProjectId) || projects[0];

  if (!project) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>You don't have any active projects.</p>
      </div>
    );
  }

  const requirements = dataService.getRequirements(project.id);
  const tasks = dataService.getTasks(project.id);
  const evidence = dataService.getEvidence(project.id);
  const reviews = dataService.getReviews(project.id);
  const changeRequests = dataService.getChangeRequests(project.id);
  const evaluations = dataService.getEvaluations(project.id);

  // Inspector modal
  const [inspectedNode, setInspectedNode] = useState<{ type: string; data: any } | null>(null);

  const handleSelectNode = (type: string, data: any) => {
    if (type === 'evidence') {
      onOpenEvidence(data);
    } else {
      setInspectedNode({ type, data });
    }
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="print-container">
      <style>{`
        @media print {
          @page { size: landscape; margin: 1cm; }
          .no-print { display: none !important; }
          body { background: white !important; margin: 0; padding: 0; }
          .card, .card-glass, .graph-container { box-shadow: none !important; border: 1px solid #ddd !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          
          .graph-columns-container {
            overflow: visible !important;
            display: flex !important;
            flex-wrap: nowrap !important;
            width: 100% !important;
          }
          .graph-columns-container > div {
            flex: 1 1 0 !important;
            min-width: 0 !important;
            word-wrap: break-word !important;
          }
        }
      `}</style>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Project Evidence Graph Visualizer
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Direct graphical mapping of the complete academic lifecycle from Requirements to Evaluations
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }} className="no-print">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} color="var(--text-muted)" />
            <select
              className="form-input"
              style={{ minWidth: '250px', padding: '0.375rem 0.75rem' }}
              value={selectedProjectId || ''}
              onChange={(e) => setSelectedProjectId(e.target.value)}
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.title} ({p.status})</option>
              ))}
            </select>
          </div>
          <Button variant="outline" leftIcon={<Printer size={16} />} onClick={() => window.print()}>
            Print Report
          </Button>
        </div>
      </div>

      <EvidenceGraphVisualizer
        requirements={requirements}
        tasks={tasks}
        evidence={evidence}
        reviews={reviews}
        changeRequests={changeRequests}
        evaluations={evaluations}
        onSelectNode={handleSelectNode}
      />

      {/* Node Inspector Modal */}
      {inspectedNode && (
        <Modal
          isOpen={Boolean(inspectedNode)}
          onClose={() => setInspectedNode(null)}
          title={`Graph Entity: ${inspectedNode.type.toUpperCase()}`}
          subtitle={`Entity ID: ${inspectedNode.data.id}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                {inspectedNode.data.title || inspectedNode.data.name || inspectedNode.data.criterionName}
              </h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {inspectedNode.data.description || inspectedNode.data.comments || inspectedNode.data.feedback || 'Detailed graph metadata available.'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Status:</span>
              <Badge status={inspectedNode.data.status || 'verified'} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <Button variant="outline" onClick={() => setInspectedNode(null)}>
                Close Inspector
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
