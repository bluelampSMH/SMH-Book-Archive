import Link from "next/link";
import { books } from "@/data/books";
import { BookCard } from "@/components/book-card";

export default function Home() {
  return (
    <div className="site-shell" id="top">
      <a className="skip-link" href="#main">본문으로 건너뛰기</a>
      <header className="site-header">
        <a className="wordmark" href="#top">SMH Book Archive<span className="wordmark-dot">.</span></a>
        <nav aria-label="주요 메뉴"><a href="#new-arrivals">새로 들어온 책</a><a href="#archive">아카이브</a><a href="#about">소개</a></nav>
      </header>
      <main id="main">
        <section className="intro" aria-labelledby="intro-title">
          <p className="eyebrow">오랜 시간, 취향을 따라 모은 책과 인쇄물</p>
          <h1 id="intro-title">세상의 비밀,<br />발견의 기록</h1>
          <div className="intro-bottom"><p>곳곳을 돌아다니며 발견하고 수집한<br />희귀한 책과 오래된 인쇄물을 기록합니다.</p><span className="intro-note">천천히 수집하고,<br />오래도록 기록합니다.</span></div>
        </section>
        <section className="catalogue" id="new-arrivals" aria-labelledby="catalogue-title">
          <div className="section-heading"><h2 id="catalogue-title">수집한 책들 <span>(08)</span></h2><p>오래된 책, 새로운 발견</p></div>
          <div className="book-grid">
            {books.map((book) => (
              <BookCard book={book} key={book.slug} />
            ))}
          </div>
        </section>
        <section className="archive-note" id="archive" aria-labelledby="archive-title">
          <span className="eyebrow">수집은 계속됩니다</span>
          <h2 id="archive-title">새로운 책장으로.<br /><em>이곳에는 기록으로.</em></h2>
          <p>누군가의 책장에서 발견한 책이 또 다른 책장으로 향합니다.<br />판매된 책도 이곳에 기록으로 남습니다.</p>
          <div className="archive-index" aria-label="판매된 도서 기록">
            {books.filter((book) => book.sold).map((book) => (<div key={book.slug}><span className="archive-number">{book.archiveNumber.slice(-3)}</span><Link href={`/books/${book.slug}`}>{book.title}</Link><span className="archive-year">{book.year}</span><span className="sold-label">아카이브</span></div>))}
          </div>
        </section>
        <section className="about-note" id="about" aria-labelledby="about-title">
          <h2 className="eyebrow" id="about-title">SMH Book Archive 소개</h2>
          <p>책방의 구석, 오래된 시장, 낯선 도시에서 만난 책들.<br />취향을 따라 수집한 희귀 중고책과 인쇄물을 소개하는 개인 아카이브입니다.</p>
          <span>사진, 디자인, 예술, 그리고 뜻밖의 발견들.</span>
        </section>
      </main>
      <footer className="site-footer"><a className="wordmark" href="#top">SMH Book Archive<span className="wordmark-dot">.</span></a><p>좋은 책은 다음 책장을 찾아갑니다.</p><span>독립적으로 수집하고, 오래도록 기록합니다.</span></footer>
    </div>
  );
}
