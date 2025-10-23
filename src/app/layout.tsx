import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "배리어프리 경기 - 시민 참여형 접근성 플랫폼",
  description: "시민의 집단지성으로 경기도 전역의 장벽을 실시간으로 파악하고 개선하는 살아있는 무장애 도시",
  keywords: ["배리어프리", "접근성", "장애인", "경기도", "시민참여"],
  openGraph: {
    title: "배리어프리 경기",
    description: "시민 참여형 접근성 데이터 생태계",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
