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
  exam_preference?: string;
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
export type QuestionType =
  | 'single_choice'
  | 'multi_select'
  | 'yes_no'
  | 'case_study'
  | 'drag_drop'
  | 'hot_area'
  | 'build_list'
  | 'ordering';

export interface Question {
  question_id: string;
  paper_name: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question_text: string;
  options: Record<string, string>;
  correct_answer: string; // single_choice: "A", multi_select: also stored as "A,C" for backward compat
  question_type?: QuestionType; // defaults to 'single_choice' for backward compat
  correct_answers?: string[]; // multi_select / yes_no: ["A","C"] or ["Yes","No"]
  statements?: string[]; // yes_no per-statement text
  case_study_id?: string;
  scenario?: string;
  exhibits?: { title: string; content: string }[];
  drag_items?: { id: string; label: string }[];
  drop_zones?: { id: string; label: string }[];
  correct_mapping?: Record<string, string>;
  correct_order?: string[];
  image_url?: string;
  hot_areas?: { id: string; coords: number[]; shape?: string }[];
  correct_area?: string;
  rbi_reference?: string;
  iibf_reference?: string;
}

export type UserAnswer = string | string[] | Record<string, string>;

export interface PracticeSession {
  session_id: string;
  user_id: string;
  paper_name: string;
  questions: Question[];
  user_answers: Record<string, UserAnswer>;
  score?: number;
  time_taken?: number;
  submitted_at?: string;
  status: 'generating' | 'ready' | 'in_progress' | 'completed' | 'expired';
  version: string;
  mode?: 'practice' | 'mock_test';
  duration_minutes?: number;
  total_marks?: number;
  pass_marks?: number;
  marks_config?: {
    easy: { count: number; marks: number };
    medium: { count: number; marks: number };
    hard: { count: number; marks: number };
  };
}

export interface SessionResult {
  score: number;
  results: QuestionResult[];
  time_taken: number;
  passed: boolean;
  mode?: 'mock_test' | 'practice';
  marks_earned?: number;
  total_marks?: number;
  pass_marks?: number;
  correct_count?: number;
  total_questions?: number;
  breakdown?: {
    easy: { total: number; correct: number; marks_per_q: number };
    medium: { total: number; correct: number; marks_per_q: number };
    hard: { total: number; correct: number; marks_per_q: number };
  };
}

export interface QuestionResult {
  question_id: string;
  question_text: string;
  options: Record<string, string>;
  correct: boolean;
  user_answer: UserAnswer;
  correct_answer: string;
  correct_answers?: string[];
  question_type?: QuestionType;
  difficulty?: string;
  marks?: number;
  max_marks?: number;
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
  topic_accuracy?: Record<string, number>;
  recommended_areas?: string[];
  exam_readiness?: Record<string, ExamReadinessData>;
  study_streak?: StudyStreakData;
  percentile_ranking?: Record<string, PercentileData>;
  difficulty_accuracy?: Record<string, number>;
  question_type_accuracy?: Record<string, number>;
  avg_time_per_paper?: Record<string, number>;
  time_trend?: { date: string; time_taken: number }[];
  coverage?: Record<string, { total: number; covered: number; pct: number; gaps: string[] }>;
}

export interface ExamReadinessData {
  score: number;
  label: string;
  recent_avg?: number;
  sessions_completed?: number;
  sessions_needed?: number;
  trend?: 'improving' | 'declining' | 'stable';
}

export interface StudyStreakData {
  current_streak: number;
  longest_streak: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface PercentileData {
  percentile: number | null;
  total_users: number;
  your_avg: number;
  message: string;
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

// Admin Analytics types (GET /dashboard/analytics?range=7|30|90&exam=ALL|JAIIB|...)
export interface AnalyticsDeltas {
  active_users: number | null;
  test_attempts: number | null;
  avg_score: number | null;
  avg_time_sec: number | null;
  retention_pct: number | null;
}

export interface AnalyticsOverviewData {
  total_users: number;
  total_registered: number;
  unverified_pending: number;
  active_users: number;
  test_attempts: number;
  avg_score: number;
  avg_time_sec: number;
  retention_pct: number;
  deltas: AnalyticsDeltas;
}

export interface AnalyticsGrowthPoint {
  date: string;
  new_users: number;
  active_users: number;
  attempts: number;
}

export interface AnalyticsExamRow {
  paper_name: string;
  exam: string;
  attempts: number;
  avg_score: number;
  avg_time_sec: number;
  delta_score: number | null;
}

export interface AnalyticsSubjectRow {
  topic: string;
  attempts: number;
  accuracy: number;
}

export interface AnalyticsInsight {
  level: 'warn' | 'good' | 'info';
  text: string;
}

export interface AnalyticsActivityRow {
  user_id: string;
  name: string;
  email: string;
  paper_name: string;
  exam: string;
  score: number;
  attempts: number;
  last_active: string;
}

// Phase 2: product intelligence
export interface AnalyticsFunnelStage {
  stage: string;
  label: string;
  count: number;
  conversion: number;
}

export interface AnalyticsCohort {
  cohort: string;
  size: number;
  w0: number | null;
  w1: number | null;
  w2: number | null;
  w3: number | null;
}

export interface AnalyticsDifficultQuestion {
  question_id: string;
  paper_name: string;
  topic: string;
  question_text: string;
  attempts: number;
  accuracy: number;
  skip_count: number;
  suspect: boolean;
}

export interface AnalyticsDropoff {
  label: string;
  count: number;
  detail: string;
}

export interface AdminAnalyticsData {
  range_days: number;
  exam: string;
  overview: AnalyticsOverviewData;
  growth: AnalyticsGrowthPoint[];
  exam_performance: AnalyticsExamRow[];
  subject_performance: AnalyticsSubjectRow[];
  insights: AnalyticsInsight[];
  recent_activity: AnalyticsActivityRow[];
  top_users: TopUser[];
  funnel: AnalyticsFunnelStage[];
  cohorts: AnalyticsCohort[];
  difficult_questions: AnalyticsDifficultQuestion[];
  dropoff: AnalyticsDropoff[];
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
  // Extended Microsoft question types (issue #51). Defaults to single_choice.
  question_type?: QuestionType;
  correct_answers?: string[]; // multi_select: ["A","C"]; yes_no: ["Yes","No",...]
  statements?: string[]; // yes_no
  correct_order?: string[]; // build_list / ordering
  // hot_area authoring
  image_url?: string;
  hot_areas?: { id: string; coords: number[]; shape?: string }[];
  correct_area?: string;
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

// Question Report types
export interface QuestionReport {
  question_id: string;
  reason: 'wrong_answer' | 'incomplete_question' | 'wrong_options' | 'other';
  comment?: string;
}
