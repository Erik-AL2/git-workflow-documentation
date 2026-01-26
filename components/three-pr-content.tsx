'use client';

import { useEffect, useRef, useState } from 'react';
import { GitDiagram } from '@/components/git-diagram';
import { ThreePRDiagram } from '@/components/three-pr-diagram';
import { ThreePRFlowDiagram } from '@/components/three-pr-flow-diagram';
import { ProcessTimeline } from '@/components/process-timeline';
import { GitHubActionsSection } from '@/components/github-actions-section';
import { BRANCH_COLORS_HEX } from '@/lib/branch-colors';
import { GitBranch, GitPullRequest, Check, X, CheckSquare, Square, AlertTriangle } from '@/components/icons';
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
        <h2 className="text-3xl font-bold text-foreground mb-6">Overview</h2>

        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
          En equipos grandes, el flujo tradicional (dev → stg → main) genera bloqueos. Este workflow permite
          que <strong className="text-foreground">cada feature avance independientemente</strong> mediante 3 PRs separados.
        </p>

        {/* Problem vs Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="border-l-4 border-error rounded-r-lg bg-error/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <X className="w-4 h-4 text-error" />
              <h4 className="text-sm font-semibold text-error">Problema Tradicional</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Feature B con bugs bloquea el deploy de Feature A que ya está lista.
              Todo o nada.
            </p>
          </div>

          <div className="border-l-4 border-success rounded-r-lg bg-success/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Check className="w-4 h-4 text-success" />
              <h4 className="text-sm font-semibold text-success">Solución: 3 PRs</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Cada feature progresa a su propio ritmo. Feature A puede deployarse mientras
              Feature B se queda en staging.
            </p>
          </div>
        </div>

        {/* Quick benefits */}
        <div className="border rounded-lg p-5 bg-muted/30">
          <h4 className="text-sm font-semibold text-foreground mb-3">Beneficios Clave</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-success flex-shrink-0" />
              <span className="text-muted-foreground">Sin bloqueos entre features</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-success flex-shrink-0" />
              <span className="text-muted-foreground">Deploy selectivo</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-success flex-shrink-0" />
              <span className="text-muted-foreground">Flexibilidad de QA</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-warning flex-shrink-0" />
              <span className="text-muted-foreground">Trade-off: 3 PRs por feature</span>
            </div>
          </div>
        </div>
      </section>

      <section id="flujo-visual" ref={setRef('flujo-visual')} className="scroll-mt-24 mt-16">
        <h2 className="text-3xl font-bold text-foreground mb-6">Cómo Funciona</h2>

        <p className="text-muted-foreground leading-relaxed mb-8">
          Una feature branch se crea desde main y abre <strong>3 PRs independientes simultáneos</strong>
          (uno a cada ambiente). Cada PR se mergea cuando cumple sus requisitos específicos, sin depender
          de los demás.
        </p>

        {/* Diagrama principal */}
        <ThreePRDiagram />

        {/* Diagrama de flujo Git */}
        <div className="mt-12 mb-8">
          <h3 className="text-xl font-semibold text-foreground mb-4">Flujo de Git</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Visualización de cómo los commits fluyen desde la feature branch hacia cada ambiente.
          </p>
          <ThreePRFlowDiagram />
        </div>
      </section>

      <section id="proceso-detallado" ref={setRef('proceso-detallado')} className="scroll-mt-24 mt-16">
        <h2 className="text-3xl font-bold text-foreground mb-6">Paso a Paso</h2>

        <p className="text-muted-foreground leading-relaxed mb-8">
          El workflow completo desde crear la feature hasta deployar a producción.
        </p>

        {/* Timeline de pasos - Solo pasos técnicos, no detalles de PRs */}
        <ProcessTimeline
          steps={[
            {
              number: 1,
              title: 'Crear Feature Branch',
              subtitle: 'Siempre desde main para código estable',
              code: `# Siempre desde main
git checkout main
git pull origin main
git checkout -b feature/ACA-123-login-auth
git push -u origin feature/ACA-123-login-auth`,
              note: {
                type: 'success',
                message: '<strong>✅ Automáticamente se crean 3 PRs:</strong> [DEV] feature → dev • [STG] feature → stg (draft) • [PROD] feature → main (draft)',
              },
            },
            {
              number: 2,
              title: 'Desarrollo y Testing',
              subtitle: 'Trabaja, commitea y sincroniza diariamente',
              code: `# Trabajo diario
git add .
git commit -m "feat(auth): add JWT validation"
git push

# Sincronizar con main (IMPORTANTE: hacer diariamente)
git fetch origin
git rebase origin/main
git push --force-with-lease`,
              note: {
                type: 'warning',
                message: '<strong>⚠️ Sincronización Diaria:</strong> Evita conflictos masivos. Hazlo cada mañana antes de empezar.',
              },
            },
            {
              number: 3,
              title: 'Merge PRs Secuencialmente',
              subtitle: 'Cada PR cuando cumple sus requisitos (ver diagrama arriba)',
              actions: [
                '<strong>PR #1 (dev):</strong> Mergear cuando CI pasa',
                '<strong>PR #2 (stg):</strong> Cambiar a ready, esperar QA approval, mergear',
                '<strong>PR #3 (main):</strong> Solicitar 2+ approvals, mergear → deploy automático',
                '<em>Importante: Siempre usar <strong>MERGE commit</strong>, nunca SQUASH</em>',
              ],
              note: {
                type: 'info',
                message: 'Ver detalles de cada PR y sus requisitos específicos en la sección <strong>"Cómo Funciona"</strong> arriba.',
              },
            },
            {
              number: 4,
              title: 'Cleanup Automático',
              subtitle: 'El branch se elimina después del merge a main',
              code: `# Automático: se elimina al mergear PR #3
# Verificar eliminación local:
git fetch --prune
git branch -d feature/ACA-123-login-auth`,
            },
          ]}
        />
      </section>

      <section id="squash-variant" ref={setRef('squash-variant')} className="scroll-mt-24 mt-16">
        <h2 className="text-3xl font-bold text-foreground mb-6">Variante con Squash y Branches Limpias</h2>

        <p className="text-muted-foreground leading-relaxed mb-8">
          Si quieres mantener un historial limpio y evitar conflictos, puedes preparar una rama intermedia
          que consolide los commits antes de abrir los 3 PRs. El objetivo es que la rama que usa el prefijo
          <code className="text-foreground"> feature/</code> tenga un único commit con todo el trabajo.
        </p>

        <GitDiagram
          commits={[
            { id: 'm0', branch: 'main', x: 100, y: 40, message: 'main' },
            { id: 'w1', branch: 'work/feature-x', x: 250, y: 160, message: 'commit 1' },
            { id: 'w2', branch: 'work/feature-x', x: 350, y: 160, message: 'commit 2' },
            { id: 'w3', branch: 'work/feature-x', x: 450, y: 160, message: '...7 commits' },
            { id: 'f1', branch: 'feature/feature-x', x: 600, y: 100, message: 'squash merge', type: 'squash' },
          ]}
          branches={[
            { name: 'main', color: BRANCH_COLORS_HEX.main, y: 40 },
            { name: 'work/feature-x', color: BRANCH_COLORS_HEX.work, y: 160 },
            { name: 'feature/feature-x', color: BRANCH_COLORS_HEX.feature, y: 100 },
          ]}
          connections={[
            { from: 'm0', to: 'w1' },
            { from: 'w1', to: 'w2' },
            { from: 'w2', to: 'w3' },
            { from: 'm0', to: 'f1' },
            { from: 'w3', to: 'f1', type: 'merge' },
          ]}
          height={240}
        />

        <div className="bg-card border border-border rounded-lg p-6 my-6">
          <h4 className="text-sm font-semibold text-foreground mb-3">Flujo recomendado</h4>
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-primary font-semibold">1.</span>
              <span>Crear la rama de trabajo desde <code className="text-foreground">main</code> y desarrollar ahí (ej. 7 commits).</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-semibold">2.</span>
              <span>Crear una rama limpia desde <code className="text-foreground">main</code> y hacer un PR desde la rama de trabajo.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-semibold">3.</span>
              <span>Hacer squash al mergear ese PR para dejar un solo commit.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary font-semibold">4.</span>
              <span>Usar la rama limpia como <code className="text-foreground">feature/</code> para generar automáticamente los 3 PRs.</span>
            </li>
          </ol>
        </div>

        <div className="grid gap-4">
          <div className="bg-muted/30 border border-border rounded-lg p-5">
            <h4 className="text-sm font-semibold text-foreground mb-3">Naming sugerido</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <code className="text-foreground">work/feature-x</code> → rama de trabajo con múltiples commits
              </li>
              <li>
                <code className="text-foreground">feature/feature-x</code> → rama limpia con un solo commit
              </li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-lg p-5">
            <h4 className="text-sm font-semibold text-foreground mb-3">Comandos ejemplo</h4>
            <pre className="bg-background border border-border rounded-lg p-4 text-sm font-mono overflow-x-auto">
              <code className="text-foreground">{`# 1) Rama de trabajo (varios commits)
git checkout main
git pull origin main
git checkout -b work/feature-x

# ...hacer commits...
git push -u origin work/feature-x

# 2) Rama limpia desde main
git checkout main
git checkout -b feature/feature-x
git push -u origin feature/feature-x

# 3) PR: work/feature-x -> feature/feature-x (merge squash)
# Resultado: feature/feature-x tiene 1 commit

# 4) Push final
git push origin feature/feature-x`}</code>
            </pre>
          </div>
        </div>
      </section>

      <section id="github-actions" ref={setRef('github-actions')} className="scroll-mt-24 mt-16">
        <h2 className="text-3xl font-bold text-foreground mb-6">GitHub Actions</h2>

        <p className="text-muted-foreground leading-relaxed mb-8">
          Tenemos 2 workflows automatizados que facilitan el proceso.
        </p>

        <GitHubActionsSection />
      </section>

      <section id="reglas" ref={setRef('reglas')} className="scroll-mt-24 mt-16">
        <h2 className="text-3xl font-bold text-foreground mb-6">Reglas Importantes</h2>

        <div className="grid gap-3 mb-6">
          {/* Crear desde main */}
          <div className="flex items-start gap-4 p-4 rounded-lg border border-border bg-card">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Check className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-foreground mb-1">Crear features desde main</h4>
              <p className="text-xs text-muted-foreground">
                Cada feature debe basarse en código estable de producción, no en dev/stg que contienen cambios inestables.
              </p>
            </div>
          </div>

          {/* MERGE commit */}
          <div className="flex items-start gap-4 p-4 rounded-lg border border-border bg-card">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Check className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-foreground mb-1">Usar MERGE commit en los 3 PRs</h4>
              <p className="text-xs text-muted-foreground">
                Preserva commit hashes idénticos en dev/stg/main. Squash solo en la variante especial (ver arriba).
              </p>
            </div>
          </div>

          {/* Force with lease */}
          <div className="flex items-start gap-4 p-4 rounded-lg border border-border bg-card">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Check className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-foreground mb-1">Usar --force-with-lease para rebases</h4>
              <code className="text-xs bg-muted px-2 py-1 rounded font-mono text-foreground">
                git push --force-with-lease
              </code>
              <p className="text-xs text-muted-foreground mt-1">Más seguro que --force, detecta cambios remotos.</p>
            </div>
          </div>

          {/* NO mergear entre ambientes */}
          <div className="flex items-start gap-4 p-4 rounded-lg border border-error/30 bg-error/5">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-error/10 flex items-center justify-center">
              <X className="w-4 h-4 text-error" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-foreground mb-1">NO mergear entre ambientes</h4>
              <p className="text-xs text-muted-foreground">
                Evitar <code className="text-error font-mono">git merge dev</code> o{' '}
                <code className="text-error font-mono">git merge stg</code> desde tu feature.
              </p>
            </div>
          </div>

          {/* NO crear desde dev/stg */}
          <div className="flex items-start gap-4 p-4 rounded-lg border border-error/30 bg-error/5">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-error/10 flex items-center justify-center">
              <X className="w-4 h-4 text-error" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-foreground mb-1">NO crear branch desde dev/stg</h4>
              <p className="text-xs text-muted-foreground">
                Tu feature incluiría código de otras features que pueden no llegar a producción.
              </p>
            </div>
          </div>
        </div>

        {/* Key principle */}
        <div className="border border-primary/30 rounded-lg bg-primary/5 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">Principio clave</p>
              <p className="text-sm text-muted-foreground">
                Los mismos commits deben existir en dev, stg y main para mantener sincronización.
                Por eso usamos MERGE (no SQUASH) en el flujo normal.
              </p>
            </div>
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
