import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {KapitelTitel} from './KapitelTitel';
import {Struktur} from './Struktur';
import {Zahl} from './Zahl';
import {Berlin, BERLIN_DAUER} from './Berlin';
import {BerlinStreet, STREET_DAUER} from './BerlinStreet';

const FORMAT = {width: 1080, height: 1920, fps: 30};

const Root: React.FC = () => (
  <>
    <Composition
      id="KapitelTitel"
      component={KapitelTitel}
      durationInFrames={105}
      {...FORMAT}
      defaultProps={{nummer: '1', titel: ['Was ist', 'die SV?']}}
    />
    <Composition
      id="Struktur"
      component={Struktur}
      durationInFrames={210}
      {...FORMAT}
      defaultProps={{
        ueberschrift: 'SO FUNKTIONIERT DIE SV',
        stufen: [
          {titel: 'Alle Schüler:innen', unter: 'jede Klasse, jede Stufe'},
          {titel: 'Klassensprecher:innen', unter: 'die Stimme eurer Klasse'},
          {titel: 'Schülerrat', unter: 'alle Klassensprecher:innen zusammen'},
          {titel: 'Schülersprecher:innen', unter: 'Gesicht der SV'},
        ],
        verben: ['wählen', 'bilden zusammen den', 'wählt'],
      }}
    />
    <Composition
      id="Zahl"
      component={Zahl}
      durationInFrames={120}
      {...FORMAT}
      defaultProps={{zahl: 850, oben: 'AM ASG HABEN', unten: ['Schüler:innen', 'eine Stimme.']}}
    />
    <Composition id="Berlin" component={Berlin} durationInFrames={BERLIN_DAUER} {...FORMAT} />
    <Composition id="BerlinStreet" component={BerlinStreet} durationInFrames={STREET_DAUER} {...FORMAT} />
  </>
);

registerRoot(Root);
