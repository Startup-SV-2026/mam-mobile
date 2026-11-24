import type { Course } from "../types/course";
// Authored examples of the expanded visual system, grounded in existing lesson text.
export function refineSampleVisuals(courses: Course[]) {
  const space = courses.find((c) => c.id === "space");
  if (space) {
    space.lessons[0].pages[0].visual = {
      kind: "layers",
      tone: "sky",
      title: "Địa chỉ của chúng ta trong vũ trụ",
      items: [
        { label: "Ngân Hà", detail: "Thiên hà chứa Hệ Mặt Trời." },
        { label: "Hệ Mặt Trời", detail: "Một hệ hành tinh nằm trong Ngân Hà." },
        {
          label: "Trái Đất",
          detail: "Hành tinh nơi chúng ta sống, thuộc Hệ Mặt Trời.",
        },
      ],
    };
    space.lessons[1].pages[1].visual = {
      kind: "metrics",
      tone: "sky",
      title: "Hai chuyển động, hai khoảng thời gian",
      items: [
        {
          value: "≈ 24 giờ",
          label: "Một ngày",
          detail: "Thời gian gần đúng của một ngày Mặt Trời.",
        },
        {
          value: "≈ 365,25 ngày",
          label: "Một năm",
          detail: "Thời gian gần đúng Trái Đất đi một vòng quanh Mặt Trời.",
        },
      ],
    };
  }
  const mind = courses.find((c) => c.id === "mind");
  if (mind)
    mind.lessons[0].pages[2].visual = {
      kind: "concept-map",
      tone: "lavender",
      title: "Học thành từng phần",
      items: [
        {
          label: "Học ngắn",
          detail: "Tập trung vào một phần kiến thức trong mỗi lần học.",
        },
        {
          label: "Tự kiểm tra",
          detail: "Thử nhớ lại bằng lời của bạn thay vì chỉ đọc lại.",
        },
        {
          label: "Ôn đều",
          detail: "Quay lại kiến thức đã học ở những lần tiếp theo.",
        },
      ],
    };
  const money = courses.find((c) => c.id === "money");
  if (money) {
    money.lessons[0].pages[0].visual = {
      kind: "formula",
      tone: "sand",
      title: "Nhìn rõ dòng tiền",
      expression: "Còn lại = Thu nhập − Chi tiêu",
      items: [
        { label: "Thu nhập", detail: "Các khoản tiền bạn nhận được trong kỳ." },
        { label: "Chi tiêu", detail: "Các khoản tiền đã dùng trong cùng kỳ." },
        {
          label: "Phần còn lại",
          detail: "Số tiền còn sau khi trừ chi tiêu khỏi thu nhập.",
        },
      ],
    };
    money.lessons[0].pages[1].visual = {
      kind: "comparison",
      tone: "peach",
      title: "Cần và muốn",
      items: [
        {
          label: "Nhu cầu cần thiết",
          detail:
            "Ưu tiên các khoản phục vụ nhu cầu cơ bản và nghĩa vụ hiện tại.",
        },
        {
          label: "Điều mình muốn",
          detail:
            "Cân nhắc các khoản tùy chọn theo ngân sách và ưu tiên của bạn.",
        },
      ],
    };
  }
  const ai = courses.find((c) => c.id === "ai");
  if (ai) {
    ai.lessons[0].pages[0].visual = {
      kind: "comparison",
      tone: "peach",
      title: "Hai cách giải quyết bài toán",
      items: [
        {
          label: "Quy tắc lập trình",
          detail: "Con người tự viết điều kiện nếu–thì; Chỉ xử lý trường hợp biết trước; Khó mở rộng với dữ liệu lớn.",
        },
        {
          label: "Học từ ví dụ (ML)",
          detail: "Hệ thống tự học mẫu hình từ dữ liệu; Tự tổng quát hóa quy luật ẩn; Thích ứng tốt với dữ liệu mới.",
        },
      ],
    };
    ai.lessons[0].pages[1].visual = {
      kind: "steps",
      tone: "sky",
      title: "Quy trình xây dựng mô hình AI",
      items: [
        {
          label: "Thu thập & gắn nhãn",
          detail: "Chuẩn bị tập dữ liệu ví dụ thực tế được kiểm chứng kỹ.",
        },
        {
          label: "Huấn luyện mô hình",
          detail: "Hệ thống tự điều chỉnh tham số để giảm thiểu sai số.",
        },
        {
          label: "Đánh giá & triển khai",
          detail: "Đo lường độ chính xác trên dữ liệu kiểm thử độc lập.",
        },
      ],
    };
    ai.lessons[0].pages[2].visual = {
      kind: "concept-map",
      tone: "lavender",
      title: "Hiểu một ứng dụng AI",
      items: [
        {
          label: "Đầu vào",
          detail: "Thông tin hệ thống nhận, như văn bản hoặc hình ảnh.",
        },
        {
          label: "Nhiệm vụ",
          detail: "Việc mô hình cần làm, như dự đoán hoặc chuyển ngôn ngữ.",
        },
        {
          label: "Kiểm tra",
          detail: "Đánh giá đầu ra theo nhiệm vụ và hậu quả nếu có sai sót.",
        },
      ],
    };
  }
  const english = courses.find((c) => c.id === "english");
  if (english)
    english.lessons[1].pages[1].visual = {
      kind: "comparison",
      tone: "peach",
      title: "Dùng tại quán hay mang đi?",
      items: [
        { label: "For here", detail: "Dùng món tại quán." },
        { label: "To go", detail: "Mang món đi." },
      ],
    };
}
