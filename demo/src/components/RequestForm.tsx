"use client";

import type { FormEvent } from "react";

export interface DemoFormState {
  userRequest: string;
  projectType: string;
  desiredImpression: string;
  language: "ru" | "en" | "auto";
  textRoles: string;
  platformOrFormat: string;
  constraints: string;
  showRagContext: boolean;
}

interface RequestFormProps {
  value: DemoFormState;
  loading: boolean;
  onChange: (next: DemoFormState) => void;
  onSubmit: () => void;
}

export const DEFAULT_FORM_STATE: DemoFormState = {
  userRequest:
    "Нужна пара шрифтов для лендинга психолога на русском: мягко, спокойно, доверительно, но не слишком декоративно.",
  projectType: "expert landing page",
  desiredImpression: "calm, warm, professional, readable",
  language: "ru",
  textRoles: "heading, body, button, quote, caption",
  platformOrFormat: "website / landing page",
  constraints: "Google Fonts only; Cyrillic required; avoid excessive decoration",
  showRagContext: true,
};

function update<K extends keyof DemoFormState>(
  value: DemoFormState,
  key: K,
  nextValue: DemoFormState[K],
): DemoFormState {
  return { ...value, [key]: nextValue };
}

export function RequestForm({ value, loading, onChange, onSubmit }: RequestFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form className="request-form" onSubmit={handleSubmit}>
      <label className="field field-full">
        <span>Project request</span>
        <textarea
          value={value.userRequest}
          onChange={(event) => onChange(update(value, "userRequest", event.target.value))}
          rows={7}
          placeholder="Describe the project, tone, language, and where the fonts will be used."
        />
      </label>

      <label className="field">
        <span>Project type</span>
        <input
          value={value.projectType}
          onChange={(event) => onChange(update(value, "projectType", event.target.value))}
        />
      </label>

      <label className="field">
        <span>Desired impression</span>
        <input
          value={value.desiredImpression}
          onChange={(event) => onChange(update(value, "desiredImpression", event.target.value))}
        />
      </label>

      <label className="field">
        <span>Language</span>
        <select
          value={value.language}
          onChange={(event) => onChange(update(value, "language", event.target.value as DemoFormState["language"]))}
        >
          <option value="ru">Russian / Cyrillic</option>
          <option value="en">English / Latin</option>
          <option value="auto">Auto</option>
        </select>
      </label>

      <label className="field">
        <span>Text roles</span>
        <input
          value={value.textRoles}
          onChange={(event) => onChange(update(value, "textRoles", event.target.value))}
        />
      </label>

      <label className="field">
        <span>Platform / format</span>
        <input
          value={value.platformOrFormat}
          onChange={(event) => onChange(update(value, "platformOrFormat", event.target.value))}
        />
      </label>

      <label className="field">
        <span>Constraints</span>
        <input
          value={value.constraints}
          onChange={(event) => onChange(update(value, "constraints", event.target.value))}
        />
      </label>

      <label className="checkbox-field field-full">
        <input
          type="checkbox"
          checked={value.showRagContext}
          onChange={(event) => onChange(update(value, "showRagContext", event.target.checked))}
        />
        <span>Show retrieved RAG context</span>
      </label>

      <button className="primary-button" type="submit" disabled={loading || !value.userRequest.trim()}>
        {loading ? "Generating..." : "Generate recommendation"}
      </button>
    </form>
  );
}
