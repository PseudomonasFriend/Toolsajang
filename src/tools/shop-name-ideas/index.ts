import type { Tool } from '@/types';
import ShopNameIdeas from './ShopNameIdeas';

/** 가게명 아이디어 메타 정보 */
export const meta: Tool = {
  slug: 'shop-name-ideas',
  name: '가게명 아이디어',
  description: 'AI로 업종·컨셉 기반 가게 이름 추천',
  icon: 'Store',
  category: '마케팅',
  isNew: true,
  isActive: false,
};

/** 가게명 아이디어 SEO 메타데이터 */
export const seo = {
  title: '가게명 아이디어 - AI 가게 이름 추천',
  description:
    '업종·컨셉·키워드를 입력하면 AI가 가게 이름 후보를 추천합니다. 카페, 식당, 미용실 등 소상공인을 위한 무료 상호명 아이디어 도구.',
};

export const Component = ShopNameIdeas;
