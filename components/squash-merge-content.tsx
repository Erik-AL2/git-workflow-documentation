'use client';

import { useEffect, useRef } from 'react';
import { GitDiagram } from '@/components/git-diagram';
import { FlowDiagram } from '@/components/flow-diagram';

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
        <h2 className="text-3xl font-bold text-foreground mb-4">Overview</h2>
        <p className="text-muted-foreground leading-relaxed">
          This workflow is designed for sprint-based development with clean release cycles using squash merges.
          It allows teams to maintain a clean commit history on the main branch while preserving detailed development
          history on integration branches.
        </p>
      </section>

      <section id="sprint-1" ref={setRef('sprint-1')} className="scroll-mt-24 mt-16">
        <h2 className="text-3xl font-bold text-foreground mb-6">Sprint 1</h2>
        
        <h3 className="text-xl font-semibold text-foreground mb-4 mt-8">Feature Development</h3>
        <p className="text-muted-foreground leading-relaxed mb-6">
          During Sprint 1, developers create feature branches from the integration branch and work independently.
          Each feature goes through the standard PR process before being merged into integration.
        </p>

        <GitDiagram
          commits={[
            { id: 'i1', branch: 'integration', x: 100, y: 50, message: 'Start' },
            { id: 'fa1', branch: 'feature/A', x: 200, y: 100, message: 'feat A.1' },
            { id: 'fa2', branch: 'feature/A', x: 300, y: 100, message: 'feat A.2' },
            { id: 'fa3', branch: 'feature/A', x: 400, y: 100, message: 'feat A.3' },
            { id: 'fb1', branch: 'feature/B', x: 250, y: 150, message: 'feat B.1' },
            { id: 'fb2', branch: 'feature/B', x: 350, y: 150, message: 'feat B.2' },
            { id: 'i2', branch: 'integration', x: 500, y: 50, message: 'Merge A+B', type: 'merge' },
          ]}
          branches={[
            { name: 'integration', color: '#0070f3', y: 50 },
            { name: 'feature/A', color: '#0dde6a', y: 100 },
            { name: 'feature/B', color: '#a855f7', y: 150 },
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

        <div className="bg-card border border-border rounded-lg p-6 my-6">
          <h4 className="text-sm font-semibold text-foreground mb-3">State at End of Sprint 1</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-success mt-0.5">✓</span>
              <span>Integration contains 10 commits (6 from Feature A + 4 from Feature B)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-muted-foreground mt-0.5">—</span>
              <span>Main remains unchanged</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-success mt-0.5">✓</span>
              <span>All features are tested and approved</span>
            </li>
          </ul>
        </div>
      </section>

      <section id="release-day" ref={setRef('release-day')} className="scroll-mt-24 mt-16">
        <h2 className="text-3xl font-bold text-foreground mb-6">Release Day</h2>

        <h3 className="text-xl font-semibold text-foreground mb-4 mt-8">Step 1: Squash Merge to Main</h3>
        <p className="text-muted-foreground leading-relaxed mb-6">
          The key to this workflow is the squash merge from integration to main. All commits from the sprint
          are combined into a single, clean commit on the main branch.
        </p>

        <GitDiagram
          commits={[
            { id: 'i-full', branch: 'integration', x: 100, y: 50, message: '10 commits' },
            { id: 'm1', branch: 'main', x: 100, y: 150 },
            { id: 'm2', branch: 'main', x: 300, y: 150, message: 'Sprint 1', type: 'squash' },
          ]}
          branches={[
            { name: 'integration', color: '#0070f3', y: 50 },
            { name: 'main', color: '#ff0080', y: 150 },
          ]}
          connections={[
            { from: 'i-full', to: 'm2', type: 'merge' },
            { from: 'm1', to: 'm2' },
          ]}
          height={220}
        />

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 my-6">
          <h4 className="text-sm font-semibold text-primary mb-3">Why Squash?</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Clean, linear history on main</li>
            <li>• Easy to revert entire sprints if needed</li>
            <li>• Clear release milestones</li>
            <li>• Simplified auditing</li>
          </ul>
        </div>

        <h3 className="text-xl font-semibold text-foreground mb-4 mt-8">Step 2: Merge Main Back to Integration</h3>
        <p className="text-muted-foreground leading-relaxed mb-4">
          This step is <strong className="text-error">CRITICAL</strong> to avoid conflicts in future sprints.
          After squashing to main, you must merge main back into integration.
        </p>

        <pre className="bg-card border border-border rounded-lg p-4 text-sm font-mono overflow-x-auto my-6">
          <code className="text-foreground">{`git checkout integration
git merge main
git push origin integration`}</code>
        </pre>

        <div className="bg-success/5 border border-success/20 rounded-lg p-6 my-6">
          <h4 className="text-sm font-semibold text-success mb-3">Result</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Main: 1 squashed commit</li>
            <li>• Integration: 10 original commits + 1 merge commit from main</li>
            <li>• <strong className="text-success">Content is identical in both branches</strong></li>
          </ul>
        </div>
      </section>

      <section id="sprint-2" ref={setRef('sprint-2')} className="scroll-mt-24 mt-16">
        <h2 className="text-3xl font-bold text-foreground mb-6">Sprint 2</h2>

        <h3 className="text-xl font-semibold text-foreground mb-4 mt-8">Starting Fresh</h3>
        <p className="text-muted-foreground leading-relaxed mb-6">
          With integration now synchronized with main, Sprint 2 begins without conflicts.
          New features can be developed cleanly from the integration branch.
        </p>

        <GitDiagram
          commits={[
            { id: 'i-sync', branch: 'integration', x: 100, y: 50, message: 'Synced' },
            { id: 'fc1', branch: 'feature/C', x: 250, y: 100, message: 'feat C' },
            { id: 'fd1', branch: 'feature/D', x: 300, y: 150, message: 'feat D' },
            { id: 'i-s2', branch: 'integration', x: 400, y: 50, message: 'Merge C+D', type: 'merge' },
            { id: 'm-s1', branch: 'main', x: 100, y: 200, message: 'Sprint 1' },
          ]}
          branches={[
            { name: 'integration', color: '#0070f3', y: 50 },
            { name: 'feature/C', color: '#0dde6a', y: 100 },
            { name: 'feature/D', color: '#a855f7', y: 150 },
            { name: 'main', color: '#ff0080', y: 200 },
          ]}
          connections={[
            { from: 'i-sync', to: 'fc1' },
            { from: 'i-sync', to: 'fd1' },
            { from: 'fc1', to: 'i-s2', type: 'merge' },
            { from: 'fd1', to: 'i-s2', type: 'merge' },
          ]}
          height={260}
        />

        <div className="bg-success/5 border border-success/20 rounded-lg p-6 my-6">
          <h4 className="text-sm font-semibold text-success mb-3">No Conflicts!</h4>
          <p className="text-sm text-muted-foreground">
            Because we merged main back to integration, all new feature branches start from a clean state
            with no merge conflicts or duplicate commits.
          </p>
        </div>
      </section>

      <section id="benefits" ref={setRef('benefits')} className="scroll-mt-24 mt-16">
        <h2 className="text-3xl font-bold text-foreground mb-6">Benefits</h2>
        
        <div className="grid gap-4 my-6">
          {[
            { icon: '✓', title: 'Clean History', desc: 'Main branch has one commit per sprint', color: '#0dde6a' },
            { icon: '↶', title: 'Easy Reverts', desc: 'Roll back entire sprints with one revert', color: '#0070f3' },
            { icon: '○', title: 'No Conflicts', desc: 'Proper syncing prevents merge issues', color: '#a855f7' },
            { icon: '◆', title: 'Clear Releases', desc: 'Easy to track what went out when', color: '#ff0080' },
          ].map((benefit, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-4 rounded-lg border transition-all hover:scale-105"
              style={{
                borderColor: `${benefit.color}40`,
                backgroundColor: `${benefit.color}08`,
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-xl font-bold flex-shrink-0"
                style={{
                  backgroundColor: `${benefit.color}20`,
                  color: benefit.color,
                }}
              >
                {benefit.icon}
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">{benefit.title}</h4>
                <p className="text-sm text-muted-foreground">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="best-practices" ref={setRef('best-practices')} className="scroll-mt-24 mt-16">
        <h2 className="text-3xl font-bold text-foreground mb-6">Best Practices</h2>
        
        <ul className="space-y-3 text-muted-foreground">
          <li className="flex items-start gap-3">
            <span className="text-primary mt-1">•</span>
            <span>Always merge main back to integration after release</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary mt-1">•</span>
            <span>Keep sprint durations consistent</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary mt-1">•</span>
            <span>Test thoroughly in integration before releasing</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary mt-1">•</span>
            <span>Document release notes with each squash commit</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-primary mt-1">•</span>
            <span>Tag releases in main for easy reference</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
