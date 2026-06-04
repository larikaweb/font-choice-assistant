import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { env } from "@/lib/config/env";

export async function generateRecommendationText(prompt: string): Promise<{ text: string; usedMock: boolean }> {
  if (env.llmMockMode) {
    return { text: mockRecommendationText(), usedMock: true };
  }

  const provider =
    env.llmProvider === "ollama"
      ? createOpenAI({
          baseURL: env.ollamaBaseUrl,
          apiKey: env.ollamaApiKey,
          name: "ollama",
        })
      : createOpenAI({
          apiKey: env.openaiApiKey,
          name: "openai",
        });

  const modelId = env.llmProvider === "ollama" ? env.ollamaModel : env.llmModel;

  const result = await generateText({
    model: provider(modelId),
    prompt,
  });

  return { text: result.text, usedMock: false };
}

export function mockRecommendationText(): string {
  return `## Project impression needed

The project should feel calm, clear, and professionally warm. The typography should support trust through readability and measured rhythm, not through decorative stereotypes.

## Base font direction

Use a modern human sans-serif as the base: open letterforms and balanced spacing make body text easier to scan and keep the interface from feeling cold.

## Base font recommendation

Use **Manrope** for body text, buttons, labels, and captions.

## Optional accent font

Use **Lora** for headings and short quotes only. It adds a softer editorial layer without taking over long reading.

## Why it works / what the fonts do visually

- **Lora**: soft serif rhythm and moderate contrast -> creates a calm authorial tone -> use it for headings and short quote accents.
- **Manrope**: clean geometric-humanist forms with open spacing -> keeps the page practical and easy to read -> use it for body text, navigation, buttons, and captions.

## What to check visually

For Russian text, check: Образование, Консультация, Документы, Стоимость, Архитектура, Заявка, Психология, Программа. Pay attention to Ж, Д, У, Щ, Я, ф and combinations ст, ск, пр, ия, нт, ция.

## What to avoid

Avoid adding a second decorative font, using very thin weights for body text, or claiming platform-specific support without checking metadata.

\`\`\`json
{
  "font_system": {
    "headingFont": "Lora",
    "bodyFont": "Manrope",
    "buttonFont": "Manrope",
    "captionFont": "Manrope",
    "quoteFont": "Lora",
    "labelFont": "Manrope",
    "language": "ru",
    "weights": {
      "heading": [600, 700],
      "body": [400, 500],
      "button": [600],
      "caption": [400],
      "quote": [400],
      "label": [500]
    },
    "roles": {
      "heading": "soft editorial heading accent",
      "body": "readable base text",
      "button": "clear action label",
      "quote": "short authorial accent"
    }
  }
}
\`\`\``;
}
