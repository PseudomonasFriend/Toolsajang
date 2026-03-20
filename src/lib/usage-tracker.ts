/**
 * AI API 비용 추적기
 *
 * gemini-2.0-flash-lite 가격 기준:
 *   입력: $0.075 / 1M 토큰
 *   출력: $0.30  / 1M 토큰
 *
 * 주간 한도: $5  (매주 월요일 00:00 UTC 리셋)
 * 월간 한도: $15 (매월 1일 00:00 UTC 리셋)
 *
 * ⚠️ Vercel 서버리스 환경에서는 콜드 스타트 시 상태가 초기화됩니다.
 *    정확한 제어가 필요하면 Upstash Redis(src/lib/rate-limit.ts 패턴)로 교체하세요.
 */

const INPUT_COST_PER_TOKEN = 0.075 / 1_000_000;   // $0.075 per 1M
const OUTPUT_COST_PER_TOKEN = 0.30 / 1_000_000;   // $0.30 per 1M

/** 기본 토큰 추정값 (usageMetadata 없을 때 fallback) */
const DEFAULT_INPUT_TOKENS = 300;
const DEFAULT_OUTPUT_TOKENS = 250;

/** 주간/월간 한도 (달러) */
const WEEKLY_LIMIT_USD =
  Number(process.env.AI_WEEKLY_LIMIT_USD ?? 5);
const MONTHLY_LIMIT_USD =
  Number(process.env.AI_MONTHLY_LIMIT_USD ?? 15);

interface UsageWindow {
  /** 현재 창 시작 시각 (Unix ms) */
  windowStart: number;
  /** 누적 추정 비용 (달러) */
  estimatedCostUsd: number;
  /** 총 호출 횟수 */
  callCount: number;
}

interface UsageState {
  weekly: UsageWindow;
  monthly: UsageWindow;
}

/** 이번 주 월요일 00:00 UTC의 타임스탬프 반환 */
function getWeekStart(now: number): number {
  const d = new Date(now);
  // getUTCDay(): 0=일, 1=월 ... 6=토
  const dayOfWeek = d.getUTCDay(); // 0(일) ~ 6(토)
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - daysSinceMonday)
  );
  return monday.getTime();
}

/** 이번 달 1일 00:00 UTC의 타임스탬프 반환 */
function getMonthStart(now: number): number {
  const d = new Date(now);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1);
}

/** 모듈 레벨 싱글턴 (Node.js 프로세스 생존 동안 유지) */
declare global {
  // eslint-disable-next-line no-var
  var __aiUsageState: UsageState | undefined;
}

function getState(): UsageState {
  const now = Date.now();
  const weekStart = getWeekStart(now);
  const monthStart = getMonthStart(now);

  if (!global.__aiUsageState) {
    global.__aiUsageState = {
      weekly: { windowStart: weekStart, estimatedCostUsd: 0, callCount: 0 },
      monthly: { windowStart: monthStart, estimatedCostUsd: 0, callCount: 0 },
    };
  }

  const state = global.__aiUsageState;

  // 창 갱신 (주간)
  if (state.weekly.windowStart < weekStart) {
    state.weekly = { windowStart: weekStart, estimatedCostUsd: 0, callCount: 0 };
  }

  // 창 갱신 (월간)
  if (state.monthly.windowStart < monthStart) {
    state.monthly = { windowStart: monthStart, estimatedCostUsd: 0, callCount: 0 };
  }

  return state;
}

/** 토큰 수로 추정 비용 계산 */
function estimateCost(inputTokens: number, outputTokens: number): number {
  return inputTokens * INPUT_COST_PER_TOKEN + outputTokens * OUTPUT_COST_PER_TOKEN;
}

export interface UsageCheckResult {
  allowed: boolean;
  /** 차단 이유 메시지 (한국어) */
  reason?: string;
}

/** 현재 사용량 스냅샷 (로깅·모니터링용) */
export interface UsageSnapshot {
  weekly: { costUsd: number; callCount: number; limitUsd: number };
  monthly: { costUsd: number; callCount: number; limitUsd: number };
}

/**
 * API 호출 전 한도 초과 여부 확인
 */
export function checkUsageLimit(): UsageCheckResult {
  const state = getState();

  if (state.weekly.estimatedCostUsd >= WEEKLY_LIMIT_USD) {
    return {
      allowed: false,
      reason: '잠시 후 다시 시도해주세요. 현재 사용량이 많습니다.',
    };
  }
  if (state.monthly.estimatedCostUsd >= MONTHLY_LIMIT_USD) {
    return {
      allowed: false,
      reason: '잠시 후 다시 시도해주세요. 현재 사용량이 많습니다.',
    };
  }

  return { allowed: true };
}

/**
 * 성공한 API 호출의 토큰 사용량 기록
 * @param inputTokens  - 입력 토큰 수 (없으면 기본값 사용)
 * @param outputTokens - 출력 토큰 수 (없으면 기본값 사용)
 */
export function recordUsage(
  inputTokens: number = DEFAULT_INPUT_TOKENS,
  outputTokens: number = DEFAULT_OUTPUT_TOKENS
): void {
  const cost = estimateCost(inputTokens, outputTokens);
  const state = getState();

  state.weekly.estimatedCostUsd += cost;
  state.weekly.callCount += 1;
  state.monthly.estimatedCostUsd += cost;
  state.monthly.callCount += 1;
}

/** 현재 사용량 스냅샷 반환 */
export function getUsageSnapshot(): UsageSnapshot {
  const state = getState();
  return {
    weekly: {
      costUsd: Math.round(state.weekly.estimatedCostUsd * 100_000) / 100_000,
      callCount: state.weekly.callCount,
      limitUsd: WEEKLY_LIMIT_USD,
    },
    monthly: {
      costUsd: Math.round(state.monthly.estimatedCostUsd * 100_000) / 100_000,
      callCount: state.monthly.callCount,
      limitUsd: MONTHLY_LIMIT_USD,
    },
  };
}
