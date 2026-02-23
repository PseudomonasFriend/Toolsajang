import { NextRequest, NextResponse } from 'next/server';
import { suggestShopNames } from '@/lib/llm';
import type { ShopNameRequest } from '@/lib/llm';
import { createRateLimiter, getClientIp } from '@/lib/rate-limit';

const MAX_BUSINESS_TYPE_LEN = 50;
const MAX_CONCEPT_LEN = 100;
const MAX_KEYWORDS_LEN = 100;
const MAX_TONE_LEN = 50;
const MIN_COUNT = 5;
const MAX_COUNT = 15;

/** IP당 분당 5회 제한 */
const rateLimiter = createRateLimiter({ windowMs: 60_000, maxRequests: 5 });

/** 요청 body 파싱 및 유효성 검사 */
function parseBody(body: unknown): ShopNameRequest | null {
  if (!body || typeof body !== 'object') return null;
  const o = body as Record<string, unknown>;

  const businessType = typeof o.businessType === 'string' ? o.businessType.trim() : '';
  const concept = typeof o.concept === 'string' ? o.concept.trim() : undefined;
  const keywords = typeof o.keywords === 'string' ? o.keywords.trim() : undefined;
  const tone = typeof o.tone === 'string' ? o.tone.trim() : undefined;
  let count = typeof o.count === 'number' ? o.count : Number(o.count);
  if (Number.isNaN(count)) count = 8;
  count = Math.min(MAX_COUNT, Math.max(MIN_COUNT, Math.round(count)));

  if (!businessType || businessType.length > MAX_BUSINESS_TYPE_LEN) return null;
  if (concept && concept.length > MAX_CONCEPT_LEN) return null;
  if (keywords && keywords.length > MAX_KEYWORDS_LEN) return null;
  if (tone && tone.length > MAX_TONE_LEN) return null;

  return {
    businessType,
    concept: concept || undefined,
    keywords: keywords || undefined,
    tone: tone || undefined,
    count,
  };
}

export async function POST(request: NextRequest) {
  // Rate Limiting 검사
  const ip = getClientIp(request);
  const rateResult = rateLimiter.check(ip);

  if (!rateResult.allowed) {
    const retryAfterSec = Math.ceil((rateResult.resetAt - Date.now()) / 1000);
    return NextResponse.json(
      { error: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfterSec),
          'X-RateLimit-Limit': '5',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(rateResult.resetAt / 1000)),
        },
      }
    );
  }

  try {
    const body = await request.json();
    const parsed = parseBody(body);

    if (!parsed) {
      return NextResponse.json(
        { error: '잘못된 입력입니다. 업종을 입력해 주세요.' },
        { status: 400 }
      );
    }

    const result = await suggestShopNames(parsed);

    if (result.error && result.suggestions.length === 0) {
      return NextResponse.json(
        { error: result.error, suggestions: [] },
        { status: 503 }
      );
    }

    return NextResponse.json({
      suggestions: result.suggestions,
      provider: result.provider,
    });
  } catch (e) {
    console.error('[shop-name-ideas]', e);
    return NextResponse.json(
      { error: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.', suggestions: [] },
      { status: 503 }
    );
  }
}
