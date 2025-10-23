// User Types
export interface User {
  user_id: string;
  email: string;
  name: string;
  nickname: string;
  provider: 'google' | 'kakao' | 'naver';
  avatar_items: AvatarItem[];
  accessibility_profile?: AccessibilityProfile;
  xp: number;
  level: number;
  titles: string[];
  team_id?: string;
  created_at: string;
  last_login: string;
}

export interface AvatarItem {
  id: string;
  category: 'hair' | 'clothes' | 'accessory';
  unlocked_at: string;
}

export interface AccessibilityProfile {
  mobility_type?: 'manual_wheelchair' | 'electric_wheelchair' | 'stroller' | 'walking_aid' | 'cane' | 'none';
  preferences?: string[];
}

// Report Types
export type ReportType = 'barrier' | 'praise';
export type ReportStatus = 'active' | 'resolved' | 'archived';
export type AdminStatus = 'pending' | 'processing' | 'completed';

export type BarrierCategory =
  | 'blocked_sidewalk'
  | 'no_ramp'
  | 'damaged_ramp'
  | 'damaged_tactile_paving'
  | 'restroom_issue'
  | 'high_threshold'
  | 'elevator_issue'
  | 'signage_issue'
  | 'kiosk_accessibility'
  | 'other';

export type PraiseCategory =
  | 'good_ramp'
  | 'clean_restroom'
  | 'friendly_staff'
  | 'good_voice_guide'
  | 'wide_passage'
  | 'other';

export interface Report {
  report_id: string;
  user_id: string;
  type: ReportType;
  category: BarrierCategory | PraiseCategory;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  district: string;
  description: string;
  media_urls: string[];
  ai_analysis?: AIAnalysis;
  confidence_score: number;
  verify_count: number;
  status: ReportStatus;
  resolved_by?: string;
  resolved_at?: string;
  admin_status: AdminStatus;
  admin_note?: string;
  created_at: string;
  updated_at: string;
}

export interface AIAnalysis {
  detected_category?: string;
  severity?: 'low' | 'medium' | 'high';
  description?: string;
  tags?: string[];
}

// Verification Types
export type VerificationType = 'confirm' | 'resolve';

export interface Verification {
  verification_id: string;
  report_id: string;
  user_id: string;
  type: VerificationType;
  media_urls?: string[];
  comment?: string;
  created_at: string;
}

// Quest Types
export type QuestType = 'daily' | 'weekly' | 'special';

export interface Quest {
  quest_id: string;
  type: QuestType;
  title: string;
  description: string;
  requirement: QuestRequirement;
  reward_xp: number;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
}

export interface QuestRequirement {
  type: 'report_count' | 'verify_count' | 'specific_category' | 'specific_location';
  target: number;
  category?: string;
  location?: string;
}

export interface UserQuest {
  user_quest_id: string;
  user_id: string;
  quest_id: string;
  progress: QuestProgress;
  is_completed: boolean;
  completed_at?: string;
  claimed_reward: boolean;
}

export interface QuestProgress {
  current: number;
  target: number;
}

// Team Types
export interface Team {
  team_id: string;
  name: string;
  description: string;
  leader_id: string;
  members: string[];
  total_xp: number;
  created_at: string;
}

// Notification Types
export type NotificationType =
  | 'quest_complete'
  | 'level_up'
  | 'report_resolved'
  | 'report_verified'
  | 'team_invite'
  | 'admin_message';

export interface Notification {
  notification_id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}

// Map Types
export interface MapMarker {
  id: string;
  type: ReportType;
  category: string;
  latitude: number;
  longitude: number;
  status: ReportStatus;
  confidence_score: number;
}

export interface MapBounds {
  northEast: { lat: number; lng: number };
  southWest: { lat: number; lng: number };
}

// API Response Types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}
