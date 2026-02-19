import type { Tool } from '@/types';
import CharacterCounter from './CharacterCounter';

/** 글자수 카운터 메타 정보 */
export const meta: Tool = {
  slug: 'character-counter',
  name: '글자수 카운터',
  description: '텍스트 글자수·바이트수 즉시 확인',
  icon: 'Type',
  category: '유틸리티',
  isNew: true,
  isActive: true,
};

/** 글자수 카운터 SEO 메타데이터 */
export const seo = {
  title: '글자수 카운터 - 글자수·바이트수 무료 계산',
  description:
    '텍스트를 입력하면 글자수, 바이트수, 줄 수, 단어 수를 즉시 계산합니다. SMS, 카카오 알림톡, 인스타그램, 네이버 플레이스 소개글 작성 시 유용합니다.',
};

export const Component = CharacterCounter;
