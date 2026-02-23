import type { MenuNameRequest, MenuNameResponse, ShopNameRequest, ShopNameResponse, ProviderId } from './types';
import type { SuggestOptions } from './types';
import { generateWithGemini } from './providers/gemini';
import { generateWithGroq } from './providers/groq';
import { generateWithOpenRouter } from './providers/openrouter';

const SYSTEM_PROMPT = `당신은 소상공인·자영업자를 위한 메뉴명 추천 전문가입니다.
다음 규칙을 반드시 지키세요.
- 반드시 한국어로만 응답합니다.
- 메뉴명만 한 줄에 하나씩 나열합니다. 번호, 불릿, 설명을 붙이지 마세요.
- 요청한 개수만큼만 제안합니다.
- 유명 상표·저작권에 해당할 수 있는 이름은 제안하지 마세요.
- 실제 사용 가능한 메뉴판 이름으로, 감성·톤에 맞게 짧고 기억하기 쉽게 작성합니다.`;

const SHOP_NAME_SYSTEM_PROMPT = `당신은 소상공인·자영업자를 위한 가게명 추천 전문가입니다.
다음 규칙을 반드시 지키세요.
- 반드시 한국어로만 응답합니다.
- 가게명만 한 줄에 하나씩 나열합니다. 번호, 불릿, 설명을 붙이지 마세요.
- 요청한 개수만큼만 제안합니다.
- 유명 상표·저작권에 해당할 수 있는 이름은 제안하지 마세요.
- 실제 사용 가능한 가게 상호명으로, 컨셉·톤에 맞게 짧고 기억하기 쉽게 작성합니다.
- 한국 상호명 등록이 가능한 형태로 제안합니다.`;

function buildUserPrompt(req: MenuNameRequest): string {
  const parts: string[] = [
    `업종: ${req.category}`,
    `메뉴 종류: ${req.menuType}`,
  ];
  if (req.keywords?.trim()) parts.push(`키워드: ${req.keywords.trim()}`);
  if (req.tone?.trim()) parts.push(`톤/분위기: ${req.tone.trim()}`);
  parts.push(`정확히 ${req.count}개의 메뉴명만 한 줄에 하나씩 제안해 주세요.`);
  return parts.join('\n');
}

/** LLM 응답 텍스트에서 메뉴명 리스트 추출 (한 줄당 하나) */
function parseSuggestions(text: string, maxCount: number): string[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.replace(/^[\d\.\-\*\)\]]+\s*/, '').trim())
    .filter((line) => line.length > 0 && line.length <= 50);
  const unique = Array.from(new Set(lines));
  return unique.slice(0, maxCount);
}

const DEFAULT_OPTIONS: SuggestOptions = {
  maxTokens: 1024,
  timeoutMs: 15_000,
};

/**
 * 메뉴명 추천 — Gemini → Groq → OpenRouter 순차 폴백
 */
export async function suggestMenuNames(
  req: MenuNameRequest,
  options: SuggestOptions = {}
): Promise<MenuNameResponse> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const userPrompt = buildUserPrompt(req);
  const count = Math.min(15, Math.max(5, req.count));

  const providers: Array<{ id: ProviderId; fn: () => Promise<{ text: string }> }> = [];

  if (process.env.GEMINI_API_KEY) {
    providers.push({
      id: 'gemini',
      fn: () =>
        generateWithGemini(
          userPrompt,
          SYSTEM_PROMPT,
          process.env.GEMINI_API_KEY!,
          opts
        ),
    });
  }
  if (process.env.GROQ_API_KEY) {
    providers.push({
      id: 'groq',
      fn: () =>
        generateWithGroq(
          userPrompt,
          SYSTEM_PROMPT,
          process.env.GROQ_API_KEY!,
          opts
        ),
    });
  }
  if (process.env.OPENROUTER_API_KEY) {
    providers.push({
      id: 'openrouter',
      fn: () =>
        generateWithOpenRouter(
          userPrompt,
          SYSTEM_PROMPT,
          process.env.OPENROUTER_API_KEY!,
          opts
        ),
    });
  }

  if (providers.length === 0) {
    return {
      suggestions: [],
      error: '설정된 AI API가 없습니다. 관리자에게 문의하세요.',
    };
  }

  let lastError: Error | null = null;
  for (const { id, fn } of providers) {
    try {
      const { text } = await fn();
      const suggestions = parseSuggestions(text, count);
      if (suggestions.length > 0) {
        return { suggestions, provider: id };
      }
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e));
    }
  }

  return {
    suggestions: [],
    provider: undefined,
    error: lastError?.message ?? '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
  };
}

/** 가게명 추천 프롬프트 빌드 */
function buildShopNameUserPrompt(req: ShopNameRequest): string {
  const parts: string[] = [`업종: ${req.businessType}`];
  if (req.concept?.trim()) parts.push(`컨셉/분위기: ${req.concept.trim()}`);
  if (req.keywords?.trim()) parts.push(`키워드: ${req.keywords.trim()}`);
  if (req.tone?.trim()) parts.push(`톤/분위기: ${req.tone.trim()}`);
  parts.push(`정확히 ${req.count}개의 가게명만 한 줄에 하나씩 제안해 주세요.`);
  return parts.join('\n');
}

/**
 * 가게명 추천 — Gemini → Groq → OpenRouter 순차 폴백
 */
export async function suggestShopNames(
  req: ShopNameRequest,
  options: SuggestOptions = {}
): Promise<ShopNameResponse> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const userPrompt = buildShopNameUserPrompt(req);
  const count = Math.min(15, Math.max(5, req.count));

  const providers: Array<{ id: ProviderId; fn: () => Promise<{ text: string }> }> = [];

  if (process.env.GEMINI_API_KEY) {
    providers.push({
      id: 'gemini',
      fn: () =>
        generateWithGemini(
          userPrompt,
          SHOP_NAME_SYSTEM_PROMPT,
          process.env.GEMINI_API_KEY!,
          opts
        ),
    });
  }
  if (process.env.GROQ_API_KEY) {
    providers.push({
      id: 'groq',
      fn: () =>
        generateWithGroq(
          userPrompt,
          SHOP_NAME_SYSTEM_PROMPT,
          process.env.GROQ_API_KEY!,
          opts
        ),
    });
  }
  if (process.env.OPENROUTER_API_KEY) {
    providers.push({
      id: 'openrouter',
      fn: () =>
        generateWithOpenRouter(
          userPrompt,
          SHOP_NAME_SYSTEM_PROMPT,
          process.env.OPENROUTER_API_KEY!,
          opts
        ),
    });
  }

  if (providers.length === 0) {
    return {
      suggestions: [],
      error: '설정된 AI API가 없습니다. 관리자에게 문의하세요.',
    };
  }

  let lastError: Error | null = null;
  for (const { id, fn } of providers) {
    try {
      const { text } = await fn();
      const suggestions = parseSuggestions(text, count);
      if (suggestions.length > 0) {
        return { suggestions, provider: id };
      }
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e));
    }
  }

  return {
    suggestions: [],
    provider: undefined,
    error: lastError?.message ?? '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
  };
}

export type { MenuNameRequest, MenuNameResponse, ShopNameRequest, ShopNameResponse, ProviderId, SuggestOptions } from './types';
