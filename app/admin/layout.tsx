import type { Metadata } from "next";
import Link from "next/link";
import "./admin.css";

export const metadata: Metadata = {
  title: "관리자 · SMH Book Archive",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-shell admin-shell">
      <header className="site-header">
        <Link className="wordmark" href="/">SMH Book Archive<span className="wordmark-dot">.</span></Link>
        <nav aria-label="관리자 메뉴"><Link href="/">아카이브로 돌아가기</Link></nav>
      </header>
      <main className="admin-main">{children}</main>
      <footer className="site-footer"><span>SMH BOOK ARCHIVE</span><p>수집하고, 오래도록 기록합니다.</p></footer>
    </div>
  );
}
