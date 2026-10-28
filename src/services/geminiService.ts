/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Gemini AI Copilot Service for Life OS
 * Enforces the 4-part strict response schema:
 * 1. Quan sát đã xác minh (Verified Observations)
 * 2. Diễn giải khả dĩ (Possible Interpretations)
 * 3. Điều chưa biết / Điểm mù (Unknowns & Missing Data)
 * 4. Bước tiếp theo đề xuất (Recommended Actions)
 */

import { LifeOSData, CopilotInsightResponse } from '../types/lifeos';

export interface CopilotPromptPayload {
  mode: 'weekly_summary' | 'plan_vs_actual' | 'decision_analysis' | 'reflection_questions' | 'general';
  customQuery?: string;
  targetDecisionId?: string;
}

export async function generateCopilotInsights(
  data: LifeOSData,
  payload: CopilotPromptPayload
): Promise<CopilotInsightResponse> {
  // Try server endpoint first
  try {
    const response = await fetch('/api/copilot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        payload,
        context: {
          northStar: data.northStar,
          weeklyPriorities: data.weeklyPriorities,
          goals: data.goals.map(g => ({ title: g.title, progress: g.progressPercent, status: g.status })),
          projects: data.projects.map(p => ({
            title: p.title,
            status: p.status,
            strategicBet: p.strategicBet,
            taskProgress: `${p.tasks.filter(t => t.completed).length}/${p.tasks.length}`
          })),
          kpis: data.kpis.map(k => ({
            title: k.title,
            current: k.hasMeasurement ? `${k.currentValue} ${k.unit}` : 'CHƯA CÓ DỮ LIỆU ĐO',
            target: `${k.targetValue} ${k.unit}`,
            direction: k.direction
          })),
          recentReview: data.weeklyReviews[0] || null,
          targetDecision: payload.targetDecisionId 
            ? data.decisionLogs.find(d => d.id === payload.targetDecisionId) 
            : null
        }
      })
    });

    if (response.ok) {
      const result = await response.json();
      if (result && Array.isArray(result.verifiedObservations)) {
        return result;
      }
    }
  } catch (err) {
    console.warn("Server Copilot route unavailable, using local analytical synthesis engine:", err);
  }

  // Graceful analytical synthesis engine based on the exact same Life OS prompt rules
  return synthesizeLocalInsights(data, payload);
}

function synthesizeLocalInsights(data: LifeOSData, payload: CopilotPromptPayload): CopilotInsightResponse {
  const verifiedObservations: string[] = [];
  const possibleInterpretations: string[] = [];
  const unknownsAndBlindspots: string[] = [];
  const suggestedActions: string[] = [];

  // 1. Observations from actual recorded facts
  const completedPriorities = data.weeklyPriorities.filter(p => p.completed).length;
  const totalPriorities = data.weeklyPriorities.length;
  verifiedObservations.push(`Tuần hiện tại đã ghi nhận ${completedPriorities}/${totalPriorities} ưu tiên then chốt hoàn thành.`);

  const unmeasuredKpis = data.kpis.filter(k => !k.hasMeasurement);
  const measuredKpis = data.kpis.filter(k => k.hasMeasurement);
  if (unmeasuredKpis.length > 0) {
    verifiedObservations.push(`Có ${unmeasuredKpis.length} chỉ số KPI đang ở trạng thái "Chưa có số đo" (${unmeasuredKpis.map(k => k.title).join(', ')}).`);
  }
  if (measuredKpis.length > 0) {
    verifiedObservations.push(`Đã ghi nhận số liệu thực tế cho ${measuredKpis.length} KPI: ${measuredKpis.map(k => `${k.title} = ${k.currentValue} ${k.unit}`).join('; ')}.`);
  }

  const activeProjects = data.projects.filter(p => p.status === 'in_progress');
  const alphaProjects = data.projects.filter(p => p.strategicBet === 'alpha');
  verifiedObservations.push(`Có ${activeProjects.length} dự án đang triển khai (${alphaProjects.length} dự án xếp loại cược Alpha).`);

  if (payload.targetDecisionId) {
    const dec = data.decisionLogs.find(d => d.id === payload.targetDecisionId);
    if (dec) {
      verifiedObservations.push(`Đang phân tích quyết định: "${dec.question}" - Phương án chọn: "${dec.chosenOption}" (Mức độ bất định: ${dec.uncertaintyLevel}).`);
    }
  }

  // 2. Possible Interpretations (Plan-vs-Actual)
  if (totalPriorities > 0 && completedPriorities / totalPriorities >= 0.66) {
    possibleInterpretations.push("Tỷ lệ bám sát kế hoạch tuần ở mức cao. Năng lượng tập trung đang được phân bổ đúng cho các cam kết trọng tâm.");
  } else {
    possibleInterpretations.push("Có sự phân tán giữa danh sách ưu tiên đã cam kết và thời gian thực thi thực tế trong tuần.");
  }

  if (unmeasuredKpis.length > 0) {
    possibleInterpretations.push("Việc thiếu dữ liệu đo lường ở một số KPI có thể do chu kỳ đo chưa tới hoặc chi phí ghi nhận hàng ngày còn quá cao.");
  }

  // 3. Unknowns & Blindspots
  if (unmeasuredKpis.length > 0) {
    unknownsAndBlindspots.push(`Chưa có số liệu thực tế cho: ${unmeasuredKpis.map(k => k.title).join(', ')}. Cần tránh giả định số liệu là 0.`);
  }
  const pendingDecisions = data.decisionLogs.filter(d => d.status === 'pending_review');
  if (pendingDecisions.length > 0) {
    unknownsAndBlindspots.push(`Có ${pendingDecisions.length} quyết định quan trọng chưa đến hạn hoặc chưa được kiểm chứng kết quả thực tế.`);
  }
  unknownsAndBlindspots.push("Mức độ tiêu hao năng lượng tinh thần và các biến số ngoại cảnh bất ngờ chưa được lượng hóa chi tiết.");

  // 4. Recommended Actions (Requires User Confirmation)
  if (unmeasuredKpis.length > 0) {
    suggestedActions.push(`Cập nhật số đo tối thiểu cho KPI "${unmeasuredKpis[0].title}" hoặc chuyển tần suất sang hàng tháng nếu khó đo hàng tuần.`);
  }
  suggestedActions.push("Duy trì 3 ưu tiên tuần tiếp theo gắn chặt với mục tiêu North Star: " + data.northStar.coreMotto);
  suggestedActions.push("Thực hiện phiên Weekly Review khép vòng phản hồi 8 câu hỏi vào cuối tuần.");

  let summary = `Tổng quan Copilot: Hệ điều hành Life OS đang vận hành ổn định với ${data.goals.length} mục tiêu dài hạn và ${data.projects.length} dự án. Vòng phản hồi Plan-vs-Actual cần tiếp tục duy trì dữ liệu trung thực.`;
  if (payload.mode === 'decision_analysis') {
    summary = `Phân tích Quyết định: Đánh giá dựa trên tiêu chí khách quan và giả định đã nêu. Chú ý theo dõi ngày kiểm chứng thực tế.`;
  }

  return {
    verifiedObservations,
    possibleInterpretations,
    unknownsAndBlindspots,
    suggestedActions,
    summary
  };
}
