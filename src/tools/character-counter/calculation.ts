import type { CharacterCountResult } from './types';

/**
 * 문자의 UTF-8 바이트 수를 계산
 * 한글: 3바이트, ASCII: 1바이트, 기타 유니코드: 2바이트
 */
function getByteLength(char: string): number {
  const code = char.charCodeAt(0);
  if (code <= 0x7f) return 1;
  if (code <= 0x7ff) return 2;
  return 3;
}

/**
 * 텍스트 글자수 카운터 계산 함수
 */
export function countCharacters(text: string): CharacterCountResult {
  // 전체 글자수 (공백 포함)
  const totalChars = text.length;

  // 공백 제외 글자수
  const charsNoSpace = text.replace(/\s/g, '').length;

  // 줄 수 (빈 문자열이면 0)
  const lineCount = text.length === 0 ? 0 : text.split('\n').length;

  // 바이트 수 계산
  let byteCount = 0;
  for (const char of text) {
    byteCount += getByteLength(char);
  }

  // 단어 수 (공백/줄바꿈 기준, 빈 문자열 제외)
  const words = text.trim().split(/\s+/).filter((w) => w.length > 0);
  const wordCount = words.length;

  return {
    totalChars,
    charsNoSpace,
    lineCount,
    byteCount,
    wordCount,
  };
}
