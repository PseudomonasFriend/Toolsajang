import { ImageResponse } from 'next/og';
import { getToolModule } from '@/tools';

// getToolModule이 ComponentType을 포함하므로 nodejs runtime 사용
export const runtime = 'nodejs';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** 카테고리별 배경 색상 */
function getCategoryColors(category: string): { from: string; to: string } {
  switch (category) {
    case '재무/회계':
      return { from: '#1d4ed8', to: '#1e3a8a' };
    case '매장운영':
      return { from: '#0f766e', to: '#134e4a' };
    case '마케팅':
      return { from: '#7c3aed', to: '#4c1d95' };
    case '유틸리티':
      return { from: '#b45309', to: '#78350f' };
    default:
      return { from: '#1d4ed8', to: '#1e3a8a' };
  }
}

/** 카테고리별 아이콘 */
function getCategoryEmoji(category: string): string {
  switch (category) {
    case '재무/회계':
      return '💰';
    case '매장운영':
      return '🏪';
    case '마케팅':
      return '📣';
    case '유틸리티':
      return '🔧';
    default:
      return '🧮';
  }
}

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const mod = getToolModule(slug);

  const toolName = mod?.meta.name ?? '비즈니스 툴';
  const toolDesc = mod?.meta.description ?? '소상공인을 위한 무료 계산 도구';
  const category = mod?.meta.category ?? '유틸리티';

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
            top: '-100px',
            right: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-60px',
            right: '80px',
            width: '240px',
            height: '240px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
          }}
        />

        {/* 상단 브랜드 + 카테고리 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '48px',
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
              color: 'rgba(255,255,255,0.8)',
              fontWeight: 500,
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            {emoji} {category}
          </div>
        </div>

        {/* 툴 이름 */}
        <div
          style={{
            fontSize: '72px',
            fontWeight: 900,
            color: 'white',
            lineHeight: 1.1,
            marginBottom: '24px',
            letterSpacing: '-2px',
            maxWidth: '900px',
          }}
        >
          {toolName}
        </div>

        {/* 툴 설명 */}
        <div
          style={{
            fontSize: '28px',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.8)',
            lineHeight: 1.5,
            maxWidth: '800px',
          }}
        >
          {toolDesc}
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
            무료 사용
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
            로그인 불필요
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
