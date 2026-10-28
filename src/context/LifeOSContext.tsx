/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Life OS Context & State Management
 * Handles local persistence, CRUD operations, export/import, and blueprint checklist state.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  LifeOSData,
  NorthStar,
  Principle,
  IdentityAnchor,
  LifeDimension,
  DimensionKey,
  Goal,
  Project,
  KPI,
  Habit,
  DailyAction,
  WeeklyPriority,
  WeeklyReview,
  DecisionLog
} from '../types/lifeos';
import { INITIAL_LIFE_OS_DATA } from '../data/seedData';
import { useAuth } from './AuthContext';
import { 
  createFirestoreGoal, 
  updateFirestoreGoal, 
  deleteFirestoreGoal, 
  subscribeFirestoreGoals 
} from '../services/goalsService';

const STORAGE_KEY = 'life_os_data_v1';
const BLUEPRINT_CHECKLIST_KEY = 'life_os_blueprint_checklist';
const THEME_KEY = 'life_os_theme';

export type ActiveNavTab = 
  | 'command' 
  | 'strategy' 
  | 'goals' 
  | 'execution' 
  | 'review' 
  | 'decision' 
  | 'blueprint';

interface LifeOSContextType {
  data: LifeOSData;
  activeTab: ActiveNavTab;
  setActiveTab: (tab: ActiveNavTab) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  // Strategy & Identity
  updateNorthStar: (northStar: NorthStar) => void;
  addPrinciple: (principle: Omit<Principle, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePrinciple: (id: string, updates: Partial<Principle>) => void;
  deletePrinciple: (id: string) => void;
  addIdentityAnchor: (anchor: Omit<IdentityAnchor, 'id' | 'createdAt'>) => void;
  deleteIdentityAnchor: (id: string) => void;
  updateDimension: (id: DimensionKey, updates: Partial<LifeDimension>) => void;

  // Goals & Projects
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  toggleProjectTask: (projectId: string, taskId: string) => void;

  // KPI Engine
  addKPI: (kpi: Omit<KPI, 'id' | 'createdAt' | 'updatedAt' | 'history'>) => void;
  updateKPI: (id: string, updates: Partial<KPI>) => void;
  deleteKPI: (id: string) => void;
  logKPIMeasurement: (kpiId: string, value: number, note?: string) => void;

  // Habits & Actions
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'history' | 'streakDays'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleHabitDay: (habitId: string, dateStr: string) => void;

  addDailyAction: (action: Omit<DailyAction, 'id' | 'createdAt'>) => void;
  updateDailyAction: (id: string, updates: Partial<DailyAction>) => void;
  deleteDailyAction: (id: string) => void;
  toggleDailyAction: (id: string) => void;

  // Weekly Priorities
  addWeeklyPriority: (text: string, goalId?: string) => void;
  toggleWeeklyPriority: (id: string) => void;
  deleteWeeklyPriority: (id: string) => void;

  // Reviews & Decision Log
  addWeeklyReview: (review: Omit<WeeklyReview, 'id' | 'createdAt'>) => void;
  updateWeeklyReview: (id: string, updates: Partial<WeeklyReview>) => void;
  deleteWeeklyReview: (id: string) => void;

  addDecisionLog: (decision: Omit<DecisionLog, 'id' | 'createdAt'>) => void;
  updateDecisionLog: (id: string, updates: Partial<DecisionLog>) => void;
  deleteDecisionLog: (id: string) => void;

  // Persistence & Blueprint
  exportDataToJson: () => string;
  importDataFromJson: (jsonStr: string) => { success: boolean; error?: string };
  resetToDefaultData: () => void;
  blueprintChecklist: Record<string, boolean>;
  toggleBlueprintItem: (itemId: string) => void;

  // Firebase Firestore Sync Status (Vertical Slice)
  firestoreSyncStatus: 'synced' | 'syncing' | 'offline' | 'unauthenticated' | 'error';
  syncError: string | null;
}

const LifeOSContext = createContext<LifeOSContextType | undefined>(undefined);

export const LifeOSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isOnline } = useAuth();
  const [firestoreSyncStatus, setFirestoreSyncStatus] = useState<'synced' | 'syncing' | 'offline' | 'unauthenticated' | 'error'>('unauthenticated');
  const [syncError, setSyncError] = useState<string | null>(null);

  const [data, setData] = useState<LifeOSData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Failed to parse stored Life OS data, reverting to defaults:", e);
    }
    return INITIAL_LIFE_OS_DATA;
  });

  // Subscribe to user's Firestore Goals when authenticated (Vertical Slice)
  useEffect(() => {
    if (!user) {
      setFirestoreSyncStatus('unauthenticated');
      return;
    }

    if (!isOnline) {
      setFirestoreSyncStatus('offline');
      return;
    }

    setFirestoreSyncStatus('syncing');
    setSyncError(null);

    const unsubscribe = subscribeFirestoreGoals(
      user.uid,
      (remoteGoals) => {
        if (remoteGoals.length > 0) {
          setData(prev => ({
            ...prev,
            goals: remoteGoals,
            lastUpdated: new Date().toISOString()
          }));
        }
        setFirestoreSyncStatus('synced');
      },
      (err) => {
        console.error("Firestore sync error:", err);
        setFirestoreSyncStatus('error');
        setSyncError(err?.message || 'Lỗi đồng bộ dữ liệu Firestore');
      }
    );

    return () => unsubscribe();
  }, [user, isOnline]);

  const [activeTab, setActiveTab] = useState<ActiveNavTab>('command');
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_KEY);
      if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
    } catch {
      // fallback
    }
    return 'light';
  });

  const [blueprintChecklist, setBlueprintChecklist] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(BLUEPRINT_CHECKLIST_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Failed to load blueprint checklist", e);
    }
    return {
      "s0_0": true,
      "s0_1": true,
      "s0_2": true,
      "s0_3": true,
      "s0_4": true,
      "c0_0": true,
      "c0_1": true,
      "s1_0": true,
      "s1_1": true,
      "s1_2": true,
      "s1_3": true,
      "s1_4": true,
      "c1_0": true,
      "c1_1": true,
      "c1_2": true
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save Life OS data to localStorage:", e);
    }
  }, [data]);

  useEffect(() => {
    try {
      localStorage.setItem(BLUEPRINT_CHECKLIST_KEY, JSON.stringify(blueprintChecklist));
    } catch (e) {
      console.error("Failed to save blueprint checklist:", e);
    }
  }, [blueprintChecklist]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleBlueprintItem = (itemId: string) => {
    setBlueprintChecklist(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Strategy & Identity
  const updateNorthStar = (northStar: NorthStar) => {
    setData(prev => ({
      ...prev,
      northStar: { ...northStar, lastUpdated: new Date().toISOString() },
      lastUpdated: new Date().toISOString()
    }));
  };

  const addPrinciple = (principle: Omit<Principle, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newPrinciple: Principle = {
      ...principle,
      id: 'p_' + Date.now(),
      createdAt: now,
      updatedAt: now
    };
    setData(prev => ({
      ...prev,
      principles: [...prev.principles, newPrinciple],
      lastUpdated: now
    }));
  };

  const updatePrinciple = (id: string, updates: Partial<Principle>) => {
    const now = new Date().toISOString();
    setData(prev => ({
      ...prev,
      principles: prev.principles.map(p => p.id === id ? { ...p, ...updates, updatedAt: now } : p),
      lastUpdated: now
    }));
  };

  const deletePrinciple = (id: string) => {
    setData(prev => ({
      ...prev,
      principles: prev.principles.filter(p => p.id !== id),
      lastUpdated: new Date().toISOString()
    }));
  };

  const addIdentityAnchor = (anchor: Omit<IdentityAnchor, 'id' | 'createdAt'>) => {
    const newAnchor: IdentityAnchor = {
      ...anchor,
      id: 'ia_' + Date.now(),
      createdAt: new Date().toISOString()
    };
    setData(prev => ({
      ...prev,
      identityAnchors: [...prev.identityAnchors, newAnchor],
      lastUpdated: new Date().toISOString()
    }));
  };

  const deleteIdentityAnchor = (id: string) => {
    setData(prev => ({
      ...prev,
      identityAnchors: prev.identityAnchors.filter(a => a.id !== id),
      lastUpdated: new Date().toISOString()
    }));
  };

  const updateDimension = (id: DimensionKey, updates: Partial<LifeDimension>) => {
    setData(prev => ({
      ...prev,
      dimensions: prev.dimensions.map(d => d.id === id ? { ...d, ...updates } : d),
      lastUpdated: new Date().toISOString()
    }));
  };

  // Goals (Vertical Slice with Cloud Firestore)
  const addGoal = (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newGoal: Goal = {
      ...goal,
      id: 'g_' + Date.now(),
      createdAt: now,
      updatedAt: now
    };
    
    // Optimistic local state update
    setData(prev => ({
      ...prev,
      goals: [...prev.goals, newGoal],
      lastUpdated: now
    }));

    // If authenticated, persist directly to user's private collection in Cloud Firestore
    if (user) {
      setFirestoreSyncStatus('syncing');
      createFirestoreGoal(user.uid, {
        title: goal.title,
        description: goal.description,
        dimensionId: goal.dimensionId,
        targetDate: goal.targetDate,
        status: goal.status,
        progressPercent: goal.progressPercent,
        strategicThemeId: goal.strategicThemeId
      })
        .then(() => setFirestoreSyncStatus('synced'))
        .catch(err => {
          console.error("Failed to save goal to Firestore:", err);
          setFirestoreSyncStatus('error');
          setSyncError(err?.message || 'Không thể lưu mục tiêu lên Firestore');
        });
    }
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    const now = new Date().toISOString();
    setData(prev => ({
      ...prev,
      goals: prev.goals.map(g => g.id === id ? { ...g, ...updates, updatedAt: now } : g),
      lastUpdated: now
    }));

    if (user) {
      updateFirestoreGoal(user.uid, id, updates)
        .catch(err => console.error("Firestore update failed:", err));
    }
  };

  const deleteGoal = (id: string) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.filter(g => g.id !== id),
      lastUpdated: new Date().toISOString()
    }));

    if (user) {
      deleteFirestoreGoal(user.uid, id)
        .catch(err => console.error("Firestore delete failed:", err));
    }
  };

  // Projects
  const addProject = (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newProject: Project = {
      ...project,
      id: 'prj_' + Date.now(),
      createdAt: now,
      updatedAt: now
    };
    setData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject],
      lastUpdated: now
    }));
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    const now = new Date().toISOString();
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, ...updates, updatedAt: now } : p),
      lastUpdated: now
    }));
  };

  const deleteProject = (id: string) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id),
      lastUpdated: new Date().toISOString()
    }));
  };

  const toggleProjectTask = (projectId: string, taskId: string) => {
    const now = new Date().toISOString();
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p => {
        if (p.id !== projectId) return p;
        const newTasks = p.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
        return { ...p, tasks: newTasks, updatedAt: now };
      }),
      lastUpdated: now
    }));
  };

  // KPI Engine
  const addKPI = (kpi: Omit<KPI, 'id' | 'createdAt' | 'updatedAt' | 'history'>) => {
    const now = new Date().toISOString();
    const newKPI: KPI = {
      ...kpi,
      id: 'kpi_' + Date.now(),
      history: [],
      createdAt: now,
      updatedAt: now
    };
    setData(prev => ({
      ...prev,
      kpis: [...prev.kpis, newKPI],
      lastUpdated: now
    }));
  };

  const updateKPI = (id: string, updates: Partial<KPI>) => {
    const now = new Date().toISOString();
    setData(prev => ({
      ...prev,
      kpis: prev.kpis.map(k => k.id === id ? { ...k, ...updates, updatedAt: now } : k),
      lastUpdated: now
    }));
  };

  const deleteKPI = (id: string) => {
    setData(prev => ({
      ...prev,
      kpis: prev.kpis.filter(k => k.id !== id),
      lastUpdated: new Date().toISOString()
    }));
  };

  const logKPIMeasurement = (kpiId: string, value: number, note?: string) => {
    const now = new Date().toISOString();
    const dateStr = now.split('T')[0];
    setData(prev => ({
      ...prev,
      kpis: prev.kpis.map(k => {
        if (k.id !== kpiId) return k;
        const newMeasurement = {
          id: 'm_' + Date.now(),
          date: dateStr,
          value,
          note
        };
        return {
          ...k,
          currentValue: value,
          hasMeasurement: true,
          history: [...k.history, newMeasurement],
          updatedAt: now
        };
      }),
      lastUpdated: now
    }));
  };

  // Habits
  const addHabit = (habit: Omit<Habit, 'id' | 'createdAt' | 'history' | 'streakDays'>) => {
    const newHabit: Habit = {
      ...habit,
      id: 'h_' + Date.now(),
      streakDays: 0,
      history: {},
      createdAt: new Date().toISOString()
    };
    setData(prev => ({
      ...prev,
      habits: [...prev.habits, newHabit],
      lastUpdated: new Date().toISOString()
    }));
  };

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    setData(prev => ({
      ...prev,
      habits: prev.habits.map(h => h.id === id ? { ...h, ...updates } : h),
      lastUpdated: new Date().toISOString()
    }));
  };

  const deleteHabit = (id: string) => {
    setData(prev => ({
      ...prev,
      habits: prev.habits.filter(h => h.id !== id),
      lastUpdated: new Date().toISOString()
    }));
  };

  const toggleHabitDay = (habitId: string, dateStr: string) => {
    setData(prev => ({
      ...prev,
      habits: prev.habits.map(h => {
        if (h.id !== habitId) return h;
        const isCurrentlyDone = !!h.history[dateStr];
        const newHistory = { ...h.history, [dateStr]: !isCurrentlyDone };
        
        // Recalculate streak
        let streak = 0;
        const checkDate = new Date();
        for (let i = 0; i < 60; i++) {
          const ds = checkDate.toISOString().split('T')[0];
          if (newHistory[ds]) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            // allow today to be checked or unchecked without breaking yesterday's streak
            if (i === 0) {
              checkDate.setDate(checkDate.getDate() - 1);
              continue;
            }
            break;
          }
        }

        return {
          ...h,
          history: newHistory,
          streakDays: streak
        };
      }),
      lastUpdated: new Date().toISOString()
    }));
  };

  // Daily Actions
  const addDailyAction = (action: Omit<DailyAction, 'id' | 'createdAt'>) => {
    const newAction: DailyAction = {
      ...action,
      id: 'da_' + Date.now(),
      createdAt: new Date().toISOString()
    };
    setData(prev => ({
      ...prev,
      dailyActions: [...prev.dailyActions, newAction],
      lastUpdated: new Date().toISOString()
    }));
  };

  const updateDailyAction = (id: string, updates: Partial<DailyAction>) => {
    setData(prev => ({
      ...prev,
      dailyActions: prev.dailyActions.map(a => a.id === id ? { ...a, ...updates } : a),
      lastUpdated: new Date().toISOString()
    }));
  };

  const deleteDailyAction = (id: string) => {
    setData(prev => ({
      ...prev,
      dailyActions: prev.dailyActions.filter(a => a.id !== id),
      lastUpdated: new Date().toISOString()
    }));
  };

  const toggleDailyAction = (id: string) => {
    setData(prev => ({
      ...prev,
      dailyActions: prev.dailyActions.map(a => a.id === id ? { ...a, completed: !a.completed } : a),
      lastUpdated: new Date().toISOString()
    }));
  };

  // Weekly Priorities
  const addWeeklyPriority = (text: string, goalId?: string) => {
    const currentWeek = 43; // Standard week number
    const newPriority: WeeklyPriority = {
      id: 'wp_' + Date.now(),
      weekNumber: currentWeek,
      year: 2026,
      text,
      completed: false,
      linkedGoalId: goalId
    };
    setData(prev => ({
      ...prev,
      weeklyPriorities: [...prev.weeklyPriorities, newPriority],
      lastUpdated: new Date().toISOString()
    }));
  };

  const toggleWeeklyPriority = (id: string) => {
    setData(prev => ({
      ...prev,
      weeklyPriorities: prev.weeklyPriorities.map(wp => wp.id === id ? { ...wp, completed: !wp.completed } : wp),
      lastUpdated: new Date().toISOString()
    }));
  };

  const deleteWeeklyPriority = (id: string) => {
    setData(prev => ({
      ...prev,
      weeklyPriorities: prev.weeklyPriorities.filter(wp => wp.id !== id),
      lastUpdated: new Date().toISOString()
    }));
  };

  // Reviews
  const addWeeklyReview = (review: Omit<WeeklyReview, 'id' | 'createdAt'>) => {
    const now = new Date().toISOString();
    const newReview: WeeklyReview = {
      ...review,
      id: 'wr_' + Date.now(),
      createdAt: now
    };
    setData(prev => ({
      ...prev,
      weeklyReviews: [newReview, ...prev.weeklyReviews],
      lastUpdated: now
    }));
  };

  const updateWeeklyReview = (id: string, updates: Partial<WeeklyReview>) => {
    setData(prev => ({
      ...prev,
      weeklyReviews: prev.weeklyReviews.map(r => r.id === id ? { ...r, ...updates } : r),
      lastUpdated: new Date().toISOString()
    }));
  };

  const deleteWeeklyReview = (id: string) => {
    setData(prev => ({
      ...prev,
      weeklyReviews: prev.weeklyReviews.filter(r => r.id !== id),
      lastUpdated: new Date().toISOString()
    }));
  };

  // Decision Logs
  const addDecisionLog = (decision: Omit<DecisionLog, 'id' | 'createdAt'>) => {
    const now = new Date().toISOString();
    const newDecision: DecisionLog = {
      ...decision,
      id: 'dec_' + Date.now(),
      createdAt: now
    };
    setData(prev => ({
      ...prev,
      decisionLogs: [newDecision, ...prev.decisionLogs],
      lastUpdated: now
    }));
  };

  const updateDecisionLog = (id: string, updates: Partial<DecisionLog>) => {
    setData(prev => ({
      ...prev,
      decisionLogs: prev.decisionLogs.map(d => d.id === id ? { ...d, ...updates } : d),
      lastUpdated: new Date().toISOString()
    }));
  };

  const deleteDecisionLog = (id: string) => {
    setData(prev => ({
      ...prev,
      decisionLogs: prev.decisionLogs.filter(d => d.id !== id),
      lastUpdated: new Date().toISOString()
    }));
  };

  // Export / Import
  const exportDataToJson = (): string => {
    return JSON.stringify(data, null, 2);
  };

  const importDataFromJson = (jsonStr: string): { success: boolean; error?: string } => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!parsed.northStar || !Array.isArray(parsed.principles) || !Array.isArray(parsed.goals)) {
        return { success: false, error: 'Dữ liệu không đúng cấu trúc Life OS v1.0.' };
      }
      setData({
        ...parsed,
        lastUpdated: new Date().toISOString()
      });
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Lỗi đọc cú pháp JSON.' };
    }
  };

  const resetToDefaultData = () => {
    setData(INITIAL_LIFE_OS_DATA);
  };

  return (
    <LifeOSContext.Provider
      value={{
        data,
        activeTab,
        setActiveTab,
        theme,
        toggleTheme,
        updateNorthStar,
        addPrinciple,
        updatePrinciple,
        deletePrinciple,
        addIdentityAnchor,
        deleteIdentityAnchor,
        updateDimension,
        addGoal,
        updateGoal,
        deleteGoal,
        addProject,
        updateProject,
        deleteProject,
        toggleProjectTask,
        addKPI,
        updateKPI,
        deleteKPI,
        logKPIMeasurement,
        addHabit,
        updateHabit,
        deleteHabit,
        toggleHabitDay,
        addDailyAction,
        updateDailyAction,
        deleteDailyAction,
        toggleDailyAction,
        addWeeklyPriority,
        toggleWeeklyPriority,
        deleteWeeklyPriority,
        addWeeklyReview,
        updateWeeklyReview,
        deleteWeeklyReview,
        addDecisionLog,
        updateDecisionLog,
        deleteDecisionLog,
        exportDataToJson,
        importDataFromJson,
        resetToDefaultData,
        blueprintChecklist,
        toggleBlueprintItem,
        firestoreSyncStatus,
        syncError
      }}
    >
      {children}
    </LifeOSContext.Provider>
  );
};

export const useLifeOS = () => {
  const context = useContext(LifeOSContext);
  if (!context) {
    throw new Error('useLifeOS must be used within a LifeOSProvider');
  }
  return context;
};
