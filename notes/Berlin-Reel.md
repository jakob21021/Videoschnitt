---
tags: [videoschnitt, instagram, reel, berlin, projekt]
erstellt: 2026-11-18
status: v1 fertig
---

# Berlin-Reel (Städtetrip 18.–20.10.2026)

Erstes echtes Projekt der KI-Schnitt-Pipeline. Verwandt: [[KI-Videoschnitt-Doku-Stil-Instagram]]

## Ergebnis
- `animationen/out/Berlin-Reel_Instagram.mp4`: 38,4 s, 1080×1920, 30 fps, ca. 14 Mbit/s, −13 LUFS
- Liegt nur lokal in der Session, nicht im Repo (Größe, Privatsphäre)

## Aufbau (1 Einheit = 1,2 s = 2 Beats bei 100 BPM)
| Zeit | Bild | Grafik | Musik |
|---|---|---|---|
| 0–4,8 s | Kamerafahrt vom Boden nach oben (IMG_5067) | Titel BERLIN, Datum, Koordinaten | Pad + Riser |
| 4,8 s | Brandenburger Tor | TAG 1 · Ort 01 | Drop (Impact + Beat) |
| 7,2 s | Foto Denkmal für die ermordeten Juden Europas (entsättigt, langsamer Zoom, ohne Punch) | Ort 02 | Break, ruhig |
| 9,6 s | Säulen bei Nacht, Berliner Dom | Ort 03 | voller Beat |
| 14,4 s | Bikini Berlin → Gedächtniskirche | TAG 2 · Breitscheidplatz | |
| 19,2 s | Weltzeituhr | Alexanderplatz | + Arpeggio |
| 24 s | Foto U Museumsinsel (Sternendecke, Fahrt nach unten) | TAG 3 | Break + Riser |
| 26,4 s | Nachtstraßen mit Fernsehturm | Berlin bei Nacht | Drop |
| 31,2 s | Selfie mit Freunden | – | |
| 36 s | Endkarte „BERLIN – bis zum nächsten Mal.“ | | Impact, Ausklang |

## Technik
- `animationen/scripts/berlin_prep.sh`: Trimmen, 9:16, 30 fps, Color Grading per ffmpeg (Looks: TAG = warme Lichter/kühle Schatten, NACHT, DUNKEL = aufgehellt + entrauscht)
- `animationen/scripts/musik.py`: Soundtrack per Code synthetisiert (A-Moll, Am–F–C–G) → lizenzfrei
- `animationen/src/Berlin.tsx`: Schnitt, Ortsmarken, Tages-Labels, Blitze auf den Drops, Film-Korn, Vignette
- Aufnahmezeiten stammen aus den Metadaten der Clips

## Offen / Ideen für v2
- [ ] Ortsnamen für die Nachtclips prüfen (IMG_5102 Säulengebäude, IMG_5171/5172), aktuell nur „Berlin bei Nacht“
- [ ] Alternative: echten Song oder Instagram-Sound statt synthetischer Musik → Schnitte neu auf dessen BPM
- [ ] Selfie: sind alle mit dem Posten einverstanden?
