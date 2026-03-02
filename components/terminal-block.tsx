'use client';

import { useState, useCallback } from 'react';
import { Check, Copy } from 'lucide-react';

interface TerminalBlockProps {
  code: string;
  title?: string;
}

export function TerminalBlock({ code, title = 'terminal' }: TerminalBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <div className="terminal group">
      <div className="terminal-header">
        <span className="terminal-dot" style={{ backgroundColor: '#ff5f57' }} />
        <span className="terminal-dot" style={{ backgroundColor: '#febc2e' }} />
        <span className="terminal-dot" style={{ backgroundColor: '#28c840' }} />
        <span className="ml-3 text-xs text-muted-foreground/50 font-mono">{title}</span>

        <button
          onClick={handleCopy}
          className="ml-auto flex items-center gap-1.5 px-2 py-1 rounded-md text-xs text-muted-foreground/40 hover:text-muted-foreground transition-all duration-200 hover:bg-white/[0.04] opacity-0 group-hover:opacity-100"
          aria-label="Copy to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-success" />
              <span className="text-success">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="terminal-body">
        <pre className="whitespace-pre">
          <code>
            {code.split('\n').map((line, i) => (
              <span key={i}>
                {line ? <span className="cmd">{line}</span> : null}
                {i < code.split('\n').length - 1 ? '\n' : null}
              </span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}
