'use client';

import { Workflow } from './types';

const STORAGE_KEY = 'git-workflow-docs-workflows';

export const defaultWorkflow: Workflow = {
  id: 'squash-merge',
  title: 'Squash Merge & Release Cycle',
  description: 'Sprint-based workflow with squash merges',
  sections: [
    {
      id: 'sprint-1',
      title: 'Sprint 1',
      content: `## Sprint 1

Create features from integration branch. Each feature is developed in isolation.

### Feature Development
- Create feature branches from \`integration\`
- Work independently on features A, B, C
- Multiple commits per feature
- Regular testing and reviews

### Key Points
- Features remain isolated
- Integration branch stays stable
- Easy to review individual features
- Flexible sprint planning`,
      diagramId: 'sprint-1-diagram',
    },
    {
      id: 'release',
      title: 'Release Day',
      content: `## Release Day

Squash merge features into integration, then merge to main.

### Squash Merge Process
1. Squash feature commits into single commit
2. Merge to integration for final testing
3. Deploy integration to staging
4. After validation, merge to main
5. Deploy main to production

### Benefits
- Clean commit history on main
- Easy to revert entire features
- Clear release points
- Simplified auditing`,
      diagramId: 'release-diagram',
    },
    {
      id: 'sprint-2',
      title: 'Sprint 2',
      content: `## Sprint 2

Continue cycle with new features from updated integration.

### Next Sprint
- Pull latest integration branch
- Create new feature branches
- Repeat the process
- Maintain clean history

### Best Practices
- Keep features small and focused
- Regular integration testing
- Document breaking changes
- Communicate with team`,
      diagramId: 'sprint-2-diagram',
    },
  ],
  diagrams: [
    {
      id: 'sprint-1-diagram',
      type: 'git-tree',
      nodes: [
        { id: 'integration-1', label: 'integration', color: '#0070f3', x: 300, y: 50 },
        { id: 'feature-a', label: 'feature/A', commits: 6, color: '#ff0080', x: 100, y: 150 },
        { id: 'feature-b', label: 'feature/B', commits: 4, color: '#0dde6a', x: 300, y: 150 },
        { id: 'feature-c', label: 'feature/C', commits: 3, color: '#a855f7', x: 500, y: 150 },
      ],
      edges: [
        { from: 'integration-1', to: 'feature-a', label: 'branch' },
        { from: 'integration-1', to: 'feature-b', label: 'branch' },
        { from: 'integration-1', to: 'feature-c', label: 'branch' },
      ],
    },
    {
      id: 'release-diagram',
      type: 'git-tree',
      nodes: [
        { id: 'integration-2', label: 'integration', color: '#0070f3', x: 300, y: 50 },
        { id: 'feature-a-2', label: 'feature/A (6→1)', color: '#ff0080', x: 100, y: 150 },
        { id: 'feature-b-2', label: 'feature/B (4→1)', color: '#0dde6a', x: 300, y: 150 },
        { id: 'feature-c-2', label: 'feature/C (3→1)', color: '#a855f7', x: 500, y: 150 },
        { id: 'main', label: 'main', color: '#888888', x: 300, y: 300 },
      ],
      edges: [
        { from: 'feature-a-2', to: 'integration-2', label: 'squash' },
        { from: 'feature-b-2', to: 'integration-2', label: 'squash' },
        { from: 'feature-c-2', to: 'integration-2', label: 'squash' },
        { from: 'integration-2', to: 'main', label: 'merge' },
      ],
    },
    {
      id: 'sprint-2-diagram',
      type: 'git-tree',
      nodes: [
        { id: 'integration-3', label: 'integration', color: '#0070f3', x: 300, y: 50 },
        { id: 'feature-d', label: 'feature/D', commits: 5, color: '#ff0080', x: 150, y: 150 },
        { id: 'feature-e', label: 'feature/E', commits: 7, color: '#0dde6a', x: 450, y: 150 },
      ],
      edges: [
        { from: 'integration-3', to: 'feature-d', label: 'branch' },
        { from: 'integration-3', to: 'feature-e', label: 'branch' },
      ],
    },
  ],
};

export function loadWorkflows(): Workflow[] {
  if (typeof window === 'undefined') return [defaultWorkflow];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [defaultWorkflow];
    
    const workflows = JSON.parse(stored);
    return workflows.length > 0 ? workflows : [defaultWorkflow];
  } catch {
    return [defaultWorkflow];
  }
}

export function saveWorkflows(workflows: Workflow[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workflows));
  } catch (error) {
    console.error('Failed to save workflows:', error);
  }
}

export function addWorkflow(workflow: Workflow): void {
  const workflows = loadWorkflows();
  workflows.push(workflow);
  saveWorkflows(workflows);
}

export function deleteWorkflow(id: string): void {
  const workflows = loadWorkflows();
  const filtered = workflows.filter(w => w.id !== id);
  saveWorkflows(filtered.length > 0 ? filtered : [defaultWorkflow]);
}

export function updateWorkflow(workflow: Workflow): void {
  const workflows = loadWorkflows();
  const index = workflows.findIndex(w => w.id === workflow.id);
  
  if (index !== -1) {
    workflows[index] = workflow;
    saveWorkflows(workflows);
  }
}
