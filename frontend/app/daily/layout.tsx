import type { Metadata } from "next";

// /daily 페이지 메타데이터 — 롱테일 키워드 최적화
export const metadata: Metadata = {
  title: "오늘의 타로 카드 한 장 뽑기 | 무료 AI 타로 운세",
  description:
    "오늘 타로 뽑기 무료로 해보세요. AI 고양이가 타로 카드 한 장으로 오늘 하루의 운세와 조언을 알려드립니다. 매일 달라지는 오늘의 타로 카드 운세를 지금 확인하세요.",
  keywords: [
    "오늘 타로 뽑기",
    "오늘의 타로 카드",
    "타로 카드 한 장",
    "오늘의 운세 무료",
    "AI 타로 운세",
    "무료 타로 뽑기",
    "일일 타로",
    "오늘 운세 보기",
  ],
  alternates: { canonical: "https://necessitycat.com/daily" },
  openGraph: {
    title: "오늘의 타로 카드 한 장 뽑기 | 무료 AI 타로 운세",
    description:
      "오늘 타로 뽑기 무료로 해보세요. AI 고양이가 타로 카드 한 장으로 오늘 하루의 운세와 조언을 알려드립니다.",
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
