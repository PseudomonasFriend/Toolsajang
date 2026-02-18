'use client';

import { useState, useCallback, useMemo } from 'react';
import { RotateCcw } from 'lucide-react';
import { calculateDday, getTodayString } from './calculation';

export default function DdayCalculator() {
  const today = useMemo(() => getTodayString(), []);
  const [targetDate, setTargetDate] = useState('');

  const handleReset = useCallback(() => {
    setTargetDate('');
  }, []);

  const result = useMemo(() => {
    if (!targetDate) return null;
    return calculateDday({ targetDate });
  }, [targetDate]);

  return (
    <div className="space-y-5">
      <div className="rounded-xl bg-white p-5 shadow-sm space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">
            목표일 <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="h-12 w-full rounded-lg border border-gray-200 px-3 text-base text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            aria-label="목표일 선택"
          />
          <p className="mt-1 text-xs text-gray-500">기준일: 오늘 ({today})</p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          aria-label="초기화"
        >
          <RotateCcw className="h-4 w-4" />
          초기화
        </button>
      </div>

      {result && (
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-base font-bold text-gray-900">📅 D-day</h3>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-blue-600">{result.label}</div>
            <div className="text-sm text-gray-600">
              {targetDate} ({result.dayOfWeek}요일)
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
