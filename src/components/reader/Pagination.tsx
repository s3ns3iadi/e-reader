"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type React from 'react';
import { useState, useEffect } from 'react';

interface PaginationProps {
  currentPage: number; // 1-based
  totalPages: number;
  onPageChange: (page: number) => void; // 1-based
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const [inputValue, setInputValue] = useState<string>(currentPage.toString());

  useEffect(() => {
    setInputValue(currentPage.toString());
  }, [currentPage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let newPage = parseInt(inputValue, 10);
    if (!isNaN(newPage)) {
      newPage = Math.max(1, Math.min(totalPages, newPage));
      onPageChange(newPage);
    } else {
      setInputValue(currentPage.toString()); // Reset if invalid
    }
  };
  
  const handleInputBlur = () => {
    let newPage = parseInt(inputValue, 10);
    if (!isNaN(newPage)) {
      newPage = Math.max(1, Math.min(totalPages, newPage));
      onPageChange(newPage);
    } else {
      setInputValue(currentPage.toString()); // Reset if invalid
    }
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      
      <form onSubmit={handleInputSubmit} className="flex items-center space-x-1">
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          className="w-16 h-9 text-center"
          aria-label={`Current page, edit to jump to page`}
        />
        <span className="text-sm text-muted-foreground">of {totalPages}</span>
      </form>

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
