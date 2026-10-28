/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Gemini AI Copilot Modal
 * Strictly implements the 4-part structure from the specification:
 * 1. Quan sát đã xác minh (Verified Observations)
 * 2. Diễn giải khả dĩ (Possible Interpretations)
 * 3. Điều chưa biết / Điểm mù (Unknowns & Missing Data)
 * 4. Bước tiếp theo đề xuất (Recommended Actions)
 */

import React, { useState } from 'react';
import { useLifeOS } from '../context/LifeOSContext';
import { generateCopilotInsights } from '../services/geminiService';
import { CopilotInsightResponse } from '../types/lifeos';
import { 
  Sparkles, 
  X, 
  CheckCircle2, 
  HelpCircle, 
  AlertTriangle, 
  ArrowRight, 
  Loader2, 
  Copy, 
  Check, 
  Brain, 
  TrendingUp,
  MessageSquare
} from 'lucide-react';

interface CopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CopilotModal: React.FC<CopilotModalProps> = ({ isOpen, onClose }) => {
  const { data } = useLifeOS();
  const [mode, setMode] = useState<'weekly_summary' | 'plan_vs_actual' | 'decision_analysis' | 'reflection_questions' | 'general'>('weekly_summary');
  const [customQuery, setCustomQuery] = useState('');
  const [selectedDecisionId, setSelectedDecisionId] = useState<string>(data.decisionLogs[0]?.id || '');
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<CopilotInsightResponse | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const res = await generateCopilotInsights(data, {
        mode,
        customQuery: customQuery.trim() || undefined,
        targetDecisionId: mode === 'decision_analysis' ? selectedDecisionId : undefined
      });
      setInsights(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!insights) return;
    const text = `LIFE OS COPILOT ANALYSIS:
${insights.summary}

1. QUAN SÁT ĐÃ XÁC MINH:
${insights.verifiedObservations.map(o => `- ${o}`).join('\n')}

2. DIỄN GIẢI KHẢ DĨ:
${insights.possibleInterpretations.map(i => `- ${i}`).join('\n')}

3. ĐIỀU CHƯA BIẾT & ĐIỂM MÙ:
${insights.unknownsAndBlindspots.map(u => `- ${u}`).join('\n')}

4. BƯỚC TIẾP THEO ĐỀ XUẤT:
${insights.suggestedActions.map(a => `- ${a}`).join('\n')}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-3xl max-h-[90vh] flex flex-col bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Gemini Copilot – Trợ lý Phản tư & Quyết định
              </h2>
              <p className="text-xs text-stone-500">
                Tuân thủ quy chuẩn 4 phần: Dữ kiện xác minh · Diễn giải · Điểm mù · Đề xuất hành động
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Mode Selector */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
              Chọn chế độ phân tích:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setMode('weekly_summary')}
                className={`p-2.5 text-xs font-semibold rounded-lg border text-left transition-colors ${
                  mode === 'weekly_summary'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-200'
                    : 'border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>Tóm tắt tuần</span>
                </div>
                <span className="text-[10px] font-normal opacity-75 block">Plan-vs-Actual</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('decision_analysis')}
                className={`p-2.5 text-xs font-semibold rounded-lg border text-left transition-colors ${
                  mode === 'decision_analysis'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-200'
                    : 'border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Brain className="h-3.5 w-3.5" />
                  <span>Đánh giá Quyết định</span>
                </div>
                <span className="text-[10px] font-normal opacity-75 block">Giả định & Đánh đổi</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('reflection_questions')}
                className={`p-2.5 text-xs font-semibold rounded-lg border text-left transition-colors ${
                  mode === 'reflection_questions'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-200'
                    : 'border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>Câu hỏi Phản tư</span>
                </div>
                <span className="text-[10px] font-normal opacity-75 block">Chất vấn ngầm định</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('general')}
                className={`p-2.5 text-xs font-semibold rounded-lg border text-left transition-colors ${
                  mode === 'general'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-200'
                    : 'border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>Tùy chỉnh</span>
                </div>
                <span className="text-[10px] font-normal opacity-75 block">Câu hỏi tự do</span>
              </button>
            </div>
          </div>

          {/* Conditional inputs */}
          {mode === 'decision_analysis' && (
            <div>
              <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                Chọn quyết định cần AI phản biện:
              </label>
              <select
                value={selectedDecisionId}
                onChange={e => setSelectedDecisionId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
              >
                {data.decisionLogs.map(dec => (
                  <option key={dec.id} value={dec.id}>
                    {dec.question} ({dec.uncertaintyLevel})
                  </option>
                ))}
              </select>
            </div>
          )}

          {mode === 'general' && (
            <div>
              <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                Yêu cầu cụ thể:
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Phân tích xem các chỉ số KPI hiện tại có quá nhiều không?"
                value={customQuery}
                onChange={e => setCustomQuery(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
              />
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-700 rounded-lg flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Đang tổng hợp dữ liệu...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Tạo phân tích Copilot</span>
                </>
              )}
            </button>
          </div>

          {/* Insights Output */}
          {insights && (
            <div className="mt-6 space-y-6 pt-6 border-t border-stone-200 dark:border-stone-800">
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                  Kết quả phân tích từ Gemini
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs text-stone-600 dark:text-stone-400 hover:underline"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Đã sao chép' : 'Sao chép báo cáo'}</span>
                </button>
              </div>

              {/* Summary */}
              <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-700/80 text-xs text-stone-800 dark:text-stone-200 font-medium leading-relaxed">
                {insights.summary}
              </div>

              {/* Strict 4-Part Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. Verified Observations */}
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 dark:border-emerald-900 dark:bg-emerald-950/20 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>1. Quan sát đã xác minh (Facts)</span>
                  </div>
                  <ul className="text-xs text-stone-700 dark:text-stone-300 space-y-1.5 list-disc list-inside">
                    {insights.verifiedObservations.map((obs, idx) => (
                      <li key={idx} className="leading-relaxed">{obs}</li>
                    ))}
                  </ul>
                </div>

                {/* 2. Possible Interpretations */}
                <div className="p-4 rounded-xl border border-sky-200 bg-sky-50/40 dark:border-sky-900 dark:bg-sky-950/20 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-sky-800 dark:text-sky-300">
                    <Brain className="h-4 w-4" />
                    <span>2. Diễn giải khả dĩ (Interpretations)</span>
                  </div>
                  <ul className="text-xs text-stone-700 dark:text-stone-300 space-y-1.5 list-disc list-inside">
                    {insights.possibleInterpretations.map((item, idx) => (
                      <li key={idx} className="leading-relaxed">{item}</li>
                    ))}
                  </ul>
                </div>

                {/* 3. Unknowns & Blindspots */}
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 dark:border-amber-900 dark:bg-amber-950/20 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
                    <AlertTriangle className="h-4 w-4" />
                    <span>3. Điều chưa biết & Điểm mù (Unknowns)</span>
                  </div>
                  <ul className="text-xs text-stone-700 dark:text-stone-300 space-y-1.5 list-disc list-inside">
                    {insights.unknownsAndBlindspots.map((item, idx) => (
                      <li key={idx} className="leading-relaxed">{item}</li>
                    ))}
                  </ul>
                </div>

                {/* 4. Recommended Actions */}
                <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 dark:border-purple-900 dark:bg-purple-950/20 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-800 dark:text-purple-300">
                    <ArrowRight className="h-4 w-4" />
                    <span>4. Bước tiếp theo đề xuất (Actions)</span>
                  </div>
                  <ul className="text-xs text-stone-700 dark:text-stone-300 space-y-1.5 list-disc list-inside">
                    {insights.suggestedActions.map((item, idx) => (
                      <li key={idx} className="leading-relaxed">{item}</li>
                    ))}
                  </ul>
                  <span className="text-[10px] text-stone-400 block pt-1 italic">
                    * Yêu cầu bạn xác nhận trước khi áp dụng vào kế hoạch.
                  </span>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
