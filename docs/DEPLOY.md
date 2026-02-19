# 툴사장 — GitHub 연결 & Vercel 배포 가이드

> **현재**: GitHub `PseudomonasFriend/Toolsajang` 연동 완료. `main` 푸시 시 Vercel 자동 배포.

---

## 1. GitHub 저장소 만들기

1. **GitHub** (https://github.com) 로그인
2. 우측 상단 **+** → **New repository**
3. 설정:
   - **Repository name**: `Toolsajang` (또는 원하는 이름)
   - **Public** 선택
   - **Add a README file** 체크 해제 (이미 로컬에 코드가 있음)
   - **Create repository** 클릭
4. 생성 후 나오는 **저장소 URL** 복사  
   - HTTPS: `https://github.com/내아이디/Toolsajang.git`  
   - SSH: `git@github.com:내아이디/Toolsajang.git`

---

## 2. 로컬 프로젝트를 GitHub에 푸시

터미널(PowerShell)을 **프로젝트 폴더**에서 연 뒤 아래 순서대로 실행하세요.

### 2.1 원격 저장소 연결

```powershell
cd c:\Projects_local\Toolsajang

# 아래 주소를 본인 GitHub 저장소 주소로 바꾸세요
git remote add origin https://github.com/내아이디/Toolsajang.git
```

### 2.2 기본 브랜치 이름을 main으로 (선택)

GitHub 기본 브랜치가 `main`이므로 맞추려면:

```powershell
git branch -M main
```

### 2.3 푸시

```powershell
git push -u origin main
```

- 처음 한 번은 GitHub 로그인(또는 토큰) 입력이 필요할 수 있습니다.
- 완료되면 GitHub 저장소에 코드가 올라갑니다.

---

## 3. Vercel에 배포하기

### 3.1 Vercel 가입·로그인

1. https://vercel.com 접속
2. **Sign Up** → **Continue with GitHub** 로그인 (권장)
3. GitHub 계정 권한 허용

### 3.2 새 프로젝트 만들기 (GitHub 연동)

1. Vercel 대시보드에서 **Add New…** → **Project**
2. **Import Git Repository**에서 방금 푸시한 **Toolsajang** 저장소 선택
3. **Import** 클릭

### 3.3 프로젝트 설정 (대부분 기본값 그대로)

| 항목 | 권장 값 |
|------|---------|
| **Framework Preset** | Next.js (자동 감지됨) |
| **Root Directory** | `./` (기본) |
| **Build Command** | `pnpm build` 또는 비워두기 (자동) |
| **Output Directory** | 비워두기 (Next.js 기본) |
| **Install Command** | `pnpm install` (pnpm 사용 시) |

- **Environment Variables**는 나중에 GA, AdSense 등 넣을 때 추가하면 됩니다.
- **Deploy** 클릭

### 3.4 배포 완료

- 빌드가 끝나면 **Visit** 버튼으로 사이트 URL 확인
- 예: `https://toolsajang-xxxx.vercel.app`
- 이후 **GitHub에 push할 때마다** Vercel이 자동으로 다시 배포합니다.

---

## 4. (선택) 커스텀 도메인

- Vercel 프로젝트 → **Settings** → **Domains**
- `toolsajang.com` 등 도메인 추가 후 DNS 설정 안내에 따라 CNAME 등 설정

---

## 5. (선택) 환경 변수

GA, AdSense, 검색엔진 등록 등을 쓰려면:

1. Vercel 프로젝트 → **Settings** → **Environment Variables**
2. 예시:
   - `NEXT_PUBLIC_SITE_URL` = `https://본인도메인.vercel.app` (또는 커스텀 도메인) — **권장**
   - `NEXT_PUBLIC_GA_ID` = `G-XXXXXXXXXX`
   - `NEXT_PUBLIC_ADSENSE_ID` = `ca-pub-XXXXXXX`
   - `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` = Google Search Console 소유 확인용 content 값
   - `NEXT_PUBLIC_NAVER_SITE_VERIFICATION` = 네이버 서치어드바이저 소유 확인용 content 값
   - `NEXT_PUBLIC_OG_IMAGE_URL` = 공유 미리보기 이미지 전체 URL (예: `https://도메인/og.png`)
   - **메뉴명 아이디어 툴 (서버 전용)**  
     `GEMINI_API_KEY`, `GROQ_API_KEY` (선택: `OPENROUTER_API_KEY`) — Vercel에 등록 시 클라이언트에 노출되지 않음
   - **네이버 로그인 (추후 구현 예정)**  
     구현 시 `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET` 사용. [docs/NAVER_LOGIN.md](./NAVER_LOGIN.md) 참고.

저장 후 **Redeploy** 하면 반영됩니다. **구글·네이버 검색 등록 절차**는 [docs/SEO_SUBMIT.md](./SEO_SUBMIT.md) 참고.

---

## 요약 체크리스트

- [ ] GitHub에 새 저장소 생성 (README 추가 안 함)
- [ ] 로컬에서 `git remote add origin (저장소URL)` 실행
- [ ] `git branch -M main` 후 `git push -u origin main` 실행
- [ ] Vercel 로그인 → Import Git Repository → Toolsajang 선택
- [ ] Deploy 클릭 후 배포 URL 확인
