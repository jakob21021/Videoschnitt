import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {STIL, FilmLook, Aufsteigen, ein, easeOut, easeInOut} from './stil';

// 1 Einheit = 2 Beats bei 100 BPM = 1,2 s = 36 Frames. Alle Schnitte liegen auf dem Beat.
const E = 36;
export const BERLIN_DAUER = 32 * E;

type Segment = {
  datei: string;
  start: number; // Einheiten
  dauer: number; // Einheiten
  foto?: 'reinzoomen' | 'runterfahren';
  ruhig?: boolean; // kein Schnitt-Punch (z. B. Gedenkort)
};

const SEGMENTE: Segment[] = [
  {datei: '01-intro.mp4', start: 0, dauer: 4},
  {datei: '02-tor.mp4', start: 4, dauer: 2},
  {datei: '03-denkmal.jpg', start: 6, dauer: 2, foto: 'reinzoomen', ruhig: true},
  {datei: '04-saeulen.mp4', start: 8, dauer: 2},
  {datei: '05-dom.mp4', start: 10, dauer: 2},
  {datei: '06-bikini.mp4', start: 12, dauer: 2},
  {datei: '07-kirche.mp4', start: 14, dauer: 2},
  {datei: '08-alex.mp4', start: 16, dauer: 4},
  {datei: '09-ubahn.jpg', start: 20, dauer: 2, foto: 'runterfahren', ruhig: true},
  {datei: '10-nacht1.mp4', start: 22, dauer: 2},
  {datei: '11-nacht2.mp4', start: 24, dauer: 2},
  {datei: '12-selfie.mp4', start: 26, dauer: 4},
];

type Ort = {start: number; dauer: number; nr: string; name: string[]; unter: string};
const ORTE: Ort[] = [
  {start: 4, dauer: 2, nr: '01', name: ['Brandenburger Tor'], unter: 'Mitte · 16:59'},
  {start: 6, dauer: 2, nr: '02', name: ['Denkmal für die', 'ermordeten Juden Europas'], unter: 'Mitte'},
  {start: 10, dauer: 2, nr: '03', name: ['Berliner Dom'], unter: 'Mitte · 20:59'},
  {start: 12, dauer: 4, nr: '04', name: ['Breitscheidplatz'], unter: 'Charlottenburg · 10:25'},
  {start: 16, dauer: 4, nr: '05', name: ['Alexanderplatz'], unter: 'Weltzeituhr · 14:47'},
  {start: 20, dauer: 2, nr: '06', name: ['U Museumsinsel'], unter: 'Linie U5'},
  {start: 22, dauer: 4, nr: '07', name: ['Berlin bei Nacht'], unter: '20:25'},
];

const TAGE = [
  {start: 4, dauer: 8, tag: 'TAG 1', datum: 'SONNTAG, 18.10.'},
  {start: 12, dauer: 8, tag: 'TAG 2', datum: 'MONTAG, 19.10.'},
  {start: 20, dauer: 10, tag: 'TAG 3', datum: 'DIENSTAG, 20.10.'},
];

const BLITZE = [4, 8, 22]; // Drops in der Musik

// ---------- Bild-Ebene ----------
const Clip: React.FC<{s: Segment}> = ({s}) => {
  const f = useCurrentFrame();
  const len = s.dauer * E;
  const punch = s.ruhig ? 1 : interpolate(f, [0, 10], [1.07, 1], {extrapolateRight: 'clamp', easing: easeOut});
  const drift = interpolate(f, [0, len], [1, 1.04]);

  if (s.foto) {
    const p = f / len;
    const scale = s.foto === 'reinzoomen' ? 1 + p * 0.08 : 1.05;
    const y = s.foto === 'runterfahren' ? interpolate(p, [0, 1], [0, -240], {easing: easeInOut}) : -240;
    return (
      <AbsoluteFill style={{overflow: 'hidden'}}>
        <Img
          src={staticFile(`berlin/${s.datei}`)}
          style={{
            position: 'absolute',
            width: 1350,
            height: 2400,
            left: -135,
            top: y,
            transform: `scale(${scale})`,
          }}
        />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{transform: `scale(${punch * drift})`}}>
      <OffthreadVideo src={staticFile(`berlin/${s.datei}`)} muted />
    </AbsoluteFill>
  );
};

// ---------- Grafik-Ebene ----------
const Titel: React.FC = () => {
  const f = useCurrentFrame();
  const raus = 1 - ein(f, 128, 16, easeInOut);
  const sperr = interpolate(f, [20, 140], [44, 20], {extrapolateRight: 'clamp', easing: easeOut});
  const linie = ein(f, 50, 30, easeInOut);
  return (
    <AbsoluteFill style={{opacity: raus}}>
      <AbsoluteFill
        style={{background: `linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.55) 100%)`}}
      />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <Aufsteigen start={18}>
          <div style={{color: STIL.text, fontSize: 180, fontWeight: 800, letterSpacing: sperr, marginRight: -sperr, textShadow: '0 6px 40px rgba(0,0,0,0.45)'}}>
            BERLIN
          </div>
        </Aufsteigen>
        <div style={{height: 4, width: 520 * linie, background: STIL.akzent, margin: '18px 0 30px'}} />
        <Aufsteigen start={58}>
          <div style={{color: STIL.text, fontSize: 40, fontWeight: 500, letterSpacing: 12, marginRight: -12}}>
            18.—20. OKTOBER 2026
          </div>
        </Aufsteigen>
        <Aufsteigen start={66} style={{marginTop: 14}}>
          <div style={{color: STIL.textGedimmt, fontSize: 30, letterSpacing: 6, fontVariantNumeric: 'tabular-nums'}}>
            52.5200° N · 13.4050° E
          </div>
        </Aufsteigen>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const OrtTag: React.FC<{o: Ort}> = ({o}) => {
  const f = useCurrentFrame();
  const len = o.dauer * E;
  const raus = 1 - ein(f, len - 10, 10, easeInOut);
  const linie = ein(f, 2, 18, easeInOut);
  return (
    <AbsoluteFill style={{opacity: raus}}>
      <AbsoluteFill
        style={{background: 'linear-gradient(0deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 40%)'}}
      />
      <div style={{position: 'absolute', left: 80, right: 160, bottom: 470}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 22, marginBottom: 16}}>
          <Aufsteigen start={4}>
            <div style={{color: STIL.akzent, fontSize: 34, fontWeight: 700, letterSpacing: 4}}>{o.nr}</div>
          </Aufsteigen>
          <div style={{height: 3, width: 90 * linie, background: STIL.akzent}} />
        </div>
        {o.name.map((z, i) => (
          <Aufsteigen key={i} start={7 + i * 4}>
            <div
              style={{
                color: STIL.text,
                fontSize: o.name.length > 1 ? 66 : 92,
                fontWeight: 700,
                letterSpacing: -2,
                lineHeight: 1.05,
              }}
            >
              {z}
            </div>
          </Aufsteigen>
        ))}
        <Aufsteigen start={14} style={{marginTop: 12}}>
          <div style={{color: 'rgba(242,239,232,0.75)', fontSize: 34, letterSpacing: 3, fontWeight: 500}}>
            {o.unter.toUpperCase()}
          </div>
        </Aufsteigen>
      </div>
    </AbsoluteFill>
  );
};

const TagLabel: React.FC<{tag: string; datum: string; dauer: number}> = ({tag, datum, dauer}) => {
  const f = useCurrentFrame();
  const raus = 1 - ein(f, dauer * E - 10, 10);
  const linie = ein(f, 0, 20, easeInOut);
  return (
    <div style={{position: 'absolute', top: 250, left: 80, opacity: raus, display: 'flex', alignItems: 'center', gap: 20}}>
      <div style={{width: 8, height: 64 * linie, background: STIL.akzent}} />
      <div>
        <Aufsteigen start={4}>
          <div style={{color: STIL.text, fontSize: 42, fontWeight: 800, letterSpacing: 8}}>{tag}</div>
        </Aufsteigen>
        <Aufsteigen start={8}>
          <div style={{color: 'rgba(242,239,232,0.8)', fontSize: 26, letterSpacing: 5, fontWeight: 500}}>{datum}</div>
        </Aufsteigen>
      </div>
    </div>
  );
};

const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const linie = ein(f, 10, 24, easeInOut);
  return (
    <AbsoluteFill style={{backgroundColor: STIL.hintergrund, justifyContent: 'center', alignItems: 'center'}}>
      <Aufsteigen start={4}>
        <div style={{color: STIL.text, fontSize: 150, fontWeight: 800, letterSpacing: 30, marginRight: -30}}>BERLIN</div>
      </Aufsteigen>
      <div style={{height: 4, width: 380 * linie, background: STIL.akzent, margin: '16px 0 26px'}} />
      <Aufsteigen start={16}>
        <div style={{color: 'rgba(242,239,232,0.8)', fontSize: 40, fontStyle: 'italic', fontWeight: 500}}>
          bis zum nächsten Mal.
        </div>
      </Aufsteigen>
    </AbsoluteFill>
  );
};

const Blitz: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 7], [0.55, 0], {extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{backgroundColor: '#fff6e0', opacity: o, mixBlendMode: 'screen'}} />;
};

export const Berlin: React.FC = () => {
  const f = useCurrentFrame();
  const musikVol = interpolate(f, [BERLIN_DAUER - 30, BERLIN_DAUER], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <FilmLook dauer={BERLIN_DAUER + 20}>
      {SEGMENTE.map((s) => (
        <Sequence key={s.datei} from={s.start * E} durationInFrames={s.dauer * E}>
          <Clip s={s} />
        </Sequence>
      ))}
      <Sequence from={0} durationInFrames={4 * E}>
        <Titel />
      </Sequence>
      {ORTE.map((o) => (
        <Sequence key={o.nr} from={o.start * E} durationInFrames={o.dauer * E}>
          <OrtTag o={o} />
        </Sequence>
      ))}
      {TAGE.map((t) => (
        <Sequence key={t.tag} from={t.start * E} durationInFrames={t.dauer * E}>
          <TagLabel {...t} />
        </Sequence>
      ))}
      {BLITZE.map((b) => (
        <Sequence key={b} from={b * E} durationInFrames={8}>
          <Blitz />
        </Sequence>
      ))}
      <Sequence from={30 * E} durationInFrames={2 * E}>
        <Outro />
      </Sequence>
      <Audio src={staticFile('berlin/musik.wav')} volume={musikVol} />
    </FilmLook>
  );
};
