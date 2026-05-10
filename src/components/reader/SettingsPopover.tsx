"use client";

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Settings2 } from 'lucide-react';

interface SettingsPopoverProps {
  margin: number;
  onMarginChange: (value: number) => void;
  lineSpacing: number;
  onLineSpacingChange: (value: number) => void;
}

export function SettingsPopover({
  margin,
  onMarginChange,
  lineSpacing,
  onLineSpacingChange,
}: SettingsPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Display settings">
          <Settings2 className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4">
        <div className="space-y-6">
          <div>
            <Label htmlFor="margin-slider" className="text-sm font-medium">Margins: {margin}px</Label>
            <Slider
              id="margin-slider"
              min={0}
              max={100}
              step={5}
              value={[margin]}
              onValueChange={(value) => onMarginChange(value[0])}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">Adjust page side margins.</p>
          </div>
          <div>
            <Label htmlFor="line-spacing-slider" className="text-sm font-medium">Line Spacing: {lineSpacing.toFixed(1)}</Label>
            <Slider
              id="line-spacing-slider"
              min={1.0}
              max={2.5}
              step={0.1}
              value={[lineSpacing]}
              onValueChange={(value) => onLineSpacingChange(value[0])}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">Adjust text line height.</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
