import React, { useState, useRef, useEffect } from 'react';
import { Video } from '../../types/video';
import { useTube } from '../../context/TubeContext';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  ThumbsUp,
  Clock,
  Share2,
  CheckCircle,
  Sparkles,
  Send,
  Sliders,
  Check,
  Eye,
  Film,
} from 'lucide-react';

interface VideoPlayerModalProps {
  video: Video;
  onClose: () => void;
  onSelectVideo: (video: Video) => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  video,
  onClose,
  onSelectVideo,
}) => {
  const {
    videos,
    models,
    navigateToModel,
    toggleLike,
    likedIds,
    toggleWatchLater,
    watchLaterIds,
    addComment,
    showToast,
  } = useTube();

  // Find model featured in this video if available
  const featuredModel = models.find((m) => video.modelIds?.includes(m.id));

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(video.durationSeconds);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedQuality, setSelectedQuality] = useState(video.quality);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  const isLiked = likedIds.includes(video.id);
  const isSaved = watchLaterIds.includes(video.id);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === ' ' && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        e.preventDefault();
        togglePlayPause();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration && !isNaN(videoRef.current.duration)) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSpeedChange = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
      setShowSpeedMenu(false);
      showToast(`Playback speed set to ${speed}x`, 'info');
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      } else {
        videoRef.current.requestFullscreen().catch(() => {});
      }
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentInput.trim()) {
      addComment(video.id, commentInput);
      setCommentInput('');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Video link copied to clipboard', 'success');
  };

  // Up next recommendations
  const relatedVideos = videos
    .filter((v) => v.id !== video.id)
    .slice(0, 6);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md overflow-y-auto p-2 sm:p-4 md:p-6 animate-in fade-in-50 duration-200">
      <div
        className="w-full max-w-6xl max-h-[94vh] bg-white dark:bg-[#0c0c0e] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Floating Close Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>THEATER PLAYBACK</span>
            <span aria-hidden="true">·</span>
            <span>{selectedQuality}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-500 hover:text-black dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Close video player"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Body: 2 Columns on desktop (Player + details on left, Up Next on right) */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6">
          {/* Left Column: Video Player & Description & Comments */}
          <div className="lg:col-span-8 space-y-4">
            {/* Video Player Frame */}
            <div className="relative aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl border border-zinc-800 group">
              <video
                ref={videoRef}
                src={video.videoUrl}
                poster={video.thumbnail}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
                onClick={togglePlayPause}
              />

              {/* Custom Player Controls Bar */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-3 pt-6 flex flex-col gap-2 transition-opacity duration-200">
                {/* Scrub Progress Bar */}
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-zinc-700 accent-white rounded-lg cursor-pointer transition-all hover:h-2"
                />

                <div className="flex items-center justify-between text-white text-xs">
                  {/* Left Controls: Play/Pause, Mute, Time */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={togglePlayPause}
                      className="p-1 hover:text-zinc-300 transition-colors"
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current" />
                      )}
                    </button>

                    <button
                      onClick={toggleMute}
                      className="p-1 hover:text-zinc-300 transition-colors"
                      aria-label={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>

                    <span className="font-mono text-[11px] text-zinc-300 tabular-nums">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  {/* Right Controls: Speed, Quality, Fullscreen */}
                  <div className="flex items-center gap-2">
                    {/* Speed Selector */}
                    <div className="relative">
                      <button
                        onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                        className="px-2 py-0.5 rounded text-[10px] font-mono hover:bg-white/20 transition-colors border border-white/20"
                      >
                        {playbackSpeed}x
                      </button>
                      {showSpeedMenu && (
                        <div className="absolute bottom-full right-0 mb-2 w-24 bg-zinc-950 border border-zinc-800 rounded-lg shadow-xl py-1 z-30">
                          {[0.5, 0.75, 1, 1.25, 1.5, 2].map((spd) => (
                            <button
                              key={spd}
                              onClick={() => handleSpeedChange(spd)}
                              className={`w-full px-3 py-1 text-[11px] text-left hover:bg-zinc-800 flex items-center justify-between ${
                                playbackSpeed === spd ? 'font-bold text-white' : 'text-zinc-400'
                              }`}
                            >
                              <span>{spd}x</span>
                              {playbackSpeed === spd && <Check className="w-3 h-3" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Quality Selector */}
                    <div className="relative">
                      <button
                        onClick={() => setShowQualityMenu(!showQualityMenu)}
                        className="px-2 py-0.5 rounded text-[10px] font-mono hover:bg-white/20 transition-colors border border-white/20"
                      >
                        {selectedQuality}
                      </button>
                      {showQualityMenu && (
                        <div className="absolute bottom-full right-0 mb-2 w-28 bg-zinc-950 border border-zinc-800 rounded-lg shadow-xl py-1 z-30">
                          {['4K UHD', '1080p HD', '720p HD'].map((q) => (
                            <button
                              key={q}
                              onClick={() => {
                                setSelectedQuality(q as any);
                                setShowQualityMenu(false);
                                showToast(`Quality switched to ${q}`, 'info');
                              }}
                              className={`w-full px-3 py-1 text-[11px] text-left hover:bg-zinc-800 flex items-center justify-between ${
                                selectedQuality === q ? 'font-bold text-white' : 'text-zinc-400'
                              }`}
                            >
                              <span>{q}</span>
                              {selectedQuality === q && <Check className="w-3 h-3" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Fullscreen */}
                    <button
                      onClick={handleFullscreen}
                      className="p-1 hover:text-zinc-300 transition-colors"
                      title="Fullscreen"
                      aria-label="Toggle fullscreen"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Title & Actions */}
            <div className="space-y-3">
              <h1 className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white leading-snug">
                {video.title}
              </h1>

              {/* Creator info and primary actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
                {/* Creator avatar and subscribe button */}
                <div className="flex items-center gap-3">
                  <img
                    src={video.channel.avatar}
                    alt={video.channel.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover grayscale contrast-125 border border-zinc-300 dark:border-zinc-700"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
                      <span>{video.channel.name}</span>
                      {video.channel.verified && (
                        <CheckCircle className="w-3.5 h-3.5 text-zinc-400" />
                      )}
                    </div>
                    <span className="text-[11px] text-zinc-500 font-mono">
                      {video.channel.subscribers} subscribers
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setIsSubscribed(!isSubscribed);
                      showToast(
                        isSubscribed ? 'Unsubscribed' : `Subscribed to ${video.channel.name}`,
                        'info'
                      );
                    }}
                    className={`ml-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      isSubscribed
                        ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300'
                        : 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 hover:opacity-90'
                    }`}
                  >
                    {isSubscribed ? 'Subscribed' : 'Subscribe'}
                  </button>
                </div>

                {/* Right Actions: Like, Watch Later, Share */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleLike(video.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                      isLiked
                        ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 border-transparent'
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-600'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                    <span className="tabular-nums">{video.likes.toLocaleString()}</span>
                  </button>

                  <button
                    onClick={() => toggleWatchLater(video.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                      isSaved
                        ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 border-transparent'
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-600'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{isSaved ? 'Saved' : 'Save'}</span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors"
                    title="Share Link"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Featured Model Spotlight Bar */}
              {featuredModel && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl bg-zinc-100/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800">
                  <div
                    onClick={() => {
                      onClose();
                      navigateToModel(featuredModel);
                    }}
                    className="flex items-center gap-3 cursor-pointer group"
                    title={`View ${featuredModel.name}'s profile`}
                  >
                    <img
                      src={featuredModel.avatar}
                      alt={featuredModel.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover grayscale contrast-125 border border-zinc-300 dark:border-zinc-700 group-hover:scale-105 transition-transform shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-zinc-950 dark:text-white group-hover:underline">
                        <span>Featuring: {featuredModel.name}</span>
                        {featuredModel.verified && (
                          <CheckCircle className="w-3.5 h-3.5 text-zinc-400" />
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-zinc-500">
                        {featuredModel.stats.location} · {featuredModel.followers.toLocaleString()} followers
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      navigateToModel(featuredModel);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 hover:opacity-90 transition-opacity shrink-0"
                  >
                    View Model Profile & Videos
                  </button>
                </div>
              )}

              {/* Description Container */}
              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 space-y-2">
                <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-500">
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {video.views.toLocaleString()} views
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Published {video.createdAt}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-zinc-600 dark:text-zinc-400 font-sans">
                    Category: {video.category}
                  </span>
                </div>

                <p className={isDescExpanded ? '' : 'line-clamp-2'}>
                  {video.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {video.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => setIsDescExpanded(!isDescExpanded)}
                  className="text-[11px] font-bold text-zinc-900 dark:text-white pt-1"
                >
                  {isDescExpanded ? 'Show less' : 'Show more'}
                </button>
              </div>

              {/* Comments Section */}
              <div className="pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500">
                    {video.comments.length} Comments
                  </h3>
                </div>

                {/* Comment Input */}
                <form onSubmit={handleCommentSubmit} className="flex gap-2.5">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face"
                    alt="Current user"
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover grayscale contrast-125 shrink-0"
                  />
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a comment on this high-res video..."
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-zinc-500 dark:focus:border-zinc-500 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500"
                    />
                    <button
                      type="submit"
                      disabled={!commentInput.trim()}
                      className="px-3 py-1.5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-lg text-xs font-semibold disabled:opacity-40 transition-opacity"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>

                {/* Comments List */}
                <div className="space-y-3.5 pt-2">
                  {video.comments.map((comm) => (
                    <div key={comm.id} className="flex gap-3 text-xs">
                      <img
                        src={comm.avatar}
                        alt={comm.author}
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded-full object-cover grayscale shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-zinc-900 dark:text-zinc-200">
                            {comm.author}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-mono">
                            {comm.timestamp}
                          </span>
                        </div>
                        <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                          {comm.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Up Next / Related Videos */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500 pb-1">
              Up Next · 4K Curated
            </h3>

            <div className="space-y-3">
              {relatedVideos.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectVideo(rel)}
                  className="flex gap-2.5 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer transition-colors group"
                >
                  <div className="relative aspect-video w-32 rounded-lg overflow-hidden bg-zinc-800 shrink-0">
                    <img
                      src={rel.thumbnail}
                      alt={rel.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 text-[9px] font-mono font-semibold text-white">
                      {rel.duration}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-200 line-clamp-2 leading-snug group-hover:text-black dark:group-hover:text-white">
                      {rel.title}
                    </h4>
                    <p className="text-[11px] text-zinc-500 mt-1 truncate">
                      {rel.channel.name}
                    </p>
                    <div className="text-[10px] text-zinc-400 font-mono">
                      {(rel.views / 1000).toFixed(0)}K views
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
