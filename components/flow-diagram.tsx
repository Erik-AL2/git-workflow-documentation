'use client';

import React from "react"

import { ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FlowNode {
  id: string;
  label: string;
  sublabel?: string;
  color: string;
  icon?: React.ReactNode;
}

interface FlowDiagramProps {
  nodes: FlowNode[];
  vertical?: boolean;
}

export function FlowDiagram({ nodes, vertical = true }: FlowDiagramProps) {
  if (vertical) {
    return (
      <div className="my-8 flex flex-col items-center gap-3">
        {nodes.map((node, idx) => (
          <div key={node.id} className="flex flex-col items-center w-full max-w-md">
            <div
              className="w-full rounded-lg border-2 p-4 transition-all hover:scale-105 hover:shadow-lg"
              style={{
                borderColor: node.color,
                backgroundColor: `${node.color}10`,
              }}
            >
              <div className="flex items-center gap-3">
                {node.icon && (
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${node.color}20` }}
                  >
                    {node.icon}
                  </div>
                )}
                <div className="flex-1">
                  <div className="font-semibold text-foreground">{node.label}</div>
                  {node.sublabel && (
                    <div className="text-sm text-muted-foreground mt-0.5">{node.sublabel}</div>
                  )}
                </div>
              </div>
            </div>
            
            {idx < nodes.length - 1 && (
              <div className="my-2 flex items-center justify-center">
                <ArrowDown className="w-5 h-5 text-muted-foreground" strokeWidth={2} />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="my-8 flex items-center gap-3 overflow-x-auto pb-4">
      {nodes.map((node, idx) => (
        <div key={node.id} className="flex items-center">
          <div
            className="rounded-lg border-2 px-4 py-3 transition-all hover:scale-105 hover:shadow-lg whitespace-nowrap"
            style={{
              borderColor: node.color,
              backgroundColor: `${node.color}10`,
            }}
          >
            <div className="font-semibold text-foreground">{node.label}</div>
            {node.sublabel && (
              <div className="text-sm text-muted-foreground mt-1">{node.sublabel}</div>
            )}
          </div>
          
          {idx < nodes.length - 1 && (
            <div className="mx-2 text-muted-foreground">→</div>
          )}
        </div>
      ))}
    </div>
  );
}
