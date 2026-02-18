/** D-day 계산기 입력 */
export interface DdayInput {
  /** 목표일 (YYYY-MM-DD) */
  targetDate: string;
  /** 기준일 (YYYY-MM-DD), 미입력 시 오늘 */
  baseDate?: string;
}

/** D-day 계산기 출력 */
export interface DdayOutput {
  /** D-day (목표일 - 기준일 일수, 양수=미래, 음수=과거) */
  dday: number;
  /** 목표일 요일 */
  dayOfWeek: string;
  /** 남은/지난 일수 설명 */
  label: string;
}
