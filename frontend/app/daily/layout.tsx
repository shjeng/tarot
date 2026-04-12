import type { Metadata } from "next";

// /daily 페이지 메타데이터 — "오늘의 운세" 키워드 최적화
export const metadata: Metadata = {
  title: "오늘의 타로 운세",
  description:
    "AI 고양이가 타로 카드 한 장으로 오늘 하루의 운세와 조언을 알려드립니다. 매일 무료로 오늘의 타로 카드를 뽑아보세요.",
  keywords: [
    "오늘의 운세",
    "오늘의 타로",
    "타로 카드",
    "무료 타로",
    "AI 운세",
    "일일 운세",
  ],
  alternates: { canonical: "https://necessitycat.com/daily" },
  openGraph: {
    title: "오늘의 타로 운세 | 고양이 점술관",
    description:
      "AI 고양이가 타로 카드 한 장으로 오늘 하루의 운세와 조언을 알려드립니다.",
    url: "https://necessitycat.com/daily",
  },
};

export default function DailyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
