import React from 'react';
import { useTube } from '../../context/TubeContext';
import { X, SlidersHorizontal, RotateCcw, Check } from 'lucide-react';
import { FilterOptions } from '../../types/video';

interface AdvancedFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdvancedFilterModal: React.FC<AdvancedFilterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { filterOptions, setFilterOptions, showToast } = useTube();

  if (!isOpen) return null;

  const handleSortChange = (sortBy: FilterOptions['sortBy']) => {
    setFilterOptions((prev) => ({ ...prev, sortBy }));
  };

  const handleQualityChange = (quality: FilterOptions['quality']) => {
    setFilterOptions((prev) => ({ ...prev, quality }));
  };

  const handleDurationChange = (durationRange: FilterOptions['durationRange']) => {
    setFilterOptions((prev) => ({ ...prev, durationRange }));
  };

  const handleReset = () => {
    setFilterOptions({
      category: 'All',
      searchQuery: '',
      sortBy: 'views',
      quality: 'all',
      durationRange: 'all',
    });
    showToast('Filters reset to default', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in-50 duration-200">
      <div
        className="w-full max-w-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
            <h2 className="text-sm font-bold tracking-tight text-zinc-950 dark:text-white">
              Search & Filter Options
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-500 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Close filter modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Section: Sort By */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2.5">
              Sort Videos By
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'views', label: 'Most Viewed' },
                { key: 'newest', label: 'Upload Date' },
                { key: 'rating', label: 'Highest Rated' },
                { key: 'duration', label: 'Longest Runtime' },
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => handleSortChange(opt.key as any)}
                  className={`flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold rounded-lg border text-left transition-colors ${
                    filterOptions.sortBy === opt.key
                      ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 border-transparent'
                      : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-600'
                  }`}
                >
                  <span>{opt.label}</span>
                  {filterOptions.sortBy === opt.key && <Check className="w-3.5 h-3.5 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Section: Resolution / Quality */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2.5">
              Resolution Quality
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'all', label: 'All Qualities' },
                { key: '4K UHD', label: '4K UHD Only' },
                { key: '1080p HD', label: '1080p HD' },
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => handleQualityChange(opt.key as any)}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg border text-center transition-colors ${
                    filterOptions.quality === opt.key
                      ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 border-transparent'
                      : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-600'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section: Duration */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2.5">
              Duration
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'all', label: 'Any Length' },
                { key: 'short', label: '< 5 min' },
                { key: 'medium', label: '5–20 min' },
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => handleDurationChange(opt.key as any)}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg border text-center transition-colors ${
                    filterOptions.durationRange === opt.key
                      ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 border-transparent'
                      : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-600'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-zinc-50 dark:bg-zinc-900/60 border-t border-zinc-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset all
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 rounded-lg transition-colors shadow-sm"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
