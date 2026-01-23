/**
 * Mapeo consistente de nombres de branches a colores del tema
 */

export const BRANCH_COLORS = {
  main: 'hsl(var(--branch-main))',
  feature: 'hsl(var(--branch-feature))',
  dev: 'hsl(var(--branch-dev))',
  stg: 'hsl(var(--branch-stg))',
  integration: 'hsl(var(--branch-integration))',
  work: 'hsl(var(--branch-work))',
} as const;

/**
 * Obtiene el color para un branch basado en su nombre
 * Soporta prefijos como 'feature/', 'work/', etc.
 */
export function getBranchColor(branchName: string): string {
  const normalized = branchName.toLowerCase();

  if (normalized === 'main') return BRANCH_COLORS.main;
  if (normalized === 'integration') return BRANCH_COLORS.integration;
  if (normalized === 'dev') return BRANCH_COLORS.dev;
  if (normalized === 'stg') return BRANCH_COLORS.stg;

  // Soporta prefijos
  if (normalized.startsWith('feature/') || normalized.startsWith('feature-')) {
    return BRANCH_COLORS.feature;
  }
  if (normalized.startsWith('work/') || normalized.startsWith('work-')) {
    return BRANCH_COLORS.work;
  }

  // Default: usar color de feature
  return BRANCH_COLORS.feature;
}

/**
 * Colores en formato hex para diagramas SVG (que no soportan CSS variables)
 */
export const BRANCH_COLORS_HEX = {
  main: '#ff0080',
  feature: '#0dde6a',
  dev: '#0070f3',
  stg: '#fb923c',
  integration: '#0070f3',
  work: '#a855f7',
} as const;

/**
 * Obtiene el color hex para un branch basado en su nombre
 */
export function getBranchColorHex(branchName: string): string {
  const normalized = branchName.toLowerCase();

  if (normalized === 'main') return BRANCH_COLORS_HEX.main;
  if (normalized === 'integration') return BRANCH_COLORS_HEX.integration;
  if (normalized === 'dev') return BRANCH_COLORS_HEX.dev;
  if (normalized === 'stg') return BRANCH_COLORS_HEX.stg;

  if (normalized.startsWith('feature/') || normalized.startsWith('feature-')) {
    return BRANCH_COLORS_HEX.feature;
  }
  if (normalized.startsWith('work/') || normalized.startsWith('work-')) {
    return BRANCH_COLORS_HEX.work;
  }

  return BRANCH_COLORS_HEX.feature;
}
