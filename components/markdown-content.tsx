'use client';

import { useEffect, useRef } from 'react';
import { MarkdownRenderer } from './markdown-renderer';

interface MarkdownContentProps {
  markdown: string;
  sections: Array<{ id: string; title: string }>;
  activeSection: string;
  onSectionChange: (id: string) => void;
}

export function MarkdownContent({
  markdown,
  sections,
  activeSection,
  onSectionChange,
}: MarkdownContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (id && sections.some(s => s.id === id)) {
              onSectionChange(id);
            }
          }
        });
      },
      {
        rootMargin: '-100px 0px -66% 0px',
        threshold: 0,
      }
    );

    if (contentRef.current) {
      const headings = contentRef.current.querySelectorAll('[id]');
      headings.forEach((heading) => observer.observe(heading));
    }

    return () => observer.disconnect();
  }, [markdown, sections, onSectionChange]);

  if (!markdown) {
    return (
      <div className="space-y-6">
        {sections.map((section, index) => (
          <section key={section.id} id={section.id} className="scroll-mt-20">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {section.title}
            </h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-muted-foreground">
                Content for {section.title} section.
              </p>
            </div>
          </section>
        ))}
      </div>
    );
  }

  return (
    <div ref={contentRef} className="space-y-12">
      <MarkdownRenderer content={markdown} />
    </div>
  );
}
