'use client';

import { ArrowRight, Check, GitBranch } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ThreePRDiagram() {
  const prs = [
    {
      number: 1,
      title: 'Development',
      badge: 'dev',
      color: 'primary',
      from: 'feature',
      to: 'dev',
      requirements: ['Tests pasando', 'Linter OK', 'Build exitoso'],
      purpose: 'Testing inicial y validación CI/CD',
    },
    {
      number: 2,
      title: 'Staging',
      badge: 'stg',
      color: 'orange',
      from: 'feature',
      to: 'stg',
      requirements: ['1 aprobación', 'QA sign-off', 'PR #1 mergeado'],
      purpose: 'Testing QA y validación stakeholders',
    },
    {
      number: 3,
      title: 'Production',
      badge: 'main',
      color: 'success',
      from: 'feature',
      to: 'main',
      requirements: ['2+ aprobaciones', 'Tests OK', 'PR #2 mergeado'],
      purpose: 'Release a producción',
    },
  ];

  const colorClasses = {
    primary: {
      border: 'border-primary',
      bg: 'bg-primary/5',
      text: 'text-primary',
      badge: 'bg-primary/10 text-primary border-primary/20',
    },
    orange: {
      border: 'border-orange-500',
      bg: 'bg-orange-500/5',
      text: 'text-orange-500',
      badge: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    },
    purple: {
      border: 'border-purple',
      bg: 'bg-purple/5',
      text: 'text-purple',
      badge: 'bg-purple/10 text-purple border-purple/20',
    },
    success: {
      border: 'border-success',
      bg: 'bg-success/5',
      text: 'text-success',
      badge: 'bg-success/10 text-success border-success/20',
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border text-xs font-medium text-muted-foreground mb-3">
          <GitBranch className="w-3.5 h-3.5" />
          Estrategia de 3 Pull Requests Independientes
        </div>
      </div>

      {/* Flow visualization */}
      <div className="flex flex-col items-center gap-6 mb-8">
        {/* Top row - main creates feature */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-lg border-2 border-muted bg-muted/30">
            <div className="text-xs font-semibold text-muted-foreground">main</div>
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground" />
          <div className="px-4 py-2 rounded-lg border-2 border-purple bg-purple/10">
            <div className="text-xs font-semibold text-purple">feature</div>
          </div>
        </div>

        {/* Visual branching indicator */}
        <div className="flex flex-col items-center -my-3">
          <div className="w-px h-8 bg-purple/50" />
          <div className="flex items-center gap-2">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-purple/50 to-transparent" />
            <GitBranch className="w-4 h-4 text-purple rotate-90" />
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-purple/50 to-transparent" />
          </div>
        </div>

        {/* Bottom row - 3 PRs */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-4 py-3 rounded-lg border-2 border-primary/30 bg-primary/5">
            <div className="flex flex-col items-center gap-1">
              <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">PR #1</div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-purple">feature</span>
                <ArrowRight className="w-3 h-3 text-primary" />
                <span className="text-xs font-semibold text-primary">dev</span>
              </div>
            </div>
          </div>

          <span className="text-muted-foreground text-sm font-bold">+</span>

          <div className="flex items-center gap-2 px-4 py-3 rounded-lg border-2 border-orange-500/30 bg-orange-500/5">
            <div className="flex flex-col items-center gap-1">
              <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">PR #2</div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-purple">feature</span>
                <ArrowRight className="w-3 h-3 text-orange-500" />
                <span className="text-xs font-semibold text-orange-500">stg</span>
              </div>
            </div>
          </div>

          <span className="text-muted-foreground text-sm font-bold">+</span>

          <div className="flex items-center gap-2 px-4 py-3 rounded-lg border-2 border-success/30 bg-success/5">
            <div className="flex flex-col items-center gap-1">
              <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">PR #3</div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-purple">feature</span>
                <ArrowRight className="w-3 h-3 text-success" />
                <span className="text-xs font-semibold text-success">main</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PR Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {prs.map((pr) => {
          const colors = colorClasses[pr.color as keyof typeof colorClasses];

          return (
            <div
              key={pr.number}
              className={cn(
                'border rounded-lg overflow-hidden transition-all duration-200',
                'hover:shadow-lg hover:scale-[1.02]',
                colors.border
              )}
            >
              {/* Header */}
              <div className={cn('px-4 py-3 border-b', colors.bg, colors.border)}>
                <div className="flex items-center justify-between mb-2">
                  <span className={cn('text-xs font-bold', colors.text)}>
                    PR #{pr.number}
                  </span>
                  <div className={cn('px-2 py-0.5 rounded text-[10px] font-mono border', colors.badge)}>
                    {pr.from} → {pr.to}
                  </div>
                </div>
                <h3 className="font-bold text-foreground">{pr.title}</h3>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                {/* Purpose */}
                <div>
                  <div className="text-xs font-semibold text-foreground mb-2">Propósito</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{pr.purpose}</p>
                </div>

                {/* Requirements */}
                <div>
                  <div className="text-xs font-semibold text-foreground mb-2">Requisitos</div>
                  <ul className="space-y-1.5">
                    {pr.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Check className={cn('w-3 h-3 flex-shrink-0 mt-0.5', colors.text)} />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom note */}
      <div className="border border-primary/30 rounded-lg bg-primary/5 p-4">
        <div className="flex items-start gap-3">
          <div className="w-1 h-full bg-primary rounded-full flex-shrink-0 mt-1" />
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-1">
              ¿Por qué 3 PRs independientes?
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Cada feature avanza a su propio ritmo. Si una no pasa QA, se queda en dev/stg{' '}
              <strong className="text-foreground">sin retrasar otras features</strong> listas para producción.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
