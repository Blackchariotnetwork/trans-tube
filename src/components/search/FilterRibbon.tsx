import React, { useRef } from 'react';
import { useTube } from '../../context/TubeContext';
import { CATEGORIES } from '../../data/initialVideos';
import { ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react';

export const FilterRibbon: React.FC = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    filteredVideos,
    viewMode,
    setViewMode,
  } = useTube();

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -220 : 220;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-14 z-20 w-full bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800/80 py-2.5 px-3 sm:px-6 transition-colors">
      <div className="flex items-center gap-2">
        {/* Scroll Left Button */}
        <button
          onClick={() => handleScroll('left')}
          className="hidden sm:flex p-1 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
          aria-label="Scroll filter tags left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Categories Horizontal Scroll Bar */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth flex-1 py-0.5"
        >
          <button
            onClick={() => setViewMode('models')}
            className="px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition-all duration-150 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 flex items-center gap-1.5 shadow-sm"
          >
            <span>★ Models Directory</span>
          </button>

          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all duration-150 ${
                  isSelected
                    ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white border border-transparent dark:border-zinc-800'
                }`}
              >
                {cat === '4K UHD' ? (
                  <span className="flex items-center gap-1.5 font-mono">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    4K UHD
                  </span>
                ) : (
                  cat
                )}
              </button>
            );
          })}
        </div>

        {/* Scroll Right Button */}
        <button
          onClick={() => handleScroll('right')}
          className="hidden sm:flex p-1 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
          aria-label="Scroll filter tags right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Video Count Indicator */}
        <div className="hidden md:flex items-center text-xs font-mono text-zinc-500 shrink-0 pl-2 border-l border-zinc-200 dark:border-zinc-800">
          <span>{filteredVideos.length} items</span>
        </div>
      </div>

      {/* Active Search / Filter Notification Bar */}
      {searchQuery && (
        <div className="mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <span>
              Results for <strong className="text-zinc-900 dark:text-white">"{searchQuery}"</strong>
            </span>
            <span className="text-zinc-400">({filteredVideos.length} found)</span>
          </div>
          <button
            onClick={() => setSearchQuery('')}
            className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white font-medium"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>
      )}
    </div>
  );
};
