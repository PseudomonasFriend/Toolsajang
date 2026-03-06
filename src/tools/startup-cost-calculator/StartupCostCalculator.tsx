'use client';

import { useState, useCallback, useMemo } from 'react';
import { RotateCcw, Copy, Check } from 'lucide-react';
import { calculateStartupCost } from './calculation';
import { formatNumber, parseNumber } from '@/lib/format';
import type { StartupCostInput } from './types';

/** 입력 필드 정의 */
const FIELDS: { key: keyof Omit<StartupCostInput, 'contingencyRate'>; label: string; placeholder: string }[] = [
  { key: 'deposit', label: '보증금', placeholder: '5,000만원' },
  { key: 'premiumFee', label: '권리금', placeholder: '3,000만원' },
  { key: 'interiorCost', label: '인테리어 비용', placeholder: '2,000만원' },
  { key: 'equipmentCost', label: '설비/집기 비용', placeholder: '1,000만원' },
  { key: 'initialInventory', label: '초기 재고/식자재', placeholder: '300만원' },
  { key: 'signageCost', label: '간판/사인물', placeholder: '200만원' },
  { key: 'licenseFee', label: '사업자등록/인허가', placeholder: '50만원' },
  { key: 'miscCost', label: '기타 비용', placeholder: '100만원' },
];

/** 초기 입력값 */
const initialInput: StartupCostInput = {
  deposit: 0,
  premiumFee: 0,
  interiorCost: 0,
  equipmentCost: 0,
  initialInventory: 0,
  signageCost: 0,
  licenseFee: 0,
  miscCost: 0,
  contingencyRate: 10,
};

export default function StartupCostCalculator() {
  const [input, setInput] = useState<StartupCostInput>(initialInput);
  const [displays, setDisplays] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  /** 금액 입력 핸들러 */
  const handleChange = useCallback(
    (key: keyof StartupCostInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const num = parseNumber(e.target.value);
      setDisplays((prev) => ({
        ...prev,
        [key]: num > 0 ? formatNumber(num) : e.target.value.replace(/[^0-9]/g, ''),
      }));
      setInput((prev) => ({ ...prev, [key]: num }));
    },
    []
  );

  /** 예비비 비율 변경 */
  const handleRateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseNumber(e.target.value);
    setInput((prev) => ({ ...prev, contingencyRate: Math.min(num, 50) }));
  }, []);

  /** 초기화 */
  const handleReset = useCallback(() => {
    setInput(initialInput);
    setDisplays({});
    setCopied(false);
  }, []);

  /** 계산 결과 */
  const result = useMemo(() => {
    const hasInput = Object.entries(input).some(
      ([key, val]) => key !== 'contingencyRate' && val > 0
    );
    if (!hasInput) return null;
    return calculateStartupCost(input);
  }, [input]);

  /** 결과 복사 */
  const handleCopy = useCallback(async () => {
    if (!result) return;
    const lines = [
      '[ 창업비용 계산 결과 ]',
      ...result.items.map((item) => `${item.label}: ${formatNumber(item.amount)}원`),
      `───────────`,
      `소계: ${formatNumber(result.subtotal)}원`,
      `예비비(${input.contingencyRate}%): ${formatNumber(result.contingency)}원`,
      `총 창업비용: ${formatNumber(result.totalCost)}원`,
    ];
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* 클립보드 접근 불가 시 무시 */
    }
  }, [result, input.contingencyRate]);

  return (
    <div className="space-y-5">
      {/* 입력 영역 */}
      <div className="rounded-xl bg-white p-5 shadow-sm space-y-4">
        {FIELDS.map((field) => (
          <div key={field.key}>
            <label
              htmlFor={field.key}
              className="mb-1.5 block text-sm font-semibold text-gray-700"
            >
              {field.label}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₩</span>
              <input
                id={field.key}
                type="text"
                inputMode="numeric"
                placeholder={field.placeholder}
                value={displays[field.key] ?? ''}
                onChange={handleChange(field.key)}
                className="h-12 w-full rounded-lg border border-gray-200 pl-8 pr-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                aria-label={`${field.label} 입력`}
              />
            </div>
          </div>
        ))}

        {/* 예비비 비율 */}
        <div>
          <label
            htmlFor="contingencyRate"
            className="mb-1.5 block text-sm font-semibold text-gray-700"
          >
            예비비 비율
          </label>
          <div className="relative">
            <input
              id="contingencyRate"
              type="number"
              min={0}
              max={50}
              value={input.contingencyRate}
              onChange={handleRateChange}
              className="h-12 w-full rounded-lg border border-gray-200 px-3 pr-8 text-lg text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="예비비 비율 입력"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
          </div>
          <p className="mt-1 text-xs text-gray-400">창업 전문가 권장: 총 비용의 10~20%</p>
        </div>
      </div>

      {/* 초기화 버튼 */}
      <button
        type="button"
        onClick={handleReset}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50"
        aria-label="입력값 초기화"
      >
        <RotateCcw className="h-4 w-4" />
        초기화
      </button>

      {/* 결과 영역 */}
      {result && (
        <>
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-base font-bold text-gray-900">계산 결과</h2>

            <div className="space-y-2">
              {result.items.map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-medium text-gray-900">
                    ₩ {formatNumber(item.amount)}
                  </span>
                </div>
              ))}

              <hr className="border-gray-100" />

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">소계</span>
                <span className="font-medium text-gray-900">
                  ₩ {formatNumber(result.subtotal)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">예비비 ({input.contingencyRate}%)</span>
                <span className="font-medium text-amber-600">
                  + ₩ {formatNumber(result.contingency)}
                </span>
              </div>

              <hr className="border-gray-200" />

              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">총 창업비용</span>
                <span className="text-2xl font-bold text-blue-600">
                  ₩ {formatNumber(result.totalCost)}
                </span>
              </div>
            </div>

            {/* 비용 비중 분석 */}
            {result.topItems.length > 0 && (
              <div className="mt-4 rounded-lg bg-blue-50 p-3 border border-blue-100">
                <p className="text-sm font-medium text-blue-700">
                  가장 큰 비용: {result.topItems[0].label} ({Math.round((result.topItems[0].amount / result.subtotal) * 100)}%)
                </p>
              </div>
            )}

            {/* 결과 복사 */}
            <button
              type="button"
              onClick={handleCopy}
              className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700"
              aria-label="계산 결과 복사"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  복사 완료
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  결과 복사
                </>
              )}
            </button>
          </div>

          {/* 업종별 평균 창업비용 참고 */}
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-bold text-gray-900">업종별 평균 창업비용 참고</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>음식점 (30평 기준)</span>
                <span className="font-medium text-gray-900">8,000~15,000만원</span>
              </div>
              <div className="flex justify-between">
                <span>카페 (20평 기준)</span>
                <span className="font-medium text-gray-900">5,000~10,000만원</span>
              </div>
              <div className="flex justify-between">
                <span>편의점 (프랜차이즈)</span>
                <span className="font-medium text-gray-900">7,000~12,000만원</span>
              </div>
              <div className="flex justify-between">
                <span>미용실 (15평 기준)</span>
                <span className="font-medium text-gray-900">4,000~8,000만원</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-400">
              * 2025년 소상공인시장진흥공단 통계 참고. 지역·규모에 따라 차이가 큽니다.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
