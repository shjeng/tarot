import type { Metadata } from "next";

// /reading 페이지 메타데이터 — 롱테일 키워드 최적화
export const metadata: Metadata = {
  title: "생년월일로 보는 AI 사주타로 상담 | 무료 타로 3장 리딩",
  description:
    "생년월일 타로 상담 무료로 받아보세요. AI 고양이가 사주 정보를 바탕으로 타로 카드 3장 리딩으로 과거·현재·미래를 풀어드립니다. 무료 AI 타로 상담 지금 시작하세요.",
  keywords: [
    "생년월일 타로 상담",
    "사주타로 무료",
    "AI 타로 리딩 무료",
    "타로 3장 스프레드",
    "무료 타로 상담",
    "사주 타로 보기",
    "AI 사주타로",
    "타로 카드 상담",
  ],
  alternates: { canonical: "https://necessitycat.com/reading" },
  openGraph: {
    title: "생년월일로 보는 AI 사주타로 상담 | 무료 타로 3장 리딩",
    description:
      "생년월일 타로 상담 무료로 받아보세요. AI 고양이가 사주 정보를 바탕으로 타로 카드 3장으로 과거·현재·미래를 풀어드립니다.",
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
