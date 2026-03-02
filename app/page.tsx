'use client';

import { useState, useEffect, useCallback } from 'react';
import { workflow } from '@/lib/workflows';
import { OnThisPage } from '@/components/on-this-page';
import { SquashMergeContent } from '@/components/squash-merge-content';
import { Toaster } from '@/components/ui/toaster';
import { ArrowUp } from 'lucide-react';

export default function Home() {
  const [activeSection, setActiveSection] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Scroll progress + back-to-top visibility
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
      setShowBackToTop(scrollTop > 500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcuts: 1-7 to navigate sections
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const num = parseInt(e.key);
      if (num >= 1 && num <= workflow.sections.length) {
        const section = workflow.sections[num - 1];
        if (section) {
          navigateToSection(section.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigateToSection = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 40;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-transparent">
        <div
          className="h-full transition-[width] duration-150 ease-out"
          style={{
            width: `${scrollProgress}%`,
            background: 'linear-gradient(90deg, #0070f3, #a855f7, #ff0080)',
          }}
        />
      </div>

      {/* Hero + content in one flow */}
      <div className="relative">
        {/* Ambient glow that fades naturally into content */}
        <div
          className="absolute top-0 left-0 right-0 h-[500px] pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 70% 60% at 30% 0%, rgba(0,112,243,0.05), transparent 70%),
              radial-gradient(ellipse 50% 50% at 70% 0%, rgba(168,85,247,0.03), transparent 60%)
            `,
          }}
        />
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-16 pb-10 relative">
          <p className="text-xs font-mono text-muted-foreground tracking-widest uppercase mb-4">
            Workflow Documentation
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display text-foreground mb-5 tracking-tight leading-[1.1]">
            {workflow.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            {workflow.description}
          </p>

          {/* Keyboard hint */}
          <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground/40">
            <span>Presiona</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] font-mono text-[10px]">1</kbd>
            <span>-</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] font-mono text-[10px]">7</kbd>
            <span>para navegar secciones</span>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pb-14">
        <div className="flex gap-10 lg:gap-16 xl:gap-24">
          {/* Main Content */}
          <div className="flex-1 max-w-[900px]">
            <SquashMergeContent onSectionChange={setActiveSection} />
          </div>

          {/* On This Page Sidebar */}
          <div className="hidden xl:block w-[220px] flex-shrink-0">
            <div className="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto">
              <OnThisPage
                sections={workflow.sections}
                activeSection={activeSection}
                onSectionChange={navigateToSection}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Back to top button */}
      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        className={`fixed bottom-6 right-6 z-40 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
          showBackToTop
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <ArrowUp className="w-4 h-4 text-muted-foreground" />
      </button>

      <Toaster />
    </div>
  );
}
