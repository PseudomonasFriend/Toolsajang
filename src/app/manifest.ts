import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '툴사장 - 사장님을 위한 무료 비즈니스 툴',
    short_name: '툴사장',
    description:
      '마진 계산기, 부가세 계산기 등 소상공인에게 필요한 무료 비즈니스 도구를 제공합니다. 로그인 없이 바로 사용하세요.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f9fafb',
    theme_color: '#2563eb',
    lang: 'ko',
    categories: ['business', 'finance', 'productivity'],
    icons: [
      {
        src: '/icon',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
