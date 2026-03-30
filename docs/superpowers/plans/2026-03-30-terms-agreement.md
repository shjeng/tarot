# Terms Agreement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 회원가입 시 서비스 이용약관·개인정보 처리방침 동의 체크박스를 추가하고, 미동의 시 이메일·소셜 가입을 모두 차단한다.

**Architecture:** SignupTab에 두 개의 필수 약관 체크박스 state를 추가하고, 소셜 버튼과 이메일 폼 제출을 모두 약관 동의 여부로 게이팅한다. 약관 전문은 각각 `/terms`, `/privacy` 정적 페이지로 제공한다.

**Tech Stack:** Next.js 14 (App Router), React, Tailwind CSS, Framer Motion

---

### Task 1: 서비스 이용약관 페이지 생성

**Files:**
- Create: `frontend/app/terms/page.tsx`

- [ ] **Step 1: 파일 생성**

```tsx
// frontend/app/terms/page.tsx
export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold font-serif mb-2">서비스 이용약관</h1>
      <p className="text-sm text-muted-foreground mb-8">최종 수정일: 2026년 3월 30일</p>

      <section className="space-y-6 text-sm leading-relaxed text-foreground/80">
        <div>
          <h2 className="font-semibold text-base text-foreground mb-2">제1조 (목적)</h2>
          <p>
            이 약관은 고양이 점술관(이하 "서비스")이 제공하는 타로 점술 서비스의 이용과 관련하여
            서비스와 이용자 간의 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-base text-foreground mb-2">제2조 (용어의 정의)</h2>
          <p>
            "서비스"란 고양이 점술관이 제공하는 타로 카드 리딩, 운세 해석 등 일체의 콘텐츠 및
            기능을 의미합니다. "이용자"란 본 약관에 따라 서비스를 이용하는 회원 및 비회원을
            말합니다.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-base text-foreground mb-2">제3조 (약관의 효력 및 변경)</h2>
          <p>
            본 약관은 서비스 화면에 게시하거나 이용자에게 공지함으로써 효력이 발생합니다.
            서비스는 합리적인 사유가 있는 경우 약관을 변경할 수 있으며, 변경된 약관은 공지 후
            7일 이후부터 효력이 발생합니다.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-base text-foreground mb-2">제4조 (서비스의 제공)</h2>
          <p>
            서비스는 타로 카드 기반의 운세 및 점술 콘텐츠를 제공합니다. 제공되는 모든 콘텐츠는
            오락 및 참고 목적으로만 활용되어야 하며, 실제 의사 결정의 근거로 사용되어서는
            안 됩니다. 서비스는 운영상·기술상 필요한 경우 서비스를 일시 중단할 수 있습니다.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-base text-foreground mb-2">제5조 (이용자의 의무)</h2>
          <p>
            이용자는 다음 행위를 하여서는 안 됩니다: ① 서비스 내 콘텐츠의 무단 복제·배포,
            ② 타인의 정보 도용, ③ 서비스 운영을 방해하는 행위, ④ 기타 관계 법령에 위반되는
            행위.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-base text-foreground mb-2">제6조 (면책)</h2>
          <p>
            서비스에서 제공하는 타로 및 운세 콘텐츠는 오락 목적의 참고 자료이며, 서비스는
            해당 콘텐츠의 정확성·신뢰성에 대해 보증하지 않습니다. 이용자가 콘텐츠를 신뢰하여
            발생한 손해에 대해 서비스는 책임을 지지 않습니다.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-base text-foreground mb-2">제7조 (준거법 및 관할)</h2>
          <p>
            본 약관은 대한민국 법률에 따라 해석되며, 서비스 이용과 관련한 분쟁은 대한민국
            법원을 전속 관할로 합니다.
          </p>
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: 브라우저에서 `/terms` 접속하여 렌더링 확인**

- [ ] **Step 3: 커밋**

```bash
git add frontend/app/terms/page.tsx
git commit -m "feat: 서비스 이용약관 페이지 추가"
```

---

### Task 2: 개인정보 처리방침 페이지 생성

**Files:**
- Create: `frontend/app/privacy/page.tsx`

- [ ] **Step 1: 파일 생성**

```tsx
// frontend/app/privacy/page.tsx
export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold font-serif mb-2">개인정보 처리방침</h1>
      <p className="text-sm text-muted-foreground mb-8">최종 수정일: 2026년 3월 30일</p>

      <section className="space-y-6 text-sm leading-relaxed text-foreground/80">
        <div>
          <h2 className="font-semibold text-base text-foreground mb-2">제1조 (수집하는 개인정보)</h2>
          <p>
            서비스는 회원가입 및 서비스 제공을 위해 다음 정보를 수집합니다:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>필수: 이메일 주소</li>
            <li>소셜 로그인 시: 소셜 계정의 이메일 및 프로필 정보(이름, 프로필 이미지)</li>
            <li>자동 수집: 서비스 이용 기록, 접속 로그</li>
          </ul>
        </div>

        <div>
          <h2 className="font-semibold text-base text-foreground mb-2">제2조 (개인정보 수집 및 이용 목적)</h2>
          <p>수집된 개인정보는 다음 목적으로만 이용됩니다:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>회원 식별 및 계정 관리</li>
            <li>서비스 이용 내역 저장 및 제공</li>
            <li>서비스 관련 공지 및 안내</li>
          </ul>
        </div>

        <div>
          <h2 className="font-semibold text-base text-foreground mb-2">제3조 (개인정보 보유 및 이용 기간)</h2>
          <p>
            개인정보는 회원 탈퇴 시 즉시 파기됩니다. 단, 관계 법령에 따라 보존이 필요한
            경우 해당 기간 동안 보관됩니다.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-base text-foreground mb-2">제4조 (개인정보 제3자 제공)</h2>
          <p>
            서비스는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.
            단, 법령에 의한 요청이 있는 경우는 예외로 합니다.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-base text-foreground mb-2">제5조 (개인정보 처리 위탁)</h2>
          <p>
            서비스는 원활한 서비스 제공을 위해 아래와 같이 개인정보 처리를 위탁합니다:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Supabase Inc. — 인증 및 데이터베이스 관리</li>
          </ul>
        </div>

        <div>
          <h2 className="font-semibold text-base text-foreground mb-2">제6조 (이용자의 권리)</h2>
          <p>
            이용자는 언제든지 자신의 개인정보를 조회·수정·삭제할 수 있습니다. 개인정보와
            관련한 문의는 서비스 내 문의 채널을 통해 연락하시기 바랍니다.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-base text-foreground mb-2">제7조 (쿠키 사용)</h2>
          <p>
            서비스는 이용자 인증 및 세션 유지를 위해 쿠키를 사용합니다. 브라우저 설정을 통해
            쿠키 저장을 거부할 수 있으나, 이 경우 로그인 등 일부 기능이 제한될 수 있습니다.
          </p>
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: 브라우저에서 `/privacy` 접속하여 렌더링 확인**

- [ ] **Step 3: 커밋**

```bash
git add frontend/app/privacy/page.tsx
git commit -m "feat: 개인정보 처리방침 페이지 추가"
```

---

### Task 3: SignupTab에 약관 동의 체크박스 추가

**Files:**
- Modify: `frontend/app/login/page.tsx` — SignupTab 컴포넌트

- [ ] **Step 1: SignupTab state에 약관 동의 2개 추가**

`SignupTab` 함수 상단 state 선언부를 다음으로 교체:

```tsx
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirm, setConfirm] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);
const [done, setDone] = useState(false);
const [agreeTerms, setAgreeTerms] = useState(false);
const [agreePrivacy, setAgreePrivacy] = useState(false);
```

`allAgreed` 헬퍼 상수를 state 선언 바로 아래 추가:

```tsx
const allAgreed = agreeTerms && agreePrivacy;
```

- [ ] **Step 2: 소셜 버튼 클릭 시 약관 미동의 차단**

`handleSocial` 함수 맨 앞에 가드 추가:

```tsx
const handleSocial = async (provider: "google" | "kakao") => {
  if (!allAgreed) {
    setError("약관에 동의해야 가입할 수 있다냥.");
    return;
  }
  setError("");
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  if (error) setError("소셜 가입에 실패했다냥. 다시 시도해 주세요.");
};
```

- [ ] **Step 3: 이메일 가입 폼 제출 시 약관 미동의 차단**

`handleSignup` 함수 맨 앞에 가드 추가:

```tsx
const handleSignup = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!allAgreed) {
    setError("약관에 동의해야 가입할 수 있다냥.");
    return;
  }
  if (password !== confirm) {
  // ... 기존 코드 그대로
```

- [ ] **Step 4: 폼 UI에 체크박스 추가**

`<form>` 내부의 `{error && ...}` 위에 다음 JSX 삽입:

```tsx
{/* 약관 동의 */}
<div className="space-y-2 pt-1">
  <label className="flex items-start gap-2 cursor-pointer group">
    <input
      type="checkbox"
      checked={agreeTerms}
      onChange={(e) => setAgreeTerms(e.target.checked)}
      className="mt-0.5 accent-primary shrink-0"
    />
    <span className="text-xs text-muted-foreground leading-relaxed">
      <span className="text-accent font-medium">[필수]</span>{" "}
      <a
        href="/terms"
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-foreground transition-colors"
      >
        서비스 이용약관
      </a>
      에 동의합니다
    </span>
  </label>
  <label className="flex items-start gap-2 cursor-pointer group">
    <input
      type="checkbox"
      checked={agreePrivacy}
      onChange={(e) => setAgreePrivacy(e.target.checked)}
      className="mt-0.5 accent-primary shrink-0"
    />
    <span className="text-xs text-muted-foreground leading-relaxed">
      <span className="text-accent font-medium">[필수]</span>{" "}
      <a
        href="/privacy"
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-foreground transition-colors"
      >
        개인정보 처리방침
      </a>
      에 동의합니다
    </span>
  </label>
</div>
```

- [ ] **Step 5: 가입 버튼에 `disabled` 조건 추가**

기존:
```tsx
disabled={loading}
```
교체:
```tsx
disabled={loading || !allAgreed}
```

- [ ] **Step 6: 소셜 버튼 시각적 피드백 — `SocialButtons`에 `disabled` prop 전달**

`SocialButtons` 컴포넌트 props 타입에 `disabled?: boolean` 추가:

```tsx
function SocialButtons({
  onGoogle,
  onKakao,
  label,
  disabled,
}: {
  onGoogle: () => void;
  onKakao: () => void;
  label: "로그인" | "시작하기";
  disabled?: boolean;
}) {
```

각 버튼에 `disabled={disabled}` 및 `disabled:opacity-50` 클래스 추가:

```tsx
<button
  type="button"
  onClick={onGoogle}
  disabled={disabled}
  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white text-gray-800 text-sm font-medium hover:bg-gray-50 transition-colors border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
>
```

```tsx
<button
  type="button"
  onClick={onKakao}
  disabled={disabled}
  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#FEE500] text-[#191919] text-sm font-bold hover:bg-[#FDD800] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
>
```

- [ ] **Step 7: SignupTab 내 `SocialButtons` 호출에 `disabled` 전달**

```tsx
<SocialButtons
  onGoogle={() => handleSocial("google")}
  onKakao={() => handleSocial("kakao")}
  label="시작하기"
  disabled={!allAgreed}
/>
```

- [ ] **Step 8: 동작 확인**
  - 약관 미체크 상태에서 소셜 버튼이 흐릿하게 표시되는지 확인
  - 약관 미체크 상태에서 가입 버튼이 비활성화되는지 확인
  - 두 약관 모두 체크 후 버튼이 활성화되는지 확인
  - `/terms`, `/privacy` 링크가 새 탭으로 열리는지 확인

- [ ] **Step 9: 커밋**

```bash
git add frontend/app/login/page.tsx
git commit -m "feat: 회원가입 약관 동의 체크박스 추가 및 미동의 시 가입 차단"
```
