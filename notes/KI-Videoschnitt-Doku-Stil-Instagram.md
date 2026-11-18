---
tags: [videoschnitt, ki, instagram, workflow]
erstellt: 2026-11-18
status: idee
---

# KI-Videoschnitt im Doku-/Film-Stil für Instagram

**Ziel:** Rohmaterial → KI schneidet und bearbeitet → kinoreifes, dokumentarisches Reel (9:16) im Stil hochwertiger YouTube-Dokus.

## Was diesen Stil ausmacht
- **Story vor Schnitt:** Hook → Konflikt/Frage → Aufbau → Auflösung. Das gilt auch für 60 Sekunden.
- **Voiceover als roter Faden**, B-Roll illustriert das Gesagte.
- **Look:** Color Grading (teal/orange oder entsättigt), Film Grain, eventuell Letterbox-Anmutung, ruhige Kamera.
- **Sound Design:** Atmo, Whooshes, Musik mit Spannungsbogen, Stille als Stilmittel.
- **Rhythmus:** Schnitte auf den Beat, Speed Ramps, J-/L-Cuts.
- **Typo:** schlichte, große Untertitel und Kapitel-Einblendungen.

## Instagram-Specs
- 1080×1920, 9:16, 30 fps (oder 24 fps für Film-Look), H.264, ca. 20 Mbit/s
- 30–90 s; **Hook in den ersten 1–2 Sekunden**
- Untertitel eingebrannt (viele schauen ohne Ton), Safe Zones beachten (unten ca. 20 % und rechts frei lassen)

## Weg A: Tools kombinieren (schnellster Start)
| Schritt | Tool | Was die KI macht |
|---|---|---|
| 1. Story/Skript | Claude | Aus Notizen oder Transkript ein Doku-Skript mit Hook bauen |
| 2. Voiceover | eigene Stimme oder ElevenLabs (Voice Clone der eigenen Stimme) | Sprechertext vertonen |
| 3. Rohschnitt | Descript / Premiere Pro (textbasierter Schnitt) / DaVinci Resolve (IntelliScript) | Schneiden über das Transkript, Füllwörter und Pausen entfernen |
| 4. Hochformat | Resolve Smart Reframe / Premiere Auto Reframe / CapCut | Querformat automatisch auf 9:16 zuschneiden |
| 5. Look | DaVinci Resolve (Color, Film-Look-LUTs, Grain) | Auto-Color plus LUT, danach von Hand nachjustieren |
| 6. Sound | Resolve Fairlight (Voice Isolation), Epidemic Sound / Artlist | Stimme säubern, Musik und SFX |
| 7. Untertitel | CapCut / Premiere / Resolve | automatische Untertitel |

## Weg B: Eigene Pipeline mit Claude Code (stärker automatisiert)
Ein Skript in diesem Repo, das:
1. alle Clips mit **Whisper** transkribiert und mit Zeitstempeln versieht,
2. von **Claude** eine Story auswählen lässt (welche Sätze, welche B-Roll, Reihenfolge) und daraus eine **Schnittliste (JSON/EDL)** erzeugt,
3. mit **ffmpeg** schneidet, auf 9:16 reframed, einen LUT und Grain anwendet, Musik unterlegt und den Ton normalisiert (−14 LUFS),
4. Untertitel (ASS) im gewünschten Stil einbrennt,
5. optional eine **EDL/XML für DaVinci Resolve** exportiert → Feinschliff von Hand.

→ Die KI liefert 80 % (Auswahl, Struktur, Rohschnitt, Technik), du gibst die letzten 20 % (Timing, Gefühl, Grading).

## Animationen & Motion Graphics
Typische Doku-Animationen:
- **Karten-Animationen:** Route oder Linie wandert über eine Karte, Zoom auf einen Ort (Google Earth-artig)
- **Kinetic Typography:** große Wörter oder Zahlen, die ins Bild fliegen, Kapitel-Titel
- **Callouts:** Kreise, Pfeile, Markierungen, die auf etwas im Bild zeigen
- **Fotos in 2.5D (Parallax):** Standbild wird in Ebenen zerlegt und bekommt so Tiefe
- **Zeitungs- und Archiv-Look:** Artikel oder Screenshots in 3D, Highlight auf einem Satz
- **Daten:** Zähler, Balken, Zeitstrahl
- **Übergänge:** Whip Pan, Zoom, Glitch, Film Burn
- **KI-generierte B-Roll:** Szenen, die man nicht filmen konnte (Veo, Runway, Kling, Sora; Bild-zu-Video)

Tools:
| Ansatz | Tools | Bewertung |
|---|---|---|
| Klassisch | After Effects (+ GEOlayers für Karten), DaVinci Fusion | maximale Kontrolle, aber Handarbeit |
| Templates | Canva, CapCut, Motion Array / Envato Templates | schnell, wirkt aber schnell generisch |
| **Code-Animationen (passt zu Weg B)** | **Remotion** (React → Video), Motion Canvas | Claude schreibt die Animationen selbst; Stil wiederverwendbar, voll automatisierbar |
| Generativ | Veo, Runway, Kling, Sora, Depth-Parallax-Tools | für B-Roll und Foto-Animation |

Idee für die Pipeline: Claude erzeugt aus dem Skript eine Liste von Animationen (z. B. „Sek. 4: Karte Berlin → Lissabon“, „Sek. 12: Zahl 3.000 km“). Remotion rendert diese als Overlays im eigenen Stil (Schrift, Farben). ffmpeg oder Resolve legt sie über den Schnitt.

## Videos direkt an Claude schicken
Wege, wie Rohmaterial in die Claude-Code-Session kommt:
1. **Google Drive (empfohlen):** Clips in einen Ordner laden, Ordnername nennen → Claude lädt sie herunter
2. **Rechner verbinden:** über Remote Control im Claude-Desktop-App einen Ordner freigeben → Claude arbeitet direkt mit den Dateien und speichert das fertige Video dort
3. **Im Chat anhängen:** geht für kurze Clips, große Dateien eher nicht
4. *Nicht* über GitHub: dort sind Dateien auf 100 MB begrenzt, und Videos gehören nicht ins Repo

Was Claude am Material macht: Transkript (Whisper), Standbilder in Abständen ansehen, Schnittliste vorschlagen, schneiden, 9:16, Look, Untertitel, Animationen, Export.
Grenzen: Claude sieht Einzelbilder und Text, nicht das laufende Video mit Gefühl → Feedback-Runden einplanen. Kein GPU → Rendern dauert etwas länger, für Reels kein Problem. Musik muss lizenziert sein (selbst mitbringen).

## Realistische Erwartung
Komplett „auf Knopfdruck kinoreif“ gibt es nicht. Was den Doku-Stil ausmacht (Story, Timing, Sound), braucht deinen Geschmack. Die KI spart vor allem die Fleißarbeit.

## Nächste Schritte
- [ ] Ein Beispiel-Reel als Stilreferenz festlegen
- [ ] Testmaterial (Clips plus Thema) bereitstellen
- [ ] Entscheiden: Weg A, Weg B oder Kombination
