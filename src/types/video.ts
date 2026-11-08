export interface Comment {
  id: string;
  author: string;
  avatar: string;
  timestamp: string;
  text: string;
  likes: number;
  isLiked?: boolean;
}

export interface Model {
  id: string;
  name: string;
  stageName?: string;
  avatar: string;
  coverImage: string;
  bio: string;
  careerHighlights: string[];
  stats: {
    nationality: string;
    location: string;
    debutYear: string;
    height?: string;
    hairColor?: string;
    eyeColor?: string;
    specialty: string;
  };
  verified: boolean;
  followers: number;
  isFollowed?: boolean;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    website?: string;
  };
  galleryPhotos: string[];
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  durationSeconds: number;
  views: number;
  likes: number;
  isLiked?: boolean;
  isSaved?: boolean;
  createdAt: string; // e.g. "2026-11-04"
  channel: {
    id: string;
    name: string;
    avatar: string;
    subscribers: string;
    verified: boolean;
  };
  category: string;
  tags: string[];
  quality: '4K UHD' | '1080p HD' | '720p HD';
  isFeatured?: boolean;
  status: 'Published' | 'Draft' | 'Unlisted';
  comments: Comment[];
  modelIds?: string[]; // IDs of models appearing in this video
}

export type ViewMode = 
  | 'home' 
  | 'trending' 
  | 'subscriptions' 
  | 'models'
  | 'model-profile'
  | 'library' 
  | 'watch-later' 
  | 'liked' 
  | 'history' 
  | 'studio-cms' 
  | 'studio-analytics';

export interface FilterOptions {
  category: string;
  searchQuery: string;
  sortBy: 'views' | 'newest' | 'rating' | 'duration';
  quality: 'all' | '4K UHD' | '1080p HD';
  durationRange: 'all' | 'short' | 'medium' | 'long';
}
