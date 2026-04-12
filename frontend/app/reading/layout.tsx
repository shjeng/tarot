import type { Metadata } from "next";

// /reading 페이지 메타데이터 — "사주타로", "타로 상담" 키워드 최적화
export const metadata: Metadata = {
  title: "AI 사주타로 상담",
  description:
    "생년월일과 사주 정보를 바탕으로 AI 고양이가 타로 카드 3장으로 깊이 있는 사주타로 상담을 제공합니다. 과거·현재·미래를 타로로 풀어보세요.",
  keywords: [
    "사주타로",
    "타로 상담",
    "AI 타로 리딩",
    "타로 3장 스프레드",
    "사주",
    "무료 타로 상담",
    "타로 운세",
  ],
  alternates: { canonical: "https://necessitycat.com/reading" },
  openGraph: {
    title: "AI 사주타로 상담 | 고양이 점술관",
    description:
      "생년월일과 사주 정보를 바탕으로 AI 고양이가 타로 카드 3장으로 사주타로 상담을 제공합니다.",
    url: "https://necessitycat.com/reading",
  },
};

export default function ReadingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
