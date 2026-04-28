import type { Metadata } from "next";
import ReadingClient from "./ReadingClient";

export const metadata: Metadata = {
  title: "고양이 타로 상담",
  description:
    "생년월일 사주로 타로 카드를 풀어드립니다. 사주타로 무료 상담, 연애운·직업운·재물운을 타로 카드로 지금 바로 확인하세요.",
  alternates: { canonical: "https://necessitycat.com/reading" },
  openGraph: {
    title: "고양이 타로 상담 | 고양이 점술관",
    description:
      "생년월일 사주로 타로 카드를 풀어드립니다. AI 사주타로 무료 상담을 지금 바로 확인하세요.",
    url: "https://necessitycat.com/reading",
  },
};

export default function ReadingPage() {
  return (
    <>
      {/* 서버 렌더링 되는 정적 콘텐츠 — AdSense/SEO용 */}
      <section className="max-w-2xl mx-auto mb-8 text-center space-y-3">
        <h1 className="text-2xl font-bold font-serif">AI 사주타로 상담</h1>
        <p className="text-sm text-muted-foreground leading-relaxed px-4 break-keep">
          생년월일과 사주를 바탕으로 타로 카드를 해석하는 맞춤형 상담입니다.
          과거·현재·미래를 나타내는 3장의 카드를 선택하면,
          AI 고양이가 당신의 사주 기운과 타로 상징을 결합하여 깊이 있는 해석을 전달합니다.
          연애운, 직업운, 재물운 등 구체적인 고민에 대해 무료로 상담 받아보세요.
        </p>
      </section>

      <ReadingClient />

      {/* 하단 설명 */}
      <section className="max-w-2xl mx-auto mt-16 space-y-6 text-sm text-muted-foreground">
        <h2 className="font-bold text-base text-foreground font-serif">사주타로 상담이란?</h2>
        <p className="leading-relaxed break-keep">
          사주타로는 동양 사주의 오행 기운과 서양 타로의 상징을 결합한 현대적 점술 방식입니다.
          단순한 운세 예측을 넘어, 당신이 처한 상황의 근본적인 원인과 앞으로의 흐름을
          다각도로 조명합니다. 3장의 스프레드(과거·현재·미래)를 통해
          현재 고민이 어디에서 비롯되었는지, 어떻게 풀어나가면 좋을지에 대한 통찰을 얻을 수 있습니다.
        </p>
        <h2 className="font-bold text-base text-foreground font-serif pt-4">상담 진행 순서</h2>
        <ol className="list-decimal list-inside space-y-2 leading-relaxed break-keep">
          <li>생년월일과 성별을 입력합니다. (프로필에 저장된 정보는 자동으로 불러옵니다)</li>
          <li>구체적인 고민이나 질문을 자세히 적어주세요.</li>
          <li>과거·현재·미래를 나타내는 카드를 차례로 3장 선택합니다.</li>
          <li>AI가 사주와 타로를 교차 분석하여 개인화된 해석 결과를 보여줍니다.</li>
          <li>결과는 마이페이지에 저장되며, 공유 링크로 친구와 함께 볼 수도 있습니다.</li>
        </ol>
      </section>
    </>
  );
}
