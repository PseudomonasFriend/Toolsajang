import { describe, it, expect } from 'vitest';
import { countCharacters } from './calculation';

describe('글자수 카운터 (countCharacters)', () => {
  describe('전체 글자수 (공백 포함)', () => {
    it('빈 문자열이면 모두 0', () => {
      const result = countCharacters('');
      expect(result.totalChars).toBe(0);
      expect(result.charsNoSpace).toBe(0);
      expect(result.lineCount).toBe(0);
      expect(result.byteCount).toBe(0);
      expect(result.wordCount).toBe(0);
    });

    it('영문 5글자 hello', () => {
      const result = countCharacters('hello');
      expect(result.totalChars).toBe(5);
      expect(result.charsNoSpace).toBe(5);
      expect(result.wordCount).toBe(1);
    });

    it('공백 포함: "hello world" → 총 11자, 공백 제외 10자', () => {
      const result = countCharacters('hello world');
      expect(result.totalChars).toBe(11);
      expect(result.charsNoSpace).toBe(10);
      expect(result.wordCount).toBe(2);
    });
  });

  describe('한글 처리', () => {
    it('한글 3글자 "안녕하세요"는 totalChars 5', () => {
      const result = countCharacters('안녕하세요');
      expect(result.totalChars).toBe(5);
      expect(result.charsNoSpace).toBe(5);
    });

    it('한글 바이트: "안" = 3바이트 (UTF-8)', () => {
      const result = countCharacters('안');
      expect(result.byteCount).toBe(3);
    });

    it('한글 "안녕" = 6바이트', () => {
      const result = countCharacters('안녕');
      expect(result.byteCount).toBe(6);
    });

    it('ASCII "ABC" = 3바이트', () => {
      const result = countCharacters('ABC');
      expect(result.byteCount).toBe(3);
    });

    it('혼합: "안녕 hello" → 총 8자, 한글 6바이트 + 공백 1 + 영문 5 = 12바이트', () => {
      const result = countCharacters('안녕 hello');
      expect(result.totalChars).toBe(8);
      expect(result.byteCount).toBe(6 + 1 + 5); // 한글2자*3 + 공백1 + hello5
    });
  });

  describe('줄 수 계산', () => {
    it('줄바꿈 없으면 lineCount = 1', () => {
      const result = countCharacters('한 줄 텍스트');
      expect(result.lineCount).toBe(1);
    });

    it('줄바꿈 1개이면 lineCount = 2', () => {
      const result = countCharacters('첫째 줄\n둘째 줄');
      expect(result.lineCount).toBe(2);
    });

    it('줄바꿈 2개이면 lineCount = 3', () => {
      const result = countCharacters('1\n2\n3');
      expect(result.lineCount).toBe(3);
    });

    it('빈 문자열이면 lineCount = 0', () => {
      const result = countCharacters('');
      expect(result.lineCount).toBe(0);
    });
  });

  describe('단어 수 계산', () => {
    it('단어 없는 빈 문자열이면 wordCount = 0', () => {
      const result = countCharacters('');
      expect(result.wordCount).toBe(0);
    });

    it('공백만 있으면 wordCount = 0', () => {
      const result = countCharacters('   ');
      expect(result.wordCount).toBe(0);
    });

    it('"hello world foo" → wordCount = 3', () => {
      const result = countCharacters('hello world foo');
      expect(result.wordCount).toBe(3);
    });

    it('줄바꿈으로 구분된 단어도 각각 1개로 카운트', () => {
      const result = countCharacters('첫째\n둘째\n셋째');
      expect(result.wordCount).toBe(3);
    });

    it('연속 공백도 하나의 구분자로 처리', () => {
      const result = countCharacters('hello    world');
      expect(result.wordCount).toBe(2);
    });
  });

  describe('공백 제외 글자수', () => {
    it('탭도 공백으로 취급', () => {
      const result = countCharacters('a\tb');
      expect(result.totalChars).toBe(3);
      expect(result.charsNoSpace).toBe(2);
    });

    it('줄바꿈도 공백으로 취급', () => {
      const result = countCharacters('a\nb');
      expect(result.totalChars).toBe(3);
      expect(result.charsNoSpace).toBe(2);
    });
  });

  describe('실제 사용 시나리오', () => {
    it('인스타그램 캡션 (한국어 + 이모지 없음): 100자 글자수 확인', () => {
      const text = '이 제품을 사용해보니 정말 좋았습니다. 퀄리티가 기대 이상이고, 배송도 빨랐어요. 다음에도 꼭 다시 구매할 예정입니다. 추천합니다!';
      const result = countCharacters(text);
      expect(result.totalChars).toBe(text.length);
      expect(result.lineCount).toBe(1);
      expect(result.byteCount).toBeGreaterThan(result.totalChars); // 한글은 3바이트
    });

    it('네이버 블로그 제목: 공백 포함 글자수 검증', () => {
      const title = '소상공인을 위한 무료 계산기 10선';
      const result = countCharacters(title);
      expect(result.totalChars).toBe(title.length);
      expect(result.charsNoSpace).toBeLessThan(result.totalChars);
    });
  });
});
