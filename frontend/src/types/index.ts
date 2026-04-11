// User types
export interface User {
  user_id: string;
  email: string;
  full_name: string;
  bank_affiliation: string;
  role: 'bank_officer' | 'trainer' | 'admin';
  email_verified: boolean;
  created_at: string;
  last_login?: string;
  status: 'active' | 'inactive' | 'suspended';
}

export interface AuthState {
  user: User | null;
  access_token: string | null;
  refresh_token: string | null;
  is_authenticated: boolean;
  is_loading: boolean;
  error: string | null;
}

// Practice types
export interface Question {
  id: string;
  paper_name: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question_text: string;
  options: string[];
  correct_answer: string;
  rbi_reference?: string;
  iibf_reference?: string;
}

export interface PracticeSession {
  session_id: string;
  user_id: string;
  paper_name: string;
  questions: Question[];
  user_answers: Record<string, string>;
  score?: number;
  time_taken?: number;
  submitted_at?: string;
  status: 'in_progress' | 'completed' | 'expired';
  version: string;
}

export interface SessionResult {
  score: number;
  results: QuestionResult[];
  time_taken: number;
  passed: boolean;
}

export interface QuestionResult {
  question_id: string;
  correct: boolean;
  user_answer: string;
  correct_answer: string;
}

// Dashboard types
export interface PerformanceMetrics {
  overall_score: number;
  total_sessions: number;
  average_score: number;
  total_study_time: number;
  last_session_date?: string;
}

export interface PaperPerformance {
  paper_name: string;
  average_score: number;
  sessions_completed: number;
  accuracy_by_topic: Record<string, number>;
}

export interface DashboardData {
  metrics: PerformanceMetrics;
  paper_performance: PaperPerformance[];
  weak_areas: string[];
  strong_areas: string[];
  trend_data: TrendPoint[];
}

export interface TrendPoint {
  date: string;
  score: number;
}

// Notification types
export interface Notification {
  notification_id: string;
  user_id: string;
  type: 'milestone' | 'reminder' | 'update';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  action_url?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirm_password: string;
  full_name: string;
  bank_affiliation: string;
}

export interface PasswordResetFormData {
  email: string;
}

export interface NewPasswordFormData {
  token: string;
  new_password: string;
  confirm_password: string;
}

// Admin Analytics types
export interface AdminAnalyticsData {
  total_users: number;
  active_users_7d: number;
  active_users_30d: number;
  active_users_90d: number;
  total_practice_sets: number;
  average_score: number;
  daily_active_users: TrendPoint[];
  performance_by_paper: PaperPerformance[];
  most_attempted_questions: QuestionStats[];
  most_skipped_questions: QuestionStats[];
  system_metrics: SystemMetrics;
  top_users: TopUser[];
}

export interface QuestionStats {
  question_id: string;
  question_text: string;
  attempt_count: number;
  skip_count?: number;
  average_score?: number;
}

export interface SystemMetrics {
  api_response_time_ms: number;
  error_rate: number;
  uptime_percentage: number;
  last_updated: string;
}

export interface TopUser {
  user_id: string;
  full_name: string;
  email: string;
  completion_count: number;
  average_score: number;
}

// Question Bank Management types
export interface MCQFormData {
  question_text: string;
  options: [string, string, string, string];
  correct_answer: 'A' | 'B' | 'C' | 'D';
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  rbi_reference?: string;
  iibf_reference?: string;
}

export interface QuestionBankVersion {
  version_id: string;
  version_number: string;
  published_at: string;
  publisher_id: string;
  publisher_name: string;
  change_summary: string;
  question_count: number;
}

export interface QuestionBankSearchParams {
  paper?: string;
  topic?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  keyword?: string;
  page?: number;
  page_size?: number;
}
