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

## Realistische Erwartung
Komplett „auf Knopfdruck kinoreif“ gibt es nicht. Was den Doku-Stil ausmacht (Story, Timing, Sound), braucht deinen Geschmack. Die KI spart vor allem die Fleißarbeit.

## Nächste Schritte
- [ ] Ein Beispiel-Reel als Stilreferenz festlegen
- [ ] Testmaterial (Clips plus Thema) bereitstellen
- [ ] Entscheiden: Weg A, Weg B oder Kombination
