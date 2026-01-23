'use client';

import { GitBranch, GitPullRequest, Check, X, Clock } from 'lucide-react';

export function ThreePRDiagram() {
  return (
    <div className="my-12 bg-card/50 border border-border rounded-xl p-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-foreground mb-2">GIT WORKFLOW</h3>
        <p className="text-sm text-muted-foreground uppercase tracking-wide">
          Estrategia de 3 Pull Requests Independientes
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left: Branches */}
        <div className="flex flex-col gap-6 lg:w-[280px] flex-shrink-0">
          {/* Main Branch */}
          <div className="border-2 border-success rounded-lg p-4 bg-success/5">
            <div className="flex items-center gap-3 mb-2">
              <GitBranch className="w-5 h-5 text-success" />
              <div>
                <div className="font-bold text-success text-lg">MAIN</div>
                <div className="text-xs text-muted-foreground">PRODUCCIÓN</div>
              </div>
            </div>
          </div>

          {/* Arrow Down */}
          <div className="flex justify-center">
            <div className="text-muted-foreground text-sm">CREAR FEATURE</div>
          </div>

          {/* Feature Branch */}
          <div className="border-2 border-purple rounded-lg p-4 bg-purple/5">
            <div className="flex items-center gap-3 mb-2">
              <GitBranch className="w-5 h-5 text-purple" />
              <div>
                <div className="font-bold text-purple text-lg">FEATURE</div>
                <div className="text-xs text-muted-foreground">DESARROLLO</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: PRs */}
        <div className="flex-1 space-y-4">
          {/* PR #1 Development */}
          <div className="border-l-4 border-primary rounded-lg bg-primary/5 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-xs text-primary font-semibold mb-1">PR #1</div>
                <div className="text-xl font-bold text-foreground">Development</div>
              </div>
              <div className="text-xs text-muted-foreground bg-card px-3 py-1 rounded-full border border-border">
                feature → dev
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-semibold text-foreground mb-2 uppercase text-xs tracking-wide">
                  Propósito
                </div>
                <ul className="space-y-1 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span>→</span>
                    <span>Testing inicial</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>→</span>
                    <span>Validación CI/CD</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>→</span>
                    <span>Code review opcional</span>
                  </li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-foreground mb-2 uppercase text-xs tracking-wide">
                  Requisitos
                </div>
                <ul className="space-y-1 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span>→</span>
                    <span>Tests pasando</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>→</span>
                    <span>Linter OK</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>→</span>
                    <span>Build exitoso</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* PR #2 Staging */}
          <div className="border-l-4 border-purple rounded-lg bg-purple/5 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-xs text-purple font-semibold mb-1">PR #2</div>
                <div className="text-xl font-bold text-foreground">Staging</div>
              </div>
              <div className="text-xs text-muted-foreground bg-card px-3 py-1 rounded-full border border-border">
                feature → stg
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-semibold text-foreground mb-2 uppercase text-xs tracking-wide">
                  Propósito
                </div>
                <ul className="space-y-1 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span>→</span>
                    <span>Testing QA</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>→</span>
                    <span>Validación stakeholders</span>
                  </li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-foreground mb-2 uppercase text-xs tracking-wide">
                  Requisitos
                </div>
                <ul className="space-y-1 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span>→</span>
                    <span>1 aprobación requerida</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>→</span>
                    <span>QA sign-off</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>→</span>
                    <span>PR a dev mergeado</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* PR #3 Production */}
          <div className="border-l-4 border-success rounded-lg bg-success/5 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-xs text-success font-semibold mb-1">PR #3</div>
                <div className="text-xl font-bold text-foreground">Production</div>
              </div>
              <div className="text-xs text-muted-foreground bg-card px-3 py-1 rounded-full border border-border">
                feature → main
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-semibold text-foreground mb-2 uppercase text-xs tracking-wide">
                  Propósito
                </div>
                <ul className="space-y-1 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span>→</span>
                    <span>Release a producción</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>→</span>
                    <span>Deploy a usuarios</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>→</span>
                    <span>Versión estable</span>
                  </li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-foreground mb-2 uppercase text-xs tracking-wide">
                  Requisitos
                </div>
                <ul className="space-y-1 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span>→</span>
                    <span>2+ aprobaciones</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>→</span>
                    <span>Todos los tests OK</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>→</span>
                    <span>PR a stg mergeado</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom explanation */}
      <div className="mt-8 border border-primary/40 rounded-lg bg-primary/5 p-6">
        <h4 className="text-sm font-bold text-primary mb-3 uppercase tracking-wide">
          ¿Por qué 3 PRs independientes?
        </h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Este workflow permite que cada feature avance a su propio ritmo. Si una funcionalidad no pasa QA o validación de stakeholders, 
          se queda en dev o stg <strong>sin retrasar otras features</strong> que ya están listas para producción. 
          Cada PR se mergea cuando cumple sus requisitos específicos, evitando bloqueos entre equipos.
        </p>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 justify-center text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-muted-foreground">DEVELOPMENT</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple" />
          <span className="text-muted-foreground">STAGING</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-success" />
          <span className="text-muted-foreground">PRODUCTION</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple" />
          <span className="text-muted-foreground">FEATURE</span>
        </div>
      </div>
    </div>
  );
}
