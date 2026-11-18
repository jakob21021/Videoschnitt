---
tags: [videoschnitt, uebergabe]
erstellt: 2026-11-18
---

# Übergabe: Stand der ersten Cloud-Sitzung

Verwandt: [[KI-Videoschnitt-Doku-Stil-Instagram]], [[Berlin-Reel]], [[SV-Video-ASG]]

## Was bisher passiert ist
1. **Grundlagen:** Workflow für KI-Videoschnitt im Doku-Stil (Tools, Pipeline, Animationen) → `notes/KI-Videoschnitt-Doku-Stil-Instagram.md`
2. **SV-Video ASG:** Skript-Entwurf + Drehliste + 3 Demo-Animationen (Kapitel-Titel, Struktur-Diagramm, Zahlen-Zähler) → `notes/SV-Video-ASG.md`, Code `animationen/src/{KapitelTitel,Struktur,Zahl}.tsx`
   - offen: echte Schülerzahl (850 ist Platzhalter), echte SV-Struktur am ASG, Rohmaterial
3. **Berlin-Reel** (Städtetrip 18.–20.10.2026), drei Versionen:
   - v1 „Doku“ (38 s, Ortsmarken, Tages-Labels, ruhige Musik): Nutzer fand Texte zu viel und Tempo zu langsam
   - v2 „Street“ (26 s, 150 BPM, Phonk-Track, Shake/Punch/Flash): Nutzer fand das Ruckeln nicht gut
   - **v2.1 „Street“ ohne Shake/Whip/Stutter = aktueller Stand**, noch ohne Rückmeldung
   - Details: `notes/Berlin-Reel.md`; Code `animationen/src/BerlinStreet.tsx` (Shot-Liste oben), `animationen/scripts/musik_street.py`

## Berlin-Reel auf dem Mac neu aufbauen
```bash
cd animationen
npm install
scripts/berlin_street_prep.sh ../Rohdateien/Berlin   # Clips → public/berlin/street/
python3 scripts/musik_street.py public/berlin/street/roh.wav   # braucht numpy
ffmpeg -y -i public/berlin/street/roh.wav -af loudnorm=I=-12:TP=-1.2:LRA=9 -ar 44100 public/berlin/street/musik.wav
npx remotion render src/index.tsx BerlinStreet out/Berlin-Street.mp4
```
(v1: `scripts/berlin_prep.sh ../Rohdateien/Berlin`, Musik `scripts/musik.py` → `public/berlin/musik.wav`, Komposition `Berlin`)
Voraussetzungen auf dem Mac: Node.js, ffmpeg (`brew install ffmpeg`), Python 3 mit numpy (`pip3 install numpy`).
Rohdateien erwartet unter `Rohdateien/Berlin/` mit Originalnamen (IMG_5067.mov … IMG_5172.mov, IMG_5140.jpeg = Mahnmal, IMG_5162.jpeg = U-Bahn Museumsinsel, 4E63D808-….mov = Selfie).

## Offene Punkte
- [ ] Feedback zu Berlin v2.1 (Puls auf dem Bass behalten oder raus? Musik okay?)
- [ ] Ggf. echten Song / Instagram-Sound statt synthetischer Musik → BPM nennen, Schnitte neu ausrichten
- [ ] Ortsnamen der Nachtclips (IMG_5102, IMG_5171/5172) unbekannt
- [ ] Einverständnis der Personen im Selfie vor dem Posten
- [ ] Welcher Mac-Ordner ist der Arbeitsordner: „Videoschnitt“ oder „Videoschnitt 45er Stil“? Was bedeutet „45er Stil“?
- [ ] Pfad zum Obsidian-Vault klären → Notizen aus `notes/` dorthin übernehmen
