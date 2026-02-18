# 툴별 모듈 폴더 + 병렬 에이전트 개발 설계

> 각 툴을 폴더로 구분하고, 폴더 안에 해당 툴만 설명하는 MD를 두어 서로 다른 에이전트가 동시에 개발할 수 있게 하는 방안 정리.

---

## 1. 목표

- **툴별 폴더**: 한 툴 = 한 폴더. 해당 툴의 UI·계산·타입·문서가 그 안에만 있음.
- **툴 전용 MD**: 에이전트가 “이 폴더만 읽고” 그 툴만 구현/수정할 수 있도록 명세 제공.
- **병렬 개발**: 두 에이전트가 서로 다른 툴 폴더만 수정하면 **같은 파일을 건드리지 않아** 충돌 최소화.

---

## 2. 제안 디렉터리 구조

```
src/
  tools/                          # 툴 모듈 루트
    _meta.ts                      # (선택) slug 목록만 export. 또는 폴더 스캔으로 대체
    margin-calculator/
      README.md                   # 이 툴만의 명세 (입력/출력/UI/계산식)
      calculation.ts              # 이 툴 계산 로직
      types.ts                    # (선택) 이 툴 전용 타입
      MarginCalculator.tsx        # UI 컴포넌트
      index.ts                    # 메타 + 컴포넌트 export
    vat-calculator/
      README.md
      calculation.ts
      VatCalculator.tsx
      index.ts
    break-even-calculator/
      ...
  app/
    tools/
      [slug]/
        page.tsx                  # 동적: slug로 툴 로드 (한 파일만 유지)
  components/
    common/                       # CalculatorLayout, AdBanner 등 공통
    layout/                       # Header, Footer 등
  data/
    tools.ts                      # 툴 목록(메타) — 아래 3번 참고
  types/
    index.ts                      # 공통 타입만 (Tool, AdSlot 등)
```

- **툴별로 독립**: `margin-calculator/`, `vat-calculator/` 등 **서로 다른 에이전트가 각각 한 폴더만 담당**하면 됨.
- **공통은 최소한만**: `components/common`, `components/layout`, `types/index.ts`, `app/tools/[slug]/page.tsx` 정도만 공유.

---

## 3. 병렬 개발 시 충돌 지점과 해결

| 구분 | 충돌 가능성 | 대응 |
|------|-------------|------|
| **툴 폴더 내부** (README, calculation, UI, index) | 없음 | 툴마다 폴더가 다르므로 에이전트 A/B가 각각 다른 폴더만 수정 |
| **`data/tools.ts`** (툴 목록·메타) | 있음 | 새 툴 추가 시 같은 파일에 한 줄씩 추가 → **툴별 파일로 분리** (아래 4번) |
| **`lib/calculations.ts`** | 있음 | 툴별 계산을 **각 툴 폴더의 calculation.ts**로 이동. 공통 lib는 유틸만 |
| **`types/index.ts`** (툴별 입출력 타입) | 있음 | 툴 전용 타입은 **각 툴 폴더의 types.ts**로 이동. 공통 타입만 `types/index.ts`에 유지 |
| **`app/tools/[slug]/page.tsx`** | 없음 | 동적 라우트 한 개만 두고, slug로 툴 로드. 수정 빈도 낮음 |
| **`ToolCard` 아이콘** | 약함 | 새 툴용 아이콘 추가 시 한 파일 수정 → 아이콘 매핑을 툴 메타(icon 이름) 기반으로 두고, 새 아이콘만 추가하는 규칙으로 최소화 |

정리하면:

- **“한 툴 = 한 폴더”** 로 묶고,
- **툴 목록**은 툴별 메타 파일을 모아서 한 곳에서 읽거나, 단일 `tools.ts`를 “슬러그만 추가”하는 방식으로 규칙을 정하면,
- **대부분의 수정이 툴 폴더 안으로만** 들어가서 병렬 작업이 가능해짐.

---

## 4. 툴 목록(메타) 분리로 충돌 줄이기

**현재**: `data/tools.ts` 하나에 모든 툴이 배열로 있음 → 새 툴 추가 시마다 같은 파일 수정.

**제안**: 툴 메타를 “툴별 한 파일”로 두고, 목록은 그걸 모아서 생성.

```
data/
  tools/
    index.ts              # getActiveTools(), getToolBySlug(), tools 배열 re-export
    margin-calculator.ts  # 마진 계산기 메타만 export
    vat-calculator.ts     # 부가세 계산기 메타만 export
```

- 에이전트 A: `margin-calculator` 툴 작업 → `tools/margin-calculator/` + `data/tools/margin-calculator.ts` 만 수정.
- 에이전트 B: `vat-calculator` 툴 작업 → `tools/vat-calculator/` + `data/tools/vat-calculator.ts` 만 수정.
- `data/tools/index.ts`는 “새 툴 메타 파일을 import 하고 배열에 넣는” 한 줄을 추가할 때만 충돌. 필요하면 나중에 **폴더 스캔/glob**으로 자동화해도 됨.

---

## 5. 각 툴 폴더 안의 README.md (툴 전용 명세)

에이전트가 “이 툴만” 개발할 때 참고할 수 있도록, **해당 툴만** 설명하는 MD를 권장.

**포함할 내용 예시:**

- 툴 이름, 한 줄 설명
- 입력 필드 (이름, 타입, 필수/선택, 단위, 기본값)
- 출력 항목 (이름, 계산식 또는 설명)
- 계산식/로직 요약 (또는 calculation.ts와 동기화하라는 안내)
- UI 요구사항 (실시간 계산 여부, 접이식 영역, 버튼, 복사/초기화 등)
- 관련 콘텐츠/키워드 (블로그 연결용)

**공통 레이아웃/디자인**은 메인 명세(`Toolsajang_spec.md`) 또는 `claude.md`에서 참조하도록 하고, 툴 MD에는 “CalculatorLayout 사용, 모바일 퍼스트” 정도만 언급.

이렇게 하면:

- 에이전트는 **해당 툴 폴더의 README + 같은 폴더의 calculation/UI** 만 보면 되고,
- 공통 규칙은 상위 문서에서 한 번만 읽으면 됨.

---

## 6. 동적 라우트와 툴 로딩

- `app/tools/[slug]/page.tsx` 한 개만 두고,
- `slug`로 `getToolBySlug(slug)` 호출 → 메타 조회,
- 해당 툴의 컴포넌트는 **동적 import** 또는 **slug → 컴포넌트 맵**으로 로드.

예시 (맵 방식):

- `src/tools/index.ts`에서 각 툴의 `index.ts`를 import 해서 `slug → { meta, Component }` 맵을 만든다.
- 페이지에서는 이 맵에서 `slug`에 해당하는 `Component`와 `meta`를 쓰고, `CalculatorLayout`으로 감싼다.

이 경우 “새 툴 추가” 시:

- **옵션 A**: `tools/index.ts`에 새 툴 한 줄 추가 → 이 파일만 두 에이전트가 동시에 수정할 때 충돌 가능.
- **옵션 B**: 툴 폴더를 나열한 배열만 두고, `page.tsx`에서 `slug`로 동적 `import(\`@/tools/${slug}\`)` 하면, 새 툴은 **폴더만 추가**하고 맵 수정을 안 해도 됨 (다만 Next 동적 import 경로 제한 이슈는 확인 필요).

실무적으로는 **옵션 A + 툴별 메타 파일** 조합이 단순하고, “한 번에 한 툴만 배포” 라면 충돌을 관리하기 쉬움.

---

## 7. 요약: “가능한가?”

- **가능함.**  
  - 툴별 폴더 + 폴더 안에 해당 툴만 설명하는 MD를 두고,  
  - 계산/타입/UI를 툴 폴더 안으로 모으면,  
  - 서로 다른 에이전트가 **서로 다른 툴 폴더만** 수정하는 한 병렬 개발이 가능함.

- **추가로 하면 좋은 것**
  - 툴 목록을 `data/tools.ts` 한 파일이 아니라 **툴별 메타 파일**로 쪼개기.
  - 계산 로직을 `lib/calculations.ts` 한 곳이 아니라 **툴 폴더의 calculation.ts**로 이동.
  - 툴 전용 타입을 **툴 폴더의 types.ts**로 이동.
  - `app/tools/[slug]/page.tsx` 한 개로 동적 라우팅.

- **각 툴 README.md**에는 그 툴의 입·출력, 계산식, UI 요구사항만 적어 두면, 에이전트가 그 폴더만 보고 개발할 수 있음.

이렇게 구성하면 “파일 구분하는 폴더 + 각 툴 설명 MD”로, 각 툴을 서로 다른 에이전트가 병렬로 개발하는 구조를 만들 수 있다.
