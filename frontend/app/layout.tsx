import type { Metadata } from "next";
import { Nanum_Gothic } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import AdSenseScript from "@/components/AdSenseScript";

const GA_MEASUREMENT_ID = "G-EDEWNTEKQD";

const nanumGothic = Nanum_Gothic({
  variable: "--font-nanum-gothic",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "고양이 점술관 | AI 타로 · 사주타로 · 오늘의 운세",
    template: "%s | 고양이 점술관",
  },
  description:
    "AI 고양이가 타로 카드와 사주로 오늘의 운세를 풀어드립니다. 묣로 AI 타로 리딩, 사주타로, 오늘의 타로 카드 운세를 지금 바로 확인하세요.",
  keywords: [
    "타로",
    "사주타로",
    "AI 타로",
    "오늘의 운세",
    "타로 리딩",
    "묣로 타로",
    "사주",
    "타로 카드",
    "운세",
    "AI 운세",
    "고양이 타로",
  ],
  authors: [{ name: "고양이 점술관" }],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://necessitycat.com",
    siteName: "고양이 점술관",
    title: "고양이 점술관 | AI 타로 · 사주타로 · 오늘의 운세",
    description:
      "AI 고양이가 타로 카드와 사주로 오늘의 운세를 풀어드립니다. AI 타로 리딩, 사주타로 상담을 지금 바로 확인하세요.",
    images: [
      {
        url: "https://necessitycat.com/meta_image.png",
        width: 1200,
        height: 630,
        alt: "고양이 점술관 - AI 타로 · 사주타로",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "고양이 점술관 | AI 타로 · 사주타로 · 오늘의 운세",
    description:
      "AI 고양이가 타로 카드와 사주로 오늘의 운세를 풀어드립니다.",
    images: ["https://necessitycat.com/meta_image.png"],
  },
  alternates: {
    canonical: "https://necessitycat.com",
  },
  verification: {
    other: {
      "naver-site-verification": "00188b37059a260278f795be47f1ab0da77734f1",
      "google-adsense-account": "ca-pub-4396377590347789"
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <AdSenseScript />
        <Script id="noto-serif-font" strategy="afterInteractive">
          {`
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700&display=swap';
            document.head.appendChild(link);
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "고양이 점술관",
              url: "https://necessitycat.com",
              description:
                "AI 고양이가 타로 카드와 사주로 오늘의 운세를 풀어드립니다.",
              inLanguage: "ko",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://necessitycat.com/?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${nanumGothic.variable} antialiased min-h-screen flex flex-col bg-background text-foreground`}
      >
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
