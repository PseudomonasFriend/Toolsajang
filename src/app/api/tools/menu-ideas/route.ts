import { NextRequest, NextResponse } from 'next/server';
import { suggestMenuNames } from '@/lib/llm';
import type { MenuNameRequest } from '@/lib/llm';

const MAX_CATEGORY_LEN = 50;
const MAX_KEYWORDS_LEN = 100;
const MAX_TONE_LEN = 50;
const MIN_COUNT = 5;
const MAX_COUNT = 15;

function parseBody(body: unknown): MenuNameRequest | null {
  if (!body || typeof body !== 'object') return null;
  const o = body as Record<string, unknown>;
  const category = typeof o.category === 'string' ? o.category.trim() : '';
  const menuType = typeof o.menuType === 'string' ? o.menuType.trim() : '';
  const keywords = typeof o.keywords === 'string' ? o.keywords.trim() : undefined;
  const tone = typeof o.tone === 'string' ? o.tone.trim() : undefined;
  let count = typeof o.count === 'number' ? o.count : Number(o.count);
  if (Number.isNaN(count)) count = 8;
  count = Math.min(MAX_COUNT, Math.max(MIN_COUNT, Math.round(count)));

  if (!category || category.length > MAX_CATEGORY_LEN) return null;
  if (!menuType) return null;
  if (keywords && keywords.length > MAX_KEYWORDS_LEN) return null;
  if (tone && tone.length > MAX_TONE_LEN) return null;

  return { category, menuType, keywords, tone, count };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = parseBody(body);
    if (!parsed) {
      return NextResponse.json(
        { error: '잘못된 입력입니다. 업종과 메뉴 종류를 입력해 주세요.' },
        { status: 400 }
      );
    }

    const result = await suggestMenuNames(parsed);

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
    console.error('[menu-ideas]', e);
    return NextResponse.json(
      { error: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.', suggestions: [] },
      { status: 503 }
    );
  }
}
