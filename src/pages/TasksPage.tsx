import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { dataService } from '../services/dataService';
import { useAuth } from '../context/AuthContext';
import { Task, TaskStatus, TaskPriority, Requirement, Evidence } from '../types';
import { Plus, ShieldCheck, Clock, User, ArrowRight, CornerDownRight, CheckCircle2, Sparkles, GitBranch, Link2, CheckSquare2 } from 'lucide-react';


const COLUMNS: Array<{ status: TaskStatus; label: string }> = [
  { status: 'backlog', label: 'Backlog' },
  { status: 'todo', label: 'To Do' },
  { status: 'in_progress', label: 'In Progress' },
  { status: 'review', label: 'Mentor Review' },
  { status: 'testing', label: 'Testing & QA' },
  { status: 'done', label: 'Done (Verified)' },
];

export const TasksPage: React.FC = () => {
  const { currentUser } = useAuth();
  const projects = dataService.getProjects();
  const project = projects[0];

  if (!project) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>You don't have any active projects yet.</p>
      </div>
    );
  }

  const [tasks, setTasks] = useState<Task[]>(() => dataService.getTasks(project.id));
  const requirements = dataService.getRequirements(project.id);
  const evidenceLinks = dataService.getEvidenceLinks(project.id);
  const [isAiSuggesting, setIsAiSuggesting] = useState(false);

  // New task modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedReqId, setSelectedReqId] = useState<string>(requirements[0]?.id || '');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [assigneeId, setAssigneeId] = useState(currentUser?.id || '');
  const [dueDate, setDueDate] = useState('2026-10-15');

  // PR Linking Modal
  const [isPrModalOpen, setIsPrModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [selectedPr, setSelectedPr] = useState('');

  const [prs, setPrs] = useState<any[]>([]); // To be fetched from real backend

  const handleLinkPr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskId || !selectedPr) return;

    const pr = prs.find(p => p.id === selectedPr);
    if (!pr) return;

    dataService.createEvidence({
      projectId: project.id,
      ownerId: currentUser?.id || 'anon',
      ownerName: currentUser?.fullName || 'User',
      title: `GitHub PR: ${pr.title}`,
      description: `Linked Pull Request by @${pr.author}. State: ${pr.state}`,
      type: 'github_pr',
      sourceType: 'github',
      sourceUrl: pr.url,
    }, selectedTaskId, 'task', 'implements', currentUser?.id, currentUser?.fullName);

    setTasks(dataService.getTasks(project.id));
    setIsPrModalOpen(false);
    setSelectedPr('');
  };


  const handleAiSuggestTasks = () => {
    if (!requirements || requirements.length === 0) return;
    setIsAiSuggesting(true);
    // Find requirement with fewest tasks
    const targetReq = requirements[0];
    const suggested = dataService.aiSuggestTasks(targetReq);
    
    suggested.forEach((s) => {
      dataService.createTask(
        {
          projectId: project.id,
          requirementId: targetReq.id,
          title: s.title,
          description: s.description,
          status: 'todo',
          priority: s.priority as TaskPriority,
          assigneeId: currentUser?.id || 'belgin-01',
          assigneeName: currentUser?.fullName || 'Belgin',
          dueDate: '2026-10-25',
          dependencies: [],
        },
        'system-ai',
        'ProjectFlow AI Assistant'
      );
    });

    setTimeout(() => {
      setTasks(dataService.getTasks(project.id));
      setIsAiSuggesting(false);
    }, 400);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const assignee = project.team.members.find((m) => m.uid === assigneeId);

    dataService.createTask(
      {
        projectId: project.id,
        requirementId: selectedReqId,
        title,
        description,
        status: 'todo',
        priority,
        assigneeId,
        assigneeName: assignee ? assignee.fullName : currentUser?.fullName || 'User',
        dueDate,
        dependencies: [],
      },
      currentUser?.id || 'anon',
      currentUser?.fullName || 'User'
    );

    setTasks(dataService.getTasks(project.id));
    setIsModalOpen(false);
    setTitle('');
    setDescription('');
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    dataService.updateTaskStatus(taskId, newStatus, currentUser?.id || 'anon', currentUser?.fullName || 'User');
    setTasks(dataService.getTasks(project.id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Execution Task Board (Kanban)
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Tasks linked to academic requirements and verifiable evidence deliverables
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button
            variant="outline"
            leftIcon={<Sparkles size={16} />}
            onClick={handleAiSuggestTasks}
            disabled={isAiSuggesting}
            style={{ border: '1px dashed var(--info)', color: 'var(--info)', background: 'var(--info-bg)' }}
          >
            {isAiSuggesting ? 'Synthesizing...' : 'AI Suggestion: Task Breakdown'}
          </Button>
          <Button leftIcon={<Plus size={16} />} onClick={() => setIsModalOpen(true)}>
            New Task
          </Button>
        </div>
      </div>

      {/* Kanban Grid */}
      {tasks.length === 0 ? (
        <div style={{ padding: '4rem 1rem', textAlign: 'center', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-default)' }}>
          <CheckSquare2 size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No tasks created yet</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem', maxWidth: 400, margin: '0 auto 1.5rem' }}>
            Break down your requirements into actionable tasks to start tracking your development progress.
          </p>
          <Button leftIcon={<Plus size={16} />} onClick={() => setIsModalOpen(true)}>
            Create First Task
          </Button>
        </div>
      ) : (
      <div className="kanban-grid">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.status);

          return (
            <div key={col.status} className="kanban-col">
              <div className="kanban-col-header">
                <span>{col.label}</span>
                <span
                  style={{
                    background: 'var(--bg-surface-elevated)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                  }}
                >
                  {colTasks.length}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {colTasks.length === 0 ? (
                  <div
                    style={{
                      padding: '2rem 1rem',
                      textAlign: 'center',
                      color: 'var(--text-muted)',
                      fontSize: '0.8125rem',
                      border: '1px dashed var(--border-default)',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    No tasks in {col.label}
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const req = requirements.find((r) => r.id === task.requirementId);
                    const hasEvidence = evidenceLinks.some((l) => l.entityType === 'task' && l.entityId === task.id);

                    return (
                      <div
                        key={task.id}
                        className="card"
                        style={{
                          padding: '1rem',
                          background: 'var(--bg-surface-elevated)',
                          border: '1px solid var(--border-default)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            {task.id}
                          </span>
                          <Badge status={task.priority} />
                        </div>

                        <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                          {task.title}
                        </h4>

                        {req && (
                          <div style={{ fontSize: '0.75rem', color: '#38bdf8', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <CornerDownRight size={12} /> {req.id}
                          </div>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.75rem' }}>
                          <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <User size={12} /> {task.assigneeName?.split(' ')[0]}
                          </span>
                          {hasEvidence ? (
                            <span style={{ color: '#34d399', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <ShieldCheck size={12} /> Evidence
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text-muted)' }}>No Evidence</span>
                          )}
                        </div>

                        {/* Move column quick selector */}
                        <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                          {COLUMNS.filter((c) => c.status !== task.status).slice(0, 3).map((targetCol) => (
                            <button
                              key={targetCol.status}
                              type="button"
                              onClick={() => handleStatusChange(task.id, targetCol.status)}
                              className="btn btn-outline btn-sm"
                              style={{ padding: '0.15rem 0.4rem', fontSize: '0.65rem' }}
                            >
                              &rarr; {targetCol.label}
                            </button>
                          ))}
                        </div>

                        <div style={{ marginTop: '0.5rem' }}>
                          <button
                            type="button"
                            onClick={() => { setSelectedTaskId(task.id); setIsPrModalOpen(true); }}
                            className="btn btn-outline btn-sm"
                            style={{ padding: '0.15rem 0.4rem', fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.2rem', width: '100%', justifyContent: 'center' }}
                          >
                            <GitBranch size={10} /> Link GitHub PR
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Create Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Execution Task"
        subtitle="Associate task with an academic requirement and assignee"
      >
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input
            label="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Implement CLAHE preprocessing pipeline"
            required
          />

          <div className="form-group">
            <label className="form-label">Linked Academic Requirement</label>
            <select
              className="form-select"
              value={selectedReqId}
              onChange={(e) => setSelectedReqId(e.target.value)}
            >
              {requirements.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.id}: {r.title}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Assignee</label>
              <select
                className="form-select"
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
              >
                {project.team.members.map((m) => (
                  <option key={m.uid} value={m.uid}>
                    {m.fullName} ({m.projectRole})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <Input
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <div className="form-group">
            <label className="form-label">Task Description</label>
            <textarea
              className="form-textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What technical work needs to be completed and what evidence must be uploaded?"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Task</Button>
          </div>
        </form>
      </Modal>

      {/* Link PR Modal */}
      <Modal
        isOpen={isPrModalOpen}
        onClose={() => setIsPrModalOpen(false)}
        title="Link GitHub Pull Request"
        subtitle="Associate a GitHub PR to this task to generate Contribution Evidence"
      >
        <form onSubmit={handleLinkPr} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Select Open or Merged PR</label>
            <select
              className="form-select"
              value={selectedPr}
              onChange={(e) => setSelectedPr(e.target.value)}
              required
            >
              <option value="" disabled>Select PR...</option>
              {prs.map((pr) => (
                <option key={pr.id} value={pr.id}>
                  {pr.title} ({pr.state})
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <Button variant="outline" type="button" onClick={() => setIsPrModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" leftIcon={<Link2 size={16} />}>Link Pull Request</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

