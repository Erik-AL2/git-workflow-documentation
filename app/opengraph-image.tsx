import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Squash Merge & Release Cycle — Git Workflow Documentation';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: '#000000',
          padding: '80px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glow effects */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            left: '-100px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,112,243,0.15), transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-150px',
            right: '-100px',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(168,85,247,0.1), transparent 70%)',
          }}
        />

        {/* Branch dots */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
          {[
            { name: 'main', color: '#ff0080' },
            { name: 'stg', color: '#fb923c' },
            { name: 'dev', color: '#0070f3' },
          ].map((b) => (
            <div key={b.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: b.color }} />
              <span style={{ fontSize: '16px', color: '#737373', fontFamily: 'monospace' }}>{b.name}</span>
            </div>
          ))}
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '64px',
            fontWeight: 700,
            color: '#f0f0f0',
            lineHeight: 1.1,
            marginBottom: '20px',
            letterSpacing: '-0.02em',
          }}
        >
          Squash Merge &
        </div>
        <div
          style={{
            fontSize: '64px',
            fontWeight: 700,
            color: '#f0f0f0',
            lineHeight: 1.1,
            marginBottom: '32px',
            letterSpacing: '-0.02em',
          }}
        >
          Release Cycle
        </div>

        {/* Subtitle */}
        <div style={{ fontSize: '22px', color: '#737373', maxWidth: '700px', lineHeight: 1.5 }}>
          Workflow basado en sprints con squash merges a main. Documentación interactiva con diagramas de git.
        </div>

        {/* Bottom label */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '80px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '14px', color: '#4a4a4a', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>
            Git Workflow Documentation
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
