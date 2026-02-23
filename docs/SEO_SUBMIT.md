# 툴사장 — 검색엔진 등록 가이드 (Google · Naver)

구글과 네이버 검색에 사이트를 등록하고, 사이트맵을 제출하는 절차입니다.

---

## 사전 준비 (이미 적용된 것)

- **sitemap.xml**: `https://도메인/sitemap.xml` — 툴·팁·정적 페이지 URL 자동 생성
- **robots.txt**: `https://도메인/robots.txt` — allow `/`, sitemap URL 포함
- **메타**: 각 페이지 title, description, Open Graph, canonical
- **JSON-LD**: WebSite, Organization, Article(팁 상세)
- **검증 메타 태그**: 환경 변수로 주입 가능 (아래 참고)

---

## 1. Google 검색 (Google Search Console)

### 1.1 사이트 등록

1. [Google Search Console](https://search.google.com/search-console) 접속
2. **속성 추가** → URL 접두어에 `https://toolsajang.com` (또는 실제 도메인) 입력
3. **소유권 확인** 방법 중 **HTML 태그** 선택
4. 예: `<meta name="google-site-verification" content="abc123..." />` 에서 `content` 값만 복사

### 1.2 환경 변수 설정

프로젝트 루트 `.env.local` (또는 Vercel 환경 변수)에 추가:

```env
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=여기에_발급받은_content_값
```

배포 후 루트 레이아웃 `<head>`에 해당 meta가 자동 주입됩니다. Search Console에서 **확인** 버튼 클릭.

### 1.3 사이트맵 제출

1. Search Console 왼쪽 메뉴 **색인 생성** → **Sitemaps**
2. **새 사이트맵 추가**에 `sitemap.xml` 입력 후 제출
3. URL은 `https://도메인/sitemap.xml` (경로만 넣어도 됨)

이후 Google이 주기적으로 sitemap을 읽고 페이지를 수집합니다.

---

## 2. 네이버 검색 (네이버 서치어드바이저)

### 2.1 사이트 등록

1. [네이버 서치어드바이저](https://searchadvisor.naver.com/) 접속 후 로그인
2. **사이트 등록** → 사이트 URL 입력 (예: `https://toolsajang.com`)
3. **소유 확인** 방법 중 **HTML 메타 태그** 선택
4. 예: `<meta name="naver-site-verification" content="xyz789..." />` 에서 `content` 값만 복사

### 2.2 환경 변수 설정

```env
NEXT_PUBLIC_NAVER_SITE_VERIFICATION=여기에_발급받은_content_값
```

배포 후 `<head>`에 meta가 주입됩니다. 서치어드바이저에서 **확인** 버튼 클릭.

### 2.3 사이트맵 제출

1. 등록된 사이트 선택 → **요청** → **사이트맵 제출**
2. 사이트맵 URL 입력: `https://도메인/sitemap.xml`
3. 제출 후 네이버가 크롤링 시 참고합니다.

### 2.4 네이버 추가 설정 (선택)

- **RSS 제출**: 블로그/콘텐츠가 있으면 RSS URL 제출 가능 (현재 툴사장은 정적 페이지 위주)
- **URL 직접 제출**: 중요 페이지 URL을 직접 제출해 수집 요청 가능

---

## 3. 동적 OG 이미지 (이미 적용됨)

SNS·카카오 등에서 링크 공유 시 미리보기 이미지는 **next/og ImageResponse**로 자동 생성됩니다.

| 경로 | OG 이미지 파일 |
|------|--------------|
| 홈 (`/`) | `src/app/opengraph-image.tsx` |
| 툴 (`/tools/[slug]`) | `src/app/tools/[slug]/opengraph-image.tsx` |
| 장사 팁 (`/tips/[slug]`) | `src/app/tips/[slug]/opengraph-image.tsx` |

- 별도 이미지 파일 없이 페이지마다 고유한 1200×630 OG 이미지가 동적으로 생성됩니다.
- 기존 `NEXT_PUBLIC_OG_IMAGE_URL` 환경 변수는 홈 루트 레이아웃 fallback으로만 사용합니다.

---

## 4. sitemap.xml 구조

`src/app/sitemap.ts`가 빌드 시 자동으로 생성하는 URL 목록:

| URL 유형 | 예시 |
|---------|------|
| 홈 | `https://toolsajang.com/` |
| 툴 목록 | `https://toolsajang.com/tools` |
| 개별 툴 | `https://toolsajang.com/tools/margin-calculator` |
| 장사 팁 목록 | `https://toolsajang.com/tips` |
| 개별 팁 | `https://toolsajang.com/tips/break-even-basics` |
| 정적 페이지 | `/about`, `/privacy`, `/terms` |

배포 후 `https://toolsajang.com/sitemap.xml`에서 전체 목록 확인 가능합니다.

---

## 5. 점검 체크리스트

| 항목 | 확인 |
|------|------|
| `NEXT_PUBLIC_SITE_URL`이 실제 도메인과 동일한지 | ✅ |
| Vercel 환경 변수에 `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` 설정됨 | ✅ |
| Vercel 환경 변수에 `NEXT_PUBLIC_NAVER_SITE_VERIFICATION` 설정됨 | ✅ |
| 배포 후 `https://도메인/sitemap.xml` 브라우저에서 열리는지 | ✅ |
| 배포 후 `https://도메인/robots.txt`에 sitemap URL이 있는지 | ✅ |
| 배포 후 view-source로 `google-site-verification` meta 확인 | ✅ |
| 배포 후 view-source로 `naver-site-verification` meta 확인 | ✅ |
| Google Search Console 소유권 확인 완료 | ✅ |
| Google에 sitemap 제출 완료 | ✅ |
| 네이버 서치어드바이저 소유권 확인 완료 | ✅ |
| 네이버에 sitemap 제출 완료 | ✅ |
| SNS 공유 시 OG 이미지(동적) 정상 표시 확인 | (선택 확인) |

---

## 6. 참고 링크

- [Google Search Console 도움말](https://support.google.com/webmasters)
- [네이버 서치어드바이저 가이드](https://searchadvisor.naver.com/guide)
- [Open Graph 디버거 (Facebook)](https://developers.facebook.com/tools/debug/)
- [카카오 OG 캐시 초기화](https://developers.kakao.com/tool/clear/og)
