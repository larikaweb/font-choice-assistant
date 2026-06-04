export type LlmProvider = "openai" | "ollama";

function readBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value.trim() === "") return fallback;
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

export const env = {
  llmProvider: (process.env.LLM_PROVIDER === "ollama" ? "ollama" : "openai") as LlmProvider,
  llmModel: process.env.LLM_MODEL || "gpt-4.1-mini",
  openaiApiKey: process.env.OPENAI_API_KEY || "",
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434/v1",
  ollamaModel: process.env.OLLAMA_MODEL || "qwen3:8b",
  ollamaApiKey: process.env.OLLAMA_API_KEY || "ollama",
  llmMockMode: readBoolean(process.env.LLM_MOCK_MODE, !process.env.OPENAI_API_KEY),
  googleFontsApiKey: process.env.GOOGLE_FONTS_API_KEY || "",
  defaultLanguage: process.env.DEFAULT_LANGUAGE || "ru",
};
