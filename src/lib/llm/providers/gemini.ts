/**
 * Google Gemini API (REST)
 * @see https://ai.google.dev/gemini-api/docs
 */

const MODEL = 'gemini-2.0-flash-lite';
const BASE = 'https://generativelanguage.googleapis.com/v1beta';

export interface GeminiResult {
  text: string;
  /** 입력 토큰 수 (비용 추적용) */
  promptTokens?: number;
  /** 출력 토큰 수 (비용 추적용) */
  candidateTokens?: number;
}

export async function generateWithGemini(
  userPrompt: string,
  systemPrompt: string,
  apiKey: string,
  options: { maxTokens?: number; timeoutMs?: number } = {}
): Promise<GeminiResult> {
  const timeoutMs = options.timeoutMs ?? 15_000;
  const url = `${BASE}/models/${MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: {
          maxOutputTokens: options.maxTokens ?? 1024,
          temperature: 0.8,
        },
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Gemini API error ${res.status}: ${err}`);
    }

    interface GeminiRes {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      usageMetadata?: {
        promptTokenCount?: number;
        candidatesTokenCount?: number;
      };
    }
    const data = (await res.json()) as GeminiRes;

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';
    if (!text) throw new Error('Gemini returned empty response');
    return {
      text,
      promptTokens: data.usageMetadata?.promptTokenCount,
      candidateTokens: data.usageMetadata?.candidatesTokenCount,
    };
  } finally {
    clearTimeout(timeout);
  }
}
