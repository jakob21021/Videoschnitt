import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {STIL, FilmLook, ein, easeInOut} from './stil';

export type Stufe = {titel: string; unter: string};
export type StrukturProps = {ueberschrift: string; stufen: Stufe[]; verben: string[]};

const ABSTAND = 34; // Frames zwischen zwei Stufen

export const Struktur: React.FC<StrukturProps> = ({ueberschrift, stufen, verben}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const kopf = ein(frame, 0, 20);

  return (
    <FilmLook dauer={durationInFrames}>
      <AbsoluteFill style={{padding: '0 100px', flexDirection: 'column', justifyContent: 'center'}}>
        <div
          style={{
            color: STIL.akzent,
            fontSize: 38,
            fontWeight: 600,
            letterSpacing: 8,
            opacity: kopf,
            transform: `translateY(${(1 - kopf) * 20}px)`,
            marginBottom: 60,
          }}
        >
          {ueberschrift}
        </div>

        {stufen.map((s, i) => {
          const start = 14 + i * ABSTAND;
          const p = ein(frame, start, 20);
          const pfeil = ein(frame, start + 14, 18, easeInOut);
          const aktiv = frame >= start && (i === stufen.length - 1 || frame < start + ABSTAND);
          const letzte = i === stufen.length - 1;
          return (
            <div key={i}>
              <div
                style={{
                  opacity: p,
                  transform: `translateX(${(1 - p) * -60}px)`,
                  borderLeft: `6px solid ${aktiv ? STIL.akzent : 'rgba(242,239,232,0.25)'}`,
                  background: aktiv ? 'rgba(245,184,46,0.08)' : 'rgba(255,255,255,0.03)',
                  padding: '26px 36px',
                }}
              >
                <div style={{color: STIL.text, fontSize: 60, fontWeight: 700, letterSpacing: -1}}>{s.titel}</div>
                <div style={{color: STIL.textGedimmt, fontSize: 32, marginTop: 6}}>{s.unter}</div>
              </div>
              {!letzte && (
                <div style={{display: 'flex', alignItems: 'center', height: 110, paddingLeft: 30}}>
                  <svg width="40" height="110">
                    <line x1="20" y1="8" x2="20" y2={8 + 80 * pfeil} stroke={STIL.akzent} strokeWidth="4" />
                    <polygon
                      points="8,88 32,88 20,104"
                      fill={STIL.akzent}
                      opacity={interpolate(pfeil, [0.85, 1], [0, 1], {extrapolateLeft: 'clamp'})}
                    />
                  </svg>
                  <div
                    style={{
                      color: STIL.akzent,
                      fontSize: 34,
                      fontStyle: 'italic',
                      marginLeft: 20,
                      opacity: pfeil,
                    }}
                  >
                    {verben[i]}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </AbsoluteFill>
    </FilmLook>
  );
};
