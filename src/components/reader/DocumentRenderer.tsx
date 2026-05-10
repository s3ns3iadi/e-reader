"use client";

import type { Annotation, AnnotationColor } from '@/types';
import { cn } from '@/lib/utils';
import React, { useState, useEffect } from 'react';

interface DocumentRendererProps {
  pageContent: string[]; // Array of words
  annotations: Annotation[];
  pageIndex: number; // 0-based index of current page
  margin: number; // in pixels
  lineSpacing: number; // multiplier
  onWordSelect: (startIndex: number, endIndex: number) => void;
  selectedWordIndexes: { start: number; end: number } | null;
  annotationColors: AnnotationColor[];
}

export function DocumentRenderer({
  pageContent,
  annotations,
  pageIndex,
  margin,
  lineSpacing,
  onWordSelect,
  selectedWordIndexes,
  annotationColors,
}: DocumentRendererProps) {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<number | null>(null);
  
  // Effect to handle mouse up event globally to end selection
  useEffect(() => {
    const handleMouseUpGlobal = () => {
      if (isSelecting && selectionStart !== null) {
        // Finalize selection logic is handled by individual word onMouseUp
        // This global listener ensures selection state is reset if mouse up happens outside words
        setIsSelecting(false);
        // setSelectionStart(null); // Don't reset selectionStart here, allow word's onMouseUp to use it.
      }
    };

    document.addEventListener('mouseup', handleMouseUpGlobal);
    return () => {
      document.removeEventListener('mouseup', handleMouseUpGlobal);
    };
  }, [isSelecting, selectionStart]);


  const handleWordMouseDown = (wordIndex: number) => {
    setIsSelecting(true);
    setSelectionStart(wordIndex);
    onWordSelect(wordIndex, wordIndex); // Select single word initially
  };

  const handleWordMouseEnter = (wordIndex: number) => {
    if (isSelecting && selectionStart !== null) {
      const start = Math.min(selectionStart, wordIndex);
      const end = Math.max(selectionStart, wordIndex);
      onWordSelect(start, end);
    }
  };
  
  const handleWordMouseUp = (wordIndex: number) => {
    if (isSelecting && selectionStart !== null) {
      const start = Math.min(selectionStart, wordIndex);
      const end = Math.max(selectionStart, wordIndex);
      onWordSelect(start, end);
      setIsSelecting(false); 
      // Do not reset selectionStart here, it's needed by the popover
    }
  };


  const getWordStyle = (wordIndex: number): React.CSSProperties => {
    let style: React.CSSProperties = {
      cursor: 'text',
      padding: '0.1em 0.05em', // Minimal padding to make selection easier
      borderRadius: '2px',
      display: 'inline', // Ensure words flow correctly
    };

    // Apply existing annotations
    const activeAnnotations = annotations.filter(
      (ann) =>
        ann.pageIndex === pageIndex &&
        wordIndex >= ann.wordStartIndex &&
        wordIndex <= ann.wordEndIndex
    );

    activeAnnotations.forEach((ann) => {
      const colorInfo = annotationColors.find(c => c.value === ann.color || c.borderColor === ann.color);
      const actualColor = colorInfo ? (ann.type === 'highlight' ? colorInfo.value : colorInfo.borderColor || colorInfo.value) : ann.color;

      if (ann.type === 'highlight') {
        style.backgroundColor = actualColor;
         style.color = '#000'; // Ensure text is readable on highlight
      } else if (ann.type === 'underline') {
        style.borderBottom = `2px solid ${actualColor}`;
      }
    });

    // Apply current selection highlighting
    if (selectedWordIndexes && wordIndex >= selectedWordIndexes.start && wordIndex <= selectedWordIndexes.end) {
      style.backgroundColor = 'rgba(0, 128, 128, 0.2)'; // Light teal selection color
    }
    
    return style;
  };

  return (
    <div
      className="bg-card text-card-foreground p-4 md:p-8 shadow-lg rounded-md overflow-y-auto select-none"
      style={{
        margin: `0 ${margin}px`,
        lineHeight: lineSpacing,
        minHeight: 'calc(100vh - 200px)', // Ensure it takes up reader space
        userSelect: 'none', // Prevent browser's default text selection
      }}
      onMouseLeave={() => { // If mouse leaves the document area while selecting
        if (isSelecting) {
          setIsSelecting(false);
          // setSelectionStart(null); // Could reset selection here if desired
        }
      }}
    >
      {pageContent.map((word, index) => (
        <React.Fragment key={index}>
          <span
            style={getWordStyle(index)}
            onMouseDown={() => handleWordMouseDown(index)}
            onMouseEnter={() => handleWordMouseEnter(index)}
            onMouseUp={() => handleWordMouseUp(index)}
          >
            {word}
          </span>
          {/* Add a space after each word, unless it's the last word.
              This simplistic approach might need refinement for actual punctuation handling. */}
          {index < pageContent.length - 1 ? ' ' : ''}
        </React.Fragment>
      ))}
      {!pageContent.length && <p className="text-muted-foreground">This page is empty.</p>}
    </div>
  );
}
