# Animationen (Remotion)

Doku-Animationen im 9:16-Format, 1080×1920, 30 fps.

- `src/stil.tsx`: Farben, Schrift, Film-Look (Korn und Vignette). **Hier den Stil anpassen.**
- `src/KapitelTitel.tsx`, `src/Struktur.tsx`, `src/Zahl.tsx`: die Bausteine
- `src/index.tsx`: Kompositionen und Texte

```bash
npm install
npx remotion studio src/index.tsx          # Live-Vorschau im Browser
npx remotion render src/index.tsx Struktur out/Struktur.mp4
```
