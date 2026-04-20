import type { Metadata } from "next";
import ReadingClient from "./ReadingClient";

export const metadata: Metadata = {
  title: "AI 사주타로 상담 | 고양이 점술관",
  description:
    "생년월일 사주로 타로 카드를 풀어드립니다. AI 사주타로 무료 상담, 연애운·직업운·재물운을 타로 카드로 지금 바로 확인하세요.",
  alternates: { canonical: "https://necessitycat.com/reading" },
  openGraph: {
    title: "AI 사주타로 상담 | 고양이 점술관",
    description:
      "생년월일 사주로 타로 카드를 풀어드립니다. AI 사주타로 무료 상담을 지금 바로 확인하세요.",
    url: "https://necessitycat.com/reading",
  },
};

export default function ReadingPage() {
  return <ReadingClient />;
}
