export const workflows = [
  {
    id: 'squash-merge',
    title: 'Squash Merge & Release Cycle',
    description: 'Sprint-based workflow with squash merges to main',
    sections: [
      {
        id: 'sprint-1',
        title: 'Sprint 1',
        diagramId: 'sprint-1-diagram',
      },
      {
        id: 'release-day',
        title: 'Release Day',
        diagramId: 'release-diagram',
      },
      {
        id: 'sprint-2',
        title: 'Sprint 2',
        diagramId: 'sprint-2-diagram',
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
        title: 'Flujo Visual',
      },
      {
        id: 'proceso-detallado',
        title: 'Proceso Detallado',
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
