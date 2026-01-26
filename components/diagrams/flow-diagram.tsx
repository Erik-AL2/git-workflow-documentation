'use client';

import { Diagram } from '@/lib/types';
import { ArrowRight, CheckCircle2 } from '@/components/icons';

interface FlowDiagramProps {
  diagram: Diagram;
}

export function FlowDiagram({ diagram }: FlowDiagramProps) {
  const { nodes, edges } = diagram;

  // Auto-layout nodes horizontally with better spacing
  const spacing = Math.min(160, 600 / (nodes.length || 1));
  const nodePositions = nodes.map((node, index) => ({
    ...node,
    x: node.x || 100 + index * spacing,
    y: node.y || 250,
  }));

  return (
    <svg
      width="800"
      height="500"
      viewBox="0 0 800 500"
      className="w-full h-full"
      style={{ maxWidth: '100%', maxHeight: '100%' }}
    >
      <defs>
        <marker
          id="arrowhead-flow"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L0,6 L9,3 z" fill="#0070f3" />
        </marker>
        
        <filter id="shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
        </filter>
        
        <linearGradient id="cardGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#1a1a1a', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#0a0a0a', stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Render edges */}
      {edges.map((edge, index) => {
        const fromNode = nodePositions.find((n) => n.id === edge.from);
        const toNode = nodePositions.find((n) => n.id === edge.to);

        if (!fromNode || !toNode) return null;

        const startX = fromNode.x + 65;
        const endX = toNode.x - 65;
        const y = fromNode.y;

        return (
          <g key={`edge-${index}`}>
            {/* Arrow line with animation */}
            <line
              x1={startX}
              y1={y}
              x2={endX}
              y2={y}
              stroke="#0070f3"
              strokeWidth="2.5"
              markerEnd="url(#arrowhead-flow)"
              className="vercel-transition"
              strokeDasharray="5,5"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="10"
                to="0"
                dur="0.5s"
                repeatCount="indefinite"
              />
            </line>
            
            {edge.label && (
              <g>
                <rect
                  x={(startX + endX) / 2 - 25}
                  y={y - 20}
                  width="50"
                  height="20"
                  rx="10"
                  fill="#0a0a0a"
                  stroke="#0070f3"
                  strokeWidth="1.5"
                />
                <text
                  x={(startX + endX) / 2}
                  y={y - 6}
                  fill="#0070f3"
                  fontSize="10"
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

      {/* Render nodes with modern card design */}
      {nodePositions.map((node, index) => {
        const color = node.color || '#0070f3';
        
        return (
          <g
            key={node.id}
            className="vercel-transition cursor-pointer hover:opacity-90"
            style={{ filter: 'url(#shadow)' }}
          >
            {/* Card background with gradient */}
            <rect
              x={node.x - 65}
              y={node.y - 45}
              width="130"
              height="90"
              rx="12"
              fill="url(#cardGradient)"
              stroke={color}
              strokeWidth="2"
              className="vercel-transition hover:stroke-[3]"
            />

            {/* Top accent bar */}
            <rect
              x={node.x - 65}
              y={node.y - 45}
              width="130"
              height="4"
              rx="12"
              fill={color}
            />

            {/* Number badge */}
            <circle
              cx={node.x - 45}
              cy={node.y - 25}
              r="14"
              fill={color}
              opacity="0.2"
            />
            <circle
              cx={node.x - 45}
              cy={node.y - 25}
              r="12"
              fill={color}
            />
            <text
              x={node.x - 45}
              y={node.y - 20}
              fill="#ffffff"
              fontSize="11"
              fontWeight="700"
              textAnchor="middle"
            >
              {index + 1}
            </text>

            {/* Icon */}
            <foreignObject
              x={node.x - 12}
              y={node.y - 30}
              width="24"
              height="24"
            >
              <div className="flex items-center justify-center w-full h-full">
                <CheckCircle2 className="w-5 h-5 text-success" strokeWidth={2.5} />
              </div>
            </foreignObject>

            {/* Label text with word wrap */}
            <text
              x={node.x}
              y={node.y + 10}
              fill="#ffffff"
              fontSize="12"
              fontWeight="600"
              textAnchor="middle"
              className="select-none"
            >
              {node.label.length > 15 ? (
                <>
                  <tspan x={node.x} dy="0">{node.label.substring(0, 15)}</tspan>
                  <tspan x={node.x} dy="14">{node.label.substring(15)}</tspan>
                </>
              ) : (
                node.label
              )}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
