import { BookList } from '@/components/library/BookList';
import { mockBooks } from '@/lib/mock-data';

export default function LibraryPage() {
  // In a real app, you'd fetch books here
  const books = mockBooks;

  return (
    <div className="container py-6 md:py-8">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8 tracking-tight text-foreground">My Library</h1>
      <BookList books={books} />
      {mockBooks.length > 0 && (
        <p className="text-center text-xs text-muted-foreground mt-10 sm:mt-12">
          Displaying {books.length} mock books. PDF/EPUB rendering and full file management are not implemented.
        </p>
      )}
    </div>
  );
}
