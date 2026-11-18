# Videoschnitt mit Claude

Ziel: Videos mit KI schneiden und gestalten, vor allem Instagram-Reels (9:16) mit Motion Graphics, Color Grading und Musik.
Alles wird auf Deutsch kommuniziert.

## Vorlieben des Nutzers (unbedingt beachten)
- **Obsidian-Vault (Second Brain):** Vor jeder Antwort im Vault nach passenden Notizen suchen. Alles Erarbeitete (Skripte, Analysen, Ideen) als neue Notiz im passenden Ordner speichern, nicht nur im Chat lassen. Solange der Vault-Pfad unbekannt ist: nachfragen und bis dahin in `notes/` speichern.
- **Keine Wackel-Effekte:** kein Shake, keine Drehung, kein Whip-Ruck, kein Stotter-Loop. Weicher Zoom-Punch beim Schnitt ist okay.
- **Wenig Text im Bild:** keine Ortsmarken und Tages-Labels als Dauer-Einblendungen. Typografie nur kurz und groß (Intro/Ende).
- **Street-Style bevorzugt:** schnelle Schnitte auf den Beat, Speed Ramps, kontrastreicher, kühler Look.
- Gedenkorte (z. B. Holocaust-Mahnmal) nicht in Hype-Edits verwenden, sondern nachfragen.

## Ordner
- `Rohdateien/<Projekt>/`: Originalmaterial (nicht im Git)
- `Ergebnisse/<Projekt>/`: fertige Exporte `<Projekt>-v<Nr>-<Stil>.mp4` (nicht im Git)
- `Beispiele/`: Referenzen/Inspiration, Links in `Beispiele/links.md`
- `notes/`: Projekt-Notizen (Obsidian-Format) → später in den Vault übernehmen
- `animationen/`: Remotion-Projekt (React → Video) und ffmpeg-/Python-Skripte

## Werkzeuge / Pipeline
- **ffmpeg**: Trimmen, 1080×1920/30 fps, Color Grading (`animationen/scripts/*_prep.sh`)
- **Python + numpy**: Musik per Code synthetisieren, lizenzfrei (`animationen/scripts/musik*.py`), Loudness per `ffmpeg loudnorm`
- **Remotion 4** (`animationen/src/`): Schnitt, Animationen, Typo, Film-Korn; `npx remotion studio src/index.tsx` für die Vorschau
- Render: `npx remotion render src/index.tsx <Komposition> out/<datei>.mp4`, danach Instagram-Export:
  `ffmpeg -i in.mp4 -c:v libx264 -preset slow -b:v 14M -maxrate 18M -bufsize 28M -pix_fmt yuv420p -c:a aac -b:a 256k -movflags +faststart out.mp4`
- Prüfen ohne Zuschauen: Standbilder rendern (`remotion still`), Kontaktbögen per ffmpeg `tile`, Lautheit per `ebur128`

## Stand
Siehe `notes/Uebergabe.md` (aktueller Projektstand und nächste Schritte).
