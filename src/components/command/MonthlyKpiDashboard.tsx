/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Monthly KPI Dashboard Component for Alan's Life Command Center
 * Visualizes monthly performance metrics against predefined strategic goals
 * using Recharts with analytical clarity and plan-vs-actual variance tracking.
 */

import React, { useState } from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import { 
  BarChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine,
  ComposedChart,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  Target, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownRight, 
  SlidersHorizontal,
  Layers,
  HelpCircle
} from 'lucide-react';

interface MonthlyMetricPoint {
  month: string;
  actual: number | null;
  target: number;
  unit: string;
  note?: string;
}

interface StrategicKpiSeries {
  id: string;
  title: string;
  dimension: string;
  unit: string;
  direction: 'increase' | 'maintain' | 'decrease';
  strategicGoalTitle: string;
  targetBenchmark: number;
  monthlyData: MonthlyMetricPoint[];
}

export const MonthlyKpiDashboard: React.FC = () => {
  const { data } = useLifeOS();

  // Predefined strategic KPI metrics grounded in Alan's context (Business Analytics, Health, Capital, Systems)
  const [strategicKpis] = useState<StrategicKpiSeries[]>([
    {
      id: 'kpi_hit_rate',
      title: 'Tỷ lệ hoàn thành Ưu tiên Tuần (Priority Hit Rate)',
      dimension: 'Sự nghiệp & Vận hành',
      unit: '%',
      direction: 'increase',
      strategicGoalTitle: 'Ra mắt Life OS v1.0 và hoàn thiện 100% cược Alpha',
      targetBenchmark: 80,
      monthlyData: [
        { month: 'T5/2026', actual: 70, target: 80, unit: '%', note: 'Giai đoạn bắt đầu thiết lập quy trình' },
        { month: 'T6/2026', actual: 75, target: 80, unit: '%', note: 'Tăng cường tập trung' },
        { month: 'T7/2026', actual: 83, target: 80, unit: '%', note: 'Vượt mục tiêu' },
        { month: 'T8/2026', actual: 88, target: 80, unit: '%', note: 'Duy trì đều đặn' },
        { month: 'T9/2026', actual: 82, target: 80, unit: '%', note: 'Có biến số phát sinh nhưng vẫn đạt' },
        { month: 'T10/2026', actual: 92, target: 80, unit: '%', note: 'Thực thi xuất sắc trong tháng này' }
      ]
    },
    {
      id: 'kpi_mileage',
      title: 'Quãng đường Chạy bộ Tích lũy (Monthly Running Mileage)',
      dimension: 'Sức khỏe & Năng lượng',
      unit: 'km',
      direction: 'maintain',
      strategicGoalTitle: 'Duy trì thể chất bền bỉ & nhịp tim Zone 2 tối ưu',
      targetBenchmark: 120,
      monthlyData: [
        { month: 'T5/2026', actual: 95, target: 120, unit: 'km', note: 'Bắt đầu giai đoạn Base building' },
        { month: 'T6/2026', actual: 110, target: 120, unit: 'km', note: 'Tăng khối lượng an toàn' },
        { month: 'T7/2026', actual: 125, target: 120, unit: 'km', note: 'Đạt mốc 125km' },
        { month: 'T8/2026', actual: 118, target: 120, unit: 'km', note: 'Giảm nhẹ do thời tiết mưa bão' },
        { month: 'T9/2026', actual: 122, target: 120, unit: 'km', note: 'Hoàn thành 4 buổi/tuần đều đặn' },
        { month: 'T10/2026', actual: 114, target: 120, unit: 'km', note: 'Đang theo tiến độ tuần 4' }
      ]
    },
    {
      id: 'kpi_deep_work',
      title: 'Thời lượng Làm việc Sâu (Monthly Deep Work Hours)',
      dimension: 'Trí tuệ & Chuyên môn',
      unit: 'giờ',
      direction: 'increase',
      strategicGoalTitle: 'Tập trung nghiên cứu First Principles & AI Systems',
      targetBenchmark: 80,
      monthlyData: [
        { month: 'T5/2026', actual: 64, target: 80, unit: 'giờ', note: 'Nhiều cuộc họp phát sinh' },
        { month: 'T6/2026', actual: 72, target: 80, unit: 'giờ', note: 'Tối ưu lại block thời gian buổi sáng' },
        { month: 'T7/2026', actual: 85, target: 80, unit: 'giờ', note: 'Tập trung sâu không gián đoạn' },
        { month: 'T8/2026', actual: 78, target: 80, unit: 'giờ', note: 'Gần đạt mục tiêu' },
        { month: 'T9/2026', actual: 84, target: 80, unit: 'giờ', note: 'Hiệu quả cao trên dự án Alpha' },
        { month: 'T10/2026', actual: null, target: 80, unit: 'giờ', note: 'Đang trong chu kỳ đo lường cuối tháng' } // Explicitly missing (not 0!)
      ]
    },
    {
      id: 'kpi_savings_rate',
      title: 'Tỷ lệ Tích lũy Vốn & Tự do Tài chính (Savings Allocation Rate)',
      dimension: 'Tài chính & Tích lũy',
      unit: '%',
      direction: 'increase',
      strategicGoalTitle: 'Tích lũy quỹ khẩn cấp 12 tháng & danh mục tăng trưởng',
      targetBenchmark: 40,
      monthlyData: [
        { month: 'T5/2026', actual: 36, target: 40, unit: '%', note: 'Có khoản chi đột xuất' },
        { month: 'T6/2026', actual: 42, target: 40, unit: '%', note: 'Cắt giảm chi tiêu thừa thãi' },
        { month: 'T7/2026', actual: 45, target: 40, unit: '%', note: 'Dòng tiền thặng dư tốt' },
        { month: 'T8/2026', actual: 40, target: 40, unit: '%', note: 'Đạt đúng cam kết' },
        { month: 'T9/2026', actual: 44, target: 40, unit: '%', note: 'Thu nhập tư vấn bổ sung' },
        { month: 'T10/2026', actual: 46, target: 40, unit: '%', note: 'Vượt mục tiêu 6%' }
      ]
    }
  ]);

  const [selectedKpiId, setSelectedKpiId] = useState<string>('kpi_hit_rate');
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');

  const activeKpi = strategicKpis.find(k => k.id === selectedKpiId) || strategicKpis[0];

  // Calculate executive summary statistics
  const measuredPoints = activeKpi.monthlyData.filter(d => d.actual !== null);
  const latestMeasuredPoint = measuredPoints[measuredPoints.length - 1];
  
  const currentAttainmentRate = latestMeasuredPoint && latestMeasuredPoint.actual !== null
    ? Math.round((latestMeasuredPoint.actual / latestMeasuredPoint.target) * 100)
    : null;

  const currentVariance = latestMeasuredPoint && latestMeasuredPoint.actual !== null
    ? Math.round((latestMeasuredPoint.actual - latestMeasuredPoint.target) * 10) / 10
    : null;

  // Average attainment across all valid months for active KPI
  const avgActual = measuredPoints.length > 0
    ? measuredPoints.reduce((acc, curr) => acc + (curr.actual || 0), 0) / measuredPoints.length
    : 0;
  const avgAttainment = Math.round((avgActual / activeKpi.targetBenchmark) * 100);

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload as MonthlyMetricPoint;
      const actualVal = dataPoint.actual;
      const targetVal = dataPoint.target;
      const hasActual = actualVal !== null;
      const delta = hasActual ? Math.round((actualVal - targetVal) * 10) / 10 : null;

      return (
        <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-800 dark:bg-slate-900 text-xs space-y-1.5 min-w-[190px]">
          <div className="font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-1 flex justify-between items-center">
            <span>{label}</span>
            <span className="text-[10px] text-slate-500 font-normal">{activeKpi.dimension}</span>
          </div>

          <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-600 inline-block" />
              <span>Thực tế (Actual):</span>
            </span>
            <span className="font-mono font-bold text-slate-900 dark:text-slate-100 tabular-nums">
              {hasActual ? `${actualVal} ${dataPoint.unit}` : 'Chưa có số đo'}
            </span>
          </div>

          <div className="flex justify-between items-center text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
              <span>Mục tiêu (Target):</span>
            </span>
            <span className="font-mono tabular-nums">
              {targetVal} {dataPoint.unit}
            </span>
          </div>

          {hasActual && (
            <div className={`flex justify-between items-center pt-1 border-t border-slate-100 dark:border-slate-800 font-semibold ${
              delta! >= 0 ? 'text-teal-700 dark:text-teal-400' : 'text-amber-700 dark:text-amber-400'
            }`}>
              <span>Độ lệch (Variance):</span>
              <span className="font-mono tabular-nums">
                {delta! > 0 ? `+${delta}` : delta} {dataPoint.unit}
              </span>
            </div>
          )}

          {dataPoint.note && (
            <p className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-100 dark:border-slate-800">
              "{dataPoint.note}"
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 transition-colors space-y-6">
      
      {/* 1. Header with Title & Operational Description */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
              <TrendingUp className="h-4 w-4" />
            </span>
            <span className="text-[11px] font-bold tracking-wider uppercase text-teal-800 dark:text-teal-400">
              Command Center · Business Performance Analytics
            </span>
          </div>

          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
            Bảng theo dõi KPI Hàng tháng vs Mục tiêu Chiến lược (Monthly Performance)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-3xl">
            Trực quan hóa xu hướng 6 tháng gần nhất bằng Recharts: Đối chiếu kết quả thực tế với ngưỡng mục tiêu đề ra và phân tích phương sai (Plan-vs-Actual Variance).
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 self-start lg:self-center">
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode('chart')}
              className={`px-3 py-1 rounded transition-colors ${
                viewMode === 'chart'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-slate-100'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Biểu đồ
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-slate-100'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Bảng dữ liệu
            </button>
          </div>
        </div>
      </div>

      {/* 2. Metric Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {strategicKpis.map(kpi => {
          const isSelected = kpi.id === selectedKpiId;
          const points = kpi.monthlyData.filter(d => d.actual !== null);
          const latest = points[points.length - 1];
          const rate = latest && latest.actual !== null 
            ? Math.round((latest.actual / latest.target) * 100) 
            : null;

          return (
            <button
              key={kpi.id}
              type="button"
              onClick={() => setSelectedKpiId(kpi.id)}
              className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-teal-600 bg-teal-50/40 dark:border-teal-500 dark:bg-teal-950/30 ring-1 ring-teal-600 dark:ring-teal-500'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40'
              }`}
            >
              <div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight block">
                  {kpi.dimension}
                </span>
                <h3 className={`text-xs font-bold mt-0.5 line-clamp-1 ${
                  isSelected ? 'text-teal-900 dark:text-teal-200' : 'text-slate-800 dark:text-slate-200'
                }`}>
                  {kpi.title.split('(')[0]}
                </h3>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex items-baseline justify-between text-xs">
                <div>
                  <span className="font-mono font-bold tabular-nums text-slate-900 dark:text-slate-100">
                    {latest?.actual !== null ? `${latest?.actual} ${kpi.unit}` : 'Đang đo'}
                  </span>
                  <span className="text-[10px] text-slate-400 ml-1">/ {kpi.targetBenchmark}</span>
                </div>

                {rate !== null ? (
                  <span className={`text-[11px] font-bold font-mono tabular-nums ${
                    rate >= 100 ? 'text-teal-700 dark:text-teal-400' : 'text-amber-700 dark:text-amber-400'
                  }`}>
                    {rate}%
                  </span>
                ) : (
                  <span className="text-[10px] text-amber-700 dark:text-amber-400">Chưa đo</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Executive Summary KPI Strip for Selected Metric */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        
        {/* Card 1: Strategic Goal Alignment */}
        <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/30">
          <span className="text-[11px] text-slate-500 block">Mục tiêu Chiến lược liên kết</span>
          <span className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1 line-clamp-2 leading-snug">
            {activeKpi.strategicGoalTitle}
          </span>
        </div>

        {/* Card 2: Predefined Target Benchmark */}
        <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/30">
          <span className="text-[11px] text-slate-500 block">Chỉ tiêu Định chuẩn (Target)</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
              {activeKpi.targetBenchmark}
            </span>
            <span className="text-xs text-slate-500 font-mono">{activeKpi.unit} / tháng</span>
          </div>
        </div>

        {/* Card 3: Current Month Attainment */}
        <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/30">
          <span className="text-[11px] text-slate-500 block">Thực tế Tháng gần nhất</span>
          {latestMeasuredPoint && latestMeasuredPoint.actual !== null ? (
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
                {latestMeasuredPoint.actual} <span className="text-xs font-normal text-slate-500">{activeKpi.unit}</span>
              </span>
              <span className={`text-xs font-bold font-mono tabular-nums flex items-center ${
                currentVariance! >= 0 ? 'text-teal-700 dark:text-teal-400' : 'text-amber-700 dark:text-amber-400'
              }`}>
                {currentVariance! >= 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                {currentVariance! >= 0 ? `+${currentVariance}` : currentVariance}
              </span>
            </div>
          ) : (
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 mt-1 block">
              Đang tổng hợp số liệu
            </span>
          )}
        </div>

        {/* Card 4: 6-Month Average Attainment */}
        <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/30">
          <span className="text-[11px] text-slate-500 block">Tỷ lệ Đạt Chuẩn Bình quân (6M)</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-lg font-bold font-mono tabular-nums text-teal-800 dark:text-teal-300">
              {avgAttainment}%
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              ({avgAttainment >= 100 ? 'Vượt chỉ tiêu' : 'Cần tối ưu'})
            </span>
          </div>
        </div>

      </div>

      {/* 4. Main Chart or Table View */}
      {viewMode === 'chart' ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-teal-600 inline-block" />
                <span className="font-medium text-slate-700 dark:text-slate-300">Kết quả Thực tế (Actual)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 bg-slate-400 border-t border-dashed border-slate-500 inline-block" />
                <span className="font-medium text-slate-700 dark:text-slate-300">Mục tiêu Chiến lược (Target Goal)</span>
              </span>
            </div>

            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Đơn vị đo: {activeKpi.unit} · Cột trống thể hiện tháng chưa có số đo
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full pt-3">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={activeKpi.monthlyData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, (dataMax: number) => Math.max(dataMax * 1.15, activeKpi.targetBenchmark * 1.2)]}
                />
                <Tooltip content={<CustomTooltip />} />
                
                {/* Horizontal reference benchmark */}
                <ReferenceLine 
                  y={activeKpi.targetBenchmark} 
                  stroke="#64748b" 
                  strokeDasharray="4 4" 
                  strokeWidth={1.5}
                />

                {/* Actual Performance Bars */}
                <Bar 
                  dataKey="actual" 
                  fill="#0d9488" 
                  radius={[4, 4, 0, 0]} 
                  maxBarSize={48}
                />

                {/* Target Line overlay */}
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#475569" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" 
                  dot={{ r: 3, fill: '#475569' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        /* Table View */
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 border-b border-slate-200 dark:border-slate-700">
                <th className="py-2.5 px-3 font-semibold">Tháng</th>
                <th className="py-2.5 px-3 font-semibold text-right">Thực tế (Actual)</th>
                <th className="py-2.5 px-3 font-semibold text-right">Mục tiêu (Target)</th>
                <th className="py-2.5 px-3 font-semibold text-right">Độ lệch (Variance)</th>
                <th className="py-2.5 px-3 font-semibold text-center">Tỷ lệ Đạt</th>
                <th className="py-2.5 px-3 font-semibold">Ghi chú bối cảnh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono tabular-nums">
              {activeKpi.monthlyData.map(row => {
                const actualVal = row.actual;
                const hasActual = actualVal !== null;
                const delta = actualVal !== null ? Math.round((actualVal - row.target) * 10) / 10 : null;
                const pct = actualVal !== null ? Math.round((actualVal / row.target) * 100) : null;

                return (
                  <tr key={row.month} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-2 px-3 font-semibold font-sans text-slate-900 dark:text-slate-100">
                      {row.month}
                    </td>
                    <td className="py-2 px-3 text-right font-bold text-slate-900 dark:text-slate-100">
                      {hasActual ? `${row.actual} ${row.unit}` : <span className="text-amber-700 dark:text-amber-400 font-sans font-normal text-[11px]">Chưa có số đo</span>}
                    </td>
                    <td className="py-2 px-3 text-right text-slate-500">
                      {row.target} {row.unit}
                    </td>
                    <td className={`py-2 px-3 text-right font-bold ${
                      delta !== null && delta >= 0 ? 'text-teal-700 dark:text-teal-400' : 'text-amber-700 dark:text-amber-400'
                    }`}>
                      {delta !== null ? (delta > 0 ? `+${delta}` : delta) : '—'}
                    </td>
                    <td className="py-2 px-3 text-center">
                      {pct !== null ? (
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          pct >= 100 
                            ? 'bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300' 
                            : 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        }`}>
                          {pct}%
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-2 px-3 font-sans text-slate-500 text-[11px] truncate max-w-xs">
                      {row.note || '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 5. Analytical Interpretation Note (Systems Thinking) */}
      <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2.5">
        <SlidersHorizontal className="h-4 w-4 text-teal-700 dark:text-teal-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-slate-900 dark:text-slate-100">
            Ghi chú Phân tích Hiệu suất (Business Performance Note):
          </span>
          <p className="leading-relaxed">
            Các chỉ số trên được gắn liền với mục tiêu dài hạn thuộc 6 khía cạnh cuộc sống của Alan. Khi tỷ lệ đạt mục tiêu duy trì $\ge 100\%$ trong 3 tháng liên tiếp, hệ thống sẽ đề xuất nâng mức định chuẩn (*Target Benchmark*) trong phiên Weekly Review tiếp theo theo nguyên tắc tăng trưởng theo lãi kép.
          </p>
        </div>
      </div>

    </section>
  );
};
