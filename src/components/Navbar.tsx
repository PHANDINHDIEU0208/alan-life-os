/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Top Bar Navigation for Alan's Life OS
 * Fulfills Top Bar Contract:
 * Zone 1: Wordmark "Alan's Life OS"
 * Zone 2: 6 concise single-line nav links
 * Zone 3: Firebase Auth / Cloud Sync Status + Primary Action + Utilities
 */

import React, { useState } from 'react';
import { useLifeOS, ActiveNavTab } from '../context/LifeOSContext';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Sun, 
  Moon, 
  Database, 
  Menu, 
  X, 
  BookOpen, 
  Cloud, 
  CloudOff, 
  Loader2, 
  LogIn, 
  LogOut, 
  User as UserIcon,
  CheckCircle2
} from 'lucide-react';

interface NavbarProps {
  onOpenCopilot: () => void;
  onOpenDataModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCopilot, onOpenDataModal }) => {
  const { activeTab, setActiveTab, theme, toggleTheme, firestoreSyncStatus } = useLifeOS();
  const { user, loading: authLoading, isSigningIn, signIn, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: ActiveNavTab; label: string }[] = [
    { id: 'command', label: 'Command Center' },
    { id: 'strategy', label: 'Strategy & Identity' },
    { id: 'goals', label: 'Goals & Projects' },
    { id: 'execution', label: 'Daily Execution' },
    { id: 'review', label: 'Weekly Review' },
    { id: 'decision', label: 'Decision Log' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95 transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('command')}
            className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white shadow-xs dark:bg-teal-700">
              AL
            </span>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap leading-none">
                Alan's Life OS
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono tracking-tight mt-0.5">
                Performance & Analytics
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 6 concise single-line text navigation links */}
        <nav className="hidden xl:flex items-center gap-4 text-xs font-semibold">
          {navLinks.map(link => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`whitespace-nowrap transition-colors py-1 relative ${
                  isActive
                    ? 'text-teal-700 dark:text-teal-400 font-bold'
                    : 'text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 dark:bg-teal-400 rounded-full" />
                )}
              </button>
            );
          })}

          {/* Context & Blueprint guide */}
          <button
            onClick={() => setActiveTab('blueprint')}
            className={`whitespace-nowrap transition-colors py-1 flex items-center gap-1 text-xs ${
              activeTab === 'blueprint'
                ? 'text-teal-700 dark:text-teal-400 font-bold'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
            title="Lộ trình 30 ngày & Bối cảnh"
          >
            <BookOpen className="h-3 w-3" />
            <span>Lộ trình</span>
          </button>
        </nav>

        {/* Zone 3: Firebase Auth / Cloud Sync Status + Primary Action + Utilities */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          
          {/* Cloud Firestore Status Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
            {firestoreSyncStatus === 'synced' && (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                <span className="text-teal-700 dark:text-teal-400 font-semibold">Firestore Cloud</span>
              </>
            )}
            {firestoreSyncStatus === 'syncing' && (
              <>
                <Loader2 className="h-3 w-3 text-teal-600 animate-spin" />
                <span className="text-slate-600 dark:text-slate-400">Đang đồng bộ...</span>
              </>
            )}
            {firestoreSyncStatus === 'unauthenticated' && (
              <>
                <CloudOff className="h-3 w-3 text-slate-400" />
                <span className="text-slate-500">Local Sandbox</span>
              </>
            )}
            {firestoreSyncStatus === 'error' && (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span className="text-rose-600 font-semibold">Lỗi đồng bộ</span>
              </>
            )}
          </div>

          {/* Firebase Authentication Button / Profile */}
          {authLoading ? (
            <div className="p-1.5 text-slate-400">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : user ? (
            <div className="flex items-center gap-1.5 p-1 pl-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || 'User'} 
                  referrerPolicy="no-referrer"
                  className="h-5 w-5 rounded-full object-cover" 
                />
              ) : (
                <div className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center text-[10px] font-bold text-teal-800 dark:text-teal-200">
                  {user.displayName?.[0] || 'A'}
                </div>
              )}
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[90px] truncate hidden sm:inline">
                {user.displayName?.split(' ')[0] || user.email?.split('@')[0]}
              </span>
              <button
                onClick={signOut}
                title="Đăng xuất Firebase"
                className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                aria-label="Đăng xuất"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={signIn}
              disabled={isSigningIn}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              title="Đăng nhập Google để lưu dữ liệu vào Cloud Firestore cá nhân"
            >
              {isSigningIn ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-teal-600" />
                  <span className="hidden sm:inline">Đang mở...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Đăng nhập</span>
                </>
              )}
            </button>
          )}

          {/* Primary Action: Gemini AI */}
          <button
            onClick={onOpenCopilot}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-700 rounded-lg shadow-xs transition-all whitespace-nowrap shrink-0 focus-visible:ring-2 focus-visible:ring-teal-500"
            title="Mở trợ lý Gemini Copilot cho Life OS"
          >
            <Sparkles className="h-3.5 w-3.5 text-teal-200" />
            <span className="hidden sm:inline">Gemini AI</span>
          </button>

          <button
            onClick={onOpenDataModal}
            className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Quản lý sao lưu dữ liệu & JSON"
            aria-label="Sao lưu dữ liệu"
          >
            <Database className="h-4 w-4" />
          </button>

          <button
            onClick={toggleTheme}
            className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={theme === 'dark' ? 'Chuyển sang nền sáng' : 'Chuyển sang nền tối'}
            aria-label="Đổi giao diện"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-1.5 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            aria-label="Mở menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex flex-col gap-1.5">
            {navLinks.map(link => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setActiveTab(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-3 py-2 text-xs rounded-lg transition-colors font-medium ${
                    isActive
                      ? 'bg-teal-50 text-teal-900 font-bold dark:bg-teal-950/50 dark:text-teal-300'
                      : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
            <button
              onClick={() => {
                setActiveTab('blueprint');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg"
            >
              Lộ trình 30 ngày & Bối cảnh
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
