'use client';

import { useState, useCallback, useMemo } from 'react';
import { Copy, Check, ChevronDown, ChevronUp, AlertTriangle, RotateCcw } from 'lucide-react';
import { calculateHourlyWage } from './calculation';
import { formatNumber, parseNumber } from '@/lib/format';
import type { HourlyWageInput } from './types';

/** 1일 근무시간 선택지 (0.5시간 단위, 1~12시간) */
const DAILY_HOURS_OPTIONS: number[] = [];
for (let h = 1; h <= 12; h += 0.5) {
  DAILY_HOURS_OPTIONS.push(h);
}

/** 초기 입력값 */
const initialInput: HourlyWageInput = {
  hourlyWage: 0,
  dailyHours: 8,
  weeklyDays: 5,
};

export default function HourlyWageCalculator() {
  const [input, setInput] = useState<HourlyWageInput>(initialInput);
  const [displayWage, setDisplayWage] = useState('');
  const [copied, setCopied] = useState(false);
  const [insuranceOpen, setInsuranceOpen] = useState(false);

  /** 시급 입력 핸들러 */
  const handleWageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const num = parseNumber(raw);
    setDisplayWage(num > 0 ? formatNumber(num) : raw.replace(/[^0-9]/g, ''));
    setInput((prev) => ({ ...prev, hourlyWage: num }));
  }, []);

  /** 1일 근무시간 핸들러 */
  const handleDailyHoursChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setInput((prev) => ({ ...prev, dailyHours: parseFloat(e.target.value) }));
  }, []);

  /** 주 근무일수 핸들러 */
  const handleWeeklyDaysChange = useCallback((days: number) => {
    setInput((prev) => ({ ...prev, weeklyDays: days }));
  }, []);

  /** 초기화 */
  const handleReset = useCallback(() => {
    setInput(initialInput);
    setDisplayWage('');
    setCopied(false);
    setInsuranceOpen(false);
  }, []);

  /** 계산 결과 (실시간) */
  const result = useMemo(() => {
    if (input.hourlyWage <= 0) return null;
    return calculateHourlyWage(input);
  }, [input]);

  /** 결과 복사 */
  const handleCopy = useCallback(async () => {
    if (!result) return;
    const lines = [
      `시급 ₩${formatNumber(input.hourlyWage)}`,
      `일급 ₩${formatNumber(result.dailyPay)}`,
      `주급 ₩${formatNumber(result.weeklyTotal)} (주휴 포함)`,
      `월 통상임금 ₩${formatNumber(result.monthlyWage)}`,
    ];
    if (result.isInsuranceRequired) {
      lines.push(`실수령액 ₩${formatNumber(result.netMonthlyPay)}`);
      lines.push(`총 인건비 ₩${formatNumber(result.totalLaborCost)}`);
    }
    try {
      await navigator.clipboard.writeText(lines.join(' / '));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* 클립보드 접근 불가 시 무시 */
    }
  }, [result, input.hourlyWage]);

  return (
    <div className="space-y-5">
      {/* 입력 섹션 */}
      <div className="space-y-4 rounded-xl bg-white p-5 shadow-sm">
        {/* 시급 */}
        <div>
          <label
            htmlFor="hourlyWage"
            className="mb-1.5 block text-sm font-semibold text-gray-700"
          >
            시급 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₩</span>
            <input
              id="hourlyWage"
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={displayWage}
              onChange={handleWageChange}
              className="h-12 w-full rounded-lg border border-gray-200 pl-8 pr-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="시급 입력"
            />
          </div>
          <p className="mt-1 text-xs text-gray-400">2025년 최저시급 ₩10,030</p>
        </div>

        {/* 1일 근무시간 */}
        <div>
          <label
            htmlFor="dailyHours"
            className="mb-1.5 block text-sm font-semibold text-gray-700"
          >
            1일 근무시간
          </label>
          <select
            id="dailyHours"
            value={input.dailyHours}
            onChange={handleDailyHoursChange}
            className="h-12 w-full rounded-lg border border-gray-200 px-3 text-lg text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            aria-label="1일 근무시간 선택"
          >
            {DAILY_HOURS_OPTIONS.map((h) => (
              <option key={h} value={h}>
                {h % 1 === 0 ? `${h}시간` : `${h}시간 (${Math.floor(h)}시간 30분)`}
              </option>
            ))}
          </select>
        </div>

        {/* 주 근무일수 */}
        <div>
          <p className="mb-1.5 text-sm font-semibold text-gray-700">주 근무일수</p>
          <div className="flex gap-2" role="group" aria-label="주 근무일수 선택">
            {[1, 2, 3, 4, 5, 6].map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => handleWeeklyDaysChange(days)}
                className={`h-11 flex-1 rounded-lg border text-sm font-medium transition-colors ${
                  input.weeklyDays === days
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                }`}
                aria-label={`주 ${days}일 근무`}
                aria-pressed={input.weeklyDays === days}
              >
                {days}일
              </button>
            ))}
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

      {result && (
        <>
          {/* 최저시급 위반 경고 */}
          {result.isMinimumWageViolation && (
            <div
              className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4"
              role="alert"
              aria-label="최저시급 위반 경고"
            >
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
              <div>
                <p className="text-sm font-semibold text-red-700">최저시급 위반</p>
                <p className="mt-0.5 text-sm text-red-600">
                  입력한 시급(₩{formatNumber(input.hourlyWage)})이 2025년 최저시급(₩{formatNumber(result.minimumWage)})보다 낮습니다.
                </p>
              </div>
            </div>
          )}

          {/* 주휴수당 적용 여부 뱃지 */}
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                result.isWeeklyAllowanceApplicable
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-500'
              }`}
              aria-label={`주휴수당 ${result.isWeeklyAllowanceApplicable ? '발생' : '미발생'} (주 ${result.weeklyHours}시간)`}
            >
              주 {result.weeklyHours}시간 ·{' '}
              {result.isWeeklyAllowanceApplicable ? '주휴수당 발생' : '주휴수당 미발생 (15시간 미만)'}
            </span>
          </div>

          {/* 기본 급여 카드 */}
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-base font-bold text-gray-900">기본 급여</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">일급</span>
                <span className="text-lg font-semibold text-gray-900">
                  ₩ {formatNumber(result.dailyPay)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">주급 (기본)</span>
                <span className="text-lg font-semibold text-gray-900">
                  ₩ {formatNumber(result.weeklyPay)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">월 통상임금</span>
                <span className="text-2xl font-bold text-blue-600">
                  ₩ {formatNumber(result.monthlyWage)}
                </span>
              </div>
              <p className="text-xs text-gray-400">월 통상임금 = (주급 + 주휴수당) × 4.345주</p>
            </div>
          </div>

          {/* 주휴수당 카드 */}
          {result.isWeeklyAllowanceApplicable && (
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-base font-bold text-gray-900">주휴수당</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">주휴 시간</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {(result.weeklyHours / 5).toFixed(1)}시간
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">주휴수당</span>
                  <span className="text-lg font-semibold text-green-600">
                    ₩ {formatNumber(result.weeklyAllowance)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">주휴 포함 주급</span>
                  <span className="text-xl font-bold text-gray-900">
                    ₩ {formatNumber(result.weeklyTotal)}
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  주휴수당 = 시급 × (주 소정근로시간 ÷ 5)
                </p>
              </div>
            </div>
          )}

          {/* 4대보험 섹션 */}
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">4대보험</h2>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  result.isInsuranceRequired
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {result.isInsuranceRequired ? '의무 가입' : `가입 불필요 (월 ${result.monthlyHours}시간)`}
              </span>
            </div>

            {result.isInsuranceRequired ? (
              <div className="space-y-3">
                {/* 실수령액 */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">실수령액</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ₩ {formatNumber(result.netMonthlyPay)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">근로자 공제 합계</span>
                  <span className="text-lg font-semibold text-red-500">
                    - ₩ {formatNumber(result.totalDeductionEmployee)}
                  </span>
                </div>

                {/* 근로자 공제 내역 펼침/접기 */}
                <button
                  type="button"
                  onClick={() => setInsuranceOpen((prev) => !prev)}
                  className="flex w-full items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
                  aria-expanded={insuranceOpen}
                  aria-label={insuranceOpen ? '근로자 공제 내역 접기' : '근로자 공제 내역 펼치기'}
                >
                  <span>근로자 공제 내역</span>
                  {insuranceOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>

                {insuranceOpen && (
                  <div className="space-y-2 pl-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">국민연금 (4.5%)</span>
                      <span className="text-sm text-gray-700">
                        ₩ {formatNumber(result.nationalPensionEmployee)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">건강보험 (3.545%)</span>
                      <span className="text-sm text-gray-700">
                        ₩ {formatNumber(result.healthInsuranceEmployee)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">장기요양 (건강보험료×12.95%)</span>
                      <span className="text-sm text-gray-700">
                        ₩ {formatNumber(result.longTermCareEmployee)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">고용보험 (0.9%)</span>
                      <span className="text-sm text-gray-700">
                        ₩ {formatNumber(result.employmentInsuranceEmployee)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                월 소정근로시간이 60시간 미만(월 {result.monthlyHours}시간)이면 4대보험 의무 가입 대상이 아닙니다.
                단, 3개월 이상 계속 고용 시 가입 의무가 발생할 수 있습니다.
              </p>
            )}
          </div>

          {/* 사업주 총 인건비 */}
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-base font-bold text-gray-900">사업주 총 인건비</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">총 인건비</span>
                <span className="text-2xl font-bold text-blue-600">
                  ₩ {formatNumber(result.totalLaborCost)}
                </span>
              </div>

              {result.isInsuranceRequired && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">사업주 부담 합계</span>
                    <span className="text-lg font-semibold text-gray-900">
                      ₩ {formatNumber(result.totalEmployerCost)}
                    </span>
                  </div>
                  <hr className="border-gray-100" />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">국민연금 (4.5%)</span>
                      <span className="text-sm text-gray-700">
                        ₩ {formatNumber(result.nationalPensionEmployer)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">건강보험 (3.545%)</span>
                      <span className="text-sm text-gray-700">
                        ₩ {formatNumber(result.healthInsuranceEmployer)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">장기요양 (건강보험료×12.95%)</span>
                      <span className="text-sm text-gray-700">
                        ₩ {formatNumber(result.longTermCareEmployer)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">고용보험 (1.15%, 10인 미만)</span>
                      <span className="text-sm text-gray-700">
                        ₩ {formatNumber(result.employmentInsuranceEmployer)}
                      </span>
                    </div>
                  </div>
                </>
              )}

              <p className="text-xs text-gray-400">
                총 인건비 = 월 통상임금 + 사업주 부담 4대보험
              </p>
            </div>
          </div>

          {/* 결과 복사 버튼 */}
          <button
            type="button"
            onClick={handleCopy}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700"
            aria-label="계산 결과 클립보드에 복사"
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
        </>
      )}
    </div>
  );
}
