'use client';

import { useEffect, useRef } from 'react';
import { Workflow } from '@/lib/types';
import { MarkdownRenderer } from '@/components/markdown-renderer';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DocumentationViewerProps {
  workflow: Workflow | null;
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
}

export function DocumentationViewer({
  workflow,
  activeSection,
  onSectionChange,
}: DocumentationViewerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    const sectionElement = sectionRefs.current.get(activeSection);
    if (sectionElement && scrollRef.current) {
      const container = scrollRef.current;
      const elementTop = sectionElement.offsetTop;
      container.scrollTo({
        top: elementTop - 100,
        behavior: 'smooth',
      });
    }
  }, [activeSection]);

  // Intersection observer for scroll detection
  useEffect(() => {
    if (!scrollRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id) {
            onSectionChange(entry.target.id);
          }
        });
      },
      {
        root: scrollRef.current,
        rootMargin: '-100px 0px -50% 0px',
        threshold: 0,
      }
    );

    sectionRefs.current.forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [workflow, onSectionChange]);

  if (!workflow) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <p className="text-muted-foreground">No workflow selected</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background overflow-hidden lg:flex-[0.6]">
      <ScrollArea className="h-full">
        <div ref={scrollRef} className="h-full overflow-y-auto">
          <div className="max-w-3xl mx-auto px-8 py-12 space-y-16">
            {workflow.sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                ref={(el) => {
                  if (el) {
                    sectionRefs.current.set(section.id, el);
                  }
                }}
                className="scroll-mt-24"
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-foreground mb-2">
                    {section.title}
                  </h2>
                  <div className="h-1 w-20 bg-primary rounded-full" />
                </div>
                
                <div className="prose-container">
                  <MarkdownRenderer content={section.content} />
                </div>
              </section>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
