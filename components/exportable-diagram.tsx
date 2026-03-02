'use client';

import { useRef, useCallback, useState } from 'react';
import { Download } from 'lucide-react';

interface ExportableDiagramProps {
  name: string;
  children: React.ReactNode;
}

export function ExportableDiagram({ name, children }: ExportableDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const getSvgElement = useCallback(() => {
    if (!containerRef.current) return null;
    return containerRef.current.querySelector('svg');
  }, []);

  const prepareSvg = useCallback((mode: 'svg' | 'png') => {
    const svg = getSvgElement();
    if (!svg) return null;

    const clone = svg.cloneNode(true) as SVGSVGElement;

    // Set explicit dimensions
    const viewBox = clone.getAttribute('viewBox');
    if (viewBox) {
      const [, , w, h] = viewBox.split(' ').map(Number);
      clone.setAttribute('width', String(w));
      clone.setAttribute('height', String(h));
    }

    if (mode === 'svg') {
      // SVG: dark background, light text
      const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      bg.setAttribute('width', '100%');
      bg.setAttribute('height', '100%');
      bg.setAttribute('fill', '#0a0a0a');
      bg.setAttribute('rx', '8');
      clone.insertBefore(bg, clone.firstChild);

      clone.querySelectorAll('[fill="currentColor"]').forEach((el) => {
        el.setAttribute('fill', '#f0f0f0');
      });
      clone.querySelectorAll('[fill="oklch(0.145 0 0)"]').forEach((el) => {
        el.setAttribute('fill', '#0a0a0a');
      });
      clone.querySelectorAll('[stroke="oklch(0.145 0 0)"]').forEach((el) => {
        el.setAttribute('stroke', '#0a0a0a');
      });
    } else {
      // PNG: transparent background, dark text
      clone.querySelectorAll('[fill="currentColor"]').forEach((el) => {
        el.setAttribute('fill', '#1a1a1a');
      });
      clone.querySelectorAll('[fill="oklch(0.145 0 0)"]').forEach((el) => {
        el.setAttribute('fill', '#ffffff');
      });
      clone.querySelectorAll('[stroke="oklch(0.145 0 0)"]').forEach((el) => {
        el.setAttribute('stroke', '#ffffff');
      });
    }

    // Inline font-family on text elements
    clone.querySelectorAll('text').forEach((el) => {
      el.style.fontFamily = 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace';
    });

    // Remove animate-pulse class (CSS animation won't work in export)
    clone.querySelectorAll('.animate-pulse').forEach((el) => {
      el.classList.remove('animate-pulse');
    });

    return clone;
  }, [getSvgElement]);

  const downloadSvg = useCallback(() => {
    const clone = prepareSvg('svg');
    if (!clone) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(clone);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }, [name, prepareSvg]);

  const downloadPng = useCallback(async () => {
    const clone = prepareSvg('png');
    if (!clone) return;

    setExporting(true);

    const scale = 2; // 2x for retina
    const viewBox = clone.getAttribute('viewBox');
    if (!viewBox) { setExporting(false); return; }
    const [, , w, h] = viewBox.split(' ').map(Number);

    const canvas = document.createElement('canvas');
    canvas.width = w * scale;
    canvas.height = h * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) { setExporting(false); return; }

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(clone);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);

      canvas.toBlob((blob) => {
        if (!blob) { setExporting(false); return; }
        const pngUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = pngUrl;
        a.download = `${name}.png`;
        a.click();
        URL.revokeObjectURL(pngUrl);
        setExporting(false);
      }, 'image/png');
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      setExporting(false);
    };
    img.src = url;
  }, [name, prepareSvg]);

  return (
    <div className="relative group" ref={containerRef}>
      {children}

      {/* Export buttons — visible on hover */}
      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={downloadSvg}
          disabled={exporting}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#737373',
          }}
        >
          <Download className="w-3 h-3" />
          SVG
        </button>
        <button
          onClick={downloadPng}
          disabled={exporting}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#737373',
          }}
        >
          <Download className="w-3 h-3" />
          PNG
        </button>
      </div>
    </div>
  );
}
