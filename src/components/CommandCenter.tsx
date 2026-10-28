/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Module 1: Alan's Life Command Center
 * Grounded in:
 * - Systems thinking & analytical clarity
 * - 5 Principles: Truth, Integrity, Growth, Contribution, Stewardship
 * - 7-Stage Feedback Loop: Observe -> Understand -> Decide -> Act -> Reflect -> Learn -> Renew
 * - Clearly labelled placeholders for modular subsystems
 */

import React from 'react';
import { useLifeOS } from '../context/LifeOSContext';
import { 
  Compass, 
  Target, 
  CheckCircle2, 
  Circle, 
  Flame, 
  TrendingUp, 
  HelpCircle,
  ArrowRight,
  Brain,
  Shield,
  Layers,
  BookMarked,
  Wallet,
  Activity,
  Zap
} from 'lucide-react';
import { PlaceholderCard } from './common/PlaceholderCard';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';
import { MonthlyKpiDashboard } from './command/MonthlyKpiDashboard';

export const CommandCenter: React.FC = () => {
  const { 
    data, 
    toggleWeeklyPriority, 
    toggleDailyAction, 
    toggleHabitDay, 
    setActiveTab 
  } = useLifeOS();

  const todayStr = new Date().toISOString().split('T')[0];

  const loopStages = [
    { name: 'Observe', desc: 'Ghi nhận dữ liệu thực tế khách quan, không tự lừa dối' },
    { name: 'Understand', desc: 'Thấu hiểu cơ chế gốc rễ bằng tư duy First Principles' },
    { name: 'Decide', desc: 'Lựa chọn phương án & chấp nhận đánh đổi rõ ràng' },
    { name: 'Act', desc: 'Thực thi quyết liệt các cược đòn bẩy cao (Alpha Bets)' },
    { name: 'Reflect', desc: 'So sánh Kế hoạch vs Thực tế qua 8 câu hỏi phản tư' },
    { name: 'Learn', desc: 'Cập nhật mô hình tinh thần và hiệu chỉnh giả định sai' },
    { name: 'Renew', desc: 'Tái tạo năng lượng sinh học và giữ tâm chánh niệm' }
  ];

  // Daily priorities & energy
  const todayActions = data.dailyActions.filter(a => a.date === todayStr);
  const priorityActions = todayActions.filter(a => a.isPriority);

  // Strategic Bets counts
  const alphaProjects = data.projects.filter(p => p.strategicBet === 'alpha');
  const cashCowProjects = data.projects.filter(p => p.strategicBet === 'cash_cow');
  const rndProjects = data.projects.filter(p => p.strategicBet === 'rnd');
  const killProjects = data.projects.filter(p => p.strategicBet === 'kill');

  // Sparkline data for measured KPI (Weekly Priority Hit Rate)
  const kpiHitRate = data.kpis.find(k => k.id === 'kpi1');
  const sparklineData = kpiHitRate?.history.map(m => ({
    date: m.date.slice(5),
    value: m.value
  })) || [
    { date: '10-05', value: 67 },
    { date: '10-12', value: 67 },
    { date: '10-19', value: 100 },
    { date: '10-26', value: 100 }
  ];

  return (
    <div className="space-y-8 pb-16">
      
      {/* 1. Executive Persona & North Star Banner */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs dark:border-slate-800 dark:bg-slate-900 transition-colors">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                <Compass className="h-4 w-4" />
              </span>
              <span className="text-xs font-bold tracking-wider uppercase text-teal-800 dark:text-teal-400">
                Alan's Life Operating System · Business Performance & Systems Thinking
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
              <span>Truth · Integrity · Growth · Contribution · Stewardship</span>
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 text-balance leading-snug">
            "{data.northStar.coreMotto}"
          </h1>

          <p className="text-xs md:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {data.northStar.purpose}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
            <span><b>Tầm nhìn:</b> {data.northStar.vision}</span>
            <span aria-hidden="true">·</span>
            <button 
              onClick={() => setActiveTab('strategy')} 
              className="text-teal-700 dark:text-teal-400 hover:underline font-semibold"
            >
              Chỉnh sửa chiến lược & căn tính →
            </button>
          </div>
        </div>
      </section>

      {/* 2. The 7-Stage Feedback Loop (Infinite Loop) */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Chu trình Vận hành Khép kín (The 7-Stage Loop)
            </span>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 font-medium">
              Từ quan sát khách quan đến hành động đòn bẩy cao, phản tư định kỳ và làm mới tâm trí
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {loopStages.map((stage, idx) => (
              <React.Fragment key={stage.name}>
                <div 
                  className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
                  title={stage.desc}
                >
                  {stage.name}
                </div>
                {idx < loopStages.length - 1 && (
                  <span className="text-slate-300 text-xs">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Two-Column Analytical Split: Weekly Priorities & Today's 3 Non-Negotiables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        
        {/* Weekly Priorities */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-teal-700 dark:text-teal-400" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  3 Ưu tiên then chốt tuần này
                </h2>
              </div>
              <span className="text-xs font-mono tabular-nums text-slate-500">
                {data.weeklyPriorities.filter(p => p.completed).length} / {data.weeklyPriorities.length} hoàn thành
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Kỷ luật trọng tâm: Tối đa 3 mục tiêu mang lại đòn bẩy thực chất, không dàn trải nỗ lực.
            </p>

            <div className="mt-4 space-y-2.5">
              {data.weeklyPriorities.map(item => (
                <div 
                  key={item.id}
                  onClick={() => toggleWeeklyPriority(item.id)}
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                    item.completed
                      ? 'border-teal-200 bg-teal-50/40 text-slate-400 line-through dark:border-teal-950 dark:bg-teal-950/20'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40'
                  }`}
                >
                  <button 
                    type="button" 
                    className="mt-0.5 text-teal-700 dark:text-teal-400 focus:outline-none"
                    aria-label={item.completed ? "Đánh dấu chưa xong" : "Đánh dấu hoàn thành"}
                  >
                    {item.completed ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Circle className="h-4 w-4 text-slate-300" />
                    )}
                  </button>
                  <span className="text-xs font-medium leading-relaxed text-slate-900 dark:text-slate-100">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setActiveTab('goals')}
              className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              <span>Quản lý Mục tiêu & Dự án</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </section>

        {/* Today's 3 Non-Negotiables & Habit Streaks */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Hôm nay: 3 việc không thể thương lượng
                </h2>
              </div>
              <span className="text-xs font-mono tabular-nums text-slate-500">
                {priorityActions.filter(a => a.completed).length} / {priorityActions.length} hoàn thành
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Nếu chỉ hoàn thành 3 việc này, ngày hôm nay vẫn được xem là thành công mỹ mãn.
            </p>

            <div className="mt-4 space-y-2.5">
              {priorityActions.map(action => (
                <div
                  key={action.id}
                  onClick={() => toggleDailyAction(action.id)}
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                    action.completed
                      ? 'border-teal-200 bg-teal-50/40 text-slate-400 line-through dark:border-teal-950 dark:bg-teal-950/20'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40'
                  }`}
                >
                  <button type="button" className="mt-0.5 text-teal-700 dark:text-teal-400 focus:outline-none">
                    {action.completed ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Circle className="h-4 w-4 text-slate-300" />
                    )}
                  </button>
                  <div className="flex-1 text-xs font-medium leading-relaxed text-slate-900 dark:text-slate-100">
                    {action.text}
                  </div>
                  {action.timeSpentMinutes && (
                    <span className="text-[11px] text-slate-400 font-mono tabular-nums shrink-0">
                      {action.timeSpentMinutes}p
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Habit Streaks Quick Strip */}
            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                Điểm danh thói quen hôm nay ({todayStr}):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {data.habits.slice(0, 3).map(habit => {
                  const isDoneToday = !!habit.history[todayStr];
                  return (
                    <button
                      key={habit.id}
                      onClick={() => toggleHabitDay(habit.id, todayStr)}
                      className={`flex items-center justify-between p-2.5 rounded-lg border text-xs text-left transition-colors ${
                        isDoneToday
                          ? 'border-teal-300 bg-teal-50 text-teal-900 dark:border-teal-800 dark:bg-teal-950/40 dark:text-teal-200'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 dark:border-slate-800 dark:text-slate-300'
                      }`}
                    >
                      <span className="truncate pr-1">{habit.title.split('&')[0]}</span>
                      <span className="font-mono tabular-nums font-semibold shrink-0">
                        {habit.streakDays}🔥
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setActiveTab('execution')}
              className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              <span>Vào bảng Vận hành Ngày & Năng lượng</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </section>

      </div>

      {/* 4. Monthly KPI Dashboard (Recharts Visualizations against Strategic Goals) */}
      <MonthlyKpiDashboard />

      {/* 5. Metric Pulse & KPI Telemetry */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-teal-700 dark:text-teal-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Nhịp đập Chỉ số (KPI Telemetry & Engine)
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Nguyên tắc Chân thực (Truth): Phân biệt rạch ròi giữa <b>Chưa có số đo</b> và số 0.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('goals')}
            className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline flex items-center gap-1"
          >
            <span>Mở toàn bộ chỉ số KPI</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.kpis.map(kpi => {
            const hasData = kpi.hasMeasurement && kpi.currentValue !== null;

            return (
              <div 
                key={kpi.id}
                className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/40 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="capitalize">{kpi.frequency}</span>
                    <span className="font-mono">{kpi.direction}</span>
                  </div>

                  <h3 className="font-bold text-xs text-slate-900 dark:text-slate-100 mt-1 leading-snug">
                    {kpi.title}
                  </h3>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2" title={kpi.definition}>
                    {kpi.definition}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
                  {hasData ? (
                    <div>
                      <div className="flex items-baseline justify-between mb-2">
                        <div>
                          <span className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
                            {kpi.currentValue}
                          </span>
                          <span className="text-xs text-slate-500 ml-1">{kpi.unit}</span>
                        </div>
                        <div className="text-xs text-slate-500">
                          Mục tiêu: <span className="font-mono tabular-nums">{kpi.targetValue} {kpi.unit}</span>
                        </div>
                      </div>

                      {/* Mini Sparkline Chart */}
                      <div className="h-9 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={sparklineData}>
                            <defs>
                              <linearGradient id={`grad_${kpi.id}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="value" stroke="#0d9488" strokeWidth={1.5} fillOpacity={1} fill={`url(#grad_${kpi.id})`} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 p-2.5 rounded">
                      <HelpCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>Chưa có dữ liệu đo tuần này (Không phải 0)</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Strategic Bets Matrix (Alpha, Cash Cow, R&D, Kill) */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Phân bổ Danh mục Dự án theo Strategic Bets
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Phân biệt rõ: Cược đột phá (Alpha) · Nguồn thu duy trì (Cash Cow) · Thử nghiệm (R&D) · Loại bỏ (Kill)
            </p>
          </div>
          <span className="text-xs font-mono tabular-nums text-slate-500">
            {data.projects.length} dự án
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          <div className="p-3.5 rounded-lg border border-teal-200 bg-teal-50/40 dark:border-teal-900 dark:bg-teal-950/20">
            <span className="text-xs font-bold text-teal-800 dark:text-teal-300 block">Alpha Bets (Đột phá)</span>
            <span className="text-2xl font-bold font-mono tabular-nums text-teal-900 dark:text-teal-100 mt-1 block">
              {alphaProjects.length}
            </span>
            <span className="text-xs text-teal-700/80 dark:text-teal-400/80 block mt-1 truncate">
              {alphaProjects[0]?.title || 'Chưa có dự án'}
            </span>
          </div>

          <div className="p-3.5 rounded-lg border border-sky-200 bg-sky-50/40 dark:border-sky-900 dark:bg-sky-950/20">
            <span className="text-xs font-bold text-sky-800 dark:text-sky-300 block">Cash Cow (Duy trì)</span>
            <span className="text-2xl font-bold font-mono tabular-nums text-sky-900 dark:text-sky-100 mt-1 block">
              {cashCowProjects.length}
            </span>
            <span className="text-xs text-sky-700/80 dark:text-sky-400/80 block mt-1 truncate">
              {cashCowProjects[0]?.title || 'Chưa có dự án'}
            </span>
          </div>

          <div className="p-3.5 rounded-lg border border-purple-200 bg-purple-50/40 dark:border-purple-900 dark:bg-purple-950/20">
            <span className="text-xs font-bold text-purple-800 dark:text-purple-300 block">R&D (Thử nghiệm)</span>
            <span className="text-2xl font-bold font-mono tabular-nums text-purple-900 dark:text-purple-100 mt-1 block">
              {rndProjects.length}
            </span>
            <span className="text-xs text-purple-700/80 dark:text-purple-400/80 block mt-1 truncate">
              {rndProjects[0]?.title || 'Chưa có dự án'}
            </span>
          </div>

          <div className="p-3.5 rounded-lg border border-rose-200 bg-rose-50/40 dark:border-rose-900 dark:bg-rose-950/20">
            <span className="text-xs font-bold text-rose-800 dark:text-rose-300 block">Kill (Loại bỏ)</span>
            <span className="text-2xl font-bold font-mono tabular-nums text-rose-900 dark:text-rose-100 mt-1 block">
              {killProjects.length}
            </span>
            <span className="text-xs text-rose-700/80 dark:text-rose-400/80 block mt-1 truncate">
              Việc gây lãng phí năng lượng
            </span>
          </div>
        </div>
      </section>

      {/* 6. Clearly Labelled Analytical Placeholders for Alan's Subsystems */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Các Hệ thống Vệ tinh (Clearly Labelled Placeholders)
            </h2>
            <p className="text-xs text-slate-500">
              Khung module chuẩn hóa theo bối cảnh của Alan, sẵn sàng tích hợp khi hoàn tất core MVP
            </p>
          </div>
          <span className="text-xs text-slate-400">Roadmap v2 & v3</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PlaceholderCard
            category="Tri thức & Nghiên cứu"
            title="Knowledge & Zettelkasten OS"
            description="Lưu trữ mô hình tinh thần (Mental Models), ghi chú tư duy hệ thống và nguyên lý chánh niệm Phật giáo."
            icon={BookMarked}
            actionLabel="Xem thiết kế schema"
            onAction={() => setActiveTab('blueprint')}
            statusText="Đang chờ nạp ghi chú"
          >
            <div className="text-[11px] text-slate-500 bg-slate-50 dark:bg-slate-800/40 p-2 rounded border border-slate-100 dark:border-slate-800 font-mono">
              Schema: {`{ noteId, concept, mentalModel, source, tags }`}
            </div>
          </PlaceholderCard>

          <PlaceholderCard
            category="Tài chính & Phân bổ vốn"
            title="Personal Finance & Runway"
            description="Bảng cân đối tài sản ròng, theo dõi quỹ dự phòng khẩn cấp 12 tháng và danh mục tích lũy dài hạn."
            icon={Wallet}
            actionLabel="Xem chỉ số liên kết"
            onAction={() => setActiveTab('goals')}
            statusText="Liên kết với Goal #g3"
          >
            <div className="text-[11px] text-slate-500 bg-slate-50 dark:bg-slate-800/40 p-2 rounded border border-slate-100 dark:border-slate-800 font-mono">
              Metrics: {`{ runwayMonths: 12, liquidReserves: "Active" }`}
            </div>
          </PlaceholderCard>

          <PlaceholderCard
            category="Thần kinh học & Sinh học"
            title="Neuroscience & Vitality Protocol"
            description="Giao thức tối ưu nhịp sinh học (Circadian Rhythm), giấc ngủ sâu và nhịp tim Zone 2 cho hoạt động trí óc."
            icon={Activity}
            actionLabel="Xem ma trận thói quen"
            onAction={() => setActiveTab('execution')}
            statusText="3 thói quen đang chạy"
          >
            <div className="text-[11px] text-slate-500 bg-slate-50 dark:bg-slate-800/40 p-2 rounded border border-slate-100 dark:border-slate-800 font-mono">
              Protocols: {`{ zone2Cardio: "35km/w", deepSleep: "7.5h" }`}
            </div>
          </PlaceholderCard>
        </div>
      </section>

      {/* 7. Upcoming Reflection Checkpoint */}
      <section className="p-5 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-400">
            Khép vòng phản tư định kỳ (Closing the Loop)
          </span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">
            Weekly Review & Kiểm chứng Phán đoán
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            So sánh dự định ban đầu với thực tế diễn ra qua 8 câu hỏi phản tư và kiểm tra ngày đến hạn của {data.decisionLogs.length} quyết định.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('review')}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-teal-700 dark:hover:bg-teal-600 rounded-lg shadow-xs"
          >
            Thực hiện Weekly Review →
          </button>
        </div>
      </section>

    </div>
  );
};
