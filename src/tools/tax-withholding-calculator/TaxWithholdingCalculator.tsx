'use client';

import { useState, useCallback, useMemo } from 'react';
import { RotateCcw, Copy, Check } from 'lucide-react';
import { calculateTaxWithholding, INCOME_TYPE_INFO } from './calculation';
import { formatNumber, parseNumber } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { IncomeType, TaxWithholdingInput } from './types';

/** 초기 입력값 */
const initialInput: TaxWithholdingInput = {
  paymentAmount: 0,
  incomeType: 'business',
  expenseRate: 60,
};

/** 납부 기한 안내 */
const PAYMENT_DEADLINE: Record<IncomeType, string> = {
  business: '매달 지급 시 다음 달 10일까지 원천세 납부',
  other: '건별 지급, 지급일의 다음 달 10일까지',
  'daily-worker': '지급한 달의 다음 달 10일까지',
};

export default function TaxWithholdingCalculator() {
  const [input, setInput] = useState<TaxWithholdingInput>(initialInput);
  const [amountDisplay, setAmountDisplay] = useState('');
  const [expenseRateDisplay, setExpenseRateDisplay] = useState('60');
  const [copied, setCopied] = useState(false);

  /** 소득 유형 선택 */
  const handleIncomeTypeChange = useCallback((incomeType: IncomeType) => {
    setInput((prev) => ({ ...prev, incomeType }));
  }, []);

  /** 지급액 입력 */
  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseNumber(e.target.value);
    setAmountDisplay(num > 0 ? formatNumber(num) : e.target.value.replace(/[^0-9]/g, ''));
    setInput((prev) => ({ ...prev, paymentAmount: num }));
  }, []);

  /** 필요경비율 입력 */
  const handleExpenseRateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, '');
    setExpenseRateDisplay(raw);
    const num = parseFloat(raw);
    if (!isNaN(num) && num >= 0 && num <= 100) {
      setInput((prev) => ({ ...prev, expenseRate: num }));
    }
  }, []);

  /** 초기화 */
  const handleReset = useCallback(() => {
    setInput(initialInput);
    setAmountDisplay('');
    setExpenseRateDisplay('60');
    setCopied(false);
  }, []);

  /** 실시간 계산 결과 */
  const result = useMemo(() => {
    if (input.paymentAmount <= 0) return null;
    return calculateTaxWithholding(input);
  }, [input]);

  /** 결과 복사 */
  const handleCopy = useCallback(async () => {
    if (!result) return;
    const incomeInfo = INCOME_TYPE_INFO.find((i) => i.id === result.incomeType);
    const lines = [
      `소득 유형: ${incomeInfo?.name ?? ''}`,
      `지급액: ${formatNumber(result.paymentAmount)}원`,
      result.incomeType !== 'business'
        ? `과세표준: ${formatNumber(result.taxableIncome)}원`
        : '',
      `소득세: ${formatNumber(result.incomeTax)}원`,
      `지방소득세: ${formatNumber(result.localTax)}원`,
      `원천세 합계: ${formatNumber(result.totalTax)}원`,
      `실지급액: ${formatNumber(result.netPayment)}원`,
      `실효 원천징수율: ${result.effectiveRate}%`,
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
  }, [result]);

  return (
    <div className="space-y-5">
      {/* 소득 유형 선택 */}
      <div className="rounded-xl bg-white p-5 shadow-sm space-y-3">
        <p className="text-sm font-semibold text-gray-700">소득 유형 선택</p>
        <div className="flex flex-col gap-2">
          {INCOME_TYPE_INFO.map((info) => (
            <button
              key={info.id}
              type="button"
              onClick={() => handleIncomeTypeChange(info.id)}
              className={cn(
                'flex flex-col items-start rounded-lg border px-4 py-3 text-left transition-colors',
                input.incomeType === info.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:bg-gray-50'
              )}
              aria-pressed={input.incomeType === info.id}
              aria-label={`${info.name} 선택`}
            >
              <span
                className={cn(
                  'text-sm font-semibold',
                  input.incomeType === info.id ? 'text-blue-700' : 'text-gray-900'
                )}
              >
                {info.name}
              </span>
              <span className="mt-0.5 text-xs text-gray-500">{info.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 입력 섹션 */}
      <div className="rounded-xl bg-white p-5 shadow-sm space-y-4">
        {/* 지급액 */}
        <div>
          <label htmlFor="paymentAmount" className="mb-1.5 block text-sm font-semibold text-gray-700">
            지급액 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₩</span>
            <input
              id="paymentAmount"
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={amountDisplay}
              onChange={handleAmountChange}
              className="h-12 w-full rounded-lg border border-gray-200 pl-8 pr-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="지급액 입력"
            />
          </div>
          {input.incomeType === 'daily-worker' && (
            <p className="mt-1 text-xs text-gray-500">일당 금액을 입력하세요 (1일 15만원 공제 적용)</p>
          )}
        </div>

        {/* 필요경비율 (기타소득일 때만) */}
        {input.incomeType === 'other' && (
          <div>
            <label htmlFor="expenseRate" className="mb-1.5 block text-sm font-semibold text-gray-700">
              필요경비율 <span className="text-gray-400 font-normal">(기본 60%)</span>
            </label>
            <div className="relative">
              <input
                id="expenseRate"
                type="text"
                inputMode="decimal"
                placeholder="60"
                value={expenseRateDisplay}
                onChange={handleExpenseRateChange}
                className="h-12 w-full rounded-lg border border-gray-200 pl-3 pr-10 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                aria-label="필요경비율 입력"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
            </div>
            <p className="mt-1 text-xs text-gray-500">강연료·원고료는 60%, 기타는 필요경비율 확인 필요</p>
          </div>
        )}
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
              {/* 과세표준 (비용경비 있을 때) */}
              {result.incomeType !== 'business' && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {result.incomeType === 'daily-worker' ? '비과세 공제 (1일 15만원)' : '필요경비'}
                    </span>
                    <span className="text-base font-medium text-gray-700">
                      ₩ {formatNumber(result.expenseAmount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">과세표준</span>
                    <span className="text-base font-medium text-gray-700">
                      ₩ {formatNumber(result.taxableIncome)}
                    </span>
                  </div>
                </>
              )}

              {/* 소득세 */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">소득세</span>
                <span className="text-base font-medium text-gray-700">
                  ₩ {formatNumber(result.incomeTax)}
                </span>
              </div>

              {/* 지방소득세 */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">지방소득세 (소득세의 10%)</span>
                <span className="text-base font-medium text-gray-700">
                  ₩ {formatNumber(result.localTax)}
                </span>
              </div>

              <hr className="border-gray-100" />

              {/* 원천세 합계 */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">원천세 합계</span>
                <span className="text-2xl font-bold text-red-500">
                  ₩ {formatNumber(result.totalTax)}
                </span>
              </div>

              {/* 실지급액 */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">실지급액</span>
                <span className="text-2xl font-bold text-green-600">
                  ₩ {formatNumber(result.netPayment)}
                </span>
              </div>
            </div>

            {/* 실효 원천징수율 */}
            <div className="mt-4 rounded-lg bg-blue-50 px-4 py-3">
              <p className="text-sm text-blue-700">
                지급액의 <span className="font-bold text-blue-800">{result.effectiveRate}%</span> 원천징수
                {result.totalTax === 0 && (
                  <span className="ml-1 text-xs">(소액 부징수 — 비과세)</span>
                )}
              </p>
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

          {/* 실무 안내 박스 */}
          <div className="rounded-xl bg-amber-50 p-5 shadow-sm">
            <h3 className="mb-2 text-sm font-bold text-amber-800">실무 납부 안내</h3>
            <p className="text-sm text-amber-700">{PAYMENT_DEADLINE[result.incomeType]}</p>
            <ul className="mt-3 space-y-1.5 text-xs text-amber-600">
              <li>• 원천세는 지급자(사업주)가 원천징수 후 홈택스에서 신고·납부</li>
              <li>• 반기납부 사업장은 1~6월분을 7월 10일, 7~12월분을 1월 10일에 납부 가능</li>
              <li>• 일용근로소득은 매월 지급명세서 제출 필요</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
