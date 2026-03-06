'use client';

import { RotateCcw } from 'lucide-react';

interface SalaryInputsProps {
  displaySalary: string;
  dependents: number;
  onSalaryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDependentsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
}

/** 급여 계산기 입력 UI */
export function SalaryInputs({
  displaySalary,
  dependents,
  onSalaryChange,
  onDependentsChange,
  onReset,
}: SalaryInputsProps) {
  return (
    <>
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
              onChange={onSalaryChange}
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
              value={dependents}
              onChange={onDependentsChange}
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
        onClick={onReset}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50"
        aria-label="입력값 초기화"
      >
        <RotateCcw className="h-4 w-4" />
        초기화
      </button>
    </>
  );
}
