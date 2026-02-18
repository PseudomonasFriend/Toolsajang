/** 숫자에 천단위 콤마 추가 */
export function formatNumber(value: number): string {
  return value.toLocaleString('ko-KR');
}

/** 통화 포맷 (원) */
export function formatCurrency(value: number): string {
  return `${formatNumber(value)}원`;
}

/** 퍼센트 포맷 */
export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

/** 문자열에서 콤마 제거 후 숫자로 변환 */
export function parseNumber(value: string): number {
  const cleaned = value.replace(/[^0-9.-]/g, '');
  const parsed = Number(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}
