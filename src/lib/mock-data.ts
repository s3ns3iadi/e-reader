import type { Book } from '@/types';

const loremIpsumWords = "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum".split(" ");

function generatePageContent(numWords: number): string[] {
  let content: string[] = [];
  for (let i = 0; i < numWords; i++) {
    content.push(loremIpsumWords[i % loremIpsumWords.length]);
  }
  return content;
}

function generateBookContent(numPages: number, wordsPerPage: number): Array<string[]> {
  const bookContent: Array<string[]> = [];
  for (let i = 0; i < numPages; i++) {
    // Vary words per page slightly for realism
    const actualWordsPerPage = wordsPerPage + Math.floor(Math.random() * 10) - 5;
    bookContent.push(generatePageContent(Math.max(10, actualWordsPerPage)));
  }
  return bookContent;
}


export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    coverImage: 'https://picsum.photos/300/450?random=1',
    format: 'epub',
    totalPages: 5,
    content: generateBookContent(5, 150),
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    coverImage: 'https://picsum.photos/300/450?random=2',
    format: 'pdf',
    totalPages: 7,
    content: generateBookContent(7, 200),
  },
  {
    id: '3',
    title: '1984',
    author: 'George Orwell',
    coverImage: 'https://picsum.photos/300/450?random=3',
    format: 'epub',
    totalPages: 6,
    content: generateBookContent(6, 180),
  },
  {
    id: '4',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    coverImage: 'https://picsum.photos/300/450?random=4',
    format: 'txt',
    totalPages: 8,
    content: generateBookContent(8, 220),
  },
  {
    id: '5',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    // No cover image to test fallback
    format: 'epub',
    totalPages: 4,
    content: generateBookContent(4, 160),
  },
];

export const getBookById = (id: string): Book | undefined => {
  return mockBooks.find(book => book.id === id);
};
