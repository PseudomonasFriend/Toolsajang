'use client';

import { useState, useCallback, useMemo } from 'react';
import { RotateCcw, Copy, Check } from 'lucide-react';
import { calculateDeliveryProfit, DEFAULT_COMMISSION_RATES, DELIVERY_APP_NAMES } from './calculation';
import { formatNumber, parseNumber } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { DeliveryProfitInput, DeliveryProfitResult, DeliveryApp } from './types';

/** 진단 색상 맵 */
const diagnosisColors: Record<DeliveryProfitResult['diagnosisLevel'], string> = {
  good: 'bg-green-50 text-green-700 border border-green-200',
  warning: 'bg-amber-50 text-amber-700 border border-amber-200',
  danger: 'bg-red-50 text-red-700 border border-red-200',
};

/** 배달앱 옵션 */
const DELIVERY_APP_OPTIONS: { value: DeliveryApp; label: string; rate: number }[] = [
  { value: 'baemin', label: '배달의민족', rate: DEFAULT_COMMISSION_RATES.baemin },
  { value: 'yogiyo', label: '요기요', rate: DEFAULT_COMMISSION_RATES.yogiyo },
  { value: 'coupangeats', label: '쿠팡이츠', rate: DEFAULT_COMMISSION_RATES.coupangeats },
];

/** 초기 입력값 */
const initialInput: DeliveryProfitInput = {
  orderAmount: 0,
  deliveryApp: 'baemin',
  commissionRate: DEFAULT_COMMISSION_RATES.baemin,
  deliveryFee: 0,
  costRate: 35,
};

/** 표시값 타입 */
interface DisplayValues {
  orderAmount: string;
  commissionRate: string;
  deliveryFee: string;
  costRate: string;
}

const initialDisplay: DisplayValues = {
  orderAmount: '',
  commissionRate: String(DEFAULT_COMMISSION_RATES.baemin),
  deliveryFee: '',
  costRate: '35',
};

export default function DeliveryProfitCalculator() {
  const [input, setInput] = useState<DeliveryProfitInput>(initialInput);
  const [displayValues, setDisplayValues] = useState<DisplayValues>(initialDisplay);
  const [copied, setCopied] = useState(false);

  /** 주문금액 입력 */
  const handleOrderAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const num = parseNumber(e.target.value);
      setDisplayValues((prev) => ({
        ...prev,
        orderAmount: num > 0 ? formatNumber(num) : e.target.value.replace(/[^0-9]/g, ''),
      }));
      setInput((prev) => ({ ...prev, orderAmount: num }));
    },
    []
  );

  /** 배달앱 선택 */
  const handleAppChange = useCallback((app: DeliveryApp) => {
    const rate = DEFAULT_COMMISSION_RATES[app];
    setInput((prev) => ({ ...prev, deliveryApp: app, commissionRate: rate }));
    setDisplayValues((prev) => ({ ...prev, commissionRate: String(rate) }));
  }, []);

  /** 수수료율 직접 입력 */
  const handleCommissionRateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9.]/g, '');
      setDisplayValues((prev) => ({ ...prev, commissionRate: raw }));
      setInput((prev) => ({ ...prev, commissionRate: parseFloat(raw) || 0 }));
    },
    []
  );

  /** 배달비 부담금 입력 */
  const handleDeliveryFeeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const num = parseNumber(e.target.value);
      setDisplayValues((prev) => ({
        ...prev,
        deliveryFee: num > 0 ? formatNumber(num) : e.target.value.replace(/[^0-9]/g, ''),
      }));
      setInput((prev) => ({ ...prev, deliveryFee: num }));
    },
    []
  );

  /** 원가율 입력 */
  const handleCostRateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9.]/g, '');
      setDisplayValues((prev) => ({ ...prev, costRate: raw }));
      setInput((prev) => ({ ...prev, costRate: parseFloat(raw) || 0 }));
    },
    []
  );

  /** 초기화 */
  const handleReset = useCallback(() => {
    setInput(initialInput);
    setDisplayValues(initialDisplay);
    setCopied(false);
  }, []);

  /** 실시간 계산 결과 */
  const result = useMemo(() => {
    if (input.orderAmount <= 0) return null;
    return calculateDeliveryProfit(input);
  }, [input]);

  /** 결과 복사 */
  const handleCopy = useCallback(async () => {
    if (!result) return;
    const lines = [
      `주문금액: ${formatNumber(input.orderAmount)}원`,
      `배달앱: ${DELIVERY_APP_NAMES[input.deliveryApp]}`,
      `앱 수수료(${input.commissionRate}%): -${formatNumber(result.appCommission)}원`,
      `결제 수수료(3.3%): -${formatNumber(result.paymentFee)}원`,
      `원가(${input.costRate}%): -${formatNumber(result.costAmount)}원`,
      input.deliveryFee > 0 ? `배달비 부담: -${formatNumber(result.deliveryFee)}원` : '',
      `순이익: ${formatNumber(result.netProfit)}원 (${result.netProfitRate}%)`,
    ]
      .filter(Boolean)
      .join('\n');

    try {
      await navigator.clipboard.writeText(lines);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* 클립보드 접근 불가 시 무시 */
    }
  }, [result, input]);

  const isLoss = result !== null && result.netProfit < 0;

  return (
    <div className="space-y-5">
      {/* 입력 영역 */}
      <div className="rounded-xl bg-white p-5 shadow-sm space-y-4">
        {/* 주문금액 */}
        <div>
          <label
            htmlFor="orderAmount"
            className="mb-1.5 block text-sm font-semibold text-gray-700"
          >
            주문금액 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₩</span>
            <input
              id="orderAmount"
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={displayValues.orderAmount}
              onChange={handleOrderAmountChange}
              className="h-12 w-full rounded-lg border border-gray-200 pl-8 pr-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="주문금액 입력"
            />
          </div>
        </div>

        {/* 배달앱 선택 */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">
            배달앱
          </label>
          <div className="flex flex-wrap gap-2">
            {DELIVERY_APP_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleAppChange(opt.value)}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  input.deliveryApp === opt.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
                aria-label={`${opt.label} 선택`}
              >
                {opt.label} ({opt.rate}%)
              </button>
            ))}
          </div>
        </div>

        {/* 수수료율 (수정 가능) */}
        <div>
          <label
            htmlFor="commissionRate"
            className="mb-1.5 block text-sm font-semibold text-gray-700"
          >
            수수료율
          </label>
          <div className="relative">
            <input
              id="commissionRate"
              type="text"
              inputMode="decimal"
              placeholder="6.8"
              value={displayValues.commissionRate}
              onChange={handleCommissionRateChange}
              className="h-12 w-full rounded-lg border border-gray-200 pl-3 pr-8 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="수수료율 입력"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
          </div>
        </div>

        {/* 배달비 부담금 */}
        <div>
          <label
            htmlFor="deliveryFee"
            className="mb-1.5 block text-sm font-semibold text-gray-700"
          >
            배달비 사장님 부담금
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₩</span>
            <input
              id="deliveryFee"
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={displayValues.deliveryFee}
              onChange={handleDeliveryFeeChange}
              className="h-12 w-full rounded-lg border border-gray-200 pl-8 pr-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="배달비 사장님 부담금 입력"
            />
          </div>
        </div>

        {/* 원가율 */}
        <div>
          <label
            htmlFor="costRate"
            className="mb-1.5 block text-sm font-semibold text-gray-700"
          >
            원가율
          </label>
          <div className="relative">
            <input
              id="costRate"
              type="text"
              inputMode="decimal"
              placeholder="35"
              value={displayValues.costRate}
              onChange={handleCostRateChange}
              className="h-12 w-full rounded-lg border border-gray-200 pl-3 pr-8 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="원가율 입력"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
          </div>
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

            <div className="space-y-3">
              {/* 순이익 */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">순이익</span>
                <span
                  className={cn(
                    'text-2xl font-bold',
                    isLoss ? 'text-red-500' : 'text-green-600'
                  )}
                >
                  ₩ {formatNumber(result.netProfit)}
                </span>
              </div>

              {/* 순이익률 */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">순이익률</span>
                <span
                  className={cn(
                    'text-xl font-bold',
                    isLoss ? 'text-red-500' : 'text-green-600'
                  )}
                >
                  {result.netProfitRate}%
                </span>
              </div>

              <hr className="border-gray-100" />

              {/* 차감 내역 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    앱 수수료 ({input.commissionRate}%)
                  </span>
                  <span className="font-medium text-red-500">
                    - ₩ {formatNumber(result.appCommission)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">결제 수수료 (3.3%)</span>
                  <span className="font-medium text-red-500">
                    - ₩ {formatNumber(result.paymentFee)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    원가 ({input.costRate}%)
                  </span>
                  <span className="font-medium text-red-500">
                    - ₩ {formatNumber(result.costAmount)}
                  </span>
                </div>
                {result.deliveryFee > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">배달비 부담</span>
                    <span className="font-medium text-red-500">
                      - ₩ {formatNumber(result.deliveryFee)}
                    </span>
                  </div>
                )}
                <hr className="border-gray-100" />
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-gray-700">총 차감액</span>
                  <span className="font-bold text-red-500">
                    - ₩ {formatNumber(result.totalDeduction)}
                  </span>
                </div>
              </div>
            </div>

            {/* 진단 메시지 */}
            <div
              className={cn(
                'mt-4 rounded-lg p-3 text-sm font-medium',
                diagnosisColors[result.diagnosisLevel]
              )}
            >
              {result.diagnosis}
            </div>

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

          {/* 배달앱별 수수료 비교 */}
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-bold text-gray-900">배달앱별 기본 수수료율</h2>
            <div className="space-y-2 text-sm text-gray-600">
              {DELIVERY_APP_OPTIONS.map((opt) => (
                <div key={opt.value} className="flex justify-between">
                  <span>{opt.label}</span>
                  <span
                    className={cn(
                      'font-medium',
                      input.deliveryApp === opt.value
                        ? 'text-blue-600'
                        : 'text-gray-900'
                    )}
                  >
                    {opt.rate}%
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-gray-400">
              * 2024년 기준이며, 광고·프로모션 상품에 따라 추가 수수료가 발생할 수 있습니다.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
