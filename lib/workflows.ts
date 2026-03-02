export const workflow = {
  id: 'squash-merge-release',
  title: 'Squash Merge & Release Cycle',
  description: 'Workflow basado en sprints con squash merges a main. Usa 3 branches: main, stg y dev.',
  sections: [
    { id: 'overview', title: 'Descripción General' },
    { id: 'sprint-1', title: 'Sprint 1' },
    { id: 'conflict-resolution', title: 'Manejo de Conflictos' },
    { id: 'features-no-release', title: 'Features que no llegan a Release' },
    { id: 'release-day', title: 'Día de Release' },
    { id: 'sprint-2', title: 'Sprint 2' },
    { id: 'best-practices', title: 'Mejores Prácticas' },
  ],
};
