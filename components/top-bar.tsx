'use client';

import { Upload, Moon, Sun, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface TopBarProps {
  onUploadClick: () => void;
}

export function TopBar({ onUploadClick }: TopBarProps) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="h-[60px] border-b border-border bg-card flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-5 h-5 text-primary-foreground"
            >
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Git Workflow Docs</h1>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onUploadClick}
          className="vercel-transition hover-glow bg-transparent"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Workflow
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="vercel-transition"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="vercel-transition"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}
