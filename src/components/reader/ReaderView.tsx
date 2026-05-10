"use client";

import type { Book, Annotation, AnnotationColor } from '@/types';
import { useState, useEffect } from 'react';
import { DocumentRenderer } from './DocumentRenderer';
import { ReaderToolbar } from './ReaderToolbar';
import { SummaryDialog } from './SummaryDialog';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { summarizeText } from '@/ai/flows/summarize-book-flow';

const ANNOTATION_COLORS: AnnotationColor[] = [
  { name: 'Teal', value: 'rgba(0, 128, 128, 0.3)', borderColor: '#008080' },
  { name: 'Yellow', value: 'rgba(255, 255, 0, 0.4)', borderColor: '#FFD700' },
  { name: 'Pink', value: 'rgba(255, 105, 180, 0.3)', borderColor: '#FF69B4' },
  { name: 'Blue', value: 'rgba(0, 0, 255, 0.2)', borderColor: '#0000FF' },
];

interface ReaderViewProps {
  book: Book;
}

export function ReaderView({ book: initialBook }: ReaderViewProps) {
  const [book, setBook] = useState<Book>(initialBook);
  const [currentPage, setCurrentPage] = useState(1); // 1-based
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [selectedWordIndexes, setSelectedWordIndexes] = useState<{ start: number; end: number } | null>(null);
  
  const [selectedTool, setSelectedTool] = useState<'highlight' | 'underline' | null>(null);
  const [selectedColor, setSelectedColor] = useState<AnnotationColor>(ANNOTATION_COLORS[0]);

  const [margin, setMargin] = useState(20);
  const [lineSpacing, setLineSpacing] = useState(1.5);

  const { toast } = useToast();

  // AI Summarization State
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [showSummaryDialog, setShowSummaryDialog] = useState(false);

  // TTS State
  const [ttsState, setTtsState] = useState<'idle' | 'playing' | 'paused' | 'error'>('idle');
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [speechSynthesisSupported, setSpeechSynthesisSupported] = useState(false);


  useEffect(() => {
    setBook(initialBook);
    setCurrentPage(1); // Reset to first page when book changes
    setAnnotations([]); // Reset annotations or load for new book
    // Load annotations from localStorage or initialize if not present
    const storedAnnotations = localStorage.getItem(`annotations_${initialBook.id}`);
    if (storedAnnotations) {
      setAnnotations(JSON.parse(storedAnnotations));
    }
    // Reset AI features state
    setSummary(null);
    setIsSummarizing(false);
    setShowSummaryDialog(false);
    if (speechSynthesisSupported && (window.speechSynthesis.speaking || window.speechSynthesis.pending)) {
        window.speechSynthesis.cancel();
    }
    setTtsState('idle');
    setCurrentUtterance(null);

  }, [initialBook, speechSynthesisSupported]);


  useEffect(() => {
    localStorage.setItem(`annotations_${book.id}`, JSON.stringify(annotations));
  }, [annotations, book.id]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setSpeechSynthesisSupported(true);
    } else {
      setSpeechSynthesisSupported(false);
      console.warn('Speech synthesis not supported by this browser.');
    }
    
    // Cleanup on unmount
    return () => {
      if (speechSynthesisSupported && (window.speechSynthesis.speaking || window.speechSynthesis.pending)) {
        window.speechSynthesis.cancel();
      }
    };
  }, [speechSynthesisSupported]);


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedWordIndexes(null);
    if (speechSynthesisSupported && ttsState !== 'idle') {
      stopAudio(); // Stop TTS when page changes
    }
  };

  const handleWordSelect = (startIndex: number, endIndex: number) => {
    setSelectedWordIndexes({ start: startIndex, end: endIndex });
  };

  const handleAnnotate = () => {
    if (!selectedWordIndexes || !selectedTool) return;

    const newAnnotation: Annotation = {
      id: uuidv4(),
      pageIndex: currentPage - 1,
      wordStartIndex: selectedWordIndexes.start,
      wordEndIndex: selectedWordIndexes.end,
      type: selectedTool,
      color: selectedTool === 'highlight' ? selectedColor.value : selectedColor.borderColor || selectedColor.value,
    };
    setAnnotations([...annotations, newAnnotation]);
    setSelectedWordIndexes(null);
    toast({ title: "Annotation added", description: `Text ${selectedTool}ed.`});
  };

  const handleSave = () => {
    toast({
      title: "Book Saved (Simulated)",
      description: "Your annotations have been saved.",
    });
  };

  const handleSummarize = async () => {
    setIsSummarizing(true);
    setSummary(null);
    const textToSummarize = book.content[currentPage - 1]?.join(' ') || '';
    
    if (!textToSummarize.trim()) {
      toast({ title: "Cannot Summarize", description: "The current page is empty or contains no text.", variant: "default" });
      setIsSummarizing(false);
      return;
    }

    try {
      const result = await summarizeText({ text: textToSummarize });
      setSummary(result.summary);
      setShowSummaryDialog(true);
    } catch (error) {
      console.error("Error summarizing book:", error);
      toast({ title: "Summarization Failed", description: "Could not generate summary for the page.", variant: "destructive" });
      setSummary(null);
    } finally {
      setIsSummarizing(false);
    }
  };
  
  const getCurrentPageText = () => book.content[currentPage - 1]?.join(' ') || '';

  const playAudio = () => {
    if (!speechSynthesisSupported) {
      toast({ title: "TTS Not Supported", description: "Your browser does not support text-to-speech.", variant: "destructive" });
      return;
    }
    const text = getCurrentPageText();
    if (!text.trim()) {
      toast({ title: "Nothing to read", description: "The current page is empty." });
      return;
    }

    if (ttsState === 'paused' && currentUtterance && currentUtterance.text === text) {
      window.speechSynthesis.resume();
      setTtsState('playing');
    } else {
      if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
        window.speechSynthesis.cancel();
      }

      const newUtterance = new SpeechSynthesisUtterance(text);
      newUtterance.onstart = () => setTtsState('playing');
      newUtterance.onend = () => {
        setTtsState('idle');
        setCurrentUtterance(null);
      };
      newUtterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        setTtsState('error');
        toast({ title: "TTS Error", description: `Could not play audio: ${event.error || 'Unknown error'}. Try again or use a different browser.`, variant: "destructive" });
        setCurrentUtterance(null);
      };
      
      setCurrentUtterance(newUtterance);
      window.speechSynthesis.speak(newUtterance);
      // setTtsState('playing'); // onstart handles this
    }
  };

  const pauseAudio = () => {
    if (speechSynthesisSupported && ttsState === 'playing') {
      window.speechSynthesis.pause();
      setTtsState('paused');
    }
  };

  const stopAudio = () => {
    if (speechSynthesisSupported && (window.speechSynthesis.speaking || window.speechSynthesis.pending)) {
      window.speechSynthesis.cancel();
    }
    setTtsState('idle');
    setCurrentUtterance(null);
  };

  const pageContent = book.content[currentPage -1] || [];

  if (!book) {
    return <p>Book not found.</p>;
  }
  
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]"> {/* 4rem is approx header height */}
      <div className="flex-grow overflow-y-auto bg-background py-6" style={{ scrollbarGutter: 'stable' }}>
        <div className="container mx-auto">
          <DocumentRenderer
            pageContent={pageContent}
            annotations={annotations}
            pageIndex={currentPage - 1}
            margin={margin}
            lineSpacing={lineSpacing}
            onWordSelect={handleWordSelect}
            selectedWordIndexes={selectedWordIndexes}
            annotationColors={ANNOTATION_COLORS}
          />
        </div>
      </div>
      <ReaderToolbar
        selectedTool={selectedTool}
        onToolChange={setSelectedTool}
        selectedColor={selectedColor}
        onColorChange={setSelectedColor}
        annotationColors={ANNOTATION_COLORS}
        onAnnotate={handleAnnotate}
        canAnnotate={!!selectedWordIndexes && !!selectedTool}
        margin={margin}
        onMarginChange={setMargin}
        lineSpacing={lineSpacing}
        onLineSpacingChange={setLineSpacing}
        currentPage={currentPage}
        totalPages={book.totalPages}
        onPageChange={handlePageChange}
        onSave={handleSave}
        onSummarize={handleSummarize}
        isSummarizing={isSummarizing}
        onPlayAudio={playAudio}
        onPauseAudio={pauseAudio}
        onStopAudio={stopAudio}
        ttsState={ttsState}
      />
      <SummaryDialog
        isOpen={showSummaryDialog}
        onOpenChange={setShowSummaryDialog}
        summary={summary}
        isLoading={isSummarizing}
        title={`Summary of ${book.title} - Page ${currentPage}`}
      />
    </div>
  );
}
