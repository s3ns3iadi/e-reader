import type { Book } from '@/types';
import { BookItem } from './BookItem';

interface BookListProps {
  books: Book[];
}

export function BookList({ books }: BookListProps) {
  if (!books.length) {
    return <p className="text-center text-muted-foreground py-10">No books in your library yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {books.map((book) => (
        <BookItem key={book.id} book={book} />
      ))}
    </div>
  );
}
