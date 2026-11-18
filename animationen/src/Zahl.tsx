import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {STIL, FilmLook, Aufsteigen, ein, easeInOut} from './stil';

export type ZahlProps = {zahl: number; oben: string; unten: string[]};

export const Zahl: React.FC<ZahlProps> = ({zahl, oben, unten}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const z = Math.round(ein(frame, 8, 45, easeInOut) * zahl);
  const puls = interpolate(frame, [53, 58, 68], [1, 1.06, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <FilmLook dauer={durationInFrames}>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
        <Aufsteigen start={2}>
          <div style={{color: STIL.textGedimmt, fontSize: 44, letterSpacing: 6, fontWeight: 500}}>{oben}</div>
        </Aufsteigen>
        <div
          style={{
            color: STIL.akzent,
            fontSize: 330,
            fontWeight: 800,
            letterSpacing: -12,
            fontVariantNumeric: 'tabular-nums',
            transform: `scale(${puls})`,
            margin: '10px 0',
          }}
        >
          {z.toLocaleString('de-DE')}
        </div>
        {unten.map((zeile, i) => (
          <Aufsteigen key={i} start={56 + i * 6}>
            <div style={{color: STIL.text, fontSize: 70, fontWeight: 700, letterSpacing: -1}}>{zeile}</div>
          </Aufsteigen>
        ))}
      </AbsoluteFill>
    </FilmLook>
  );
};
