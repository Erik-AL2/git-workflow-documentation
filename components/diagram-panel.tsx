'use client';

import React from "react"

import { useEffect, useRef, useState } from 'react';
import { Diagram } from '@/lib/types';
import { GitTreeDiagram } from '@/components/diagrams/git-tree-diagram';
import { FlowDiagram } from '@/components/diagrams/flow-diagram';
import { ZoomIn, ZoomOut, Maximize2 } from '@/components/icons';
import { Button } from '@/components/ui/button';

interface DiagramPanelProps {
  diagram?: Diagram;
  activeSection: string;
}

export function DiagramPanel({ diagram, activeSection }: DiagramPanelProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset zoom and pan when diagram changes
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [diagram?.id]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 0.5));
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({ x: e.clientX - startPan.x, y: e.clientY - startPan.y });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((prev) => Math.max(0.5, Math.min(3, prev + delta)));
  };

  if (!diagram) {
    return (
      <aside className="hidden lg:flex lg:flex-[0.4] bg-card border-l border-border items-center justify-center">
        <p className="text-muted-foreground text-sm">No diagram available</p>
      </aside>
    );
  }

  return (
    <aside className="hidden lg:flex lg:flex-[0.4] bg-card border-l border-border flex-col overflow-hidden">
      <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b border-border px-4 py-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Interactive Diagram</h3>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomOut}
            className="h-8 w-8"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleReset}
            className="h-8 w-8"
            title="Reset View"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomIn}
            className="h-8 w-8"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-hidden relative"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
      >
        <div
          className="w-full h-full flex items-center justify-center"
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            transformOrigin: 'center center',
            transition: isPanning ? 'none' : 'transform 0.2s ease-out',
          }}
        >
          {diagram.type === 'git-tree' && <GitTreeDiagram diagram={diagram} />}
          {diagram.type === 'flow' && <FlowDiagram diagram={diagram} />}
          {diagram.type === 'steps' && <FlowDiagram diagram={diagram} />}
          {diagram.type === 'comparison' && <FlowDiagram diagram={diagram} />}
        </div>
      </div>


    </aside>
  );
}
