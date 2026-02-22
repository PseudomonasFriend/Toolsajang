# 툴사장 — 작업 현황 (WORK STATUS)

> 최종 업데이트: 2026-02-22 (WORK_STATUS 정리 — 완료 Phase 축소)

---

## 완료된 작업

### Phase 1: MVP
### Phase 2: 장사 팁 + 콘텐츠·SEO
### Phase 3: 수익화 인프라
### 문서화
### 테스트 (Vitest 16종 210개 단위 테스트 전부 통과)
- Phase 4: 툴 확장 (카테고리 필터, 5종 계산기 추가, AI 툴, Rate Limiting)
- AI 툴 비활성화 (가게명·메뉴명 isActive: false, getActiveTools() 적용)
- 인프라: 도메인 연결 (toolsajang.com), 누락 파일 4개 git 추가, vitest.config.ts 수정
- AdSense 코드 직접 삽입 + ads.txt 반영 + GDPR 동의 메시지 + 계정 등록
- privacy/terms noindex 제거 + OG/canonical 추가 + sitemap 반영
- og:image per page — 홈/툴/팁 동적 OG 이미지 (next/og ImageResponse)
- Google Search Console·네이버 서치어드바이저 사이트 등록 및 sitemap 제출

---

## 미완성 / 추후 진행

### Phase 5: 장기 (선택)
- [ ] 로그인·계산 결과 저장
- [ ] **네이버 로그인 (OAuth)** — 추후 구현 예정 (참고: docs/NAVER_LOGIN.md)
- [ ] 유료 프리미엄 툴
- [ ] 사장님 커뮤니티

### AdSense 승인 (잔여 항목)
- [ ] AdSense 심사 통과 대기 (1~7일)
- [ ] 승인 후 광고 슬롯 ID 세부 설정

### 기타
- [ ] 자사 배너 이미지·링크 실제 등록 (ads.ts)

---

## 현재 상태 요약

| 항목 | 상태 |
|------|------|
| **배포** | Vercel + Cloudflare DNS (toolsajang.com), main 푸시 시 자동 배포 |
| **툴** | 17개 활성 (AI 2개 비활성), Rate Limiting 적용 |
| **장사 팁** | 28개 글, 목록/상세/홈 미리보기·가독성 스타일 적용 |
| **OG 이미지** | 홈/툴/팁 동적 OG 이미지 자동 생성 (next/og) |
| **SEO** | sitemap, robots, JSON-LD, OG 이미지, Google·네이버 등록 완료 |
| **광고/분석** | AdSense 코드 직접 삽입 (ca-pub-6162400610480124), ads.txt 반영, 심사 대기 중 |
| **테스트** | Vitest 16종 210개 단위 테스트 전부 통과 |
