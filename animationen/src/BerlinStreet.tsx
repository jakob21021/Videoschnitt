import React from 'react';
import '@fontsource/anton';
import {
  AbsoluteFill,
  Audio,
  Img,
  Loop,
  OffthreadVideo,
  Sequence,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {easeOut, easeInOut} from './stil';

// 150 BPM: 1 Beat = 12 Frames. Alles hängt am Beat-Raster der Musik (scripts/musik_street.py).
const B = 12;
export const STREET_DAUER = 64 * B + 18;
const ANTON = '"Anton", "Inter Display", sans-serif';

type Shot = {
  q: string; // Quelle in public/berlin/street
  ab?: number; // Startsekunde in der Quelle
  tempo?: number; // playbackRate
  beats: number;
  stutter?: boolean; // 4-Frame-Loop
  foto?: boolean;
};

const SHOTS: Shot[] = [
  // Intro: ein Buchstabe pro Beat
  {q: 'alex', ab: 1.0, beats: 1},
  {q: 'tor', ab: 1.4, beats: 1},
  {q: 'kirche', ab: 3.6, beats: 1},
  {q: 'dom', ab: 2.6, beats: 1},
  {q: 'nacht1', ab: 3.0, beats: 1},
  {q: 'selfie', ab: 2.4, beats: 1},
  {q: 'strasse', ab: 0, tempo: 2, beats: 2},
  // Drop 1 (Tag)
  {q: 'tor', ab: 0, tempo: 1.25, beats: 4},
  {q: 'strasse', ab: 2.4, tempo: 1.5, beats: 2},
  {q: 'bikini', ab: 0.6, tempo: 1.6, beats: 4},
  {q: 'kirche', ab: 1.8, tempo: 1.5, beats: 4},
  {q: 'alex', ab: 0, tempo: 1.5, beats: 4},
  {q: 'alex', ab: 3.0, tempo: 1.5, beats: 2},
  {q: 'tor', ab: 1.4, tempo: 1.4, beats: 2},
  {q: 'strasse', ab: 3.6, tempo: 1.5, beats: 2},
  {q: 'kirche', ab: 3.9, beats: 2, stutter: true},
  {q: 'bikini', ab: 0, beats: 2},
  {q: 'tor', ab: 2.0, beats: 1},
  {q: 'alex', ab: 1.2, beats: 1},
  {q: 'bikini', ab: 2.2, beats: 1},
  {q: 'kirche', ab: 3.9, beats: 1},
  // Breakdown (Übergang in die Nacht)
  {q: 'ubahn', foto: true, beats: 4},
  {q: 'saeulen', ab: 0, beats: 4},
  // Drop 2 (Nacht)
  {q: 'dom', ab: 1.4, beats: 4},
  {q: 'nacht1', ab: 1.9, tempo: 1.5, beats: 2},
  {q: 'nacht2', ab: 0.4, tempo: 1.5, beats: 2},
  {q: 'selfie', ab: 1.4, tempo: 1.2, beats: 6},
];

// Startbeats berechnen
const STARTS: number[] = [];
SHOTS.reduce((acc, s) => (STARTS.push(acc), acc + s.beats), 0);

// Kicks (in Beats) für Shake/Bump – identisch zur Musik
const KICKS: number[] = [0, 1, 2, 3, 4, 5];
for (const bar of [2, 3, 4, 5, 6, 7, 8, 9, 12, 13, 14, 15])
  for (const k of [0, 1.5, 2.75]) if (bar * 4 + k < 62) KICKS.push(bar * 4 + k);
KICKS.push(62);
const FLASHES: [number, number][] = [[0, 0.3], [1, 0.3], [2, 0.3], [3, 0.3], [4, 0.3], [5, 0.3], [8, 0.85], [48, 0.85], [62, 0.9]];

const letzter = (f: number, liste: number[]) => {
  let best = -1;
  for (const b of liste) if (b * B <= f) best = b;
  return best;
};

// ---------- ein Shot ----------
const ShotView: React.FC<{s: Shot; i: number}> = ({s, i}) => {
  const f = useCurrentFrame();
  const len = s.beats * B;
  const punch = interpolate(f, [0, 6], [1.16, 1], {extrapolateRight: 'clamp', easing: easeOut});
  const blur = interpolate(f, [0, 3], [10, 0], {extrapolateRight: 'clamp'});
  const richtung = i % 2 ? 1 : -1;
  const whip = interpolate(f, [0, 4], [60 * richtung, 0], {extrapolateRight: 'clamp', easing: easeOut});
  const style: React.CSSProperties = {
    transform: `translateY(${whip}px) scale(${punch})`,
    filter: `blur(${blur}px)`,
  };
  const src = staticFile(`berlin/street/${s.q}.${s.foto ? 'jpg' : 'mp4'}`);

  if (s.foto) {
    const y = interpolate(f, [0, len], [0, -300], {easing: easeInOut});
    const z = interpolate(f, [0, len], [1.15, 1.05]);
    return (
      <AbsoluteFill style={{...style, overflow: 'hidden'}}>
        <Img src={src} style={{position: 'absolute', width: 1350, height: 2400, left: -135, top: y, transform: `scale(${z})`}} />
      </AbsoluteFill>
    );
  }
  const startFrom = Math.round((s.ab ?? 0) * 30);
  const video = <OffthreadVideo src={src} muted startFrom={startFrom} playbackRate={s.tempo ?? 1} />;
  return (
    <AbsoluteFill style={style}>
      {s.stutter ? <Loop durationInFrames={4}>{video}</Loop> : video}
    </AbsoluteFill>
  );
};

// ---------- Typo ----------
const IntroWort: React.FC = () => {
  const f = useCurrentFrame();
  const beat = Math.floor(f / B);
  const wort = 'BERLIN'.slice(0, Math.min(6, beat + 1));
  const lokal = f - beat * B;
  const pop = beat < 6 ? interpolate(lokal, [0, 5], [1.25, 1], {extrapolateRight: 'clamp', easing: easeOut}) : 1;
  const voll = beat >= 6;
  const sperr = voll ? interpolate(f, [72, 96], [0, 24], {extrapolateRight: 'clamp', easing: easeOut}) : 0;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div
        style={{
          fontFamily: ANTON,
          fontSize: 300,
          lineHeight: 1,
          color: '#fff',
          letterSpacing: sperr,
          marginRight: -sperr,
          transform: `scale(${pop})`,
          textShadow: '0 10px 60px rgba(0,0,0,0.5)',
        }}
      >
        {wort}
      </div>
      {voll && (
        <div style={{fontFamily: ANTON, fontSize: 44, color: '#fff', letterSpacing: 18, marginRight: -18, opacity: 0.9}}>
          10 · 2026
        </div>
      )}
    </AbsoluteFill>
  );
};

const Ende: React.FC = () => {
  const f = useCurrentFrame();
  const pop = interpolate(f, [0, 6], [1.3, 1], {extrapolateRight: 'clamp', easing: easeOut});
  const raus = interpolate(f, [30, 42], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{backgroundColor: '#050505', justifyContent: 'center', alignItems: 'center', opacity: raus}}>
      <div
        style={{
          fontFamily: ANTON,
          fontSize: 330,
          color: 'transparent',
          WebkitTextStroke: '5px #fff',
          letterSpacing: 10,
          transform: `scale(${pop})`,
        }}
      >
        BERLIN
      </div>
    </AbsoluteFill>
  );
};

// ---------- Komposition ----------
export const BerlinStreet: React.FC = () => {
  const f = useCurrentFrame();

  // Bump + Shake auf jeder Kick
  const k = letzter(f, KICKS);
  const seit = k < 0 ? 99 : f - k * B;
  const staerke = Math.max(0, 1 - seit / 7);
  const bump = 1 + 0.045 * staerke * staerke;
  const sx = (random(`x${k}`) - 0.5) * 34 * staerke;
  const sy = (random(`y${k}`) - 0.5) * 34 * staerke;
  const rot = (random(`r${k}`) - 0.5) * 1.6 * staerke;

  const fl = FLASHES.filter(([b]) => b * B <= f).pop();
  const flash = fl ? fl[1] * Math.max(0, 1 - (f - fl[0] * B) / 5) : 0;

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <AbsoluteFill style={{transform: `translate(${sx}px, ${sy}px) rotate(${rot}deg) scale(${bump * 1.04})`}}>
        {SHOTS.map((s, i) => (
          <Sequence key={i} from={STARTS[i] * B} durationInFrames={s.beats * B}>
            <ShotView s={s} i={i} />
          </Sequence>
        ))}
      </AbsoluteFill>
      <Sequence from={0} durationInFrames={8 * B}>
        <IntroWort />
      </Sequence>
      <Sequence from={62 * B}>
        <Ende />
      </Sequence>
      {/* Look: Vignette + Korn + Flash */}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.7) 100%)'}} />
      <svg width="100%" height="100%" style={{position: 'absolute', opacity: 0.18, mixBlendMode: 'overlay'}}>
        <filter id="korn2">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={f % 30} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#korn2)" />
      </svg>
      <AbsoluteFill style={{backgroundColor: '#fff', opacity: flash}} />
      <Audio src={staticFile('berlin/street/musik.wav')} />
    </AbsoluteFill>
  );
};
