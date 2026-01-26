'use client';

import { Diagram } from '@/lib/types';
import { GitBranch, GitCommit, GitMerge } from 'lucide-react';

interface GitTreeDiagramProps {
  diagram: Diagram;
}

export function GitTreeDiagram({ diagram }: GitTreeDiagramProps) {
  const { nodes, edges } = diagram;

  // Calculate positions for nodes with better spacing
  const nodePositions = nodes.map((node, index) => ({
    ...node,
    x: node.x || 150 + (index % 3) * 200,
    y: node.y || 100 + Math.floor(index / 3) * 150,
  }));

  return (
    <svg
      width="700"
      height="500"
      viewBox="0 0 700 500"
      className="w-full h-full"
      style={{ maxWidth: '100%', maxHeight: '100%' }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,6 L9,3 z" fill="#0070f3" />
        </marker>
        
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#0070f3', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#0050c2', stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Render edges with curves */}
      {edges.map((edge, index) => {
        const fromNode = nodePositions.find((n) => n.id === edge.from);
        const toNode = nodePositions.find((n) => n.id === edge.to);

        if (!fromNode || !toNode) return null;

        const dx = toNode.x - fromNode.x;
        const dy = toNode.y - fromNode.y;
        const midX = fromNode.x + dx / 2;
        const midY = fromNode.y + dy / 2;
        
        // Create a curved path
        const controlX = midX;
        const controlY = fromNode.y + dy / 3;

        return (
          <g key={`edge-${index}`}>
            <path
              d={`M ${fromNode.x} ${fromNode.y} Q ${controlX} ${controlY}, ${toNode.x} ${toNode.y}`}
              stroke="#0070f3"
              strokeWidth="2.5"
              fill="none"
              markerEnd="url(#arrowhead)"
              className="vercel-transition opacity-50 hover:opacity-100"
              style={{ filter: 'url(#glow)' }}
            />
            {edge.label && (
              <g>
                <rect
                  x={midX - 30}
                  y={controlY - 12}
                  width="60"
                  height="24"
                  rx="12"
                  fill="#0a0a0a"
                  stroke="#0070f3"
                  strokeWidth="1.5"
                />
                <text
                  x={midX}
                  y={controlY + 4}
                  fill="#0070f3"
                  fontSize="11"
                  fontWeight="600"
                  textAnchor="middle"
                  className="font-mono"
                >
                  {edge.label}
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* Render nodes with modern design */}
      {nodePositions.map((node, index) => {
        const color = node.color || '#0070f3';
        
        return (
          <g
            key={node.id}
            className="vercel-transition cursor-pointer"
            style={{ filter: 'url(#glow)' }}
          >
            {/* Outer glow circle */}
            <circle
              cx={node.x}
              cy={node.y}
              r="45"
              fill={color}
              opacity="0.1"
              className="animate-pulse"
            />
            
            {/* Main node circle with gradient */}
            <circle
              cx={node.x}
              cy={node.y}
              r="32"
              fill="url(#nodeGradient)"
              stroke={color}
              strokeWidth="3"
              className="hover:stroke-[4] vercel-transition"
            />

            {/* Icon */}
            <foreignObject
              x={node.x - 14}
              y={node.y - 14}
              width="28"
              height="28"
            >
              <div className="flex items-center justify-center w-full h-full">
                {index === 0 ? (
                  <GitCommit className="w-6 h-6 text-white" strokeWidth={2.5} />
                ) : index === nodePositions.length - 1 ? (
                  <GitMerge className="w-6 h-6 text-white" strokeWidth={2.5} />
                ) : (
                  <GitBranch className="w-6 h-6 text-white" strokeWidth={2.5} />
                )}
              </div>
            </foreignObject>

            {/* Label with background */}
            <g>
              <rect
                x={node.x - 50}
                y={node.y + 48}
                width="100"
                height="28"
                rx="6"
                fill="#0a0a0a"
                stroke="#333333"
                strokeWidth="1"
              />
              <text
                x={node.x}
                y={node.y + 67}
                fill="#ffffff"
                fontSize="13"
                fontWeight="600"
                textAnchor="middle"
              >
                {node.label}
              </text>
            </g>

            {/* Commits badge */}
            {node.commits && (
              <g>
                <rect
                  x={node.x - 28}
                  y={node.y + 82}
                  width="56"
                  height="22"
                  rx="11"
                  fill={color}
                  opacity="0.2"
                />
                <rect
                  x={node.x - 26}
                  y={node.y + 84}
                  width="52"
                  height="18"
                  rx="9"
                  fill="#0a0a0a"
                  stroke={color}
                  strokeWidth="1.5"
                />
                <text
                  x={node.x}
                  y={node.y + 97}
                  fill={color}
                  fontSize="10"
                  fontWeight="600"
                  textAnchor="middle"
                  className="font-mono"
                >
                  {node.commits}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}
