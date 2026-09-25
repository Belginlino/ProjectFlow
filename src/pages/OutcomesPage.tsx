import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { dataService } from '../services/dataService';
import { useAuth } from '../context/AuthContext';
import { LearningOutcome, Skill, Reflection } from '../types';
import { BookOpen, Award, CheckCircle, Plus, Sparkles, MessageSquare } from 'lucide-react';

export const OutcomesPage: React.FC = () => {
  const { currentUser } = useAuth();
  const project = dataService.getProjects()[0];
  const outcomes = dataService.getLearningOutcomes();
  const skills = dataService.getSkills();
  const [reflections, setReflections] = useState<Reflection[]>(() => dataService.getReflections(project.id));

  // Reflection modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [milestoneTitle, setMilestoneTitle] = useState('Milestone 3: Final System Integration');
  const [content, setContent] = useState('');
  const [challenges, setChallenges] = useState('');
  const [learnings, setLearnings] = useState('');

  const handleAddReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;

    dataService.addReflection({
      projectId: project.id,
      userId: currentUser?.id || 'anon',
      authorName: currentUser?.fullName || 'User',
      milestoneTitle,
      content,
      challenges,
      learnings,
    });

    setReflections(dataService.getReflections(project.id));
    setIsModalOpen(false);
    setContent('');
    setChallenges('');
    setLearnings('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Learning Outcomes & Skills Competency
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Traceable mappings connecting institutional Course/Program Outcomes (CO/PO/PSO) and reflective learning
        </p>
      </div>

      {/* Program Outcomes Grid */}
      <div>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen size={20} className="text-sky-400" />
          Institutional Learning Outcomes (CO / PO / PSO)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
          {outcomes.map((out) => (
            <Card key={out.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <Badge variant="verified">{out.code}</Badge>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                  {out.outcomeType}
                </span>
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                {out.name}
              </h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {out.description}
              </p>
              <div style={{ marginTop: '1rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <CheckCircle size={14} /> Mapped to Verified Project Work
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Skills Matrix */}
      <div>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Award size={20} className="text-purple-400" />
          Evidence-Backed Competency Matrix
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {skills.map((sk) => (
            <Card key={sk.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                  {sk.category}
                </span>
                <Badge variant="verified">{(sk.level || 'proficient').toUpperCase()}</Badge>
              </div>
              <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                {sk.name}
              </h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                {sk.description}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Student Reflections Journal */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare size={20} className="text-amber-400" />
              Student Milestone Reflections & Metacognitive Logs
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              Verifiable student self-assessments detailing technical challenges and lessons learned
            </p>
          </div>
          <Button leftIcon={<Plus size={16} />} onClick={() => setIsModalOpen(true)}>
            Record Reflection
          </Button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reflections.map((refl) => (
            <Card key={refl.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#38bdf8' }}>
                  {refl.milestoneTitle}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  By {refl.authorName} &bull; {new Date(refl.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                "{refl.content}"
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fb7185', textTransform: 'uppercase' }}>
                    Critical Challenge Faced:
                  </span>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    {refl.challenges}
                  </p>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase' }}>
                    Key Engineering Learning:
                  </span>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    {refl.learnings}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Add Reflection Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record Academic Milestone Reflection"
        subtitle="Articulate engineering growth, adversarial testing observations, and feedback integration"
      >
        <form onSubmit={handleAddReflection} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input
            label="Milestone Phase"
            value={milestoneTitle}
            onChange={(e) => setMilestoneTitle(e.target.value)}
            required
          />

          <div className="form-group">
            <label className="form-label">Reflective Experience</label>
            <textarea
              className="form-textarea"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Reflect on your implementation decisions, critique received from faculty, and revisions made..."
              required
            />
          </div>

          <Input
            label="Engineering Challenge Encountered"
            value={challenges}
            onChange={(e) => setChallenges(e.target.value)}
            placeholder="e.g. Model inference latency exceeded threshold on test devices"
            required
          />

          <Input
            label="Key Learning / Outcome"
            value={learnings}
            onChange={(e) => setLearnings(e.target.value)}
            placeholder="e.g. Learned how to apply CLAHE to prevent dark shadow noise amplification"
            required
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Submit Reflection</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
