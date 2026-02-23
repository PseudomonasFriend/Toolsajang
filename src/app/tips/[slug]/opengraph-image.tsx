import { ImageResponse } from 'next/og';
import { getTipBySlug } from '@/lib/tips';

// fs 모듈 사용(getTipBySlug)으로 인해 nodejs runtime 필요
export const runtime = 'nodejs';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** 카테고리별 배경 색상 */
function getCategoryColors(category: string): { from: string; to: string } {
  switch (category) {
    case '경영 기초':
      return { from: '#1d4ed8', to: '#1e3a8a' };
    case '매장 운영':
      return { from: '#0f766e', to: '#134e4a' };
    case '마케팅':
      return { from: '#7c3aed', to: '#4c1d95' };
    case '세금/회계':
      return { from: '#b45309', to: '#78350f' };
    case '인사/노무':
      return { from: '#be185d', to: '#831843' };
    default:
      return { from: '#1d4ed8', to: '#1e3a8a' };
  }
}

/** 카테고리별 아이콘 */
function getCategoryEmoji(category: string): string {
  switch (category) {
    case '경영 기초':
      return '📊';
    case '매장 운영':
      return '🏪';
    case '마케팅':
      return '📣';
    case '세금/회계':
      return '🧾';
    case '인사/노무':
      return '👥';
    default:
      return '💡';
  }
}

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const tip = getTipBySlug(slug);

  const title = tip?.meta.title ?? '장사 팁';
  const description = tip?.meta.description ?? '소상공인을 위한 실용적인 비즈니스 팁';
  const category = tip?.meta.category ?? '경영 기초';
  const date = tip?.meta.date ?? '';

  const colors = getCategoryColors(category);
  const emoji = getCategoryEmoji(category);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${colors.from} 0%, ${colors.to} 100%)`,
          fontFamily: '"Noto Sans KR", "Apple SD Gothic Neo", sans-serif',
          padding: '80px',
          position: 'relative',
        }}
      >
        {/* 배경 장식 원 */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-80px',
            width: '360px',
            height: '360px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.07)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-40px',
            right: '120px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
          }}
        />

        {/* 상단: 브랜드 + 카테고리 + 날짜 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '12px',
              padding: '10px 20px',
              fontSize: '20px',
              color: 'rgba(255,255,255,0.9)',
              fontWeight: 700,
              border: '1px solid rgba(255,255,255,0.3)',
            }}
          >
            🧮 툴사장
          </div>
          <div
            style={{
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '999px',
              padding: '8px 18px',
              fontSize: '18px',
              color: 'rgba(255,255,255,0.85)',
              fontWeight: 600,
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            {emoji} {category}
          </div>
          {date && (
            <div
              style={{
                fontSize: '17px',
                color: 'rgba(255,255,255,0.55)',
                fontWeight: 400,
              }}
            >
              {date}
            </div>
          )}
        </div>

        {/* 글 제목 */}
        <div
          style={{
            fontSize: title.length > 20 ? '58px' : '68px',
            fontWeight: 900,
            color: 'white',
            lineHeight: 1.2,
            marginBottom: '24px',
            letterSpacing: '-1.5px',
            maxWidth: '960px',
          }}
        >
          {title}
        </div>

        {/* 글 설명 */}
        <div
          style={{
            fontSize: '24px',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.78)',
            lineHeight: 1.5,
            maxWidth: '860px',
          }}
        >
          {description.length > 80 ? description.slice(0, 80) + '…' : description}
        </div>

        {/* 하단 배지 */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginTop: '48px',
          }}
        >
          <div
            style={{
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '999px',
              padding: '10px 24px',
              fontSize: '20px',
              color: 'white',
              fontWeight: 700,
              border: '1px solid rgba(255,255,255,0.35)',
            }}
          >
            장사 팁
          </div>
          <div
            style={{
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '999px',
              padding: '10px 24px',
              fontSize: '20px',
              color: 'white',
              fontWeight: 700,
              border: '1px solid rgba(255,255,255,0.35)',
            }}
          >
            소상공인 필독
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '36px',
            right: '60px',
            fontSize: '20px',
            color: 'rgba(255,255,255,0.45)',
          }}
        >
          toolsajang.com
        </div>
      </div>
    ),
    { ...size }
  );
}
