# Open Questions

## toolsajang-improvements-v2 - 2026-03-19
- [ ] push 승인 여부 — main에 clever-stonebraker 머지 후 push는 L3 (HY 승인 필요). 자동 배포 트리거됨.
- [ ] AdSense Script strategy 변경 시 광고 노출 영향 — `afterInteractive` -> `lazyOnload`로 변경하면 LCP 개선되지만, 광고 첫 노출 지연 가능. 수익 영향 판단 필요.
- [ ] clever-stonebraker worktree 정리 — 머지 후 worktree 삭제할지, 유지할지 결정 필요.
- [ ] 테스트 없는 계산기 목록 확인 필요 — 현재 16개 테스트 파일 vs 25개 계산기. 약 9개 계산기에 테스트 부재 가능. 전부 추가할지 우선순위 높은 것만 할지 결정.
