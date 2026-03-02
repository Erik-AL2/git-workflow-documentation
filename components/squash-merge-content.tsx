'use client';

import { useEffect, useRef } from 'react';
import { AlertTriangle, Check, CheckCircle, Flag, GitMerge, Info, Minus, RotateCcw, ShieldCheck } from 'lucide-react';
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
      {/* ===================== OVERVIEW ===================== */}
      <section id="overview" ref={setRef('overview')} className="scroll-mt-24">
        <h2 className="text-3xl font-bold text-foreground mb-4">Descripción General</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Este workflow está diseñado para desarrollo basado en sprints con ciclos de release limpios usando squash merges.
          Mantiene un historial limpio y lineal en main mientras acumula el trabajo del sprint en stg.
        </p>

        {/* Branch Structure */}
        <div className="space-y-4 mb-6">
          <h3 className="text-xl font-semibold text-foreground">Estructura de Branches</h3>

          <div className="grid gap-3">
            {/* main */}
            <div className="border border-error/30 rounded-lg bg-error/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <code className="text-sm font-bold text-error">main</code>
                <span className="text-xs text-muted-foreground">— Código en producción. Fuente de verdad.</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Refleja exactamente lo que está corriendo en el ambiente de producción.
              </p>
            </div>

            {/* stg */}
            <div className="border border-orange-500/30 rounded-lg bg-orange-500/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <code className="text-sm font-bold text-orange-500">stg</code>
                <span className="text-xs text-muted-foreground">— Ambiente de staging/integración</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Acumula los features del sprint. QA y stakeholders validan acá.
                Cumple el rol de rama de integración.
              </p>
            </div>

            {/* dev */}
            <div className="border border-primary/30 rounded-lg bg-primary/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <code className="text-sm font-bold text-primary">dev</code>
                <span className="text-xs text-muted-foreground">— Ambiente de desarrollo</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Para testing individual de desarrolladores.
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
                  <code className="text-orange-500 font-semibold">stg</code> cumple el rol de integración.
                  Después de cada release, <code className="text-error font-semibold">main</code> se mergea a{' '}
                  <code className="text-orange-500 font-semibold">stg</code> y{' '}
                  <code className="text-primary font-semibold">dev</code> para mantener todo sincronizado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== SPRINT 1 ===================== */}
      <section id="sprint-1" ref={setRef('sprint-1')} className="scroll-mt-24 mt-16">
        <h2 className="text-3xl font-bold text-foreground mb-4">Sprint 1</h2>

        <h3 className="text-xl font-semibold text-foreground mb-3 mt-8">Desarrollo de Features</h3>
        <p className="text-muted-foreground leading-relaxed mb-5">
          Los feature branches se crean desde <code className="text-error font-semibold">main</code>.
          Cada feature tiene 2 PRs que se mergean de forma normal (no squash).
        </p>

        <pre className="bg-card border border-border rounded-lg p-4 text-sm font-mono overflow-x-auto mb-6">
          <code className="text-foreground">{`git checkout main
git pull origin main
git checkout -b feature/nombre-descriptivo`}</code>
        </pre>

        <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">2 PRs por Feature</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Para cada feature branch, se crean <strong className="text-foreground">dos Pull Requests</strong> (merge normal, no squash):
        </p>

        {/* PR Table */}
        <div className="border border-border rounded-lg overflow-hidden mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left p-3 font-semibold text-foreground">PR</th>
                <th className="text-left p-3 font-semibold text-foreground">Dirección</th>
                <th className="text-left p-3 font-semibold text-foreground">Propósito</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="p-3 font-bold text-primary">PR 1</td>
                <td className="p-3 text-muted-foreground">
                  <code className="text-success">feature/nombre</code> → <code className="text-primary">dev</code>
                </td>
                <td className="p-3 text-muted-foreground">Testing de desarrolladores</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-orange-500">PR 2</td>
                <td className="p-3 text-muted-foreground">
                  <code className="text-success">feature/nombre</code> → <code className="text-orange-500">stg</code>
                </td>
                <td className="p-3 text-muted-foreground">Testing QA/stakeholders + integración</td>
              </tr>
            </tbody>
          </table>
        </div>

        <GitDiagram
          commits={[
            { id: 'm1', branch: 'main', x: 80, y: 50, message: 'Inicio' },
            { id: 'fa1', branch: 'feature/A', x: 180, y: 120, message: 'feat A.1' },
            { id: 'fa2', branch: 'feature/A', x: 280, y: 120, message: 'feat A.2' },
            { id: 'fa3', branch: 'feature/A', x: 380, y: 120, message: 'feat A.3' },
            { id: 'fb1', branch: 'feature/B', x: 230, y: 190, message: 'feat B.1' },
            { id: 'fb2', branch: 'feature/B', x: 330, y: 190, message: 'feat B.2' },
            { id: 'd1', branch: 'dev', x: 80, y: 260 },
            { id: 'd2', branch: 'dev', x: 480, y: 260, message: 'A+B merged', type: 'merge' },
            { id: 's1', branch: 'stg', x: 80, y: 330 },
            { id: 's2', branch: 'stg', x: 480, y: 330, message: 'A+B merged', type: 'merge' },
          ]}
          branches={[
            { name: 'main', color: BRANCH_COLORS_HEX.main, y: 50 },
            { name: 'feature/A', color: BRANCH_COLORS_HEX.feature, y: 120 },
            { name: 'feature/B', color: BRANCH_COLORS_HEX.feature, y: 190 },
            { name: 'dev', color: BRANCH_COLORS_HEX.dev, y: 260 },
            { name: 'stg', color: BRANCH_COLORS_HEX.stg, y: 330 },
          ]}
          connections={[
            { from: 'm1', to: 'fa1' },
            { from: 'fa1', to: 'fa2' },
            { from: 'fa2', to: 'fa3' },
            { from: 'm1', to: 'fb1' },
            { from: 'fb1', to: 'fb2' },
            { from: 'fa3', to: 'd2', type: 'merge' },
            { from: 'fb2', to: 'd2', type: 'merge' },
            { from: 'fa3', to: 's2', type: 'merge' },
            { from: 'fb2', to: 's2', type: 'merge' },
          ]}
          height={400}
        />

        <div className="bg-card border border-border rounded-lg p-5 my-5">
          <h4 className="text-sm font-semibold text-foreground mb-3">Estado al Final del Sprint 1</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-orange-500 mt-0.5" />
              <span><code className="text-orange-500">stg</code> tiene todos los commits de los features del sprint</span>
            </li>
            <li className="flex items-start gap-2">
              <Minus className="w-4 h-4 text-muted-foreground mt-0.5" />
              <span><code className="text-error">main</code> sin cambios</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-success mt-0.5" />
              <span>Todas las features testeadas y aprobadas en stg</span>
            </li>
          </ul>
        </div>
      </section>

      {/* ===================== CONFLICT RESOLUTION ===================== */}
      <section id="conflict-resolution" ref={setRef('conflict-resolution')} className="scroll-mt-24 mt-16">
        <h2 className="text-3xl font-bold text-foreground mb-4">Manejo de Conflictos</h2>

        <div className="border border-error/30 rounded-lg bg-error/5 p-4 mb-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-error mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-error mb-2">Regla Crítica</h4>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">NUNCA</strong> hacer merge de{' '}
                <code className="text-primary">dev</code>,{' '}
                <code className="text-orange-500">stg</code> o{' '}
                <code className="text-error">main</code> hacia el feature branch.
              </p>
            </div>
          </div>
        </div>

        <p className="text-muted-foreground leading-relaxed mb-4">
          Si hay conflictos al crear los PRs:
        </p>

        <div className="space-y-3 pl-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-primary font-bold">1.</span>
            <p className="text-sm text-muted-foreground">Crear un nuevo branch específico para resolver conflictos</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-primary font-bold">2.</span>
            <p className="text-sm text-muted-foreground">Resolver los conflictos en ese branch</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-primary font-bold">3.</span>
            <p className="text-sm text-muted-foreground">Crear un nuevo PR desde el branch de resolución</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-error font-bold">4.</span>
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">NO</strong> contaminar el feature branch original
            </p>
          </div>
        </div>

        <GitDiagram
          commits={[
            { id: 'f1', branch: 'feature/A', x: 100, y: 50, message: 'feat A' },
            { id: 'f2', branch: 'feature/A', x: 220, y: 50, message: 'feat A.2' },
            { id: 'r1', branch: 'resolve/A-stg', x: 340, y: 120, message: 'resolve' },
            { id: 'r2', branch: 'resolve/A-stg', x: 460, y: 120, message: 'fix conflict' },
            { id: 's1', branch: 'stg', x: 100, y: 190 },
            { id: 's2', branch: 'stg', x: 560, y: 190, message: 'merged', type: 'merge' },
          ]}
          branches={[
            { name: 'feature/A', color: BRANCH_COLORS_HEX.feature, y: 50 },
            { name: 'resolve/A-stg', color: BRANCH_COLORS_HEX.work, y: 120 },
            { name: 'stg', color: BRANCH_COLORS_HEX.stg, y: 190 },
          ]}
          connections={[
            { from: 'f1', to: 'f2' },
            { from: 'f2', to: 'r1' },
            { from: 'r1', to: 'r2' },
            { from: 'r2', to: 's2', type: 'merge' },
          ]}
          height={260}
        />
      </section>

      {/* ===================== FEATURES QUE NO LLEGAN A RELEASE ===================== */}
      <section id="features-no-release" ref={setRef('features-no-release')} className="scroll-mt-24 mt-16">
        <h2 className="text-3xl font-bold text-foreground mb-4">Features que no llegan a Release</h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          Si un feature que ya está en <code className="text-orange-500 font-semibold">stg</code> no va a llegar
          a <code className="text-error font-semibold">main</code> en el release actual, hay dos estrategias:
        </p>

        <div className="grid gap-4 mb-6">
          {/* Option A: Rollback */}
          <div className="border border-primary/30 rounded-lg bg-primary/5 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <RotateCcw className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Opción A: Rollback en stg</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Revertir los commits del feature en stg antes del squash merge a main.
            </p>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-success mt-0.5" />
                <span>Útil cuando el feature tiene problemas de calidad o se decidió postergarlo</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-success mt-0.5" />
                <span>El feature branch original se preserva para retomarlo en un sprint futuro</span>
              </li>
            </ul>
          </div>

          {/* Option B: Feature Flag */}
          <div className="border border-purple-500/30 rounded-lg bg-purple-500/5 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Flag className="w-4 h-4 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Opción B: Feature Flag</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              El feature se despliega a producción pero deshabilitado mediante un feature flag.
            </p>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-success mt-0.5" />
                <span>Útil cuando el código ya está integrado con otros features y un rollback sería complejo</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-success mt-0.5" />
                <span>Permite activarlo gradualmente cuando esté listo sin necesidad de un nuevo deploy</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Decision Criteria */}
        <div className="border border-border rounded-lg bg-muted/30 p-4">
          <div className="flex items-start gap-3">
            <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Criterio de Decisión</h4>
              <p className="text-sm text-muted-foreground">
                Si el feature es aislado y fácil de revertir → <strong className="text-primary">rollback</strong>.
                Si está entrelazado con otros cambios o casi listo → <strong className="text-purple-500">feature flag</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== RELEASE DAY ===================== */}
      <section id="release-day" ref={setRef('release-day')} className="scroll-mt-24 mt-16">
        <h2 className="text-3xl font-bold text-foreground mb-4">Día de Release</h2>

        <h3 className="text-xl font-semibold text-foreground mb-3 mt-8">Paso 1: Squash Merge de stg a main</h3>
        <p className="text-muted-foreground leading-relaxed mb-5">
          Todos los commits del sprint se combinan en un único commit limpio en main.
        </p>

        <GitDiagram
          commits={[
            { id: 's-full', branch: 'stg', x: 100, y: 50, message: '10 commits' },
            { id: 'm1', branch: 'main', x: 100, y: 150 },
            { id: 'm2', branch: 'main', x: 300, y: 150, message: 'Sprint 1', type: 'squash' },
          ]}
          branches={[
            { name: 'stg', color: BRANCH_COLORS_HEX.stg, y: 50 },
            { name: 'main', color: BRANCH_COLORS_HEX.main, y: 150 },
          ]}
          connections={[
            { from: 's-full', to: 'm2', type: 'merge' },
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

        <h3 className="text-xl font-semibold text-foreground mb-3 mt-8">Paso 2: Merge main de vuelta a stg y dev</h3>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Este paso es <strong className="text-error">CRÍTICO</strong>.
          Después del squash merge, main se debe mergear de vuelta a <strong className="text-foreground">ambos</strong>{' '}
          <code className="text-orange-500 font-semibold">stg</code> y{' '}
          <code className="text-primary font-semibold">dev</code>.
        </p>

        <pre className="bg-card border border-border rounded-lg p-4 text-sm font-mono overflow-x-auto my-6">
          <code className="text-foreground">{`git checkout stg
git merge main
git push origin stg

git checkout dev
git merge main
git push origin dev`}</code>
        </pre>

        <GitDiagram
          commits={[
            { id: 'm-rel', branch: 'main', x: 150, y: 50, message: 'Sprint 1', type: 'squash' },
            { id: 's-sync', branch: 'stg', x: 350, y: 130, message: 'sync', type: 'merge' },
            { id: 'd-sync', branch: 'dev', x: 350, y: 210, message: 'sync', type: 'merge' },
          ]}
          branches={[
            { name: 'main', color: BRANCH_COLORS_HEX.main, y: 50 },
            { name: 'stg', color: BRANCH_COLORS_HEX.stg, y: 130 },
            { name: 'dev', color: BRANCH_COLORS_HEX.dev, y: 210 },
          ]}
          connections={[
            { from: 'm-rel', to: 's-sync', type: 'merge' },
            { from: 'm-rel', to: 'd-sync', type: 'merge' },
          ]}
          height={280}
        />

        <div className="bg-success/5 border border-success/20 rounded-lg p-5 my-5">
          <h4 className="text-sm font-semibold text-success mb-3">Resultado</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-success mt-0.5" />
              <span><code className="text-error">main</code>: 1 commit squasheado</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-success mt-0.5" />
              <span><code className="text-orange-500">stg</code> y <code className="text-primary">dev</code>: sincronizados con main</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-success mt-0.5" />
              <span>
                <strong className="text-success">Todo listo para el próximo sprint sin conflictos</strong>
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* ===================== SPRINT 2 ===================== */}
      <section id="sprint-2" ref={setRef('sprint-2')} className="scroll-mt-24 mt-16">
        <h2 className="text-3xl font-bold text-foreground mb-4">Sprint 2</h2>

        <h3 className="text-xl font-semibold text-foreground mb-3 mt-8">Comenzando de Nuevo</h3>
        <p className="text-muted-foreground leading-relaxed mb-5">
          Con <code className="text-orange-500 font-semibold">stg</code> y{' '}
          <code className="text-primary font-semibold">dev</code> sincronizados con{' '}
          <code className="text-error font-semibold">main</code>, el Sprint 2 comienza limpio.
          Features nuevos salen de main, PRs van a dev y stg.
        </p>

        <GitDiagram
          commits={[
            { id: 'm-sync', branch: 'main', x: 100, y: 50, message: 'Sincronizado' },
            { id: 'fc1', branch: 'feature/C', x: 250, y: 120, message: 'feat C' },
            { id: 'fd1', branch: 'feature/D', x: 300, y: 190, message: 'feat D' },
            { id: 's-s2', branch: 'stg', x: 100, y: 260, message: 'Sincronizado' },
            { id: 'd-s2', branch: 'dev', x: 100, y: 330, message: 'Sincronizado' },
          ]}
          branches={[
            { name: 'main', color: BRANCH_COLORS_HEX.main, y: 50 },
            { name: 'feature/C', color: BRANCH_COLORS_HEX.feature, y: 120 },
            { name: 'feature/D', color: BRANCH_COLORS_HEX.feature, y: 190 },
            { name: 'stg', color: BRANCH_COLORS_HEX.stg, y: 260 },
            { name: 'dev', color: BRANCH_COLORS_HEX.dev, y: 330 },
          ]}
          connections={[
            { from: 'm-sync', to: 'fc1' },
            { from: 'm-sync', to: 'fd1' },
          ]}
          height={400}
        />

        <div className="bg-success/5 border border-success/20 rounded-lg p-5 my-5">
          <h4 className="text-sm font-semibold text-success mb-2">Sin Conflictos</h4>
          <p className="text-sm text-muted-foreground">
            Porque mergeamos main de vuelta a stg y dev, todas las nuevas ramas de features comienzan desde un estado limpio
            sin conflictos de merge o commits duplicados.
          </p>
        </div>
      </section>

      {/* ===================== BEST PRACTICES ===================== */}
      <section id="best-practices" ref={setRef('best-practices')} className="scroll-mt-24 mt-16">
        <h2 className="text-3xl font-bold text-foreground mb-4">Mejores Prácticas</h2>

        <ul className="space-y-3 text-muted-foreground">
          <li className="flex items-start gap-3">
            <span className="text-primary mt-1">•</span>
            <span>Siempre mergear main de vuelta a stg y dev después del release</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary mt-1">•</span>
            <span>Mantener duraciones de sprint consistentes</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary mt-1">•</span>
            <span>Testear exhaustivamente en stg antes de liberar</span>
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
