# 고양이 타로 프론트엔드 디자인 스펙

**작성일:** 2026-03-25
**대상:** `tarot/tarot/frontend`
**컨셉:** 빈티지 점술관 — 딥네이비 + 문스톤 실버 + 낡은 금

---

## 1. 제약사항

- **기존 로직 수정 금지** — API 호출, 상태 관리, 데이터 흐름 일체 변경 없음
- 디자인(색상, 타이포, 아이콘, 텍스트 카피)만 수정
- 모든 파일 경로는 `tarot/tarot/frontend/` 기준

---

## 2. 색상 팔레트 (`app/globals.css`)

`:root` (라이트모드) 블록 변경:

```css
:root {
  --background: #0a0f2e;
  --foreground: #c0c8e0;
  --primary: #c0c8e0;        /* 문스톤 실버 */
  --primary-foreground: #0a0f2e;
  --secondary: #e8d5a3;      /* 낡은 금 */
  --secondary-foreground: #0a0f2e;
  --accent: #7c9cbf;         /* 문블루 */
  --accent-foreground: #0a0f2e;
  --border: #2a3a6e;         /* 새로 추가 */
}
```

`@media (prefers-color-scheme: dark)` 블록도 동일한 값으로 교체:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0f2e;
    --foreground: #c0c8e0;
    --primary: #c0c8e0;
    --primary-foreground: #0a0f2e;
    --secondary: #e8d5a3;
    --accent: #7c9cbf;
    --accent-foreground: #0a0f2e;
    --border: #2a3a6e;
  }
}
```

`@theme` 블록에 `--border`와 serif 폰트 변수 추가:

```css
@theme {
  /* 기존 내용 유지 + 아래 두 줄 추가 */
  --color-border: var(--border);
  --font-serif: var(--font-noto-serif-kr);
}
```

`--primary` 변경의 cascade 효과: `hover:text-primary`, `border-primary/20`, 스크롤바 등 기존에 보라색이던 모든 요소가 실버로 바뀜. 이는 의도된 동작 (네이비+실버 테마 통일).

스크롤바 색상 업데이트:
```css
::-webkit-scrollbar-thumb {
  background: var(--accent);   /* 문블루로 변경 */
}
::-webkit-scrollbar-thumb:hover {
  background: var(--primary);  /* 실버로 변경 */
}
```

---

## 3. 타이포그래피 (`app/layout.tsx`)

Noto Serif KR 추가 로드:

```typescript
import { Geist, Geist_Mono, Noto_Serif_KR } from "next/font/google";

const notoSerifKr = Noto_Serif_KR({
  variable: "--font-noto-serif-kr",
  subsets: ["latin"],
  weight: ["400", "700"],
});
```

`<body>` className에 변수 추가:
```typescript
className={`${geistSans.variable} ${geistMono.variable} ${notoSerifKr.variable} antialiased ...`}
```

metadata 업데이트:
```typescript
export const metadata: Metadata = {
  title: "고양이 점술관",
  description: "별빛이 흐르는 밤, 고양이가 점을 봐드립니다.",
};
```

---

## 4. Header (`components/layout/Header.tsx`)

변경 내용:
- import: `Sparkles` → `Cat`
- 브랜드 아이콘: `<Sparkles className="h-6 w-6 text-primary" />` → `<Cat className="h-6 w-6 text-primary" />`
- 브랜드명: `"Mystic Tarot"` → `"고양이 점술관"` + `font-serif` 클래스 추가

```tsx
import { Cat } from 'lucide-react';

<Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
    <Cat className="h-6 w-6 text-primary" />
    <span className="text-xl font-bold font-serif bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        고양이 점술관
    </span>
</Link>
```

---

## 5. Footer (`components/layout/Footer.tsx`)

변경 내용:
- import `Cat` from lucide-react 추가
- 저작권 텍스트: `"© 2026 Mystic Tarot"` → `"© 2026 고양이 점술관"`
- 저작권 텍스트 앞에 `<Cat className="inline w-3 h-3 mr-1" />` 추가

```tsx
import { Cat } from 'lucide-react';

<p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
    <Cat className="inline w-3 h-3 mr-1" />
    © 2026 고양이 점술관. All rights reserved.
</p>
```

---

## 6. Card.tsx 뒷면 (`components/tarot/Card.tsx`)

변경 대상: 카드 뒷면 div (line 52~64 기준)

```tsx
{/* Card Back */}
<div
    className="absolute inset-0 backface-hidden rounded-xl border-2 border-secondary/30 bg-gradient-to-br from-[#0a0f2e] via-[#0d1535] to-[#0a1628] flex items-center justify-center overflow-hidden"
    style={{ backfaceVisibility: "hidden" }}
>
    <div className="absolute inset-2 border border-secondary/20 rounded-lg opacity-50" />
    <div className="absolute inset-4 border border-secondary/10 rounded-lg opacity-30" />
    <div className="w-16 h-16 rounded-full border-2 border-primary/40 flex items-center justify-center">
        <div className="w-10 h-10 rotate-45 border border-primary/30" />
    </div>
    <div className="absolute bottom-4 text-secondary/60 text-xs tracking-[0.2em] font-serif">
        고양이 점술관
    </div>
</div>
```

변경 요약:
- 배경 그라디언트: 퍼플 계열 → 딥네이비 계열
- 동심 사각형 테두리: `border-secondary/20`, `border-secondary/10` 유지 (낡은 금 느낌 유지)
- 원형 장식: `border-secondary/40` → `border-primary/40` (실버)
- 내부 사각형: `border-secondary/30` → `border-primary/30` (실버)
- 텍스트: `"MYSTIC"` → `"고양이 점술관"`, `font-serif` 추가

---

## 7. 홈 페이지 (`app/page.tsx`)

변경 내용:
- import: `Sparkles` 제거, `Cat` 추가 (`Moon`, `Star`는 이미 import됨)
- 히어로 아이콘 (line 22): `<Sparkles className="w-12 h-12 text-secondary animate-pulse" />` → `<Cat className="w-12 h-12 text-secondary animate-pulse" />`
- AI 타로 상담 카드 아이콘 (line 51): `<Sparkles className="w-8 h-8 text-accent ...">` → `<Star className="w-8 h-8 text-accent ..." />`
- h1 텍스트: `"미스틱 타로"` → `"고양이 점술관"` + `font-serif` 클래스
- 서브 카피 (line 29~31): 기존 텍스트 → `"별빛이 흐르는 밤, 고양이가 점을 봐드립니다."`
- 두 카드 링크: `rounded-2xl` → `rounded-md` (양쪽 모두)

---

## 8. Daily 페이지 (`app/daily/page.tsx`)

변경 내용:
- `Moon` import 추가 (lucide-react)
- 인트로 단계 이모티콘 `🔮` → `<Moon className="w-8 h-8 text-accent" />`
- 결과 단계 타이틀 `"오늘의 카드"` 앞에 `<Moon className="inline w-5 h-5 mr-2 text-accent" />` 추가

---

## 9. Reading 페이지 (`app/reading/page.tsx`)

변경 내용:
- import: `{ ArrowLeft, Sparkles, Send }` → `{ ArrowLeft, Star, Send }` (`Sparkles` 완전 제거, `Star` 추가)
- 파일 내 `<Sparkles ... />` 두 곳 모두 `<Star ... />` 로 교체 (클래스명은 그대로 유지)
- AI 결과 박스 배경: `bg-secondary/5` → `bg-[#0d1535]`
- AI 결과 박스 테두리: `border-secondary/20` → `border-[#c0c8e0]/20`

---

## 10. 변경하지 않는 것

- API 호출 로직 일체
- 상태 관리 (useState, useEffect)
- 라우팅 구조
- 타로 카드 데이터 (tarotCards.ts)
- 애니메이션 로직 (Framer Motion variants, transition 설정)
- 폼 유효성 검사
- `ShuffleAnimation.tsx` (미사용 파일, 변경 불필요)
