import type { Tool } from '@/types';
import QrGenerator from './QrGenerator';

export const meta: Tool = {
  slug: 'qr-generator',
  name: 'QR코드 생성기',
  description: 'URL·텍스트로 QR코드 만들고 다운로드',
  icon: 'QrCode',
  category: '유틸리티',
  isActive: true,
};

export const seo = {
  title: 'QR코드 생성기 - URL·텍스트 QR 무료 생성',
  description:
    'URL·전화번호·텍스트를 입력하면 QR코드를 즉시 생성합니다. PNG 다운로드 지원. 매장 메뉴판, 테이블 스탠드, 명함 제작에 바로 활용할 수 있는 무료 도구.',
};

export const Component = QrGenerator;
