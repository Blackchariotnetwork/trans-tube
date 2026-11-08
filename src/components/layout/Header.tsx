import React, { useState, useRef, useEffect } from 'react';
import { useTube } from '../../context/TubeContext';
import {
  Menu,
  Search,
  X,
  Sun,
  Moon,
  SlidersHorizontal,
  Clock,
  TrendingUp,
  ArrowRight,
  Users,
} from 'lucide-react';
import { POPULAR_SEARCH_TAGS } from '../../data/initialVideos';

interface HeaderProps {
  onOpenAdvancedFilters: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAdvancedFilters,
}) => {
  const {
    searchQuery,
    setSearchQuery,
    addSearchHistory,
    searchHistory,
    clearSearchHistory,
    theme,
    toggleTheme,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    viewMode,
    setViewMode,
  } = useTube();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      addSearchHistory(searchQuery.trim());
      setIsSearchFocused(false);
      if (viewMode === 'models' || viewMode === 'model-profile') {
        setViewMode('home');
      }
    }
  };

  const handleSelectSuggestion = (tag: string) => {
    setSearchQuery(tag);
    addSearchHistory(tag);
    setIsSearchFocused(false);
    setIsMobileSearchActive(false);
    if (viewMode === 'models' || viewMode === 'model-profile') {
      setViewMode('home');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800/80 transition-colors duration-200">
      <div className="flex items-center justify-between h-14 px-3 sm:px-5 gap-3 sm:gap-6">
        {/* Left: Hamburger & Brand Title */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button
            onClick={() => {
              if (window.innerWidth < 1024) {
                setIsMobileMenuOpen(!isMobileMenuOpen);
              } else {
                setIsSidebarCollapsed(!isSidebarCollapsed);
              }
            }}
            className="p-2 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Toggle Sidebar"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Clean Brand Lockup with Uploaded Logo Image */}
          <button
            onClick={() => {
              setViewMode('home');
              setSearchQuery('');
            }}
            className="flex items-center gap-2.5 text-left group"
            title="MONO TUBE - Home"
          >
            <div className="h-7 w-16 sm:w-20 rounded-md overflow-hidden border border-zinc-300 dark:border-zinc-700/80 bg-black shrink-0 transition-transform group-hover:scale-105 shadow-sm">
              <img
                src="/assets/aistudio/download__16__2182f6fd.jfif"
                alt="MONO TUBE Logo"
                className="w-full h-full object-cover grayscale contrast-125"
              />
            </div>
            <div className="hidden xs:flex flex-col">
              <span className="text-base font-bold tracking-tight text-zinc-950 dark:text-white leading-none">
                MONO<span className="font-light opacity-60">TUBE</span>
              </span>
              <span className="text-[9px] font-mono tracking-wider text-zinc-500 uppercase leading-tight mt-0.5">
                Cinematic 5X
              </span>
            </div>
          </button>
        </div>

        {/* Center: Optimized Search Bar with Suggestions dropdown */}
        <div
          ref={searchContainerRef}
          className={`flex-1 max-w-2xl relative transition-all duration-200 ${
            isMobileSearchActive
              ? 'fixed inset-x-0 top-0 h-14 bg-white dark:bg-[#09090b] z-50 px-3 flex items-center gap-2'
              : 'hidden md:flex'
          }`}
        >
          {isMobileSearchActive && (
            <button
              onClick={() => setIsMobileSearchActive(false)}
              className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <form
            onSubmit={handleSearchSubmit}
            className="w-full flex items-center relative"
          >
            <div
              className={`w-full flex items-center rounded-lg border transition-all duration-150 ${
                isSearchFocused
                  ? 'border-zinc-900 dark:border-zinc-100 shadow-sm bg-white dark:bg-zinc-900'
                  : 'border-zinc-300 dark:border-zinc-700 bg-zinc-50/70 dark:bg-zinc-900/60 hover:border-zinc-400 dark:hover:border-zinc-600'
              }`}
            >
              <div className="pl-3.5 pr-2 text-zinc-400 dark:text-zinc-500">
                <Search className="w-4 h-4" />
              </div>

              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search 4K videos, models, Elena Rostova, Marcus Vance, Tokyo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full py-2 pr-3 text-sm bg-transparent text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-500 focus:outline-none"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    searchInputRef.current?.focus();
                  }}
                  className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                  aria-label="Clear search input"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="submit"
                className="px-3 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white border-l border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800/80 rounded-r-lg transition-colors shrink-0"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick Filter Drawer Trigger Button */}
          <button
            onClick={onOpenAdvancedFilters}
            className="ml-2 p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:border-zinc-500 dark:hover:border-zinc-500 text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors shrink-0"
            title="Advanced Filters & Sort"
            aria-label="Open filter settings"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {/* Search Dropdown / Autocomplete Popover */}
          {isSearchFocused && (
            <div className="absolute top-full left-0 right-12 mt-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl p-3 z-50 animate-in fade-in-50 duration-150">
              {/* Recent searches */}
              {searchHistory.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center justify-between pb-1.5 mb-1 border-b border-zinc-100 dark:border-zinc-800 text-xs font-medium text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> Recent Searches
                    </span>
                    <button
                      onClick={clearSearchHistory}
                      className="hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="space-y-0.5">
                    {searchHistory.slice(0, 5).map((query, index) => (
                      <button
                        key={index}
                        onClick={() => handleSelectSuggestion(query)}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-left text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors group"
                      >
                        <span className="truncate">{query}</span>
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Topics / Suggested Tags */}
              <div>
                <div className="flex items-center gap-1.5 pb-1.5 mb-1.5 border-b border-zinc-100 dark:border-zinc-800 text-xs font-medium text-zinc-400">
                  <TrendingUp className="w-3 h-3" /> Trending Topics & Models
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_SEARCH_TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleSelectSuggestion(tag)}
                      className="px-2.5 py-1 text-xs rounded-md bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-950 transition-colors"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Zone: Clean Consumer Actions (Mobile Search, Models button, Theme Toggle) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Mobile Search Icon */}
          <button
            onClick={() => {
              setIsMobileSearchActive(true);
              setTimeout(() => searchInputRef.current?.focus(), 50);
            }}
            className="md:hidden p-2 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Search"
            aria-label="Open mobile search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Mobile Filter Button */}
          <button
            onClick={onOpenAdvancedFilters}
            className="md:hidden p-2 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Filters"
            aria-label="Open filters"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>

          {/* Models Navigation Button */}
          <button
            onClick={() => setViewMode('models')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
              viewMode === 'models' || viewMode === 'model-profile'
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 border-transparent shadow-sm'
                : 'border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:border-zinc-500'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Models</span>
          </button>

          {/* Black & White Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'White' : 'Black'} Theme`}
            aria-label="Toggle monochrome color theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-zinc-300 hover:text-white" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-700 hover:text-black" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
