import React from 'react';
import { Video } from '../../types/video';
import { VideoCard } from './VideoCard';
import { Film, Search, Sparkles, RefreshCw } from 'lucide-react';
import { useTube } from '../../context/TubeContext';

interface VideoGridProps {
  videos: Video[];
  title?: string;
  subtitle?: string;
}

export const VideoGrid: React.FC<VideoGridProps> = ({
  videos,
  title,
  subtitle,
}) => {
  const { searchQuery, setSearchQuery, setSelectedCategory, resetToDefaultCatalog } =
    useTube();

  if (videos.length === 0) {
    return (
      <div className="py-20 px-4 flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400 mb-4">
          <Search className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-zinc-950 dark:text-white mb-1">
          No videos found
        </h3>
        <p className="text-xs text-zinc-500 max-w-sm mb-5">
          {searchQuery
            ? `No matching results for "${searchQuery}". Try searching for another term or check your spelling.`
            : 'No videos available in this category or collection.'}
        </p>
        <div className="flex items-center gap-3">
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 hover:opacity-90 transition-opacity"
            >
              Clear Search
            </button>
          )}
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              resetToDefaultCatalog();
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Optional Section Header */}
      {title && (
        <div className="flex items-baseline justify-between pt-1">
          <div>
            <h2 className="text-base font-bold text-zinc-950 dark:text-white tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>
            )}
          </div>
          <span className="text-xs font-mono text-zinc-400">
            {videos.length} videos · 5x Grid
          </span>
        </div>
      )}

      {/* 5 VIDEOS PER ROW RESPONSIVE GRID */}
      {/* xl:grid-cols-5 creates strictly 5 videos per row on standard desktop screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-7">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
          />
        ))}
      </div>
    </div>
  );
};
