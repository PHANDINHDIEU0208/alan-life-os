/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Module 4: Reflection & Decision Lab
 * Features:
 * - Weekly Review with the standardized 8-question framework
 * - Decision Log: Assumptions, uncertainty rating, chosen option, review date, actual outcome
 */

import React, { useState } from 'react';
import { useLifeOS } from '../context/LifeOSContext';
import { 
  History, 
  HelpCircle, 
  Save, 
  Plus, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Trash2,
  ChevronRight,
  Brain
} from 'lucide-react';
import { DecisionOption, WeeklyReview } from '../types/lifeos';

type ReflectionTab = 'weekly_review' | 'decision_log';

interface ReflectionDecisionLabProps {
  initialTab?: ReflectionTab;
}

export const ReflectionDecisionLab: React.FC<ReflectionDecisionLabProps> = ({ initialTab = 'weekly_review' }) => {
  const { 
    data, 
    addWeeklyReview, 
    addDecisionLog, 
    updateDecisionLog, 
    deleteDecisionLog,
    addWeeklyPriority
  } = useLifeOS();

  const [activeTab, setActiveTab] = useState<ReflectionTab>(initialTab);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Weekly review form states (the 8 standardized questions)
  const currentWeekNumber = 43;
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [q3, setQ3] = useState('');
  const [q4, setQ4] = useState('');
  const [q5, setQ5] = useState('');
  const [q6, setQ6] = useState('');
  const [q7Action, setQ7Action] = useState<'continue' | 'stop' | 'change'>('continue');
  const [q7Notes, setQ7Notes] = useState('');
  const [q8_1, setQ8_1] = useState('');
  const [q8_2, setQ8_2] = useState('');
  const [q8_3, setQ8_3] = useState('');
  const [reviewSavedSuccess, setReviewSavedSuccess] = useState(false);

  // Decision log form states
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [decQuestion, setDecQuestion] = useState('');
  const [decCriteria, setDecCriteria] = useState('');
  const [decAssumptions, setDecAssumptions] = useState('');
  const [decUncertainty, setDecUncertainty] = useState<'low' | 'medium' | 'high'>('medium');
  const [decOptions, setDecOptions] = useState<DecisionOption[]>([
    { id: '1', title: 'Phương án 1', pros: '', cons: '' },
    { id: '2', title: 'Phương án 2', pros: '', cons: '' }
  ]);
  const [decChosen, setDecChosen] = useState('');
  const [decRationale, setDecRationale] = useState('');
  const [decReviewDate, setDecReviewDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30); // 30 days later
    return d.toISOString().split('T')[0];
  });

  // Review outcome modal for existing decision
  const [reviewingDecisionId, setReviewingDecisionId] = useState<string | null>(null);
  const [actualOutcome, setActualOutcome] = useState('');
  const [lessonsLearned, setLessonsLearned] = useState('');

  const handleSaveWeeklyReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q1.trim()) return;

    const nextPriorities = [q8_1.trim(), q8_2.trim(), q8_3.trim()].filter(Boolean);

    addWeeklyReview({
      weekNumber: currentWeekNumber,
      year: 2026,
      q1_mostImportant: q1.trim(),
      q2_intendedOutcomes: q2.trim(),
      q3_actualResults: q3.trim(),
      q4_valueCreated: q4.trim(),
      q5_incompleteAndCauses: q5.trim(),
      q6_changedAssumptions: q6.trim(),
      q7_pivotAction: q7Action,
      q7_pivotNotes: q7Notes.trim(),
      q8_nextWeekPriorities: nextPriorities,
      linkedGoalIds: data.goals.slice(0, 2).map(g => g.id),
      linkedProjectIds: data.projects.slice(0, 2).map(p => p.id)
    });

    // Optionally update next week's priorities in the system
    nextPriorities.forEach(p => {
      addWeeklyPriority(p);
    });

    setReviewSavedSuccess(true);
    setTimeout(() => setReviewSavedSuccess(false), 3000);
  };

  const handleAddOption = () => {
    const nextIdx = decOptions.length + 1;
    setDecOptions([
      ...decOptions,
      { id: String(Date.now()), title: `Phương án ${nextIdx}`, pros: '', cons: '' }
    ]);
  };

  const handleSaveDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!decQuestion.trim() || !decChosen.trim()) return;

    addDecisionLog({
      question: decQuestion.trim(),
      options: decOptions,
      criteria: decCriteria.trim(),
      assumptions: decAssumptions.trim(),
      uncertaintyLevel: decUncertainty,
      chosenOption: decChosen.trim(),
      rationale: decRationale.trim(),
      reviewDate: decReviewDate,
      status: 'pending_review'
    });

    setShowDecisionModal(false);
    setDecQuestion('');
    setDecCriteria('');
    setDecAssumptions('');
    setDecChosen('');
    setDecRationale('');
  };

  const handleSaveActualOutcome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingDecisionId) return;

    updateDecisionLog(reviewingDecisionId, {
      actualOutcome: actualOutcome.trim(),
      lessonsLearned: lessonsLearned.trim(),
      status: 'reviewed'
    });

    setReviewingDecisionId(null);
    setActualOutcome('');
    setLessonsLearned('');
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* 1. Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-700 dark:text-emerald-400 uppercase">
          <History className="h-4 w-4" />
          <span>Module 4: Khép kín vòng lặp & Phán đoán</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100 mt-1">
          Phản tư & Nhật ký Quyết định (Reflection & Decision Lab)
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-3xl">
          Đánh giá kế hoạch so với thực tế bằng bộ 8 câu hỏi phản tư chuẩn và theo dõi chất lượng các phán đoán có mức độ bất định cao.
        </p>
      </div>

      {/* 2. Interactive Switcher */}
      <div className="flex items-center gap-1.5 p-1 bg-stone-200/60 dark:bg-stone-800/60 rounded-xl overflow-x-auto w-fit">
        <button
          onClick={() => setActiveTab('weekly_review')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'weekly_review'
              ? 'bg-white text-stone-900 shadow-xs dark:bg-stone-900 dark:text-stone-100'
              : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200'
          }`}
        >
          <History className="h-3.5 w-3.5" />
          <span>Weekly Review (8 câu hỏi chuẩn)</span>
        </button>

        <button
          onClick={() => setActiveTab('decision_log')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'decision_log'
              ? 'bg-white text-stone-900 shadow-xs dark:bg-stone-900 dark:text-stone-100'
              : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200'
          }`}
        >
          <Brain className="h-3.5 w-3.5" />
          <span>Nhật ký Quyết định ({data.decisionLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: WEEKLY REVIEW */}
      {activeTab === 'weekly_review' && (
        <div className="space-y-8">
          
          {/* Active Weekly Review Form */}
          <form onSubmit={handleSaveWeeklyReview} className="p-6 md:p-8 rounded-xl border border-stone-200/80 bg-white dark:border-stone-800 dark:bg-stone-900 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800 gap-2">
              <div>
                <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                  Thực hiện Phiên Phản tư Tuần {currentWeekNumber}
                </h2>
                <p className="text-xs text-stone-500">
                  8 câu hỏi bắt buộc giúp bạn nhìn thẳng vào sự thật và điều chỉnh la bàn định hướng
                </p>
              </div>

              {reviewSavedSuccess && (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Đã lưu thành công!</span>
                </span>
              )}
            </div>

            {/* Q1 */}
            <div>
              <label className="block text-xs font-bold text-stone-900 dark:text-stone-100 mb-1">
                1. Điều quan trọng nhất đã diễn ra trong tuần qua là gì?
              </label>
              <textarea
                rows={2}
                value={q1}
                onChange={e => setQ1(e.target.value)}
                placeholder="Một sự kiện, đột phá, hoặc bài học quyết định nhất..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                required
              />
            </div>

            {/* Q2 & Q3 (Plan vs Actual) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-900 dark:text-stone-100 mb-1">
                  2. Dự định ban đầu (Intended Outcomes)
                </label>
                <textarea
                  rows={3}
                  value={q2}
                  onChange={e => setQ2(e.target.value)}
                  placeholder="Tuần này bạn đã định hoàn thành những gì?"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-900 dark:text-stone-100 mb-1">
                  3. Thực tế diễn ra (Actual Results)
                </label>
                <textarea
                  rows={3}
                  value={q3}
                  onChange={e => setQ3(e.target.value)}
                  placeholder="Kết quả đo đạc được trên thực tế là gì?"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                  required
                />
              </div>
            </div>

            {/* Q4 & Q5 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-900 dark:text-stone-100 mb-1">
                  4. Giá trị thặng dư tạo ra (Value Created)
                </label>
                <textarea
                  rows={2}
                  value={q4}
                  onChange={e => setQ4(e.target.value)}
                  placeholder="Hệ thống, sản phẩm hoặc năng lực mới nào được hình thành?"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-900 dark:text-stone-100 mb-1">
                  5. Chưa hoàn thành & Nguyên nhân gốc rễ đã biết (Misses & Causes)
                </label>
                <textarea
                  rows={2}
                  value={q5}
                  onChange={e => setQ5(e.target.value)}
                  placeholder="Những gì còn dang dở và tại sao lại bị tắc nghẽn?"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                />
              </div>
            </div>

            {/* Q6 */}
            <div>
              <label className="block text-xs font-bold text-stone-900 dark:text-stone-100 mb-1">
                6. Những giả định nào đã bị chứng minh là sai hoặc đã thay đổi?
              </label>
              <textarea
                rows={2}
                value={q6}
                onChange={e => setQ6(e.target.value)}
                placeholder="Điều gì trước đây bạn tưởng đúng nhưng thực tế đã phủ nhận?"
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
              />
            </div>

            {/* Q7: Continue, Stop or Pivot */}
            <div className="p-4 rounded-lg bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-700/60 space-y-3">
              <label className="block text-xs font-bold text-stone-900 dark:text-stone-100">
                7. Quyết định chiến lược: Tiếp tục, Dừng lại hay Thay đổi?
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                  <input
                    type="radio"
                    name="pivotAction"
                    value="continue"
                    checked={q7Action === 'continue'}
                    onChange={() => setQ7Action('continue')}
                    className="accent-emerald-700"
                  />
                  <span>Tiếp tục (Continue)</span>
                </label>
                <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer text-rose-700">
                  <input
                    type="radio"
                    name="pivotAction"
                    value="stop"
                    checked={q7Action === 'stop'}
                    onChange={() => setQ7Action('stop')}
                    className="accent-rose-700"
                  />
                  <span>Dừng lại (Stop/Kill)</span>
                </label>
                <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer text-amber-700">
                  <input
                    type="radio"
                    name="pivotAction"
                    value="change"
                    checked={q7Action === 'change'}
                    onChange={() => setQ7Action('change')}
                    className="accent-amber-700"
                  />
                  <span>Thay đổi cách làm (Pivot)</span>
                </label>
              </div>
              <input
                type="text"
                placeholder="Ghi chú lý do cho quyết định trên..."
                value={q7Notes}
                onChange={e => setQ7Notes(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
              />
            </div>

            {/* Q8: 3 Next Week Priorities */}
            <div>
              <label className="block text-xs font-bold text-stone-900 dark:text-stone-100 mb-1">
                8. 3 Ưu tiên then chốt cho tuần tiếp theo (Chỉ 3 mục tiêu!)
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Ưu tiên 1..."
                  value={q8_1}
                  onChange={e => setQ8_1(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                  required
                />
                <input
                  type="text"
                  placeholder="Ưu tiên 2..."
                  value={q8_2}
                  onChange={e => setQ8_2(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                />
                <input
                  type="text"
                  placeholder="Ưu tiên 3..."
                  value={q8_3}
                  onChange={e => setQ8_3(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg flex items-center gap-1.5 shadow-sm"
              >
                <Save className="h-4 w-4" />
                <span>Hoàn tất & Lưu Weekly Review</span>
              </button>
            </div>
          </form>

          {/* Past Weekly Reviews Archive */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Lịch sử các phiên Phản tư trước ({data.weeklyReviews.length})
            </h3>

            {data.weeklyReviews.map(review => (
              <div 
                key={review.id}
                className="p-5 rounded-xl border border-stone-200/80 bg-white dark:border-stone-800 dark:bg-stone-900 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between text-xs pb-2 border-b border-stone-100 dark:border-stone-800">
                  <span className="font-bold text-stone-900 dark:text-stone-100">
                    Tuần {review.weekNumber} / {review.year}
                  </span>
                  <span className="text-stone-500 font-mono">
                    {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>

                <div className="text-xs space-y-2">
                  <div>
                    <span className="font-semibold text-stone-700 dark:text-stone-300">Điểm quan trọng nhất: </span>
                    <span className="text-stone-600 dark:text-stone-400">"{review.q1_mostImportant}"</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-stone-600 dark:text-stone-400">
                    <p><b>Dự định:</b> {review.q2_intendedOutcomes}</p>
                    <p><b>Thực tế:</b> {review.q3_actualResults}</p>
                  </div>

                  <div>
                    <span className="font-semibold text-stone-700 dark:text-stone-300">Hành động chiến lược: </span>
                    <span className="capitalize font-bold text-emerald-800 dark:text-emerald-400">{review.q7_pivotAction}</span>
                    {review.q7_pivotNotes && <span className="ml-2 text-stone-500">({review.q7_pivotNotes})</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 2: DECISION LOG */}
      {activeTab === 'decision_log' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Nhật ký Phán đoán (Decision Log)
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Ghi nhận giả định, mức độ bất định, tiêu chí đánh đổi và hẹn ngày kiểm chứng thực tế
              </p>
            </div>

            <button
              onClick={() => setShowDecisionModal(true)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-700 rounded-lg flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Ghi nhận Quyết định</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {data.decisionLogs.map(dec => {
              const isReviewed = dec.status === 'reviewed';

              return (
                <div 
                  key={dec.id}
                  className="p-5 rounded-xl border border-stone-200/80 bg-white dark:border-stone-800 dark:bg-stone-900 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2 pb-3 border-b border-stone-100 dark:border-stone-800">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded font-bold uppercase ${
                        dec.uncertaintyLevel === 'high' 
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                          : dec.uncertaintyLevel === 'medium'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      }`}>
                        Bất định: {dec.uncertaintyLevel}
                      </span>
                      <span className="text-stone-500 font-mono">Ngày tạo: {new Date(dec.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-stone-500 font-mono">Hẹn xem lại: {dec.reviewDate}</span>
                      <span className={`px-2 py-0.5 rounded font-medium ${
                        isReviewed 
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40' 
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40'
                      }`}>
                        {isReviewed ? 'Đã kiểm chứng' : 'Chờ kiểm chứng'}
                      </span>
                      <button 
                        onClick={() => deleteDecisionLog(dec.id)}
                        className="text-stone-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      {dec.question}
                    </h3>

                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-stone-50 dark:bg-stone-800/40 p-3 rounded-lg">
                      <div>
                        <span className="font-semibold text-emerald-800 dark:text-emerald-400 block mb-0.5">
                          Phương án được chọn:
                        </span>
                        <p className="font-medium text-stone-900 dark:text-stone-100">{dec.chosenOption}</p>
                      </div>

                      <div>
                        <span className="font-semibold text-stone-600 dark:text-stone-400 block mb-0.5">
                          Lý do & Tiêu chí lựa chọn:
                        </span>
                        <p className="text-stone-700 dark:text-stone-300">{dec.rationale}</p>
                      </div>
                    </div>

                    <div className="mt-2 text-xs text-stone-500">
                      <b>Giả định then chốt: </b>{dec.assumptions}
                    </div>

                    {/* Actual outcome if reviewed */}
                    {isReviewed ? (
                      <div className="mt-3 p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 text-xs space-y-1">
                        <div>
                          <span className="font-bold text-emerald-900 dark:text-emerald-300">Kết quả thực tế sau kiểm chứng: </span>
                          <span className="text-stone-800 dark:text-stone-200">{dec.actualOutcome}</span>
                        </div>
                        {dec.lessonsLearned && (
                          <div>
                            <span className="font-bold text-emerald-900 dark:text-emerald-300">Bài học rút ra: </span>
                            <span className="text-stone-800 dark:text-stone-200">{dec.lessonsLearned}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="mt-3 pt-2 flex justify-end">
                        <button
                          onClick={() => {
                            setReviewingDecisionId(dec.id);
                            setActualOutcome('');
                            setLessonsLearned('');
                          }}
                          className="px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 rounded transition-colors"
                        >
                          Cập nhật Kết quả thực tế & Bài học →
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modal to create Decision */}
          {showDecisionModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 backdrop-blur-xs p-4">
              <form 
                onSubmit={handleSaveDecision}
                className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-6 shadow-xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    Ghi nhận Quyết định mới (Decision Log)
                  </h3>
                  <button type="button" onClick={() => setShowDecisionModal(false)}>✕</button>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">Câu hỏi quyết định (Decision Question)</label>
                  <input
                    type="text"
                    value={decQuestion}
                    onChange={e => setDecQuestion(e.target.value)}
                    placeholder="Ví dụ: Có nên đầu tư 2 tháng để refactor kiến trúc không?"
                    className="w-full px-3 py-2 text-sm rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">Mức độ bất định (Uncertainty)</label>
                    <select
                      value={decUncertainty}
                      onChange={e => setDecUncertainty(e.target.value as any)}
                      className="w-full px-3 py-1.5 text-xs rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                    >
                      <option value="low">Thấp (Low)</option>
                      <option value="medium">Trung bình (Medium)</option>
                      <option value="high">Cao (High)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1">Ngày hẹn xem lại kết quả</label>
                    <input
                      type="date"
                      value={decReviewDate}
                      onChange={e => setDecReviewDate(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">Tiêu chí đánh giá & Giả định then chốt</label>
                  <textarea
                    rows={2}
                    value={decAssumptions}
                    onChange={e => setDecAssumptions(e.target.value)}
                    placeholder="Những giả định bạn đang dựa vào để ra quyết định..."
                    className="w-full px-3 py-1.5 text-xs rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">Phương án được chọn (Chosen Option)</label>
                  <input
                    type="text"
                    value={decChosen}
                    onChange={e => setDecChosen(e.target.value)}
                    placeholder="Tên phương án bạn quyết định hành động..."
                    className="w-full px-3 py-2 text-sm rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">Lý do chọn (Rationale & Trade-offs)</label>
                  <textarea
                    rows={2}
                    value={decRationale}
                    onChange={e => setDecRationale(e.target.value)}
                    placeholder="Vì sao bạn chấp nhận sự đánh đổi này?"
                    className="w-full px-3 py-1.5 text-xs rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowDecisionModal(false)} className="px-3 py-1 text-xs">Hủy</button>
                  <button type="submit" className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-800 rounded">Lưu quyết định</button>
                </div>
              </form>
            </div>
          )}

          {/* Modal to update actual outcome */}
          {reviewingDecisionId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 backdrop-blur-xs p-4">
              <form 
                onSubmit={handleSaveActualOutcome}
                className="w-full max-w-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-lg space-y-4"
              >
                <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2">
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    Cập nhật Kết quả thực tế & Bài học
                  </h3>
                  <button type="button" onClick={() => setReviewingDecisionId(null)}>✕</button>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">Kết quả thực tế diễn ra (Actual Outcome)</label>
                  <textarea
                    rows={3}
                    value={actualOutcome}
                    onChange={e => setActualOutcome(e.target.value)}
                    placeholder="Quyết định trước đây mang lại kết quả như thế nào?"
                    className="w-full px-3 py-2 text-xs rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">Bài học rút ra cho tương lai (Lessons Learned)</label>
                  <textarea
                    rows={2}
                    value={lessonsLearned}
                    onChange={e => setLessonsLearned(e.target.value)}
                    placeholder="Mô hình tinh thần hay giả định nào cần được hiệu chỉnh?"
                    className="w-full px-3 py-2 text-xs rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setReviewingDecisionId(null)} className="px-3 py-1 text-xs">Hủy</button>
                  <button type="submit" className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-800 rounded">Lưu kiểm chứng</button>
                </div>
              </form>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
