import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { BlogPost } from '@/types';

const TIPS_DIR = path.join(process.cwd(), 'src', 'data', 'tips');

/** 모든 장사 팁 slug 목록 (generateStaticParams용) */
export function getAllTipSlugs(): string[] {
  if (!fs.existsSync(TIPS_DIR)) return [];
  return fs
    .readdirSync(TIPS_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));
}

/** 프론트매터 → 메타 객체 */
function frontmatterToMeta(slug: string, data: Record<string, unknown>): BlogPost {
  return {
    slug,
    title: (data.title as string) ?? '',
    description: (data.description as string) ?? '',
    date: (data.date as string) ?? '',
    category: (data.category as string) ?? '',
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    thumbnail: data.thumbnail as string | undefined,
    author: (data.author as string) ?? '툴사장',
    published: (data.published as boolean) ?? true,
    relatedTools: data.relatedTools as string[] | undefined,
  };
}

/** 장사 팁 목록 (최신순, published만) */
export function getTipsList(): BlogPost[] {
  const slugs = getAllTipSlugs();
  const list: BlogPost[] = [];

  for (const slug of slugs) {
    const filePath = path.join(TIPS_DIR, `${slug}.mdx`);
    if (!fs.existsSync(filePath)) continue;
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(raw);
    const meta = frontmatterToMeta(slug, data as Record<string, unknown>);
    if (meta.published) list.push(meta);
  }

  list.sort((a, b) => (b.date > a.date ? 1 : -1));
  return list;
}

/** 최신 N개 (홈 미리보기용) */
export function getLatestTips(limit: number): BlogPost[] {
  return getTipsList().slice(0, limit);
}

/** slug로 장사 팁 한 건 조회 (메타 + 본문) */
export function getTipBySlug(slug: string): {
  meta: BlogPost;
  content: string;
} | null {
  const filePath = path.join(TIPS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const meta = frontmatterToMeta(slug, data as Record<string, unknown>);
  if (!meta.published) return null;
  return { meta, content };
}
