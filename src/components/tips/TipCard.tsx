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
      className="group block rounded-2xl bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md active:scale-[0.98]"
      aria-label={`${tip.title} 글 보기`}
    >
      <h3 className="line-clamp-2 font-bold text-gray-900 leading-tight transition-colors group-hover:text-blue-600">{tip.title}</h3>
      <p className="mt-1.5 line-clamp-2 text-sm text-gray-500 leading-snug">
        {tip.description}
      </p>
      <p className="mt-3 text-xs font-medium text-gray-400">{tip.date}</p>
    </Link>
  );
}
