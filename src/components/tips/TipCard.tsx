import Link from 'next/link';
import type { BlogPost } from '@/types';

interface TipCardProps {
  tip: BlogPost;
}

/** 장사 팁 목록용 카드 */
export default function TipCard({ tip }: TipCardProps) {
  return (
    <Link
      href={`/tips/${tip.slug}`}
      className="block rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
      aria-label={`${tip.title} 글 보기`}
    >
      <h3 className="line-clamp-2 font-semibold text-gray-900">{tip.title}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-gray-500">
        {tip.description}
      </p>
      <p className="mt-2 text-xs text-gray-400">{tip.date}</p>
    </Link>
  );
}
