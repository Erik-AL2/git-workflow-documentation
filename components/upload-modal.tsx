'use client';

import React from "react"
import { toast } from 'react-toastify'; // Import toast from react-toastify

import { useState, useRef } from 'react';
import { Upload, FileJson, FileText, CheckCircle, AlertCircle } from '@/components/icons';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Workflow } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  onUpload: (workflow: Workflow) => void;
}

export function UploadModal({ open, onClose, onUpload }: UploadModalProps) {
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<Workflow | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    setError(null);
    setFile(file);

    if (!file.name.endsWith('.json') && !file.name.endsWith('.md')) {
      setError('Only .json and .md files are supported');
      return;
    }

    try {
      const text = await file.text();
      
      if (file.name.endsWith('.json')) {
        const workflow = JSON.parse(text) as Workflow;
        validateWorkflow(workflow);
        setPreview(workflow);
      } else {
        // Simple markdown to workflow conversion
        const workflow = parseMarkdownWorkflow(text, file.name);
        setPreview(workflow);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
      setPreview(null);
    }
  };

  const validateWorkflow = (workflow: Workflow) => {
    if (!workflow.id || !workflow.title || !workflow.sections) {
      throw new Error('Invalid workflow structure: missing required fields');
    }
    
    if (!Array.isArray(workflow.sections) || workflow.sections.length === 0) {
      throw new Error('Workflow must have at least one section');
    }

    workflow.sections.forEach((section, index) => {
      if (!section.id || !section.title || !section.content) {
        throw new Error(`Invalid section at index ${index}: missing required fields`);
      }
    });
  };

  const parseMarkdownWorkflow = (markdown: string, filename: string): Workflow => {
    const id = filename.replace(/\.md$/, '').toLowerCase().replace(/\s+/g, '-');
    const lines = markdown.split('\n');
    
    let title = 'Untitled Workflow';
    let description = 'Imported from markdown';
    const sections: Workflow['sections'] = [];
    
    let currentSection: { id: string; title: string; content: string } | null = null;
    
    for (const line of lines) {
      if (line.startsWith('# ')) {
        title = line.replace('# ', '').trim();
      } else if (line.startsWith('## ')) {
        if (currentSection) {
          sections.push(currentSection);
        }
        const sectionTitle = line.replace('## ', '').trim();
        currentSection = {
          id: sectionTitle.toLowerCase().replace(/\s+/g, '-'),
          title: sectionTitle,
          content: line + '\n',
        };
      } else if (currentSection) {
        currentSection.content += line + '\n';
      }
    }
    
    if (currentSection) {
      sections.push(currentSection);
    }
    
    if (sections.length === 0) {
      sections.push({
        id: 'main',
        title: 'Main',
        content: markdown,
      });
    }

    return {
      id,
      title,
      description,
      sections,
      diagrams: [],
    };
  };

  const handleUpload = () => {
    if (preview) {
      onUpload(preview);
      toast({
        title: 'Success',
        description: 'Workflow uploaded successfully!',
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreview(null);
    setError(null);
    setDragActive(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl glass-morphism border border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            Upload Workflow
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Drag & Drop Zone */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-12 text-center vercel-transition ${
              dragActive
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-primary/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,.md"
              onChange={handleChange}
              className="hidden"
            />

            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-primary/10">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              
              <div>
                <p className="text-lg font-semibold text-foreground mb-1">
                  Drop your workflow file here
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports .json and .md files
                </p>
              </div>

              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="vercel-transition hover-glow"
              >
                Browse Files
              </Button>
            </div>
          </div>

          {/* File Info */}
          {file && (
            <div className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border">
              {file.name.endsWith('.json') ? (
                <FileJson className="w-5 h-5 text-primary" />
              ) : (
                <FileText className="w-5 h-5 text-primary" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
              {!error && preview && (
                <CheckCircle className="w-5 h-5 text-success" />
              )}
              {error && <AlertCircle className="w-5 h-5 text-error" />}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-error/10 border border-error rounded-lg">
              <p className="text-sm text-error">{error}</p>
            </div>
          )}

          {/* Preview */}
          {preview && !error && (
            <div className="p-4 bg-card rounded-lg border border-border space-y-2">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                Preview
              </h3>
              <div className="text-sm space-y-1">
                <p className="text-foreground">
                  <span className="text-muted-foreground">Title:</span> {preview.title}
                </p>
                <p className="text-foreground">
                  <span className="text-muted-foreground">Sections:</span>{' '}
                  {preview.sections.length}
                </p>
                <p className="text-foreground">
                  <span className="text-muted-foreground">Diagrams:</span>{' '}
                  {preview.diagrams?.length || 0}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Format Examples */}
        {!file && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">FORMAT EXAMPLES</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileJson className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">JSON Format</span>
                </div>
                <pre className="text-xs bg-card border border-border rounded-lg p-3 overflow-x-auto">
{`{
  "id": "my-workflow",
  "title": "My Workflow",
  "description": "Description",
  "sections": [{
    "id": "section-1",
    "title": "Section Title",
    "content": "# Content...",
    "diagramId": "diagram-1"
  }],
  "diagrams": [{
    "id": "diagram-1",
    "type": "git-tree",
    "nodes": [{
      "id": "node-1",
      "label": "Main",
      "x": 150,
      "y": 100
    }],
    "edges": []
  }]
}`}
                </pre>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">Markdown Format</span>
                </div>
                <pre className="text-xs bg-card border border-border rounded-lg p-3 overflow-x-auto">
{`# Workflow Title

## Section 1

Content for section 1...

## Section 2

Content for section 2...

## Section 3

More content here...`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!preview || !!error}
            className="bg-primary text-primary-foreground hover:bg-primary/90 vercel-transition"
          >
            Import Workflow
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
