import Link from 'next/link';
import AdBanner from '@/components/common/AdBanner';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white pb-20 md:pb-6">
      {/* 푸터 배너 슬롯 */}
      <div className="mx-auto max-w-3xl px-4 pt-4">
        <AdBanner position="footer-banner" type="custom" />
      </div>

      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="flex flex-col items-center gap-3 text-center text-sm text-gray-500">
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-gray-700">
              개인정보처리방침
            </Link>
            <Link href="/terms" className="hover:text-gray-700">
              이용약관
            </Link>
            <Link href="/about" className="hover:text-gray-700">
              서비스 소개
            </Link>
          </div>
          <p>&copy; {new Date().getFullYear()} 툴사장. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
