/**
 * OpenRouter API (다수 무료 모델)
 * @see https://openrouter.ai/docs
 */

const BASE = 'https://openrouter.ai/api/v1';
const MODEL = 'google/gemini-2.0-flash-exp:free';

export interface OpenRouterResult {
  text: string;
}

export async function generateWithOpenRouter(
  userPrompt: string,
  systemPrompt: string,
  apiKey: string,
  options: { maxTokens?: number; timeoutMs?: number } = {}
): Promise<OpenRouterResult> {
  const timeoutMs = options.timeoutMs ?? 15_000;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL ?? 'https://toolsajang.com',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: options.maxTokens ?? 1024,
        temperature: 0.8,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`OpenRouter API error ${res.status}: ${err}`);
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = data.choices?.[0]?.message?.content?.trim() ?? '';
    if (!text) throw new Error('OpenRouter returned empty response');
    return { text };
  } finally {
    clearTimeout(timeout);
  }
}
