import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { EvidenceGraphVisualizer } from '../components/graph/EvidenceGraphVisualizer';
import { Modal } from '../components/common/Modal';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { dataService } from '../services/dataService';
import { Evidence } from '../types';

export const GraphPage: React.FC = () => {
  const { onOpenEvidence } = useOutletContext<{ onOpenEvidence: (ev: Evidence) => void }>();
  const project = dataService.getProjects()[0];

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Project Evidence Graph Visualizer
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Direct graphical mapping of the complete academic lifecycle from Requirements to Evaluations
        </p>
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
