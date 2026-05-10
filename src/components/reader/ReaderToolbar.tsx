"use client";

import { AnnotationPopover } from './AnnotationPopover';
import { SettingsPopover } from './SettingsPopover';
import { Pagination } from './Pagination';
import { Button } from '@/components/ui/button';
import { Save, ArrowLeft, FileText, Play, Pause, StopCircle, Loader2 } from 'lucide-react';
import type { AnnotationColor } from '@/types';
import Link from 'next/link';

interface ReaderToolbarProps {
  // Annotation props
  selectedTool: 'highlight' | 'underline' | null;
  onToolChange: (tool: 'highlight' | 'underline') => void;
  selectedColor: AnnotationColor;
  onColorChange: (color: AnnotationColor) => void;
  annotationColors: AnnotationColor[];
  onAnnotate: () => void;
  canAnnotate: boolean;

  // Settings props
  margin: number;
  onMarginChange: (value: number) => void;
  lineSpacing: number;
  onLineSpacingChange: (value: number) => void;

  // Pagination props
  currentPage: number; // 1-based
  totalPages: number;
  onPageChange: (page: number) => void; // 1-based

  // Save action
  onSave: () => void;

  // AI Features
  onSummarize: () => void;
  isSummarizing: boolean;
  onPlayAudio: () => void;
  onPauseAudio: () => void;
  onStopAudio: () => void;
  ttsState: 'idle' | 'playing' | 'paused' | 'error';
}

export function ReaderToolbar({
  selectedTool,
  onToolChange,
  selectedColor,
  onColorChange,
  annotationColors,
  onAnnotate,
  canAnnotate,
  margin,
  onMarginChange,
  lineSpacing,
  onLineSpacingChange,
  currentPage,
  totalPages,
  onPageChange,
  onSave,
  onSummarize,
  isSummarizing,
  onPlayAudio,
  onPauseAudio,
  onStopAudio,
  ttsState,
}: ReaderToolbarProps) {
  return (
    <div className="sticky bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-t p-3 shadow-md">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <Link href="/" passHref>
             <Button variant="outline" size="icon" aria-label="Back to library">
               <ArrowLeft className="h-5 w-5" />
             </Button>
          </Link>
          <AnnotationPopover
            selectedTool={selectedTool}
            onToolChange={onToolChange}
            selectedColor={selectedColor}
            onColorChange={onColorChange}
            annotationColors={annotationColors}
            onAnnotate={onAnnotate}
            canAnnotate={canAnnotate}
          />
          <SettingsPopover
            margin={margin}
            onMarginChange={onMarginChange}
            lineSpacing={lineSpacing}
            onLineSpacingChange={onLineSpacingChange}
          />
          <Button variant="outline" size="icon" onClick={onSummarize} disabled={isSummarizing} aria-label="Summarize page">
            {isSummarizing ? <Loader2 className="h-5 w-5 animate-spin" /> : <FileText className="h-5 w-5" />}
          </Button>
          
          {ttsState === 'playing' ? (
            <Button variant="outline" size="icon" onClick={onPauseAudio} aria-label="Pause audio">
              <Pause className="h-5 w-5" />
            </Button>
          ) : (
            <Button variant="outline" size="icon" onClick={onPlayAudio} aria-label="Play audio" disabled={ttsState === 'error'}>
              <Play className="h-5 w-5" />
            </Button>
          )}
          <Button variant="outline" size="icon" onClick={onStopAudio} disabled={ttsState === 'idle'} aria-label="Stop audio">
            <StopCircle className="h-5 w-5" />
          </Button>

        </div>

        <div className="flex-grow flex justify-center min-w-[180px] sm:min-w-[200px]">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onSave} aria-label="Save annotations">
            <Save className="h-5 w-5 mr-0 sm:mr-2" />
            <span className="hidden sm:inline">Save</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
