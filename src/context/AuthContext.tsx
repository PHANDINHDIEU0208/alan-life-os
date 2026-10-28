/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Firebase Authentication Context & Provider
 */

import React, { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, signInWithGoogle, signOutUser, testConnection } from '../services/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isSigningIn: boolean;
  error: string | null;
  clearError: () => void;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  isOnline: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  // Synchronous lock to prevent concurrent popup requests and assertion crashes
  const isSigningInRef = useRef(false);

  useEffect(() => {
    // Test initial connection to Firestore
    testConnection().then(status => setIsOnline(status));

    // Listen to Firebase Auth state
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Auth state change error:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const clearError = () => setError(null);

  const handleSignIn = async () => {
    // Prevent overlapping popup requests which cause internal assertion failures
    if (isSigningInRef.current) {
      return;
    }

    isSigningInRef.current = true;
    setIsSigningIn(true);
    setError(null);

    try {
      await signInWithGoogle();
    } catch (err: any) {
      const code = err?.code || '';
      const message = err?.message || '';

      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        // User voluntarily closed the popup or clicked outside — ignore gracefully
      } else if (code === 'auth/popup-blocked') {
        setError('Trình duyệt đã chặn cửa sổ pop-up đăng nhập. Vui lòng nhấp vào biểu tượng Pop-up trên thanh địa chỉ của trình duyệt, chọn "Luôn cho phép" và thử lại.');
      } else if (message.includes('INTERNAL ASSERTION FAILED')) {
        // Transient assertion from cancelled popup; reset quietly
      } else if (code === 'auth/network-request-failed') {
        setError('Không thể kết nối đến máy chủ Google. Vui lòng kiểm tra kết nối mạng.');
      } else {
        setError(message || 'Đăng nhập Google không thành công. Vui lòng thử lại.');
      }
    } finally {
      isSigningInRef.current = false;
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (err: any) {
      setError(err.message || 'Đăng xuất không thành công');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isSigningIn,
        error,
        clearError,
        signIn: handleSignIn,
        signOut: handleSignOut,
        isOnline
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
