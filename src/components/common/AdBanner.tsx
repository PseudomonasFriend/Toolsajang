import { getCustomAdByPosition } from '@/data/ads';
import Image from 'next/image';

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

  /* AdSense — 승인 전에는 빈 상태 */
  if (!process.env.NEXT_PUBLIC_ADSENSE_ID) return null;

  return (
    <div className={className}>
      <div className="text-center">
        <span className="mb-1 inline-block text-[10px] text-gray-400">
          광고
        </span>
        <ins
          className="adsbygoogle block"
          data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
          data-ad-slot={position}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
