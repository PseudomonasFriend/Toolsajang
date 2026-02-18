import { redirect } from 'next/navigation';

/** 예전 URL /blog → /tips 로 리다이렉트 */
export default function BlogRedirect() {
  redirect('/tips');
}
