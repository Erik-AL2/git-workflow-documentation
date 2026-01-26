'use client';

import { Button } from '@/components/ui/button';
import { GitBranch } from '@/components/icons';

interface WorkflowSelectorProps {
  workflows: Array<{ id: string; title: string; description: string }>;
  currentWorkflowId: string;
  onWorkflowChange: (id: string) => void;
}

export function WorkflowSelector({
  workflows,
  currentWorkflowId,
  onWorkflowChange,
}: WorkflowSelectorProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <GitBranch className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Git Workflows</h2>
            <p className="text-xs text-muted-foreground">Documentation Hub</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {workflows.map((workflow) => (
            <Button
              key={workflow.id}
              variant={currentWorkflowId === workflow.id ? 'default' : 'ghost'}
              onClick={() => onWorkflowChange(workflow.id)}
              className="text-sm"
            >
              {workflow.title}
            </Button>
          ))}
        </div>
      </div>
    </header>
  );
}
