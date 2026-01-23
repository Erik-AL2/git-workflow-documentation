export interface DiagramNode {
  id: string;
  label: string;
  color?: string;
  commits?: number;
  x?: number;
  y?: number;
}

export interface DiagramEdge {
  from: string;
  to: string;
  label?: string;
}

export interface Diagram {
  id: string;
  type: 'git-tree' | 'flow' | 'steps' | 'comparison';
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

export interface Section {
  id: string;
  title: string;
  content: string;
  diagramId?: string;
}

export interface Workflow {
  id: string;
  title: string;
  description: string;
  sections: Section[];
  diagrams: Diagram[];
}
