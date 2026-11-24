import type { Course } from "../types/course";
// Authored diagrams for the demo. Generated courses supply their own visual data.
export function addSampleVisuals(courses: Course[]) {
  const space = courses.find((c) => c.id === "space");
  if (space) {
    space.lessons[0].sampleIllustration = "space";
    space.lessons[0].pages[0].visual = {
      kind: "comparison",
      title: "Địa chỉ của chúng ta trong vũ trụ",
      items: [
        { label: "Trái Đất", detail: "Hành tinh nơi chúng ta đang sống." },
        {
          label: "Hệ Mặt Trời",
          detail: "Mặt Trời và các thiên thể quay quanh nó.",
        },
        {
          label: "Ngân Hà",
          detail: "Thiên hà chứa Hệ Mặt Trời và hàng trăm tỉ ngôi sao.",
        },
      ],
    };
    space.lessons[0].pages[1].visual = {
      kind: "steps",
      title: "Hành trình của ánh sáng",
      items: [
        {
          label: "1 · Mặt Trời",
          detail: "Ánh sáng bắt đầu hành trình từ Mặt Trời.",
        },
        {
          label: "2 · Khoảng 8 phút 20 giây",
          detail: "Thời gian ánh sáng đi đến Trái Đất.",
        },
        {
          label: "3 · Điều bạn nhìn thấy",
          detail: "Hình ảnh Mặt Trời ở thời điểm hơn 8 phút trước.",
        },
      ],
    };
    space.lessons[0].pages[2].visual = {
      kind: "comparison",
      title: "Cùng phân biệt hai đại lượng",
      items: [
        { label: "Một năm", detail: "Đơn vị đo thời gian." },
        {
          label: "Một năm ánh sáng",
          detail:
            "Đơn vị đo khoảng cách: quãng đường ánh sáng đi trong một năm.",
        },
      ],
    };
  }
  const habit = courses.find((c) => c.id === "mind")?.lessons[1];
  if (habit)
    habit.pages[0].visual = {
      kind: "cycle",
      title: "Một vòng lặp thói quen",
      items: [
        {
          label: "1 · Tín hiệu",
          detail: "Bối cảnh quen thuộc nhắc bạn bắt đầu.",
        },
        {
          label: "2 · Hành động",
          detail: "Bạn thực hiện một việc nhỏ, cụ thể.",
        },
        {
          label: "3 · Kết quả",
          detail: "Kết quả nhận được góp phần củng cố vòng lặp.",
        },
      ],
    };
  const ai = courses.find((c) => c.id === "ai");
  if (ai)
    ai.lessons[0].pages[0].visual = {
      kind: "steps",
      title: "Máy học từ ví dụ",
      items: [
        {
          label: "Dữ liệu",
          detail: "Các ví dụ đầu vào, chẳng hạn hình ảnh hoặc văn bản.",
        },
        {
          label: "Học mẫu hình",
          detail: "Mô hình điều chỉnh dựa trên các ví dụ khi huấn luyện.",
        },
        {
          label: "Áp dụng",
          detail:
            "Dùng điều đã học để nhận diện hoặc dự đoán trên dữ liệu mới.",
        },
      ],
    };


  // ── Nhà Trần & Ba lần kháng Mông Nguyên ──────────────────────────────
  const tran = courses.find((c) => c.id === "tran-mong");
  if (tran) {
    // Bài 1 (Chương 1) — Vó ngựa thảo nguyên (3 trang)
    tran.lessons[0].sampleIllustration = "tran-1";
    tran.lessons[0].illustrationPlan = {
      scene: "Đoàn kỵ binh Mông Cổ hùng mạnh hành quân qua đèo núi phía Bắc Đại Việt năm 1258, trong khi các chiến sĩ Đại Việt bí mật theo dõi từ rừng cây.",
      caption: "Minh họa tái dựng cảnh quân Mông Cổ tiến vào Đại Việt năm 1258; không phải tư liệu gốc.",
      alt: "Kỵ binh Mông Cổ hành quân qua đèo núi, lính Đại Việt ẩn trong rừng quan sát.",
    };
    tran.lessons[0].pages[0].visual = {
      kind: "comparison",
      title: "Tương quan lực lượng năm 1258",
      items: [
        { label: "Đế quốc Mông Cổ", detail: "Đế chế lớn nhất thế giới, bách chiến bách thắng khắp Á-Âu." },
        { label: "Đại Việt", detail: "Nước nhỏ nhưng địa hình hiểm trở và ý chí quyết không hàng." },
      ],
    };

    // Bài 2 (Chương 1) — Vườn không nhà trống (3 trang)
    tran.lessons[1].pages[0].visual = {
      kind: "steps",
      title: "Kế sách “Vườn không nhà trống”",
      items: [
        { label: "1 · Rút lui", detail: "Chủ động bỏ thành Thăng Long, di tản toàn bộ nhân dân." },
        { label: "2 · Tiêu huỷ", detail: "Đốt sạch kho lương, triệt tiêu mọi nguồn tiếp tế của giặc." },
        { label: "3 · Phản công", detail: "Đợi giặc đói khát suy kiệt, tung đòn quyết định tại Đông Bộ Đầu." },
      ],
    };

    // Bài 3 (Chương 2) — 50 vạn quân Nguyên (2 trang)
    tran.lessons[2].pages[0].visual = {
      kind: "comparison",
      title: "Quy mô hai đợt xâm lược",
      items: [
        { label: "Năm 1258 (Lần 1)", detail: "3 vạn kỵ binh Mông Cổ theo đường bộ phía Bắc." },
        { label: "Năm 1285 (Lần 2)", detail: "50 vạn quân Nguyên thuỷ bộ hiệp đồng, kẹp hai đầu Nam - Bắc." },
      ],
    };

    // Bài 4 (Chương 2) — Hội nghị Diên Hồng (3 trang)
    tran.lessons[3].sampleIllustration = "tran-2";
    tran.lessons[3].illustrationPlan = {
      scene: "Hội nghị Diên Hồng 1284: hàng nghìn bô lão và dân chúng đồng loạt giơ nắm đấm hô vang trong đại điện hoàng cung, nhà vua ngồi trên ngai vàng.",
      caption: "Minh họa tái dựng Hội nghị Diên Hồng năm 1284; không phải tư liệu gốc.",
      alt: "Vua Trần trên ngai vàng, hàng nghìn bô lão đồng loạt hô vang Đánh trong đại điện.",
    };
    tran.lessons[3].pages[1].visual = {
      kind: "steps",
      title: "Tiến trình Hội nghị Diên Hồng",
      items: [
        { label: "1 · Triệu tập", detail: "Mời các bậc bô lão uy tín nhất cả nước về hoàng cung." },
        { label: "2 · Hỏi ý dân", detail: "Nhà vua đặt câu hỏi sinh tử: “Nên hoà hay nên đánh?”" },
        { label: "3 · Đồng thanh", detail: "Muôn người như một thét vang tiếng “ĐÁNH!” rúng động kinh thành." },
      ],
    };

    // Bài 5 (Chương 2) — Hịch tướng sĩ & Thăng Long (4 trang)
    tran.lessons[4].pages[2].visual = {
      kind: "timeline",
      title: "Chuỗi đại thắng mùa hè 1285",
      items: [
        { label: "Hàm Tử", detail: "Trần Nhật Duật chỉ huy bẻ gãy đạo thuỷ quân tinh nhuệ Toa Đô." },
        { label: "Chương Dương", detail: "Trần Quang Khải đốt cháy chiến thuyền giặc, giải phóng bến sông." },
        { label: "Thăng Long", detail: "Thu hồi hoàn toàn kinh đô, Thoát Hoan chui ống đồng tháo chạy." },
      ],
    };

    // Bài 6 (Chương 3) — Trận Bạch Đằng (4 trang)
    tran.lessons[5].sampleIllustration = "tran-3";
    tran.lessons[5].illustrationPlan = {
      scene: "Trận Bạch Đằng 1288: thuyền chiến Mông Nguyên bị cọc sắt đâm thủng và bốc cháy khi thuỷ triều rút, quân Trần trên thuyền nhỏ và bờ sông reo hò chiến thắng.",
      caption: "Minh họa tái dựng trận Bạch Đằng năm 1288; bãi cọc và vị trí thuyền chỉ mang tính tượng trưng.",
      alt: "Thuyền Mông Nguyên bốc cháy và chìm xuống sông Bạch Đằng vì cọc sắt, quân Trần chiến thắng.",
    };
    tran.lessons[5].pages[1].visual = {
      kind: "steps",
      title: "Mưu kế bãi cọc Bạch Đằng",
      items: [
        { label: "1 · Cắm cọc", detail: "Đóng hàng ngàn cọc gỗ bọc sắt chìm dưới nước lúc triều dâng." },
        { label: "2 · Nhử địch", detail: "Thuyền nhỏ Đại Việt dụ đoàn thuyền Ô Mã Nhi vượt qua bãi cọc." },
        { label: "3 · Đón triều rút", detail: "Nước hạ nhanh, cọc nhô lên xé toạc đáy tàu giặc." },
      ],
    };

    // Bài 7 (Chương 3) — Khoan thư sức dân (2 trang)
    tran.lessons[6].pages[1].visual = {
      kind: "cycle",
      title: "3 trụ cột thành công vượt thời gian",
      items: [
        { label: "1 · Trí tuệ", detail: "Lấy yếu chống mạnh, dùng thiên nhiên và địa hình làm vũ khí." },
        { label: "2 · Đoàn kết", detail: "Vua tôi đồng lòng, anh em hoà thuận, cả nước chung sức." },
        { label: "3 · Bền gốc", detail: "Khoan thư sức dân, tích luỹ nội lực từ nền tảng vững chắc." },
      ],
    };
  }

  // ── IELTS & SAT Lexicon Mastery ──────────────────────────────────────
  const vocabCourse = courses.find((c) => c.id === "ielts-sat");
  if (vocabCourse) {
    // Bài 1 — Phân biệt bằng chứng thực nghiệm
    vocabCourse.lessons[0].pages[1].visual = {
      kind: "comparison",
      title: "Empirical vs Theoretical",
      items: [
        { label: "Empirical (Thực nghiệm)", detail: "Dựa trên số liệu đo đạc thực tế, thí nghiệm và bằng chứng quan sát được." },
        { label: "Theoretical (Lý thuyết)", detail: "Dựa trên mô hình giả định và suy luận trừu tượng chưa qua kiểm chứng." },
      ],
    };

    // Bài 2 — Vòng lặp nhận thức
    vocabCourse.lessons[1].pages[0].visual = {
      kind: "cycle",
      title: "Vòng lặp Thiên kiến nhận thức",
      items: [
        { label: "1 · Heuristic", detail: "Bộ não dùng đường tắt kinh nghiệm để ra quyết định nhanh." },
        { label: "2 · Bias", detail: "Bỏ qua các dữ kiện trái chiều để bảo vệ niềm tin cũ." },
        { label: "3 · Fallacy", detail: "Rơi vào kết luận ngụy biện mà tưởng mình sáng suốt." },
      ],
    };

    // Bài 4 — Tiến trình thay đổi mô thức
    vocabCourse.lessons[3].pages[2].visual = {
      kind: "steps",
      title: "Cách một Paradigm Shift diễn ra",
      items: [
        { label: "1 · Mô thức cũ", detail: "Lý thuyết truyền thống thống trị nhưng bắt đầu bộc lộ lỗ hổng." },
        { label: "2 · Khủng hoảng", detail: "Hàng loạt hiện tượng bất thường không thể giải thích bằng quy luật cũ." },
        { label: "3 · Cách mạng tư duy", detail: "Mô thức mới ra đời (Paradigm shift), tái định hình toàn bộ ngành." },
      ],
    };

    // Bài 5 — Cặp từ đối lập Môi trường
    vocabCourse.lessons[4].pages[1].visual = {
      kind: "comparison",
      title: "Cặp đối lập: Mitigate vs Exacerbate",
      items: [
        { label: "Mitigate (Làm dịu)", detail: "Hành động giảm bớt tác hại: 'Trees mitigate urban heat islands'." },
        { label: "Exacerbate (Làm trầm trọng)", detail: "Hành vi làm tệ thêm: 'Deforestation exacerbates flooding'." },
      ],
    };

    // Bài 7 — Bẫy từ SAT
    vocabCourse.lessons[6].pages[0].visual = {
      kind: "comparison",
      title: "Bẫy SAT: Disinterested vs Uninterested",
      items: [
        { label: "Disinterested (Công tâm)", detail: "Hoàn toàn vô tư, không vụ lợi cá nhân (phẩm chất của thẩm phán)." },
        { label: "Uninterested (Thờ ơ)", detail: "Đơn thuần là chán chường, không có hứng thú với chủ đề." },
      ],
    };

    // Bài 8 — Gốc đối lập
    vocabCourse.lessons[7].pages[2].visual = {
      kind: "comparison",
      title: "Cặp tiền tố vàng: Bene- vs Mal-",
      items: [
        { label: "Bene- (Tốt / Phúc lành)", detail: "Beneficial (có lợi), Benevolent (nhân từ), Benefactor (ân nhân)." },
        { label: "Mal- (Xấu / Độc hại)", detail: "Malicious (ác ý), Malfunction (hỏng hóc), Malevolent (hiểm độc)." },
      ],
    };
  }
}
