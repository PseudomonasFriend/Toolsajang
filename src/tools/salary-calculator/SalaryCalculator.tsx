'use client';

import { useState, useCallback, useMemo } from 'react';
import { RotateCcw, Copy, Check } from 'lucide-react';
import { calculateSalary } from './calculation';
import { formatNumber, parseNumber } from '@/lib/format';
import type { SalaryInput } from './types';

/** 초기 입력값 */
const initialInput: SalaryInput = {
  monthlySalary: 0,
  dependents: 1,
};

export default function SalaryCalculator() {
  const [input, setInput] = useState<SalaryInput>(initialInput);
  const [copied, setCopied] = useState(false);

  /** 표시용 문자열 (콤마 포맷) */
  const [displaySalary, setDisplaySalary] = useState('');

  /** 월 급여 변경 핸들러 */
  const handleSalaryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const num = parseNumber(raw);
      setDisplaySalary(
        num > 0 ? formatNumber(num) : raw.replace(/[^0-9]/g, '')
      );
      setInput((prev) => ({ ...prev, monthlySalary: num }));
    },
    []
  );

  /** 부양가족 수 변경 핸들러 */
  const handleDependentsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const num = parseInt(raw, 10);
      if (raw === '') {
        setInput((prev) => ({ ...prev, dependents: 1 }));
        return;
      }
      if (!isNaN(num)) {
        const clamped = Math.min(20, Math.max(1, num));
        setInput((prev) => ({ ...prev, dependents: clamped }));
      }
    },
    []
  );

  /** 초기화 */
  const handleReset = useCallback(() => {
    setInput(initialInput);
    setDisplaySalary('');
    setCopied(false);
  }, []);

  /** 계산 결과 (실시간) */
  const result = useMemo(() => {
    if (input.monthlySalary <= 0) return null;
    return calculateSalary(input);
  }, [input]);

  /** 결과 복사 */
  const handleCopy = useCallback(async () => {
    if (!result) return;
    const text = [
      `월급여 ₩${formatNumber(input.monthlySalary)}`,
      `실수령액 ₩${formatNumber(result.netSalary)}`,
      `공제합계 ₩${formatNumber(result.totalDeduction)}`,
      `사업주부담 ₩${formatNumber(result.totalEmployerCost)}`,
      `총인건비 ₩${formatNumber(result.totalLaborCost)}`,
    ].join(' / ');

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* 클립보드 접근 불가 시 무시 */
    }
  }, [result, input.monthlySalary]);

  return (
    <div className="space-y-5">
      {/* 입력 영역 */}
      <div className="space-y-4 rounded-xl bg-white p-5 shadow-sm">
        {/* 월 급여 (세전) */}
        <div>
          <label
            htmlFor="monthlySalary"
            className="mb-1.5 block text-sm font-semibold text-gray-700"
          >
            월 급여 (세전) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              ₩
            </span>
            <input
              id="monthlySalary"
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={displaySalary}
              onChange={handleSalaryChange}
              className="h-12 w-full rounded-lg border border-gray-200 pl-8 pr-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="월 급여 (세전) 입력"
            />
          </div>
        </div>

        {/* 부양가족 수 */}
        <div>
          <label
            htmlFor="dependents"
            className="mb-1.5 block text-sm font-semibold text-gray-700"
          >
            부양가족 수 (본인 포함)
          </label>
          <div className="relative">
            <input
              id="dependents"
              type="number"
              inputMode="numeric"
              min={1}
              max={20}
              value={input.dependents}
              onChange={handleDependentsChange}
              className="h-12 w-full rounded-lg border border-gray-200 px-3 pr-8 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="부양가족 수 입력"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              명
            </span>
          </div>
        </div>

        {/* 안내 문구 */}
        <p className="text-xs text-gray-400">
          소득세는 약식 3.3% (소득세 3% + 지방소득세 0.3%) 적용
        </p>
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

      {/* 계산 결과 */}
      {result && (
        <div className="space-y-5">
          {/* 근로자 섹션: 급여 명세 */}
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-base font-bold text-gray-900">
              급여 명세
            </h2>

            <div className="space-y-3">
              {/* 실수령액 */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">실수령액</span>
                <span className="text-2xl font-bold text-gray-900">
                  ₩ {formatNumber(result.netSalary)}
                </span>
              </div>

              {/* 공제 합계 */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">공제 합계</span>
                <span className="text-lg font-semibold text-red-500">
                  - ₩ {formatNumber(result.totalDeduction)}
                </span>
              </div>

              <hr className="border-gray-100" />

              {/* 공제 항목 상세 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">국민연금</span>
                  <span className="text-sm text-gray-700">
                    ₩ {formatNumber(result.nationalPensionEmployee)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">건강보험</span>
                  <span className="text-sm text-gray-700">
                    ₩ {formatNumber(result.healthInsuranceEmployee)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">장기요양보험</span>
                  <span className="text-sm text-gray-700">
                    ₩ {formatNumber(result.longTermCareEmployee)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">고용보험</span>
                  <span className="text-sm text-gray-700">
                    ₩ {formatNumber(result.employmentInsuranceEmployee)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">소득세</span>
                  <span className="text-sm text-gray-700">
                    ₩ {formatNumber(result.incomeTax)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">지방소득세</span>
                  <span className="text-sm text-gray-700">
                    ₩ {formatNumber(result.localIncomeTax)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 사업주 섹션: 사업주 부담 */}
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-base font-bold text-gray-900">
              사업주 부담
            </h2>

            <div className="space-y-3">
              {/* 총 인건비 */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">총 인건비</span>
                <span className="text-2xl font-bold text-blue-600">
                  ₩ {formatNumber(result.totalLaborCost)}
                </span>
              </div>

              {/* 사업주 부담 합계 */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">사업주 부담 합계</span>
                <span className="text-lg font-semibold text-gray-900">
                  ₩ {formatNumber(result.totalEmployerCost)}
                </span>
              </div>

              <hr className="border-gray-100" />

              {/* 사업주 부담 항목 상세 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">국민연금</span>
                  <span className="text-sm text-gray-700">
                    ₩ {formatNumber(result.nationalPensionEmployer)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">건강보험</span>
                  <span className="text-sm text-gray-700">
                    ₩ {formatNumber(result.healthInsuranceEmployer)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">장기요양보험</span>
                  <span className="text-sm text-gray-700">
                    ₩ {formatNumber(result.longTermCareEmployer)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">고용보험</span>
                  <span className="text-sm text-gray-700">
                    ₩ {formatNumber(result.employmentInsuranceEmployer)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 결과 복사 */}
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
        </div>
      )}
    </div>
  );
}
