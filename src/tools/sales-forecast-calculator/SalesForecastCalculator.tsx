'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { RotateCcw, Copy, Check } from 'lucide-react';
import { calculateSalesForecast } from './calculation';
import { formatNumber, parseNumber } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { ForecastMethod } from './types';

/** 예측 방식 옵션 */
const METHOD_OPTIONS: { value: ForecastMethod; label: string; description: string }[] = [
  { value: 'seat', label: '좌석 회전율', description: '음식점·카페 등 좌석 기반 업종' },
  { value: 'traffic', label: '유동인구', description: '소매점·편의점 등 입지 기반' },
  { value: 'average', label: '업종 평균', description: '평수 기반 간편 예측' },
];

/** 업종별 평당 월매출 참고 */
const INDUSTRY_REFERENCES: { label: string; value: number }[] = [
  { label: '음식점', value: 800000 },
  { label: '카페', value: 600000 },
  { label: '편의점', value: 1500000 },
  { label: '미용실', value: 500000 },
  { label: '의류점', value: 400000 },
];

export default function SalesForecastCalculator() {
  const [method, setMethod] = useState<ForecastMethod>('seat');
  const [copied, setCopied] = useState(false);

  // 좌석 회전율 기반
  const [seatCount, setSeatCount] = useState(0);
  const [turnoverRate, setTurnoverRate] = useState(0);
  const [avgSpending, setAvgSpending] = useState(0);
  const [operatingDays, setOperatingDays] = useState(26);

  // 유동인구 기반
  const [dailyTraffic, setDailyTraffic] = useState(0);
  const [captureRate, setCaptureRate] = useState(0);

  // 업종 평균 기반
  const [storeArea, setStoreArea] = useState(0);
  const [salesPerPyeong, setSalesPerPyeong] = useState(0);

  // 디스플레이 값
  const [displays, setDisplays] = useState<Record<string, string>>({});

  const handleNumChange = useCallback(
    (setter: (v: number) => void, key: string, isFloat = false) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        if (isFloat) {
          const num = parseFloat(raw) || 0;
          setter(num);
          setDisplays((p) => ({ ...p, [key]: raw }));
        } else {
          const num = parseNumber(raw);
          setter(num);
          setDisplays((p) => ({
            ...p,
            [key]: num > 0 ? formatNumber(num) : raw.replace(/[^0-9]/g, ''),
          }));
        }
      },
    []
  );

  /** 초기화 */
  const handleReset = useCallback(() => {
    setSeatCount(0);
    setTurnoverRate(0);
    setAvgSpending(0);
    setOperatingDays(26);
    setDailyTraffic(0);
    setCaptureRate(0);
    setStoreArea(0);
    setSalesPerPyeong(0);
    setDisplays({});
    setCopied(false);
  }, []);

  /** 계산 결과 */
  const result = useMemo(() => {
    if (method === 'seat') {
      if (seatCount <= 0 || turnoverRate <= 0 || avgSpending <= 0) return null;
      return calculateSalesForecast({ method, seatCount, turnoverRate, avgSpending, operatingDays });
    }
    if (method === 'traffic') {
      if (dailyTraffic <= 0 || captureRate <= 0 || avgSpending <= 0) return null;
      return calculateSalesForecast({ method, dailyTraffic, captureRate, avgSpending, operatingDays });
    }
    if (storeArea <= 0 || salesPerPyeong <= 0) return null;
    return calculateSalesForecast({ method, storeArea, salesPerPyeong });
  }, [method, seatCount, turnoverRate, avgSpending, operatingDays, dailyTraffic, captureRate, storeArea, salesPerPyeong]);

  /** 결과 복사 */
  const handleCopy = useCallback(async () => {
    if (!result) return;
    const lines = [
      `[ 매출예측 결과 — ${result.methodDescription} ]`,
      ...result.assumptions,
      `───────────`,
      `일 예상 매출: ${formatNumber(result.dailySales)}원`,
      `월 예상 매출: ${formatNumber(result.monthlySales)}원`,
      `연 예상 매출: ${formatNumber(result.annualSales)}원`,
    ];
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* 클립보드 접근 불가 시 무시 */
    }
  }, [result]);

  return (
    <div className="space-y-5">
      {/* 예측 방식 선택 */}
      <div className="rounded-xl bg-white p-5 shadow-sm space-y-4">
        <label className="mb-1.5 block text-sm font-semibold text-gray-700">예측 방식</label>
        <div className="space-y-2">
          {METHOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { setMethod(opt.value); handleReset(); }}
              className={cn(
                'w-full rounded-lg border p-3 text-left transition-colors',
                method === opt.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              )}
              aria-label={`예측 방식 ${opt.label} 선택`}
            >
              <p className={cn('text-sm font-medium', method === opt.value ? 'text-blue-700' : 'text-gray-900')}>
                {opt.label}
              </p>
              <p className="text-xs text-gray-500">{opt.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 입력 영역 — 좌석 회전율 */}
      {method === 'seat' && (
        <div className="rounded-xl bg-white p-5 shadow-sm space-y-4">
          <div>
            <label htmlFor="seatCount" className="mb-1.5 block text-sm font-semibold text-gray-700">좌석 수</label>
            <input id="seatCount" type="text" inputMode="numeric" placeholder="20석"
              value={displays['seatCount'] ?? ''} onChange={handleNumChange(setSeatCount, 'seatCount')}
              className="h-12 w-full rounded-lg border border-gray-200 px-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="좌석 수 입력" />
          </div>
          <div>
            <label htmlFor="turnoverRate" className="mb-1.5 block text-sm font-semibold text-gray-700">일 평균 회전율 (회)</label>
            <input id="turnoverRate" type="text" inputMode="decimal" placeholder="3.0"
              value={displays['turnoverRate'] ?? ''} onChange={handleNumChange(setTurnoverRate, 'turnoverRate', true)}
              className="h-12 w-full rounded-lg border border-gray-200 px-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="회전율 입력" />
            <p className="mt-1 text-xs text-gray-400">음식점 평균 2~4회, 카페 3~6회</p>
          </div>
          <div>
            <label htmlFor="avgSpending" className="mb-1.5 block text-sm font-semibold text-gray-700">객단가</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₩</span>
              <input id="avgSpending" type="text" inputMode="numeric" placeholder="15,000원"
                value={displays['avgSpending'] ?? ''} onChange={handleNumChange(setAvgSpending, 'avgSpending')}
                className="h-12 w-full rounded-lg border border-gray-200 pl-8 pr-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                aria-label="객단가 입력" />
            </div>
          </div>
          <div>
            <label htmlFor="operatingDays" className="mb-1.5 block text-sm font-semibold text-gray-700">월 영업일</label>
            <input id="operatingDays" type="number" min={1} max={31} value={operatingDays}
              onChange={(e) => setOperatingDays(Number(e.target.value) || 26)}
              className="h-12 w-full rounded-lg border border-gray-200 px-3 text-lg text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="월 영업일 입력" />
          </div>
        </div>
      )}

      {/* 입력 영역 — 유동인구 */}
      {method === 'traffic' && (
        <div className="rounded-xl bg-white p-5 shadow-sm space-y-4">
          <div>
            <label htmlFor="dailyTraffic" className="mb-1.5 block text-sm font-semibold text-gray-700">일 유동인구</label>
            <input id="dailyTraffic" type="text" inputMode="numeric" placeholder="1,000명"
              value={displays['dailyTraffic'] ?? ''} onChange={handleNumChange(setDailyTraffic, 'dailyTraffic')}
              className="h-12 w-full rounded-lg border border-gray-200 px-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="일 유동인구 입력" />
            <p className="mt-1 text-xs text-gray-400">소상공인마당 상권분석에서 확인 가능</p>
          </div>
          <div>
            <label htmlFor="captureRate" className="mb-1.5 block text-sm font-semibold text-gray-700">입점률 (%)</label>
            <input id="captureRate" type="text" inputMode="decimal" placeholder="3%"
              value={displays['captureRate'] ?? ''} onChange={handleNumChange(setCaptureRate, 'captureRate', true)}
              className="h-12 w-full rounded-lg border border-gray-200 px-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="입점률 입력" />
            <p className="mt-1 text-xs text-gray-400">일반적으로 1~5% (업종·입지에 따라 상이)</p>
          </div>
          <div>
            <label htmlFor="avgSpending2" className="mb-1.5 block text-sm font-semibold text-gray-700">객단가</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₩</span>
              <input id="avgSpending2" type="text" inputMode="numeric" placeholder="10,000원"
                value={displays['avgSpending'] ?? ''} onChange={handleNumChange(setAvgSpending, 'avgSpending')}
                className="h-12 w-full rounded-lg border border-gray-200 pl-8 pr-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                aria-label="객단가 입력" />
            </div>
          </div>
          <div>
            <label htmlFor="operatingDays2" className="mb-1.5 block text-sm font-semibold text-gray-700">월 영업일</label>
            <input id="operatingDays2" type="number" min={1} max={31} value={operatingDays}
              onChange={(e) => setOperatingDays(Number(e.target.value) || 26)}
              className="h-12 w-full rounded-lg border border-gray-200 px-3 text-lg text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="월 영업일 입력" />
          </div>
        </div>
      )}

      {/* 입력 영역 — 업종 평균 */}
      {method === 'average' && (
        <div className="rounded-xl bg-white p-5 shadow-sm space-y-4">
          <div>
            <label htmlFor="storeArea" className="mb-1.5 block text-sm font-semibold text-gray-700">매장 면적 (평)</label>
            <input id="storeArea" type="text" inputMode="numeric" placeholder="20평"
              value={displays['storeArea'] ?? ''} onChange={handleNumChange(setStoreArea, 'storeArea')}
              className="h-12 w-full rounded-lg border border-gray-200 px-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="매장 면적 입력" />
          </div>
          <div>
            <label htmlFor="salesPerPyeong" className="mb-1.5 block text-sm font-semibold text-gray-700">평당 월매출</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₩</span>
              <input id="salesPerPyeong" type="text" inputMode="numeric" placeholder="80만원"
                value={displays['salesPerPyeong'] ?? ''} onChange={handleNumChange(setSalesPerPyeong, 'salesPerPyeong')}
                className="h-12 w-full rounded-lg border border-gray-200 pl-8 pr-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                aria-label="평당 월매출 입력" />
            </div>
          </div>
          {/* 업종별 참고 */}
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="mb-2 text-xs font-medium text-gray-700">업종별 평당 월매출 참고</p>
            <div className="space-y-1">
              {INDUSTRY_REFERENCES.map((ref) => (
                <button
                  key={ref.label}
                  type="button"
                  onClick={() => {
                    setSalesPerPyeong(ref.value);
                    setDisplays((p) => ({ ...p, salesPerPyeong: formatNumber(ref.value) }));
                  }}
                  className="flex w-full items-center justify-between rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-100"
                  aria-label={`${ref.label} 평당 월매출 적용`}
                >
                  <span>{ref.label}</span>
                  <span className="font-medium">{formatNumber(ref.value)}원</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 초기화 버튼 */}
      <button type="button" onClick={handleReset}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50"
        aria-label="입력값 초기화">
        <RotateCcw className="h-4 w-4" /> 초기화
      </button>

      {/* 결과 */}
      {result && (
        <>
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-base font-bold text-gray-900">{result.methodDescription}</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">일 예상 매출</span>
                <span className="text-lg font-bold text-gray-900">₩ {formatNumber(result.dailySales)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">월 예상 매출</span>
                <span className="text-2xl font-bold text-blue-600">₩ {formatNumber(result.monthlySales)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">연 예상 매출</span>
                <span className="text-lg font-bold text-gray-900">₩ {formatNumber(result.annualSales)}</span>
              </div>
            </div>

            {/* 가정 사항 */}
            <div className="mt-4 rounded-lg bg-gray-50 p-3 border border-gray-100">
              <p className="text-xs font-medium text-gray-700 mb-1">계산 가정</p>
              {result.assumptions.map((a, i) => (
                <p key={i} className="text-xs text-gray-500">- {a}</p>
              ))}
            </div>

            {/* 결과 복사 */}
            <button type="button" onClick={handleCopy}
              className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700"
              aria-label="계산 결과 복사">
              {copied ? (<><Check className="h-4 w-4" /> 복사 완료</>) : (<><Copy className="h-4 w-4" /> 결과 복사</>)}
            </button>
          </div>

          {/* 안내 */}
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-bold text-gray-900">매출예측 활용 팁</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>- 3가지 방식으로 각각 계산해 교차 검증하세요</li>
              <li>- 보수적(70%)·중간(100%)·낙관적(130%) 시나리오로 범위를 잡으세요</li>
              <li>- 실제 매출은 시즌·날씨·경쟁에 따라 ±30% 변동할 수 있습니다</li>
              <li>- 손익분기점 확인은 <Link href="/tools/break-even-calculator" className="text-blue-600 hover:underline">손익분기점 계산기</Link>를 활용하세요</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
