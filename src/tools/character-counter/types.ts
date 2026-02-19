/** 글자수 카운터 출력 */
export interface CharacterCountResult {
  /** 전체 글자수 (공백 포함) */
  totalChars: number;
  /** 글자수 (공백 제외) */
  charsNoSpace: number;
  /** 줄 수 */
  lineCount: number;
  /** 바이트 수 (UTF-8 기준) */
  byteCount: number;
  /** 단어 수 */
  wordCount: number;
}
