import type { DeliveryFeeInput, PlatformResult, PlatformPreset } from './types';

/** 플랫폼 수수료 프리셋 (2025년 기준 참고값) */
export const PLATFORM_PRESETS: PlatformPreset[] = [
  {
    id: 'baemin',
    name: '배달의민족',
    commissionRate: 6.8,
    description: '단건 배달 기준',
  },
  {
    id: 'coupang',
    name: '쿠팡이츠',
    commissionRate: 9.8,
    description: '기본 수수료',
  },
  {
    id: 'yogiyo',
    name: '요기요',
    commissionRate: 12.5,
    description: '기본 수수료',
  },
];

/**
 * 단일 플랫폼에 대한 수수료 계산
 * @param input - 메뉴 판매가, 원가, 배달비, 추가비용
 * @param platformId - 플랫폼 식별자
 * @param platformName - 플랫폼 이름
 * @param commissionRate - 수수료율 (%)
 */
function calculateForPlatform(
  input: DeliveryFeeInput,
  platformId: string,
  platformName: string,
  commissionRate: number
): PlatformResult {
  const { menuPrice, menuCost, additionalCost } = input;

  // 수수료 금액 = round(메뉴판매가 x 수수료율 / 100)
  const commissionAmount = Math.round(menuPrice * commissionRate / 100);

  // 실수령액 = 메뉴판매가 - 수수료금액
  const netRevenue = menuPrice - commissionAmount;

  // 순이익 = 실수령액 - 원가 - 추가비용
  const netProfit = netRevenue - menuCost - additionalCost;

  // 순이익률 = 메뉴판매가 > 0 ? (순이익 / 메뉴판매가) x 100 : 0  (소수점 1자리)
  const profitRate =
    menuPrice > 0
      ? Math.round((netProfit / menuPrice) * 1000) / 10
      : 0;

  return {
    platformId,
    platformName,
    commissionRate,
    commissionAmount,
    netRevenue,
    netProfit,
    profitRate,
  };
}

/**
 * 배달앱 수수료 계산 함수
 * 프리셋 플랫폼(배민, 쿠팡이츠, 요기요) + 직접 입력에 대해 각각 계산한다.
 * @param input - 사용자 입력값
 * @param customRate - 직접 입력 수수료율 (%)
 * @returns 플랫폼별 계산 결과 배열
 */
export function calculateDeliveryFee(
  input: DeliveryFeeInput,
  customRate: number
): PlatformResult[] {
  const results: PlatformResult[] = PLATFORM_PRESETS.map((preset) =>
    calculateForPlatform(input, preset.id, preset.name, preset.commissionRate)
  );

  // 직접 입력 플랫폼 추가
  results.push(
    calculateForPlatform(input, 'custom', '직접 입력', customRate)
  );

  return results;
}

/**
 * 가장 유리한(순이익이 높은) 플랫폼의 인덱스를 반환
 * @param results - 플랫폼별 계산 결과 배열
 * @returns 가장 높은 순이익을 가진 플랫폼의 인덱스
 */
export function findBestPlatformIndex(results: PlatformResult[]): number {
  if (results.length === 0) return -1;

  let bestIndex = 0;
  for (let i = 1; i < results.length; i++) {
    if (results[i].netProfit > results[bestIndex].netProfit) {
      bestIndex = i;
    }
  }
  return bestIndex;
}
