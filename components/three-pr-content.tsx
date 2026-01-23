'use client';

import { useEffect, useRef, useState } from 'react';
import { GitDiagram } from '@/components/git-diagram';
import { ThreePRDiagram } from '@/components/three-pr-diagram';
import { GitBranch, GitPullRequest, Check, X, CheckSquare, Square, AlertTriangle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface ThreePRContentProps {
  onSectionChange: (sectionId: string) => void;
}

export function ThreePRContent({ onSectionChange }: ThreePRContentProps) {
  const sectionsRef = useRef<{ [key: string]: HTMLElement }>({});
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onSectionChange(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -66% 0px' }
    );

    Object.values(sectionsRef.current).forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [onSectionChange]);

  const setRef = (id: string) => (el: HTMLElement | null) => {
    if (el) sectionsRef.current[id] = el;
  };

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="prose prose-dark max-w-none">
      <section id="overview" ref={setRef('overview')} className="scroll-mt-24">
        <h2 className="text-3xl font-bold text-foreground mb-4">Overview</h2>
        
        <h3 className="text-xl font-semibold text-foreground mb-4 mt-8">¿Por Qué Este Workflow?</h3>
        <p className="text-muted-foreground leading-relaxed">
          En equipos grandes trabajando en el mismo repositorio, el flujo tradicional (dev → stg → main) 
          puede generar bloqueos. Este workflow permite que cada feature avance independientemente mediante 
          3 PRs separados, eliminando los bloqueos entre features.
        </p>

        <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-error/40 rounded-lg p-6 bg-error/5">
            <h4 className="text-sm font-semibold text-error mb-3 flex items-center gap-2">
              <X className="w-4 h-4" />
              Problema Tradicional
            </h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Dev contiene:</p>
              <ul className="list-none space-y-1 ml-2">
                <li className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-success" />
                  Feature A (lista, testeada)
                </li>
                <li className="flex items-center gap-2">
                  <X className="w-3 h-3 text-error" />
                  Feature B (con bugs críticos)
                </li>
              </ul>
              <p className="pt-2 text-error">Resultado: Feature B bloquea el deploy de Feature A</p>
            </div>
          </div>

          <div className="border border-success/40 rounded-lg p-6 bg-success/5">
            <h4 className="text-sm font-semibold text-success mb-3 flex items-center gap-2">
              <Check className="w-4 h-4" />
              Solución
            </h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="font-medium">Cada feature avanza con 3 PRs independientes:</p>
              <ul className="list-none space-y-1 ml-2 text-xs">
                <li>Feature A: 3 PRs (dev ✓, stg ✓, main ✓)</li>
                <li>Feature B: 3 PRs (dev ✓, stg ⏳, main ⏳)</li>
                <li>Feature C: 3 PRs (dev ✓, stg ✓, main ⏳)</li>
              </ul>
              <p className="text-xs pt-2">Cada PR se mergea cuando cumple sus requisitos específicos</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <div>
            <h4 className="text-sm font-semibold text-success mb-3">Ventajas</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-success mt-0.5" />
                <span>Sin bloqueos entre features - Cada una avanza a su ritmo</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-success mt-0.5" />
                <span>Deploy selectivo - Solo lo que está listo llega a producción</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-success mt-0.5" />
                <span>Flexibilidad para equipos - QA puede aprobar features independientemente</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-success mt-0.5" />
                <span>Mejor control - Claridad sobre qué está en cada ambiente</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-3">Trade-offs</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-error mt-0.5" />
                <span>Más PRs por feature - 3 en vez de 1</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-error mt-0.5" />
                <span>Sincronización manual - Requiere disciplina</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-error mt-0.5" />
                <span>Más complejo - Curva de aprendizaje</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="flujo-visual" ref={setRef('flujo-visual')} className="scroll-mt-24 mt-16">
        <h2 className="text-3xl font-bold text-foreground mb-6">Flujo Visual</h2>
        
        <p className="text-muted-foreground leading-relaxed mb-6">
          Una feature branch se crea desde main y abre <strong>3 PRs independientes simultáneos</strong> 
          (uno a cada ambiente). Cada PR se mergea cuando cumple sus requisitos específicos, sin depender 
          de los demás.
        </p>

        <ThreePRDiagram />

        <div className="mt-8 bg-card border border-border rounded-lg p-6">
          <h4 className="text-sm font-semibold text-foreground mb-4">Descripción del Flujo</h4>
          <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
            <li><strong>Crear Feature</strong> - Desde main (siempre)</li>
            <li><strong>3 PRs Automáticos</strong> - Se crean al hacer push</li>
            <li><strong>Merge Secuencial</strong> - Cada PR cuando cumple requisitos</li>
          </ol>
        </div>
      </section>

      <section id="proceso-detallado" ref={setRef('proceso-detallado')} className="scroll-mt-24 mt-16">
        <h2 className="text-3xl font-bold text-foreground mb-6">Proceso Detallado</h2>

        {/* Paso 1 */}
        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-foreground mb-4">Paso 1: Crear Feature Branch</h3>
          
          <p className="text-muted-foreground leading-relaxed mb-4">
            Siempre crea tu feature desde <code className="text-primary bg-primary/10 px-2 py-1 rounded">main</code>.
            Esto garantiza que tu feature esté basada en código estable de producción.
          </p>

          <pre className="bg-card border border-border rounded-lg p-4 text-sm font-mono overflow-x-auto my-6">
            <code className="text-foreground">{`# Siempre desde main
git checkout main
git pull origin main
git checkout -b feature/backend-auth-login-API-123
git push -u origin feature/backend-auth-login-API-123`}</code>
          </pre>

          <div className="bg-success/5 border border-success/20 rounded-lg p-6 my-6">
            <h4 className="text-sm font-semibold text-success mb-3">✅ Automáticamente se crean 3 PRs:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <GitPullRequest className="w-4 h-4 text-primary" />
                <code className="text-primary bg-primary/10 px-2 py-0.5 rounded">[DEV]</code> 
                <span>feature → dev</span>
              </li>
              <li className="flex items-center gap-2">
                <GitPullRequest className="w-4 h-4 text-purple" />
                <code className="text-purple bg-purple/10 px-2 py-0.5 rounded">[STG]</code> 
                <span>feature → stg (draft)</span>
              </li>
              <li className="flex items-center gap-2">
                <GitPullRequest className="w-4 h-4 text-error" />
                <code className="text-error bg-error/10 px-2 py-0.5 rounded">[PROD]</code> 
                <span>feature → main (draft)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Paso 2 */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold text-foreground mb-4">Paso 2: Desarrollo</h3>
          
          <p className="text-muted-foreground leading-relaxed mb-4">
            Durante el desarrollo, trabaja normalmente en tu feature branch. Sincroniza con main diariamente 
            para evitar conflictos masivos.
          </p>

          <pre className="bg-card border border-border rounded-lg p-4 text-sm font-mono overflow-x-auto my-6">
            <code className="text-foreground">{`# Trabajo diario
git add .
git commit -m "feat(auth): add JWT validation"
git push origin feature/backend-auth-login-API-123

# Sincronizar con main (diariamente)
git fetch origin
git rebase origin/main
git push --force-with-lease origin feature/backend-auth-login-API-123`}</code>
          </pre>

          <div className="bg-error/5 border border-error/20 rounded-lg p-4 my-6">
            <p className="text-sm text-foreground flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-error mt-0.5 flex-shrink-0" />
              <span><strong>Importante:</strong> Sincroniza con main diariamente para evitar conflictos masivos.</span>
            </p>
          </div>
        </div>

        {/* Paso 3 */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold text-foreground mb-4">Paso 3: PR #1 - Development</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div className="border border-border rounded-lg p-4">
              <h4 className="text-sm font-semibold text-foreground mb-3">Cuándo</h4>
              <p className="text-sm text-muted-foreground">Cuando la feature funciona localmente</p>
            </div>
            
            <div className="border border-border rounded-lg p-4">
              <h4 className="text-sm font-semibold text-foreground mb-3">Requisitos</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-success" />
                  CI/CD pasa (lint + typecheck + build)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-success" />
                  Tests automáticos OK
                </li>
                <li className="flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3 text-muted-foreground" />
                  Code review opcional
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4 my-6">
            <h4 className="text-sm font-semibold text-foreground mb-2">Acción</h4>
            <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
              <li>El PR se actualiza automáticamente con cada push</li>
              <li>Verificar que CI pase</li>
              <li>Mergear (sin esperar approval)</li>
              <li><strong>Método:</strong> MERGE commit</li>
            </ul>
          </div>
        </div>

        {/* Paso 4 */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold text-foreground mb-4">Paso 4: PR #2 - Staging</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div className="border border-border rounded-lg p-4">
              <h4 className="text-sm font-semibold text-foreground mb-3">Cuándo</h4>
              <p className="text-sm text-muted-foreground">Después de mergear a dev</p>
            </div>
            
            <div className="border border-border rounded-lg p-4">
              <h4 className="text-sm font-semibold text-foreground mb-3">Requisitos</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-success" />
                  PR a dev mergeado
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-success" />
                  Testing en dev OK
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-success" />
                  1 approval requerida
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-success" />
                  QA sign-off
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4 my-6">
            <h4 className="text-sm font-semibold text-foreground mb-2">Acción</h4>
            <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
              <li>Cambiar PR de draft a ready for review</li>
              <li>QA testea en ambiente stg</li>
              <li>Si falla: fix en feature branch, push (PR se actualiza)</li>
              <li>Si pasa: QA aprueba y mergeas</li>
              <li><strong>Método:</strong> MERGE commit</li>
            </ul>
          </div>
        </div>

        {/* Paso 5 */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold text-foreground mb-4">Paso 5: PR #3 - Production</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            <div className="border border-border rounded-lg p-4">
              <h4 className="text-sm font-semibold text-foreground mb-3">Cuándo</h4>
              <p className="text-sm text-muted-foreground">Después de mergear a stg</p>
            </div>
            
            <div className="border border-border rounded-lg p-4">
              <h4 className="text-sm font-semibold text-foreground mb-3">Requisitos</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-success" />
                  PR a stg mergeado
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-success" />
                  QA aprobado en stg
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-success" />
                  2+ approvals (tech leads)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-success" />
                  Todos los tests pasando
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4 my-6">
            <h4 className="text-sm font-semibold text-foreground mb-2">Acción</h4>
            <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
              <li>Cambiar PR de draft a ready for review</li>
              <li>Solicitar approvals de tech leads</li>
              <li>Verificar que todo está OK</li>
              <li>Mergear → deploy automático a producción</li>
              <li><strong>Método:</strong> MERGE commit</li>
            </ul>
          </div>

          <div className="bg-success/5 border border-success/20 rounded-lg p-4 my-6">
            <p className="text-sm text-success flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span><strong>Mergear → deploy automático a producción</strong></span>
            </p>
          </div>
        </div>

        {/* Paso 6 */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold text-foreground mb-4">Paso 6: Cleanup</h3>
          
          <p className="text-muted-foreground leading-relaxed mb-4">
            El branch se elimina automáticamente después del merge a main.
          </p>

          <pre className="bg-card border border-border rounded-lg p-4 text-sm font-mono overflow-x-auto my-6">
            <code className="text-foreground">{`# Automático: el branch se elimina después del merge a main
# Verificar que fue eliminado:
git fetch --prune
git branch -a | grep feature/backend-auth-login`}</code>
          </pre>
        </div>
      </section>

      <section id="github-actions" ref={setRef('github-actions')} className="scroll-mt-24 mt-16">
        <h2 className="text-3xl font-bold text-foreground mb-6">GitHub Actions</h2>
        
        <p className="text-muted-foreground leading-relaxed mb-6">
          Tenemos 2 workflows automatizados que facilitan el proceso.
        </p>

        <div className="space-y-8">
          {/* Workflow 1 */}
          <div className="border border-primary/40 rounded-lg p-6 bg-primary/5">
            <h3 className="text-xl font-semibold text-foreground mb-4">1. Auto-crear PRs</h3>
            
            <p className="text-sm text-muted-foreground mb-4">
              Cuando haces push de un branch que sigue nuestra convención, automáticamente se ejecuta:
            </p>

            <div className="bg-card border border-border rounded-lg p-4 mb-4">
              <p className="text-xs font-mono text-muted-foreground">
                <strong>Workflow:</strong> .github/workflows/auto-create-prs.yml
              </p>
            </div>

            <h4 className="text-sm font-semibold text-foreground mb-3">Qué hace:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside mb-4">
              <li>Detecta branches con prefijos: feature/, fix/, hotfix/, refactor/, docs/</li>
              <li>Crea/verifica labels automáticos</li>
              <li>Crea 3 PRs automáticamente</li>
            </ul>

            <div className="bg-muted/50 border border-border rounded-lg p-4">
              <h4 className="text-sm font-semibold text-foreground mb-3">Convención de Nomenclatura:</h4>
              <pre className="bg-card border border-border rounded p-3 text-xs font-mono overflow-x-auto">
                <code className="text-foreground">{`# Formato recomendado:
<tipo>/<JIRA-TICKET>-descripcion-corta

# Ejemplos correctos:
feature/ACA-123-login-authentication
fix/ACA-456-header-responsive
hotfix/ACA-789-payment-critical-bug
refactor/ACA-234-auth-service
docs/ACA-567-api-documentation

# ❌ Ejemplos incorrectos (sin ticket):
feature/login
fix/bug-header`}</code>
              </pre>

              <div className="mt-4">
                <p className="text-xs text-muted-foreground mb-2"><strong>¿Por qué incluir el ticket de JIRA?</strong></p>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-success" />
                    Trazabilidad automática entre código y tareas
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-success" />
                    Fácil identificar qué PRs pertenecen a qué historia
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-success" />
                    Reporting y métricas más precisas
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-success" />
                    Code review más contextual
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Workflow 2 */}
          <div className="border border-primary/40 rounded-lg p-6 bg-primary/5">
            <h3 className="text-xl font-semibold text-foreground mb-4">2. CI/CD - Validación Automática</h3>
            
            <p className="text-sm text-muted-foreground mb-4">
              Cuando abres o actualizas un PR a dev, stg o main, automáticamente se ejecuta:
            </p>

            <div className="bg-card border border-border rounded-lg p-4 mb-4">
              <p className="text-xs font-mono text-muted-foreground">
                <strong>Workflow:</strong> .github/workflows/ci.yml
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Si algo falla:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <X className="w-4 h-4 text-error" />
                    PR queda bloqueado
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-error" />
                    No se puede mergear hasta corregir
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-4 h-4 flex items-center justify-center text-error">🔴</span>
                    Status check muestra error en rojo
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Si todo pasa:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-success" />
                    PR puede mergearse
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-4 h-4 flex items-center justify-center text-success">🟢</span>
                    Status check muestra success en verde
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="reglas" ref={setRef('reglas')} className="scroll-mt-24 mt-16">
        <h2 className="text-3xl font-bold text-foreground mb-6">Reglas Importantes</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
          <div className="border border-success/40 rounded-lg p-6 bg-success/5">
            <h4 className="text-lg font-semibold text-success mb-4 flex items-center gap-2">
              <Check className="w-5 h-5" />
              QUÉ HACER
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Crear features desde main</p>
                  <pre className="mt-1 text-xs bg-card border border-border rounded px-2 py-1 font-mono">
                    git checkout main  # ✅
                  </pre>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Sincronizar con main diariamente</p>
                  <pre className="mt-1 text-xs bg-card border border-border rounded px-2 py-1 font-mono">
{`git fetch origin
git rebase origin/main`}
                  </pre>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Usar MERGE en todos los PRs</p>
                  <p className="text-xs mt-1">Preserva historial completo</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Resolver conflictos en tu branch</p>
                  <pre className="mt-1 text-xs bg-card border border-border rounded px-2 py-1 font-mono">
{`git status
git add .
git rebase --continue`}
                  </pre>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Mantener PRs actualizados</p>
                  <p className="text-xs mt-1">Push frecuente - CI corre en cada push</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="border border-error/40 rounded-lg p-6 bg-error/5">
            <h4 className="text-lg font-semibold text-error mb-4 flex items-center gap-2">
              <X className="w-5 h-5" />
              QUÉ NO HACER
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <X className="w-4 h-4 text-error mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">NO crear features desde dev o stg</p>
                  <pre className="mt-1 text-xs bg-card border border-border rounded px-2 py-1 font-mono">
                    git checkout dev   # ❌ NUNCA
                  </pre>
                  <p className="text-xs mt-1">Feature estará basada en código que puede no llegar a main</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-4 h-4 text-error mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">NO usar SQUASH en los PRs</p>
                  <p className="text-xs mt-1">Crea commits diferentes en cada branch, rompe la sincronización</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-4 h-4 text-error mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">NO mergear manualmente entre dev/stg/main</p>
                  <pre className="mt-1 text-xs bg-card border border-border rounded px-2 py-1 font-mono">
{`git checkout dev
git merge stg  # ❌ NUNCA`}
                  </pre>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-4 h-4 text-error mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">NO hacer force push sin --force-with-lease</p>
                  <pre className="mt-1 text-xs bg-card border border-border rounded px-2 py-1 font-mono">
{`git push -f  # ❌ PELIGROSO
git push --force-with-lease  # ✅ SEGURO`}
                  </pre>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-4 h-4 text-error mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">NO commitear directamente a main/stg/dev</p>
                  <p className="text-xs mt-1">Estas branches están protegidas, siempre vía PR</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="troubleshooting" ref={setRef('troubleshooting')} className="scroll-mt-24 mt-16">
        <h2 className="text-3xl font-bold text-foreground mb-6">Troubleshooting</h2>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="prs-not-created">
            <AccordionTrigger className="text-left">
              <span className="font-semibold">PRs no se crearon automáticamente</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Síntomas:</p>
                  <p className="text-sm text-muted-foreground">
                    Hice push de feature/* pero no veo los 3 PRs
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Soluciones:</p>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">1. Verificar permisos:</p>
                      <pre className="bg-card border border-border rounded p-3 text-xs font-mono overflow-x-auto">
                        <code className="text-foreground">{`Settings → Actions → General → Workflow permissions
☑ Allow GitHub Actions to create and approve pull requests`}</code>
                      </pre>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-1">2. Ver logs:</p>
                      <pre className="bg-card border border-border rounded p-3 text-xs font-mono overflow-x-auto">
                        <code className="text-foreground">Actions → Auto-crear PRs → Ver último run</code>
                      </pre>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-1">3. Crear manualmente:</p>
                      <pre className="bg-card border border-border rounded p-3 text-xs font-mono overflow-x-auto">
                        <code className="text-foreground">{`gh pr create --base dev --head feature/nombre --title "[DEV] nombre"
gh pr create --base stg --head feature/nombre --title "[STG] nombre" --draft
gh pr create --base main --head feature/nombre --title "[PROD] nombre" --draft`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="ci-fails">
            <AccordionTrigger className="text-left">
              <span className="font-semibold">CI falla en "Generate Prisma Client"</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Síntomas:</p>
                  <pre className="bg-card border border-border rounded p-3 text-xs font-mono overflow-x-auto">
                    <code className="text-error">Error: Missing required environment variable: DATABASE_URL</code>
                  </pre>
                </div>

                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Solución:</p>
                  <p className="text-sm text-muted-foreground mb-2">Verificar que el workflow tiene:</p>
                  <pre className="bg-card border border-border rounded p-3 text-xs font-mono overflow-x-auto">
                    <code className="text-foreground">{`- name: Generate Prisma Client
  run: pnpm db:generate
  env:
    DATABASE_URL: "postgresql://fake:fake@localhost:5432/fake"`}</code>
                  </pre>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="branches-diverged">
            <AccordionTrigger className="text-left">
              <span className="font-semibold">Branches divergieron</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Síntomas:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• main tiene: Feature A</li>
                    <li>• stg tiene: Feature A + Feature B</li>
                    <li>• dev tiene: Feature A + Feature B + Feature C</li>
                  </ul>
                </div>

                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Solución:</p>
                  <p className="text-sm text-muted-foreground mb-2">Sincronización manual (semanal):</p>
                  <pre className="bg-card border border-border rounded p-3 text-xs font-mono overflow-x-auto">
                    <code className="text-foreground">{`# main → stg
git checkout stg
git pull origin stg
git merge origin/main
git push origin stg

# main → dev
git checkout dev
git pull origin dev
git merge origin/main
git push origin dev`}</code>
                  </pre>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="feature-cancelled">
            <AccordionTrigger className="text-left">
              <span className="font-semibold">Feature se cancela</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Síntomas:</p>
                  <p className="text-sm text-muted-foreground">
                    Feature ya no se va a desarrollar, PRs quedan abiertos
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Solución:</p>
                  <pre className="bg-card border border-border rounded p-3 text-xs font-mono overflow-x-auto">
                    <code className="text-foreground">{`# 1. Cerrar los 3 PRs en GitHub (sin mergear)
# 2. Eliminar branch
git push origin --delete feature/nombre

# 3. Si ya hizo merge a dev:
# Crear PR para revertir
git checkout dev
git revert <commit-hash>
git push origin dev`}</code>
                  </pre>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section id="faq" ref={setRef('faq')} className="scroll-mt-24 mt-16">
        <h2 className="text-3xl font-bold text-foreground mb-6">FAQ</h2>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="why-from-main">
            <AccordionTrigger className="text-left">
              <span className="font-semibold">¿Por qué crear desde main y no desde dev?</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-2 text-sm text-muted-foreground">
                <p>Porque cada feature debe ser independiente. Si creas desde dev:</p>
                <ul className="space-y-1 list-disc list-inside ml-2">
                  <li>Tu feature incluye código de otras features que pueden no llegar a main</li>
                  <li>Si esas features se cancelan, la tuya tiene código "basura"</li>
                  <li>Conflictos más complejos</li>
                </ul>
                <p className="font-medium text-foreground">
                  Crear desde main garantiza que solo tienes código estable de producción.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="never-reaches-main">
            <AccordionTrigger className="text-left">
              <span className="font-semibold">¿Qué pasa si una feature nunca llega a main?</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-2 text-sm text-muted-foreground">
                <p>Se queda en dev o stg indefinidamente. Opciones:</p>
                <ul className="space-y-1 list-disc list-inside ml-2">
                  <li><strong>A)</strong> Dejarla ahí (si puede servir después)</li>
                  <li><strong>B)</strong> Revertirla (si bloquea algo)</li>
                  <li><strong>C)</strong> Archivar el branch (para referencia)</li>
                </ul>
                <pre className="bg-card border border-border rounded p-3 text-xs font-mono overflow-x-auto mt-2">
                  <code className="text-foreground">{`# Revertir en dev
git checkout dev
git revert <commit-hash>
git push origin dev`}</code>
                </pre>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="hotfix">
            <AccordionTrigger className="text-left">
              <span className="font-semibold">¿Cómo hago un hotfix urgente?</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-2 text-sm text-muted-foreground">
                <p>Hotfix sigue el mismo flujo pero acelerado:</p>
                <pre className="bg-card border border-border rounded p-3 text-xs font-mono overflow-x-auto">
                  <code className="text-foreground">{`# 1. Crear desde main
git checkout main
git checkout -b hotfix/critical-bug-999

# 2. Fix
git commit -m "fix: critical production bug"
git push -u origin hotfix/critical-bug-999

# 3. PRs se crean automáticamente

# 4. Fast-track approvals
# - Mergear a dev inmediatamente
# - Mergear a stg con 1 approval rápida
# - Mergear a main con 2 approvals urgentes

# Total: ~1-2 horas en vez de días`}</code>
                </pre>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="multiple-features">
            <AccordionTrigger className="text-left">
              <span className="font-semibold">¿Puedo tener múltiples features en progreso?</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-2 text-sm text-muted-foreground">
                <p>Sí, sin problema. Cada feature es independiente:</p>
                <pre className="bg-card border border-border rounded p-3 text-xs font-mono overflow-x-auto">
                  <code className="text-foreground">{`git checkout main

# Feature 1
git checkout -b feature/login
# ... trabajo ...
git push -u origin feature/login

# Feature 2
git checkout main
git checkout -b feature/dashboard
# ... trabajo ...
git push -u origin feature/dashboard`}</code>
                </pre>
                <p>Cada una tendrá sus propios 3 PRs.</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="main-changes">
            <AccordionTrigger className="text-left">
              <span className="font-semibold">¿Qué hago si main cambia mientras desarrollo?</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-2 text-sm text-muted-foreground">
                <p>Sync con rebase (diariamente):</p>
                <pre className="bg-card border border-border rounded p-3 text-xs font-mono overflow-x-auto">
                  <code className="text-foreground">{`git fetch origin
git rebase origin/main
# Resolver conflictos si hay
git push --force-with-lease origin feature/nombre`}</code>
                </pre>
                <p>Esto mantiene tu feature actualizada con los últimos cambios de producción.</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="merge-vs-squash">
            <AccordionTrigger className="text-left">
              <span className="font-semibold">¿Por qué MERGE y no SQUASH?</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2 text-sm text-muted-foreground">
                <div>
                  <p className="font-medium text-foreground mb-2">MERGE:</p>
                  <ul className="space-y-1 list-disc list-inside ml-2">
                    <li>Preserva historial completo</li>
                    <li>Git sabe que es el mismo código en dev/stg/main</li>
                    <li>Fácil sincronizar después</li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium text-foreground mb-2">SQUASH:</p>
                  <ul className="space-y-1 list-disc list-inside ml-2">
                    <li>Crea commits diferentes en cada branch</li>
                    <li>Git piensa que son cambios distintos</li>
                    <li>Rompe la sincronización</li>
                  </ul>
                </div>

                <div>
                  <p className="font-medium text-foreground mb-2">Ejemplo:</p>
                  <pre className="bg-card border border-border rounded p-3 text-xs font-mono overflow-x-auto">
                    <code className="text-foreground">{`# Con MERGE ✅
feature → dev (commits A, B, C)
feature → stg (commits A, B, C) ← mismo historial
feature → main (commits A, B, C) ← mismo historial

# Con SQUASH ❌
feature → dev (commit X = A+B+C combinados)
feature → stg (commit Y = A+B+C combinados)
feature → main (commit Z = A+B+C combinados)
# X, Y, Z son commits DIFERENTES
# Git no sabe que son lo mismo`}</code>
                  </pre>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section id="checklist" ref={setRef('checklist')} className="scroll-mt-24 mt-16 mb-24">
        <h2 className="text-3xl font-bold text-foreground mb-6">Checklist para Nuevos Devs</h2>
        
        <div className="space-y-8">
          {/* Primera Vez */}
          <div className="border border-primary/40 rounded-lg p-6 bg-primary/5">
            <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-primary" />
              Primera Vez
            </h3>
            
            <p className="text-sm text-muted-foreground mb-4">Verificar configuración:</p>
            
            <div className="space-y-2">
              {['pnpm-version', 'node-version', 'install-deps', 'run-lint', 'run-typecheck', 'run-build'].map((item) => (
                <button
                  key={item}
                  onClick={() => toggleCheck(item)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                >
                  {checkedItems[item] ? (
                    <CheckSquare className="w-5 h-5 text-success flex-shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  )}
                  <span className="text-sm text-foreground font-mono">
                    {item === 'pnpm-version' && 'pnpm -v (verificar versión)'}
                    {item === 'node-version' && 'node -v (verificar versión)'}
                    {item === 'install-deps' && 'pnpm install (instalar dependencies)'}
                    {item === 'run-lint' && 'pnpm run lint (verificar que funciona)'}
                    {item === 'run-typecheck' && 'pnpm run typecheck (verificar que funciona)'}
                    {item === 'run-build' && 'pnpm run build (verificar que funciona)'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Por Cada Feature */}
          <div className="border border-success/40 rounded-lg p-6 bg-success/5">
            <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-success" />
              Por Cada Feature
            </h3>
            
            <div className="space-y-6">
              {/* Inicio */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Inicio:</h4>
                <div className="space-y-2">
                  {['checkout-main', 'create-branch', 'push-branch', 'verify-prs'].map((item) => (
                    <button
                      key={item}
                      onClick={() => toggleCheck(item)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                    >
                      {checkedItems[item] ? (
                        <CheckSquare className="w-5 h-5 text-success flex-shrink-0" />
                      ) : (
                        <Square className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className="text-sm text-foreground">
                        {item === 'checkout-main' && 'git checkout main && git pull origin main'}
                        {item === 'create-branch' && 'git checkout -b feature/[equipo]-[nombre]-[TICKET]'}
                        {item === 'push-branch' && 'git push -u origin feature/[nombre]'}
                        {item === 'verify-prs' && 'Verificar que se crearon 3 PRs en GitHub'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Durante desarrollo */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Durante desarrollo:</h4>
                <div className="space-y-2">
                  {['frequent-commits', 'daily-push', 'sync-main', 'verify-ci'].map((item) => (
                    <button
                      key={item}
                      onClick={() => toggleCheck(item)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                    >
                      {checkedItems[item] ? (
                        <CheckSquare className="w-5 h-5 text-success flex-shrink-0" />
                      ) : (
                        <Square className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className="text-sm text-foreground">
                        {item === 'frequent-commits' && 'Commits frecuentes (feat/fix/docs/refactor)'}
                        {item === 'daily-push' && 'Push diario'}
                        {item === 'sync-main' && 'Sync con main cada mañana'}
                        {item === 'verify-ci' && 'Verificar que CI pase'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* PR a dev */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">PR a dev:</h4>
                <div className="space-y-2">
                  {['dev-ci-pass', 'dev-tests-ok', 'dev-merge'].map((item) => (
                    <button
                      key={item}
                      onClick={() => toggleCheck(item)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                    >
                      {checkedItems[item] ? (
                        <CheckSquare className="w-5 h-5 text-success flex-shrink-0" />
                      ) : (
                        <Square className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className="text-sm text-foreground">
                        {item === 'dev-ci-pass' && 'CI pasa (lint + typecheck + build)'}
                        {item === 'dev-tests-ok' && 'Tests OK'}
                        {item === 'dev-merge' && 'Mergear sin esperar approval'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* PR a stg */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">PR a stg:</h4>
                <div className="space-y-2">
                  {['stg-ready', 'stg-qa-test', 'stg-approval', 'stg-merge'].map((item) => (
                    <button
                      key={item}
                      onClick={() => toggleCheck(item)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                    >
                      {checkedItems[item] ? (
                        <CheckSquare className="w-5 h-5 text-success flex-shrink-0" />
                      ) : (
                        <Square className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className="text-sm text-foreground">
                        {item === 'stg-ready' && 'Cambiar de draft a ready'}
                        {item === 'stg-qa-test' && 'Solicitar QA testing'}
                        {item === 'stg-approval' && 'Esperar 1 approval + QA sign-off'}
                        {item === 'stg-merge' && 'Mergear'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* PR a main */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">PR a main:</h4>
                <div className="space-y-2">
                  {['main-ready', 'main-approvals', 'main-tests', 'main-merge', 'main-verify-deploy'].map((item) => (
                    <button
                      key={item}
                      onClick={() => toggleCheck(item)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                    >
                      {checkedItems[item] ? (
                        <CheckSquare className="w-5 h-5 text-success flex-shrink-0" />
                      ) : (
                        <Square className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className="text-sm text-foreground">
                        {item === 'main-ready' && 'Cambiar de draft a ready'}
                        {item === 'main-approvals' && 'Solicitar 2+ approvals tech leads'}
                        {item === 'main-tests' && 'Todos los tests pasando'}
                        {item === 'main-merge' && 'Mergear'}
                        {item === 'main-verify-deploy' && 'Verificar deploy a producción'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cleanup */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Cleanup:</h4>
                <div className="space-y-2">
                  {['verify-deleted', 'git-prune'].map((item) => (
                    <button
                      key={item}
                      onClick={() => toggleCheck(item)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                    >
                      {checkedItems[item] ? (
                        <CheckSquare className="w-5 h-5 text-success flex-shrink-0" />
                      ) : (
                        <Square className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className="text-sm text-foreground">
                        {item === 'verify-deleted' && 'Verificar que branch fue eliminado'}
                        {item === 'git-prune' && 'git fetch --prune'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
