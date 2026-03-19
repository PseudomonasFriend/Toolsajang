# Toolsajang Improvements v2 - Work Plan

> Generated: 2026-03-19
> Branch: claude/elegant-jackson
> Worktree: C:\Projects_local\Toolsajang\.claude\worktrees\elegant-jackson

---

## Context

Toolsajang는 소상공인용 무료 비즈니스 계산기 플랫폼. 현재 25개 활성 계산기 + 52개 장사 팁 MDX. Next.js 16 App Router, Tailwind CSS, Vitest 210개 테스트 통과 상태. AdSense 승인 완료.

### 현재 상태 요약

| 항목 | 실제 수치 | CLAUDE.md 기재 |
|------|-----------|---------------|
| 활성 계산기 | 25종 | "19종" (outdated) |
| 장사 팁 | 52편 | "28개" (outdated) |
| 테스트 | 16파일 210개 PASS | 정상 |
| upcomingTools | 0 (전부 구현 완료) | - |
| node_modules (worktree) | 미설치 | - |

### 브랜치 상태

- **main**: `f9e7526` (최신)
- **claude/elegant-jackson**: main과 동일 (0 commits ahead)
- **claude/clever-stonebraker**: main보다 1 commit ahead (`e6f14f8` - SEO/접근성/테스트 6종)

---

## Work Objectives

1. clever-stonebraker 브랜치를 main에 머지하고 push
2. Core Web Vitals 최적화 (LCP, FID, CLS)
3. 계산기 25종 버그/누락 점검
4. 팁 52편 SEO 메타데이터 보강
5. sitemap.xml 최신화 (이미 동적 -- 검증만)
6. 접근성 개선 (aria-label, keyboard navigation)
7. 테스트 실행 및 실패 수정
8. 결과 문서 저장 + 커밋/push

---

## Guardrails

### Must Have
- pnpm build 성공
- vitest 전체 PASS
- eslint 0 에러
- 기존 UI/UX 깨지지 않음
- 모바일 우선 레이아웃 유지

### Must NOT Have
- 아키텍처 변경 (App Router 구조 유지)
- 새 의존성 추가 (CWV 최적화는 기존 Next.js 기능으로)
- any 타입 사용
- CSS Modules / inline styles 사용

---

## Task Flow

### Phase 1: 환경 준비 + 브랜치 정리 [순차]

**Step 1.1: clever-stonebraker 브랜치 머지**
- [ ] main에서 `git merge claude/clever-stonebraker` 실행
- [ ] 충돌 해결 (있을 경우)
- [ ] `git push origin main`
- Acceptance: main이 clever-stonebraker 커밋 포함, remote에 push 완료

**Step 1.2: elegant-jackson 워크트리에 main 반영 + 의존성 설치**
- [ ] `git merge main` 으로 최신 코드 반영
- [ ] `pnpm install` 실행
- [ ] `pnpm build` 성공 확인
- Acceptance: worktree에서 pnpm build + vitest 전체 PASS

### Phase 2: 코드 개선 [병렬 가능]

**Step 2.1: Core Web Vitals 최적화 (LCP, FID, CLS)**
- [ ] layout.tsx: AdSense/GA Script를 `strategy="lazyOnload"`로 변경 (LCP 개선)
- [ ] 이미지가 있는 곳에 width/height/priority 속성 확인 (CLS 방지)
- [ ] 동적 import로 무거운 클라이언트 컴포넌트 lazy load (FID 개선)
- [ ] font display: swap 확인 (Pretendard)
- Acceptance: Lighthouse Performance 점수 개선 또는 anti-pattern 제거 확인

**Step 2.2: 팁 52편 SEO 메타데이터 보강**
- [ ] tips/[slug]/page.tsx의 `generateMetadata`에 `keywords` 필드 추가 (frontmatter tags 매핑)
- [ ] OpenGraph에 `article:tag` 추가
- [ ] 52편 frontmatter에 누락된 필드 없는지 일괄 검증
- Acceptance: 모든 팁 페이지에 keywords + OG tags 포함

**Step 2.3: 접근성 개선**
- [ ] CalculatorLayout 브레드크럼 nav에 `aria-label="브레드크럼"` 추가
- [ ] 사이드바 관련 계산기/팁 링크에 descriptive aria-label 추가
- [ ] input 필드에 연결된 label 또는 aria-label 확인 (25개 계산기)
- [ ] 키보드 네비게이션: focusable 요소에 focus 스타일 확인
- [ ] MobileNav에 aria-label 및 현재 페이지 aria-current 추가
- Acceptance: 주요 페이지에서 aria 누락 0건, Tab 키로 모든 인터랙티브 요소 접근 가능

**Step 2.4: 계산기 25종 점검**
- [ ] 각 계산기 calculation.ts의 엣지 케이스 (0, 음수, 빈값) 처리 확인
- [ ] 테스트 커버리지 확인 -- 테스트 없는 계산기에 기본 테스트 추가
- [ ] CLAUDE.md 수치 갱신 ("19종" -> "25종", "28개" -> "52편")
- Acceptance: 기존 테스트 PASS + 누락 테스트 보충

### Phase 3: 검증 + 마무리 [순차]

**Step 3.1: sitemap + 빌드 검증**
- [ ] sitemap.ts가 25개 tool slug + 52개 tip slug 모두 포함하는지 확인
- [ ] `pnpm build` 성공
- [ ] `pnpm lint` 에러 0건
- [ ] `vitest run` 전체 PASS
- Acceptance: 빌드/린트/테스트 삼중 통과

**Step 3.2: 결과 문서 작성 + 커밋/push**
- [ ] `_bot/docs/toolsajang_improvements_v2.md`에 작업 결과 요약
- [ ] WORK_STATUS.md 업데이트
- [ ] 커밋 메시지: `feat: CWV 최적화 + SEO 보강 + 접근성 개선`
- [ ] push (HY 확인 필요 -- L3)
- Acceptance: 커밋 완료, 문서에 변경 사항 기록

---

## Success Criteria

1. clever-stonebraker 브랜치가 main에 머지되어 remote에 push됨
2. Core Web Vitals anti-pattern 제거 (lazy script, image sizing, font swap)
3. 52개 팁 페이지에 keywords 메타데이터 추가
4. 주요 UI 요소에 aria-label 추가, keyboard navigation 동작
5. 25개 계산기 정상 동작, 테스트 전체 PASS
6. sitemap이 25 tools + 52 tips 포함 확인
7. pnpm build + lint + vitest 삼중 통과
8. `_bot/docs/toolsajang_improvements_v2.md`에 결과 기록
9. 커밋 완료 (push는 HY 승인 후)

---

## Parallelization Map

```
Phase 1 (순차): Step 1.1 -> Step 1.2
                    |
Phase 2 (병렬): Step 2.1 | Step 2.2 | Step 2.3 | Step 2.4
                    |
Phase 3 (순차): Step 3.1 -> Step 3.2
```

Phase 2의 4개 작업은 서로 다른 파일을 수정하므로 병렬 실행 가능.

---

## Notes

- sitemap.ts는 이미 동적 (getAllToolSlugs + getTipsList)이므로 코드 수정 불필요. 빌드 시 자동 최신화.
- push는 L3 (HY 승인 필요). 커밋까지만 자율 진행.
- CLAUDE.md의 "19종" / "28개" 수치는 outdated -- 갱신 필요.
- 팁 frontmatter에는 `keywords` 필드가 없지만, `tags`가 동일 역할. `generateMetadata`에서 tags를 keywords로 매핑하면 됨.
