'use client';

import { Copy, Check } from 'lucide-react';
import { formatNumber } from '@/lib/format';
import type { SalaryOutput } from './types';

interface SalaryResultProps {
  result: SalaryOutput;
  copied: boolean;
  onCopy: () => void;
}

/** 급여 계산기 결과 UI */
export function SalaryResult({ result, copied, onCopy }: SalaryResultProps) {
  return (
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
        onClick={onCopy}
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
  );
}
