# Visualizer CLI

The visualizer CLI tests the Google Fonts preview pipeline without running the full Next.js demo.

Run commands from the repository root after `npm install`.

## Local fixture mode

```bash
npm run fonts:preview -- \
  --heading "Lora" \
  --body "Manrope" \
  --lang ru \
  --metadata visualizer/fixtures/google-fonts-sample.json
```

## API mode

```bash
GOOGLE_FONTS_API_KEY=your_key_here npm run fonts:preview -- \
  --heading "Playfair Display" \
  --body "Source Sans 3" \
  --lang ru
```

## JSON output

```bash
npm run fonts:preview -- \
  --heading "Cormorant Garamond" \
  --body "Inter" \
  --lang ru \
  --metadata visualizer/fixtures/google-fonts-sample.json \
  --json
```
