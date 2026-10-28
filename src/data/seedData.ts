/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Realistic Seed Data for Life OS
 * Grounded in the 4 core modules of Life OS v1.0
 */

import { LifeOSData } from '../types/lifeos';

const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const twoDaysAgo = new Date(Date.now() - 172800000).toISOString().split('T')[0];

export const INITIAL_LIFE_OS_DATA: LifeOSData = {
  version: "1.0.0",
  lastUpdated: new Date().toISOString(),
  
  northStar: {
    purpose: "Xây dựng các giải pháp kỹ thuật và hệ thống có giá trị thực chất, sống trung thực với các nguyên tắc nội tại và phụng sự cộng đồng.",
    vision: "Trở thành một chuyên gia công nghệ có chiều sâu kiến trúc, đạt tự do tài chính và duy trì một thể chất dẻo dai cùng tâm trí sáng suốt.",
    coreMotto: "Tập trung vào điều có ý nghĩa, không đuổi theo điều dễ dãi.",
    lastUpdated: today
  },

  principles: [
    {
      id: "p1",
      title: "Chân thực (Truth)",
      description: "Nhìn thẳng vào thực tế khách quan, không lừa dối bản thân bằng những chỉ số vanity hay cảm giác bận rộn ảo.",
      category: "Nhận thức",
      isCore: true,
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z"
    },
    {
      id: "p2",
      title: "Chính trực (Integrity)",
      description: "Hành động nhất quán giữa điều suy nghĩ, lời nói và việc làm, ngay cả khi không có ai quan sát.",
      category: "Đạo đức",
      isCore: true,
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z"
    },
    {
      id: "p3",
      title: "Trưởng thành liên tục (Growth)",
      description: "Xem khó khăn là môi trường rèn luyện. Tích lũy tri thức và năng lực theo lãi kép mỗi ngày.",
      category: "Năng lực",
      isCore: true,
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z"
    },
    {
      id: "p4",
      title: "Cống hiến & Phụng sự (Contribution)",
      description: "Tạo ra giá trị thặng dư thực chất cho người khác và đóng góp giải pháp bền vững cho xã hội.",
      category: "Xã hội",
      isCore: true,
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z"
    },
    {
      id: "p5",
      title: "Quản trị trách nhiệm (Stewardship)",
      description: "Sử dụng thời gian, sức khỏe và tài nguyên như một người được ủy thác thông thái, không lãng phí.",
      category: "Vận hành",
      isCore: true,
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z"
    }
  ],

  identityAnchors: [
    {
      id: "ia1",
      statement: "Tôi là một người thiết kế hệ thống suy nghĩ từ nguyên lý đầu tiên (First Principles), ưu tiên sự tinh gọn và tính bền vững.",
      type: "aspiring",
      dimensionKey: "career",
      createdAt: "2026-01-05T00:00:00Z"
    },
    {
      id: "ia2",
      statement: "Tôi giữ chữ tín tuyệt đối với những cam kết đã đưa ra cho bản thân và đồng đội.",
      type: "anchor",
      dimensionKey: "relationships",
      createdAt: "2026-01-05T00:00:00Z"
    },
    {
      id: "ia3",
      statement: "Người phản ứng thụ động với thông báo mạng xã hội và tiêu thụ nội dung vô bổ hàng giờ liền.",
      type: "anti_identity",
      dimensionKey: "spirituality",
      createdAt: "2026-01-05T00:00:00Z"
    },
    {
      id: "ia4",
      statement: "Người trì hoãn quyết định khó khăn bằng cách tìm kiếm thêm tài liệu thừa thãi.",
      type: "anti_identity",
      dimensionKey: "career",
      createdAt: "2026-01-05T00:00:00Z"
    }
  ],

  dimensions: [
    {
      id: "career",
      name: "Career & Craft",
      nameVi: "Sự nghiệp & Chuyên môn",
      description: "Năng lực giải quyết vấn đề kỹ thuật sâu sắc, uy tín chuyên môn và tầm ảnh hưởng.",
      currentRating: 8,
      targetRating: 9,
      focusWeight: "primary",
      icon: "Briefcase",
      color: "emerald"
    },
    {
      id: "wealth",
      name: "Wealth & Capital",
      nameVi: "Tài chính & Tích lũy",
      description: "Dòng tiền dương, quỹ khẩn cấp 12 tháng, danh mục đầu tư tích lũy dài hạn.",
      currentRating: 7,
      targetRating: 9,
      focusWeight: "primary",
      icon: "Coins",
      color: "amber"
    },
    {
      id: "health",
      name: "Health & Vitality",
      nameVi: "Sức khỏe & Năng lượng",
      description: "Giấc ngủ sâu 7.5h, thể lực VO2 Max, kiểm soát mỡ nội tạng và sức bền tim mạch.",
      currentRating: 8,
      targetRating: 9,
      focusWeight: "primary",
      icon: "Activity",
      color: "rose"
    },
    {
      id: "relationships",
      name: "Relationships & Family",
      nameVi: "Mối quan hệ & Gia đình",
      description: "Thời gian chất lượng hiện diện bên gia đình, tình bạn sâu sắc với những người cùng chí hướng.",
      currentRating: 7,
      targetRating: 8,
      focusWeight: "secondary",
      icon: "Users",
      color: "sky"
    },
    {
      id: "intelligence",
      name: "Intelligence & Wisdom",
      nameVi: "Trí tuệ & Học hỏi",
      description: "Đọc 20 trang sách chuyên sâu mỗi ngày, viết nhật ký mô hình tư duy và suy ngẫm phản biện.",
      currentRating: 8,
      targetRating: 9,
      focusWeight: "secondary",
      icon: "BookOpen",
      color: "indigo"
    },
    {
      id: "spirituality",
      name: "Inner Peace & Clarity",
      nameVi: "Bình an nội tâm & Tỉnh thức",
      description: "Khả năng giữ tĩnh lặng trước biến cố, giảm thiểu lo âu và sống trọn vẹn trong khoảnh khắc.",
      currentRating: 7,
      targetRating: 8,
      focusWeight: "maintenance",
      icon: "Compass",
      color: "teal"
    }
  ],

  themes: [
    {
      id: "th1",
      title: "Làm chủ kiến trúc Full-Stack & AI Systems (2026)",
      timeframe: "2026",
      description: "Nâng cao năng lực thiết kế hệ thống chịu tải, tích hợp mô hình ngôn ngữ lớn an toàn và hiệu quả.",
      status: "active"
    },
    {
      id: "th2",
      title: "Xây dựng thể chất cấp độ vận động viên phong trào",
      timeframe: "2026 - 2027",
      description: "Hoàn thành cự ly Half-Marathon dưới 1h55 và duy trì tỷ lệ mỡ cơ thể 14%.",
      status: "active"
    }
  ],

  goals: [
    {
      id: "g1",
      title: "Ra mắt Life OS v1.0 hoàn chỉnh và đưa vào vận hành thực tế",
      description: "Xây dựng xong 4 module cốt lõi, khép kín vòng phản hồi tuần và ghi nhận liên tục trong 30 ngày.",
      dimensionId: "career",
      targetDate: "2026-11-30",
      status: "active",
      progressPercent: 75,
      strategicThemeId: "th1",
      createdAt: "2026-10-01T00:00:00Z",
      updatedAt: today
    },
    {
      id: "g2",
      title: "Duy trì thói quen chạy bộ 35km/tuần và ngủ trước 23:00",
      description: "Tối ưu năng lượng làm việc sâu ban ngày, không thức khuya làm việc quá sức.",
      dimensionId: "health",
      targetDate: "2026-12-31",
      status: "active",
      progressPercent: 80,
      strategicThemeId: "th2",
      createdAt: "2026-10-01T00:00:00Z",
      updatedAt: today
    },
    {
      id: "g3",
      title: "Thiết lập quỹ dự phòng khẩn cấp 12 tháng sinh hoạt phí",
      description: "Đảm bảo mức an toàn tài chính tuyệt đối trước các biến động kinh tế.",
      dimensionId: "wealth",
      targetDate: "2026-12-31",
      status: "active",
      progressPercent: 65,
      createdAt: "2026-06-01T00:00:00Z",
      updatedAt: today
    }
  ],

  projects: [
    {
      id: "prj1",
      title: "Hoàn thiện Module Phản tư & Nhật ký Quyết định cho Life OS",
      goalId: "g1",
      status: "in_progress",
      priority: "high",
      strategicBet: "alpha",
      dueDate: "2026-11-05",
      tasks: [
        { id: "t1", text: "Thiết kế chuẩn 8 câu hỏi Weekly Review", completed: true },
        { id: "t2", text: "Lập trình Decision Log với trường bất định và ngày đánh giá", completed: true },
        { id: "t3", text: "Tích hợp Gemini Copilot hỗ trợ phân tích gap kế hoạch vs thực tế", completed: false }
      ],
      notes: "Ưu tiên hàng đầu của tuần, quyết định chất lượng khép vòng phản hồi.",
      createdAt: "2026-10-15T00:00:00Z",
      updatedAt: today
    },
    {
      id: "prj2",
      title: "Kế hoạch tập luyện Base Building cự ly 10K",
      goalId: "g2",
      status: "in_progress",
      priority: "medium",
      strategicBet: "cash_cow",
      dueDate: "2026-11-20",
      tasks: [
        { id: "t4", text: "3 buổi chạy Zone 2 mỗi tuần (6km x 3)", completed: true },
        { id: "t5", text: "1 buổi Long Run cuối tuần 12km", completed: false },
        { id: "t6", text: "2 buổi giãn cơ và foam rolling", completed: true }
      ],
      notes: "Chạy đúng nhịp tim Zone 2 (dưới 142 bpm), không đua pace.",
      createdAt: "2026-10-10T00:00:00Z",
      updatedAt: today
    }
  ],

  kpis: [
    {
      id: "kpi1",
      title: "Tỷ lệ hoàn thành ưu tiên tuần (Weekly Priority Hit Rate)",
      definition: "Số lượng ưu tiên quan trọng nhất tuần thực sự hoàn thành chia cho tổng số ưu tiên đã cam kết (tối đa 3).",
      formula: "(Số ưu tiên hoàn thành / 3) * 100",
      unit: "%",
      frequency: "weekly",
      direction: "increase",
      targetValue: 80,
      currentValue: 100,
      hasMeasurement: true,
      history: [
        { id: "m1", date: "2026-10-12", value: 67, note: "2/3 ưu tiên xong, bị hoãn 1 việc do phụ thuộc bên ngoài" },
        { id: "m2", date: "2026-10-19", value: 100, note: "3/3 ưu tiên xong, tập trung sâu" }
      ],
      linkedGoalId: "g1",
      createdAt: "2026-10-01T00:00:00Z",
      updatedAt: today
    },
    {
      id: "kpi2",
      title: "Tổng quãng đường chạy bộ trong tuần",
      definition: "Tổng số kilômét chạy bộ được ghi nhận qua đồng hồ GPS trong khoảng từ thứ Hai đến Chủ Nhật.",
      formula: "Tổng số km chạy trong 7 ngày",
      unit: "km",
      frequency: "weekly",
      direction: "maintain",
      targetValue: 30,
      currentValue: 28.5,
      hasMeasurement: true,
      history: [
        { id: "m3", date: "2026-10-12", value: 24.0, note: "Tuần phục hồi sau đau cơ nhẹ" },
        { id: "m4", date: "2026-10-19", value: 28.5, note: "Hoàn thành 4 buổi đều đặn" }
      ],
      linkedGoalId: "g2",
      createdAt: "2026-10-01T00:00:00Z",
      updatedAt: today
    },
    {
      id: "kpi3",
      title: "Thời gian làm việc sâu không xao nhãng (Deep Work)",
      definition: "Số giờ làm việc tập trung cao độ trên các dự án Alpha, không mở mạng xã hội hay trả lời tin nhắn tức thời.",
      formula: "Tổng giờ Deep Work hàng ngày ghi nhận bằng Pomodoro",
      unit: "giờ/tuần",
      frequency: "weekly",
      direction: "increase",
      targetValue: 20,
      currentValue: null,
      hasMeasurement: false, // Explicitly no measurement recorded yet (NOT 0!)
      history: [],
      linkedGoalId: "g1",
      createdAt: "2026-10-01T00:00:00Z",
      updatedAt: today
    }
  ],

  habits: [
    {
      id: "h1",
      title: "Thức dậy lúc 06:00 & 10 phút tĩnh lặng không màn hình",
      frequency: "Mỗi ngày",
      targetPerWeek: 7,
      streakDays: 14,
      category: "spirituality",
      history: {
        [today]: true,
        [yesterday]: true,
        [twoDaysAgo]: true
      },
      createdAt: "2026-10-01T00:00:00Z"
    },
    {
      id: "h2",
      title: "Đọc 20 trang sách chuyên ngành hoặc triết học",
      frequency: "Mỗi ngày",
      targetPerWeek: 6,
      streakDays: 8,
      category: "intelligence",
      history: {
        [today]: false,
        [yesterday]: true,
        [twoDaysAgo]: true
      },
      createdAt: "2026-10-01T00:00:00Z"
    },
    {
      id: "h3",
      title: "Chạy bộ hoặc tập kháng lực tối thiểu 30 phút",
      frequency: "5 ngày/tuần",
      targetPerWeek: 5,
      streakDays: 5,
      category: "health",
      history: {
        [today]: true,
        [yesterday]: true,
        [twoDaysAgo]: false
      },
      createdAt: "2026-10-01T00:00:00Z"
    }
  ],

  dailyActions: [
    {
      id: "da1",
      date: today,
      text: "Hoàn thiện giao diện Weekly Review với chuẩn 8 câu hỏi bắt buộc",
      isPriority: true,
      completed: true,
      projectId: "prj1",
      timeSpentMinutes: 90,
      createdAt: today
    },
    {
      id: "da2",
      date: today,
      text: "Viết logic kiểm soát KPI: Phân biệt rõ thiếu số liệu và số 0",
      isPriority: true,
      completed: true,
      projectId: "prj1",
      timeSpentMinutes: 60,
      createdAt: today
    },
    {
      id: "da3",
      date: today,
      text: "Chạy nhẹ 6km Zone 2 nhịp tim dưới 140 bpm",
      isPriority: true,
      completed: true,
      projectId: "prj2",
      timeSpentMinutes: 45,
      createdAt: today
    },
    {
      id: "da4",
      date: today,
      text: "Kiểm tra lại báo cáo chi tiêu tuần và cân đối quỹ khẩn cấp",
      isPriority: false,
      completed: false,
      timeSpentMinutes: 20,
      createdAt: today
    }
  ],

  weeklyPriorities: [
    {
      id: "wp1",
      weekNumber: 43,
      year: 2026,
      text: "Hoàn thiện và kiểm thử xong toàn bộ 4 module cốt lõi của Life OS v1.0",
      completed: true,
      linkedGoalId: "g1"
    },
    {
      id: "wp2",
      weekNumber: 43,
      year: 2026,
      text: "Duy trì kỷ luật chạy bộ 4 buổi (đạt mốc 28-30km)",
      completed: true,
      linkedGoalId: "g2"
    },
    {
      id: "wp3",
      weekNumber: 43,
      year: 2026,
      text: "Viết bài phân tích quyết định cấu trúc dữ liệu cho Life OS",
      completed: false,
      linkedGoalId: "g1"
    }
  ],

  weeklyReviews: [
    {
      id: "wr1",
      weekNumber: 42,
      year: 2026,
      createdAt: "2026-10-19T20:00:00Z",
      q1_mostImportant: "Thiết lập thành công nền móng kiến trúc dữ liệu và logic điều hướng cho Life OS, tránh việc vội vã cài đặt quá nhiều tính năng rác.",
      q2_intendedOutcomes: "Hoàn thành shell ứng dụng, kết nối Firebase schema chuẩn và viết test cho việc tạo Goal.",
      q3_actualResults: "Xong giao diện shell, các kiểu dữ liệu TypeScript chặt chẽ, tạo được Goal và hiển thị chính xác.",
      q4_valueCreated: "Một bộ khung ứng dụng sạch, không có nợ kỹ thuật, cấu trúc phân lớp rõ ràng giữa UI, business logic và storage.",
      q5_incompleteAndCauses: "Chưa hoàn thành phần Cloud Functions do cần xem lại cấu hình bảo mật secret GEMINI_API_KEY.",
      q6_changedAssumptions: "Nhận ra rằng không nên cố gắng nhét quá nhiều KPI ngay từ đầu, chỉ cần 2-3 KPI dẫn dắt hành vi cốt lõi.",
      q7_pivotAction: "continue",
      q7_pivotNotes: "Giữ vững cam kết chỉ tập trung vào 4 module cốt lõi cho phiên bản 1.0, trì hoãn các module phụ sang v2.",
      q8_nextWeekPriorities: [
        "Hoàn thiện 8 câu hỏi phản tư tuần và Decision Log",
        "Tích hợp Gemini Copilot tóm tắt phân biệt rõ 4 phần dữ kiện",
        "Kiểm toán chất lượng và đóng gói bản phát hành v1.0"
      ],
      linkedGoalIds: ["g1"],
      linkedProjectIds: ["prj1"]
    }
  ],

  decisionLogs: [
    {
      id: "dec1",
      createdAt: "2026-10-14T14:30:00Z",
      question: "Có nên mở rộng sang module Quản lý Tài chính (Personal Finance) và Quản lý Tri thức (Knowledge OS) ngay trong phiên bản v1.0 không?",
      options: [
        {
          id: "opt1",
          title: "Phương án A: Làm tất cả 8 module cùng lúc để có hệ điều hành toàn diện ngay lập tức",
          pros: "Có đủ công cụ ở một nơi, cảm giác hoành tráng",
          cons: "Nguy cơ vỡ tiến độ rất cao, mã nguồn lộn xộn, không kiểm soát được chất lượng"
        },
        {
          id: "opt2",
          title: "Phương án B: Chỉ tập trung sâu vào 4 module MVP v1.0 (Command, Strategy, Execution, Reflection)",
          pros: "Khép kín được vòng phản hồi quan trọng nhất, code chất lượng cao, dễ kiểm thử",
          cons: "Tạm thời chưa quản lý được bảng cân đối tài chính trực tiếp trong app"
        }
      ],
      criteria: "Tính khả thi trong 30 ngày, độ bền vững của kiến trúc, khả năng duy trì thói quen thực tế của bản thân.",
      assumptions: "Giả định rằng giá trị lớn nhất của Life OS nằm ở việc ra quyết định và phản tư mỗi tuần, không phải ở việc sao chép chức năng của một app kế toán.",
      uncertaintyLevel: "low",
      chosenOption: "Phương án B: Chỉ tập trung 4 module cốt lõi",
      rationale: "Nguyên tắc 'Thực hiện một workflow hoàn chỉnh trước khi mở rộng'. Nếu chưa hình thành được phản xạ review tuần, việc nhét thêm tính năng chỉ tạo thêm gánh nặng nhập liệu.",
      reviewDate: "2026-11-15",
      actualOutcome: "Rất đúng đắn: 4 module chạy mượt mà, không bị áp lực phân tán năng lượng.",
      lessonsLearned: "Sự tinh gọn luôn chiến thắng tham lam tính năng trong giai đoạn đầu.",
      status: "reviewed",
      linkedGoalId: "g1"
    }
  ]
};
