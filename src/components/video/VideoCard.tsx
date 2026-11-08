import React, { useState, useRef } from 'react';
import { Video } from '../../types/video';
import { useTube } from '../../context/TubeContext';
import {
  Clock,
  Share2,
  MoreVertical,
  CheckCircle,
  ThumbsUp,
  Play,
  Film,
  User,
} from 'lucide-react';

interface VideoCardProps {
  video: Video;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const {
    setActiveVideo,
    recordWatchHistory,
    toggleWatchLater,
    watchLaterIds,
    toggleLike,
    likedIds,
    models,
    navigateToModel,
    showToast,
  } = useTube();

  const [isHovered, setIsHovered] = useState(false);
  const [scrubProgress, setScrubProgress] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [imageError, setImageError] = useState(false);
  const scrubIntervalRef = useRef<number | null>(null);

  const isSaved = watchLaterIds.includes(video.id);
  const isLiked = likedIds.includes(video.id);

  // Find model featured in this video
  const primaryModel = models.find((m) => video.modelIds?.includes(m.id));

  // Format views
  const formatViews = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
    return count.toString();
  };

  // Format relative time
  const formatRelativeTime = (dateStr: string) => {
    const diff = (new Date().getTime() - new Date(dateStr).getTime()) / (1000 * 3600 * 24);
    if (diff < 1) return 'Today';
    if (diff < 7) return `${Math.floor(diff)} days ago`;
    if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
    return `${Math.floor(diff / 30)} months ago`;
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    // Simulate scrub preview timeline
    setScrubProgress(10);
    scrubIntervalRef.current = window.setInterval(() => {
      setScrubProgress((prev) => (prev >= 95 ? 15 : prev + 4));
    }, 180);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (scrubIntervalRef.current) {
      clearInterval(scrubIntervalRef.current);
      scrubIntervalRef.current = null;
    }
    setScrubProgress(0);
    setShowMenu(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    recordWatchHistory(video.id);
    setActiveVideo(video);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(window.location.href);
    showToast('Video link copied to clipboard', 'success');
    setShowMenu(false);
  };

  const handleModelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (primaryModel) {
      navigateToModel(primaryModel);
    }
  };

  return (
    <article
      className="group relative flex flex-col cursor-pointer transition-all duration-200"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* 16:9 High-Resolution Thumbnail Container */}
      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80">
        {/* Thumbnail Image */}
        {!imageError ? (
          <img
            src={video.thumbnail}
            alt={video.title}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 text-zinc-500">
            <Film className="w-8 h-8 mb-1" />
            <span className="text-[10px] font-mono uppercase">Mono Film</span>
          </div>
        )}

        {/* Hover Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

        {/* Quality Badge (Top Left) */}
        <div className="absolute top-2 left-2 z-10 pointer-events-none">
          <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-wider rounded bg-black/80 text-white backdrop-blur-sm border border-white/20">
            {video.quality}
          </span>
        </div>

        {/* Top Right Quick Actions (on hover) */}
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleWatchLater(video.id);
            }}
            className={`p-1.5 rounded-md backdrop-blur-md transition-all shadow-md ${
              isSaved
                ? 'bg-white text-black'
                : 'bg-black/70 text-white hover:bg-black/90'
            }`}
            title={isSaved ? 'Remove from Watch Later' : 'Watch Later'}
            aria-label="Save to watch later"
          >
            <Clock className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="p-1.5 rounded-md bg-black/70 hover:bg-black/90 text-white backdrop-blur-md transition-all shadow-md"
            title="Share Video"
            aria-label="Share video link"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Duration Badge (Bottom Right) */}
        <div className="absolute bottom-2 right-2 z-10 pointer-events-none">
          <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded bg-black/90 text-zinc-100 backdrop-blur-sm border border-zinc-700/60 tabular-nums">
            {video.duration}
          </span>
        </div>

        {/* Hover Live Scrub Indicator Line */}
        {isHovered && (
          <div className="absolute bottom-0 inset-x-0 h-1 bg-zinc-800">
            <div
              className="h-full bg-white dark:bg-white transition-all duration-150 ease-out"
              style={{ width: `${scrubProgress}%` }}
            />
          </div>
        )}

        {/* Play Icon Badge Center on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="w-10 h-10 rounded-full bg-white/90 dark:bg-zinc-950/90 text-black dark:text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </div>
        </div>
      </div>

      {/* Video Metadata Section */}
      <div className="flex gap-3 pt-3">
        {/* Creator / Model Avatar */}
        <div className="shrink-0">
          <img
            src={primaryModel ? primaryModel.avatar : video.channel.avatar}
            alt={primaryModel ? primaryModel.name : video.channel.name}
            referrerPolicy="no-referrer"
            onClick={primaryModel ? handleModelClick : undefined}
            className={`w-9 h-9 rounded-full object-cover grayscale contrast-125 border border-zinc-200 dark:border-zinc-800 bg-zinc-200 dark:bg-zinc-800 ${
              primaryModel ? 'hover:ring-2 hover:ring-zinc-400 cursor-pointer' : ''
            }`}
            loading="lazy"
            title={primaryModel ? `View ${primaryModel.name}'s Profile` : undefined}
          />
        </div>

        {/* Info & Title */}
        <div className="flex-1 min-w-0 pr-1">
          <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-snug line-clamp-2 group-hover:text-black dark:group-hover:text-white transition-colors">
            {video.title}
          </h3>

          {/* Featured Model Attribution Tag if present */}
          {primaryModel ? (
            <div
              onClick={handleModelClick}
              className="flex items-center gap-1.5 mt-1 text-xs text-zinc-800 dark:text-zinc-200 hover:underline font-semibold cursor-pointer"
            >
              <span>{primaryModel.name}</span>
              {primaryModel.verified && (
                <CheckCircle className="w-3 h-3 text-zinc-400 shrink-0" />
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 mt-1 text-xs text-zinc-600 dark:text-zinc-400">
              <span className="truncate font-medium hover:text-black dark:hover:text-white">
                {video.channel.name}
              </span>
              {video.channel.verified && (
                <CheckCircle className="w-3 h-3 text-zinc-400 shrink-0" />
              )}
            </div>
          )}

          {/* Unboxed Metadata with Typographic Separator */}
          <div className="flex items-center gap-1 text-[11px] text-zinc-500 font-mono mt-0.5">
            <span className="tabular-nums">{formatViews(video.views)} views</span>
            <span aria-hidden="true">·</span>
            <span>{formatRelativeTime(video.createdAt)}</span>
          </div>
        </div>

        {/* Context Menu Trigger */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 rounded-md text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="More options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Options Dropdown */}
          {showMenu && (
            <div
              className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl py-1.5 z-30 animate-in fade-in-50 duration-100"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => {
                  toggleWatchLater(video.id);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{isSaved ? 'Remove from Saved' : 'Save to Watch Later'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  toggleLike(video.id);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{isLiked ? 'Unlike Video' : 'Like Video'}</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Link</span>
              </button>

              {primaryModel && (
                <button
                  type="button"
                  onClick={() => {
                    navigateToModel(primaryModel);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors border-t border-zinc-100 dark:border-zinc-800 mt-1 pt-1.5"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>View Model Profile</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
