'use client';

import { useEffect, useRef } from 'react';
// Icons are rendered inline in the copy button via SVG string
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    // Simple markdown parsing
    const html = parseMarkdown(content);
    contentRef.current.innerHTML = html;

    // Add copy buttons to code blocks
    const codeBlocks = contentRef.current.querySelectorAll('pre code');
    codeBlocks.forEach((block) => {
      const pre = block.parentElement;
      if (!pre) return;

      // Create wrapper
      const wrapper = document.createElement('div');
      wrapper.className = 'relative group';
      pre.parentElement?.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      // Create copy button
      const copyBtn = document.createElement('button');
      copyBtn.className =
        'absolute top-2 right-2 p-2 rounded-md bg-card border border-border opacity-0 group-hover:opacity-100 vercel-transition hover:bg-accent';
      copyBtn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
      copyBtn.onclick = () => {
        const code = block.textContent || '';
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
      };
      wrapper.appendChild(copyBtn);
    });
  }, [content]);

  return (
    <div
      ref={contentRef}
      className="prose prose-dark max-w-none text-foreground"
    />
  );
}

function parseMarkdown(markdown: string): string {
  let html = markdown;

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mt-8 mb-4 text-foreground">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-10 mb-6 text-foreground">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-12 mb-8 text-foreground">$1</h1>');

  // Code blocks
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre class="bg-card border border-border rounded-lg p-4 overflow-x-auto my-4"><code class="text-sm font-mono text-foreground">${escapeHtml(code.trim())}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-card text-foreground px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');

  // Bold
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>');

  // Lists
  html = html.replace(/^\- (.*)$/gim, '<li class="ml-4 mb-2 text-foreground">$1</li>');
  html = html.replace(/(<li class="ml-4 mb-2 text-foreground">.*<\/li>\n?)+/g, '<ul class="list-disc list-inside my-4 space-y-2">$&</ul>');

  // Numbered lists
  html = html.replace(/^\d+\. (.*)$/gim, '<li class="ml-4 mb-2 text-foreground">$1</li>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:text-primary/80 vercel-transition underline">$1</a>');

  // Paragraphs
  html = html.replace(/\n\n/g, '</p><p class="mb-4 text-foreground leading-relaxed">');
  html = `<p class="mb-4 text-foreground leading-relaxed">${html}</p>`;

  return html;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
