'use client';

import { useState, useCallback, useMemo } from 'react';
import { RotateCcw, Copy, Check } from 'lucide-react';
import { calculateMonthlyExpense } from './calculation';
import { formatNumber, parseNumber } from '@/lib/format';
import type { MonthlyExpenseInput } from './types';

/** 입력 필드 정의 */
const FIELDS: { key: keyof MonthlyExpenseInput; label: string; placeholder: string; group: string }[] = [
  { key: 'rent', label: '월 임대료', placeholder: '150만원', group: '임대' },
  { key: 'maintenanceFee', label: '관리비', placeholder: '20만원', group: '임대' },
  { key: 'laborCost', label: '인건비 (직원 급여 합계)', placeholder: '300만원', group: '인건비' },
  { key: 'insuranceCost', label: '4대보험 사업자 부담', placeholder: '30만원', group: '인건비' },
  { key: 'utilityCost', label: '전기/가스/수도', placeholder: '40만원', group: '운영비' },
  { key: 'telecomCost', label: '통신비 (인터넷/POS)', placeholder: '5만원', group: '운영비' },
  { key: 'loanInterest', label: '대출 이자', placeholder: '50만원', group: '금융비' },
  { key: 'cardFee', label: '카드 수수료', placeholder: '30만원', group: '금융비' },
  { key: 'deliveryFee', label: '배달앱 수수료', placeholder: '20만원', group: '금융비' },
  { key: 'miscCost', label: '기타 고정비', placeholder: '10만원', group: '운영비' },
];

/** 초기 입력값 */
const initialInput: MonthlyExpenseInput = {
  rent: 0,
  maintenanceFee: 0,
  laborCost: 0,
  insuranceCost: 0,
  utilityCost: 0,
  telecomCost: 0,
  loanInterest: 0,
  cardFee: 0,
  deliveryFee: 0,
  miscCost: 0,
};

/** 카테고리 색상 */
const CATEGORY_COLORS: Record<string, string> = {
  '임대': 'bg-purple-500',
  '인건비': 'bg-blue-500',
  '운영비': 'bg-green-500',
  '금융비': 'bg-amber-500',
};

export default function MonthlyExpenseCalculator() {
  const [input, setInput] = useState<MonthlyExpenseInput>(initialInput);
  const [displays, setDisplays] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  /** 금액 입력 핸들러 */
  const handleChange = useCallback(
    (key: keyof MonthlyExpenseInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const num = parseNumber(e.target.value);
      setDisplays((prev) => ({
        ...prev,
        [key]: num > 0 ? formatNumber(num) : e.target.value.replace(/[^0-9]/g, ''),
      }));
      setInput((prev) => ({ ...prev, [key]: num }));
    },
    []
  );

  /** 초기화 */
  const handleReset = useCallback(() => {
    setInput(initialInput);
    setDisplays({});
    setCopied(false);
  }, []);

  /** 계산 결과 */
  const result = useMemo(() => {
    const hasInput = Object.values(input).some((val) => val > 0);
    if (!hasInput) return null;
    return calculateMonthlyExpense(input);
  }, [input]);

  /** 결과 복사 */
  const handleCopy = useCallback(async () => {
    if (!result) return;
    const lines = [
      '[ 월 고정비 계산 결과 ]',
      ...result.items.map((item) => `${item.label}: ${formatNumber(item.amount)}원`),
      `───────────`,
      `총 월 고정비: ${formatNumber(result.totalExpense)}원`,
      `일 고정비: ${formatNumber(result.dailyExpense)}원`,
    ];
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* 클립보드 접근 불가 시 무시 */
    }
  }, [result]);

  // 그룹별 필드 분류
  const groups = ['임대', '인건비', '운영비', '금융비'];

  return (
    <div className="space-y-5">
      {/* 입력 영역 */}
      {groups.map((group) => (
        <div key={group} className="rounded-xl bg-white p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-gray-700">{group}</h2>
          {FIELDS.filter((f) => f.group === group).map((field) => (
            <div key={field.key}>
              <label
                htmlFor={field.key}
                className="mb-1.5 block text-sm font-semibold text-gray-700"
              >
                {field.label}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₩</span>
                <input
                  id={field.key}
                  type="text"
                  inputMode="numeric"
                  placeholder={field.placeholder}
                  value={displays[field.key] ?? ''}
                  onChange={handleChange(field.key)}
                  className="h-12 w-full rounded-lg border border-gray-200 pl-8 pr-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  aria-label={`${field.label} 입력`}
                />
              </div>
            </div>
          ))}
        </div>
      ))}

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
              {/* 총 월 고정비 */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">총 월 고정비</span>
                <span className="text-2xl font-bold text-blue-600">
                  ₩ {formatNumber(result.totalExpense)}
                </span>
              </div>

              {/* 일 고정비 */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">하루 최소 벌어야 할 금액</span>
                <span className="text-xl font-bold text-red-500">
                  ₩ {formatNumber(result.dailyExpense)}
                </span>
              </div>
            </div>

            {/* 카테고리별 비중 */}
            {result.categoryTotals.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-gray-700">비용 구성</p>
                {/* 비율 바 */}
                <div className="flex h-4 w-full overflow-hidden rounded-full">
                  {result.categoryTotals.map((cat) => (
                    <div
                      key={cat.category}
                      className={`${CATEGORY_COLORS[cat.category] ?? 'bg-gray-400'}`}
                      style={{ width: `${Math.max(cat.percentage, 2)}%` }}
                      title={`${cat.category} ${cat.percentage}%`}
                    />
                  ))}
                </div>
                {/* 범례 */}
                <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                  {result.categoryTotals.map((cat) => (
                    <div key={cat.category} className="flex items-center gap-1">
                      <div className={`h-2.5 w-2.5 rounded-full ${CATEGORY_COLORS[cat.category] ?? 'bg-gray-400'}`} />
                      <span>{cat.category} {cat.percentage}% ({formatNumber(cat.total)}원)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

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

          {/* 고정비 절감 팁 */}
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-bold text-gray-900">고정비 절감 체크리스트</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-blue-500">1.</span>
                <span>전기요금: 산업용 전기 전환 검토 (음식점/제조업)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-blue-500">2.</span>
                <span>통신비: 사업자 결합 요금제로 월 2~5만원 절감</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-blue-500">3.</span>
                <span>카드 수수료: 영세사업자 우대수수료율 신청 확인</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-blue-500">4.</span>
                <span>4대보험: 두루누리 지원금 (10인 미만 사업장) 활용</span>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
