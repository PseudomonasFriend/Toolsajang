import type { MonthlyExpenseInput, MonthlyExpenseResult, ExpenseItem } from './types';

/**
 * 월 고정비 계산 함수
 * 항목별 합산 + 카테고리별 비중 분석
 */
export function calculateMonthlyExpense(input: MonthlyExpenseInput): MonthlyExpenseResult {
  const allItems: ExpenseItem[] = [
    { label: '월 임대료', amount: input.rent, category: '임대' as const },
    { label: '관리비', amount: input.maintenanceFee, category: '임대' as const },
    { label: '인건비', amount: input.laborCost, category: '인건비' as const },
    { label: '4대보험', amount: input.insuranceCost, category: '인건비' as const },
    { label: '전기/가스/수도', amount: input.utilityCost, category: '운영비' as const },
    { label: '통신비', amount: input.telecomCost, category: '운영비' as const },
    { label: '대출 이자', amount: input.loanInterest, category: '금융비' as const },
    { label: '카드 수수료', amount: input.cardFee, category: '금융비' as const },
    { label: '배달앱 수수료', amount: input.deliveryFee, category: '금융비' as const },
    { label: '기타', amount: input.miscCost, category: '운영비' as const },
  ];
  const items = allItems.filter((item) => item.amount > 0);

  const totalExpense = items.reduce((sum, item) => sum + item.amount, 0);
  const dailyExpense = Math.round(totalExpense / 30);

  // 카테고리별 소계
  const categoryMap = new Map<string, number>();
  for (const item of items) {
    categoryMap.set(item.category, (categoryMap.get(item.category) ?? 0) + item.amount);
  }

  const categoryTotals = Array.from(categoryMap.entries())
    .map(([category, total]) => ({
      category,
      total,
      percentage: totalExpense > 0 ? Math.round((total / totalExpense) * 100) : 0,
    }))
    .sort((a, b) => b.total - a.total);

  const largestCategory = categoryTotals.length > 0 ? categoryTotals[0].category : '';

  return {
    items,
    totalExpense,
    dailyExpense,
    categoryTotals,
    largestCategory,
  };
}
