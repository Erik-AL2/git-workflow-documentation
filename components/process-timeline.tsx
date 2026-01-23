'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, Check, Circle } from 'lucide-react';

interface ProcessStep {
  number: number;
  title: string;
  subtitle: string;
  when?: string;
  requirements?: string[];
  actions?: string[];
  code?: string;
  note?: {
    type: 'success' | 'warning' | 'info';
    message: string;
  };
}

interface ProcessTimelineProps {
  steps: ProcessStep[];
}

export function ProcessTimeline({ steps }: ProcessTimelineProps) {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {steps.map((step, idx) => {
        const isExpanded = expandedStep === idx;

        return (
          <div key={idx}>
            <button
              onClick={() => setExpandedStep(isExpanded ? null : idx)}
              className="w-full group"
            >
              <div
                className={cn(
                  'flex items-start gap-4 p-4 rounded-lg',
                  'border bg-card',
                  'hover:border-primary/40 hover:bg-card/80',
                  'transition-all duration-200',
                  isExpanded && 'border-primary/40 bg-primary/5'
                )}
              >
                {/* Number Circle */}
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex-shrink-0',
                    'flex items-center justify-center',
                    'font-semibold text-sm',
                    'transition-all duration-200',
                    isExpanded
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground group-hover:bg-muted/80'
                  )}
                >
                  {step.number}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {step.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {step.subtitle}
                      </p>
                    </div>
                    <ChevronDown
                      className={cn(
                        'w-4 h-4 text-muted-foreground transition-transform duration-200 flex-shrink-0 mt-1',
                        isExpanded && 'rotate-180'
                      )}
                    />
                  </div>
                </div>
              </div>
            </button>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="mt-3 animate-in slide-in-from-top-2 fade-in duration-200">
                <div className="ml-14 p-4 rounded-lg border bg-muted/30 space-y-4">
                  {/* When & Requirements */}
                  {(step.when || step.requirements) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      {step.when && (
                        <div>
                          <div className="font-medium text-foreground mb-2">Cuándo</div>
                          <p className="text-muted-foreground">{step.when}</p>
                        </div>
                      )}
                      {step.requirements && step.requirements.length > 0 && (
                        <div>
                          <div className="font-medium text-foreground mb-2">Requisitos</div>
                          <ul className="space-y-1.5">
                            {step.requirements.map((req, i) => (
                              <li key={i} className="flex items-start gap-2 text-muted-foreground">
                                <Check className="w-3.5 h-3.5 text-success mt-0.5 flex-shrink-0" />
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  {step.actions && step.actions.length > 0 && (
                    <div className="text-sm">
                      <div className="font-medium text-foreground mb-2">Acciones</div>
                      <ul className="space-y-1.5">
                        {step.actions.map((action, i) => (
                          <li key={i} className="flex items-start gap-2 text-muted-foreground">
                            <Circle className="w-1.5 h-1.5 fill-primary text-primary mt-2 flex-shrink-0" />
                            <span dangerouslySetInnerHTML={{ __html: action }} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Code */}
                  {step.code && (
                    <div>
                      <pre className="bg-muted border border-border/40 rounded-md p-3 overflow-x-auto text-xs">
                        <code className="text-foreground font-mono">{step.code}</code>
                      </pre>
                    </div>
                  )}

                  {/* Note */}
                  {step.note && (
                    <div
                      className={cn(
                        'p-3 rounded-md text-sm',
                        step.note.type === 'success' && 'bg-success/10 text-success-foreground border border-success/20',
                        step.note.type === 'warning' && 'bg-warning/10 text-warning-foreground border border-warning/20',
                        step.note.type === 'info' && 'bg-primary/10 text-primary-foreground border border-primary/20'
                      )}
                    >
                      <div dangerouslySetInnerHTML={{ __html: step.note.message }} />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
