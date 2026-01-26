'use client';

import { useState } from 'react';
import { ChevronRight, Search, Trash2, Upload, GitHubLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Workflow } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface SidebarProps {
  workflows: Workflow[];
  currentWorkflow: Workflow | null;
  activeSection: string;
  onWorkflowChange: (workflowId: string) => void;
  onSectionChange: (sectionId: string) => void;
  onSearchOpen: () => void;
  onUploadClick: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onDeleteWorkflow: (workflowId: string) => void;
}

export function Sidebar({
  workflows,
  currentWorkflow,
  activeSection,
  onWorkflowChange,
  onSectionChange,
  onSearchOpen,
  onUploadClick,
  collapsed,
  onToggleCollapse,
  onDeleteWorkflow,
}: SidebarProps) {
  const [tocOpen, setTocOpen] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [workflowToDelete, setWorkflowToDelete] = useState<string | null>(null);

  const handleDeleteClick = (workflowId: string) => {
    setWorkflowToDelete(workflowId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (workflowToDelete) {
      onDeleteWorkflow(workflowToDelete);
      setWorkflowToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  if (collapsed) {
    return (
      <aside className="w-12 bg-sidebar border-r border-sidebar-border flex-shrink-0 flex flex-col items-center py-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="vercel-transition"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </aside>
    );
  }

  return (
    <aside className="w-[280px] bg-sidebar border-r border-sidebar-border flex-shrink-0 flex flex-col overflow-hidden">
      <div className="px-6 pt-8 pb-6 space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <GitHubLogo className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-lg font-semibold text-foreground">Git Workflows</h1>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Select value={currentWorkflow?.id} onValueChange={onWorkflowChange}>
              <SelectTrigger className="flex-1 bg-sidebar-accent border-sidebar-border h-10">
                <SelectValue placeholder="Select workflow" />
              </SelectTrigger>
              <SelectContent>
                {workflows.map((workflow) => (
                  <SelectItem key={workflow.id} value={workflow.id}>
                    {workflow.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {workflows.length > 1 && currentWorkflow && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteClick(currentWorkflow.id)}
                className="vercel-transition flex-shrink-0 h-10 w-10"
              >
                <Trash2 className="w-4 h-4 text-muted-foreground hover:text-error" />
              </Button>
            )}
          </div>

          {currentWorkflow && (
            <p className="text-xs text-muted-foreground leading-relaxed">
              {currentWorkflow.description}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 justify-start text-muted-foreground vercel-transition bg-transparent"
            onClick={onSearchOpen}
          >
            <Search className="w-4 h-4 mr-2" />
            <span className="text-sm">Search</span>
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        </div>
        
        <Button
          variant="default"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={onUploadClick}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Workflow
        </Button>
      </div>

      <div className="px-6 pb-4 border-b border-sidebar-border">
        <p className="text-xs font-medium text-muted-foreground mb-3">WORKFLOW</p>
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground mb-3">ON THIS PAGE</p>
          {currentWorkflow?.sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={cn(
                'w-full text-left px-3 py-2.5 rounded-lg text-sm vercel-transition flex items-center gap-2 group',
                activeSection === section.id
                  ? 'bg-primary/10 text-primary font-medium border-l-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50'
              )}
            >
              <span className={cn(
                'text-xs font-mono',
                activeSection === section.id ? 'text-primary' : 'text-muted-foreground/50'
              )}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="flex-1">{section.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-4 border-t border-sidebar-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <kbd className="px-2 py-1 rounded bg-muted border border-border font-mono">⌘K</kbd>
          <span>Search</span>
          <kbd className="px-2 py-1 rounded bg-muted border border-border font-mono ml-auto">⌘U</kbd>
          <span>Upload</span>
        </div>
      </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workflow</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this workflow? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </aside>
  );
}
