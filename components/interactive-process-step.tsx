'use client';

import { useState } from 'react';
import { ChevronRight, Circle, CheckCircle2, Clock, AlertCircle } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface InteractiveProcessStepProps {
  stepNumber: number;
  title: string;
  description: string;
  when?: string;
  requirements?: Array<{ label: string; type?: 'success' | 'warning' | 'info' }>;
  actions?: string[];
  codeExample?: string;
  highlight?: {
    type: 'success' | 'warning' | 'error' | 'info';
    message: string;
  };
  children?: React.ReactNode;
}

export function InteractiveProcessStep({
  stepNumber,
  title,
  description,
  when,
  requirements,
  actions,
  codeExample,
  highlight,
  children,
}: InteractiveProcessStepProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const highlightColors = {
    success: 'border-success/40 bg-success/5',
    warning: 'border-warning/40 bg-warning/5',
    error: 'border-error/40 bg-error/5',
    info: 'border-primary/40 bg-primary/5',
  };

  const highlightIconColors = {
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error',
    info: 'text-primary',
  };

  return (
    <div className="group animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card
        className={cn(
          'relative overflow-hidden transition-all duration-300',
          'border border-border/60 hover:border-border',
          'bg-gradient-to-br from-card/50 to-card',
          'hover:shadow-lg hover:shadow-primary/5',
          isExpanded && 'ring-2 ring-primary/20 shadow-xl shadow-primary/10'
        )}
      >
        {/* Animated gradient background */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.08) 0%, transparent 50%)',
          }}
        />

        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-left p-6 sm:p-8 relative z-10 group/button"
        >
          <div className="flex items-start gap-4 sm:gap-6">
            {/* Step Number Circle */}
            <div
              className={cn(
                'flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl',
                'flex items-center justify-center',
                'bg-gradient-to-br from-primary/20 to-primary/10',
                'border-2 border-primary/30',
                'transition-all duration-300',
                'group-hover/button:scale-105 active:scale-95',
                isExpanded && 'scale-110 border-primary/60'
              )}
            >
              <span className="text-xl sm:text-2xl font-bold text-primary">
                {stepNumber}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-2">
                <h3 className="text-xl sm:text-2xl font-semibold text-foreground">
                  {title}
                </h3>
                <ChevronRight
                  className={cn(
                    'w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-200',
                    isExpanded && 'rotate-90'
                  )}
                />
              </div>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        </button>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="overflow-hidden animate-in slide-in-from-top-2 fade-in duration-300">
            <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-2 space-y-6">
              {/* When & Requirements Grid */}
              {(when || requirements) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {when && (
                    <div className="p-4 rounded-lg border border-border/60 bg-card/50 animate-in slide-in-from-left-4 fade-in duration-300 delay-75">
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-4 h-4 text-primary" />
                        <h4 className="text-sm font-semibold text-foreground">Cuándo</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{when}</p>
                    </div>
                  )}

                  {requirements && requirements.length > 0 && (
                    <div className="p-4 rounded-lg border border-border/60 bg-card/50 animate-in slide-in-from-right-4 fade-in duration-300 delay-100">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle2 className="w-4 h-4 text-success" />
                        <h4 className="text-sm font-semibold text-foreground">Requisitos</h4>
                      </div>
                      <ul className="space-y-2">
                        {requirements.map((req, idx) => (
                          <li
                            key={idx}
                            className="flex items-center gap-2 text-sm text-muted-foreground animate-in fade-in slide-in-from-left-2 duration-200"
                            style={{ animationDelay: `${150 + idx * 50}ms` }}
                          >
                            <Circle
                              className={cn(
                                'w-1.5 h-1.5 fill-current',
                                req.type === 'success' && 'text-success',
                                req.type === 'warning' && 'text-warning',
                                req.type === 'info' && 'text-primary',
                                !req.type && 'text-muted-foreground'
                              )}
                            />
                            {req.label}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              {actions && actions.length > 0 && (
                <div className="p-4 rounded-lg border border-border/60 bg-card/50 animate-in fade-in slide-in-from-bottom-2 duration-300 delay-150">
                  <h4 className="text-sm font-semibold text-foreground mb-3">Acción</h4>
                  <ul className="space-y-2">
                    {actions.map((action, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-muted-foreground animate-in fade-in slide-in-from-left-2 duration-200"
                        style={{ animationDelay: `${200 + idx * 50}ms` }}
                      >
                        <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span dangerouslySetInnerHTML={{ __html: action }} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Code Example */}
              {codeExample && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 delay-200">
                  <pre className="bg-muted/50 border border-border/60 rounded-lg p-4 overflow-x-auto">
                    <code className="text-sm font-mono text-foreground">
                      {codeExample}
                    </code>
                  </pre>
                </div>
              )}

              {/* Highlight Box */}
              {highlight && (
                <div
                  className={cn(
                    'p-4 rounded-lg border animate-in fade-in zoom-in-95 duration-300 delay-300',
                    highlightColors[highlight.type]
                  )}
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle
                      className={cn(
                        'w-5 h-5 flex-shrink-0 mt-0.5',
                        highlightIconColors[highlight.type]
                      )}
                    />
                    <p className="text-sm text-foreground" dangerouslySetInnerHTML={{ __html: highlight.message }} />
                  </div>
                </div>
              )}

              {/* Custom children content */}
              {children && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 delay-300">
                  {children}
                </div>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
