/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Life OS Application Main Entry
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LifeOSProvider, useLifeOS } from './context/LifeOSContext';
import { Navbar } from './components/Navbar';
import { CommandCenter } from './components/CommandCenter';
import { StrategyIdentity } from './components/StrategyIdentity';
import { ExecutionEngine } from './components/ExecutionEngine';
import { ReflectionDecisionLab } from './components/ReflectionDecisionLab';
import { BlueprintView } from './components/BlueprintView';
import { CopilotModal } from './components/CopilotModal';
import { DataModal } from './components/DataModal';

const AppContent: React.FC = () => {
  const { activeTab } = useLifeOS();
  const { error: authError, clearError } = useAuth();
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors">
      {/* Top Navigation conforming to Top Bar Contract */}
      <Navbar 
        onOpenCopilot={() => setIsCopilotOpen(true)}
        onOpenDataModal={() => setIsDataModalOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Global Auth Error Alert */}
        {authError && (
          <div className="mb-6 p-4 rounded-xl border border-rose-300 bg-rose-50 text-rose-900 dark:border-rose-900 dark:bg-rose-950/60 dark:text-rose-200 text-xs flex items-start justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-2.5">
              <span className="text-base">⚠️</span>
              <div>
                <p className="font-bold text-sm">Cửa sổ đăng nhập Google bị chặn hoặc gặp gián đoạn</p>
                <p className="mt-1 text-rose-800 dark:text-rose-300">{authError}</p>
                <p className="mt-1.5 text-[11px] text-rose-700/80 dark:text-rose-400">
                  Mẹo: Kiểm tra biểu tượng Pop-up bị chặn ở góc phải thanh địa chỉ trình duyệt, chọn &quot;Luôn cho phép cửa sổ bật lên&quot; và nhấp Đăng nhập lại.
                </p>
              </div>
            </div>
            <button 
              onClick={clearError}
              className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 text-xs font-mono p-1 rounded hover:bg-rose-100 dark:hover:bg-rose-900 shrink-0"
              title="Đóng thông báo"
            >
              ✕
            </button>
          </div>
        )}

        {activeTab === 'command' && <CommandCenter />}
        {activeTab === 'strategy' && <StrategyIdentity />}
        {activeTab === 'goals' && <ExecutionEngine initialTab="goals" />}
        {activeTab === 'execution' && <ExecutionEngine initialTab="habits_actions" />}
        {activeTab === 'review' && <ReflectionDecisionLab initialTab="weekly_review" />}
        {activeTab === 'decision' && <ReflectionDecisionLab initialTab="decision_log" />}
        {activeTab === 'blueprint' && <BlueprintView />}
      </main>

      {/* Modals */}
      <CopilotModal 
        isOpen={isCopilotOpen} 
        onClose={() => setIsCopilotOpen(false)} 
      />

      <DataModal 
        isOpen={isDataModalOpen} 
        onClose={() => setIsDataModalOpen(false)} 
      />

      {/* Quiet, Anti-Slop Footer */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 dark:text-slate-200">Alan's Life OS</span>
            <span aria-hidden="true">·</span>
            <span>Business Performance & Analytics</span>
            <span aria-hidden="true">·</span>
            <span>Observe · Understand · Decide · Act · Reflect · Learn · Renew</span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDataModalOpen(true)}
              className="hover:text-stone-800 dark:hover:text-stone-200 underline"
            >
              Sao lưu dữ liệu
            </button>
            <span aria-hidden="true">·</span>
            <a 
              href="/public/assets/aistudio/Life_OS___Hu_o__ng_da__n_xa_y_du__ng_tu__ng_bu_o__c_21c82ec7.html" 
              target="_blank" 
              rel="noreferrer"
              className="hover:text-stone-800 dark:hover:text-stone-200 underline"
            >
              Tài liệu gốc đính kèm
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <LifeOSProvider>
        <AppContent />
      </LifeOSProvider>
    </AuthProvider>
  );
}
