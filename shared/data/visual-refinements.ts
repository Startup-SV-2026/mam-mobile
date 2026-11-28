import type { Course } from "../types/course";

/**
 * Authored examples of the expanded visual system, thoroughly grounded in existing lesson text.
 * Each diagram is designed to provide clear pedagogical value, concrete examples, and deep comprehension.
 */
export function refineSampleVisuals(courses: Course[]) {
  // ── Khám phá Vũ trụ ────────────────────────────────────────────────────────
  const space = courses.find((c) => c.id === "space");
  if (space) {
    // Bài 1 (Trang 1) — Phân tầng không gian vũ trụ
    space.lessons[0].pages[0].visual = {
      kind: "layers",
      tone: "sky",
      title: "Địa chỉ phân tầng của Trái Đất trong vũ trụ",
      items: [
        {
          label: "Ngân Hà (Milky Way)",
          detail: "Thiên hà xoắn ốc khổng lồ chứa hơn 100 tỷ ngôi sao; Đường kính khoảng 100.000 năm ánh sáng.",
        },
        {
          label: "Hệ Mặt Trời",
          detail: "Nằm ở rìa nhánh Orion, cách tâm Ngân Hà ~26.000 năm ánh sáng; Gồm Mặt Trời và 8 hành tinh quay quanh.",
        },
        {
          label: "Trái Đất",
          detail: "Hành tinh thứ 3 từ Mặt Trời; Nơi duy nhất được xác nhận có nước lỏng và sự sống sinh sôi.",
        },
      ],
    };

    // Bài 1 (Trang 2) — Hành trình photon ánh sáng
    space.lessons[0].pages[1].visual = {
      kind: "steps",
      tone: "sky",
      title: "Hành trình photon từ Mặt Trời đến mắt bạn",
      items: [
        {
          label: "1 · Rời bề mặt Mặt Trời",
          detail: "Hạt ánh sáng (photon) thoát khỏi tầng quang cầu, bắt đầu bay với tốc độ 300.000 km/s.",
        },
        {
          label: "2 · Vượt 150 triệu km chân không",
          detail: "Mất chính xác 8 phút 20 giây (500 giây) để xuyên qua không gian liên hành tinh tĩnh lặng.",
        },
        {
          label: "3 · Chạm đến mắt người quan sát",
          detail: "Hình ảnh Mặt Trời bạn thấy trên bầu trời lúc này thực chất là quá khứ của hơn 8 phút trước.",
        },
      ],
    };

    // Bài 1 (Trang 3) — Phân biệt Một năm vs Năm ánh sáng
    space.lessons[0].pages[2].visual = {
      kind: "comparison",
      tone: "sky",
      title: "Phân biệt: Một năm vs Một năm ánh sáng",
      items: [
        {
          label: "Một năm thường",
          detail: "Bản chất: Thước đo thời gian; Chu kỳ: 365,25 ngày Trái Đất quay hết 1 vòng quanh Mặt Trời; Ứng dụng: Lịch sinh hoạt, đo tuổi tác và mùa màng.",
        },
        {
          label: "Một năm ánh sáng",
          detail: "Bản chất: Thước đo khoảng cách không gian; Quy mô: Khoảng 9.460 tỷ km (quãng đường ánh sáng bay liên tục suốt 1 năm); Ứng dụng: Đo khoảng cách giữa các ngôi sao.",
        },
      ],
    };

    // Bài 2 (Trang 2) — Hai chuyển động cốt lõi
    space.lessons[1].pages[1].visual = {
      kind: "metrics",
      tone: "sky",
      title: "Hai chuyển động cốt lõi định hình thời gian",
      items: [
        {
          value: "≈ 24 giờ",
          label: "Tự quay quanh trục",
          detail: "Tạo nên chu kỳ ngày và đêm luân phiên cho sinh vật nghỉ ngơi và tái tạo năng lượng.",
        },
        {
          value: "≈ 365,25 ngày",
          label: "Quỹ đạo quanh Mặt Trời",
          detail: "Kết hợp với trục nghiêng 23,5° tạo ra bốn mùa xuân, hạ, thu, đông trong năm.",
        },
      ],
    };

    // Bài 3 (Trang 2) — So sánh hai nhóm hành tinh
    space.lessons[2].pages[1].visual = {
      kind: "comparison",
      tone: "sky",
      title: "So sánh: Hành tinh Đất đá vs Khổng lồ Khí",
      items: [
        {
          label: "Hành tinh Đất đá (Vòng trong)",
          detail: "Gồm Thủy, Kim, Trái Đất, Hỏa; Bề mặt đất đá rắn chắc, mật độ vật chất cao; Kích thước nhỏ, ít hoặc không có vệ tinh tự nhiên.",
        },
        {
          label: "Khổng lồ Khí (Vòng ngoài)",
          detail: "Gồm Mộc, Thổ, Thiên Vương, Hải Vương; Cấu tạo chủ yếu từ Hydro và Heli; Thể tích khổng lồ, sở hữu nhiều vành đai và hàng chục mặt trăng.",
        },
      ],
    };
  }

  // ── Học cách Học & Tư duy ──────────────────────────────────────────────────
  const mind = courses.find((c) => c.id === "mind");
  if (mind) {
    // Bài 1 (Trang 3) — 3 Trụ cột ghi nhớ sâu
    mind.lessons[0].pages[2].visual = {
      kind: "steps",
      tone: "lavender",
      title: "3 Trụ cột Ghi nhớ Sâu (Evidence-Based)",
      items: [
        {
          label: "1 · Học ngắt quãng (Spaced)",
          detail: "Chia nhỏ buổi học thành từng phiên 25 phút (Pomodoro); Tránh nhồi nhét dồn cục gây quá tải nhận thức não bộ.",
        },
        {
          label: "2 · Chủ động gợi nhớ (Recall)",
          detail: "Tự gấp sách lại và diễn đạt kiến thức bằng lời của chính mình; Kích thích não bộ củng cố đường mòn thần kinh mới.",
        },
        {
          label: "3 · Lặp lại cách quãng (Repetition)",
          detail: "Ôn tập lại vào ngày 1, ngày 3, ngày 7; Đánh bại đường cong quên lãng Ebbinghaus để chuyển vào trí nhớ dài hạn.",
        },
      ],
    };

    // Bài 2 (Trang 1) — Vòng lặp thói quen
    mind.lessons[1].pages[0].visual = {
      kind: "cycle",
      tone: "lavender",
      title: "Vòng lặp thói quen 3 bước (Habit Loop)",
      expression: "Tự động hóa hành vi",
      items: [
        {
          label: "1 · Điểm kích hoạt (Cue)",
          detail: "Bối cảnh quen thuộc nhắc bạn bắt đầu (thời gian cố định, chuông báo hoặc hành động trước đó).",
        },
        {
          label: "2 · Hành động nhỏ (Routine)",
          detail: "Thực hiện phản xạ hành vi dễ dàng tốn dưới 2 phút (chống đẩy 5 cái, mở sách đọc 1 trang).",
        },
        {
          label: "3 · Phần thưởng (Reward)",
          detail: "Cảm giác hoàn thành giúp não tiết Dopamine; Khắc sâu hành vi thành bản năng tự động hàng ngày.",
        },
      ],
    };

    // Bài 3 (Trang 2) — Deep Work vs Shallow Work
    mind.lessons[2].pages[1].visual = {
      kind: "comparison",
      tone: "lavender",
      title: "Deep Work vs Shallow Work (Sâu vs Bề nổi)",
      items: [
        {
          label: "Deep Work (Làm việc sâu)",
          detail: "Tập trung 100% vào nhiệm vụ phức tạp, không đa nhiệm; Tắt mọi thông báo, đẩy não bộ đến giới hạn nhận thức; Tạo ra giá trị đột phá khó bị máy móc thay thế.",
        },
        {
          label: "Shallow Work (Bề nổi)",
          detail: "Vừa làm vừa lướt mạng, trả lời tin nhắn liên tục; Công việc sự vụ lặp đi lặp lại ít đòi hỏi tư duy cao; Gây kiệt sức ảo nhưng không tạo ra bước tiến thực chất.",
        },
      ],
    };
  }

  // ── Quản lý Tài chính Cá nhân ──────────────────────────────────────────────
  const money = courses.find((c) => c.id === "money");
  if (money) {
    // Bài 1 (Trang 1) — Phương trình dòng tiền
    money.lessons[0].pages[0].visual = {
      kind: "formula",
      tone: "sand",
      title: "Phương trình Dòng tiền Cá nhân",
      expression: "Thặng dư = Thu nhập − Chi tiêu",
      items: [
        {
          label: "Thu nhập thực nhận (Inflow)",
          detail: "Toàn bộ dòng tiền bạn kiếm được (tiền lương, kinh doanh, thu nhập thụ động sau thuế).",
        },
        {
          label: "Tổng chi tiêu (Outflow)",
          detail: "Toàn bộ sinh hoạt phí thiết yếu và mua sắm tiêu dùng phát sinh trong cùng kỳ.",
        },
        {
          label: "Thặng dư tài chính (Net Surplus)",
          detail: "Nguồn vốn giữ lại để xây dựng quỹ khẩn cấp 3–6 tháng và đầu tư tích sản sinh lời.",
        },
      ],
    };

    // Bài 1 (Trang 2) — Phân biệt Nhu cầu vs Mong muốn
    money.lessons[0].pages[1].visual = {
      kind: "comparison",
      tone: "peach",
      title: "Phân loại chi tiêu: Nhu cầu vs Mong muốn",
      items: [
        {
          label: "Nhu cầu thiết yếu (Needs)",
          detail: "Khoản chi bắt buộc để duy trì cuộc sống và công việc; Tiền thuê nhà, thực phẩm tươi, y tế, điện nước, xăng xe; Không thể cắt giảm về 0, nên duy trì dưới 50% thu nhập.",
        },
        {
          label: "Mong muốn cá nhân (Wants)",
          detail: "Khoản chi nâng cao tiện nghi và trải nghiệm sống; Ăn hàng quán sang, mua sắm theo sở thích, dịch vụ xem phim trực tuyến; Có thể linh hoạt cắt giảm hoặc trì hoãn khi cần tiết kiệm.",
        },
      ],
    };

    // Bài 2 (Trang 1) — Quy tắc 50/30/20
    money.lessons[1].pages[0].visual = {
      kind: "metrics",
      tone: "sand",
      title: "Quy tắc Phân bổ Ngân sách 50/30/20",
      items: [
        {
          value: "50%",
          label: "Nhu cầu Thiết yếu",
          detail: "Tiền thuê nhà, hóa đơn điện nước, thực phẩm cơ bản, xăng xe và y tế bắt buộc.",
        },
        {
          value: "30%",
          label: "Sở thích & Trải nghiệm",
          detail: "Gặp gỡ bạn bè, cà phê cuối tuần, mua sắm đồ dùng cá nhân và giải trí lành mạnh.",
        },
        {
          value: "20%",
          label: "Tích lũy & Tương lai",
          detail: "Quỹ dự phòng khẩn cấp 3-6 tháng, trả nợ gốc và đầu tư tích sản dài hạn.",
        },
      ],
    };
  }

  // ── Trí tuệ Nhân tạo Cơ bản ────────────────────────────────────────────────
  const ai = courses.find((c) => c.id === "ai");
  if (ai) {
    // Bài 1 (Trang 1) — Hai cách giải quyết bài toán
    ai.lessons[0].pages[0].visual = {
      kind: "comparison",
      tone: "peach",
      title: "Lập trình Truyền thống vs Học máy (Machine Learning)",
      items: [
        {
          label: "Lập trình Truyền thống (Rules)",
          detail: "Con người tự suy nghĩ và viết toàn bộ điều kiện If-Else; Chỉ xử lý được trường hợp đã biết trước; Bất lực trước dữ liệu phức tạp như nhận diện ảnh hay giọng nói.",
        },
        {
          label: "Học máy (Machine Learning)",
          detail: "Nạp hàng vạn ví dụ dữ liệu thực tế đã được gắn nhãn sẵn; Thuật toán tự tìm quy luật ẩn và tối ưu hàng triệu tham số; Nhận diện chính xác ngay cả với dữ liệu mờ hoặc góc chụp mới.",
        },
      ],
    };

    // Bài 1 (Trang 2) — 3 Giai đoạn phát triển mô hình AI
    ai.lessons[0].pages[1].visual = {
      kind: "steps",
      tone: "sky",
      title: "3 Giai đoạn Phát triển Mô hình AI",
      items: [
        {
          label: "1 · Thu thập & Làm sạch dữ liệu",
          detail: "Chuẩn bị tập dữ liệu đại diện chất lượng cao, loại bỏ nhiễu và gán nhãn chuẩn mực.",
        },
        {
          label: "2 · Huấn luyện & Tối ưu hóa (Training)",
          detail: "Thuật toán đo lường sai số (loss function) và tự điều chỉnh hàng triệu trọng số qua nhiều vòng lặp.",
        },
        {
          label: "3 · Đánh giá & Vận hành (Deployment)",
          detail: "Kiểm thử độ chính xác trên tập dữ liệu độc lập trước khi tích hợp vào sản phẩm thực tế.",
        },
      ],
    };

    // Bài 1 (Trang 3) — Cơ chế vận hành của ứng dụng AI
    ai.lessons[0].pages[2].visual = {
      kind: "concept-map",
      tone: "lavender",
      title: "Cơ chế Vận hành của Ứng dụng AI Hiện đại",
      items: [
        {
          label: "Đầu vào (Input)",
          detail: "Dữ liệu thô từ người dùng (câu lệnh prompt, hình ảnh chụp, đoạn ghi âm giọng nói).",
        },
        {
          label: "Xử lý nơ-ron (Model Processing)",
          detail: "Mạng nơ-ron sâu trích xuất đặc trưng, hiểu ngữ cảnh và tính toán xác suất đầu ra.",
        },
        {
          label: "Kiểm duyệt & Đầu ra (Output)",
          detail: "Bộ lọc an toàn kiểm tra tính chính xác và hiển thị phản hồi hữu ích cho người dùng.",
        },
      ],
    };
  }

  // ── Tiếng Anh Giao tiếp Hàng ngày ───────────────────────────────────────────
  const english = courses.find((c) => c.id === "english");
  if (english) {
    // Bài 1 (Trang 2) — Quy trình Small talk tự nhiên
    english.lessons[0].pages[1].visual = {
      kind: "steps",
      tone: "peach",
      title: "3 Bước Phá băng Tự nhiên (Small Talk Flow)",
      items: [
        {
          label: "1 · Bắt nhịp từ bối cảnh (Context Hook)",
          detail: "Nhận xét ngắn gọn về môi trường chung quanh (thời tiết, đồ uống, không gian quán).",
        },
        {
          label: "2 · Đặt câu hỏi mở (Open-ended)",
          detail: "Dùng 'How do you feel about...' thay vì câu hỏi Yes/No ngắn ngủi gây cụt lúng túng.",
        },
        {
          label: "3 · Lắng nghe & Đồng cảm (Active Listening)",
          detail: "Lặp lại từ khóa đối phương vừa nói và chia sẻ trải nghiệm tương tự để kết nối.",
        },
      ],
    };

    // Bài 2 (Trang 2) — For here vs To go
    english.lessons[1].pages[1].visual = {
      kind: "comparison",
      tone: "peach",
      title: "Phân biệt gọi món: For here vs To go",
      items: [
        {
          label: "For here (Dùng tại chỗ)",
          detail: "Trả lời tự nhiên: 'For here, please'; Dùng khi bạn muốn ngồi lại làm việc, đọc sách hay trò chuyện; Món ăn đồ uống được phục vụ trong cốc sứ hoặc đĩa thủy tinh.",
        },
        {
          label: "To go / Take away (Mang đi)",
          detail: "Trả lời tự nhiên: 'To go, please' (Mỹ) hoặc 'Take away' (Anh/Úc); Dùng khi bạn cần mang đồ đi vội; Đồ uống được đậy nắp chống tràn và cho vào túi xách tiện lợi.",
        },
      ],
    };
  }
}
