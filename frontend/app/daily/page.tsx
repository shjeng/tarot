import type { Metadata } from "next";
import DailyClient from "./DailyClient";

export const metadata: Metadata = {
  title: "오늘의 타로 운세 | 고양이 점술관",
  description:
    "오늘의 타로 카드 한 장으로 하루 운세를 확인하세요. 무료로 오늘의 타로 리딩, AI 타로 카드 운세를 지금 바로 뽑아보세요.",
  alternates: { canonical: "https://necessitycat.com/daily" },
  openGraph: {
    title: "오늘의 타로 운세 | 고양이 점술관",
    description:
      "오늘의 타로 카드 한 장으로 하루 운세를 확인하세요. 무료 AI 타로 리딩.",
    url: "https://necessitycat.com/daily",
  },
};

export default function DailyPage() {
  return (
    <>
      {/* 서버 렌더링 되는 정적 콘텐츠 — AdSense/SEO용 */}
      <section className="max-w-2xl mx-auto mb-8 text-center space-y-3">
        <h1 className="text-2xl font-bold font-serif">오늘의 타로 카드 운세</h1>
        <p className="text-sm text-muted-foreground leading-relaxed px-4 break-keep">
          매일 한 장의 타로 카드를 뽑아 오늘 하루의 운세와 조언을 확인하세요.
          22장의 메이저 아르칸아 카드 중 하나가 당신에게 별내는 메시지를 전달합니다.
          별도 가입 없이 무료로 이용할 수 있으며, AI 고양이가 카드의 의미를 쉽게 풀어드립니다.
        </p>
      </section>

      <DailyClient />

      {/* 하단 설명 */}
      <section className="max-w-2xl mx-auto mt-16 space-y-6 text-sm text-muted-foreground">
        <h2 className="font-bold text-base text-foreground font-serif">오늘의 운세 보는 방법</h2>
        <ol className="list-decimal list-inside space-y-2 leading-relaxed break-keep">
          <li>마음을 가라앉히고 오늘 하루에 대해 집중하세요.</li>
          <li>&quot;카드 셔플하기&quot; 버튼을 눌러 카드를 섞습니다.</li>
          <li>마음이 이끄는 카드를 한 장 선택합니다.</li>
          <li>선택한 카드의 키워드와 AI 고양이의 조언을 확인하세요.</li>
        </ol>
        <h2 className="font-bold text-base text-foreground font-serif pt-4">메이저 아르칸아와 오늘의 운세</h2>
        <p className="leading-relaxed break-keep">
          타로의 메이저 아르칸아 22장은 인간의 삶과 영적 성장을 상징하는 카드들입니다.
          0번 광대의 순수한 시작부터 21번 세계의 완성까지, 각 카드는 오늘 당신에게 필요한
          메시지를 담고 있습니다. 같은 카드가 나와도 매일 다른 상황에서 새로운 의미로 다가옵니다.
        </p>
      </section>
    </>
  );
}
