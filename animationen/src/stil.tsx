import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate, Easing} from 'remotion';

// Zentrale Stil-Definition: hier Farben/Schrift ändern, alle Animationen ziehen nach.
export const STIL = {
  hintergrund: '#0c0c0e',
  text: '#f2efe8',
  textGedimmt: 'rgba(242,239,232,0.55)',
  akzent: '#f5b82e',
  schrift: '"Inter Display", "Inter", sans-serif',
};

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

export const ein = (frame: number, start: number, dauer: number, ease = easeOut) =>
  interpolate(frame, [start, start + dauer], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });

// Film-Look: Korn + Vignette + sanftes Ein-/Ausblenden
export const FilmLook: React.FC<{dauer: number; children: React.ReactNode}> = ({dauer, children}) => {
  const frame = useCurrentFrame();
  const blende = Math.min(ein(frame, 0, 10), 1 - ein(frame, dauer - 10, 10));
  return (
    <AbsoluteFill style={{backgroundColor: STIL.hintergrund, fontFamily: STIL.schrift}}>
      <AbsoluteFill style={{opacity: blende}}>{children}</AbsoluteFill>
      <AbsoluteFill
        style={{background: 'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.75) 100%)'}}
      />
      <svg width="100%" height="100%" style={{position: 'absolute', opacity: 0.13, mixBlendMode: 'overlay'}}>
        <filter id="korn">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={frame % 24} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#korn)" />
      </svg>
    </AbsoluteFill>
  );
};

// Text, der aus einer Maske nach oben "herauswächst"
export const Aufsteigen: React.FC<{start: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
  start,
  children,
  style,
}) => {
  const p = ein(useCurrentFrame(), start, 22);
  return (
    <div style={{overflow: 'hidden', ...style}}>
      <div style={{transform: `translateY(${(1 - p) * 110}%)`}}>{children}</div>
    </div>
  );
};
