'use client';

import { cn } from '@/lib/utils';

interface OnThisPageProps {
  sections: Array<{ id: string; title: string }>;
  activeSection: string;
  onSectionChange: (id: string) => void;
}

export function OnThisPage({
  sections,
  activeSection,
  onSectionChange,
}: OnThisPageProps) {
  if (sections.length === 0) return null;

  return (
    <nav className="space-y-1">
      <p className="text-xs font-semibold text-muted-foreground mb-4 tracking-wider">
        ON THIS PAGE
      </p>
      <div className="space-y-0.5">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={cn(
              'block w-full text-left text-sm py-2 px-3 rounded-md transition-all',
              'border-l-2',
              activeSection === section.id
                ? 'border-primary text-primary bg-primary/5 font-medium'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            )}
          >
            {section.title}
          </button>
        ))}
      </div>
    </nav>
  );
}
