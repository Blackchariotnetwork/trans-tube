import React from 'react';
import { useTube } from '../../context/TubeContext';
import {
  Home,
  Flame,
  Tv,
  Users,
  History,
  Clock,
  ThumbsUp,
  X,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import { ViewMode } from '../../types/video';

export const Sidebar: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    isSidebarCollapsed,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    watchLaterIds,
    likedIds,
    historyIds,
    models,
    navigateToModel,
    selectedModel,
  } = useTube();

  const handleNavClick = (mode: ViewMode) => {
    setViewMode(mode);
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { mode: 'home' as ViewMode, label: 'Home', icon: Home },
    { mode: 'trending' as ViewMode, label: 'Trending', icon: Flame },
    { mode: 'models' as ViewMode, label: 'Models & Stars', icon: Users },
    { mode: 'subscriptions' as ViewMode, label: 'Subscriptions', icon: Tv },
  ];

  const libraryItems = [
    {
      mode: 'watch-later' as ViewMode,
      label: 'Watch Later',
      icon: Clock,
      count: watchLaterIds.length,
    },
    {
      mode: 'liked' as ViewMode,
      label: 'Liked Videos',
      icon: ThumbsUp,
      count: likedIds.length,
    },
    {
      mode: 'history' as ViewMode,
      label: 'History',
      icon: History,
      count: historyIds.length,
    },
  ];

  const subscribedCreators = [
    {
      id: 'ch-urban-cinema',
      name: 'NOIR ARCHIVE',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      live: false,
    },
    {
      id: 'ch-arch-digest',
      name: 'TECTONIC FORM',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      live: false,
    },
    {
      id: 'ch-cosmos-deep',
      name: 'DEEP SPACE LAB',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop&crop=face',
      live: false,
    },
    {
      id: 'ch-sound-craft',
      name: 'OSCILLATOR LAB',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      live: false,
    },
    {
      id: 'ch-type-craft',
      name: 'TYPO ATELIER',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop&crop=face',
      live: false,
    },
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-14 bottom-0 left-0 z-50 lg:z-30 flex flex-col bg-white dark:bg-[#09090b] border-r border-zinc-200 dark:border-zinc-800 transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? 'translate-x-0 w-64 shadow-2xl'
            : '-translate-x-full lg:translate-x-0'
        } ${isSidebarCollapsed ? 'lg:w-[72px]' : 'lg:w-60'}`}
      >
        {/* Mobile Header in Drawer */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800 lg:hidden">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-16 rounded-md overflow-hidden border border-zinc-300 dark:border-zinc-700 bg-black shrink-0 shadow-sm">
              <img
                src="/assets/aistudio/download__16__2182f6fd.jfif"
                alt="MONO TUBE Logo"
                className="w-full h-full object-cover grayscale contrast-125"
              />
            </div>
            <span className="font-bold text-sm text-zinc-900 dark:text-white">
              MONO TUBE
            </span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1.5 text-zinc-500 hover:text-black dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-5">
          {/* Main Discovery Group */}
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.mode === 'models'
                  ? viewMode === 'models' || viewMode === 'model-profile'
                  : viewMode === item.mode;
              return (
                <button
                  key={item.mode}
                  onClick={() => handleNavClick(item.mode)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-950 dark:hover:text-white'
                  } ${isSidebarCollapsed ? 'lg:justify-center lg:px-2' : ''}`}
                  title={isSidebarCollapsed ? item.label : undefined}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span
                    className={`truncate ${
                      isSidebarCollapsed ? 'lg:hidden' : 'inline'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="border-t border-zinc-200 dark:border-zinc-800/80 pt-3" />

          {/* Featured Models List */}
          <div className="space-y-1">
            {!isSidebarCollapsed && (
              <div className="px-3 pb-1 flex items-center justify-between text-[10px] font-mono tracking-wider uppercase text-zinc-400 dark:text-zinc-500">
                <span>Top Models</span>
                <button
                  onClick={() => handleNavClick('models')}
                  className="hover:text-black dark:hover:text-white transition-colors"
                >
                  View All
                </button>
              </div>
            )}
            {models.slice(0, 4).map((model) => {
              const isCurrent =
                viewMode === 'model-profile' && selectedModel?.id === model.id;
              return (
                <button
                  key={model.id}
                  onClick={() => {
                    navigateToModel(model);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors group text-left ${
                    isCurrent
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-bold'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  } ${isSidebarCollapsed ? 'lg:justify-center lg:px-2' : ''}`}
                  title={isSidebarCollapsed ? model.name : undefined}
                >
                  <img
                    src={model.avatar}
                    alt={model.name}
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 rounded-full object-cover grayscale contrast-125 border border-zinc-300 dark:border-zinc-700 shrink-0"
                  />
                  <div
                    className={`flex-1 min-w-0 ${
                      isSidebarCollapsed ? 'lg:hidden' : 'block'
                    }`}
                  >
                    <div className="truncate font-semibold text-xs leading-tight">
                      {model.name}
                    </div>
                    <div className="text-[10px] text-zinc-400 font-mono truncate leading-tight mt-0.5">
                      {model.stats.specialty.split('&')[0].trim()}
                    </div>
                  </div>
                  {model.verified && !isSidebarCollapsed && (
                    <CheckCircle className="w-3 h-3 text-zinc-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="border-t border-zinc-200 dark:border-zinc-800/80 pt-3" />

          {/* Library Section */}
          <div className="space-y-1">
            {!isSidebarCollapsed && (
              <div className="px-3 pb-1 text-[10px] font-mono tracking-wider uppercase text-zinc-400 dark:text-zinc-500">
                Library
              </div>
            )}
            {libraryItems.map((item) => {
              const Icon = item.icon;
              const isActive = viewMode === item.mode;
              return (
                <button
                  key={item.mode}
                  onClick={() => handleNavClick(item.mode)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-950 dark:hover:text-white'
                  } ${isSidebarCollapsed ? 'lg:justify-center lg:px-2' : ''}`}
                  title={isSidebarCollapsed ? item.label : undefined}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span
                      className={`truncate ${
                        isSidebarCollapsed ? 'lg:hidden' : 'inline'
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                  {item.count > 0 && !isSidebarCollapsed && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 text-zinc-500">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Subscriptions List */}
          <div
            className={`border-t border-zinc-200 dark:border-zinc-800/80 pt-3 ${
              isSidebarCollapsed ? 'lg:hidden' : 'block'
            }`}
          >
            <div className="px-3 pb-2 text-[10px] font-mono tracking-wider uppercase text-zinc-400 dark:text-zinc-500">
              Subscriptions
            </div>
            <div className="space-y-1">
              {subscribedCreators.map((creator) => (
                <button
                  key={creator.id}
                  onClick={() => handleNavClick('subscriptions')}
                  className="w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group text-left"
                >
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    referrerPolicy="no-referrer"
                    className="w-5 h-5 rounded-full object-cover grayscale contrast-125 shrink-0"
                  />
                  <span className="truncate flex-1 font-medium text-xs">
                    {creator.name}
                  </span>
                  <CheckCircle className="w-3 h-3 text-zinc-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Footer info */}
        <div
          className={`p-3 border-t border-zinc-200 dark:border-zinc-800 text-[10px] text-zinc-400 ${
            isSidebarCollapsed ? 'lg:hidden' : 'block'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono">MONO TUBE</span>
            <span className="font-mono text-zinc-500">5X ULTRA</span>
          </div>
        </div>
      </aside>
    </>
  );
};
