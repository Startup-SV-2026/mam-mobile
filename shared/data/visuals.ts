import type { Course } from "../types/course";

/**
 * Authored diagrams for demo courses.
 * Grounded in historical facts and academic vocabulary contexts.
 */
export function addSampleVisuals(courses: Course[]) {
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
        {
          label: "Đế quốc Mông Cổ",
          detail: "Kỵ binh thảo nguyên bách chiến bách thắng khắp Á-Âu; Tốc độ hành quân thần tốc, bắn cung trên lưng ngựa chuẩn xác; Thiếu kinh nghiệm tác chiến rừng rậm nhiệt đới.",
        },
        {
          label: "Đại Việt thời Trần",
          detail: "Quân đội tinh nhuệ, gắn bó mật thiết với nhân dân; Am hiểu địa hình đầm lầy sông ngòi hiểm trở; Ý chí 'Sát Thát' quật cường, sẵn sàng hy sinh bảo vệ non sông.",
        },
      ],
    };

    // Bài 2 (Chương 1) — Vườn không nhà trống (3 trang)
    tran.lessons[1].pages[0].visual = {
      kind: "steps",
      title: "Kế sách “Vườn không nhà trống”",
      items: [
        {
          label: "1 · Rút lui chiến lược",
          detail: "Chủ động bỏ thành Thăng Long, sơ tán toàn bộ hoàng triều và nhân dân về vùng an toàn.",
        },
        {
          label: "2 · Triệt tiêu hậu cần",
          detail: "Đốt sạch kho lương, mang đi mọi gia súc; Biến kinh thành thành chiếc bẫy đói khát cho quân giặc.",
        },
        {
          label: "3 · Phản công quyết định",
          detail: "Đợi giặc suy kiệt vì dịch bệnh và thiếu đói, bất ngờ tung đòn sấm sét tại Đông Bộ Đầu.",
        },
      ],
    };

    // Bài 3 (Chương 2) — 50 vạn quân Nguyên (2 trang)
    tran.lessons[2].pages[0].visual = {
      kind: "comparison",
      title: "Quy mô hai đợt xâm lược",
      items: [
        {
          label: "Năm 1258 (Lần 1)",
          detail: "Quân số: 3 vạn kỵ binh Mông Cổ tinh nhuệ của Ngột Lương Hợp Thai; Hướng tiến công: Độc đạo men theo sông Hồng từ Vân Nam xuống.",
        },
        {
          label: "Năm 1285 (Lần 2)",
          detail: "Quân số: 50 vạn quân Nguyên - Hán hợp đồng thủy bộ khổng lồ; Hướng tiến công: Thoát Hoan đánh từ Bắc xuống, Toa Đô kẹp từ Nam lên.",
        },
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
        {
          label: "1 · Triệu tập bô lão",
          detail: "Mời các bậc phụ lão uy tín đại diện cho ý chí nhân dân từ khắp các làng xã về kinh đô.",
        },
        {
          label: "2 · Nhà vua hỏi kế",
          detail: "Vua Trần Thánh Tông đặt câu hỏi sinh tử trước triều đình: 'Nên hòa hay nên đánh?'.",
        },
        {
          label: "3 · Đồng thanh quyết tử",
          detail: "Muôn người như một thét vang tiếng 'ĐÁNH!' rúng động hoàng thành, kết tinh thành sức mạnh toàn dân.",
        },
      ],
    };

    // Bài 5 (Chương 2) — Hịch tướng sĩ & Thăng Long (4 trang)
    tran.lessons[4].pages[2].visual = {
      kind: "timeline",
      title: "Chuỗi đại thắng mùa hè 1285",
      items: [
        {
          label: "Hàm Tử (Tháng 5)",
          detail: "Trần Nhật Duật dùng kế ly gián và thủy quân tiêu diệt đạo quân Toa Đô.",
        },
        {
          label: "Chương Dương (Tháng 6)",
          detail: "Trần Quang Khải đốt cháy chiến thuyền giặc, giải phóng bến sông huyết mạch.",
        },
        {
          label: "Thăng Long (Tháng 6)",
          detail: "Thu hồi hoàn toàn kinh đô, Thoát Hoan phải chui vào ống đồng trốn chạy về phương Bắc.",
        },
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
        {
          label: "1 · Cắm bãi cọc ngầm",
          detail: "Đóng hàng ngàn cọc gỗ bọc sắt nhọn bịt kín lòng sông Bạch Đằng, chìm sâu khi triều dâng.",
        },
        {
          label: "2 · Nhử chiến thuyền giặc",
          detail: "Thuyền nhẹ Đại Việt vờ thua rút chạy, dụ toàn bộ hạm đội Ô Mã Nhi tiến sâu qua bãi cọc.",
        },
        {
          label: "3 · Đón dòng triều rút",
          detail: "Nước sông rút cực nhanh, cọc nhô lên xé toạc đáy tàu; Quân Trần từ hai bên bờ tổng phản công.",
        },
      ],
    };

    // Bài 7 (Chương 3) — Khoan thư sức dân (2 trang)
    tran.lessons[6].pages[1].visual = {
      kind: "cycle",
      title: "3 Trụ cột thành công vượt thời gian",
      expression: "Đoàn kết & Sâu rễ bền gốc",
      items: [
        {
          label: "1 · Trí tuệ quân sự",
          detail: "Lấy đoản binh thắng trường trận, lấy yếu chế mạnh, dùng thiên thời và địa hình hiểm trở làm vũ khí.",
        },
        {
          label: "2 · Đồng lòng nhất trí",
          detail: "Vua tôi đồng lòng, anh em hòa mục, cả nước góp sức tạo nên khối đại đoàn kết vô địch.",
        },
        {
          label: "3 · Khoan thư sức dân",
          detail: "Bồi dưỡng sức dân làm kế sâu rễ bền gốc, coi dân là nền tảng của mọi sự thịnh suy lâu dài.",
        },
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
        {
          label: "Empirical (Thực nghiệm)",
          detail: "Dựa trên số liệu đo đạc thực tế, thí nghiệm và bằng chứng quan sát được; Ví dụ: 'Empirical research confirms the drug's safety'; Điểm then chốt trong IELTS Reading & Task 2.",
        },
        {
          label: "Theoretical (Lý thuyết)",
          detail: "Dựa trên mô hình toán học và suy luận trừu tượng chưa qua kiểm chứng thực tế; Ví dụ: 'Theoretical physics predicts phenomena before discovery'; Dùng khi thảo luận giả thuyết khoa học.",
        },
      ],
    };

    // Bài 2 — Vòng lặp nhận thức
    vocabCourse.lessons[1].pages[0].visual = {
      kind: "cycle",
      title: "Vòng lặp Thiên kiến nhận thức",
      expression: "Lối tắt dẫn tới ngụy biện",
      items: [
        {
          label: "1 · Heuristic (Lối tắt)",
          detail: "Bộ não dùng đường tắt kinh nghiệm để ra quyết định tức thì mà không phân tích kỹ.",
        },
        {
          label: "2 · Confirmation Bias",
          detail: "Chỉ tìm kiếm và ghi nhớ bằng chứng ủng hộ niềm tin cũ, phớt lờ số liệu trái chiều.",
        },
        {
          label: "3 · Logical Fallacy",
          detail: "Rơi vào kết luận ngụy biện mang tính hệ thống mà tưởng mình hoàn toàn khách quan.",
        },
      ],
    };

    // Bài 4 — Tiến trình thay đổi mô thức
    vocabCourse.lessons[3].pages[2].visual = {
      kind: "steps",
      title: "Cách một Paradigm Shift diễn ra",
      items: [
        {
          label: "1 · Khung mẫu cũ (Normal Science)",
          detail: "Mô hình lý thuyết hiện hành thống trị và được đại đa số giới khoa học công nhận là chân lý.",
        },
        {
          label: "2 · Dị biệt & Khủng hoảng (Anomaly)",
          detail: "Hàng loạt hiện tượng thực tế mâu thuẫn xuất hiện mà quy luật cũ hoàn toàn không giải thích nổi.",
        },
        {
          label: "3 · Cách mạng mô thức (Shift)",
          detail: "Một hệ thống tư duy hoàn toàn mới ra đời, phá vỡ lối mòn và tái định hình toàn bộ ngành.",
        },
      ],
    };

    // Bài 5 — Cặp từ đối lập Môi trường
    vocabCourse.lessons[4].pages[1].visual = {
      kind: "comparison",
      title: "Cặp đối lập: Mitigate vs Exacerbate",
      items: [
        {
          label: "Mitigate (Làm dịu / Giảm nhẹ)",
          detail: "Hành động chủ động giảm bớt mức độ nghiêm trọng hay thiệt hại; Ví dụ: 'Planting trees mitigates urban heat islands'; Sắc thái tích cực, mang tính khắc phục vấn đề.",
        },
        {
          label: "Exacerbate (Làm trầm trọng)",
          detail: "Hành vi hoặc yếu tố khiến vấn đề vốn đã xấu trở nên tồi tệ hơn; Ví dụ: 'Deforestation exacerbates severe flash floods'; Sắc thái tiêu cực, cảnh báo nguy cơ lớn.",
        },
      ],
    };

    // Bài 7 — Bẫy từ SAT
    vocabCourse.lessons[6].pages[0].visual = {
      kind: "comparison",
      title: "Bẫy SAT: Disinterested vs Uninterested",
      items: [
        {
          label: "Disinterested (Công tâm / Vô tư)",
          detail: "Hoàn toàn công bằng, không bị chi phối bởi tư lợi cá nhân; Phẩm chất bắt buộc của thẩm phán, trọng tài, hội đồng giám khảo; Điểm phân loại học sinh giỏi trong SAT Reading.",
        },
        {
          label: "Uninterested (Thờ ơ / Không màng)",
          detail: "Đơn thuần là cảm giác chán nản, không có bất kỳ hứng thú hay sự chú ý nào đối với chủ đề; Biểu thị thái độ cảm xúc cá nhân thông thường.",
        },
      ],
    };

    // Bài 8 — Gốc đối lập
    vocabCourse.lessons[7].pages[2].visual = {
      kind: "comparison",
      title: "Cặp tiền tố vàng: Bene- vs Mal-",
      items: [
        {
          label: "Bene- (Tốt đẹp / Lương thiện)",
          detail: "Bắt nguồn từ tiếng Latin 'bonus' mang ý nghĩa phúc lành; Từ vựng vàng: Beneficial (có lợi), Benevolent (nhân từ), Benefactor (ân nhân bảo trợ).",
        },
        {
          label: "Mal- (Xấu xa / Độc hại)",
          detail: "Mang ý nghĩa tiêu cực, hư hỏng hoặc có hại; Từ vựng vàng: Malicious (ác ý), Malfunction (trục trặc kỹ thuật), Malevolent (hiểm ác, độc địa).",
        },
      ],
    };
  }
}
