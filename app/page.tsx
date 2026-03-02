'use client';

import { useState } from 'react';
import { workflow } from '@/lib/workflows';
import { OnThisPage } from '@/components/on-this-page';
import { SquashMergeContent } from '@/components/squash-merge-content';
import { Toaster } from '@/components/ui/toaster';
import { GitBranch } from 'lucide-react';

export default function Home() {
  const [activeSection, setActiveSection] = useState('');

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Git Workflows</h2>
              <p className="text-xs text-muted-foreground">Documentation Hub</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-12">
        <div className="flex gap-8 lg:gap-12 xl:gap-20">
          {/* Main Content */}
          <div className="flex-1 max-w-[1100px]">
            <div className="mb-12">
              <h1 className="text-5xl font-bold text-foreground mb-4 text-balance tracking-tight">
                {workflow.title}
              </h1>
              <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
                {workflow.description}
              </p>
            </div>

            <SquashMergeContent onSectionChange={setActiveSection} />
          </div>

          {/* On This Page Sidebar */}
          <div className="hidden xl:block w-[240px] flex-shrink-0">
            <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <OnThisPage
                sections={workflow.sections}
                activeSection={activeSection}
                onSectionChange={handleSectionChange}
              />
            </div>
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  );
}
