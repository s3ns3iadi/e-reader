import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <BookOpen className="h-7 w-7 text-primary" />
          <span className="font-semibold sm:inline-block text-xl tracking-tight">
            E-Reader Pro
          </span>
        </Link>
        <nav className="flex flex-1 items-center space-x-4">
          {/* Add navigation items here if needed in the future */}
        </nav>
        {/* Add theme toggle or user profile button here if needed */}
      </div>
    </header>
  );
}
