/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Goal Data Access Service (Vertical Slice)
 * Interacts with /users/{userId}/goals/{goalId}
 * Wraps all mutations and queries with strict error handling.
 */

import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Goal } from '../types/lifeos';

export interface CreateGoalDTO {
  title: string;
  description: string;
  dimensionId: string;
  targetDate: string;
  status: 'not_started' | 'active' | 'completed' | 'paused';
  progressPercent: number;
  strategicThemeId?: string;
}

/**
 * Creates a Goal in Firestore under /users/{userId}/goals/{goalId}
 */
export async function createFirestoreGoal(userId: string, data: CreateGoalDTO): Promise<Goal> {
  const goalId = 'g_' + Date.now();
  const path = `users/${userId}/goals/${goalId}`;

  const now = new Date().toISOString();
  const newGoal: Goal = {
    id: goalId,
    title: data.title,
    description: data.description,
    dimensionId: data.dimensionId as any,
    targetDate: data.targetDate,
    status: data.status,
    progressPercent: data.progressPercent,
    strategicThemeId: data.strategicThemeId,
    createdAt: now,
    updatedAt: now
  };

  try {
    const goalDocRef = doc(db, 'users', userId, 'goals', goalId);
    await setDoc(goalDocRef, {
      ...newGoal,
      userId: userId, // Enforces security rules identity check
      serverCreatedAt: serverTimestamp(),
      serverUpdatedAt: serverTimestamp()
    });
    return newGoal;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

/**
 * Real-time subscription to user's private goals
 */
export function subscribeFirestoreGoals(
  userId: string, 
  onSuccess: (goals: Goal[]) => void,
  onError: (err: any) => void
): () => void {
  const colPath = `users/${userId}/goals`;
  const goalsCol = collection(db, 'users', userId, 'goals');
  
  return onSnapshot(
    goalsCol,
    (snapshot) => {
      const goals: Goal[] = [];
      snapshot.forEach((docSnap) => {
        const d = docSnap.data();
        goals.push({
          id: d.id || docSnap.id,
          title: d.title,
          description: d.description || '',
          dimensionId: d.dimensionId,
          targetDate: d.targetDate || '',
          status: d.status || 'active',
          progressPercent: typeof d.progressPercent === 'number' ? d.progressPercent : 0,
          strategicThemeId: d.strategicThemeId,
          createdAt: d.createdAt || new Date().toISOString(),
          updatedAt: d.updatedAt || new Date().toISOString()
        });
      });
      onSuccess(goals);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, colPath);
      onError(error);
    }
  );
}

/**
 * Reads user goals once
 */
export async function getFirestoreGoals(userId: string): Promise<Goal[]> {
  const colPath = `users/${userId}/goals`;
  try {
    const goalsCol = collection(db, 'users', userId, 'goals');
    const snapshot = await getDocs(goalsCol);
    const goals: Goal[] = [];
    snapshot.forEach((docSnap) => {
      const d = docSnap.data();
      goals.push({
        id: d.id || docSnap.id,
        title: d.title,
        description: d.description || '',
        dimensionId: d.dimensionId,
        targetDate: d.targetDate || '',
        status: d.status || 'active',
        progressPercent: typeof d.progressPercent === 'number' ? d.progressPercent : 0,
        strategicThemeId: d.strategicThemeId,
        createdAt: d.createdAt || new Date().toISOString(),
        updatedAt: d.updatedAt || new Date().toISOString()
      });
    });
    return goals;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, colPath);
  }
}

/**
 * Updates a Goal in Firestore
 */
export async function updateFirestoreGoal(userId: string, goalId: string, updates: Partial<Goal>): Promise<void> {
  const path = `users/${userId}/goals/${goalId}`;
  try {
    const docRef = doc(db, 'users', userId, 'goals', goalId);
    await updateDoc(docRef, {
      ...updates,
      serverUpdatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Deletes a Goal in Firestore
 */
export async function deleteFirestoreGoal(userId: string, goalId: string): Promise<void> {
  const path = `users/${userId}/goals/${goalId}`;
  try {
    const docRef = doc(db, 'users', userId, 'goals', goalId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
