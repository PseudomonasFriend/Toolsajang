'use client';

import { useState, useCallback, useMemo } from 'react';
import { RotateCcw, Copy, Check, Plus, Trash2 } from 'lucide-react';
import { calculateLaborCost, INDUSTRY_BENCHMARKS } from './calculation';
import { formatNumber, parseNumber } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { LaborCostInput, Employee, PayType } from './types';

/** 기본 직원 */
function createDefaultEmployee(): Employee {
  return { payType: 'monthly', pay: 0, weeklyHours: 40 };
}

/** 초기 입력값 */
const initialInput: LaborCostInput = {
  monthlySales: 0,
  employees: [createDefaultEmployee()],
  includeInsurance: true,
};

/** 직원 표시값 */
interface EmployeeDisplay {
  pay: string;
  weeklyHours: string;
}

export default function LaborCostRatio() {
  const [input, setInput] = useState<LaborCostInput>(initialInput);
  const [salesDisplay, setSalesDisplay] = useState('');
  const [employeeDisplays, setEmployeeDisplays] = useState<EmployeeDisplay[]>([
    { pay: '', weeklyHours: '40' },
  ]);
  const [copied, setCopied] = useState(false);

  /** 매출 입력 */
  const handleSalesChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const num = parseNumber(e.target.value);
      setSalesDisplay(num > 0 ? formatNumber(num) : e.target.value.replace(/[^0-9]/g, ''));
      setInput((prev) => ({ ...prev, monthlySales: num }));
    },
    []
  );

  /** 직원 추가 */
  const handleAddEmployee = useCallback(() => {
    setInput((prev) => ({
      ...prev,
      employees: [...prev.employees, createDefaultEmployee()],
    }));
    setEmployeeDisplays((prev) => [...prev, { pay: '', weeklyHours: '40' }]);
  }, []);

  /** 직원 삭제 */
  const handleRemoveEmployee = useCallback((index: number) => {
    setInput((prev) => ({
      ...prev,
      employees: prev.employees.filter((_, i) => i !== index),
    }));
    setEmployeeDisplays((prev) => prev.filter((_, i) => i !== index));
  }, []);

  /** 급여 유형 변경 */
  const handlePayTypeChange = useCallback((index: number, payType: PayType) => {
    setInput((prev) => ({
      ...prev,
      employees: prev.employees.map((emp, i) =>
        i === index ? { ...emp, payType, pay: 0 } : emp
      ),
    }));
    setEmployeeDisplays((prev) =>
      prev.map((d, i) => (i === index ? { ...d, pay: '' } : d))
    );
  }, []);

  /** 급여 입력 */
  const handlePayChange = useCallback(
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const num = parseNumber(e.target.value);
      setEmployeeDisplays((prev) =>
        prev.map((d, i) =>
          i === index
            ? { ...d, pay: num > 0 ? formatNumber(num) : e.target.value.replace(/[^0-9]/g, '') }
            : d
        )
      );
      setInput((prev) => ({
        ...prev,
        employees: prev.employees.map((emp, i) =>
          i === index ? { ...emp, pay: num } : emp
        ),
      }));
    },
    []
  );

  /** 주당 근무시간 변경 */
  const handleWeeklyHoursChange = useCallback(
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9.]/g, '');
      setEmployeeDisplays((prev) =>
        prev.map((d, i) => (i === index ? { ...d, weeklyHours: raw } : d))
      );
      setInput((prev) => ({
        ...prev,
        employees: prev.employees.map((emp, i) =>
          i === index ? { ...emp, weeklyHours: parseFloat(raw) || 0 } : emp
        ),
      }));
    },
    []
  );

  /** 4대보험 토글 */
  const handleInsuranceToggle = useCallback(() => {
    setInput((prev) => ({ ...prev, includeInsurance: !prev.includeInsurance }));
  }, []);

  /** 초기화 */
  const handleReset = useCallback(() => {
    setInput(initialInput);
    setSalesDisplay('');
    setEmployeeDisplays([{ pay: '', weeklyHours: '40' }]);
    setCopied(false);
  }, []);

  /** 실시간 계산 결과 */
  const result = useMemo(() => {
    if (input.monthlySales <= 0) return null;
    const hasValidEmployee = input.employees.some((emp) => emp.pay > 0);
    if (!hasValidEmployee) return null;
    return calculateLaborCost(input);
  }, [input]);

  /** 결과 복사 */
  const handleCopy = useCallback(async () => {
    if (!result) return;
    const lines = [
      `월 매출: ${formatNumber(input.monthlySales)}원`,
      `직원 수: ${input.employees.length}명`,
      `총 급여: ${formatNumber(result.totalSalary)}원`,
      input.includeInsurance ? `4대보험 사업주 부담금: ${formatNumber(result.insuranceCost)}원` : '',
      `총 인건비: ${formatNumber(result.totalLaborCost)}원`,
      `인건비 비율: ${result.laborCostRatio}%`,
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

  return (
    <div className="space-y-5">
      {/* 입력 영역 */}
      <div className="rounded-xl bg-white p-5 shadow-sm space-y-4">
        {/* 월 매출 */}
        <div>
          <label
            htmlFor="monthlySales"
            className="mb-1.5 block text-sm font-semibold text-gray-700"
          >
            월 매출 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₩</span>
            <input
              id="monthlySales"
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={salesDisplay}
              onChange={handleSalesChange}
              className="h-12 w-full rounded-lg border border-gray-200 pl-8 pr-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="월 매출 입력"
            />
          </div>
        </div>

        {/* 4대보험 포함 여부 */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">4대보험 사업주 부담금 포함</span>
          <button
            type="button"
            role="switch"
            aria-checked={input.includeInsurance}
            onClick={handleInsuranceToggle}
            className={cn(
              'relative inline-flex h-7 w-12 items-center rounded-full transition-colors',
              input.includeInsurance ? 'bg-blue-600' : 'bg-gray-300'
            )}
            aria-label="4대보험 포함 여부 토글"
          >
            <span
              className={cn(
                'inline-block h-5 w-5 rounded-full bg-white transition-transform',
                input.includeInsurance ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </button>
        </div>
      </div>

      {/* 직원 목록 */}
      {input.employees.map((emp, index) => (
        <div key={index} className="rounded-xl bg-white p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">직원 {index + 1}</h3>
            {input.employees.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveEmployee(index)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500"
                aria-label={`직원 ${index + 1} 삭제`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* 급여 유형 */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handlePayTypeChange(index, 'monthly')}
              className={cn(
                'flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                emp.payType === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
              aria-label="월급 선택"
            >
              월급
            </button>
            <button
              type="button"
              onClick={() => handlePayTypeChange(index, 'hourly')}
              className={cn(
                'flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                emp.payType === 'hourly'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
              aria-label="시급 선택"
            >
              시급
            </button>
          </div>

          {/* 급여 */}
          <div>
            <label
              htmlFor={`pay-${index}`}
              className="mb-1.5 block text-sm text-gray-600"
            >
              {emp.payType === 'monthly' ? '월급' : '시급'} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₩</span>
              <input
                id={`pay-${index}`}
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={employeeDisplays[index]?.pay ?? ''}
                onChange={handlePayChange(index)}
                className="h-12 w-full rounded-lg border border-gray-200 pl-8 pr-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                aria-label={`직원 ${index + 1} ${emp.payType === 'monthly' ? '월급' : '시급'} 입력`}
              />
            </div>
          </div>

          {/* 주당 근무시간 (시급일 때만) */}
          {emp.payType === 'hourly' && (
            <div>
              <label
                htmlFor={`hours-${index}`}
                className="mb-1.5 block text-sm text-gray-600"
              >
                주당 근무시간
              </label>
              <div className="relative">
                <input
                  id={`hours-${index}`}
                  type="text"
                  inputMode="decimal"
                  placeholder="40"
                  value={employeeDisplays[index]?.weeklyHours ?? '40'}
                  onChange={handleWeeklyHoursChange(index)}
                  className="h-12 w-full rounded-lg border border-gray-200 pl-3 pr-10 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  aria-label={`직원 ${index + 1} 주당 근무시간 입력`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  시간
                </span>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* 직원 추가 버튼 */}
      <button
        type="button"
        onClick={handleAddEmployee}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50"
        aria-label="직원 추가"
      >
        <Plus className="h-4 w-4" />
        직원 추가
      </button>

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
              {/* 인건비 비율 */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">인건비 비율</span>
                <span
                  className={cn(
                    'text-2xl font-bold',
                    result.diagnosisLevel === 'good'
                      ? 'text-green-600'
                      : result.diagnosisLevel === 'warning'
                        ? 'text-amber-500'
                        : 'text-red-500'
                  )}
                >
                  {result.laborCostRatio}%
                </span>
              </div>

              {/* 총 급여 */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">총 급여</span>
                <span className="text-xl font-bold text-gray-900">
                  ₩ {formatNumber(result.totalSalary)}
                </span>
              </div>

              {/* 4대보험 */}
              {input.includeInsurance && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">4대보험 사업주 부담금</span>
                  <span className="text-base font-semibold text-gray-700">
                    ₩ {formatNumber(result.insuranceCost)}
                  </span>
                </div>
              )}

              <hr className="border-gray-100" />

              {/* 총 인건비 */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">총 인건비</span>
                <span className="text-2xl font-bold text-gray-900">
                  ₩ {formatNumber(result.totalLaborCost)}
                </span>
              </div>

              {/* 직원별 월급 */}
              {result.employeeMonthlySalaries.length > 1 && (
                <div className="mt-2 rounded-lg bg-gray-50 p-3 space-y-1">
                  {result.employeeMonthlySalaries.map((salary, i) => (
                    <div key={i} className="flex justify-between text-sm text-gray-600">
                      <span>직원 {i + 1} (월급 환산)</span>
                      <span className="font-medium text-gray-900">
                        ₩ {formatNumber(salary)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 진단 메시지 */}
            <div
              className={cn(
                'mt-4 rounded-lg p-3 text-sm font-medium',
                result.diagnosisLevel === 'good'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : result.diagnosisLevel === 'warning'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
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

          {/* 업종별 적정 인건비 비율 */}
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-bold text-gray-900">업종별 적정 인건비 비율</h2>
            <div className="space-y-2 text-sm text-gray-600">
              {INDUSTRY_BENCHMARKS.map((bm) => (
                <div key={bm.name} className="flex justify-between">
                  <span>{bm.name}</span>
                  <span className="font-medium text-gray-900">
                    {bm.minRate}~{bm.maxRate}%
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-gray-400">
              * 업종별 평균 기준이며, 점포 상황에 따라 다를 수 있습니다.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
