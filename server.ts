/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Express Server for Life OS with Gemini AI Copilot Integration
 */

import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Copilot endpoint with strict 4-part structure
app.post('/api/copilot', async (req, res) => {
  try {
    const { payload, context } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(503).json({
        error: "GEMINI_API_KEY not configured in environment.",
        useFallback: true
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `Bạn là Trợ lý Cá nhân AI Copilot cho hệ điều hành cá nhân (Life OS), tuân thủ nghiêm ngặt các nguyên tắc sau:
1. KHÔNG BAO GIỜ bịa đặt số liệu hoặc giả định số đo thiếu là 0.
2. KHÔNG chẩn đoán tâm lý hoặc đưa ra kết luận thiếu căn cứ.
3. BẮT BUỘC trả về định dạng JSON thuần túy gồm đúng 4 phần sau:
{
  "summary": "Tóm tắt ngắn gọn 1-2 câu",
  "verifiedObservations": ["Danh sách các quan sát thực tế đã xác minh từ dữ liệu được cung cấp"],
  "possibleInterpretations": ["Diễn giải khả dĩ về khoảng cách giữa kế hoạch và thực tế"],
  "unknownsAndBlindspots": ["Các dữ liệu còn thiếu, câu hỏi chưa có lời đáp, điểm mù tiềm ẩn"],
  "suggestedActions": ["Các bước hành động đề xuất cụ thể (cần người dùng phê duyệt trước khi áp dụng)"]
}
`;

    const promptText = `Bối cảnh Life OS hiện tại:
- North Star: ${JSON.stringify(context.northStar || {})}
- Ưu tiên tuần: ${JSON.stringify(context.weeklyPriorities || [])}
- Mục tiêu: ${JSON.stringify(context.goals || [])}
- Dự án: ${JSON.stringify(context.projects || [])}
- Chỉ số KPI: ${JSON.stringify(context.kpis || [])}
- Đánh giá gần nhất: ${JSON.stringify(context.recentReview || {})}
- Yêu cầu phân tích (${payload.mode}): ${payload.customQuery || 'Tổng hợp tình trạng vận hành và phản tư tuần.'}

Hãy phân tích và trả về đúng định dạng JSON 4 phần.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: 'application/json'
      }
    });

    const text = response.text || "{}";
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    return res.status(500).json({ error: error.message || "Failed to generate Copilot insights" });
  }
});

// Vite middleware in development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Life OS server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
