import Link from "next/link";
import { BookCover } from "@/components/book-cover";
import { bookPrice, type Book } from "@/data/books";

export function BookCard({ book }: { book: Book }) {
  return (
    <article className="book-item">
      <Link href={`/books/${book.slug}`} className="cover-link" aria-label={`${book.title} 상세 기록 보기`}><BookCover book={book} /></Link>
      <div className="book-category"><span>{book.category}</span><span>{book.archiveNumber.slice(-3)}</span></div>
      <h3><Link href={`/books/${book.slug}`}>{book.title}</Link></h3>
      {book.originalTitle && <p className="book-subtitle">{book.originalTitle}</p>}
      <div className="book-details"><span>{book.year}</span><span className={book.sold ? "sold-label" : "price"}>{bookPrice(book)}</span></div>
    </article>
  );
}
