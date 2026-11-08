import React, { createContext, useContext, useState, useEffect } from 'react';
import { Video, ViewMode, FilterOptions, Model } from '../types/video';
import { INITIAL_VIDEOS } from '../data/initialVideos';
import { INITIAL_MODELS } from '../data/initialModels';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface TubeContextType {
  videos: Video[];
  filteredVideos: Video[];
  models: Model[];
  selectedModel: Model | null;
  setSelectedModel: (model: Model | null) => void;
  navigateToModel: (modelOrId: string | Model) => void;
  toggleFollowModel: (modelId: string) => void;
  activeVideo: Video | null;
  setActiveVideo: (video: Video | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  filterOptions: FilterOptions;
  setFilterOptions: React.Dispatch<React.SetStateAction<FilterOptions>>;
  watchLaterIds: string[];
  likedIds: string[];
  historyIds: string[];
  searchHistory: string[];
  addSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
  toggleLike: (id: string) => void;
  toggleWatchLater: (id: string) => void;
  recordWatchHistory: (id: string) => void;
  addVideo: (videoData: Partial<Video>) => Video;
  updateVideo: (updated: Video) => void;
  deleteVideo: (id: string) => void;
  batchDeleteVideos: (ids: string[]) => void;
  batchUpdateCategory: (ids: string[], newCategory: string) => void;
  batchUpdateStatus: (ids: string[], newStatus: 'Published' | 'Draft' | 'Unlisted') => void;
  addComment: (videoId: string, text: string) => void;
  resetToDefaultCatalog: () => void;
  toasts: ToastState[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const TubeContext = createContext<TubeContextType | undefined>(undefined);

const STORAGE_KEYS = {
  VIDEOS: 'mono_tube_cms_videos_v2',
  MODELS: 'mono_tube_cms_models_v1',
  THEME: 'mono_tube_cms_theme_v1',
  WATCH_LATER: 'mono_tube_cms_watch_later_v1',
  LIKED: 'mono_tube_cms_liked_v1',
  HISTORY: 'mono_tube_cms_history_v1',
  SEARCH_HISTORY: 'mono_tube_cms_search_hist_v1',
  SIDEBAR: 'mono_tube_cms_sidebar_collapsed_v1',
};

export const TubeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state: defaults to 'dark' for true monochrome tube aesthetic
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {
      // fallback
    }
    return 'dark';
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch {
      // storage unavailable
    }
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Video data state
  const [videos, setVideos] = useState<Video[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VIDEOS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // storage error
    }
    return INITIAL_VIDEOS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(videos));
    } catch {
      // ignore
    }
  }, [videos]);

  // Models state
  const [models, setModels] = useState<Model[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MODELS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // storage error
    }
    return INITIAL_MODELS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MODELS, JSON.stringify(models));
    } catch {
      // ignore
    }
  }, [models]);

  const [selectedModel, setSelectedModel] = useState<Model | null>(INITIAL_MODELS[0]);

  // Sidebar state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SIDEBAR);
      if (saved !== null) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return false;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SIDEBAR, JSON.stringify(isSidebarCollapsed));
    } catch {
      // ignore
    }
  }, [isSidebarCollapsed]);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter options
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    category: 'All',
    searchQuery: '',
    sortBy: 'views',
    quality: 'all',
    durationRange: 'all',
  });

  // Watch Later, Liked, History
  const [watchLaterIds, setWatchLaterIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WATCH_LATER);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return ['vid-01', 'vid-03'];
  });

  const [likedIds, setLikedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LIKED);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return ['vid-01', 'vid-04'];
  });

  const [historyIds, setHistoryIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return ['vid-02', 'vid-06'];
  });

  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return ['Elena Rostova', 'Tokyo 4K', 'Brutalism', 'Marcus Vance', 'James Webb'];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WATCH_LATER, JSON.stringify(watchLaterIds));
  }, [watchLaterIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LIKED, JSON.stringify(likedIds));
  }, [likedIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(historyIds));
  }, [historyIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(searchHistory));
  }, [searchHistory]);

  // Toasts
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3200);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addSearchHistory = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setSearchHistory((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
      return [trimmed, ...filtered].slice(0, 10);
    });
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    showToast('Search history cleared', 'info');
  };

  const navigateToModel = (modelOrId: string | Model) => {
    let targetModel: Model | undefined;
    if (typeof modelOrId === 'string') {
      targetModel = models.find((m) => m.id === modelOrId || m.name.toLowerCase() === modelOrId.toLowerCase());
    } else {
      targetModel = modelOrId;
    }
    if (targetModel) {
      setSelectedModel(targetModel);
      setViewMode('model-profile');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleFollowModel = (modelId: string) => {
    setModels((prev) =>
      prev.map((m) => {
        if (m.id === modelId) {
          const nextFollowed = !m.isFollowed;
          const nextFollowers = nextFollowed ? m.followers + 1 : m.followers - 1;
          const updated = { ...m, isFollowed: nextFollowed, followers: nextFollowers };
          if (selectedModel?.id === modelId) {
            setSelectedModel(updated);
          }
          showToast(nextFollowed ? `Following ${m.name}` : `Unfollowed ${m.name}`, 'info');
          return updated;
        }
        return m;
      })
    );
  };

  const toggleLike = (id: string) => {
    const isCurrentlyLiked = likedIds.includes(id);
    setLikedIds((prev) =>
      isCurrentlyLiked ? prev.filter((item) => item !== id) : [...prev, id]
    );

    setVideos((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          const newLikes = isCurrentlyLiked ? Math.max(0, v.likes - 1) : v.likes + 1;
          return { ...v, likes: newLikes, isLiked: !isCurrentlyLiked };
        }
        return v;
      })
    );

    if (activeVideo && activeVideo.id === id) {
      setActiveVideo((prev) =>
        prev
          ? {
              ...prev,
              likes: isCurrentlyLiked ? Math.max(0, prev.likes - 1) : prev.likes + 1,
              isLiked: !isCurrentlyLiked,
            }
          : null
      );
    }

    showToast(isCurrentlyLiked ? 'Removed from Liked Videos' : 'Saved to Liked Videos', 'info');
  };

  const toggleWatchLater = (id: string) => {
    const isSaved = watchLaterIds.includes(id);
    setWatchLaterIds((prev) =>
      isSaved ? prev.filter((item) => item !== id) : [...prev, id]
    );

    showToast(isSaved ? 'Removed from Watch Later' : 'Added to Watch Later', 'success');
  };

  const recordWatchHistory = (id: string) => {
    setHistoryIds((prev) => {
      const filtered = prev.filter((item) => item !== id);
      return [id, ...filtered].slice(0, 30);
    });
  };

  const addVideo = (videoData: Partial<Video>): Video => {
    const newId = `vid-${Date.now().toString(36)}`;
    const createdDate = new Date().toISOString().split('T')[0];

    const newVideo: Video = {
      id: newId,
      title: videoData.title || 'Untitled Video',
      description: videoData.description || 'No description provided.',
      thumbnail: videoData.thumbnail || INITIAL_VIDEOS[0].thumbnail,
      videoUrl: videoData.videoUrl || INITIAL_VIDEOS[0].videoUrl,
      duration: videoData.duration || '12:30',
      durationSeconds: videoData.durationSeconds || 750,
      views: 0,
      likes: 0,
      createdAt: createdDate,
      channel: videoData.channel || {
        id: 'ch-mono-studio',
        name: 'STUDIO CREATOR',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
        subscribers: '10.5K',
        verified: true,
      },
      category: videoData.category || 'Cinematography',
      tags: videoData.tags || ['4K', 'Monochrome'],
      quality: videoData.quality || '4K UHD',
      isFeatured: videoData.isFeatured || false,
      status: videoData.status || 'Published',
      modelIds: videoData.modelIds || [],
      comments: [],
    };

    setVideos((prev) => [newVideo, ...prev]);
    showToast('Video added to library', 'success');
    return newVideo;
  };

  const updateVideo = (updated: Video) => {
    setVideos((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
    if (activeVideo && activeVideo.id === updated.id) {
      setActiveVideo(updated);
    }
    showToast('Video updated successfully', 'success');
  };

  const deleteVideo = (id: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
    setWatchLaterIds((prev) => prev.filter((item) => item !== id));
    setLikedIds((prev) => prev.filter((item) => item !== id));
    setHistoryIds((prev) => prev.filter((item) => item !== id));
    if (activeVideo?.id === id) {
      setActiveVideo(null);
    }
    showToast('Video deleted from CMS', 'info');
  };

  const batchDeleteVideos = (ids: string[]) => {
    setVideos((prev) => prev.filter((v) => !ids.includes(v.id)));
    setWatchLaterIds((prev) => prev.filter((item) => !ids.includes(item)));
    setLikedIds((prev) => prev.filter((item) => !ids.includes(item)));
    setHistoryIds((prev) => prev.filter((item) => !ids.includes(item)));
    if (activeVideo && ids.includes(activeVideo.id)) {
      setActiveVideo(null);
    }
    showToast(`Deleted ${ids.length} videos from CMS`, 'info');
  };

  const batchUpdateCategory = (ids: string[], newCategory: string) => {
    setVideos((prev) =>
      prev.map((v) => (ids.includes(v.id) ? { ...v, category: newCategory } : v))
    );
    showToast(`Updated category for ${ids.length} videos`, 'success');
  };

  const batchUpdateStatus = (ids: string[], newStatus: 'Published' | 'Draft' | 'Unlisted') => {
    setVideos((prev) =>
      prev.map((v) => (ids.includes(v.id) ? { ...v, status: newStatus } : v))
    );
    showToast(`Updated status to ${newStatus} for ${ids.length} videos`, 'success');
  };

  const addComment = (videoId: string, text: string) => {
    if (!text.trim()) return;
    const newComment = {
      id: `comm-${Date.now()}`,
      author: 'You (Creator)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      timestamp: 'Just now',
      text: text.trim(),
      likes: 0,
    };

    setVideos((prev) =>
      prev.map((v) => {
        if (v.id === videoId) {
          return {
            ...v,
            comments: [newComment, ...v.comments],
          };
        }
        return v;
      })
    );

    if (activeVideo && activeVideo.id === videoId) {
      setActiveVideo((prev) =>
        prev
          ? {
              ...prev,
              comments: [newComment, ...prev.comments],
            }
          : null
      );
    }

    showToast('Comment posted', 'success');
  };

  const resetToDefaultCatalog = () => {
    setVideos(INITIAL_VIDEOS);
    setModels(INITIAL_MODELS);
    localStorage.removeItem(STORAGE_KEYS.VIDEOS);
    localStorage.removeItem(STORAGE_KEYS.MODELS);
    showToast('Catalog restored to default 4K showcase', 'info');
  };

  // Filtered and sorted videos calculation
  const filteredVideos = React.useMemo(() => {
    let result = [...videos];

    // Filter by view mode
    if (viewMode === 'trending') {
      result.sort((a, b) => b.views - a.views);
    } else if (viewMode === 'watch-later') {
      result = result.filter((v) => watchLaterIds.includes(v.id));
    } else if (viewMode === 'liked') {
      result = result.filter((v) => likedIds.includes(v.id));
    } else if (viewMode === 'history') {
      // Ordered by history order
      const map = new Map(historyIds.map((id, index) => [id, index]));
      result = result
        .filter((v) => map.has(v.id))
        .sort((a, b) => (map.get(a.id) ?? 0) - (map.get(b.id) ?? 0));
    } else if (viewMode === 'model-profile' && selectedModel) {
      // Show ALL videos that feature this model
      result = result.filter((v) => {
        return (
          v.modelIds?.includes(selectedModel.id) ||
          v.title.toLowerCase().includes(selectedModel.name.toLowerCase()) ||
          v.tags.some((t) => t.toLowerCase() === selectedModel.name.toLowerCase())
        );
      });
    }

    // Category filter
    if (selectedCategory !== 'All' && viewMode !== 'model-profile') {
      if (selectedCategory === '4K UHD') {
        result = result.filter((v) => v.quality === '4K UHD');
      } else {
        result = result.filter((v) => v.category === selectedCategory);
      }
    }

    // Search query filter
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter((v) => {
        return (
          v.title.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q) ||
          v.category.toLowerCase().includes(q) ||
          v.channel.name.toLowerCase().includes(q) ||
          v.tags.some((tag) => tag.toLowerCase().includes(q))
        );
      });
    }

    // Advanced filters
    if (filterOptions.quality !== 'all') {
      result = result.filter((v) => v.quality === filterOptions.quality);
    }

    if (filterOptions.durationRange !== 'all') {
      if (filterOptions.durationRange === 'short') {
        result = result.filter((v) => v.durationSeconds < 300); // < 5 min
      } else if (filterOptions.durationRange === 'medium') {
        result = result.filter((v) => v.durationSeconds >= 300 && v.durationSeconds <= 1200); // 5-20 min
      } else if (filterOptions.durationRange === 'long') {
        result = result.filter((v) => v.durationSeconds > 1200); // > 20 min
      }
    }

    // Sorting
    if (viewMode !== 'history') {
      if (filterOptions.sortBy === 'views') {
        result.sort((a, b) => b.views - a.views);
      } else if (filterOptions.sortBy === 'newest') {
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } else if (filterOptions.sortBy === 'rating') {
        result.sort((a, b) => b.likes - a.likes);
      } else if (filterOptions.sortBy === 'duration') {
        result.sort((a, b) => b.durationSeconds - a.durationSeconds);
      }
    }

    return result;
  }, [videos, viewMode, selectedModel, selectedCategory, searchQuery, filterOptions, watchLaterIds, likedIds, historyIds]);

  return (
    <TubeContext.Provider
      value={{
        videos,
        filteredVideos,
        models,
        selectedModel,
        setSelectedModel,
        navigateToModel,
        toggleFollowModel,
        activeVideo,
        setActiveVideo,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        viewMode,
        setViewMode,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        theme,
        setTheme,
        toggleTheme,
        filterOptions,
        setFilterOptions,
        watchLaterIds,
        likedIds,
        historyIds,
        searchHistory,
        addSearchHistory,
        clearSearchHistory,
        toggleLike,
        toggleWatchLater,
        recordWatchHistory,
        addVideo,
        updateVideo,
        deleteVideo,
        batchDeleteVideos,
        batchUpdateCategory,
        batchUpdateStatus,
        addComment,
        resetToDefaultCatalog,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </TubeContext.Provider>
  );
};

export const useTube = () => {
  const context = useContext(TubeContext);
  if (!context) {
    throw new Error('useTube must be used within a TubeProvider');
  }
  return context;
};
