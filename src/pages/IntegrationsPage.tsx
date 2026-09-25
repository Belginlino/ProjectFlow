import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { dataService } from '../services/dataService';
import { useAuth } from '../context/AuthContext';
import { GitBranch, Settings, CheckCircle2, Link2, GitPullRequest, Search, Activity, UserPlus } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { GithubAuthProvider, signInWithPopup } from 'firebase/auth';

export const IntegrationsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const projects = dataService.getProjects();
  const project = projects[0];
  const location = useLocation();
  const navigate = useNavigate();

  const [repositories, setRepositories] = useState<{ id: string; name: string; url: string; addedAt: string }[]>(() => {
    const saved = localStorage.getItem(`pf_gh_repos_${project?.id}`);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [teamMapping, setTeamMapping] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem(`pf_gh_mapping_${project?.id}`);
    return saved ? JSON.parse(saved) : {};
  });

  const [githubToken, setGithubToken] = useState<string | null>(() => {
    return localStorage.getItem(`pf_gh_token_${project?.id}`);
  });

  const [isConnected, setIsConnected] = useState(repositories.length > 0);
  
  useEffect(() => {
    if (project) {
      localStorage.setItem(`pf_gh_repos_${project.id}`, JSON.stringify(repositories));
      setIsConnected(repositories.length > 0);
    }
  }, [repositories, project]);

  useEffect(() => {
    if (project) {
      localStorage.setItem(`pf_gh_mapping_${project.id}`, JSON.stringify(teamMapping));
    }
  }, [teamMapping, project]);

  useEffect(() => {
    if (project) {
      if (githubToken) {
        localStorage.setItem(`pf_gh_token_${project.id}`, githubToken);
      } else {
        localStorage.removeItem(`pf_gh_token_${project.id}`);
      }
    }
  }, [githubToken, project]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [availableRepos, setAvailableRepos] = useState<any[]>([]);
  const [selectedRepoFullName, setSelectedRepoFullName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [fallbackUsername, setFallbackUsername] = useState('');
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const handleConnectGitHub = async () => {
    setIsConnecting(true);
    setErrorMsg('');
    
    try {
      const provider = new GithubAuthProvider();
      provider.addScope('repo');
      
      const result = await signInWithPopup(auth, provider);
      const credential = GithubAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      
      if (!token) throw new Error('Failed to get GitHub Access Token');
      
      setGithubToken(token);
      
      // Fetch user's repos
      const res = await fetch('https://api.github.com/user/repos?sort=updated&per_page=50', {
        headers: {
          Authorization: `token ${token}`
        }
      });
      
      if (!res.ok) throw new Error('Failed to fetch repositories.');
      
      const repos = await res.json();
      setAvailableRepos(repos);
      
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/operation-not-allowed') {
        setErrorMsg('GitHub Auth is not enabled in your Firebase Console. Please enable it in Firebase > Authentication > Sign-in method, or use the fallback below.');
      } else {
        setErrorMsg(err.message || 'Failed to authenticate with GitHub.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleFetchPublicRepos = async () => {
    if (!fallbackUsername.trim()) return;
    setIsConnecting(true);
    setErrorMsg('');
    try {
      const res = await fetch(`https://api.github.com/users/${fallbackUsername.trim()}/repos?sort=updated&per_page=50`);
      if (!res.ok) throw new Error('User not found or API rate limit exceeded.');
      const repos = await res.json();
      setAvailableRepos(repos);
      setIsUsingFallback(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to fetch repositories.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSelectRepository = () => {
    if (!selectedRepoFullName) return;
    
    const repo = availableRepos.find(r => r.full_name === selectedRepoFullName);
    if (!repo) return;
    
    setRepositories([
      { 
        id: repo.id.toString(), 
        name: repo.full_name, 
        url: repo.html_url, 
        addedAt: new Date().toISOString() 
      }
    ]);
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setRepositories([]);
    setGithubToken(null);
    setAvailableRepos([]);
    setSelectedRepoFullName('');
    setFallbackUsername('');
    if (project) {
      localStorage.removeItem(`pf_gh_repos_${project.id}`);
      localStorage.removeItem(`pf_gh_mapping_${project.id}`);
      localStorage.removeItem(`pf_gh_token_${project.id}`);
    }
  };

  const handleMappingChange = (memberId: string, githubHandle: string) => {
    setTeamMapping(prev => ({ ...prev, [memberId]: githubHandle }));
  };

  const triggerSync = async () => {
    if (repositories.length === 0) return;
    const repo = repositories[0];
    
    setIsSyncing(true);
    try {
      const headers: Record<string, string> = {};
      if (githubToken) {
        headers['Authorization'] = `token ${githubToken}`;
      }
      
      const res = await fetch(`https://api.github.com/repos/${repo.name}/commits?per_page=10`, { headers });
      if (!res.ok) throw new Error('Failed to fetch commits');
      const commits = await res.json();
      
      let evidenceAdded = 0;
      
      commits.forEach((c: any) => {
        const authorLogin = c.author?.login || c.commit.author.name;
        
        // Find if this author matches any mapped team member
        let matchedMemberId: string | undefined;
        for (const [memberId, mappedHandle] of Object.entries(teamMapping)) {
          if (mappedHandle.toLowerCase() === authorLogin.toLowerCase() || 
              mappedHandle.replace('@', '').toLowerCase() === authorLogin.toLowerCase()) {
            matchedMemberId = memberId;
            break;
          }
        }
        
        if (matchedMemberId) {
          const matchedMember = project.team.members.find(m => m.uid === matchedMemberId);
          // Check if this evidence already exists (prevent duplicates)
          const allEvidence = dataService.getEvidence(project.id);
          const exists = allEvidence.some(e => e.sourceUrl === c.html_url);
          
          if (!exists) {
            dataService.createEvidence({
              projectId: project.id,
              ownerId: matchedMemberId,
              ownerName: matchedMember?.fullName || authorLogin,
              type: 'code_pr',
              title: c.commit.message.split('\n')[0].substring(0, 50),
              description: `Commit by ${authorLogin}: ${c.commit.message}`,
              sourceType: 'github',
              sourceUrl: c.html_url,
            });
            evidenceAdded++;
          }
        }
      });
      
      alert(`Sync complete! ${evidenceAdded} new commits were mapped to your team members and added as evidence.`);
    } catch (err: any) {
      console.error(err);
      alert('Error syncing commits: ' + err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  if (!project) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', padding: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Integrations & Evidence Sources
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          You don't have any active projects to connect integrations to. Create a project first on your Dashboard.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Integrations & Evidence Sources
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Connect external tools to automatically synchronize activity and generate verifiable evidence for {project.title}.
        </p>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--bg-app)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-subtle)' }}>
              <GitBranch size={32} style={{ color: 'var(--text-primary)' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                GitHub Activity Integration
                {isConnected && (
                  <span className="badge badge-verified" style={{ fontSize: '0.7rem', padding: '0.1rem 0.5rem' }}>
                    <CheckCircle2 size={12} /> Connected
                  </span>
                )}
              </h2>
              <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.875rem', maxWidth: '600px' }}>
                Link your repository to automatically track commits, pull requests, and code reviews. 
                Use issue references like <code style={{ background: 'var(--bg-dark)', padding: '0.1rem 0.3rem', borderRadius: 4 }}>Fixes task-123</code> to link code directly to ProjectFlow Tasks.
              </p>
            </div>
          </div>
          
          <div>
            {!isConnected && availableRepos.length === 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <Button 
                    variant="primary" 
                    onClick={handleConnectGitHub} 
                    leftIcon={<GitBranch size={16} />}
                    disabled={isConnecting}
                  >
                    {isConnecting && !isUsingFallback ? 'Authenticating...' : 'Authenticate with GitHub (OAuth)'}
                  </Button>
                  {errorMsg && <div style={{ color: 'var(--danger)', fontSize: '0.75rem', maxWidth: '400px' }}>{errorMsg}</div>}
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                    Or fetch public repositories
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="GitHub Username (e.g. octocat)"
                      value={fallbackUsername}
                      onChange={e => setFallbackUsername(e.target.value)}
                      style={{ maxWidth: '250px' }}
                    />
                    <Button 
                      variant="secondary" 
                      onClick={handleFetchPublicRepos}
                      disabled={isConnecting || !fallbackUsername.trim()}
                    >
                      Fetch Repos
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {!isConnected && availableRepos.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <select 
                  className="form-select" 
                  style={{ minWidth: '300px' }}
                  value={selectedRepoFullName}
                  onChange={e => setSelectedRepoFullName(e.target.value)}
                >
                  <option value="" disabled>Select a repository...</option>
                  {availableRepos.map(repo => (
                    <option key={repo.id} value={repo.full_name}>{repo.full_name}</option>
                  ))}
                </select>
                <Button 
                  variant="primary" 
                  onClick={handleSelectRepository} 
                  leftIcon={<Link2 size={16} />}
                  disabled={!selectedRepoFullName}
                >
                  Link Repository
                </Button>
              </div>
            )}

            {isConnected && (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button variant="secondary" onClick={triggerSync} leftIcon={<Activity size={16} />} disabled={isSyncing}>
                  {isSyncing ? 'Syncing...' : 'Sync Now'}
                </Button>
                <Button variant="outline" onClick={handleDisconnect} style={{ color: 'var(--danger)', borderColor: 'var(--danger-border)' }}>
                  Disconnect
                </Button>
              </div>
            )}
          </div>
        </div>

        {isConnected && (
          <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 650, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <GitPullRequest size={16} style={{ color: 'var(--text-muted)' }} />
                  Linked Repositories
                </h3>
                {repositories.length === 0 ? (
                  <div style={{ padding: '1rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No repositories selected.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {repositories.map(repo => (
                      <div key={repo.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                        <a href={repo.url} target="_blank" rel="noreferrer" style={{ fontWeight: 500, color: 'var(--brand-primary)', textDecoration: 'none' }}>
                          {repo.name}
                        </a>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Synced {new Date(repo.addedAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 650, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <UserPlus size={16} style={{ color: 'var(--text-muted)' }} />
                  Team Account Mapping
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Map ProjectFlow team members to their GitHub usernames to attribute commit evidence.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {project.team.members.map(member => (
                    <div key={member.uid} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40%', fontSize: '0.875rem', fontWeight: 500 }}>
                        {member.fullName}
                      </div>
                      <div style={{ width: '60%', position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                          @
                        </div>
                        <input
                          type="text"
                          className="form-input"
                          style={{ paddingLeft: '2rem', height: '2rem' }}
                          placeholder="github_username"
                          value={teamMapping[member.uid] || ''}
                          onChange={(e) => handleMappingChange(member.uid, e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
