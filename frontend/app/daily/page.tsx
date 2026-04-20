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
  return <DailyClient />;
}
