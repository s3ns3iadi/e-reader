"use client";

import type { AnnotationColor } from '@/types';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Highlighter, Underline, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnnotationPopoverProps {
  selectedTool: 'highlight' | 'underline' | null;
  onToolChange: (tool: 'highlight' | 'underline') => void;
  selectedColor: AnnotationColor;
  onColorChange: (color: AnnotationColor) => void;
  annotationColors: AnnotationColor[];
  onAnnotate: () => void;
  canAnnotate: boolean;
}

export function AnnotationPopover({
  selectedTool,
  onToolChange,
  selectedColor,
  onColorChange,
  annotationColors,
  onAnnotate,
  canAnnotate,
}: AnnotationPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Annotation tools">
          <Palette className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4">
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Button
              variant={selectedTool === 'highlight' ? 'default' : 'outline'}
              size="icon"
              onClick={() => onToolChange('highlight')}
              aria-label="Highlight text"
            >
              <Highlighter className="h-5 w-5" />
            </Button>
            <Button
              variant={selectedTool === 'underline' ? 'default' : 'outline'}
              size="icon"
              onClick={() => onToolChange('underline')}
              aria-label="Underline text"
            >
              <Underline className="h-5 w-5" />
            </Button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {annotationColors.map((color) => (
              <Button
                key={color.name}
                variant="outline"
                size="icon"
                onClick={() => onColorChange(color)}
                className={cn(
                  'h-8 w-8 rounded-full border-2',
                  selectedColor.name === color.name ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-border'
                )}
                style={{ backgroundColor: color.value }}
                aria-label={`Select color ${color.name}`}
              />
            ))}
          </div>
          <Button onClick={onAnnotate} disabled={!canAnnotate || !selectedTool} className="w-full">
            Annotate Selection
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
