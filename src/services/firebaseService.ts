/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Firebase Service Layer for Alan's Life OS
 * Provides clean architectural abstraction for Cloud Firestore,
 * Firebase Authentication, and Security Rules.
 */

import { LifeOSData, Goal, KPI, Project, WeeklyReview, DecisionLog } from '../types/lifeos';

export interface FirebaseUserSession {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface SyncStatus {
  state: 'synced' | 'syncing' | 'offline' | 'error';
  lastSyncedAt: string | null;
  errorMessage?: string;
}

/**
 * Proposed Firestore Security Rules for Alan's Life OS
 * Enforces strict user isolation: users can only read and write their own data.
 */
export const FIRESTORE_SECURITY_RULES_BLUEPRINT = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check authentication
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to ensure user only touches their own document tree
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // Root user document & profile
    match /users/{userId} {
      allow read, write: if isOwner(userId);

      // Life Command Center & Strategy subcollections
      match /strategy/{document=**} {
        allow read, write: if isOwner(userId);
      }

      // Goals & Projects subcollections
      match /goals/{goalId} {
        allow read, write: if isOwner(userId);
      }

      match /projects/{projectId} {
        allow read, write: if isOwner(userId);
      }

      // KPI Engine & Measurements
      match /kpis/{kpiId} {
        allow read, write: if isOwner(userId);
        
        match /measurements/{measurementId} {
          allow read, write: if isOwner(userId);
        }
      }

      // Daily Execution & Habits
      match /daily_actions/{actionId} {
        allow read, write: if isOwner(userId);
      }

      match /habits/{habitId} {
        allow read, write: if isOwner(userId);
      }

      // Weekly Reviews & Reflection
      match /weekly_reviews/{reviewId} {
        allow read, write: if isOwner(userId);
      }

      // Decision Log
      match /decision_logs/{decisionId} {
        allow read, write: if isOwner(userId);
      }
    }
  }
}`;

/**
 * Data Access Object (DAO) Interface for Firebase Operations
 * Ensures complete decoupling of UI from Firebase implementation details.
 */
export interface LifeOSRepository {
  getUserSession(): Promise<FirebaseUserSession | null>;
  loadUserData(userId: string): Promise<LifeOSData | null>;
  saveUserData(userId: string, data: Partial<LifeOSData>): Promise<void>;
  
  // Scoped subcollection methods
  syncGoal(userId: string, goal: Goal): Promise<void>;
  syncKPI(userId: string, kpi: KPI): Promise<void>;
  syncProject(userId: string, project: Project): Promise<void>;
  syncWeeklyReview(userId: string, review: WeeklyReview): Promise<void>;
  syncDecisionLog(userId: string, decision: DecisionLog): Promise<void>;
}

/**
 * Local Repository implementation (Current step: Local persistence ready for Firestore sync)
 */
class LocalLifeOSRepository implements LifeOSRepository {
  private storageKey = 'alans_life_os_v1';

  async getUserSession(): Promise<FirebaseUserSession | null> {
    return {
      uid: 'alan_local_owner',
      email: 'alan@lifeos.internal',
      displayName: 'Alan (Business Performance & Analytics)',
      photoURL: null
    };
  }

  async loadUserData(_userId: string): Promise<LifeOSData | null> {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn("Could not load from localStorage:", e);
    }
    return null;
  }

  async saveUserData(_userId: string, data: Partial<LifeOSData>): Promise<void> {
    try {
      const existing = await this.loadUserData(_userId) || {};
      const updated = { ...existing, ...data, lastUpdated: new Date().toISOString() };
      localStorage.setItem(this.storageKey, JSON.stringify(updated));
    } catch (e) {
      console.error("Could not save to localStorage:", e);
    }
  }

  async syncGoal(userId: string, goal: Goal): Promise<void> {
    console.debug(`[Repository] Syncing Goal ${goal.id} for user ${userId}`);
  }

  async syncKPI(userId: string, kpi: KPI): Promise<void> {
    console.debug(`[Repository] Syncing KPI ${kpi.id} for user ${userId}`);
  }

  async syncProject(userId: string, project: Project): Promise<void> {
    console.debug(`[Repository] Syncing Project ${project.id} for user ${userId}`);
  }

  async syncWeeklyReview(userId: string, review: WeeklyReview): Promise<void> {
    console.debug(`[Repository] Syncing Weekly Review ${review.id} for user ${userId}`);
  }

  async syncDecisionLog(userId: string, decision: DecisionLog): Promise<void> {
    console.debug(`[Repository] Syncing Decision Log ${decision.id} for user ${userId}`);
  }
}

export const lifeOSRepository: LifeOSRepository = new LocalLifeOSRepository();
