'use client';

import { cn } from '@/lib/utils';
import { GitBranch, GitMerge, GitCommit, ArrowRight, ArrowDown } from '@/components/icons';

interface SprintDiagramProps {
  activeSection: string;
}

export function SprintDiagram({ activeSection }: SprintDiagramProps) {
  if (activeSection === 'sprint-1') {
    return (
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-muted-foreground tracking-wider">
          SPRINT 1 FLOW
        </h3>
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          {/* Integration Branch */}
          <div className="flex items-center gap-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
            <GitBranch className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-semibold text-primary">integration</p>
              <p className="text-xs text-muted-foreground">Starting point</p>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-5 h-5 text-muted-foreground" />
          </div>

          {/* Feature A */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-error/10 border border-error/20 rounded-lg">
              <GitBranch className="w-5 h-5 text-error" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-error">feature/A</p>
                <p className="text-xs text-muted-foreground">6 commits</p>
              </div>
            </div>
            <div className="ml-8 space-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <ArrowRight className="w-3 h-3" />
                <span>PR → dev</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowRight className="w-3 h-3" />
                <span>PR → stg</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowRight className="w-3 h-3" />
                <span>PR → integration</span>
              </div>
            </div>
          </div>

          {/* Feature B */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-success/10 border border-success/20 rounded-lg">
              <GitBranch className="w-5 h-5 text-success" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-success">feature/B</p>
                <p className="text-xs text-muted-foreground">4 commits</p>
              </div>
            </div>
            <div className="ml-8 space-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <ArrowRight className="w-3 h-3" />
                <span>PR → dev</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowRight className="w-3 h-3" />
                <span>PR → stg</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowRight className="w-3 h-3" />
                <span>PR → integration</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Status:</span> integration has 10 commits (6+4)
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (activeSection === 'release-day') {
    return (
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-muted-foreground tracking-wider">
          RELEASE DAY FLOW
        </h3>
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          {/* Step 1 */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-foreground">STEP 1: Squash Merge</p>
            <div className="flex items-center gap-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <GitCommit className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-primary">integration</p>
                <p className="text-xs text-muted-foreground">10 commits</p>
              </div>
            </div>

            <div className="flex items-center gap-2 pl-4">
              <ArrowDown className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Squash merge</span>
            </div>

            <div className="flex items-center gap-3 p-3 bg-secondary/50 border border-border rounded-lg">
              <GitMerge className="w-5 h-5 text-foreground" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">main</p>
                <p className="text-xs text-muted-foreground">1 squashed commit</p>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-3">
            <p className="text-xs font-semibold text-foreground mb-2">STEP 2: Sync (CRITICAL)</p>
            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
              <code className="text-xs text-foreground block">git checkout integration</code>
              <code className="text-xs text-foreground block">git merge main</code>
              <code className="text-xs text-foreground block">git push origin integration</code>
            </div>
          </div>

          <div className="pt-3 border-t border-border">
            <p className="text-xs text-success flex items-center gap-2">
              <span>✓</span>
              <span>Content identical in both branches</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (activeSection === 'sprint-2') {
    return (
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-muted-foreground tracking-wider">
          SPRINT 2 FLOW
        </h3>
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
            <GitBranch className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-semibold text-primary">integration</p>
              <p className="text-xs text-muted-foreground">Synced with main</p>
            </div>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-5 h-5 text-muted-foreground" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-error/10 border border-error/20 rounded-lg">
              <GitBranch className="w-5 h-5 text-error" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-error">feature/C</p>
                <p className="text-xs text-muted-foreground">3 commits</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-success/20 text-success font-medium">
                No conflicts
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-success/10 border border-success/20 rounded-lg">
              <GitBranch className="w-5 h-5 text-success" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-success">feature/D</p>
                <p className="text-xs text-muted-foreground">5 commits</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-success/20 text-success font-medium">
                No conflicts
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Cycle continues indefinitely without conflicts
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
