
export interface Book {
  id: string;
  title: string;
  author: string;
  coverImage?: string; // URL to image or local path for placeholder
  format: 'pdf' | 'epub' | 'other' | 'txt';
  filePath?: string; // Path to local file or URL, not used in this demo
  totalPages: number; // For simulated pagination
  content: Array<string[]>; // Array of pages, each page is an array of words
}

export interface Annotation {
  id: string;
  pageIndex: number; // 0-based index of the page
  wordStartIndex: number;
  wordEndIndex: number;
  type: 'highlight' | 'underline';
  color: string; // e.g., 'yellow', 'rgba(0, 128, 128, 0.3)'
}

export type AnnotationColor = {
  name: string;
  value: string; // CSS color value for background (highlight)
  borderColor?: string; // CSS color value for border-bottom (underline)
};
