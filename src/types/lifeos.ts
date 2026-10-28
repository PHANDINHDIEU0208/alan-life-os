/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Life OS Types Definition
 * Based on the Life OS Framework & Architecture Specification.
 */

export type FeedbackLoopStage = 
  | 'Observe' 
  | 'Understand' 
  | 'Decide' 
  | 'Act' 
  | 'Reflect' 
  | 'Learn' 
  | 'Renew';

export type StrategicBet = 'alpha' | 'cash_cow' | 'rnd' | 'kill';

export type DimensionKey = 
  | 'career' 
  | 'wealth' 
  | 'health' 
  | 'relationships' 
  | 'intelligence' 
  | 'spirituality';

export interface Principle {
  id: string;
  title: string;
  description: string;
  category: string;
  isCore: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IdentityAnchor {
  id: string;
  statement: string;
  type: 'aspiring' | 'anchor' | 'anti_identity';
  dimensionKey?: DimensionKey;
  createdAt: string;
}

export interface NorthStar {
  purpose: string;
  vision: string;
  coreMotto: string;
  lastUpdated: string;
}

export interface LifeDimension {
  id: DimensionKey;
  name: string;
  nameVi: string;
  description: string;
  currentRating: number; // 1-10
  targetRating: number;  // 1-10
  focusWeight: 'primary' | 'secondary' | 'maintenance';
  icon: string;
  color: string;
}

export interface StrategicTheme {
  id: string;
  title: string;
  timeframe: string; // e.g. "2026 - 2028"
  description: string;
  status: 'active' | 'upcoming' | 'completed';
}

export type GoalStatus = 'not_started' | 'active' | 'completed' | 'paused';

export interface Goal {
  id: string;
  title: string;
  description: string;
  dimensionId: DimensionKey;
  targetDate: string;
  status: GoalStatus;
  progressPercent: number;
  strategicThemeId?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProjectStatus = 'planning' | 'in_progress' | 'blocked' | 'completed';

export interface ProjectTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Project {
  id: string;
  title: string;
  goalId?: string;
  status: ProjectStatus;
  priority: 'high' | 'medium' | 'low';
  strategicBet: StrategicBet;
  dueDate: string;
  tasks: ProjectTask[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type KPIFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly';
export type KPIDirection = 'increase' | 'decrease' | 'maintain' | 'qualitative';

export interface KPIMeasurement {
  id: string;
  date: string;
  value: number;
  note?: string;
}

export interface KPI {
  id: string;
  title: string;
  definition: string;
  formula: string;
  unit: string;
  frequency: KPIFrequency;
  direction: KPIDirection;
  targetValue: number | null;
  currentValue: number | null;
  hasMeasurement: boolean; // Distinguish missing measurement from 0!
  history: KPIMeasurement[];
  linkedGoalId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Habit {
  id: string;
  title: string;
  frequency: string;
  targetPerWeek: number;
  streakDays: number;
  history: Record<string, boolean>; // 'YYYY-MM-DD': boolean
  category: DimensionKey;
  createdAt: string;
}

export interface DailyAction {
  id: string;
  date: string; // 'YYYY-MM-DD'
  text: string;
  isPriority: boolean; // One of the 3 key non-negotiables for the day
  completed: boolean;
  projectId?: string;
  timeSpentMinutes?: number;
  energyLevel?: 'high' | 'medium' | 'low';
  createdAt: string;
}

export interface WeeklyPriority {
  id: string;
  weekNumber: number;
  year: number;
  text: string;
  completed: boolean;
  linkedGoalId?: string;
}

export interface WeeklyReview {
  id: string;
  weekNumber: number;
  year: number;
  createdAt: string;
  
  // The 8 standardized reflection questions:
  q1_mostImportant: string;          // Điều quan trọng nhất tuần qua
  q2_intendedOutcomes: string;       // Dự định ban đầu
  q3_actualResults: string;          // Thực tế diễn ra
  q4_valueCreated: string;           // Giá trị tạo ra
  q5_incompleteAndCauses: string;    // Chưa xong và nguyên nhân đã biết
  q6_changedAssumptions: string;     // Giả định đã thay đổi
  q7_pivotAction: 'continue' | 'stop' | 'change'; // Tiếp tục, dừng lại hay thay đổi
  q7_pivotNotes: string;
  q8_nextWeekPriorities: string[];   // 3 ưu tiên tuần tiếp theo
  
  linkedGoalIds: string[];
  linkedProjectIds: string[];
  copilotSummary?: string;
}

export interface DecisionOption {
  id: string;
  title: string;
  pros: string;
  cons: string;
}

export interface DecisionLog {
  id: string;
  createdAt: string;
  question: string;
  options: DecisionOption[];
  criteria: string;
  assumptions: string;
  uncertaintyLevel: 'low' | 'medium' | 'high';
  chosenOption: string;
  rationale: string;
  reviewDate: string;
  actualOutcome?: string;
  lessonsLearned?: string;
  status: 'pending_review' | 'reviewed' | 'abandoned';
  linkedGoalId?: string;
}

export interface CopilotInsightResponse {
  verifiedObservations: string[];   // 1. Quan sát đã xác minh (chỉ từ dữ liệu đã log)
  possibleInterpretations: string[]; // 2. Diễn giải khả dĩ (khoảng cách kế hoạch vs thực tế)
  unknownsAndBlindspots: string[];   // 3. Điều chưa biết / Điểm mù
  suggestedActions: string[];        // 4. Bước tiếp theo đề xuất (cần xác nhận của user)
  summary: string;
}

export interface LifeOSData {
  version: string;
  lastUpdated: string;
  principles: Principle[];
  identityAnchors: IdentityAnchor[];
  northStar: NorthStar;
  dimensions: LifeDimension[];
  themes: StrategicTheme[];
  goals: Goal[];
  projects: Project[];
  kpis: KPI[];
  habits: Habit[];
  dailyActions: DailyAction[];
  weeklyPriorities: WeeklyPriority[];
  weeklyReviews: WeeklyReview[];
  decisionLogs: DecisionLog[];
}
