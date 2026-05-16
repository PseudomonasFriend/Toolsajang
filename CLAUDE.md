# CLAUDE.md — Toolsajang Claude 동작 규약

> **실내용(기술스택·빌드·파일구조·코딩규칙)은 [`PROJECT.md`](PROJECT.md)에 있다.** 이 파일은 Claude 전용 동작 규약 + 포인터만 담는다.
>
> **작업 시작 전 반드시 함께 읽는다**:
> - [`PROJECT.md`](PROJECT.md) — 프로젝트 실내용 (기술스택·빌드·파일맵·코딩규칙)
> - [`WORK_STATUS.md`](WORK_STATUS.md) — 현재 작업 현황 및 체크리스트
> - 계산기별 작업 시: 해당 `src/tools/[slug]/README.md`

## Claude 전용 동작 규약

- **OMC 오케스트레이션**: 글로벌 `~/.claude/CLAUDE.md` 카탈로그 기반 서브에이전트 위임.
  - 코드 변경 → `executor` (복잡한 자율 작업은 `deep-executor`)
  - 설계·계획 → `planner` / `architect`
  - 검증 → `verifier` (`pnpm test` 269개 통과 + `pnpm build` 통과 후 완료 선언)
- **서브에이전트 완료 후**: `/post-work` 스킬 실행.
- **응답 스타일**: 결론·변동사항만. 코드는 diff/경로만. 인삿말·요약 생략.
- **병렬 도구 호출**: 의존성 없는 작업은 한 응답에서 다중 tool_use로 동시 실행.
- **신규 툴 추가**: `.claude/skills/toolsajang-new-tool.md` 읽기.

## HQ 지시사항

전략·목표·우선순위 확인 시 `.claude/skills/toolsajang-hq.md` 읽기.
