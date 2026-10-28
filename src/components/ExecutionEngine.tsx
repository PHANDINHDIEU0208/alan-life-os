/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Module 3: Execution & KPI Engine
 * Features:
 * - Goals & Projects management with Strategic Bet categorization
 * - Strict KPI Engine: explicit definitions, formulas, direction, units
 * - Distinct handling of "Missing Measurement" vs 0
 * - Habits & Daily Actions with 3-priority focus
 */

import React, { useState } from 'react';
import { useLifeOS } from '../context/LifeOSContext';
import { useAuth } from '../context/AuthContext';
import { 
  Target, 
  FolderKanban, 
  TrendingUp, 
  Flame, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  HelpCircle,
  Clock,
  Calendar,
  CheckSquare,
  Activity,
  Cloud,
  CloudOff,
  Database,
  ShieldCheck,
  AlertCircle,
  Loader2,
  LogIn,
  Check
} from 'lucide-react';
import { DimensionKey, KPIFrequency, KPIDirection, StrategicBet, GoalStatus, ProjectStatus } from '../types/lifeos';

type ExecutionTab = 'goals' | 'projects' | 'kpis' | 'habits_actions';

interface ExecutionEngineProps {
  initialTab?: ExecutionTab;
}

export const ExecutionEngine: React.FC<ExecutionEngineProps> = ({ initialTab = 'goals' }) => {
  const { 
    data, 
    addGoal, 
    updateGoal, 
    deleteGoal,
    addProject, 
    updateProject, 
    deleteProject, 
    toggleProjectTask,
    addKPI, 
    logKPIMeasurement, 
    deleteKPI,
    addHabit, 
    deleteHabit, 
    toggleHabitDay,
    addDailyAction, 
    toggleDailyAction, 
    deleteDailyAction,
    firestoreSyncStatus,
    syncError
  } = useLifeOS();

  const { user, signIn, isSigningIn, error: authError, clearError: clearAuthError, isOnline } = useAuth();

  const [activeTab, setActiveTab] = useState<ExecutionTab>(initialTab);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const todayStr = new Date().toISOString().split('T')[0];

  // Modals / forms
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalDesc, setGoalDesc] = useState('');
  const [goalDim, setGoalDim] = useState<DimensionKey>('career');
  const [goalDate, setGoalDate] = useState('2026-12-31');

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectGoalId, setProjectGoalId] = useState('');
  const [projectBet, setProjectBet] = useState<StrategicBet>('alpha');
  const [projectDueDate, setProjectDueDate] = useState('2026-11-30');
  const [projectNotes, setProjectNotes] = useState('');

  const [showKpiModal, setShowKpiModal] = useState(false);
  const [kpiTitle, setKpiTitle] = useState('');
  const [kpiDef, setKpiDef] = useState('');
  const [kpiFormula, setKpiFormula] = useState('');
  const [kpiUnit, setKpiUnit] = useState('%');
  const [kpiFreq, setKpiFreq] = useState<KPIFrequency>('weekly');
  const [kpiDir, setKpiDir] = useState<KPIDirection>('increase');
  const [kpiTarget, setKpiTarget] = useState<string>('100');

  const [loggingKpiId, setLoggingKpiId] = useState<string | null>(null);
  const [logValue, setLogValue] = useState<string>('');
  const [logNote, setLogNote] = useState<string>('');

  const [newActionText, setNewActionText] = useState('');
  const [newActionIsPriority, setNewActionIsPriority] = useState(false);

  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitDim, setNewHabitDim] = useState<DimensionKey>('health');

  // Handle Goal creation
  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;
    addGoal({
      title: goalTitle.trim(),
      description: goalDesc.trim(),
      dimensionId: goalDim,
      targetDate: goalDate,
      status: 'active',
      progressPercent: 0
    });
    setGoalTitle('');
    setGoalDesc('');
    setShowGoalModal(false);
  };

  // Handle Project creation
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle.trim()) return;
    addProject({
      title: projectTitle.trim(),
      goalId: projectGoalId || undefined,
      status: 'in_progress',
      priority: 'high',
      strategicBet: projectBet,
      dueDate: projectDueDate,
      tasks: [
        { id: 't_' + Date.now() + '_1', text: 'Lập dàn ý các đầu việc then chốt', completed: false }
      ],
      notes: projectNotes.trim()
    });
    setProjectTitle('');
    setProjectNotes('');
    setShowProjectModal(false);
  };

  // Handle KPI creation
  const handleCreateKPI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kpiTitle.trim()) return;
    addKPI({
      title: kpiTitle.trim(),
      definition: kpiDef.trim(),
      formula: kpiFormula.trim(),
      unit: kpiUnit.trim(),
      frequency: kpiFreq,
      direction: kpiDir,
      targetValue: parseFloat(kpiTarget) || 0,
      currentValue: null,
      hasMeasurement: false // Starts without measurement (NOT zero!)
    });
    setKpiTitle('');
    setKpiDef('');
    setKpiFormula('');
    setShowKpiModal(false);
  };

  // Handle Logging KPI measurement
  const handleSaveKpiMeasurement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loggingKpiId) return;
    const val = parseFloat(logValue);
    if (isNaN(val)) return;
    logKPIMeasurement(loggingKpiId, val, logNote.trim());
    setLoggingKpiId(null);
    setLogValue('');
    setLogNote('');
  };

  // Handle Action creation
  const handleCreateAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionText.trim()) return;
    addDailyAction({
      date: todayStr,
      text: newActionText.trim(),
      isPriority: newActionIsPriority,
      completed: false
    });
    setNewActionText('');
    setNewActionIsPriority(false);
  };

  // Handle Habit creation
  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitTitle.trim()) return;
    addHabit({
      title: newHabitTitle.trim(),
      frequency: 'Hàng ngày',
      targetPerWeek: 7,
      category: newHabitDim
    });
    setNewHabitTitle('');
  };

  // Days for the 7-day habit strip
  const pastSevenDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  return (
    <div className="space-y-8 pb-16">
      
      {/* 1. Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-700 dark:text-emerald-400 uppercase">
          <Activity className="h-4 w-4" />
          <span>Module 3: Động cơ Vận hành & Đo lường</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100 mt-1">
          Vận hành & KPI Engine (Execution Engine)
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-3xl">
          Nối kết giữa kế hoạch và thực thi: Quản lý mục tiêu, phân bổ dự án theo Strategic Bets, và đo lường kỷ luật với chỉ số KPI có định nghĩa rõ ràng.
        </p>
      </div>

      {/* 2. Interactive Segmented Control Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-stone-200/60 dark:bg-stone-800/60 rounded-xl overflow-x-auto">
        <button
          onClick={() => setActiveTab('goals')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'goals'
              ? 'bg-white text-stone-900 shadow-xs dark:bg-stone-900 dark:text-stone-100'
              : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200'
          }`}
        >
          <Target className="h-3.5 w-3.5" />
          <span>Mục tiêu ({data.goals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'projects'
              ? 'bg-white text-stone-900 shadow-xs dark:bg-stone-900 dark:text-stone-100'
              : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200'
          }`}
        >
          <FolderKanban className="h-3.5 w-3.5" />
          <span>Dự án & Strategic Bets ({data.projects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('kpis')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'kpis'
              ? 'bg-white text-stone-900 shadow-xs dark:bg-stone-900 dark:text-stone-100'
              : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200'
          }`}
        >
          <TrendingUp className="h-3.5 w-3.5" />
          <span>KPI Engine ({data.kpis.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('habits_actions')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
            activeTab === 'habits_actions'
              ? 'bg-white text-stone-900 shadow-xs dark:bg-stone-900 dark:text-stone-100'
              : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200'
          }`}
        >
          <Flame className="h-3.5 w-3.5" />
          <span>Thói quen & Hành động ngày</span>
        </button>
      </div>

      {/* 3. TAB 1: GOALS */}
      {activeTab === 'goals' && (
        <section className="space-y-4">
          
          {/* Cloud Firestore Status & Sandbox Banner */}
          {user ? (
            <div className="p-4 rounded-xl border border-teal-200/80 bg-teal-50/50 dark:border-teal-900/60 dark:bg-teal-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-teal-600 text-white shrink-0 mt-0.5">
                  <Cloud className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 dark:text-stone-100">
                      Cloud Firestore Đang kết nối
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      <ShieldCheck className="h-3 w-3" />
                      Quy tắc bảo mật UID cá nhân
                    </span>
                  </div>
                  <p className="text-stone-600 dark:text-stone-400 mt-0.5">
                    Đường dẫn Firestore: <code className="font-mono bg-white/80 dark:bg-stone-900/80 px-1.5 py-0.5 rounded border border-teal-200 dark:border-teal-800 text-[11px] text-teal-800 dark:text-teal-300">/users/{user.uid}/goals</code>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {firestoreSyncStatus === 'syncing' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Đang đồng bộ...
                  </span>
                ) : firestoreSyncStatus === 'synced' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    <Check className="h-3.5 w-3.5" />
                    Đồng bộ thời gian thực
                  </span>
                ) : firestoreSyncStatus === 'offline' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                    <CloudOff className="h-3.5 w-3.5" />
                    Ngoại tuyến (Cache)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Lỗi đồng bộ
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/50 dark:border-amber-900/60 dark:bg-amber-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-600 text-white shrink-0 mt-0.5">
                  <Database className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-bold text-stone-900 dark:text-stone-100">
                    Chế độ Local Sandbox (Chưa đăng nhập)
                  </div>
                  <p className="text-stone-600 dark:text-stone-400 mt-0.5">
                    Dữ liệu đang lưu tạm trong bộ nhớ trình duyệt. Đăng nhập Google để kích hoạt đồng bộ đám mây Cloud Firestore bảo mật theo từng UID người dùng.
                  </p>
                </div>
              </div>

              <button
                onClick={signIn}
                disabled={isSigningIn}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white rounded-lg flex items-center gap-1.5 shrink-0 shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSigningIn ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Đang mở cửa sổ...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="h-3.5 w-3.5" />
                    <span>Đăng nhập Google</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Auth Error / Popup Blocked Alert */}
          {authError && (
            <div className="p-3.5 rounded-lg border border-rose-300 bg-rose-50 text-rose-900 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-200 text-xs flex items-start justify-between gap-3 shadow-xs">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                <div>
                  <span className="font-semibold">Thông báo xác thực: </span>
                  <span>{authError}</span>
                </div>
              </div>
              <button 
                onClick={clearAuthError}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 text-xs font-mono px-1 shrink-0"
                title="Đóng thông báo"
              >
                ✕
              </button>
            </div>
          )}

          {/* Sync Error Alert */}
          {syncError && (
            <div className="p-3 rounded-lg border border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{syncError}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Danh sách Mục tiêu (Goals)
              </h2>
              <p className="text-xs text-stone-500">
                {user ? 'Dữ liệu được lưu trữ trực tiếp trên Cloud Firestore của tài khoản' : 'Dữ liệu đang chạy ở chế độ cục bộ'}
              </p>
            </div>
            <button
              onClick={() => setShowGoalModal(true)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-900 dark:bg-teal-600 dark:hover:bg-teal-700 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tạo mục tiêu</span>
            </button>
          </div>

          {/* Loading Skeleton */}
          {firestoreSyncStatus === 'syncing' && data.goals.length === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="p-5 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 animate-pulse space-y-4">
                  <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-1/3"></div>
                  <div className="h-5 bg-stone-200 dark:bg-stone-800 rounded w-3/4"></div>
                  <div className="h-10 bg-stone-100 dark:bg-stone-800 rounded w-full"></div>
                  <div className="h-2 bg-stone-200 dark:bg-stone-800 rounded w-full"></div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {data.goals.length === 0 && firestoreSyncStatus !== 'syncing' && (
            <div className="p-10 rounded-2xl border-2 border-dashed border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950/60 flex items-center justify-center text-teal-700 dark:text-teal-400">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Chưa có mục tiêu nào trong kế hoạch
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Khởi tạo mục tiêu dài hạn hoặc trung hạn đầu tiên để kết nối tầm nhìn chiến lược với các dự án thực thi hàng ngày.
              </p>
              <button
                onClick={() => setShowGoalModal(true)}
                className="mt-2 px-4 py-2 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-lg inline-flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Tạo Mục tiêu Đầu tiên</span>
              </button>
            </div>
          )}

          {/* Goals List */}
          {data.goals.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.goals.map(goal => {
                const dim = data.dimensions.find(d => d.id === goal.dimensionId);
                const linkedProjects = data.projects.filter(p => p.goalId === goal.id);

                return (
                  <div 
                    key={goal.id} 
                    className="p-5 rounded-xl border border-stone-200/80 bg-white dark:border-stone-800 dark:bg-stone-900 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-medium text-teal-800 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded">
                          {dim?.nameVi || goal.dimensionId}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {user && (
                            <span className="text-[10px] text-teal-700 dark:text-teal-400 flex items-center gap-0.5" title="Đồng bộ với Firestore">
                              <Cloud className="h-3 w-3" />
                            </span>
                          )}
                          <span className="text-stone-500 capitalize">{goal.status}</span>
                        </div>
                      </div>

                      <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 leading-snug">
                        {goal.title}
                      </h3>

                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-1.5 line-clamp-2">
                        {goal.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-stone-100 dark:border-stone-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-stone-500">Tiến độ:</span>
                        <span className="font-mono font-bold tabular-nums">{goal.progressPercent}%</span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-teal-700 h-full rounded-full transition-all"
                          style={{ width: `${goal.progressPercent}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
                        <span>Hạn: {goal.targetDate}</span>
                        <span>{linkedProjects.length} dự án con</span>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={goal.progressPercent}
                          onChange={e => updateGoal(goal.id, { progressPercent: parseInt(e.target.value, 10) })}
                          className="w-2/3 accent-teal-700 h-1 bg-stone-200 dark:bg-stone-700 rounded cursor-pointer"
                          title="Kéo để cập nhật tiến độ"
                        />
                        <button
                          onClick={() => deleteGoal(goal.id)}
                          className="text-stone-400 hover:text-rose-600 p-1"
                          title="Xóa mục tiêu"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* 4. TAB 2: PROJECTS & STRATEGIC BETS */}
      {activeTab === 'projects' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Dự án & Phân loại Strategic Bets
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Alpha (Cược lớn tạo đột phá) · Cash Cow (Nguồn thu ổn định) · R&D (Thử nghiệm) · Kill (Loại bỏ)
              </p>
            </div>
            <button
              onClick={() => setShowProjectModal(true)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-700 rounded-lg flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tạo dự án</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.projects.map(project => {
              const linkedGoal = data.goals.find(g => g.id === project.goalId);
              const completedTasks = project.tasks.filter(t => t.completed).length;

              const betBadge = {
                alpha: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
                cash_cow: 'bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800',
                rnd: 'bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800',
                kill: 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
              }[project.strategicBet];

              return (
                <div 
                  key={project.id}
                  className="p-5 rounded-xl border border-stone-200/80 bg-white dark:border-stone-800 dark:bg-stone-900 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className={`px-2 py-0.5 rounded border text-xs font-bold uppercase ${betBadge}`}>
                        {project.strategicBet}
                      </span>
                      <span className="text-stone-500 font-mono text-xs">Hạn: {project.dueDate}</span>
                    </div>

                    <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                      {project.title}
                    </h3>

                    {linkedGoal && (
                      <p className="text-xs text-stone-500 mt-1">
                        Mục tiêu: <span className="font-medium text-stone-700 dark:text-stone-300">{linkedGoal.title}</span>
                      </p>
                    )}

                    {project.notes && (
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 italic bg-stone-50 dark:bg-stone-800/40 p-2 rounded">
                        "{project.notes}"
                      </p>
                    )}

                    {/* Task checklist */}
                    <div className="mt-4 space-y-2">
                      <span className="text-xs font-semibold text-stone-600 dark:text-stone-400">
                        Đầu việc ({completedTasks}/{project.tasks.length}):
                      </span>
                      {project.tasks.map(task => (
                        <div 
                          key={task.id}
                          onClick={() => toggleProjectTask(project.id, task.id)}
                          className="flex items-center gap-2 text-xs cursor-pointer p-1.5 rounded hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors"
                        >
                          {task.completed ? (
                            <CheckSquare className="h-4 w-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                          ) : (
                            <Circle className="h-4 w-4 text-stone-300 shrink-0" />
                          )}
                          <span className={task.completed ? 'line-through text-stone-400' : 'text-stone-800 dark:text-stone-200'}>
                            {task.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                    <select
                      value={project.status}
                      onChange={e => updateProject(project.id, { status: e.target.value as ProjectStatus })}
                      className="px-2 py-1 text-xs rounded border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200"
                    >
                      <option value="planning">Kế hoạch (Planning)</option>
                      <option value="in_progress">Đang làm (In Progress)</option>
                      <option value="blocked">Bị chặn (Blocked)</option>
                      <option value="completed">Hoàn thành (Completed)</option>
                    </select>

                    <button
                      onClick={() => deleteProject(project.id)}
                      className="text-stone-400 hover:text-rose-600 p-1"
                      title="Xóa dự án"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 5. TAB 3: KPI ENGINE */}
      {activeTab === 'kpis' && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                KPI Engine – Hệ thống Chỉ số Đo lường
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Mỗi KPI có định nghĩa, công thức, đơn vị và tần suất rõ ràng. <span className="font-semibold text-emerald-700 dark:text-emerald-400">Thiếu số đo = "Chưa có dữ liệu", không phải 0.</span>
              </p>
            </div>
            <button
              onClick={() => setShowKpiModal(true)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-700 rounded-lg flex items-center gap-1.5 shadow-xs self-start sm:self-auto"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Thêm KPI</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.kpis.map(kpi => {
              const hasData = kpi.hasMeasurement && kpi.currentValue !== null;

              return (
                <div 
                  key={kpi.id}
                  className="p-5 rounded-xl border border-stone-200/80 bg-white dark:border-stone-800 dark:bg-stone-900 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                      <span className="capitalize">{kpi.frequency}</span>
                      <span className="font-mono text-xs">{kpi.direction}</span>
                    </div>

                    <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 leading-snug">
                      {kpi.title}
                    </h3>

                    <div className="mt-2 text-xs space-y-1 bg-stone-50 dark:bg-stone-800/40 p-2.5 rounded border border-stone-200/60 dark:border-stone-700/60">
                      <div>
                        <span className="text-stone-500">Định nghĩa: </span>
                        <span className="text-stone-800 dark:text-stone-200">{kpi.definition}</span>
                      </div>
                      <div>
                        <span className="text-stone-500">Công thức: </span>
                        <span className="font-mono text-stone-700 dark:text-stone-300">{kpi.formula}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 space-y-2">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-xs text-stone-500 block">Hiện tại</span>
                        {hasData ? (
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold font-mono tabular-nums text-stone-900 dark:text-stone-100">
                              {kpi.currentValue}
                            </span>
                            <span className="text-xs text-stone-500">{kpi.unit}</span>
                          </div>
                        ) : (
                          <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded">
                            Chưa có dữ liệu đo
                          </span>
                        )}
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-stone-500 block">Mục tiêu</span>
                        <span className="text-sm font-bold font-mono tabular-nums text-stone-800 dark:text-stone-200">
                          {kpi.targetValue} {kpi.unit}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={() => {
                          setLoggingKpiId(kpi.id);
                          setLogValue(hasData ? String(kpi.currentValue) : '');
                        }}
                        className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 px-2.5 py-1 rounded transition-colors"
                      >
                        Ghi nhận số đo mới
                      </button>

                      <button
                        onClick={() => deleteKPI(kpi.id)}
                        className="text-stone-400 hover:text-rose-600 p-1"
                        title="Xóa KPI"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modal / Form to log measurement */}
          {loggingKpiId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 backdrop-blur-xs p-4">
              <form 
                onSubmit={handleSaveKpiMeasurement}
                className="w-full max-w-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-lg space-y-4"
              >
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    Ghi nhận số đo KPI
                  </h3>
                  <button type="button" onClick={() => setLoggingKpiId(null)} className="text-stone-400 hover:text-stone-600">
                    ✕
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Giá trị đo được ({data.kpis.find(k => k.id === loggingKpiId)?.unit})
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={logValue}
                    onChange={e => setLogValue(e.target.value)}
                    placeholder="Nhập con số thực tế..."
                    className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Ghi chú bối cảnh (tùy chọn)
                  </label>
                  <input
                    type="text"
                    value={logNote}
                    onChange={e => setLogNote(e.target.value)}
                    placeholder="Ví dụ: Đo sau tuần chạy tích lũy..."
                    className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setLoggingKpiId(null)}
                    className="px-3 py-1.5 text-xs text-stone-600 dark:text-stone-400 hover:underline"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg"
                  >
                    Lưu số đo
                  </button>
                </div>
              </form>
            </div>
          )}
        </section>
      )}

      {/* 6. TAB 4: HABITS & DAILY ACTIONS */}
      {activeTab === 'habits_actions' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Daily Actions */}
          <section className="p-6 rounded-xl border border-stone-200/80 bg-white dark:border-stone-800 dark:bg-stone-900 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
              <div>
                <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                  Nhật ký Hành động hôm nay ({todayStr})
                </h2>
                <p className="text-xs text-stone-500">Giữ kỷ luật: Tối đa 3 hành động then chốt (Non-negotiables)</p>
              </div>
            </div>

            <form onSubmit={handleCreateAction} className="mt-4 flex gap-2">
              <input
                type="text"
                placeholder="Thêm hành động cần làm hôm nay..."
                value={newActionText}
                onChange={e => setNewActionText(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
              />
              <label className="flex items-center gap-1 text-xs cursor-pointer text-stone-600 dark:text-stone-400">
                <input
                  type="checkbox"
                  checked={newActionIsPriority}
                  onChange={e => setNewActionIsPriority(e.target.checked)}
                  className="accent-amber-600"
                />
                <span>Ưu tiên ⭐</span>
              </label>
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shrink-0"
              >
                Thêm
              </button>
            </form>

            <div className="mt-4 space-y-2">
              {data.dailyActions.filter(a => a.date === todayStr).map(action => (
                <div 
                  key={action.id}
                  className={`flex items-center justify-between p-2.5 rounded-lg border text-xs transition-colors ${
                    action.completed 
                      ? 'border-emerald-200/70 bg-emerald-50/40 text-stone-400 line-through dark:border-emerald-950 dark:bg-emerald-950/20' 
                      : 'border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200'
                  }`}
                >
                  <div 
                    onClick={() => toggleDailyAction(action.id)}
                    className="flex items-center gap-2 cursor-pointer flex-1"
                  >
                    {action.completed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 text-stone-300 shrink-0" />
                    )}
                    <span>
                      {action.isPriority && <span className="text-amber-600 mr-1">⭐</span>}
                      {action.text}
                    </span>
                  </div>

                  <button
                    onClick={() => deleteDailyAction(action.id)}
                    className="text-stone-400 hover:text-rose-600 ml-2"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Habits Matrix */}
          <section className="p-6 rounded-xl border border-stone-200/80 bg-white dark:border-stone-800 dark:bg-stone-900 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
              <div>
                <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                  Ma trận Thói quen 7 ngày
                </h2>
                <p className="text-xs text-stone-500">Giữ chuỗi streak liên tục để biến hành vi thành bản năng</p>
              </div>
            </div>

            <form onSubmit={handleCreateHabit} className="mt-4 flex gap-2">
              <input
                type="text"
                placeholder="Thói quen mới..."
                value={newHabitTitle}
                onChange={e => setNewHabitTitle(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
              />
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shrink-0"
              >
                Thêm thói quen
              </button>
            </form>

            <div className="mt-4 space-y-3">
              {data.habits.map(habit => (
                <div key={habit.id} className="p-3 rounded-lg border border-stone-200 dark:border-stone-800">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-stone-900 dark:text-stone-100 truncate pr-2">
                      {habit.title}
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                        {habit.streakDays}🔥 ngày
                      </span>
                      <button onClick={() => deleteHabit(habit.id)} className="text-stone-400 hover:text-rose-600">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* 7-day strip */}
                  <div className="grid grid-cols-7 gap-1 pt-1">
                    {pastSevenDays.map(ds => {
                      const isDone = !!habit.history[ds];
                      const isToday = ds === todayStr;
                      const dayLetter = new Date(ds).toLocaleDateString('vi-VN', { weekday: 'narrow' });

                      return (
                        <button
                          key={ds}
                          type="button"
                          onClick={() => toggleHabitDay(habit.id, ds)}
                          className={`flex flex-col items-center justify-center p-1.5 rounded transition-colors text-xs ${
                            isDone 
                              ? 'bg-emerald-600 text-white font-bold' 
                              : 'bg-stone-100 hover:bg-stone-200 text-stone-500 dark:bg-stone-800 dark:hover:bg-stone-700'
                          } ${isToday ? 'ring-2 ring-emerald-400' : ''}`}
                          title={`${ds}: ${isDone ? 'Đã hoàn thành' : 'Chưa hoàn thành'}`}
                        >
                          <span className="text-[10px] opacity-75">{dayLetter}</span>
                          <span className="font-mono text-xs">{ds.split('-')[2]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      )}

      {/* Goal Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 backdrop-blur-xs p-4">
          <form onSubmit={handleCreateGoal} className="w-full max-w-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2">
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">Tạo Mục tiêu mới (Goal)</h3>
              <button type="button" onClick={() => setShowGoalModal(false)}>✕</button>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Tên mục tiêu</label>
              <input
                type="text"
                value={goalTitle}
                onChange={e => setGoalTitle(e.target.value)}
                placeholder="Ví dụ: Ra mắt Life OS v1.0 hoàn chỉnh"
                className="w-full px-3 py-1.5 text-sm rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Mô tả chi tiết</label>
              <textarea
                value={goalDesc}
                onChange={e => setGoalDesc(e.target.value)}
                rows={2}
                placeholder="Kết quả cụ thể mong muốn đạt được..."
                className="w-full px-3 py-1.5 text-sm rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1">Khía cạnh cuộc sống</label>
                <select
                  value={goalDim}
                  onChange={e => setGoalDim(e.target.value as DimensionKey)}
                  className="w-full px-3 py-1.5 text-xs rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                >
                  {data.dimensions.map(d => (
                    <option key={d.id} value={d.id}>{d.nameVi}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Hạn hoàn thành</label>
                <input
                  type="date"
                  value={goalDate}
                  onChange={e => setGoalDate(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-mono"
                />
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800">
              <span className="text-[11px] text-stone-500 flex items-center gap-1">
                {user ? (
                  <>
                    <Cloud className="h-3 w-3 text-teal-600" />
                    Lưu Firestore: <code className="font-mono text-[10px]">/users/.../goals</code>
                  </>
                ) : (
                  <>
                    <Database className="h-3 w-3 text-amber-600" />
                    Lưu cục bộ (chưa đăng nhập)
                  </>
                )}
              </span>
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowGoalModal(false)} className="px-3 py-1.5 text-xs text-stone-600 dark:text-stone-400 hover:underline">Hủy</button>
                <button type="submit" className="px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-lg shadow-xs">Lưu mục tiêu</button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 backdrop-blur-xs p-4">
          <form onSubmit={handleCreateProject} className="w-full max-w-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2">
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">Tạo Dự án mới (Project)</h3>
              <button type="button" onClick={() => setShowProjectModal(false)}>✕</button>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Tên dự án</label>
              <input
                type="text"
                value={projectTitle}
                onChange={e => setProjectTitle(e.target.value)}
                placeholder="Tên dự án cụ thể..."
                className="w-full px-3 py-1.5 text-sm rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1">Phân loại Strategic Bet</label>
                <select
                  value={projectBet}
                  onChange={e => setProjectBet(e.target.value as StrategicBet)}
                  className="w-full px-3 py-1.5 text-xs rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-semibold"
                >
                  <option value="alpha">Alpha (Cược đột phá)</option>
                  <option value="cash_cow">Cash Cow (Duy trì ổn định)</option>
                  <option value="rnd">R&D (Thử nghiệm)</option>
                  <option value="kill">Kill (Dừng lại)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Thuộc Mục tiêu (Goal)</label>
                <select
                  value={projectGoalId}
                  onChange={e => setProjectGoalId(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 truncate"
                >
                  <option value="">-- Không liên kết --</option>
                  {data.goals.map(g => (
                    <option key={g.id} value={g.id}>{g.title}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Hạn chót</label>
              <input
                type="date"
                value={projectDueDate}
                onChange={e => setProjectDueDate(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-mono"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowProjectModal(false)} className="px-3 py-1 text-xs">Hủy</button>
              <button type="submit" className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-800 rounded">Tạo dự án</button>
            </div>
          </form>
        </div>
      )}

      {/* KPI Modal */}
      {showKpiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 backdrop-blur-xs p-4">
          <form onSubmit={handleCreateKPI} className="w-full max-w-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2">
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">Định nghĩa KPI mới</h3>
              <button type="button" onClick={() => setShowKpiModal(false)}>✕</button>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Tên chỉ số KPI</label>
              <input
                type="text"
                value={kpiTitle}
                onChange={e => setKpiTitle(e.target.value)}
                placeholder="Ví dụ: Tỷ lệ hoàn thành ưu tiên tuần"
                className="w-full px-3 py-1.5 text-sm rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Định nghĩa rõ ràng (What is measured?)</label>
              <textarea
                value={kpiDef}
                onChange={e => setKpiDef(e.target.value)}
                rows={2}
                placeholder="Mô tả chính xác thứ được đo và điều kiện tính..."
                className="w-full px-3 py-1.5 text-xs rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Công thức toán học</label>
              <input
                type="text"
                value={kpiFormula}
                onChange={e => setKpiFormula(e.target.value)}
                placeholder="Ví dụ: (Số ưu tiên hoàn thành / 3) * 100"
                className="w-full px-3 py-1.5 text-xs rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-mono"
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-medium mb-1">Đơn vị</label>
                <input
                  type="text"
                  value={kpiUnit}
                  onChange={e => setKpiUnit(e.target.value)}
                  placeholder="%, km, giờ..."
                  className="w-full px-2 py-1.5 text-xs rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Tần suất</label>
                <select
                  value={kpiFreq}
                  onChange={e => setKpiFreq(e.target.value as KPIFrequency)}
                  className="w-full px-2 py-1.5 text-xs rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                >
                  <option value="daily">Hàng ngày</option>
                  <option value="weekly">Hàng tuần</option>
                  <option value="monthly">Hàng tháng</option>
                  <option value="quarterly">Hàng quý</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Hướng đo</label>
                <select
                  value={kpiDir}
                  onChange={e => setKpiDir(e.target.value as KPIDirection)}
                  className="w-full px-2 py-1.5 text-xs rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                >
                  <option value="increase">Tăng dần (Increase)</option>
                  <option value="decrease">Giảm dần (Decrease)</option>
                  <option value="maintain">Duy trì (Maintain)</option>
                  <option value="qualitative">Định tính (Qualitative)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Mục tiêu (Target Value)</label>
              <input
                type="number"
                value={kpiTarget}
                onChange={e => setKpiTarget(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-mono"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowKpiModal(false)} className="px-3 py-1 text-xs">Hủy</button>
              <button type="submit" className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-800 rounded">Lưu KPI</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
