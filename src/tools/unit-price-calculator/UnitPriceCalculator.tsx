'use client';

import { useState, useCallback, useMemo } from 'react';
import { RotateCcw, Plus, Trash2 } from 'lucide-react';
import { calculateUnitPrice } from './calculation';
import { formatNumber, parseNumber } from '@/lib/format';
import type { UnitPriceItem } from './types';

/** 단위 옵션 */
const UNIT_OPTIONS = ['개', 'g', 'kg', 'ml', 'L', '장', '롤', '팩'];

/** 기본 상품 항목 */
const createEmptyItem = (name: string): UnitPriceItem => ({
  name,
  totalPrice: 0,
  quantity: 0,
  unit: '개',
});

/** 초기 상품 목록 */
const initialItems: UnitPriceItem[] = [
  createEmptyItem('상품 A'),
  createEmptyItem('상품 B'),
];

export default function UnitPriceCalculator() {
  const [items, setItems] = useState<UnitPriceItem[]>(initialItems);
  const [displayPrices, setDisplayPrices] = useState<string[]>(['', '']);
  const [displayQuantities, setDisplayQuantities] = useState<string[]>(['', '']);

  /** 초기화 */
  const handleReset = useCallback(() => {
    setItems(initialItems);
    setDisplayPrices(['', '']);
    setDisplayQuantities(['', '']);
  }, []);

  /** 상품 추가 (최대 3개) */
  const handleAddItem = useCallback(() => {
    if (items.length >= 3) return;
    const label = items.length === 2 ? '상품 C' : `상품 ${items.length + 1}`;
    setItems((prev) => [...prev, createEmptyItem(label)]);
    setDisplayPrices((prev) => [...prev, '']);
    setDisplayQuantities((prev) => [...prev, '']);
  }, [items.length]);

  /** 상품 삭제 */
  const handleRemoveItem = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
    setDisplayPrices((prev) => prev.filter((_, i) => i !== index));
    setDisplayQuantities((prev) => prev.filter((_, i) => i !== index));
  }, []);

  /** 필드 변경 핸들러 */
  const handleChange = useCallback(
    (index: number, field: keyof UnitPriceItem, value: string) => {
      if (field === 'totalPrice') {
        const num = parseNumber(value);
        setDisplayPrices((prev) => {
          const next = [...prev];
          next[index] = num > 0 ? formatNumber(num) : value.replace(/[^0-9]/g, '');
          return next;
        });
        setItems((prev) => {
          const next = [...prev];
          next[index] = { ...next[index], totalPrice: num };
          return next;
        });
      } else if (field === 'quantity') {
        const num = parseNumber(value);
        setDisplayQuantities((prev) => {
          const next = [...prev];
          next[index] = num > 0 ? formatNumber(num) : value.replace(/[^0-9]/g, '');
          return next;
        });
        setItems((prev) => {
          const next = [...prev];
          next[index] = { ...next[index], quantity: num };
          return next;
        });
      } else if (field === 'name' || field === 'unit') {
        setItems((prev) => {
          const next = [...prev];
          next[index] = { ...next[index], [field]: value };
          return next;
        });
      }
    },
    []
  );

  /** 실시간 계산 결과 */
  const results = useMemo(() => calculateUnitPrice(items), [items]);

  return (
    <div className="space-y-5">
      {/* 상품 입력 영역 */}
      {items.map((item, index) => (
        <div key={index} className="rounded-xl bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <input
              type="text"
              value={item.name}
              onChange={(e) => handleChange(index, 'name', e.target.value)}
              className="text-base font-semibold text-gray-900 bg-transparent border-b border-transparent focus:border-blue-400 focus:outline-none"
              aria-label={`${index + 1}번 상품 이름`}
              maxLength={20}
            />
            {items.length > 2 && (
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500"
                aria-label={`${item.name} 삭제`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="space-y-3">
            {/* 총 금액 */}
            <div>
              <label className="mb-1 block text-sm text-gray-600">
                총 금액
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₩</span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={displayPrices[index] ?? ''}
                  onChange={(e) => handleChange(index, 'totalPrice', e.target.value)}
                  className="h-12 w-full rounded-lg border border-gray-200 pl-8 pr-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  aria-label={`${item.name} 총 금액`}
                />
              </div>
            </div>

            {/* 수량/용량 + 단위 */}
            <div>
              <label className="mb-1 block text-sm text-gray-600">
                수량/용량
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={displayQuantities[index] ?? ''}
                  onChange={(e) => handleChange(index, 'quantity', e.target.value)}
                  className="h-12 flex-1 rounded-lg border border-gray-200 px-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  aria-label={`${item.name} 수량`}
                />
                <select
                  value={item.unit}
                  onChange={(e) => handleChange(index, 'unit', e.target.value)}
                  className="h-12 rounded-lg border border-gray-200 px-2 text-base text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  aria-label={`${item.name} 단위 선택`}
                >
                  {UNIT_OPTIONS.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* 상품 추가 버튼 */}
      {items.length < 3 && (
        <button
          type="button"
          onClick={handleAddItem}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-white text-sm font-medium text-gray-500 hover:border-blue-400 hover:text-blue-500"
          aria-label="비교 상품 추가"
        >
          <Plus className="h-4 w-4" />
          상품 추가 (최대 3개)
        </button>
      )}

      {/* 초기화 버튼 */}
      <button
        type="button"
        onClick={handleReset}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50"
        aria-label="초기화"
      >
        <RotateCcw className="h-4 w-4" />
        초기화
      </button>

      {/* 계산 결과 */}
      {results.length > 0 && (
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-base font-bold text-gray-900">단가 비교 결과</h2>
          <div className="space-y-3">
            {results.map((r, index) => (
              <div
                key={index}
                className={`rounded-lg p-4 ${r.isCheapest ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">
                      {r.name}
                    </span>
                    {r.isCheapest && (
                      <span className="rounded-full bg-green-600 px-2 py-0.5 text-xs font-semibold text-white">
                        최저가
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-xl font-bold ${r.isCheapest ? 'text-green-700' : 'text-gray-900'}`}
                  >
                    ₩{r.unitPrice < 10 ? r.unitPrice.toFixed(2) : formatNumber(Math.round(r.unitPrice))}
                    <span className="text-sm font-normal text-gray-500">/{r.unit}</span>
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  ₩{formatNumber(r.totalPrice)} ÷ {formatNumber(r.quantity)}{r.unit}
                  {!r.isCheapest && r.diffFromCheapest > 0 && (
                    <span className="ml-2 text-red-500">
                      최저가보다 {r.diffFromCheapest}% 비쌈
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
