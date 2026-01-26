'use client';

import { Upload, Moon, Sun, Settings, GitHubLogo } from '@/components/icons';
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
            <GitHubLogo className="w-5 h-5 text-primary-foreground" />
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
