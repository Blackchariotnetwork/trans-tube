import React, { useState } from 'react';
import { TubeProvider, useTube } from './context/TubeContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { FilterRibbon } from './components/search/FilterRibbon';
import { AdvancedFilterModal } from './components/search/AdvancedFilterModal';
import { VideoGrid } from './components/video/VideoGrid';
import { VideoPlayerModal } from './components/video/VideoPlayerModal';
import { ModelsDirectory } from './components/model/ModelsDirectory';
import { ModelProfilePage } from './components/model/ModelProfilePage';
import { ToastContainer } from './components/common/Toast';
import { TrendingUp, Clock, ThumbsUp, History, Tv, Users } from 'lucide-react';

const TubeApp: React.FC = () => {
  const {
    filteredVideos,
    viewMode,
    isSidebarCollapsed,
    activeVideo,
    setActiveVideo,
  } = useTube();

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Render view-specific content
  const renderMainContent = () => {
    switch (viewMode) {
      case 'models':
        return <ModelsDirectory />;

      case 'model-profile':
        return <ModelProfilePage />;

      case 'trending':
        return (
          <div className="space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-zinc-200 dark:border-zinc-800">
              <TrendingUp className="w-5 h-5 text-zinc-900 dark:text-white" />
              <div>
                <h1 className="text-base font-bold text-zinc-950 dark:text-white">
                  Trending Now
                </h1>
                <p className="text-xs text-zinc-500">
                  Most viewed 4K cinematography, architectural studies, and modular audio
                </p>
              </div>
            </div>
            <VideoGrid videos={filteredVideos} />
          </div>
        );

      case 'subscriptions':
        return (
          <div className="space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-zinc-200 dark:border-zinc-800">
              <Tv className="w-5 h-5 text-zinc-900 dark:text-white" />
              <div>
                <h1 className="text-base font-bold text-zinc-950 dark:text-white">
                  Subscribed Channels
                </h1>
                <p className="text-xs text-zinc-500">
                  Latest releases from your followed creators
                </p>
              </div>
            </div>
            <VideoGrid videos={filteredVideos} />
          </div>
        );

      case 'watch-later':
        return (
          <div className="space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-zinc-200 dark:border-zinc-800">
              <Clock className="w-5 h-5 text-zinc-900 dark:text-white" />
              <div>
                <h1 className="text-base font-bold text-zinc-950 dark:text-white">
                  Watch Later Queue
                </h1>
                <p className="text-xs text-zinc-500">
                  Saved productions for distraction-free viewing
                </p>
              </div>
            </div>
            <VideoGrid videos={filteredVideos} />
          </div>
        );

      case 'liked':
        return (
          <div className="space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-zinc-200 dark:border-zinc-800">
              <ThumbsUp className="w-5 h-5 text-zinc-900 dark:text-white" />
              <div>
                <h1 className="text-base font-bold text-zinc-950 dark:text-white">
                  Liked Productions
                </h1>
                <p className="text-xs text-zinc-500">
                  Your curated collection of top-rated videos
                </p>
              </div>
            </div>
            <VideoGrid videos={filteredVideos} />
          </div>
        );

      case 'history':
        return (
          <div className="space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-zinc-200 dark:border-zinc-800">
              <History className="w-5 h-5 text-zinc-900 dark:text-white" />
              <div>
                <h1 className="text-base font-bold text-zinc-950 dark:text-white">
                  Playback History
                </h1>
                <p className="text-xs text-zinc-500">
                  Recently viewed sessions across the platform
                </p>
              </div>
            </div>
            <VideoGrid videos={filteredVideos} />
          </div>
        );

      case 'home':
      default:
        return (
          <div className="space-y-6">
            {/* 5 VIDEOS PER ROW RESPONSIVE GRID */}
            <VideoGrid videos={filteredVideos} />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-950 dark:text-zinc-100 flex flex-col transition-colors duration-200 antialiased selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-900">
      {/* Top Navigation Header */}
      <Header
        onOpenAdvancedFilters={() => setIsFilterModalOpen(true)}
      />

      {/* Main Container with Collapsible Sidebar & Dynamic Margin */}
      <div className="flex-1 flex">
        {/* Sleek Sidebar Navigation */}
        <Sidebar />

        {/* Content Area */}
        <main
          className={`flex-1 min-w-0 transition-all duration-300 ease-in-out ${
            isSidebarCollapsed ? 'lg:pl-[72px]' : 'lg:pl-60'
          }`}
        >
          {/* Filter Ribbon on Discovery / Home Page */}
          {viewMode !== 'models' && viewMode !== 'model-profile' && <FilterRibbon />}

          {/* Main Content Body */}
          <div className="px-3 sm:px-6 py-5 pb-24 lg:pb-12 max-w-[1920px] mx-auto">
            {renderMainContent()}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Theater / Cinema Video Player Modal */}
      {activeVideo && (
        <VideoPlayerModal
          video={activeVideo}
          onClose={() => setActiveVideo(null)}
          onSelectVideo={(v) => setActiveVideo(v)}
        />
      )}

      {/* Advanced Filter Modal */}
      <AdvancedFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      />

      {/* Toast Feedback */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <TubeProvider>
      <TubeApp />
    </TubeProvider>
  );
}
