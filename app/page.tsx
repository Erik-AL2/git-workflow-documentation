'use client';

import { useState } from 'react';
import { workflows } from '@/lib/workflows';
import { OnThisPage } from '@/components/on-this-page';
import { WorkflowSelector } from '@/components/workflow-selector';
import { SquashMergeContent } from '@/components/squash-merge-content';
import { ThreePRContent } from '@/components/three-pr-content';
import { Toaster } from '@/components/ui/toaster';

export default function Home() {
  const [currentWorkflowId, setCurrentWorkflowId] = useState('squash-merge');
  const [activeSection, setActiveSection] = useState('');

  const currentWorkflow = workflows.find(w => w.id === currentWorkflowId);

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
      <WorkflowSelector
        workflows={workflows}
        currentWorkflowId={currentWorkflowId}
        onWorkflowChange={setCurrentWorkflowId}
      />

      <div className="max-w-[1800px] mx-auto px-6 lg:px-12 py-12">
        <div className="flex gap-8 lg:gap-12 xl:gap-20">
          {/* Main Content */}
          <div className="flex-1 max-w-[1100px]">
            <div className="mb-12">
              <h1 className="text-5xl font-bold text-foreground mb-4 text-balance tracking-tight">
                {currentWorkflow?.title}
              </h1>
              <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
                {currentWorkflow?.description}
              </p>
            </div>

            {currentWorkflowId === 'squash-merge' && (
              <SquashMergeContent onSectionChange={setActiveSection} />
            )}
            {currentWorkflowId === '3-pr-workflow' && (
              <ThreePRContent onSectionChange={setActiveSection} />
            )}
          </div>

          {/* On This Page Sidebar */}
          <div className="hidden xl:block w-[240px] flex-shrink-0">
            <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto">
              <OnThisPage
                sections={currentWorkflow?.sections || []}
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
