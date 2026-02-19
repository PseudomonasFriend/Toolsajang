/**
 * Groq API (OpenAI 호환)
 * @see https://console.groq.com/docs
 */

const BASE = 'https://api.groq.com/openai/v1';
const MODEL = 'llama-3.3-70b-versatile';

export interface GroqResult {
  text: string;
}

export async function generateWithGroq(
  userPrompt: string,
  systemPrompt: string,
  apiKey: string,
  options: { maxTokens?: number; timeoutMs?: number } = {}
): Promise<GroqResult> {
  const timeoutMs = options.timeoutMs ?? 15_000;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
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
      throw new Error(`Groq API error ${res.status}: ${err}`);
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = data.choices?.[0]?.message?.content?.trim() ?? '';
    if (!text) throw new Error('Groq returned empty response');
    return { text };
  } finally {
    clearTimeout(timeout);
  }
}
