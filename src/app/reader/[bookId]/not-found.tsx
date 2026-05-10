import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function BookNotFound() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center p-8">
      <AlertTriangle className="w-24 h-24 text-destructive mb-8" />
      <h1 className="text-4xl font-bold mb-4">Book Not Found</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Sorry, we couldn't find the book you were looking for. It might have been moved or the link is incorrect.
      </p>
      <Button asChild>
        <Link href="/">Go to Library</Link>
      </Button>
    </div>
  );
}
