import type { Metadata } from "next";
import { Nanum_Gothic, Geist_Mono, Noto_Serif_KR } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const nanumGothic = Nanum_Gothic({
  variable: "--font-nanum-gothic",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSerifKr = Noto_Serif_KR({
  variable: "--font-noto-serif-kr",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "고양이 점술관 - AI 타로 리딩",
  description: "별빛이 흐르는 밤, 고양이가 당신의 운명을 읽어드립니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${nanumGothic.variable} ${geistMono.variable} ${notoSerifKr.variable} antialiased min-h-screen flex flex-col bg-background text-foreground`}
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
