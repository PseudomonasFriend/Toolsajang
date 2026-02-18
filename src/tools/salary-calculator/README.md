# 직원 급여 계산기 (salary-calculator)

> 직원 월급에서 4대보험을 제외한 **실수령액**과 **사업주 부담금**을 계산하는 툴.

## 공통 규칙

- `CalculatorLayout` 래퍼 사용 (페이지에서 감싸므로 컴포넌트 내부에서는 불필요)
- 모바일 퍼스트 (max-width 480px)
- Tailwind CSS only, TypeScript strict, `any` 금지
- 모든 텍스트/주석 한국어
- 컬러: Primary `blue-600`, 이익 `green-600`, 적자 `red-500`, BG `gray-50`, 카드 `white`, 텍스트 `gray-900`, 보조 `gray-500`, 테두리 `gray-200`

## 기능 설명

사업주가 직원에게 지급할 월 급여(세전)를 입력하면, 4대보험 공제 후 실수령액과 사업주가 추가로 부담하는 보험료를 계산한다.

## 4대보험 요율 (2025년 기준)

| 보험 | 근로자 부담 | 사업주 부담 | 비고 |
|------|-------------|-------------|------|
| 국민연금 | 4.5% | 4.5% | 기준소득월액 기준 |
| 건강보험 | 3.545% | 3.545% | 보수월액 기준 |
| 장기요양보험 | 건강보험료 × 12.95% | 건강보험료 × 12.95% | 건강보험료에 연동 |
| 고용보험 | 0.9% | 0.9% (+ 사업주 추가분은 제외) | 실업급여분만 |
| 소득세 | 간이세액표 기준 | - | 복잡하므로 **약식 3.3%** 적용 |
| 지방소득세 | 소득세 × 10% | - | 소득세의 10% |

> 실제 4대보험료는 보수월액 기준이나, 이 계산기에서는 월 급여 = 보수월액으로 간주합니다.
> 소득세는 간이세액표 대신 약식 3.3% (소득세 3% + 지방소득세 0.3%)를 적용합니다.

## 입력 필드

| 필드명 | 키 | 타입 | 필수 | 단위 | 기본값 |
|--------|-----|------|------|------|--------|
| 월 급여 (세전) | monthlySalary | number | O | 원 | 0 |
| 부양가족 수 (본인 포함) | dependents | number | X | 명 | 1 |

- 부양가족 수는 소득세 계산에 영향을 주나, 약식 3.3% 적용으로 단순화.
  - 이 계산기에서는 **표시만** 하고 실제 계산에는 반영하지 않음 (향후 간이세액표 연동 시 사용)
  - 입력 필드는 두되, "약식 3.3% 적용" 안내 문구 표시

## 출력 항목

| 항목 | 키 | 계산식 |
|------|-----|--------|
| 국민연금 (근로자) | nationalPensionEmployee | round(급여 × 0.045) |
| 건강보험 (근로자) | healthInsuranceEmployee | round(급여 × 0.03545) |
| 장기요양보험 (근로자) | longTermCareEmployee | round(건강보험료_근로자 × 0.1295) |
| 고용보험 (근로자) | employmentInsuranceEmployee | round(급여 × 0.009) |
| 소득세 | incomeTax | round(급여 × 0.03) |
| 지방소득세 | localIncomeTax | round(소득세 × 0.1) |
| **공제 합계** | totalDeduction | 위 6개 합계 |
| **실수령액** | netSalary | 급여 - 공제 합계 |
| 국민연금 (사업주) | nationalPensionEmployer | round(급여 × 0.045) |
| 건강보험 (사업주) | healthInsuranceEmployer | round(급여 × 0.03545) |
| 장기요양보험 (사업주) | longTermCareEmployer | round(건강보험료_사업주 × 0.1295) |
| 고용보험 (사업주) | employmentInsuranceEmployer | round(급여 × 0.009) |
| **사업주 부담 합계** | totalEmployerCost | 위 4개 합계 |
| **총 인건비** | totalLaborCost | 급여 + 사업주 부담 합계 |

## 계산 로직

```
// 근로자 부담
국민연금_근로자 = round(급여 × 0.045)
건강보험_근로자 = round(급여 × 0.03545)
장기요양_근로자 = round(건강보험_근로자 × 0.1295)
고용보험_근로자 = round(급여 × 0.009)
소득세 = round(급여 × 0.03)
지방소득세 = round(소득세 × 0.1)
공제 합계 = 국민연금 + 건강보험 + 장기요양 + 고용보험 + 소득세 + 지방소득세
실수령액 = 급여 - 공제 합계

// 사업주 부담
국민연금_사업주 = round(급여 × 0.045)
건강보험_사업주 = round(급여 × 0.03545)
장기요양_사업주 = round(건강보험_사업주 × 0.1295)
고용보험_사업주 = round(급여 × 0.009)
사업주 부담 합계 = 국민연금 + 건강보험 + 장기요양 + 고용보험
총 인건비 = 급여 + 사업주 부담 합계
```

## UI 요구사항

- **입력 영역**: 카드(`rounded-xl bg-white p-5 shadow-sm`)
  - 월 급여: ₩ 접두사 입력칸, `inputMode="numeric"`, 콤마 자동 포맷, 높이 48px
  - 부양가족 수: 숫자 입력 (1~20 범위), 높이 48px
  - 안내 문구: `text-xs text-gray-400` "소득세는 약식 3.3% (소득세 3% + 지방소득세 0.3%) 적용"
- **실시간 계산**: 월 급여 입력 시 즉시 결과 표시
- **결과 영역**: 두 섹션으로 나누어 표시
  - **근로자 섹션** ("급여 명세"):
    - 실수령액: 가장 크게 `text-2xl font-bold`
    - 공제 합계: `text-lg font-semibold`
    - 각 공제 항목 상세 (국민연금, 건강보험, 장기요양, 고용보험, 소득세, 지방소득세): `text-sm` 리스트
  - **사업주 섹션** ("사업주 부담"):
    - 총 인건비: 가장 크게 `text-2xl font-bold text-blue-600`
    - 사업주 부담 합계: `text-lg font-semibold`
    - 각 보험 항목 상세: `text-sm` 리스트
  - 두 섹션은 각각 별도 카드 또는 구분선으로 분리
- **초기화 버튼**: 모든 입력값 기본값으로 리셋
- **결과 복사**: "월급여 ₩X / 실수령액 ₩Y / 공제합계 ₩Z / 사업주부담 ₩W / 총인건비 ₩V" 형태

## index.ts export 형식

```typescript
import type { Tool } from '@/types';
import SalaryCalculator from './SalaryCalculator';

export const meta: Tool = {
  slug: 'salary-calculator',
  name: '직원 급여 계산기',
  description: '4대보험 포함 실수령액 계산',
  icon: 'Users',
  category: '재무/회계',
  isNew: true,
  isActive: true,
};

export const seo = {
  title: '직원 급여 계산기 - 4대보험 실수령액 계산',
  description: '월 급여를 입력하면 4대보험 공제 후 실수령액과 사업주 부담금을 즉시 계산합니다.',
};

export const Component = SalaryCalculator;
```

## 참고: 사용하는 공통 유틸

- `@/lib/format` — `formatNumber`, `parseNumber`
- `@/lib/utils` — `cn` (Tailwind 클래스 조건부 결합)

## 파일 구조

```
src/tools/salary-calculator/
  README.md              ← 이 파일
  types.ts               ← SalaryInput, SalaryOutput 타입
  calculation.ts         ← calculateSalary() 함수
  SalaryCalculator.tsx   ← UI 컴포넌트 ('use client')
  index.ts               ← meta, seo, Component export
```
