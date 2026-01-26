'use client';

import { Check, FileCode2, Workflow } from '@/components/icons';

export function GitHubActionsSection() {
  return (
    <div className="space-y-6">
      {/* Workflow 1: Auto-crear PRs */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-primary/5 border-b px-6 py-4">
          <div className="flex items-start gap-3">
            <Workflow className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-foreground">Auto-crear PRs</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Crea automáticamente 3 PRs cuando haces push de un branch nuevo
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Archivo */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <FileCode2 className="w-3.5 h-3.5" />
            <code className="bg-muted px-2 py-0.5 rounded">.github/workflows/auto-create-prs.yml</code>
          </div>

          {/* Qué hace */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">¿Qué hace?</h4>
            <ul className="space-y-2">
              {[
                'Detecta branches con prefijos válidos',
                'Crea/verifica labels automáticos',
                'Crea 3 PRs: dev, stg, main (los 2 últimos como draft)',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Nomenclatura */}
          <div className="border rounded-lg overflow-hidden bg-muted/30">
            <div className="bg-muted/50 px-4 py-3 border-b">
              <h4 className="text-sm font-semibold text-foreground">Convención de Nomenclatura</h4>
            </div>

            <div className="p-4 space-y-4">
              {/* Formato */}
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-2">Formato:</div>
                <code className="block bg-card border rounded px-3 py-2 text-sm">
                  <span className="text-primary font-semibold">&lt;tipo&gt;</span>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-purple font-semibold">&lt;JIRA-123&gt;</span>
                  <span className="text-muted-foreground">-</span>
                  <span className="text-foreground">descripcion-corta</span>
                </code>
              </div>

              {/* Ejemplos válidos */}
              <div>
                <div className="text-xs font-medium text-foreground mb-2 flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-success" />
                  Ejemplos válidos
                </div>
                <div className="space-y-1.5">
                  {[
                    { type: 'feature', ticket: 'ACA-123', desc: 'login-authentication' },
                    { type: 'fix', ticket: 'ACA-456', desc: 'header-responsive' },
                    { type: 'hotfix', ticket: 'ACA-789', desc: 'payment-critical-bug' },
                    { type: 'refactor', ticket: 'ACA-234', desc: 'auth-service' },
                  ].map((ex, i) => (
                    <code key={i} className="block bg-card border rounded px-3 py-1.5 text-xs font-mono">
                      <span className="text-primary">{ex.type}</span>
                      <span className="text-muted-foreground">/</span>
                      <span className="text-purple">{ex.ticket}</span>
                      <span className="text-muted-foreground">-</span>
                      <span className="text-foreground">{ex.desc}</span>
                    </code>
                  ))}
                </div>
              </div>

              {/* Beneficios */}
              <div className="pt-2">
                <div className="text-xs font-medium text-foreground mb-2">¿Por qué incluir el ticket?</div>
                <ul className="space-y-1.5">
                  {[
                    'Trazabilidad código ↔ tareas',
                    'Identificar qué PRs pertenecen a qué historia',
                    'Reporting y métricas precisas',
                    'Code review con contexto',
                  ].map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Check className="w-3 h-3 text-success mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Workflow 2: CI/CD */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-primary/5 border-b px-6 py-4">
          <div className="flex items-start gap-3">
            <Workflow className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-foreground">CI/CD - Validación Automática</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Valida código en cada PR update (lint, types, tests, build)
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Archivo */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <FileCode2 className="w-3.5 h-3.5" />
            <code className="bg-muted px-2 py-0.5 rounded">.github/workflows/ci.yml</code>
          </div>

          {/* Estados */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Si falla */}
            <div className="border border-error/20 rounded-lg p-4 bg-error/5">
              <div className="text-sm font-semibold text-error mb-3">Si algo falla</div>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-error flex-shrink-0" />
                  PR bloqueado
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-error flex-shrink-0" />
                  No se puede mergear
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-error flex-shrink-0" />
                  Status check rojo
                </li>
              </ul>
            </div>

            {/* Si pasa */}
            <div className="border border-success/20 rounded-lg p-4 bg-success/5">
              <div className="text-sm font-semibold text-success mb-3">Si todo pasa</div>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-success flex-shrink-0" />
                  PR listo para merge
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-success flex-shrink-0" />
                  Status check verde
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
