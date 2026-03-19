import { getCustomAdByPosition } from '@/data/ads';
import Image from 'next/image';
import AdSenseUnit from '@/components/common/AdSenseUnit';

interface AdBannerProps {
  position: string;
  type: 'adsense' | 'custom';
  className?: string;
}

/** 광고 배너 컴포넌트 — AdSense 또는 커스텀 배너 표시 */
export default function AdBanner({ position, type, className }: AdBannerProps) {
  if (type === 'custom') {
    const ad = getCustomAdByPosition(position);
    if (!ad) return null;

    return (
      <div className={className}>
        <div className="text-center">
          <span className="mb-1 inline-block text-[10px] text-gray-400">
            AD
          </span>
          <a
            href={ad.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={ad.altText}
          >
            <Image
              src={ad.imageUrl}
              alt={ad.altText}
              width={480}
              height={80}
              className="mx-auto rounded-lg"
            />
          </a>
        </div>
      </div>
    );
  }

  /* AdSense — 승인 전에는 ins 태그만 유지 (자동 광고가 채움) */
  const adClient = process.env.NEXT_PUBLIC_ADSENSE_ID;
  if (!adClient) return null;

  return (
    <div className={className}>
      {/* min-h로 광고 로드 전 레이아웃 공간 확보 — CLS 방지 */}
      <div className="min-h-[120px] text-center">
        <span className="mb-1 inline-block text-[10px] text-gray-400">
          광고
        </span>
        {/* adsbygoogle.push()는 클라이언트 컴포넌트에서 처리 */}
        <AdSenseUnit position={position} adClient={adClient} />
      </div>
    </div>
  );
}
