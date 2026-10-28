# Implementation Plan: Alan's Life OS (Personal Operating System)

Xây dựng phiên bản đầu tiên của **"Alan's Life OS"** — một hệ điều hành cuộc sống cá nhân tinh gọn, chuẩn mực dành riêng cho chuyên gia Phân tích Hiệu suất Doanh nghiệp (Business Performance & Analytics), kết hợp tư duy hệ thống (systems thinking), tâm lý học, thần kinh học, thực hành chánh niệm/Phật giáo, kế hoạch tài chính, quản trị tri thức và AI.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> Dưới đây là các quyết định quan trọng đã được thống nhất sau vòng phỏng vấn thiết kế:
> - **Ngôn ngữ thẩm mỹ & Bảng màu**: Nền sáng thanh lịch (`#F8FAFC` / `#FFFFFF`), kiểu chữ Navy uy quyền (`#0F172A` / `#1E293B`), điểm xuyết màu Teal kiềm chế (`#0D9488` / `#14B8A6`) mang lại sự sáng rõ về mặt phân tích và giảm tối đa ma sát sử dụng hàng ngày.
> - **Bố cục Không gian & Điều hướng**: Thanh điều hướng Top-bar tuân thủ hợp đồng 3 phân vùng (Top Bar Contract), kết nối trực tiếp 6 module cốt lõi của Life OS.
> - **Chiến lược Lưu trữ Dữ liệu**: Khởi tạo state cục bộ an toàn kèm các TypeScript model chuẩn xác, phân tách rõ ràng tầng truy xuất để sẵn sàng cắm trực tiếp Firebase Authentication và Cloud Firestore ở bước tiếp theo.

---

## 1. Overview & Core Concept

### Khách hàng mục tiêu & Bối cảnh (User Context)
- **Hồ sơ**: Chuyên gia Phân tích và Hiệu suất Doanh nghiệp (Business Performance & Analytics Professional).
- **Mối quan tâm giao thoa**: Tư duy hệ thống (Systems Thinking), Chiến lược cá nhân, Tâm lý học nhận thức, Khoa học thần kinh, Thực hành Phật giáo & Chánh niệm, Hoạch định tài chính, Quản trị tri thức (Knowledge Management), Phát triển sự nghiệp và Ứng dụng AI.
- **5 Nguyên tắc nền tảng (Product Principles)**:
  1. **Truth (Chân thực)**: Đối diện với sự thật khách quan, phân biệt rõ số đo bị thiếu với số 0.
  2. **Integrity (Chính trực)**: Nhất quán giữa hệ giá trị, cam kết và hành vi thực tế mỗi ngày.
  3. **Growth (Trưởng thành)**: Tích lũy năng lực, kỹ năng và vốn sự nghiệp theo lãi kép.
  4. **Contribution (Cống hiến)**: Tạo giá trị thặng dư thực chất cho cộng đồng và tổ chức.
  5. **Stewardship (Quản trị trách nhiệm)**: Quản lý thời gian, năng lượng, tài chính và sức khỏe như một người ủy thác thông thái.

### Tầm nhìn Sản phẩm (Product Vision)
Kết nối liền mạch một chuỗi giá trị thống nhất:
$$\text{Bản sắc (Identity)} \longrightarrow \text{Chiến lược & Khía cạnh} \longrightarrow \text{Mục tiêu & Cược chiến lược} \longrightarrow \text{Dự án & KPI Engine} \longrightarrow \text{Hành động hàng ngày} \longrightarrow \text{Phản tư & Quyết định}$$

---

## 2. User Experience & Visual Design

### 6 Module Cốt lõi Khởi tạo (Initial Modules)
1. **Life Command Center**:
   - Bảng điều khiển tổng chỉ huy: North Star statement, 3 ưu tiên tuần, nhịp đập KPI sống còn, phân bổ dự án theo Strategic Bets (Alpha, Cash Cow, R&D, Kill).
   - Hiển thị các khối placeholder nghiệp vụ có nhãn rõ ràng, sẵn sàng nhận dữ liệu thực.
2. **Strategy & Identity**:
   - 5 Nguyên tắc nền tảng (Principles).
   - Kiến trúc căn tính (Identity Architecture): Aspiring (bản sắc hướng tới), Anchor (giá trị neo), Anti-Identity (cạm bẫy bản sắc).
   - 6 Khía cạnh Cuộc sống (Career & Craft, Wealth, Health, Relationships, Intelligence, Spirituality).
3. **Goals & Projects**:
   - Quản lý Mục tiêu phân cấp gắn liền với Life Dimensions.
   - Quản lý Dự án phân loại theo cược chiến lược (Strategic Bets: Alpha, Cash Cow, R&D, Kill).
4. **Daily Execution**:
   - Bộ 3 việc không thể thương lượng trong ngày (Daily 3 Non-negotiables).
   - Ma trận thói quen tối giản với chuỗi ngày liên tục (Streaks) và theo dõi năng lượng.
5. **Weekly Review**:
   - Chu trình phản tư chuẩn 8 câu hỏi tuần: So sánh Kế hoạch ban đầu với Thực tế diễn ra (Plan vs Actual), giá trị tạo ra, bài học và quyết định Tiếp tục / Dừng / Đổi hướng.
6. **Reflection & Decision Log**:
   - Nhật ký ghi nhận các quyết định có độ bất định cao (Uncertainty Level), ghi nhận giả định ngầm, lý do đánh đổi và hẹn ngày kiểm chứng kết quả thực tế.

### Thiết kế Giao diện & Hệ màu (Design System)
- **Palette**:
  - *Canvas*: Trắng tinh khiết và Neutral sáng (`#FFFFFF`, `#F8FAFC`, `#F1F5F9`).
  - *Typography*: Xanh Navy sâu (`#0F172A`, `#1E293B`, `#334155`) tạo cảm giác chuyên nghiệp, học thuật và điềm tĩnh.
  - *Accents*: Teal kiềm chế (`#0D9488`, `#0F766E`, `#14B8A6`) tập trung vào các điểm tương tác chính.
  - *Borders & Dividers*: Đường mảnh 1px (`#E2E8F0`, `#CBD5E1`), tuyệt đối không dùng viền đậm hay đổ bóng quá đà.
- **Typography & Font**:
  - *Tiêu đề & Brand*: `Plus Jakarta Sans` / `Be Vietnam Pro` (chắc chắn, đĩnh đạc).
  - *Thân bài*: `Public Sans` / `DM Sans` dễ đọc ở kích thước 13px–15px.
  - *Chỉ số & Số đo*: `JetBrains Mono` kết hợp `tabular-nums` để các con số luôn gióng hàng chuẩn xác.

---

## 3. Key Product Decisions & Trade-Offs

- **Quyết định 1: Phân tách cấu trúc dự án nghiêm ngặt theo mô hình Module hóa**:
  - *Cách làm*: Tách riêng `src/types/`, `src/services/`, `src/context/`, `src/components/`, và `src/constants/`. Không dồn logic vào một file lớn.
  - *Lý do*: Đáp ứng trọn vẹn Architecture Rule của Alan, dễ dàng bảo trì, mở rộng và cắm Firebase SDK ở bước sau.
- **Quyết định 2: Tôn trọng nguyên tắc "Chân thực (Truth)" trong đo lường**:
  - *Cách làm*: Định nghĩa rõ kiểu dữ liệu KPI với cờ `hasMeasurement: boolean`. Nếu chưa có dữ liệu đo trong tuần thì hiển thị nhãn `"Chưa có dữ liệu"`, tuyệt đối không gán mặc định bằng 0 để tránh sai lệch báo cáo hiệu suất.
- **Quyết định 3: Bố trí Placeholder có nhãn nghiệp vụ tường minh (Clearly Labelled Placeholders)**:
  - *Cách làm*: Các thẻ dữ liệu, đồ thị xu hướng và khối thống kê đều có nhãn hướng dẫn rõ ràng, trạng thái rỗng (*Empty State*) chỉ dẫn hành động tiếp theo, không chèn dữ liệu rác hay số liệu giả lập gây nhiễu nhận thức.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Top Bar Navigation                              │
│   [ Alan's Life OS ] ── [ Command Center | Strategy | Goals | Daily    │
│                           Weekly Review | Decision Log ] ── [ Quick ] │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Active Route / Module
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        LifeOS Context & State                          │
│   - Typed Models (NorthStar, Principles, Dimensions, Goals, KPIs)      │
│   - Persistence Layer: Local Storage State (Ready for Firestore Sync)  │
│   - Export / Import JSON & State Backup                                │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
       ┌───────────────┬────────────┴───┬───────────────┬────────────────┐
       ▼               ▼                ▼               ▼                ▼
┌──────────────┐┌──────────────┐┌──────────────┐┌──────────────┐┌────────────────┐
│Command Center││   Strategy   ││Goals & Bets  ││Daily Exec    ││Weekly & Decision│
│- North Star  ││- Principles  ││- Goals       ││- Daily 3 Top ││- 8-Q Reflection│
│- KPI Pulse   ││- Identities  ││- Projects    ││- Habit Matrix││- Decision Log  │
│- Bets Matrix ││- Dimensions  ││- KPI Engine  ││- Energy Check││- Outcome Review│
└──────────────┘└──────────────┘└──────────────┘└──────────────┘└────────────────┘
```

### Cấu trúc Thư mục Kế hoạch (Clean Architecture)
```
/src
  ├── types/
  │    └── lifeos.ts            # Các interfaces chuẩn hóa (Goal, Project, KPI, Review, Decision...)
  ├── context/
  │    └── LifeOSContext.tsx    # State management trung tâm & persistence adapter
  ├── constants/
  │    └── seedData.ts          # Dữ liệu khởi tạo có cấu trúc cho Alan
  ├── components/
  │    ├── common/
  │    │    ├── Navbar.tsx      # Top bar contract
  │    │    ├── MetricCard.tsx  # Thẻ hiển thị KPI phân tích
  │    │    └── EmptyState.tsx  # Trạng thái rỗng chuẩn mực
  │    ├── command/
  │    │    └── CommandDashboard.tsx
  │    ├── strategy/
  │    │    └── StrategyIdentityView.tsx
  │    ├── goals/
  │    │    └── GoalsProjectsView.tsx
  │    ├── execution/
  │    │    └── DailyExecutionView.tsx
  │    ├── review/
  │    │    └── WeeklyReviewView.tsx
  │    └── decision/
  │         └── DecisionLogView.tsx
  ├── App.tsx                   # Layout shell & điều hướng
  └── index.css                 # Token màu navy/teal, base typography
```

### Kế hoạch Triển khai Từng bước (Next Implementation Steps)
1. **Bước 1 (Task hiện tại)**: Khởi tạo Shell ứng dụng, Top Bar navigation chuẩn 3-zone, bộ token màu Navy/Teal, các Typed Data Interfaces trong `src/types/lifeos.ts`, và Dashboard với các placeholder có nhãn rõ ràng.
2. **Bước 2**: Hoàn thiện các View nghiệp vụ chi tiết cho từng Module (Strategy, Goals, Daily, Weekly Review, Decision Log) với khả năng thao tác CRUD hoàn chỉnh.
3. **Bước 3**: Tích hợp Firebase Authentication & Firestore (provisioning và bảo mật với Security Rules nghiêm ngặt).
4. **Bước 4**: Tích hợp tầng Server Gemini Copilot để hỗ trợ phản tư, phân tích Plan-vs-Actual và phản biện quyết định.
