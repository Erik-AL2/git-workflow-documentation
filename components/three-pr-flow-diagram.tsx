'use client';

import { GitDiagram } from '@/components/git-diagram';
import { BRANCH_COLORS_HEX } from '@/lib/branch-colors';

export function ThreePRFlowDiagram() {
  return (
    <div className="space-y-12">
      {/* Main visual flow */}
      <GitDiagram
        commits={[
          // Main branch
          { id: 'm1', branch: 'main', x: 100, y: 250, message: 'prod stable' },
          { id: 'm2', branch: 'main', x: 700, y: 250, message: 'PR #3 merged', type: 'merge' },

          // Feature branch
          { id: 'f1', branch: 'feature', x: 200, y: 150, message: 'init' },
          { id: 'f2', branch: 'feature', x: 300, y: 150, message: 'commit 1' },
          { id: 'f3', branch: 'feature', x: 400, y: 150, message: 'commit 2' },
          { id: 'f4', branch: 'feature', x: 500, y: 150, message: 'commit 3' },

          // Dev branch
          { id: 'd1', branch: 'dev', x: 100, y: 50, message: 'dev base' },
          { id: 'd2', branch: 'dev', x: 450, y: 50, message: 'PR #1 merged', type: 'merge' },

          // Staging branch
          { id: 's1', branch: 'stg', x: 100, y: 100, message: 'stg base' },
          { id: 's2', branch: 'stg', x: 550, y: 100, message: 'PR #2 merged', type: 'merge' },
        ]}
        branches={[
          { name: 'dev', color: BRANCH_COLORS_HEX.dev, y: 50 },
          { name: 'stg', color: BRANCH_COLORS_HEX.stg, y: 100 },
          { name: 'feature', color: BRANCH_COLORS_HEX.feature, y: 150 },
          { name: 'main', color: BRANCH_COLORS_HEX.main, y: 250 },
        ]}
        connections={[
          // Feature creation from main
          { from: 'm1', to: 'f1' },

          // Feature commits
          { from: 'f1', to: 'f2' },
          { from: 'f2', to: 'f3' },
          { from: 'f3', to: 'f4' },

          // PR #1: feature → dev
          { from: 'f3', to: 'd2', type: 'merge' },

          // PR #2: feature → stg
          { from: 'f4', to: 's2', type: 'merge' },

          // PR #3: feature → main
          { from: 'f4', to: 'm2', type: 'merge' },
        ]}
        height={320}
      />

      {/* PR Labels Overlay */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 -mt-4">
        <div className="p-4 rounded-lg border border-primary/40 bg-primary/5">
          <div className="text-xs font-semibold text-primary mb-1">PR #1</div>
          <div className="text-sm font-bold text-foreground">feature → dev</div>
          <div className="text-xs text-muted-foreground mt-1">
            Merge cuando CI pasa
          </div>
        </div>

        <div className="p-4 rounded-lg border border-orange-500/40 bg-orange-500/5">
          <div className="text-xs font-semibold text-orange-500 mb-1">PR #2</div>
          <div className="text-sm font-bold text-foreground">feature → stg</div>
          <div className="text-xs text-muted-foreground mt-1">
            Merge cuando QA aprueba
          </div>
        </div>

        <div className="p-4 rounded-lg border border-success/40 bg-success/5">
          <div className="text-xs font-semibold text-success mb-1">PR #3</div>
          <div className="text-sm font-bold text-foreground">feature → main</div>
          <div className="text-xs text-muted-foreground mt-1">
            Merge cuando todo está listo
          </div>
        </div>
      </div>
    </div>
  );
}
