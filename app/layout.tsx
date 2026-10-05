import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const heroFont = Noto_Sans_KR({
  variable: "--font-hero",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SMH Book Archive",
  description: "SMH Book Archive는 곳곳을 돌아다니며 오랜 시간 수집한 희귀서적, 사진집, 디자인 서적과 오래된 인쇄물을 공개하고 기록하는 개인 온라인 아카이브입니다.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ko" className={heroFont.variable}><body>{children}</body></html>;
}
