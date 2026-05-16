# AGENTS.md — Toolsajang Codex 동작 규약

> **실내용(기술스택·빌드·파일구조·코딩규칙)은 [`PROJECT.md`](PROJECT.md)에 있다.** 이 파일은 Codex 전용 동작 규약 + 포인터만 담는다.
>
> **작업 시작 순서**:
> 1. [`WORK_STATUS.md`](WORK_STATUS.md) — 현재 작업 현황
> 2. [`PROJECT.md`](PROJECT.md) — 기술스택·빌드·파일맵·코딩규칙
> 3. 이 `AGENTS.md` — Codex 전용 규약
> 4. 계산기별 작업 시: 해당 `src/tools/[slug]/README.md`
>
> 문서와 코드가 충돌하면 실제 코드와 테스트를 우선하고, 필요한 문서 갱신은 별도 변경으로 남긴다.

## Windows 검색·셸 규칙

- `rg` 사용 금지 (이 환경에서 `Access is denied` / `ResourceUnavailable` 반복 발생 → 정책상 unavailable)
- 파일 목록: `Get-ChildItem`
- 텍스트 검색: `Select-String`
- 파일 읽기: `Get-Content -Encoding UTF8`
- 넓은 검색은 먼저 경로·파일 패턴을 좁힌 뒤 PowerShell로 수행

## 검증

기본 검증:

```powershell
pnpm test
```

배포 준비 검증:

```powershell
pnpm build
```

`pnpm build`가 로컬 `node_modules` 전이 의존성 누락으로 실패하면 코드 실패로 단정하지 말고 dependency restore가 필요한 환경 blocker로 분류한다:

```powershell
pnpm install --frozen-lockfile
pnpm build
```

## Git / 배포 경계

- 로컬 커밋은 가능하다.
- 원격 `push`와 배포 실행은 HY 승인 전 금지.
- Vercel은 GitHub `main` push 시 자동 배포되므로 push는 배포 행위로 본다.
- `.env*`, secret, token, API key, 계정 권한 정보는 읽거나 출력하거나 커밋하지 않는다.
- `.omc/`, `.playwright-cli/`, `output/`, `test-results/`, `.next/`, `node_modules/`는 생성물로 취급한다.

## ARIA 위임 기준

- 작업 전 baseline `git status` 확인.
- ARIA 또는 Codex worker가 만든 파일만 명시적으로 stage한다.
- 기존 사용자 변경과 겹치는 파일은 자동 덮어쓰지 않는다.
- 생성물성 untracked 파일만 있는 상태는 작업 차단 사유가 아니다.
- 검증 결과와 커밋 여부를 `WORK_STATUS.md` 또는 ARIA lifecycle에 남긴다.
