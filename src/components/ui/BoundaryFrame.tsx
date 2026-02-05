'use client'

import { COLORS } from '@/lib/constants'

export default function BoundaryFrame() {
  // CONFIGURATION VARIABLES
  const OFFSET = '15px';       // Distance from screen edge
  const BRACKET_SIZE = '32px'; // Length of the corner lines
  const CROSSHAIR_GAP = '50px'; // Distance of crosshair from the edge
  
  const BORDER_STYLE = `1px solid ${COLORS.textMuted}30`;
  const ACCENT_STYLE = `2px solid ${COLORS.textMuted}`;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 50,
      }}
    >
      {/* 1. MAIN BORDER FRAME */}
      <div
        style={{
          position: 'absolute',
          inset: OFFSET,
          border: BORDER_STYLE,
        }}
      />

      {/* 2. CORNER BRACKETS */}
      {/* Top Left */}
      <div style={{
        position: 'absolute',
        top: OFFSET,
        left: OFFSET,
        width: BRACKET_SIZE,
        height: BRACKET_SIZE,
        borderTop: ACCENT_STYLE,
        borderLeft: ACCENT_STYLE,
      }} />

      {/* Top Right */}
      <div style={{
        position: 'absolute',
        top: OFFSET,
        right: OFFSET,
        width: BRACKET_SIZE,
        height: BRACKET_SIZE,
        borderTop: ACCENT_STYLE,
        borderRight: ACCENT_STYLE,
      }} />

      {/* Bottom Left */}
      <div style={{
        position: 'absolute',
        bottom: OFFSET,
        left: OFFSET,
        width: BRACKET_SIZE,
        height: BRACKET_SIZE,
        borderBottom: ACCENT_STYLE,
        borderLeft: ACCENT_STYLE,
      }} />

      {/* Bottom Right */}
      <div style={{
        position: 'absolute',
        bottom: OFFSET,
        right: OFFSET,
        width: BRACKET_SIZE,
        height: BRACKET_SIZE,
        borderBottom: ACCENT_STYLE,
        borderRight: ACCENT_STYLE,
      }} />

      {/* 3. CENTER-LEFT CROSSHAIR */}
      <div
        style={{
          position: 'absolute',
          left: CROSSHAIR_GAP,
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div style={{ width: '1px', height: '20px', background: COLORS.textMuted }} />
        <div style={{
          width: '20px',
          height: '1px',
          background: COLORS.textMuted,
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '6px',
            height: '6px',
            border: `1px solid ${COLORS.textMuted}`,
          }} />
        </div>
        <div style={{ width: '1px', height: '20px', background: COLORS.textMuted }} />
      </div>
    </div>
  )
}
