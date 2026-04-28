import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: "/login" },
      { userAgent: "*", disallow: "/signup" },
      { userAgent: "*", disallow: "/onboarding" },
      { userAgent: "*", disallow: "/mypage" },
    ],
    sitemap: "https://necessitycat.com/sitemap.xml",
  };
}
