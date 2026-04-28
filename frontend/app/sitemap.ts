import type { MetadataRoute } from "next";
import { majorArcana } from "@/data/tarotCards";

const BASE_URL = "https://necessitycat.com";

// Next.js 자동 sitemap 생성 — /sitemap.xml 경로로 서빙됨
export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/daily`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/reading`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/tarot-cards`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  // 메이저 아르칸아 22장 개별 페이지
  const cardRoutes: MetadataRoute.Sitemap = majorArcana.map((card) => ({
    url: `${BASE_URL}/tarot-cards/${encodeURIComponent(card.nameKo)}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...routes, ...cardRoutes];
}
