import type { Course } from "../src/types/course";
// Authored diagrams for the demo. Generated courses supply their own visual data.
export function addSampleVisuals(courses: Course[]) {
  const space = courses.find((c) => c.id === "space");
  if (space) {
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
}
