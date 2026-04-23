import React, { useState, useRef, useEffect, MouseEvent, TouchEvent } from "react";
import { cn } from "@/lib/utils";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  className?: string;
}

export function BeforeAfterSlider({ beforeImage, afterImage, className }: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    const position = ((clientX - left) / width) * 100;
    setSliderPosition(Math.min(Math.max(position, 0), 100));
  };

  const handleMouseMove = (e: globalThis.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: globalThis.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", () => setIsDragging(false));
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", () => setIsDragging(false));
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", () => setIsDragging(false));
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", () => setIsDragging(false));
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full h-full overflow-hidden select-none rounded-2xl group", className)}
      onMouseDown={(e: MouseEvent) => {
        setIsDragging(true);
        handleMove(e.clientX);
      }}
      onTouchStart={(e: TouchEvent) => {
        setIsDragging(true);
        handleMove(e.touches[0].clientX);
      }}
    >
      {/* After image (background removed, underneath) */}
      <div className="absolute inset-0 w-full h-full bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYNgBx31QYf//v5hXMRKIH2AUgDR+EGoAKGYYRUYNhJgYGBh/Q+4QGAXkGYDKwAAAK9sY88b0a9MAAAAASUVORK5CYII=')]">
        <img
          src={afterImage}
          alt="After"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          draggable={false}
        />
        <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm text-foreground text-xs font-semibold px-3 py-1 rounded-full pointer-events-none shadow-sm">
          After
        </div>
      </div>

      {/* Before image (original, clipped) */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={beforeImage}
          alt="Before"
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
        <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm text-foreground text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
          Before
        </div>
      </div>

      {/* Slider Line */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize pointer-events-none group-hover:w-1.5 transition-all duration-200"
        style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg pointer-events-auto cursor-grab active:cursor-grabbing">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round" className="text-gray-900">
            <path d="M11 5l-7 7 7 7" />
            <path d="M13 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}