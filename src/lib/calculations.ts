/**
 * 공용 계산 유틸리티
 * 툴별 계산 로직은 각 툴 폴더의 calculation.ts에 위치합니다.
 * 여기에는 여러 툴에서 공통으로 쓸 수 있는 계산 헬퍼만 둡니다.
 */

/** 소수점 N자리 반올림 */
export function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
