import Image from "next/image";
import type { Book } from "@/data/books";

export function BookCover({ book, large = false }: { book: Book; large?: boolean }) {
  return (
    <div className={large ? "cover-stage cover-stage-large" : "cover-stage"}>
      {book.coverImage ? (
        <Image src={book.coverImage} alt={`${book.title} 표지`} width={600} height={800} className="cover-photo" sizes={large ? "(max-width: 760px) 90vw, 45vw" : "(max-width: 600px) 45vw, (max-width: 1000px) 30vw, 23vw"} />
      ) : (
        <div className="book-cover" aria-hidden="true" style={{ backgroundColor: book.color, color: book.ink }}>
          <span className="cover-category">{book.category}</span>
          <div className="cover-title-group"><span className="cover-title">{book.title}</span><span className="cover-subtitle">{book.originalTitle}</span></div>
          <span className="cover-bottom"><span>SMH Book Archive</span><span>{book.year}</span></span>
        </div>
      )}
    </div>
  );
}

