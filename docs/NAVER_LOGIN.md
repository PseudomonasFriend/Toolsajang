# 네이버 로그인 (OAuth) — 추후 구현 예정

> **현재**: 툴사장에는 네이버 로그인 기능이 구현되어 있지 않습니다.  
> **추후** 구현할 때 아래 설정·흐름을 참고하면 됩니다.

툴사장에서 "네이버로 로그인"을 사용하려면 네이버 개발자 센터에서 앱을 등록하고, 콜백 URL과 환경 변수를 설정해야 합니다.

---

## 1. 네이버 개발자 센터에서 앱 등록

1. [네이버 개발자 센터](https://developers.naver.com) 로그인
2. **Application** → **애플리케이션 등록**
3. **애플리케이션 이름**: 예) 툴사장
4. **사용 API**: **네이버 로그인** 선택
5. **비로그인 오픈API 서비스 환경** (선택 사항)
6. **환경 추가**:
   - **웹**: 서비스 URL에 **사이트 주소** 입력  
     - 로컬: `http://localhost:3000`  
     - 배포: `https://도메인`
   - **콜백 URL**에 아래 주소 **그대로** 등록 (환경별로 하나씩):
     - 로컬: `http://localhost:3000/auth/naver/callback`
     - 배포: `https://도메인/auth/naver/callback`
7. 등록 후 **Client ID**, **Client Secret** 확인

---

## 2. 환경 변수 설정

서버에서만 사용하므로 **NEXT_PUBLIC_** 를 붙이지 않습니다.

```env
# .env.local (로컬) 또는 Vercel Environment Variables (배포)

# 필수 — 네이버 로그인
NAVER_CLIENT_ID=발급받은_Client_ID
NAVER_CLIENT_SECRET=발급받은_Client_Secret

# 콜백 URL 계산에 사용 (이미 있다면 그대로 사용)
NEXT_PUBLIC_SITE_URL=http://localhost:3000   # 로컬
# NEXT_PUBLIC_SITE_URL=https://도메인         # 배포
```

- **로컬**: `.env.local`에 넣고 `pnpm dev` 재시작
- **배포**: Vercel 프로젝트 → Settings → Environment Variables에 추가 후 재배포

---

## 3. 동작 확인

1. `pnpm dev` 실행 후 브라우저에서 **http://localhost:3000/login** 접속
2. **네이버로 로그인** 버튼 클릭 → 네이버 로그인 화면으로 이동
3. 네이버에서 로그인·동의 후 → 툴사장 **/auth/naver/callback** 으로 돌아옴
4. "로그인 성공" 화면에서 닉네임·이메일 등이 표시되면 정상 동작

---

## 4. 경로 정리

| 경로 | 설명 |
|------|------|
| `/login` | 로그인 페이지. "네이버로 로그인" 버튼 표시 |
| `/api/auth/naver/authorize` | 로그인 시작 시 호출. 네이버 인증 URL 반환 |
| `/auth/naver/callback` | 네이버에서 리다이렉트되는 콜백. 토큰 교환 후 프로필 표시 |

---

## 5. 문제 해결

- **"NAVER_CLIENT_ID가 설정되지 않았습니다"**  
  → `.env.local`에 `NAVER_CLIENT_ID`가 있는지, 서버 재시작 후인지 확인

- **콜백에서 "로그인 처리 실패"**  
  → `NAVER_CLIENT_SECRET` 확인, 네이버 앱에 등록한 **콜백 URL**이 `NEXT_PUBLIC_SITE_URL/auth/naver/callback` 과 **완전히 일치**하는지 확인 (끝에 `/` 없이)

- **네이버에서 "일시적인 오류"**  
  → 개발자 센터에서 해당 환경(웹)에 **콜백 URL**이 등록되어 있는지 확인
