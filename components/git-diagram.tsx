'use client';

import { cn } from '@/lib/utils';

interface CommitNode {
  id: string;
  branch: string;
  message?: string;
  x: number;
  y: number;
  type?: 'commit' | 'merge' | 'squash';
}

interface Branch {
  name: string;
  color: string;
  y: number;
}

interface GitDiagramProps {
  commits: CommitNode[];
  branches: Branch[];
  connections?: { from: string; to: string; type?: 'normal' | 'merge' }[];
  height?: number;
}

export function GitDiagram({ commits, branches, connections = [], height = 400 }: GitDiagramProps) {
  const branchColors: Record<string, string> = {};
  branches.forEach(b => {
    branchColors[b.name] = b.color;
  });

  return (
    <div className="my-8 overflow-x-auto">
      <div className="inline-block min-w-full">
        <svg
          className="w-full"
          style={{ height: `${height}px` }}
          viewBox={`0 0 ${Math.max(...commits.map(c => c.x)) + 100} ${height}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Branch lines */}
          {branches.map((branch) => (
            <line
              key={branch.name}
              x1={20}
              y1={branch.y}
              x2={Math.max(...commits.map(c => c.x)) + 80}
              y2={branch.y}
              stroke={branch.color}
              strokeWidth="2"
              strokeDasharray="4 4"
              opacity="0.3"
            />
          ))}

          {/* Branch labels */}
          {branches.map((branch) => (
            <g key={`label-${branch.name}`}>
              <rect
                x={5}
                y={branch.y - 12}
                width={branch.name.length * 7 + 12}
                height={24}
                rx="4"
                fill={branch.color}
                opacity="0.1"
              />
              <text
                x={11}
                y={branch.y + 5}
                className="text-xs font-mono font-semibold"
                fill={branch.color}
              >
                {branch.name}
              </text>
            </g>
          ))}

          {/* Connection lines */}
          {connections.map((conn, idx) => {
            const fromCommit = commits.find(c => c.id === conn.from);
            const toCommit = commits.find(c => c.id === conn.to);
            if (!fromCommit || !toCommit) return null;

            const isMerge = conn.type === 'merge';
            const color = branchColors[toCommit.branch] || '#888';

            return (
              <g key={`conn-${idx}`}>
                <path
                  d={`M ${fromCommit.x} ${fromCommit.y} Q ${(fromCommit.x + toCommit.x) / 2} ${(fromCommit.y + toCommit.y) / 2}, ${toCommit.x} ${toCommit.y}`}
                  stroke={color}
                  strokeWidth={isMerge ? "2" : "2"}
                  fill="none"
                  opacity="0.6"
                  markerEnd="url(#arrowhead)"
                />
                {isMerge && (
                  <text
                    x={(fromCommit.x + toCommit.x) / 2}
                    y={(fromCommit.y + toCommit.y) / 2 - 10}
                    className="text-[10px] font-mono"
                    fill={color}
                    opacity="0.7"
                  >
                    merge
                  </text>
                )}
              </g>
            );
          })}

          {/* Arrow marker definition */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" fill="#888" opacity="0.6" />
            </marker>
          </defs>

          {/* Commit nodes */}
          {commits.map((commit) => {
            const color = branchColors[commit.branch] || '#888';
            const isSquash = commit.type === 'squash';
            const isMerge = commit.type === 'merge';

            return (
              <g key={commit.id}>
                {/* Node glow effect */}
                <circle
                  cx={commit.x}
                  cy={commit.y}
                  r={isSquash ? 12 : 8}
                  fill={color}
                  opacity="0.2"
                  className="animate-pulse"
                />
                
                {/* Node */}
                <circle
                  cx={commit.x}
                  cy={commit.y}
                  r={isSquash ? 10 : 6}
                  fill={color}
                  stroke="oklch(0.145 0 0)"
                  strokeWidth="2"
                  className="transition-all hover:r-8"
                />

                {/* Special marker for squash/merge */}
                {isSquash && (
                  <text
                    x={commit.x}
                    y={commit.y + 3}
                    className="text-[8px] font-bold"
                    fill="oklch(0.145 0 0)"
                    textAnchor="middle"
                  >
                    S
                  </text>
                )}
                {isMerge && (
                  <text
                    x={commit.x}
                    y={commit.y + 3}
                    className="text-[8px] font-bold"
                    fill="oklch(0.145 0 0)"
                    textAnchor="middle"
                  >
                    M
                  </text>
                )}

                {/* Commit message */}
                {commit.message && (
                  <text
                    x={commit.x}
                    y={commit.y + (isSquash ? 28 : 24)}
                    className="text-[11px] font-mono"
                    fill="currentColor"
                    textAnchor="middle"
                    opacity="0.7"
                  >
                    {commit.message}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
