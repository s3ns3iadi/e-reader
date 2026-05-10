import { ReaderView } from '@/components/reader/ReaderView';
import { getBookById, mockBooks } from '@/lib/mock-data';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface ReaderPageProps {
  params: {
    bookId: string;
  };
}

export async function generateMetadata({ params }: ReaderPageProps): Promise<Metadata> {
  const book = getBookById(params.bookId);
  if (!book) {
    return {
      title: 'Book Not Found',
    };
  }
  return {
    title: `Reading: ${book.title} | E-Reader Pro`,
    description: `Read and annotate ${book.title} by ${book.author}.`,
  };
}

// Enable dynamic rendering for this page for future real data fetching
export const dynamic = 'force-dynamic';


export default async function ReaderPage({ params }: ReaderPageProps) {
  const book = getBookById(params.bookId);

  if (!book) {
    notFound();
  }

  return <ReaderView book={book} />;
}

// Optional: If using SSG and know all book IDs at build time
export async function generateStaticParams() {
   return mockBooks.map((book) => ({
     bookId: book.id,
   }));
}
