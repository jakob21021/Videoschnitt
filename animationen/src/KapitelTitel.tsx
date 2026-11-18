import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {STIL, FilmLook, Aufsteigen, ein, easeInOut} from './stil';

export type KapitelProps = {nummer: string; titel: string[]};

export const KapitelTitel: React.FC<KapitelProps> = ({nummer, titel}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const linie = ein(frame, 4, 26, easeInOut);
  const drift = interpolate(frame, [0, durationInFrames], [1.0, 1.06]); // langsamer Kamera-Push

  return (
    <FilmLook dauer={durationInFrames}>
      <AbsoluteFill style={{justifyContent: 'center', padding: '0 110px', transform: `scale(${drift})`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 28, marginBottom: 40}}>
          <div style={{height: 4, width: 140 * linie, background: STIL.akzent}} />
          <Aufsteigen start={10}>
            <div style={{color: STIL.akzent, fontSize: 40, fontWeight: 600, letterSpacing: 10}}>
              KAPITEL {nummer}
            </div>
          </Aufsteigen>
        </div>
        {titel.map((zeile, i) => (
          <Aufsteigen key={i} start={18 + i * 6}>
            <div style={{color: STIL.text, fontSize: 150, fontWeight: 700, lineHeight: 1.02, letterSpacing: -4}}>
              {zeile}
            </div>
          </Aufsteigen>
        ))}
      </AbsoluteFill>
    </FilmLook>
  );
};
