'use client';

import { useEffect, useRef, useCallback } from 'react';
import { AlertTriangle, Check, CheckCircle, Flag, GitMerge, Info, Minus, RotateCcw, ShieldCheck } from 'lucide-react';
import { GitDiagram } from '@/components/git-diagram';
import { ExportableDiagram } from '@/components/exportable-diagram';
import { TerminalBlock } from '@/components/terminal-block';
import { BRANCH_COLORS_HEX } from '@/lib/branch-colors';

interface SquashMergeContentProps {
  onSectionChange: (sectionId: string) => void;
}

export function SquashMergeContent({ onSectionChange }: SquashMergeContentProps) {
  const sectionsRef = useRef<{ [key: string]: HTMLElement }>({});
  const fadeRef = useRef<HTMLElement[]>([]);

  // Section tracking observer
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

  // Fade-in on scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { rootMargin: '0px 0px -60px 0px', threshold: 0.1 }
    );

    fadeRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const setRef = (id: string) => (el: HTMLElement | null) => {
    if (el) sectionsRef.current[id] = el;
  };

  const addFadeRef = useCallback((el: HTMLDivElement | null) => {
    if (el && !fadeRef.current.includes(el)) {
      fadeRef.current.push(el);
    }
  }, []);

  return (
    <div className="prose prose-dark max-w-none space-y-0">
      {/* ===================== OVERVIEW ===================== */}
      <section id="overview" ref={setRef('overview')} className="scroll-mt-24">
        <div className="section-header">
          <span className="section-number">01</span>
          <h2 className="text-2xl font-semibold text-foreground mb-2 tracking-tight">
            Descripción General
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl">
            Workflow diseñado para desarrollo basado en sprints con ciclos de release limpios usando squash merges.
            Historial limpio y lineal en main, trabajo acumulado del sprint en stg.
          </p>
        </div>

        {/* Branch Structure */}
        <div ref={addFadeRef} className="fade-section mb-8">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
            Estructura de Branches
          </h3>

          <div className="grid gap-2">
            {[
              { name: 'main', color: '#ff0080', colorClass: 'text-error', label: 'Código en producción. Fuente de verdad.', desc: 'Refleja exactamente lo que está corriendo en el ambiente de producción.' },
              { name: 'stg', color: '#fb923c', colorClass: 'text-orange-500', label: 'Ambiente de staging/integración', desc: 'Acumula los features del sprint. QA y stakeholders validan acá. Cumple el rol de rama de integración.' },
              { name: 'dev', color: '#0070f3', colorClass: 'text-primary', label: 'Ambiente de desarrollo', desc: 'Para testing individual de desarrolladores.' },
            ].map((branch) => (
              <div
                key={branch.name}
                className="branch-card gradient-border p-4 flex items-start gap-4 transition-all duration-300"
                style={{ '--branch-glow': branch.color } as React.CSSProperties}
              >
                <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: branch.color }} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <code className={`text-sm font-bold ${branch.colorClass} font-mono`}>{branch.name}</code>
                    <span className="text-xs text-muted-foreground/60">—</span>
                    <span className="text-xs text-muted-foreground">{branch.label}</span>
                  </div>
                  <p className="text-sm text-muted-foreground/70 leading-relaxed">
                    {branch.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Key Principle */}
          <div className="mt-5 gradient-border p-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Info className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground mb-1">Principio Clave</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
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
      <section id="sprint-1" ref={setRef('sprint-1')} className="scroll-mt-24 pt-16 section-divider">
        <div className="section-header">
          <span className="section-number">02</span>
          <h2 className="text-2xl font-semibold text-foreground mb-2 tracking-tight">
            Sprint 1
          </h2>
        </div>

        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mt-8 mb-3">
          Desarrollo de Features
        </h3>
        <p className="text-muted-foreground leading-relaxed mb-5 max-w-2xl">
          Los feature branches se crean desde <code className="text-error font-semibold">main</code>.
          Cada feature tiene 2 PRs que se mergean de forma normal (no squash).
        </p>

        <div ref={addFadeRef} className="fade-section mb-8">
          <TerminalBlock code={`git checkout main\ngit pull origin main\ngit checkout -b feature/nombre-descriptivo`} />
        </div>

        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mt-10 mb-3">
          2 PRs por Feature
        </h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-2xl">
          Para cada feature branch, se crean <strong className="text-foreground">dos Pull Requests</strong> (merge normal, no squash):
        </p>

        <div ref={addFadeRef} className="fade-section">
          <table className="refined-table mb-8">
            <thead>
              <tr>
                <th>PR</th>
                <th>Dirección</th>
                <th>Propósito</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-semibold text-primary">PR 1</td>
                <td className="text-muted-foreground">
                  <code className="text-success">feature/nombre</code>
                  <span className="text-muted-foreground/40 mx-1.5">&rarr;</span>
                  <code className="text-primary">dev</code>
                </td>
                <td className="text-muted-foreground">Testing de desarrolladores</td>
              </tr>
              <tr>
                <td className="font-semibold text-orange-500">PR 2</td>
                <td className="text-muted-foreground">
                  <code className="text-success">feature/nombre</code>
                  <span className="text-muted-foreground/40 mx-1.5">&rarr;</span>
                  <code className="text-orange-500">stg</code>
                </td>
                <td className="text-muted-foreground">Testing QA/stakeholders + integración</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ExportableDiagram name="sprint-1-feature-flow">
          <GitDiagram
            commits={[
              { id: 'm1', branch: 'main', x: 80, y: 50, message: 'Inicio' },
              { id: 's1', branch: 'stg', x: 80, y: 120 },
              { id: 's-a', branch: 'stg', x: 440, y: 120, message: 'A merged', type: 'merge' },
              { id: 's-b', branch: 'stg', x: 560, y: 120, message: 'B merged', type: 'merge' },
              { id: 'd1', branch: 'dev', x: 80, y: 190 },
              { id: 'd-a', branch: 'dev', x: 440, y: 190, message: 'A merged', type: 'merge' },
              { id: 'd-b', branch: 'dev', x: 560, y: 190, message: 'B merged', type: 'merge' },
              { id: 'fa1', branch: 'feature/A', x: 180, y: 260, message: 'feat A.1' },
              { id: 'fa2', branch: 'feature/A', x: 280, y: 260, message: 'feat A.2' },
              { id: 'fa3', branch: 'feature/A', x: 380, y: 260, message: 'feat A.3' },
              { id: 'fb1', branch: 'feature/B', x: 230, y: 330, message: 'feat B.1' },
              { id: 'fb2', branch: 'feature/B', x: 330, y: 330, message: 'feat B.2' },
            ]}
            branches={[
              { name: 'main', color: BRANCH_COLORS_HEX.main, y: 50 },
              { name: 'stg', color: BRANCH_COLORS_HEX.stg, y: 120 },
              { name: 'dev', color: BRANCH_COLORS_HEX.dev, y: 190 },
              { name: 'feature/A', color: BRANCH_COLORS_HEX.feature, y: 260 },
              { name: 'feature/B', color: BRANCH_COLORS_HEX.feature, y: 330 },
            ]}
            connections={[
              { from: 'm1', to: 'fa1' },
              { from: 'fa1', to: 'fa2' },
              { from: 'fa2', to: 'fa3' },
              { from: 'm1', to: 'fb1' },
              { from: 'fb1', to: 'fb2' },
              { from: 'fa3', to: 's-a', type: 'merge' },
              { from: 'fb2', to: 's-b', type: 'merge' },
              { from: 'fa3', to: 'd-a', type: 'merge' },
              { from: 'fb2', to: 'd-b', type: 'merge' },
            ]}
            height={400}
          />
        </ExportableDiagram>

        {/* End of sprint state */}
        <div ref={addFadeRef} className="fade-section gradient-border p-5 mt-6">
          <h4 className="text-sm font-medium text-foreground mb-3">Estado al Final del Sprint 1</h4>
          <div className="space-y-2.5">
            <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <Check className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
              <span><code className="text-orange-500">stg</code> tiene todos los commits de los features del sprint</span>
            </div>
            <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <Minus className="w-4 h-4 text-muted-foreground/40 mt-0.5 flex-shrink-0" />
              <span><code className="text-error">main</code> sin cambios</span>
            </div>
            <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
              <span>Todas las features testeadas y aprobadas en stg</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== CONFLICT RESOLUTION ===================== */}
      <section id="conflict-resolution" ref={setRef('conflict-resolution')} className="scroll-mt-24 pt-16 section-divider">
        <div className="section-header">
          <span className="section-number">03</span>
          <h2 className="text-2xl font-semibold text-foreground mb-4 tracking-tight">
            Manejo de Conflictos
          </h2>
        </div>

        {/* Critical rule */}
        <div ref={addFadeRef} className="fade-section relative rounded-xl overflow-hidden mb-6" style={{ background: 'rgba(255,0,128,0.04)', border: '1px solid rgba(255,0,128,0.1)' }}>
          <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: '#ff0080' }} />
          <div className="flex items-start gap-3 p-4 pl-5">
            <AlertTriangle className="w-4 h-4 text-error mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-error mb-1">Regla Crítica</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground">NUNCA</strong> hacer merge de{' '}
                <code className="text-primary">dev</code>,{' '}
                <code className="text-orange-500">stg</code> o{' '}
                <code className="text-error">main</code> hacia el feature branch.
              </p>
            </div>
          </div>
        </div>

        <p className="text-muted-foreground leading-relaxed mb-5">
          Si hay conflictos al crear los PRs:
        </p>

        {/* Steps */}
        <div ref={addFadeRef} className="fade-section space-y-3 mb-8">
          {[
            { num: '1', text: 'Crear un nuevo branch específico para resolver conflictos' },
            { num: '2', text: 'Resolver los conflictos en ese branch' },
            { num: '3', text: 'Crear un nuevo PR desde el branch de resolución' },
          ].map((step) => (
            <div key={step.num} className="flex items-start gap-3">
              <span className="step-number">{step.num}</span>
              <p className="text-sm text-muted-foreground pt-1">{step.text}</p>
            </div>
          ))}
          <div className="flex items-start gap-3">
            <span className="step-number" style={{ borderColor: 'rgba(255,0,128,0.2)', color: '#ff0080' }}>
              4
            </span>
            <p className="text-sm text-muted-foreground pt-1">
              <strong className="text-foreground">NO</strong> contaminar el feature branch original
            </p>
          </div>
        </div>

        <ExportableDiagram name="conflict-resolution">
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
        </ExportableDiagram>
      </section>

      {/* ===================== FEATURES QUE NO LLEGAN A RELEASE ===================== */}
      <section id="features-no-release" ref={setRef('features-no-release')} className="scroll-mt-24 pt-16 section-divider">
        <div className="section-header">
          <span className="section-number">04</span>
          <h2 className="text-2xl font-semibold text-foreground mb-2 tracking-tight">
            Features que no llegan a Release
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl">
            Si un feature que ya está en <code className="text-orange-500 font-semibold">stg</code> no va a llegar
            a <code className="text-error font-semibold">main</code> en el release actual, hay dos estrategias:
          </p>
        </div>

        <div ref={addFadeRef} className="fade-section grid md:grid-cols-2 gap-3 mb-6">
          {/* Option A: Rollback */}
          <div className="gradient-border p-5 transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(0,112,243,0.15)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(0,112,243,0.1)' }}>
                <RotateCcw className="w-4 h-4 text-primary" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-wider">Opción A</span>
                <h3 className="text-sm font-semibold text-foreground leading-tight">Rollback en stg</h3>
              </div>
            </div>
            <p className="text-sm text-muted-foreground/80 mb-3 leading-relaxed">
              Revertir los commits del feature en stg antes del squash merge a main.
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="w-3.5 h-3.5 text-success mt-0.5 flex-shrink-0" />
                <span>Útil cuando el feature tiene problemas de calidad o se decidió postergarlo</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="w-3.5 h-3.5 text-success mt-0.5 flex-shrink-0" />
                <span>El feature branch original se preserva para retomarlo en un sprint futuro</span>
              </div>
            </div>
          </div>

          {/* Option B: Feature Flag */}
          <div className="gradient-border p-5 transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(168,85,247,0.15)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(168,85,247,0.1)' }}>
                <Flag className="w-4 h-4 text-purple-500" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-wider">Opción B</span>
                <h3 className="text-sm font-semibold text-foreground leading-tight">Feature Flag</h3>
              </div>
            </div>
            <p className="text-sm text-muted-foreground/80 mb-3 leading-relaxed">
              El feature se despliega a producción pero deshabilitado mediante un feature flag.
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="w-3.5 h-3.5 text-success mt-0.5 flex-shrink-0" />
                <span>Útil cuando el código ya está integrado con otros features y un rollback sería complejo</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="w-3.5 h-3.5 text-success mt-0.5 flex-shrink-0" />
                <span>Permite activarlo gradualmente cuando esté listo sin necesidad de un nuevo deploy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decision Criteria */}
        <div ref={addFadeRef} className="fade-section relative rounded-xl overflow-hidden" style={{ background: 'rgba(0,112,243,0.03)', border: '1px solid rgba(0,112,243,0.08)' }}>
          <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: '#0070f3' }} />
          <div className="flex items-start gap-3 p-4 pl-5">
            <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-foreground mb-1">Criterio de Decisión</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Si el feature es aislado y fácil de revertir → <strong className="text-primary">rollback</strong>.
                Si está entrelazado con otros cambios o casi listo → <strong className="text-purple-500">feature flag</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== RELEASE DAY ===================== */}
      <section id="release-day" ref={setRef('release-day')} className="scroll-mt-24 pt-16 section-divider">
        <div className="section-header">
          <span className="section-number">05</span>
          <h2 className="text-2xl font-semibold text-foreground mb-4 tracking-tight">
            Día de Release
          </h2>
        </div>

        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mt-8 mb-3">
          Paso 1 — Squash Merge de stg a main
        </h3>
        <p className="text-muted-foreground leading-relaxed mb-5 max-w-2xl">
          Todos los commits del sprint se combinan en un único commit limpio en main.
        </p>

        <ExportableDiagram name="squash-merge-stg-main">
          <GitDiagram
            commits={[
              { id: 'm1', branch: 'main', x: 100, y: 50 },
              { id: 'm2', branch: 'main', x: 300, y: 50, message: 'Sprint 1', type: 'squash' },
              { id: 's-full', branch: 'stg', x: 100, y: 150, message: '10 commits' },
            ]}
            branches={[
              { name: 'main', color: BRANCH_COLORS_HEX.main, y: 50 },
              { name: 'stg', color: BRANCH_COLORS_HEX.stg, y: 150 },
            ]}
            connections={[
              { from: 's-full', to: 'm2', type: 'squash' },
              { from: 'm1', to: 'm2' },
            ]}
            height={220}
          />
        </ExportableDiagram>

        {/* Why Squash */}
        <div ref={addFadeRef} className="fade-section gradient-border p-5 my-6">
          <h4 className="text-sm font-medium text-primary mb-3">¿Por qué Squash?</h4>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { icon: CheckCircle, text: 'Historial limpio y lineal en main' },
              { icon: RotateCcw, text: 'Fácil revertir sprints completos' },
              { icon: GitMerge, text: 'Hitos de release claros' },
              { icon: ShieldCheck, text: 'Auditoría simplificada' },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <Icon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mt-10 mb-3">
          Paso 2 — Merge main de vuelta a stg y dev
        </h3>
        <p className="text-muted-foreground leading-relaxed mb-4 max-w-2xl">
          Este paso es <strong className="text-error">CRÍTICO</strong>.
          Después del squash merge, main se debe mergear de vuelta a <strong className="text-foreground">ambos</strong>{' '}
          <code className="text-orange-500 font-semibold">stg</code> y{' '}
          <code className="text-primary font-semibold">dev</code>.
        </p>

        <div ref={addFadeRef} className="fade-section my-6">
          <TerminalBlock code={`git checkout stg\ngit merge main\ngit push origin stg\n\ngit checkout dev\ngit merge main\ngit push origin dev`} />
        </div>

        <ExportableDiagram name="sync-main-stg-dev">
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
        </ExportableDiagram>

        {/* Result */}
        <div ref={addFadeRef} className="fade-section relative rounded-xl overflow-hidden mt-6" style={{ background: 'rgba(13,222,106,0.03)', border: '1px solid rgba(13,222,106,0.1)' }}>
          <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: '#0dde6a' }} />
          <div className="p-5 pl-5">
            <h4 className="text-sm font-medium text-success mb-3">Resultado</h4>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                <span><code className="text-error">main</code>: 1 commit squasheado</span>
              </div>
              <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                <span><code className="text-orange-500">stg</code> y <code className="text-primary">dev</code>: sincronizados con main</span>
              </div>
              <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                <span>
                  <strong className="text-success">Todo listo para el próximo sprint sin conflictos</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== SPRINT 2 ===================== */}
      <section id="sprint-2" ref={setRef('sprint-2')} className="scroll-mt-24 pt-16 section-divider">
        <div className="section-header">
          <span className="section-number">06</span>
          <h2 className="text-2xl font-semibold text-foreground mb-2 tracking-tight">
            Sprint 2
          </h2>
        </div>

        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mt-8 mb-3">
          Comenzando de Nuevo
        </h3>
        <p className="text-muted-foreground leading-relaxed mb-5 max-w-2xl">
          Con <code className="text-orange-500 font-semibold">stg</code> y{' '}
          <code className="text-primary font-semibold">dev</code> sincronizados con{' '}
          <code className="text-error font-semibold">main</code>, el Sprint 2 comienza limpio.
          Features nuevos salen de main, PRs van a dev y stg.
        </p>

        <ExportableDiagram name="sprint-2-clean-start">
          <GitDiagram
            commits={[
              { id: 'm-sync', branch: 'main', x: 100, y: 50, message: 'Sincronizado' },
              { id: 's-s2', branch: 'stg', x: 100, y: 120, message: 'Sincronizado' },
              { id: 'd-s2', branch: 'dev', x: 100, y: 190, message: 'Sincronizado' },
              { id: 'fc1', branch: 'feature/C', x: 250, y: 260, message: 'feat C' },
              { id: 'fd1', branch: 'feature/D', x: 300, y: 330, message: 'feat D' },
            ]}
            branches={[
              { name: 'main', color: BRANCH_COLORS_HEX.main, y: 50 },
              { name: 'stg', color: BRANCH_COLORS_HEX.stg, y: 120 },
              { name: 'dev', color: BRANCH_COLORS_HEX.dev, y: 190 },
              { name: 'feature/C', color: BRANCH_COLORS_HEX.feature, y: 260 },
              { name: 'feature/D', color: BRANCH_COLORS_HEX.feature, y: 330 },
            ]}
            connections={[
              { from: 'm-sync', to: 'fc1' },
              { from: 'm-sync', to: 'fd1' },
            ]}
            height={400}
          />
        </ExportableDiagram>

        <div ref={addFadeRef} className="fade-section relative rounded-xl overflow-hidden mt-6" style={{ background: 'rgba(13,222,106,0.03)', border: '1px solid rgba(13,222,106,0.1)' }}>
          <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ backgroundColor: '#0dde6a' }} />
          <div className="p-5 pl-5">
            <h4 className="text-sm font-medium text-success mb-1">Sin Conflictos</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Porque mergeamos main de vuelta a stg y dev, todas las nuevas ramas de features comienzan desde un estado limpio
              sin conflictos de merge o commits duplicados.
            </p>
          </div>
        </div>
      </section>

      {/* ===================== BEST PRACTICES ===================== */}
      <section id="best-practices" ref={setRef('best-practices')} className="scroll-mt-24 pt-16 section-divider">
        <div className="section-header">
          <span className="section-number">07</span>
          <h2 className="text-2xl font-semibold text-foreground mb-6 tracking-tight">
            Mejores Prácticas
          </h2>
        </div>

        <div ref={addFadeRef} className="fade-section space-y-2">
          {[
            'Siempre mergear main de vuelta a stg y dev después del release',
            'Mantener duraciones de sprint consistentes',
            'Testear exhaustivamente en stg antes de liberar',
            'Documentar notas de release con cada commit squash',
            'Etiquetar releases en main para fácil referencia',
          ].map((practice, idx) => (
            <div key={idx} className="flex items-start gap-3 gradient-border p-3.5">
              <span className="w-5 h-5 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[10px] font-mono text-muted-foreground">{idx + 1}</span>
              </span>
              <span className="text-sm text-muted-foreground leading-relaxed">{practice}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
