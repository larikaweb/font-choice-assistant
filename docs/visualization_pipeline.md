# Visualization Pipeline

The visualization pipeline checks recommended fonts against Google Fonts metadata and renders a preview through the Google Fonts CSS2 API.

## Core flow

```text
recommended font system
-> match Google Fonts family names
-> inspect subsets, variants, category, axes
-> check Cyrillic support when language is Russian
-> resolve requested weights
-> build CSS2 URL
-> render heading/body/button/quote/label/caption samples
-> render Cyrillic check strings
-> show warnings
```

## CLI preview

Run from the repository root:

```bash
npm run fonts:preview -- --heading "Lora" --body "Manrope" --lang ru --metadata visualizer/fixtures/google-fonts-sample.json
```

With an API key:

```bash
GOOGLE_FONTS_API_KEY=your_key npm run fonts:preview -- --heading "Cormorant Garamond" --body "Inter" --lang ru
```

## Cyrillic check text

The Russian preview includes real words and difficult combinations:

```text
Образование
Консультация
Документы
Стоимость
Архитектура
Заявка
Психология
Программа
Ж Д У Щ Я ф
ст ск пр ия нт ция
```

## Boundaries

Google Fonts metadata can confirm technical availability and subset support. It cannot prove that the Cyrillic drawing is visually strong. The preview exists so a human can inspect the result.
