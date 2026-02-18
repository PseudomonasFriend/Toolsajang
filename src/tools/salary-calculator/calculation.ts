import type { SalaryInput, SalaryOutput } from './types';

/**
 * 급여 계산 함수
 * 월 급여(세전)를 기반으로 4대보험 공제 후 실수령액과 사업주 부담금을 계산한다.
 * 2025년 기준 요율 적용. 소득세는 약식 3.3% (소득세 3% + 지방소득세 0.3%).
 */
export function calculateSalary(input: SalaryInput): SalaryOutput {
  const { monthlySalary } = input;

  // --- 근로자 부담 ---
  const nationalPensionEmployee = Math.round(monthlySalary * 0.045);
  const healthInsuranceEmployee = Math.round(monthlySalary * 0.03545);
  const longTermCareEmployee = Math.round(healthInsuranceEmployee * 0.1295);
  const employmentInsuranceEmployee = Math.round(monthlySalary * 0.009);
  const incomeTax = Math.round(monthlySalary * 0.03);
  const localIncomeTax = Math.round(incomeTax * 0.1);

  const totalDeduction =
    nationalPensionEmployee +
    healthInsuranceEmployee +
    longTermCareEmployee +
    employmentInsuranceEmployee +
    incomeTax +
    localIncomeTax;

  const netSalary = monthlySalary - totalDeduction;

  // --- 사업주 부담 ---
  const nationalPensionEmployer = Math.round(monthlySalary * 0.045);
  const healthInsuranceEmployer = Math.round(monthlySalary * 0.03545);
  const longTermCareEmployer = Math.round(healthInsuranceEmployer * 0.1295);
  const employmentInsuranceEmployer = Math.round(monthlySalary * 0.009);

  const totalEmployerCost =
    nationalPensionEmployer +
    healthInsuranceEmployer +
    longTermCareEmployer +
    employmentInsuranceEmployer;

  const totalLaborCost = monthlySalary + totalEmployerCost;

  return {
    nationalPensionEmployee,
    healthInsuranceEmployee,
    longTermCareEmployee,
    employmentInsuranceEmployee,
    incomeTax,
    localIncomeTax,
    totalDeduction,
    netSalary,
    nationalPensionEmployer,
    healthInsuranceEmployer,
    longTermCareEmployer,
    employmentInsuranceEmployer,
    totalEmployerCost,
    totalLaborCost,
  };
}
