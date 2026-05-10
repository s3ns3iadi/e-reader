import Link from 'next/link';
import Image from 'next/image';
import type { Book } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpenCheck } from 'lucide-react'; // Using BookOpenCheck for a more relevant icon

interface BookItemProps {
  book: Book;
}

export function BookItem({ book }: BookItemProps) {
  return (
    <Link href={`/reader/${book.id}`} className="block group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg">
      <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-lg hover:border-primary/50 group-focus-visible:border-primary/50 group-focus-visible:shadow-lg">
        <CardHeader className="p-0 relative">
          <div className="aspect-[3/4] w-full relative overflow-hidden rounded-t-lg bg-secondary">
            {book.coverImage ? (
              <Image
                src={book.coverImage}
                alt={`Cover of ${book.title}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                data-ai-hint="book cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BookOpenCheck className="w-16 h-16 text-muted-foreground/50" />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-3 flex-grow flex flex-col">
          <CardTitle className="text-base font-medium leading-snug mb-1 group-hover:text-primary transition-colors line-clamp-2">
            {book.title}
          </CardTitle>
          <p className="text-xs text-muted-foreground line-clamp-1">{book.author}</p>
        </CardContent>
        <CardFooter className="p-3 pt-0 mt-auto">
          <Badge variant="outline" className="text-xs py-0.5 px-1.5">
            {book.format.toUpperCase()}
          </Badge>
        </CardFooter>
      </Card>
    </Link>
  );
}
