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
    <nav>
      <p className="text-[10px] font-medium text-muted-foreground mb-5 tracking-[0.15em] uppercase">
        On this page
      </p>
      <div className="relative">
        {/* Vertical connector line */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-white/[0.04]" />

        <div className="space-y-0.5">
          {sections.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={cn(
                  'group relative block w-full text-left text-[13px] py-1.5 pl-4 transition-colors duration-200',
                  isActive
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground/70'
                )}
              >
                {/* Active indicator bar */}
                <span
                  className={cn(
                    'absolute left-0 top-1/2 -translate-y-1/2 w-px transition-all duration-300',
                    isActive
                      ? 'h-4 bg-primary'
                      : 'h-0 bg-transparent group-hover:h-2 group-hover:bg-white/20'
                  )}
                />
                {section.title}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
