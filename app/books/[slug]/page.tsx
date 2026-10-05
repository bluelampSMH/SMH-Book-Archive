import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { books, getBook, bookPrice } from "@/data/books";
import { BookCover } from "@/components/book-cover";
import { BookCard } from "@/components/book-card";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return books.map((book) => ({ slug: book.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const book = getBook((await params).slug);
  if (!book) notFound();
  return { title: `${book.title} — SMH Book Archive`, description: book.description[0] };
}

export default async function BookPage({ params }: Props) {
  const book = getBook((await params).slug);
  if (!book) notFound();
  const related = books.filter((other) => other.slug !== book.slug)
    .sort((a, b) => Number(b.category === book.category) - Number(a.category === book.category)).slice(0, 3);
  const bibliography = [
    ["제목", book.title], ["저자", book.author], ["출판사", book.publisher],
    ["발행년도", `${book.year}년`], ["ISBN", book.isbn ?? "미확인"],
    ["페이지", `${book.pages}쪽`], ["크기", book.size], ["언어", book.language],
  ];
  const condition = [["전체 상태", book.condition.grade], ["표지", book.condition.cover], ["책등", book.condition.spine], ["내지", book.condition.interior], ["필기", book.condition.markings]];

  return (
    <div className="site-shell" id="top">
      <a className="skip-link" href="#main">본문으로 건너뛰기</a>
      <header className="site-header">
        <Link className="wordmark" href="/">SMH Book Archive<span className="wordmark-dot">.</span></Link>
        <nav aria-label="주요 메뉴"><Link href="/#new-arrivals">새로 들어온 책</Link><Link href="/#archive">아카이브</Link><Link href="/#about">소개</Link></nav>
      </header>
      <main id="main" className="book-page">
        <div className="book-breadcrumb"><Link href="/#new-arrivals">← 수집한 책들</Link><span>{book.archiveNumber}</span></div>
        <section className="book-hero" aria-labelledby="book-title">
          <BookCover book={book} large />
          <div className="book-summary">
            <p className="eyebrow">{book.category}</p>
            <h1 id="book-title">{book.title}</h1>
            {book.originalTitle && <p className="original-title">{book.originalTitle}</p>}
            <div className="summary-edition"><span>{book.year}</span><span>{book.archiveNumber}</span></div>
            <div className="summary-price"><span>{bookPrice(book)}</span>{!book.sold && <span className="eyebrow">판매중</span>}</div>
            <dl className="record-list summary-records">
              {[["저자", book.author], ["출판사", book.publisher], ["발행년도", `${book.year}년`], ["언어", book.language], ["책 상태", book.condition.grade]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
            </dl>
            {!book.sold && <div className="purchase-area"><button className="purchase-button" type="button" disabled aria-describedby="purchase-note">구매하기</button><p id="purchase-note">구매 기능은 준비 중입니다.</p></div>}
            {book.sold && <p className="archived-message">새로운 책장으로 향한 책입니다.<br />이곳에는 수집의 기록으로 남습니다.</p>}
          </div>
        </section>

        <section className="detail-section editorial-section" aria-labelledby="description-title">
          <div><span className="eyebrow detail-index">01 / CURATOR’S NOTE</span><h2 id="description-title">이 책에 대하여</h2></div>
          <div className="editorial-copy">{book.description.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        </section>

        <section className="detail-section gallery-section" aria-labelledby="gallery-title">
          <div className="detail-heading"><div><span className="eyebrow detail-index">02 / IN DETAIL</span><h2 id="gallery-title">책의 모습</h2></div><p>표지에서 작은 흔적까지</p></div>
          <div className="gallery-grid">{book.galleryImages.map((photo, index) => <figure key={photo.label}>
            <div className={`gallery-frame gallery-frame-${index}`}>
              {photo.src ? <Image src={photo.src} alt={photo.alt} width={900} height={700} sizes="(max-width: 600px) 90vw, 45vw" /> : <div className="gallery-placeholder" role="img" aria-label={`${photo.alt} 사진 준비 중`}><span className="gallery-placeholder-number">0{index + 1}</span><span>{photo.label}</span><span className="gallery-placeholder-note">사진 준비 중</span></div>}
            </div><figcaption><span>{photo.label}</span><span>0{index + 1}</span></figcaption>
          </figure>)}</div>
        </section>

        <div className="detail-pair">
          <section className="detail-section" aria-labelledby="bibliography-title"><span className="eyebrow detail-index">03 / BIBLIOGRAPHY</span><h2 id="bibliography-title">서지 정보</h2><dl className="record-list">{bibliography.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></section>
          <section className="detail-section" aria-labelledby="condition-title"><span className="eyebrow detail-index">04 / CONDITION</span><h2 id="condition-title">책의 상태</h2><dl className="record-list">{condition.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><p className="condition-note">오래된 중고서적의 특성상 세월에 따른 변색이나 사용감이 있을 수 있습니다.</p></section>
        </div>

        <section className="detail-section editorial-section discovery-section" aria-labelledby="discovery-title">
          <div><span className="eyebrow detail-index">05 / FOUND & KEPT</span><h2 id="discovery-title">발견의 기록</h2></div>
          <div><dl className="record-list"><div><dt>발견 장소</dt><dd>{book.discoveryPlace}</dd></div><div><dt>수집 시기</dt><dd>{book.discoveryDate}</dd></div><div><dt>Archive No.</dt><dd className="archive-code">{book.archiveNumber}</dd></div></dl><p className="discovery-copy">{book.discoveryNote}</p></div>
        </section>

        <section className="detail-section related-section" aria-labelledby="related-title"><div className="detail-heading"><div><span className="eyebrow detail-index">06 / FROM THE COLLECTION</span><h2 id="related-title">함께 살펴볼 책들</h2></div><Link href="/#new-arrivals">전체 컬렉션 →</Link></div><div className="book-grid related-grid">{related.map((other) => <BookCard key={other.slug} book={other} />)}</div></section>
      </main>
      <footer className="site-footer"><Link className="wordmark" href="/">SMH Book Archive<span className="wordmark-dot">.</span></Link><p>좋은 책은 다음 책장을 찾아갑니다.</p><span>독립적으로 수집하고, 오래도록 기록합니다.</span></footer>
    </div>
  );
}
