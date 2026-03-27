"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className={cn("flex items-center justify-between px-2 py-4", className)}>
      <div className="text-xs font-medium text-muted-foreground">
        Page <span className="text-foreground">{currentPage}</span> of{" "}
        <span className="text-foreground">{totalPages}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 border-border/40 bg-card/30 backdrop-blur-sm hover:bg-secondary/50 disabled:opacity-30 transition-all font-bold"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            // Only show a few pages if there are many, but since it's only 50-60 items (6 pages), we can show all
            return (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                className={cn(
                  "h-8 w-8 p-0 text-xs font-bold transition-all",
                  currentPage === page
                    ? "bg-primary shadow-[0_0_15px_rgba(59,130,246,0.3)] border-transparent"
                    : "border-border/40 bg-card/30 backdrop-blur-sm hover:bg-secondary/50"
                )}
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 border-border/40 bg-card/30 backdrop-blur-sm hover:bg-secondary/50 disabled:opacity-30 transition-all font-bold"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
