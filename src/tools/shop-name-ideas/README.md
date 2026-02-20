# 가게명 아이디어 툴

## 개요

AI를 활용해 소상공인·자영업자가 가게 상호명 아이디어를 얻을 수 있는 툴.
업종, 컨셉, 키워드, 톤을 입력하면 Gemini → Groq → OpenRouter 순서로 폴백하여 가게명 후보를 추천한다.

- **slug**: `shop-name-ideas`
- **카테고리**: 마케팅
- **API 엔드포인트**: `POST /api/tools/shop-name-ideas`

## 입력 항목

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| businessType | string | ✅ | 업종. 예: 카페, 치킨집, 네일샵 |
| concept | string | ❌ | 컨셉/분위기. 예: 아늑한, 고급스러운 |
| keywords | string | ❌ | 키워드. 예: 꽃, 달, 제주 |
| tone | string | ❌ | 톤. 감성/심플/재치/프리미엄/친근/모던/레트로 |
| count | number | ✅ | 추천 개수 (5~15, 기본 8) |

## 출력 항목

| 항목 | 설명 |
|------|------|
| suggestions | 가게명 후보 배열 |
| provider | 사용된 AI 프로바이더 (gemini/groq/openrouter) |

## AI 프로바이더 우선순위

1. **Gemini** (`GEMINI_API_KEY` 환경 변수 설정 시)
2. **Groq** (`GROQ_API_KEY` 환경 변수 설정 시)
3. **OpenRouter** (`OPENROUTER_API_KEY` 환경 변수 설정 시)

## UI 동작 규칙

- 업종 필드는 필수, 나머지는 선택 입력
- 추천 개수는 슬라이더로 조절 (5~15개)
- API 요청 중 로딩 스피너 표시
- 각 결과 항목에 클립보드 복사 버튼 제공 (복사 완료 시 "완료" 텍스트로 1.5초 피드백)
- 상표·저작권 유의사항 안내 메시지 표시

## 파일 구조

```
src/tools/shop-name-ideas/
  README.md          # 이 파일
  types.ts           # ShopNameInput, ShopNameOutput, TONES 상수
  ShopNameIdeas.tsx  # UI 컴포넌트 ('use client')
  index.ts           # meta, seo, Component export
```

## 관련 파일

- `src/lib/llm/index.ts` — suggestShopNames 함수
- `src/lib/llm/types.ts` — ShopNameRequest, ShopNameResponse 타입
- `src/app/api/tools/shop-name-ideas/route.ts` — API 라우트
