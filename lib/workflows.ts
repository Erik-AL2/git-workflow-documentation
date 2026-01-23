export const workflows = [
  {
    id: 'squash-merge',
    title: 'Squash Merge & Release Cycle',
    description: 'Workflow basado en sprints con squash merges a main',
    sections: [
      {
        id: 'overview',
        title: 'Descripción General',
      },
      {
        id: 'sprint-1',
        title: 'Sprint 1',
        diagramId: 'sprint-1-diagram',
      },
      {
        id: 'release-day',
        title: 'Día de Release',
        diagramId: 'release-diagram',
      },
      {
        id: 'sprint-2',
        title: 'Sprint 2',
        diagramId: 'sprint-2-diagram',
      },
      {
        id: 'benefits',
        title: 'Beneficios',
      },
      {
        id: 'best-practices',
        title: 'Mejores Prácticas',
      },
    ],
  },
  {
    id: '3-pr-workflow',
    title: '3 PR Workflow',
    description: 'Independent feature progression through dev, stg, and main',
    sections: [
      {
        id: 'overview',
        title: 'Overview',
      },
      {
        id: 'flujo-visual',
        title: 'Cómo Funciona',
      },
      {
        id: 'proceso-detallado',
        title: 'Paso a Paso',
      },
      {
        id: 'squash-variant',
        title: 'Variante con Squash',
      },
      {
        id: 'github-actions',
        title: 'GitHub Actions',
      },
      {
        id: 'reglas',
        title: 'Reglas Importantes',
      },
      {
        id: 'troubleshooting',
        title: 'Troubleshooting',
      },
      {
        id: 'faq',
        title: 'FAQ',
      },
      {
        id: 'checklist',
        title: 'Checklist',
      },
    ],
  },
];
