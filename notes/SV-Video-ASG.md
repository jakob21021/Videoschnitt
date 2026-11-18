---
tags: [videoschnitt, sv, asg, instagram, skript]
erstellt: 2026-11-18
status: entwurf
---

# SV-Video ASG: „Was ist die SV und wie funktioniert sie?“

Format: Instagram-Reel, 9:16, ca. 60–75 s, Doku-Stil (dunkel, elegant, gelber Akzent, Film-Korn)
Verwandt: [[KI-Videoschnitt-Doku-Stil-Instagram]]

## Skript-Entwurf (Voiceover + Bild)
| Zeit | Voiceover | Bild / Animation |
|---|---|---|
| 0–3 s | „Jeden Tag werden an unserer Schule Entscheidungen getroffen. Aber wer redet da eigentlich für *uns*?“ | Schnelle Schnitte: Schulhof, Flur, Klassenraum, Klingel. **Hook** |
| 3–6 s | – | **Animation: Kapitel-Titel** „Was ist die SV?“ |
| 6–20 s | „Die SV, die Schülervertretung, ist die Stimme aller Schüler:innen. Sie bringt eure Ideen und Probleme dahin, wo entschieden wird.“ | B-Roll: SV-Sitzung, Hände heben, Notizen |
| 20–23 s | – | **Animation: Zahl** „850 Schüler:innen haben eine Stimme“ |
| 23–30 s | – | **Kapitel 2:** „Wie funktioniert sie?“ |
| 30–45 s | „In jeder Klasse wählt ihr Klassensprecher:innen. Alle zusammen bilden den Schülerrat. Und der wählt die Schülersprecher:innen.“ | **Animation: Struktur-Diagramm** |
| 45–60 s | „Was die SV konkret macht: [Projekte am ASG einsetzen, z. B. Events, Aktionen, Verbesserungen].“ | B-Roll von echten SV-Aktionen, Kurz-Statements |
| 60–70 s | „Du hast eine Idee? Sprich uns an. Die SV, das seid ihr alle.“ | SV-Team, Logo, Call-to-Action: Instagram-Account / SV-Raum |

## Noch zu klären (bitte prüfen)
- [ ] **Echte Schülerzahl** des ASG (850 ist ein Platzhalter)
- [ ] Wie heißt die Struktur am ASG genau? (Schülerrat / SV-Versammlung / Verbindungslehrer:innen / Schulkonferenz; hängt vom Bundesland und von der Schule ab)
- [ ] Konkrete Projekte und Erfolge der SV
- [ ] Wer spricht das Voiceover?
- [ ] SV-Logo und Farben → in `animationen/src/stil.tsx` übernehmen
- [ ] Einverständnis aller, die gefilmt werden (bei Minderjährigen: Eltern), und Genehmigung der Schulleitung für Aufnahmen auf dem Schulgelände

## Drehliste (B-Roll)
- Schulgebäude außen (Totale, am besten morgens oder im Gegenlicht)
- Flur mit Bewegung, Klingel, Schulhof in der Pause
- SV-Sitzung: Hände, Notizblöcke, Gesichter beim Diskutieren
- Wahl: Stimmzettel, Wahlurne
- SV-Aktionen (Events, Plakate, Stände)
- 2–3 kurze Statements: „Warum ich in der SV bin …“

## Animationen (Stand)
Gerendert mit Remotion in `animationen/`: KapitelTitel, Struktur, Zahl → `animationen/out/SV-Demo.mp4`
