import React from 'react';
import { useTube } from '../../context/TubeContext';
import { Home, Flame, Users, Clock, ThumbsUp } from 'lucide-react';
import { ViewMode } from '../../types/video';

export const MobileNav: React.FC = () => {
  const { viewMode, setViewMode } = useTube();

  const tabs = [
    { mode: 'home' as ViewMode, label: 'Home', icon: Home },
    { mode: 'trending' as ViewMode, label: 'Trending', icon: Flame },
    {
      mode: 'models' as ViewMode,
      label: 'Models',
      icon: Users,
      isActive: viewMode === 'models' || viewMode === 'model-profile',
    },
    { mode: 'watch-later' as ViewMode, label: 'Saved', icon: Clock },
    { mode: 'liked' as ViewMode, label: 'Liked', icon: ThumbsUp },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 safe-area-bottom">
      <div className="grid grid-cols-5 h-14">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.isActive !== undefined ? tab.isActive : viewMode === tab.mode;

          return (
            <button
              key={tab.label}
              onClick={() => setViewMode(tab.mode)}
              className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors ${
                isActive
                  ? 'text-zinc-950 dark:text-white font-bold'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
