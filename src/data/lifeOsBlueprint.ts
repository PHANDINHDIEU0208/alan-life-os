/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Life OS Blueprint & Implementation Context
 * Extracted directly from: Life_OS___Hu_o__ng_da__n_xa_y_du__ng_tu__ng_bu_o__c_21c82ec7.html
 */

export interface BlueprintStep {
  title: string;
  timeframe: string;
  goal: string;
  tasks: string[];
  prompt?: string;
  doneCriteria: string[];
  warningNote?: string;
}

export interface RiskItem {
  risk: string;
  mitigation: string;
}

export const LIFE_OS_BLUEPRINT_PHASES: BlueprintStep[] = [
  {
    title: "Chuẩn bị môi trường",
    timeframe: "Trước tuần 1",
    goal: "Có đủ tài khoản và công cụ để không bị chặn giữa chừng.",
    tasks: [
      "Cài Node.js bản LTS, Git và trình soạn code (hoặc công cụ vibe coding bạn dùng).",
      "Tạo repo GitHub riêng tư tên life-os.",
      "Tạo project Firebase, bật Authentication (Google hoặc email) và Cloud Firestore.",
      "Tạo Gemini API key và cất riêng. Chưa dán vào code; sau này chỉ đặt ở secret phía server.",
      "Chép 5 câu hỏi đánh giá thành công (mục 18) vào README.md làm kim chỉ nam."
    ],
    doneCriteria: [
      "Repo và Firebase project đã tạo xong.",
      "Chưa có key hay secret nào nằm trong mã nguồn."
    ]
  },
  {
    title: "Khởi tạo shell ứng dụng",
    timeframe: "Tuần 1",
    goal: "Khung giao diện, điều hướng và kiểu dữ liệu. Chưa làm tất cả module cùng lúc.",
    tasks: [
      "Tạo project: npm create vite@latest life-os -- --template react-ts, rồi npm install.",
      "Cài React Router và Firebase: npm i react-router-dom firebase.",
      "Cài Tailwind CSS theo hướng dẫn hiện hành trên trang chủ Tailwind cho Vite.",
      "Chạy Prompt 1, yêu cầu AI giải thích cấu trúc thư mục bằng tiếng Việt.",
      "npm run dev kiểm tra từng trang, rồi commit checkpoint."
    ],
    prompt: `Act as a senior full-stack architect and product engineer.

Build the initial shell of Life OS using React, TypeScript, Tailwind CSS,
Firebase Authentication and Cloud Firestore.

Create:
- Responsive navigation and application layout.
- Command Center page.
- Strategy & Identity page.
- Goals & Projects page.
- Daily Execution page.
- Weekly Review page.
- Typed data interfaces.
- Clear separation between UI, business logic and Firebase services.

Use realistic empty states, not fake operational data.
Do not expose secrets in the frontend.
Explain the project structure in Vietnamese.

First implement the shell and data types. Do not implement every module at once.`,
    doneCriteria: [
      "Điều hướng được giữa 5 trang, dùng tốt trên điện thoại.",
      "Trang trống hiển thị empty state, không có số liệu giả.",
      "Thư mục tách rõ UI, logic nghiệp vụ và dịch vụ Firebase."
    ]
  },
  {
    title: "Tích hợp Firebase (một lát cắt dọc)",
    timeframe: "Tuần 1",
    goal: "Chứng minh luồng đăng nhập → tạo Goal → lưu → tải lại vẫn thấy.",
    tasks: [
      "Cài công cụ: npm i -g firebase-tools, firebase login, firebase init (Firestore, Emulators, Hosting).",
      "Lấy cấu hình web app trong Firebase Console, đặt vào .env.local, thêm file này vào .gitignore. Cấu hình web không phải bí mật, nhưng dữ liệu chỉ an toàn nhờ Security Rules.",
      "Chạy Prompt 2.",
      "Chạy thử: firebase emulators:start, đăng nhập, tạo Goal, tải lại trang.",
      "Đăng nhập tài khoản thứ hai và xác nhận không đọc được dữ liệu của tài khoản đầu."
    ],
    prompt: `Integrate Firebase Authentication and Cloud Firestore into the existing Life OS.

Implement one vertical slice:
sign in → create a goal → save to Firestore → reload → display the goal.

Requirements:
- Centralize Firebase initialization.
- Use typed models and data-access functions.
- Associate private records with the authenticated user’s UID.
- Design restrictive Firestore Security Rules.
- Add loading, empty, unauthorized and error states.
- Include tests for create, read, update and unauthorized access.
- Explain Firebase Emulator setup.

Do not claim security rules are safe until tested.`,
    doneCriteria: [
      "Dữ liệu nằm dưới users/{uid}/goals và còn nguyên sau khi tải lại.",
      "Test create, read, update và truy cập trái phép đều chạy được trên Emulator.",
      "Có đủ trạng thái loading, empty, unauthorized, error."
    ],
    warningNote: "Trước khi sang tuần 2, thống nhất cách lưu thời gian (timestamp trong database, định dạng chỉ ở UI), cách xử lý trường trống và validation lúc chạy. Type trong tài liệu chỉ là ví dụ ban đầu."
  },
  {
    title: "Strategy & Identity",
    timeframe: "Tuần 2",
    goal: "Lưu định hướng của chính bạn: Principles, Identity, North Star, Strategy, Life Dimensions.",
    tasks: [
      "Tự viết trước nội dung thật: 5 nguyên tắc khởi tạo (Truth, Integrity, Growth, Contribution, Stewardship) hoặc bản bạn tùy chỉnh. Đây là gợi ý, không bắt buộc.",
      "Chọn Life Dimensions của bạn (ví dụ Career, Wealth, Health, Relationships, Intelligence).",
      "Chạy Prompt 3.",
      "Nhập dữ liệu thật vào ứng dụng, sửa thử một bản ghi và tải lại.",
      "Kiểm tra gợi ý AI (nếu có) chỉ ở dạng bản nháp chờ bạn duyệt."
    ],
    prompt: `Implement the Strategy & Identity module.

Features:
- Principles.
- Identity Architecture.
- Purpose and North Star.
- Life Strategy Map.
- Life Dimensions.
- Strategic Themes.

Persist records to Firestore.
Validate required fields.
Track createdAt and updatedAt.
Preserve user-authored statements unless explicitly edited.
Treat AI suggestions as drafts requiring approval.

Add tests for saving, editing, reloading and missing data.`,
    doneCriteria: [
      "Tạo, sửa, lưu trữ (archived) được Principles, Strategy và Dimensions.",
      "Có createdAt, updatedAt; câu chữ của bạn không bị ghi đè ngầm.",
      "North Star hiện ra ở Command Center."
    ]
  },
  {
    title: "Goals, Projects, KPIs, Habits, Daily Actions",
    timeframe: "Tuần 2–3",
    goal: "Vòng vận hành từ kế hoạch đến thực thi, với KPI có định nghĩa rõ.",
    tasks: [
      "Viết ra giấy mỗi KPI: định nghĩa, công thức, đơn vị, tần suất (daily/weekly/monthly/quarterly), hướng (increase/decrease/maintain/qualitative).",
      "Chỉ giữ KPI giúp ra quyết định; việc nghỉ ngơi, quan hệ, nghĩa vụ không cần quy đổi KPI.",
      "Chạy Prompt 4.",
      "Liên kết Goal ↔ Project ↔ KPI ↔ Daily Action bằng ID.",
      "Tạo Weekly Plan với 3 ưu tiên và ghi nhận Daily Log trong vài ngày."
    ],
    prompt: `Implement Goals, Projects, KPIs, Habits and Daily Actions.

Requirements:
- Typed relationships between entities.
- CRUD operations and Firestore persistence.
- Explicit KPI definitions, units, frequency and direction.
- Distinguish missing measurements from zero.
- Calculate progress only when the metric definition supports it.
- Create a weekly view with three priorities.
- Test date boundaries, status changes, relationships and calculations.

Implement one complete workflow before expanding scope.`,
    doneCriteria: [
      "Thiếu số đo hiển thị là “chưa có dữ liệu”, không phải 0.",
      "Tiến độ chỉ tính khi định nghĩa KPI cho phép.",
      "Test ngày biên (đầu/cuối tuần, đổi trạng thái, quan hệ) đều qua."
    ],
    warningNote: "Hoàn thành task không đồng nghĩa đạt outcome. Strategic Bets (Alpha, Cash Cow, R&D, Kill) là tùy chọn trong MVP; điểm số như Return × Passion chỉ để gợi thảo luận."
  },
  {
    title: "Weekly Review & Decision Log",
    timeframe: "Tuần 3–4",
    goal: "Khép vòng: so kế hoạch với thực tế và lưu lại chất lượng phán đoán.",
    tasks: [
      "Chốt mẫu Weekly Review gồm 8 câu: điều quan trọng nhất; dự định; thực tế; giá trị tạo ra; chưa xong và nguyên nhân đã biết; giả định đã đổi; tiếp tục/dừng/thay đổi; 3 ưu tiên tuần sau.",
      "Chốt mẫu Decision Log: câu hỏi, phương án, tiêu chí, giả định và bất định, lựa chọn, lý do, ngày xem lại, kết quả thực tế, bài học.",
      "Chạy Prompt 5.",
      "Làm một Weekly Review thật bằng dữ liệu đã nhập."
    ],
    prompt: `Implement Weekly Review and Decision Log.

Weekly Review:
- Intended outcomes.
- Actual results.
- Wins and misses.
- Insights and changed assumptions.
- Continue, stop or change.
- Next priorities.

Decision Log:
- Decision question.
- Options and criteria.
- Assumptions and uncertainty.
- Chosen option and rationale.
- Review date and actual outcome.

Persist all records.
Link reflections to goals and projects where appropriate.
Do not invent psychological explanations.
Require approval before AI-generated changes are saved.`,
    doneCriteria: [
      "Weekly Review tổng hợp được dữ liệu đã ghi nhận trong tuần.",
      "Decision Log lưu đủ giả định, phương án, kết quả.",
      "Review liên kết được tới Goal và Project."
    ]
  },
  {
    title: "Gemini AI Copilot",
    timeframe: "Tuần 4",
    goal: "Tóm tắt và hỗ trợ quyết định, chạy qua server, có kiểm soát.",
    tasks: [
      "Dựng Cloud Functions (kiểm tra gói Firebase hiện hành vì Functions có thể yêu cầu gói trả phí) và đặt key: firebase functions:secrets:set GEMINI_API_KEY.",
      "Dán system prompt gợi ý (mục 12.3) vào server: chỉ dùng bản ghi được phép, tách 4 phần (quan sát đã xác minh, diễn giải khả dĩ, điều chưa biết, bước tiếp theo), không chẩn đoán sức khỏe.",
      "Chạy Prompt 6, nhưng làm trước một năng lực: tóm tắt tuần.",
      "Thêm dần plan-versus-actual, so sánh phương án, câu hỏi phản tư.",
      "Đặt giới hạn sử dụng và theo dõi chi phí."
    ],
    prompt: `Implement a secure Gemini-powered Personal AI Copilot.

Use a trusted server-side function or backend.
Never expose API keys in frontend code.
Authenticate before retrieving private data.
Retrieve only the minimum relevant records.
Validate request and response schemas.

Capabilities:
- Weekly summary.
- Plan-versus-actual analysis.
- Knowledge retrieval.
- Decision comparison.
- Reflection questions.
- Draft weekly plans.

Separate verified observations, interpretations, unknowns and suggested actions.
Do not invent evidence or modify important records without explicit confirmation.
Test missing data, unauthorized access and API failures.`,
    doneCriteria: [
      "Không tìm thấy key trong code frontend hay bundle.",
      "Người chưa đăng nhập không gọi được Copilot.",
      "AI báo rõ khi thiếu dữ liệu và không tự sửa bản ghi quan trọng."
    ]
  },
  {
    title: "Kiểm toán chất lượng & triển khai",
    timeframe: "Tuần 4",
    goal: "Kiểm tra toàn bộ trước khi dùng thật.",
    tasks: [
      "Chạy Prompt 7; với mỗi phát hiện yêu cầu: mức độ, cách tái hiện, nguyên nhân gốc, cách sửa, test hồi quy.",
      "Sửa hết lỗi nghiêm trọng, đặc biệt Security Rules và truy cập AI.",
      "Thêm chức năng export dữ liệu và thử khôi phục từ file export.",
      "Build production: npm run build, rồi triển khai (frontend tĩnh + Firebase có thể dùng firebase deploy; cần server runtime thì chọn nền tảng tương thích).",
      "Viết README hướng dẫn chạy và phương án rollback bằng Git tag."
    ],
    prompt: `Audit the existing Life OS before release.

Test:
- Authentication.
- CRUD and persistence.
- Data relationships.
- Firestore Security Rules.
- Unauthorized access.
- Empty, loading and failure states.
- AI data access and response validation.
- Export and recovery.
- Responsive layout.
- Production build.

Report severity, reproduction steps, root cause, fix and regression test for each finding.
Do not claim production readiness while critical issues remain.`,
    doneCriteria: [
      "Không còn lỗi mức critical.",
      "Export và khôi phục đã thử thật.",
      "Bản production chạy được và có điểm rollback."
    ]
  }
];

export const DEFINITION_OF_DONE_V1: string[] = [
  "Đăng nhập được và dữ liệu lưu an toàn (Local Persistence & Schema sẵn sàng cho Firestore).",
  "Tạo và chỉnh sửa được Principles, Identity Architecture, Purpose & North Star, Strategy Map.",
  "Tạo Goals và Projects, liên kết phân cấp bằng ID rõ ràng.",
  "Ghi nhận Daily Actions và KPI có định nghĩa rõ (phân biệt thiếu số đo với số 0).",
  "Weekly Review tổng hợp dữ liệu đã ghi nhận theo chuẩn 8 câu hỏi.",
  "Decision Log lưu đầy đủ giả định, mức độ bất định, phương án và kết quả kiểm chứng.",
  "AI Copilot phân biệt rạch ròi 4 phần: Dữ kiện xác minh, Diễn giải, Điều chưa biết, Đề xuất hành động.",
  "Bảo mật: Phân tách rõ dữ liệu cá nhân, không phơi bày API key ra client.",
  "Có export dữ liệu ra JSON và khôi phục (Import) kiểm thử thành công.",
  "Có Git history, cấu trúc module rành mạch và phương án rollback an toàn."
];

export const RISKS_AND_MITIGATIONS: RiskItem[] = [
  { risk: "Phạm vi quá rộng", mitigation: "Giữ MVP ở 4 module cốt lõi, xong một luồng hoàn chỉnh mới mở rộng." },
  { risk: "AI tạo code khó bảo trì", mitigation: "Chia module chặt chẽ, type an toàn, review diff trước khi nhận." },
  { risk: "Sai dữ liệu hoặc KPI", mitigation: "Định nghĩa rõ công thức, đơn vị, hướng đo lường; test bằng dữ liệu mẫu." },
  { risk: "Rò rỉ API key", mitigation: "Key chỉ nằm trong secret phía server (/api/copilot), không gửi ở client bundle." },
  { risk: "Truy cập trái phép", mitigation: "Thiết kế dữ liệu gắn liền với User ID và ràng buộc quyền hạn." },
  { risk: "Quá nhiều KPI gây ngợp", mitigation: "Chỉ đo những thứ thật sự hỗ trợ ra quyết định (ít nhưng chất)." },
  { risk: "Chi phí AI / API tăng vọt", mitigation: "Chỉ truyền bối cảnh tối thiểu cần thiết, giới hạn tần suất gọi." },
  { risk: "AI kết luận quá mức / bịa đặt", mitigation: "Bắt buộc tách 4 phần: evidence xác minh, diễn giải, điểm mù, đề xuất cần duyệt." }
];

export const SUCCESS_EVALUATION_QUESTIONS: string[] = [
  "1. Tôi có rõ hơn điều gì thật sự quan trọng với cuộc sống của mình không?",
  "2. Tôi có nối được định hướng dài hạn (North Star) với hành động mỗi ngày không?",
  "3. Tôi có giảm bớt các dự án dở dang, dàn trải vô định không?",
  "4. Tôi có học được từ các quyết định quan trọng trong quá khứ không?",
  "5. Tôi có phát hiện sự lệch hướng sớm hơn trước khi quá muộn không?",
  "6. Tôi có tránh được việc mất quá nhiều thời gian chỉ để vận hành một hệ thống ghi chép cồng kềnh không?"
];

export const ROADMAP_MODULES = [
  { version: "v1.0 (Hiện tại)", title: "Core MVP", desc: "Command Center, Strategy & Identity, Execution & KPI Engine, Reflection & Decision Lab." },
  { version: "v2.0", title: "Knowledge OS & Smart Retrieval", desc: "Quản lý tri thức, tìm kiếm tài liệu thông minh, Copilot mở rộng, liên kết insight với quyết định." },
  { version: "v3.0", title: "Capital & Domain OS", desc: "Personal Finance, Career Capital, Writing OS, Learning & Skill Matrix." },
  { version: "v4.0", title: "Strategic Resource Allocation", desc: "Phân tích xu hướng dài hạn, cân đối nguồn lực tổng thể, tự động hóa có kiểm soát." }
];
