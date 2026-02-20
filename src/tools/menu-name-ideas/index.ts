import type { Tool } from '@/types';
import MenuNameIdeas from './MenuNameIdeas';

export const meta: Tool = {
  slug: 'menu-name-ideas',
  name: '메뉴명 아이디어',
  description: 'AI로 메뉴/상품 이름 후보 제안',
  icon: 'Lightbulb',
  category: '마케팅',
  isNew: true,
  isActive: false,
};

export const seo = {
  title: '메뉴명 아이디어 - AI 메뉴명 추천',
  description:
    '업종·메뉴 종류·키워드를 입력하면 AI가 메뉴명 후보를 추천합니다. 카페, 한식, 베이커리 등 소상공인용 무료 도구.',
};

export const Component = MenuNameIdeas;
