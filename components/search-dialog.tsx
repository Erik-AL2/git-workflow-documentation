'use client';

import React from "react"

import { useState, useEffect, useMemo } from 'react';
import { Search, FileText } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Workflow } from '@/lib/types';
import { cn } from '@/lib/utils';

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
  workflow: Workflow | null;
  onSectionSelect: (sectionId: string) => void;
}

interface SearchResult {
  sectionId: string;
  sectionTitle: string;
  snippet: string;
  matchCount: number;
}

export function SearchDialog({
  open,
  onClose,
  workflow,
  onSectionSelect,
}: SearchDialogProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const results = useMemo(() => {
    if (!workflow || !query.trim()) return [];

    const searchQuery = query.toLowerCase();
    const searchResults: SearchResult[] = [];

    workflow.sections.forEach((section) => {
      const content = section.content.toLowerCase();
      const title = section.title.toLowerCase();

      if (content.includes(searchQuery) || title.includes(searchQuery)) {
        // Find snippet
        const index = content.indexOf(searchQuery);
        const start = Math.max(0, index - 40);
        const end = Math.min(content.length, index + 100);
        let snippet = section.content.substring(start, end);

        if (start > 0) snippet = '...' + snippet;
        if (end < content.length) snippet = snippet + '...';

        // Count matches
        const matches = (content.match(new RegExp(searchQuery, 'g')) || []).length;

        searchResults.push({
          sectionId: section.id,
          sectionTitle: section.title,
          snippet,
          matchCount: matches,
        });
      }
    });

    return searchResults.sort((a, b) => b.matchCount - a.matchCount);
  }, [workflow, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex].sectionId);
    }
  };

  const handleSelect = (sectionId: string) => {
    onSectionSelect(sectionId);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl p-0 gap-0 glass-morphism border border-border overflow-hidden">
        <div className="flex items-center border-b border-border px-4 py-3">
          <Search className="w-5 h-5 text-muted-foreground mr-3" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search documentation..."
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground"
            autoFocus
          />
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ESC
          </kbd>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {!query.trim() && (
            <div className="p-8 text-center">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-sm text-muted-foreground">
                Start typing to search through documentation
              </p>
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <kbd className="px-2 py-1 bg-muted rounded border border-border">↑↓</kbd>
                <span>to navigate</span>
                <kbd className="px-2 py-1 bg-muted rounded border border-border">↵</kbd>
                <span>to select</span>
              </div>
            </div>
          )}

          {query.trim() && results.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground">
                No results found for "{query}"
              </p>
            </div>
          )}

          {results.length > 0 && (
            <div className="py-2">
              {results.map((result, index) => (
                <button
                  key={result.sectionId}
                  onClick={() => handleSelect(result.sectionId)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={cn(
                    'w-full text-left px-4 py-3 vercel-transition flex items-start gap-3',
                    selectedIndex === index
                      ? 'bg-primary/10 border-l-2 border-primary'
                      : 'hover:bg-accent/50 border-l-2 border-transparent'
                  )}
                >
                  <FileText className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-sm text-foreground">
                        {result.sectionTitle}
                      </p>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        {result.matchCount} {result.matchCount === 1 ? 'match' : 'matches'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {result.snippet}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
