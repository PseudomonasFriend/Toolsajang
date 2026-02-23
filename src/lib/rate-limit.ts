/**
 * IP 기반 In-memory Rate Limiter
 *
 * 서버리스(Vercel) 환경에서 외부 의존성 없이 동작.
 * 콜드 스타트 시 카운터 리셋되는 한계 있음 (허용).
 * 추후 Upstash Redis로 교체 시 RateLimiter 인터페이스만 구현하면 됨.
 */

/** Rate Limiter 인터페이스 (추후 Upstash 등으로 교체 가능) */
export interface RateLimiter {
  check(ip: string): RateLimitResult;
}

/** check() 반환 결과 */
export interface RateLimitResult {
  /** 요청 허용 여부 */
  allowed: boolean;
  /** 현재 시간 창에서 남은 요청 횟수 */
  remaining: number;
  /** 제한 초과 시 재시도 가능한 시각 (Unix ms) */
  resetAt: number;
}

/** In-memory Rate Limiter 설정 */
export interface RateLimiterConfig {
  /** 시간 창 (밀리초), 기본값: 60_000 (1분) */
  windowMs?: number;
  /** 시간 창 내 최대 요청 횟수, 기본값: 5 */
  maxRequests?: number;
}

/** IP별 요청 기록 엔트리 */
interface IpEntry {
  /** 현재 시간 창 시작 시각 (Unix ms) */
  windowStart: number;
  /** 현재 시간 창 내 요청 횟수 */
  count: number;
}

/**
 * In-memory Rate Limiter 생성
 *
 * @example
 * const limiter = createRateLimiter({ windowMs: 60_000, maxRequests: 5 });
 * const result = limiter.check(ip);
 * if (!result.allowed) { // 429 응답 }
 */
export function createRateLimiter(config: RateLimiterConfig = {}): RateLimiter {
  const windowMs = config.windowMs ?? 60_000;
  const maxRequests = config.maxRequests ?? 5;

  /** IP → 요청 기록 맵 */
  const store = new Map<string, IpEntry>();

  /** 만료된 엔트리 GC (윈도우 초과 항목 제거) */
  function gc(): void {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (now - entry.windowStart >= windowMs) {
        store.delete(key);
      }
    }
  }

  /** 일정 주기로 GC 실행 (메모리 누수 방지) */
  // 서버리스 환경에서는 인스턴스 수명이 짧으므로 GC 주기를 windowMs * 2로 설정
  if (typeof setInterval !== 'undefined') {
    setInterval(gc, windowMs * 2);
  }

  return {
    check(ip: string): RateLimitResult {
      const now = Date.now();
      const entry = store.get(ip);

      // 새 시간 창이거나 첫 요청
      if (!entry || now - entry.windowStart >= windowMs) {
        store.set(ip, { windowStart: now, count: 1 });
        return {
          allowed: true,
          remaining: maxRequests - 1,
          resetAt: now + windowMs,
        };
      }

      // 기존 시간 창 내 요청
      if (entry.count >= maxRequests) {
        return {
          allowed: false,
          remaining: 0,
          resetAt: entry.windowStart + windowMs,
        };
      }

      entry.count += 1;
      return {
        allowed: true,
        remaining: maxRequests - entry.count,
        resetAt: entry.windowStart + windowMs,
      };
    },
  };
}

/**
 * Next.js Request에서 클라이언트 IP 추출
 * Vercel 환경: x-forwarded-for 또는 x-real-ip 헤더 사용
 */
export function getClientIp(request: { headers: { get(name: string): string | null } }): string {
  // x-forwarded-for: 프록시 체인에서 가장 첫 번째 IP가 실제 클라이언트
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const firstIp = forwarded.split(',')[0].trim();
    if (firstIp) return firstIp;
  }

  // x-real-ip: Nginx/Vercel이 설정하는 실제 클라이언트 IP
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  // 로컬 개발 환경 fallback
  return '127.0.0.1';
}
