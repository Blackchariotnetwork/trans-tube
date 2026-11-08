import React from 'react';
import { useTube } from '../../context/TubeContext';
import { CheckCircle, Heart, ArrowRight, Film, MapPin, Users } from 'lucide-react';
import { Model } from '../../types/video';

export const ModelsDirectory: React.FC = () => {
  const { models, navigateToModel, toggleFollowModel, videos } = useTube();

  return (
    <div className="space-y-6">
      {/* Directory Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-lg font-bold text-zinc-950 dark:text-white tracking-tight">
            Featured Models & Performers
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Explore complete biographies, official high-resolution portfolios, and video catalog appearances.
          </p>
        </div>
        <div className="text-xs font-mono text-zinc-400">
          {models.length} Verified Models
        </div>
      </div>

      {/* Models Grid (4 columns on desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {models.map((model) => {
          // Count videos featuring this model
          const modelVideoCount = videos.filter(
            (v) =>
              v.modelIds?.includes(model.id) ||
              v.title.toLowerCase().includes(model.name.toLowerCase()) ||
              v.tags.some((t) => t.toLowerCase() === model.name.toLowerCase())
          ).length;

          return (
            <article
              key={model.id}
              onClick={() => navigateToModel(model)}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-200 shadow-sm flex flex-col"
            >
              {/* High-Resolution Portrait Photo */}
              <div className="relative aspect-square w-full overflow-hidden bg-zinc-900">
                <img
                  src={model.avatar}
                  alt={model.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale contrast-125 transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Top Right Follow Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFollowModel(model.id);
                  }}
                  className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-md ${
                    model.isFollowed
                      ? 'bg-white text-zinc-950'
                      : 'bg-black/60 text-white hover:bg-black/80'
                  }`}
                  title={model.isFollowed ? 'Unfollow' : 'Follow'}
                  aria-label="Follow model"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      model.isFollowed ? 'fill-current text-zinc-950' : ''
                    }`}
                  />
                </button>

                {/* Bottom Overlay Info on Photo */}
                <div className="absolute bottom-3 inset-x-3 text-white">
                  <div className="flex items-center gap-1.5 font-bold text-sm">
                    <span className="truncate">{model.name}</span>
                    {model.verified && (
                      <CheckCircle className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
                    )}
                  </div>
                  {model.stageName && (
                    <div className="text-[10px] font-mono tracking-wider text-zinc-300 uppercase">
                      {model.stageName}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1 text-[11px] text-zinc-500 font-mono">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{model.stats.location}</span>
                  </div>

                  <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {model.bio}
                  </p>
                </div>

                {/* Metadata & View Profile Link */}
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs font-mono text-zinc-500">
                  <span className="flex items-center gap-1 text-zinc-800 dark:text-zinc-200 font-semibold">
                    <Film className="w-3.5 h-3.5 text-zinc-400" />
                    {modelVideoCount} videos
                  </span>

                  <span className="flex items-center gap-1 text-xs font-semibold text-zinc-900 dark:text-white group-hover:translate-x-0.5 transition-transform font-sans">
                    View Profile
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
