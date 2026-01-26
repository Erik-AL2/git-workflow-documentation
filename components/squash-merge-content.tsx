'use client';

import { useEffect, useRef } from 'react';
import { AlertTriangle, Check, CheckCircle, GitMerge, Info, Minus, RotateCcw, ShieldCheck } from 'lucide-react';
import { GitDiagram } from '@/components/git-diagram';
import { BRANCH_COLORS_HEX } from '@/lib/branch-colors';

interface SquashMergeContentProps {
  onSectionChange: (sectionId: string) => void;
}

export function SquashMergeContent({ onSectionChange }: SquashMergeContentProps) {
  const sectionsRef = useRef<{ [key: string]: HTMLElement }>({});

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

  return (
    <div className="prose prose-dark max-w-none">
      <section id="overview" ref={setRef('overview')} className="scroll-mt-24">
        <h2 className="text-3xl font-bold text-foreground mb-4">Descripción General</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Este workflow está diseñado para desarrollo basado en sprints con ciclos de release limpios usando squash merges.
          Mantiene un historial limpio en main mientras preserva el detalle completo en integration.
        </p>

        {/* Branch Structure */}
        <div className="space-y-4 mb-6">
          <h3 className="text-xl font-semibold text-foreground">Estructura de Branches</h3>

          <div className="grid gap-3">
            {/* main */}
            <div className="border border-error/30 rounded-lg bg-error/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <code className="text-sm font-bold text-error">main</code>
                <span className="text-xs text-muted-foreground">— Código en producción</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Refleja exactamente lo que está corriendo en el ambiente de producción. Es la fuente de verdad para el estado actual.
              </p>
            </div>

            {/* integration */}
            <div className="border border-primary/30 rounded-lg bg-primary/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <code className="text-sm font-bold text-primary">integration</code>
                <span className="text-xs text-muted-foreground">— Rama de integración del sprint</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Contiene todos los features del próximo release. Siempre deployable.{' '}
                <strong className="text-foreground">No es un ambiente, es una rama de código.</strong>
              </p>
            </div>

            {/* stg */}
            <div className="border border-orange-500/30 rounded-lg bg-orange-500/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <code className="text-sm font-bold text-orange-500">stg</code>
                <span className="text-xs text-muted-foreground">— Ambiente de staging</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Ambiente de pruebas para QA y stakeholders. Una vez validado y aprobado, el feature se mergea a integration.
              </p>
            </div>

            {/* dev */}
            <div className="border border-primary/30 rounded-lg bg-primary/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <code className="text-sm font-bold text-primary">dev</code>
                <span className="text-xs text-muted-foreground">— Ambiente de desarrollo</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Para testing de desarrolladores. Los features se prueban individualmente antes de promoción a staging.
              </p>
            </div>
          </div>

          {/* Key Principle */}
          <div className="border border-border rounded-lg bg-muted/30 p-4 mt-4">
            <div className="flex items-start gap-3">
              <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Principio Clave</h4>
                <p className="text-sm text-muted-foreground">
                  <code className="text-primary font-semibold">integration</code> debe estar siempre sincronizado con{' '}
                  <code className="text-error font-semibold">main</code> o adelante de main. Nunca debe contener código que no pueda ir a producción.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="sprint-1" ref={setRef('sprint-1')} className="scroll-mt-24 mt-16">
        <h2 className="text-3xl font-bold text-foreground mb-4">Sprint 1</h2>

        <h3 className="text-xl font-semibold text-foreground mb-3 mt-8">Desarrollo de Features</h3>
        <p className="text-muted-foreground leading-relaxed mb-5">
          Durante el Sprint 1, los desarrolladores crean ramas de features desde la rama de integración y trabajan independientemente.
          Cada feature pasa por el proceso estándar de PR antes de ser mergeada a integración.
        </p>

        <GitDiagram
          commits={[
            { id: 'i1', branch: 'integration', x: 100, y: 50, message: 'Inicio' },
            { id: 'fa1', branch: 'feature/A', x: 200, y: 100, message: 'feat A.1' },
            { id: 'fa2', branch: 'feature/A', x: 300, y: 100, message: 'feat A.2' },
            { id: 'fa3', branch: 'feature/A', x: 400, y: 100, message: 'feat A.3' },
            { id: 'fb1', branch: 'feature/B', x: 250, y: 150, message: 'feat B.1' },
            { id: 'fb2', branch: 'feature/B', x: 350, y: 150, message: 'feat B.2' },
            { id: 'i2', branch: 'integration', x: 500, y: 50, message: 'Merge A+B', type: 'merge' },
          ]}
          branches={[
            { name: 'integration', color: BRANCH_COLORS_HEX.integration, y: 50 },
            { name: 'feature/A', color: BRANCH_COLORS_HEX.feature, y: 100 },
            { name: 'feature/B', color: BRANCH_COLORS_HEX.feature, y: 150 },
          ]}
          connections={[
            { from: 'i1', to: 'fa1' },
            { from: 'fa1', to: 'fa2' },
            { from: 'fa2', to: 'fa3' },
            { from: 'i1', to: 'fb1' },
            { from: 'fb1', to: 'fb2' },
            { from: 'fa3', to: 'i2', type: 'merge' },
            { from: 'fb2', to: 'i2', type: 'merge' },
          ]}
          height={220}
        />

        <div className="bg-card border border-border rounded-lg p-5 my-5">
          <h4 className="text-sm font-semibold text-foreground mb-3">Estado al Final del Sprint 1</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-success mt-0.5" />
              <span>Integration contiene 10 commits (6 de Feature A + 4 de Feature B)</span>
            </li>
            <li className="flex items-start gap-2">
              <Minus className="w-4 h-4 text-muted-foreground mt-0.5" />
              <span>Main permanece sin cambios</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-success mt-0.5" />
              <span>Todas las features están testeadas y aprobadas</span>
            </li>
          </ul>
        </div>

        {/* Workflow Steps */}
        <div className="mt-10 space-y-5">
          <h3 className="text-xl font-semibold text-foreground">Creación de Feature Branches</h3>
          <p className="text-sm text-muted-foreground">
            Todos los feature branches se crean desde <code className="text-primary font-semibold">integration</code>:
          </p>

          <pre className="bg-card border border-border rounded-lg p-4 text-sm font-mono overflow-x-auto">
            <code className="text-foreground">{`git checkout integration
git pull origin integration
git checkout -b feature/nombre-descriptivo`}</code>
          </pre>

          <h3 className="text-xl font-semibold text-foreground mt-8">Pull Requests Individuales</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Para cada feature branch, se crean <strong className="text-foreground">tres Pull Requests separados e independientes</strong>:
          </p>

          <div className="grid gap-3">
            <div className="flex items-start gap-3 p-3 rounded-lg border bg-primary/5 border-primary/20">
              <span className="text-sm font-bold text-primary">PR 1:</span>
              <code className="text-sm text-muted-foreground">feature/nombre → dev</code>
              <span className="text-xs text-muted-foreground">(testing de desarrolladores)</span>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg border bg-orange-500/5 border-orange-500/20">
              <span className="text-sm font-bold text-orange-500">PR 2:</span>
              <code className="text-sm text-muted-foreground">feature/nombre → stg</code>
              <span className="text-xs text-muted-foreground">(testing de QA y stakeholders)</span>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg border bg-primary/5 border-primary/20">
              <span className="text-sm font-bold text-primary">PR 3:</span>
              <code className="text-sm text-muted-foreground">feature/nombre → integration</code>
              <span className="text-xs text-muted-foreground">(integración final para release)</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            Cada PR se revisa y mergea independientemente. <strong className="text-foreground">Todos los merges son merges normales</strong> (no squash).
          </p>
        </div>
      </section>

      {/* Conflict Resolution */}
      <section id="conflict-resolution" ref={setRef('conflict-resolution')} className="scroll-mt-24 mt-16">
        <h2 className="text-3xl font-bold text-foreground mb-4">Manejo de Conflictos</h2>

        <div className="border border-error/30 rounded-lg bg-error/5 p-4 mb-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-error mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-error mb-2">Regla Crítica</h4>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">NUNCA</strong> hacer merge de <code className="text-primary">dev</code>,{' '}
                <code className="text-orange-500">stg</code> o <code className="text-error">main</code> hacia el feature branch.
                El feature branch debe permanecer limpio y contener únicamente los commits del feature.
              </p>
            </div>
          </div>
        </div>

        <p className="text-muted-foreground leading-relaxed mb-4">
          Si al momento de crear los PRs existen conflictos con los branches de destino:
        </p>

        <div className="space-y-3 pl-4">
          <div className="flex items-start gap-3">
            <span className="text-primary font-bold">1.</span>
            <p className="text-sm text-muted-foreground">Crear un nuevo branch específico para resolver conflictos</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-primary font-bold">2.</span>
            <p className="text-sm text-muted-foreground">Resolver los conflictos en ese nuevo branch</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-primary font-bold">3.</span>
            <p className="text-sm text-muted-foreground">Crear un nuevo PR desde el branch de resolución</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-error font-bold">4.</span>
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">NO</strong> contaminar el feature branch original con merges de otros branches
            </p>
          </div>
        </div>
      </section>

      <section id="release-day" ref={setRef('release-day')} className="scroll-mt-24 mt-16">
        <h2 className="text-3xl font-bold text-foreground mb-4">Día de Release</h2>

        <h3 className="text-xl font-semibold text-foreground mb-3 mt-8">Paso 1: Squash Merge a Main</h3>
        <p className="text-muted-foreground leading-relaxed mb-5">
          La clave de este workflow es el squash merge de integration a main. Todos los commits del sprint
          se combinan en un único commit limpio en la rama main.
        </p>

        <GitDiagram
          commits={[
            { id: 'i-full', branch: 'integration', x: 100, y: 50, message: '10 commits' },
            { id: 'm1', branch: 'main', x: 100, y: 150 },
            { id: 'm2', branch: 'main', x: 300, y: 150, message: 'Sprint 1', type: 'squash' },
          ]}
          branches={[
            { name: 'integration', color: BRANCH_COLORS_HEX.integration, y: 50 },
            { name: 'main', color: BRANCH_COLORS_HEX.main, y: 150 },
          ]}
          connections={[
            { from: 'i-full', to: 'm2', type: 'merge' },
            { from: 'm1', to: 'm2' },
          ]}
          height={220}
        />

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-5 my-5">
          <h4 className="text-sm font-semibold text-primary mb-3">¿Por qué Squash?</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
              <span>Historial limpio y lineal en main</span>
            </li>
            <li className="flex items-start gap-2">
              <RotateCcw className="w-4 h-4 text-primary mt-0.5" />
              <span>Fácil revertir sprints completos si es necesario</span>
            </li>
            <li className="flex items-start gap-2">
              <GitMerge className="w-4 h-4 text-primary mt-0.5" />
              <span>Hitos de release claros</span>
            </li>
            <li className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-primary mt-0.5" />
              <span>Auditoría simplificada</span>
            </li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold text-foreground mb-3 mt-8">Paso 2: Merge Main de Vuelta a Integration</h3>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Este paso es <strong className="text-error">CRÍTICO</strong> para evitar conflictos en futuros sprints.
          Después de hacer squash a main, debes mergear main de vuelta a integration.
        </p>

        <pre className="bg-card border border-border rounded-lg p-4 text-sm font-mono overflow-x-auto my-6">
          <code className="text-foreground">{`git checkout integration
git merge main
git push origin integration`}</code>
        </pre>

        <div className="bg-success/5 border border-success/20 rounded-lg p-5 my-5">
          <h4 className="text-sm font-semibold text-success mb-3">Resultado</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-success mt-0.5" />
              <span>Main: 1 commit squasheado</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-success mt-0.5" />
              <span>Integration: 10 commits originales + 1 commit merge de main</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-success mt-0.5" />
              <span>
                <strong className="text-success">El contenido es idéntico en ambas ramas</strong>
              </span>
            </li>
          </ul>
        </div>
      </section>

      <section id="sprint-2" ref={setRef('sprint-2')} className="scroll-mt-24 mt-16">
        <h2 className="text-3xl font-bold text-foreground mb-4">Sprint 2</h2>

        <h3 className="text-xl font-semibold text-foreground mb-3 mt-8">Comenzando de Nuevo</h3>
        <p className="text-muted-foreground leading-relaxed mb-5">
          Con integration ahora sincronizada con main, el Sprint 2 comienza sin conflictos.
          Las nuevas features pueden desarrollarse limpiamente desde la rama de integration.
        </p>

        <GitDiagram
          commits={[
            { id: 'i-sync', branch: 'integration', x: 100, y: 50, message: 'Sincronizado' },
            { id: 'fc1', branch: 'feature/C', x: 250, y: 100, message: 'feat C' },
            { id: 'fd1', branch: 'feature/D', x: 300, y: 150, message: 'feat D' },
            { id: 'i-s2', branch: 'integration', x: 400, y: 50, message: 'Merge C+D', type: 'merge' },
            { id: 'm-s1', branch: 'main', x: 100, y: 200, message: 'Sprint 1' },
          ]}
          branches={[
            { name: 'integration', color: BRANCH_COLORS_HEX.integration, y: 50 },
            { name: 'feature/C', color: BRANCH_COLORS_HEX.feature, y: 100 },
            { name: 'feature/D', color: BRANCH_COLORS_HEX.feature, y: 150 },
            { name: 'main', color: BRANCH_COLORS_HEX.main, y: 200 },
          ]}
          connections={[
            { from: 'i-sync', to: 'fc1' },
            { from: 'i-sync', to: 'fd1' },
            { from: 'fc1', to: 'i-s2', type: 'merge' },
            { from: 'fd1', to: 'i-s2', type: 'merge' },
          ]}
          height={260}
        />

        <div className="bg-success/5 border border-success/20 rounded-lg p-5 my-5">
          <h4 className="text-sm font-semibold text-success mb-2">Sin Conflictos</h4>
          <p className="text-sm text-muted-foreground">
            Porque mergeamos main de vuelta a integration, todas las nuevas ramas de features comienzan desde un estado limpio
            sin conflictos de merge o commits duplicados.
          </p>
        </div>
      </section>

      <section id="benefits" ref={setRef('benefits')} className="scroll-mt-24 mt-16">
        <h2 className="text-3xl font-bold text-foreground mb-4">Beneficios</h2>

        <div className="grid gap-4 my-5">
          {[
            {
              title: 'Historial Limpio',
              desc: 'La rama main tiene un commit por sprint',
              color: '#0dde6a',
              icon: CheckCircle,
            },
            {
              title: 'Reversiones Fáciles',
              desc: 'Revertir sprints completos con un solo revert',
              color: '#0070f3',
              icon: RotateCcw,
            },
            {
              title: 'Sin Conflictos',
              desc: 'La sincronización adecuada previene problemas de merge',
              color: '#a855f7',
              icon: ShieldCheck,
            },
            {
              title: 'Releases Claros',
              desc: 'Fácil rastrear qué salió cuándo',
              color: '#ff0080',
              icon: GitMerge,
            },
          ].map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-lg border"
                style={{
                  borderColor: `${benefit.color}40`,
                  backgroundColor: `${benefit.color}08`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: `${benefit.color}20`,
                    color: benefit.color,
                  }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">{benefit.title}</h4>
                  <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="best-practices" ref={setRef('best-practices')} className="scroll-mt-24 mt-16">
        <h2 className="text-3xl font-bold text-foreground mb-4">Mejores Prácticas</h2>

        <ul className="space-y-3 text-muted-foreground">
          <li className="flex items-start gap-3">
            <span className="text-primary mt-1">•</span>
            <span>Siempre mergear main de vuelta a integration después del release</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary mt-1">•</span>
            <span>Mantener duraciones de sprint consistentes</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary mt-1">•</span>
            <span>Testear exhaustivamente en integration antes de liberar</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary mt-1">•</span>
            <span>Documentar notas de release con cada commit squash</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary mt-1">•</span>
            <span>Etiquetar releases en main para fácil referencia</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
