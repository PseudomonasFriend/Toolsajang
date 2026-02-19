'use client';

import { useState, useCallback, useMemo } from 'react';
import { RotateCcw } from 'lucide-react';
import { countCharacters } from './calculation';

/** 자주 쓰이는 글자수 제한 기준 */
const CHAR_LIMITS = [
  { label: 'SMS 문자', limit: 90 },
  { label: '카카오 알림톡', limit: 1000 },
  { label: '인스타그램', limit: 2200 },
  { label: '네이버 플레이스 소개', limit: 500 },
];

export default function CharacterCounter() {
  const [text, setText] = useState('');

  const handleReset = useCallback(() => {
    setText('');
  }, []);

  /** 실시간 계산 결과 */
  const result = useMemo(() => countCharacters(text), [text]);

  return (
    <div className="space-y-5">
      {/* 텍스트 입력 영역 */}
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <label
          htmlFor="text-input"
          className="mb-1.5 block text-sm font-semibold text-gray-700"
        >
          텍스트 입력
        </label>
        <textarea
          id="text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="여기에 텍스트를 입력하세요..."
          rows={8}
          className="w-full rounded-lg border border-gray-200 p-3 text-base text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
          aria-label="글자수를 셀 텍스트 입력"
        />

        {/* 초기화 버튼 */}
        <button
          type="button"
          onClick={handleReset}
          className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50"
          aria-label="텍스트 초기화"
        >
          <RotateCcw className="h-4 w-4" />
          초기화
        </button>
      </div>

      {/* 계산 결과 */}
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-base font-bold text-gray-900">계산 결과</h2>

        <div className="grid grid-cols-2 gap-3">
          {/* 전체 글자수 */}
          <div className="rounded-lg bg-blue-50 p-4">
            <p className="text-xs text-blue-600 mb-1">전체 글자수</p>
            <p className="text-3xl font-bold text-blue-700">
              {result.totalChars.toLocaleString()}
            </p>
            <p className="text-xs text-blue-500 mt-0.5">공백 포함</p>
          </div>

          {/* 공백 제외 글자수 */}
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-xs text-gray-600 mb-1">글자수</p>
            <p className="text-3xl font-bold text-gray-900">
              {result.charsNoSpace.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">공백 제외</p>
          </div>

          {/* 바이트 수 */}
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-xs text-gray-600 mb-1">바이트 수</p>
            <p className="text-3xl font-bold text-gray-900">
              {result.byteCount.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">UTF-8 기준</p>
          </div>

          {/* 줄 수 */}
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-xs text-gray-600 mb-1">줄 수</p>
            <p className="text-3xl font-bold text-gray-900">
              {result.lineCount.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">행</p>
          </div>
        </div>

        {/* 단어 수 */}
        <div className="mt-3 flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
          <span className="text-sm text-gray-600">단어 수</span>
          <span className="text-lg font-semibold text-gray-900">
            {result.wordCount.toLocaleString()}개
          </span>
        </div>
      </div>

      {/* 글자수 제한 기준 */}
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-bold text-gray-900">
          자주 쓰이는 글자수 기준
        </h2>
        <div className="space-y-2">
          {CHAR_LIMITS.map(({ label, limit }) => {
            const ratio = Math.min((result.totalChars / limit) * 100, 100);
            const isOver = result.totalChars > limit;

            return (
              <div key={label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">{label}</span>
                  <span
                    className={`text-sm font-semibold ${isOver ? 'text-red-500' : 'text-gray-900'}`}
                  >
                    {result.totalChars} / {limit}자
                    {isOver && (
                      <span className="ml-1 text-xs font-normal text-red-400">
                        ({result.totalChars - limit}자 초과)
                      </span>
                    )}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100">
                  <div
                    className={`h-2 rounded-full transition-all ${isOver ? 'bg-red-400' : 'bg-blue-500'}`}
                    style={{ width: `${ratio}%` }}
                    role="progressbar"
                    aria-valuenow={result.totalChars}
                    aria-valuemin={0}
                    aria-valuemax={limit}
                    aria-label={`${label} 글자수 진행률`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
