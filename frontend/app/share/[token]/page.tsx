import type { Metadata } from "next";
import { ShareContent, NotFoundContent } from "./ShareContent";
import type { SharedReading } from "./types";

// 백엔드에서 공유 리딩 데이터를 직접 조회 (서버사이드)
async function fetchSharedReading(token: string): Promise<SharedReading | null> {
  try {
    const res = await fetch(`http://localhost:5000/api/tarot/share/${token}`, {
      // 공유 데이터는 변경되지 않으므로 캐시 활용
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// ─── OG 메타태그 동적 생성 ───────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: Promise<{ token: string }> }
): Promise<Metadata> {
  const { token } = await params;
  const data = await fetchSharedReading(token);

  const baseUrl = "https://necessitycat.com";
  const pageUrl = `${baseUrl}/share/${token}`;
  // app/opengraph-image.tsx 컨벤션으로 자동 생성되는 경로
  const defaultImage = `${baseUrl}/opengraph-image`;

  if (!data) {
    return {
      title: "리딩을 찾을 수 없다냥",
      description: "공유 링크가 만료되었거나 존재하지 않습니다.",
    };
  }

  const isSpread = data.type === "spread";

  // 카드명 조합
  const cardNames = isSpread
    ? data.request_data.cards?.map(c => c.nameKo).join(", ") ?? ""
    : data.request_data.card?.nameKo ?? "";

  // OG 제목: 타입 + 카드명
  const title = cardNames
    ? `${isSpread ? "사주타로 리딩" : "오늘의 운세"} — ${cardNames} | 고양이 점술관`
    : `${isSpread ? "사주타로 리딩" : "오늘의 운세"} | 고양이 점술관`;

  // OG 설명: 질문 또는 리딩 첫 문장(최대 120자)
  const rawDesc = isSpread && data.request_data.question
    ? data.request_data.question
    : data.reading.replace(/[#*_`>]/g, "").trim().slice(0, 120);
  const description = rawDesc + (rawDesc.length >= 120 ? "…" : "");

  return {
    title,
    description,
    openGraph: {
      type: "article",
      locale: "ko_KR",
      url: pageUrl,
      siteName: "고양이 점술관",
      title,
      description,
      images: [
        {
          url: defaultImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [defaultImage],
    },
    alternates: { canonical: pageUrl },
  };
}

// ─── 페이지 ─────────────────────────────────────────────────────────────────

export default async function SharePage(
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const data = await fetchSharedReading(token);

  // 로딩 없이 서버에서 이미 데이터를 받아오므로 바로 렌더링
  if (!data) {
    return <NotFoundContent />;
  }

  return <ShareContent data={data} />;
}
