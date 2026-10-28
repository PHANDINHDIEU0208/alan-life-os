/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Life OS Blueprint & Implementation Context View
 * Faithfully embodies the uploaded document:
 * Life_OS___Hu_o__ng_da__n_xa_y_du__ng_tu__ng_bu_o__c_21c82ec7.html
 */

import React, { useState } from 'react';
import { useLifeOS } from '../context/LifeOSContext';
import { 
  LIFE_OS_BLUEPRINT_PHASES, 
  DEFINITION_OF_DONE_V1, 
  RISKS_AND_MITIGATIONS, 
  SUCCESS_EVALUATION_QUESTIONS,
  ROADMAP_MODULES
} from '../data/lifeOsBlueprint';
import { 
  BookOpen, 
  CheckSquare, 
  Square, 
  Copy, 
  Check, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Layers,
  ArrowRight
} from 'lucide-react';

export const BlueprintView: React.FC = () => {
  const { blueprintChecklist, toggleBlueprintItem, setActiveTab } = useLifeOS();
  const [copiedPromptIdx, setCopiedPromptIdx] = useState<number | null>(null);
  const [expandedPrompts, setExpandedPrompts] = useState<Record<number, boolean>>({
    0: false,
    1: true,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false
  });

  // Calculate total items and completed items
  let totalTasks = 0;
  let completedTasks = 0;

  LIFE_OS_BLUEPRINT_PHASES.forEach((phase, pIdx) => {
    phase.tasks.forEach((_, tIdx) => {
      totalTasks++;
      if (blueprintChecklist[`s${pIdx}_${tIdx}`]) completedTasks++;
    });
    phase.doneCriteria.forEach((_, cIdx) => {
      totalTasks++;
      if (blueprintChecklist[`c${pIdx}_${cIdx}`]) completedTasks++;
    });
  });

  DEFINITION_OF_DONE_V1.forEach((_, dIdx) => {
    totalTasks++;
    if (blueprintChecklist[`dod_${dIdx}`]) completedTasks++;
  });

  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleCopyPrompt = (text: string, idx: number) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedPromptIdx(idx);
      setTimeout(() => setCopiedPromptIdx(null), 2000);
    }
  };

  const togglePromptExpand = (idx: number) => {
    setExpandedPrompts(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <div className="space-y-10 pb-16">
      
      {/* 1. Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-700 dark:text-emerald-400 uppercase">
          <BookOpen className="h-4 w-4" />
          <span>Tài liệu Bối cảnh & Lộ trình thực thi</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100 mt-1">
          Xây dựng Life OS từng bước (Blueprint & Context)
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-3xl">
          Tài liệu kiến trúc chuẩn hóa: Hướng dẫn biến tài liệu mô tả Life OS thành ứng dụng chạy được với React, TypeScript, Firebase và Gemini theo lộ trình 30 ngày.
        </p>
      </div>

      {/* 2. Progress Tracker Card */}
      <section className="p-6 rounded-2xl border border-emerald-200/80 bg-emerald-50/50 dark:border-emerald-950 dark:bg-emerald-950/20 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
              Tiến độ xây dựng & Kiểm toán
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-mono tabular-nums text-emerald-950 dark:text-emerald-100">
                {progressPercent}%
              </span>
              <span className="text-xs text-emerald-800 dark:text-emerald-300">
                ({completedTasks} / {totalTasks} mục đã hoàn thành)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('command')}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-700 rounded-lg flex items-center gap-1 shadow-xs"
            >
              <span>Vào Command Center</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Bar */}
        <div className="w-full bg-emerald-200/60 dark:bg-emerald-900/40 h-2.5 rounded-full overflow-hidden mt-4">
          <div 
            className="bg-emerald-700 dark:bg-emerald-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </section>

      {/* 3. Core Philosophy & Rules Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl border border-stone-200/80 bg-white dark:border-stone-800 dark:bg-stone-900 shadow-xs">
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-2">
            Phạm vi MVP v1.0: Chỉ 4 module cốt lõi
          </h3>
          <ol className="text-xs text-stone-600 dark:text-stone-400 space-y-1.5 list-decimal list-inside leading-relaxed">
            <li><b>Life Command Center:</b> Bảng điều khiển tối cao, nhịp đập chỉ số và 3 ưu tiên tuần.</li>
            <li><b>Strategy & Identity:</b> 5 nguyên tắc, căn tính cá nhân, North Star và 6 chiều cuộc sống.</li>
            <li><b>Execution & KPI Engine:</b> Mục tiêu, dự án Strategic Bets, KPI định nghĩa rõ và thói quen.</li>
            <li><b>Reflection & Decision Lab:</b> Weekly Review 8 câu hỏi chuẩn và nhật ký phán đoán.</li>
          </ol>
          <p className="text-[11px] text-stone-500 mt-3 pt-2 border-t border-stone-100 dark:border-stone-800 italic">
            Knowledge, Finance, Career, Writing, Learning chỉ nằm ở roadmap (v2, v3), không giả lập tính năng khi chưa sẵn sàng.
          </p>
        </div>

        <div className="p-5 rounded-xl border border-stone-200/80 bg-white dark:border-stone-800 dark:bg-stone-900 shadow-xs">
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-2">
            Quy tắc làm việc với AI Coding & Quản lý Hệ thống
          </h3>
          <ul className="text-xs text-stone-600 dark:text-stone-400 space-y-1.5 list-disc list-inside leading-relaxed">
            <li>Mỗi prompt chỉ một mục tiêu chính; yêu cầu AI đọc code hiện tại trước khi sửa.</li>
            <li>Không chấp nhận sửa lỗi bằng cách xóa test hoặc hardcode kết quả mong muốn.</li>
            <li>Thiếu số đo KPI phải hiển thị là "Chưa có dữ liệu", tuyệt đối không được gán bằng 0.</li>
            <li>Git commit trước mỗi thay đổi lớn; lỗi phức tạp phải giải thích nguyên nhân trước khi sửa.</li>
            <li>Chỉ đo những gì giúp ra quyết định; không biến Life OS thành gánh nặng ghi chép.</li>
          </ul>
        </div>
      </div>

      {/* 4. 8 Phases from the HTML Document */}
      <section className="space-y-6">
        <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
          8 Giai đoạn triển khai chi tiết
        </h2>

        <div className="space-y-4">
          {LIFE_OS_BLUEPRINT_PHASES.map((phase, pIdx) => {
            const isPromptExpanded = expandedPrompts[pIdx];

            return (
              <div 
                key={phase.title}
                className="rounded-xl border border-stone-200/80 bg-white dark:border-stone-800 dark:bg-stone-900 shadow-xs overflow-hidden"
              >
                <header className="p-5 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/20">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
                      {phase.timeframe}
                    </span>
                    <span className="text-xs text-stone-500 font-mono">Giai đoạn {pIdx}</span>
                  </div>

                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mt-2">
                    Bước {pIdx}. {phase.title}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                    {phase.goal}
                  </p>
                </header>

                <div className="p-5 space-y-4">
                  {/* Tasks list */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                      Việc cần làm:
                    </h4>
                    <div className="space-y-2">
                      {phase.tasks.map((task, tIdx) => {
                        const key = `s${pIdx}_${tIdx}`;
                        const isDone = !!blueprintChecklist[key];

                        return (
                          <div 
                            key={tIdx}
                            onClick={() => toggleBlueprintItem(key)}
                            className="flex items-start gap-2.5 text-xs cursor-pointer group"
                          >
                            <button type="button" className="mt-0.5 text-emerald-700 dark:text-emerald-400 shrink-0">
                              {isDone ? (
                                <CheckSquare className="h-4 w-4" />
                              ) : (
                                <Square className="h-4 w-4 text-stone-400 group-hover:text-stone-600" />
                              )}
                            </button>
                            <span className={isDone ? 'line-through text-stone-400' : 'text-stone-800 dark:text-stone-200'}>
                              {task}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Prompt Box */}
                  {phase.prompt && (
                    <div className="rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/40 overflow-hidden">
                      <div className="flex items-center justify-between px-3 py-2 border-b border-stone-200 dark:border-stone-700">
                        <button
                          type="button"
                          onClick={() => togglePromptExpand(pIdx)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 dark:text-stone-300"
                        >
                          {isPromptExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                          <span>Prompt {pIdx} (bấm để xem & sao chép)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCopyPrompt(phase.prompt!, pIdx)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-100/70 hover:bg-emerald-100 dark:bg-emerald-950/60 rounded transition-colors"
                        >
                          {copiedPromptIdx === pIdx ? (
                            <>
                              <Check className="h-3 w-3" />
                              <span>Đã chép</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>Sao chép</span>
                            </>
                          )}
                        </button>
                      </div>

                      {isPromptExpanded && (
                        <pre className="p-3 text-[11px] font-mono leading-relaxed text-stone-800 dark:text-stone-200 overflow-x-auto whitespace-pre-wrap bg-stone-100/60 dark:bg-stone-900/80">
                          {phase.prompt}
                        </pre>
                      )}
                    </div>
                  )}

                  {/* Done Criteria */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 mb-2">
                      Tiêu chí Đạt khi (Acceptance Criteria):
                    </h4>
                    <div className="space-y-1.5">
                      {phase.doneCriteria.map((crit, cIdx) => {
                        const key = `c${pIdx}_${cIdx}`;
                        const isDone = !!blueprintChecklist[key];

                        return (
                          <div 
                            key={cIdx}
                            onClick={() => toggleBlueprintItem(key)}
                            className="flex items-start gap-2.5 text-xs cursor-pointer group"
                          >
                            <button type="button" className="mt-0.5 text-emerald-700 dark:text-emerald-400 shrink-0">
                              {isDone ? (
                                <CheckSquare className="h-4 w-4" />
                              ) : (
                                <Square className="h-4 w-4 text-stone-400 group-hover:text-stone-600" />
                              )}
                            </button>
                            <span className={isDone ? 'line-through text-stone-400' : 'text-stone-700 dark:text-stone-300'}>
                              {crit}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Warning Note if exists */}
                  {phase.warningNote && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-300">
                      <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{phase.warningNote}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Definition of Done v1.0 Checklist */}
      <section className="p-6 rounded-xl border border-stone-200/80 bg-white dark:border-stone-800 dark:bg-stone-900 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
            Definition of Done v1.0 (10 Tiêu chuẩn Nghiệm thu Hoàn tất)
          </h2>
          <p className="text-xs text-stone-500">
            Đánh dấu khi từng tiêu chí đã được xác thực thực tế trong ứng dụng
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {DEFINITION_OF_DONE_V1.map((dod, idx) => {
            const key = `dod_${idx}`;
            const isDone = !!blueprintChecklist[key];

            return (
              <div
                key={idx}
                onClick={() => toggleBlueprintItem(key)}
                className={`p-3 rounded-lg border text-xs cursor-pointer flex items-start gap-2.5 transition-colors ${
                  isDone 
                    ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-950 dark:bg-emerald-950/20 text-stone-500 line-through' 
                    : 'border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200'
                }`}
              >
                <button type="button" className="mt-0.5 text-emerald-700 dark:text-emerald-400 shrink-0">
                  {isDone ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4 text-stone-400" />}
                </button>
                <span className="font-medium leading-relaxed">{dod}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Risks and Mitigations Table */}
      <section className="p-6 rounded-xl border border-stone-200/80 bg-white dark:border-stone-800 dark:bg-stone-900 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
            Bảng Quản trị Rủi ro & Biện pháp kiểm soát
          </h2>
          <p className="text-xs text-stone-500">
            8 rủi ro phổ biến khi xây dựng hệ điều hành cuộc sống và cách phòng ngừa triệt để
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-700 text-stone-500">
                <th className="py-2.5 pr-4 font-bold uppercase tracking-wider">Rủi ro tiềm ẩn</th>
                <th className="py-2.5 pl-4 font-bold uppercase tracking-wider">Biện pháp phòng ngừa chuẩn</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {RISKS_AND_MITIGATIONS.map((item, idx) => (
                <tr key={idx} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30">
                  <td className="py-2.5 pr-4 font-semibold text-rose-800 dark:text-rose-400 align-top">
                    {item.risk}
                  </td>
                  <td className="py-2.5 pl-4 text-stone-700 dark:text-stone-300 align-top">
                    {item.mitigation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 7. Success Evaluation Questions & Roadmap */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 6 Questions */}
        <div className="p-6 rounded-xl border border-stone-200/80 bg-white dark:border-stone-800 dark:bg-stone-900 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
            6 Câu hỏi Đánh giá Thành công
          </h3>
          <p className="text-xs text-stone-500">
            Đánh giá thành công bằng chất lượng câu hỏi, không bằng số lượng tính năng:
          </p>
          <div className="space-y-2 pt-1">
            {SUCCESS_EVALUATION_QUESTIONS.map((q, idx) => (
              <p key={idx} className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
                {q}
              </p>
            ))}
          </div>
        </div>

        {/* Roadmap */}
        <div className="p-6 rounded-xl border border-stone-200/80 bg-white dark:border-stone-800 dark:bg-stone-900 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
            Lộ trình Phát triển sau v1.0
          </h3>
          <p className="text-xs text-stone-500">
            Mở rộng tuần tự theo mức độ trưởng thành của hệ thống:
          </p>
          <div className="space-y-3 pt-1">
            {ROADMAP_MODULES.map(m => (
              <div key={m.version} className="text-xs border-l-2 border-emerald-600 pl-3">
                <span className="font-bold text-stone-900 dark:text-stone-100 block">
                  {m.version}: {m.title}
                </span>
                <span className="text-stone-500 dark:text-stone-400 mt-0.5 block">
                  {m.desc}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
