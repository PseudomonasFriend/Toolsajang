'use client';

import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/lib/format';
import type { LoanOutput } from './types';

interface LoanResultProps {
  result: LoanOutput;
  isEqualPrincipal: boolean;
  isScheduleOpen: boolean;
  copied: boolean;
  onToggleSchedule: () => void;
  onCopy: () => void;
}

/** 대출이자 계산기 결과 UI */
export function LoanResult({
  result,
  isEqualPrincipal,
  isScheduleOpen,
  copied,
  onToggleSchedule,
  onCopy,
}: LoanResultProps) {
  return (
    <div className="space-y-5">
      {/* 결과 요약 카드 */}
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-base font-bold text-gray-900">
          계산 결과
        </h2>

        <div className="space-y-3">
          {/* 월 상환액 */}
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-gray-600">
              월 상환액
              {isEqualPrincipal && (
                <span className="ml-1 text-xs text-gray-400">
                  (첫 달 기준)
                </span>
              )}
            </span>
            <span className="text-2xl font-bold text-gray-900">
              ₩ {formatNumber(result.monthlyPayment)}
            </span>
          </div>

          <hr className="border-gray-100" />

          {/* 총 상환액 */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">총 상환액</span>
            <span className="text-sm text-gray-700">
              ₩ {formatNumber(result.totalPayment)}
            </span>
          </div>

          {/* 총 이자 */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">총 이자</span>
            <span className="text-sm font-semibold text-red-500">
              ₩ {formatNumber(result.totalInterest)}
            </span>
          </div>
        </div>

        {/* 결과 복사 */}
        <button
          type="button"
          onClick={onCopy}
          className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700"
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

      {/* 상환 스케줄 테이블 (접이식) */}
      <div className="rounded-xl bg-white shadow-sm">
        <button
          type="button"
          onClick={onToggleSchedule}
          className="flex h-12 w-full items-center justify-between px-5 text-sm font-semibold text-gray-700"
          aria-expanded={isScheduleOpen}
          aria-controls="schedule-section"
        >
          <span>상환 스케줄</span>
          {isScheduleOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        {isScheduleOpen && (
          <div
            id="schedule-section"
            className="max-h-[400px] overflow-y-auto border-t border-gray-100"
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs text-gray-500">
                  <th className="px-3 py-2 text-center">회차</th>
                  <th className="px-3 py-2 text-right">상환액</th>
                  <th className="px-3 py-2 text-right">원금</th>
                  <th className="px-3 py-2 text-right">이자</th>
                  <th className="px-3 py-2 text-right">잔액</th>
                </tr>
              </thead>
              <tbody>
                {result.schedule.map((row) => (
                  <tr
                    key={row.month}
                    className={cn(
                      'border-b border-gray-100',
                      row.month % 2 === 0 && 'bg-gray-50'
                    )}
                  >
                    <td className="px-3 py-2 text-center text-gray-600">
                      {row.month}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-900">
                      {formatNumber(row.payment)}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-700">
                      {formatNumber(row.principalPart)}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-700">
                      {formatNumber(row.interestPart)}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-700">
                      {formatNumber(row.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
