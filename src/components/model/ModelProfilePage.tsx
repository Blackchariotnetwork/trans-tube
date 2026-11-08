import React, { useState } from 'react';
import { useTube } from '../../context/TubeContext';
import { Model, Video } from '../../types/video';
import { VideoGrid } from '../video/VideoGrid';
import {
  CheckCircle,
  Users,
  MapPin,
  Calendar,
  Share2,
  Heart,
  Sparkles,
  ArrowLeft,
  Film,
  Camera,
  Globe,
  SlidersHorizontal,
} from 'lucide-react';

export const ModelProfilePage: React.FC = () => {
  const {
    selectedModel,
    filteredVideos,
    toggleFollowModel,
    setViewMode,
    showToast,
    filterOptions,
    setFilterOptions,
  } = useTube();

  const [activeTab, setActiveTab] = useState<'videos' | 'bio' | 'photos'>('videos');
  const [photoModalIndex, setPhotoModalIndex] = useState<number | null>(null);

  if (!selectedModel) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-base font-bold text-zinc-950 dark:text-white">
          No model selected
        </h2>
        <button
          onClick={() => setViewMode('models')}
          className="px-4 py-2 rounded-lg bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-semibold"
        >
          Browse All Models
        </button>
      </div>
    );
  }

  const modelVideos = filteredVideos;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast(`Copied profile link for ${selectedModel.name}`, 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Back button */}
      <button
        onClick={() => setViewMode('models')}
        className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span>All Models</span>
      </button>

      {/* Model Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xl">
        {/* Cover Background with Scrim */}
        <div className="relative h-44 sm:h-64 w-full overflow-hidden">
          <img
            src={selectedModel.coverImage}
            alt={`${selectedModel.name} Cover`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover grayscale contrast-125 opacity-40 scale-105 filter blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
        </div>

        {/* Hero Content Container */}
        <div className="relative px-4 sm:px-8 pb-6 -mt-16 sm:-mt-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
          {/* Avatar and Primary Identity */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
            {/* High-Resolution Portrait Photo */}
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-white dark:border-zinc-800 bg-zinc-900 shadow-2xl shrink-0">
              <img
                src={selectedModel.avatar}
                alt={selectedModel.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover grayscale contrast-125"
              />
              {selectedModel.verified && (
                <div className="absolute bottom-2 right-2 p-1 rounded-full bg-black/80 text-white backdrop-blur-sm border border-white/20">
                  <CheckCircle className="w-3.5 h-3.5 fill-current" />
                </div>
              )}
            </div>

            {/* Name, Stage Name & Specs */}
            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {selectedModel.name}
                </h1>
                {selectedModel.verified && (
                  <CheckCircle className="w-5 h-5 text-zinc-300" />
                )}
                {selectedModel.stageName && (
                  <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 border border-zinc-700/80 px-2 py-0.5 rounded-md">
                    {selectedModel.stageName}
                  </span>
                )}
              </div>

              {/* Quiet inline metadata */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {selectedModel.stats.location}
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Debut {selectedModel.stats.debutYear}
                </span>
                <span aria-hidden="true">·</span>
                <span>{selectedModel.stats.specialty}</span>
              </div>

              {/* Stats Counters */}
              <div className="flex items-center justify-center sm:justify-start gap-4 pt-1 text-xs font-mono">
                <div>
                  <span className="font-bold text-white text-sm">
                    {selectedModel.followers.toLocaleString()}
                  </span>{' '}
                  <span className="text-zinc-500">Followers</span>
                </div>
                <span aria-hidden="true" className="text-zinc-700">·</span>
                <div>
                  <span className="font-bold text-white text-sm">
                    {modelVideos.length}
                  </span>{' '}
                  <span className="text-zinc-500">Productions</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center justify-center sm:justify-end gap-2 shrink-0">
            <button
              onClick={() => toggleFollowModel(selectedModel.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                selectedModel.isFollowed
                  ? 'bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700'
                  : 'bg-white text-zinc-950 hover:bg-zinc-200 active:scale-95'
              }`}
            >
              <Heart
                className={`w-4 h-4 ${
                  selectedModel.isFollowed ? 'fill-current text-white' : ''
                }`}
              />
              <span>{selectedModel.isFollowed ? 'Following' : 'Follow Model'}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl border border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors shadow-sm"
              title="Share Model Profile"
              aria-label="Share model profile"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-6 px-4 sm:px-8 border-t border-zinc-800/80 bg-zinc-900/50">
          <button
            onClick={() => setActiveTab('videos')}
            className={`py-3 text-xs font-bold transition-colors border-b-2 ${
              activeTab === 'videos'
                ? 'border-white text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Videos ({modelVideos.length})
          </button>

          <button
            onClick={() => setActiveTab('bio')}
            className={`py-3 text-xs font-bold transition-colors border-b-2 ${
              activeTab === 'bio'
                ? 'border-white text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Biography & Specs
          </button>

          <button
            onClick={() => setActiveTab('photos')}
            className={`py-3 text-xs font-bold transition-colors border-b-2 ${
              activeTab === 'photos'
                ? 'border-white text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Photo Gallery ({selectedModel.galleryPhotos.length})
          </button>
        </div>
      </div>

      {/* Tab 1: All Model Videos (5 videos per row) */}
      {activeTab === 'videos' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
            <div>
              <h2 className="text-base font-bold text-zinc-950 dark:text-white">
                Productions Featuring {selectedModel.name}
              </h2>
              <p className="text-xs text-zinc-500">
                All 4K UHD and high-definition video appearances on MONO TUBE
              </p>
            </div>
            <div className="text-xs font-mono text-zinc-400">
              {modelVideos.length} videos · 5x Grid
            </div>
          </div>

          <VideoGrid videos={modelVideos} />
        </div>
      )}

      {/* Tab 2: Full Biography & Detailed Specs */}
      {activeTab === 'bio' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Biography Narrative */}
          <div className="md:col-span-8 space-y-6 p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div>
              <h3 className="text-sm font-mono uppercase tracking-wider text-zinc-400 mb-3">
                Full Biography
              </h3>
              <p className="text-sm leading-relaxed text-zinc-800 dark:text-zinc-200 font-sans">
                {selectedModel.bio}
              </p>
            </div>

            {/* Career Highlights */}
            <div>
              <h3 className="text-sm font-mono uppercase tracking-wider text-zinc-400 mb-3">
                Career Highlights & Milestones
              </h3>
              <ul className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300">
                {selectedModel.careerHighlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-2.5">
                    <span className="font-mono text-zinc-400 text-[10px] mt-0.5">
                      0{index + 1}.
                    </span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Physical & Professional Specs */}
          <div className="md:col-span-4 space-y-5 p-6 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <h3 className="text-sm font-mono uppercase tracking-wider text-zinc-400 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              Model Profile Specs
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-zinc-100 dark:border-zinc-800/60">
                <span className="text-zinc-500 font-mono">Nationality</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {selectedModel.stats.nationality}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-zinc-100 dark:border-zinc-800/60">
                <span className="text-zinc-500 font-mono">Location</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {selectedModel.stats.location}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-zinc-100 dark:border-zinc-800/60">
                <span className="text-zinc-500 font-mono">Debut Year</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 font-mono">
                  {selectedModel.stats.debutYear}
                </span>
              </div>

              {selectedModel.stats.height && (
                <div className="flex items-center justify-between py-1 border-b border-zinc-100 dark:border-zinc-800/60">
                  <span className="text-zinc-500 font-mono">Height</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100 font-mono">
                    {selectedModel.stats.height}
                  </span>
                </div>
              )}

              {selectedModel.stats.hairColor && (
                <div className="flex items-center justify-between py-1 border-b border-zinc-100 dark:border-zinc-800/60">
                  <span className="text-zinc-500 font-mono">Hair Color</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {selectedModel.stats.hairColor}
                  </span>
                </div>
              )}

              {selectedModel.stats.eyeColor && (
                <div className="flex items-center justify-between py-1 border-b border-zinc-100 dark:border-zinc-800/60">
                  <span className="text-zinc-500 font-mono">Eye Color</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {selectedModel.stats.eyeColor}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between py-1 border-b border-zinc-100 dark:border-zinc-800/60">
                <span className="text-zinc-500 font-mono">Focus Area</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {selectedModel.stats.specialty}
                </span>
              </div>
            </div>

            {/* Social Links */}
            {selectedModel.socialLinks && (
              <div className="pt-2 space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block">
                  Official Channels
                </span>
                <div className="space-y-1.5 font-mono text-xs">
                  {selectedModel.socialLinks.instagram && (
                    <div className="text-zinc-700 dark:text-zinc-300">
                      Instagram: <span className="text-zinc-900 dark:text-white font-medium">{selectedModel.socialLinks.instagram}</span>
                    </div>
                  )}
                  {selectedModel.socialLinks.twitter && (
                    <div className="text-zinc-700 dark:text-zinc-300">
                      X / Twitter: <span className="text-zinc-900 dark:text-white font-medium">{selectedModel.socialLinks.twitter}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Photo Gallery / Stills */}
      {activeTab === 'photos' && (
        <div className="space-y-4">
          <div className="pb-2 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-base font-bold text-zinc-950 dark:text-white">
              Editorial Stills & Gallery
            </h2>
            <p className="text-xs text-zinc-500">
              High-resolution portrait photography and production frame captures
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {selectedModel.galleryPhotos.map((photoUrl, idx) => (
              <div
                key={idx}
                onClick={() => setPhotoModalIndex(idx)}
                className="relative aspect-square rounded-xl overflow-hidden bg-zinc-900 border border-zinc-200 dark:border-zinc-800 group cursor-pointer shadow-sm"
              >
                <img
                  src={photoUrl}
                  alt={`${selectedModel.name} frame ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale contrast-125 transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Modal for Gallery */}
      {photoModalIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPhotoModalIndex(null)}
        >
          <div className="max-w-3xl max-h-[90vh] rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 p-2">
            <img
              src={selectedModel.galleryPhotos[photoModalIndex]}
              alt="Model Fullframe"
              referrerPolicy="no-referrer"
              className="w-full h-auto max-h-[80vh] object-contain grayscale contrast-125 rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
