import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = '툴사장 - 사장님을 위한 무료 비즈니스 툴';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 60%, #1e3a8a 100%)',
          fontFamily: '"Noto Sans KR", "Apple SD Gothic Neo", sans-serif',
          position: 'relative',
        }}
      >
        {/* 배경 패턴 */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.08,
            backgroundImage:
              'radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* 로고 영역 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '32px',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              background: 'white',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }}
          >
            <span style={{ fontSize: '40px' }}>🧮</span>
          </div>
          <span
            style={{
              fontSize: '52px',
              fontWeight: 900,
              color: 'white',
              letterSpacing: '-1px',
            }}
          >
            툴사장
          </span>
        </div>

        {/* 메인 설명 */}
        <div
          style={{
            fontSize: '32px',
            fontWeight: 700,
            color: 'rgba(255,255,255,0.95)',
            marginBottom: '16px',
            textAlign: 'center',
          }}
        >
          사장님을 위한 무료 비즈니스 툴
        </div>
        <div
          style={{
            fontSize: '22px',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.75)',
            textAlign: 'center',
            maxWidth: '800px',
          }}
        >
          마진 계산기 · 부가세 · 손익분기점 · 배달 수수료 · 19개 무료 툴
        </div>

        {/* 하단 태그 */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginTop: '40px',
          }}
        >
          {['로그인 불필요', '즉시 사용', '소상공인 특화'].map((tag) => (
            <div
              key={tag}
              style={{
                background: 'rgba(255,255,255,0.18)',
                borderRadius: '999px',
                padding: '8px 20px',
                fontSize: '18px',
                color: 'white',
                fontWeight: 600,
                border: '1px solid rgba(255,255,255,0.3)',
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* 하단 URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '32px',
            right: '48px',
            fontSize: '18px',
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          toolsajang.com
        </div>
      </div>
    ),
    { ...size }
  );
}
