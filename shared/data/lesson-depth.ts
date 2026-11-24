import type { Course, LessonPage } from "../types/course";
// Authored teaching content for the introductory AI lesson; not generated output.
export function addLessonDepth(courses: Course[]) {
  const lesson = courses.find((c) => c.id === "ai")?.lessons[0];
  if (!lesson) return;
  lesson.objective =
    "Phân biệt quy tắc lập trình sẵn với mô hình học từ ví dụ, và xác định khi nào cần kiểm tra dự đoán của AI.";
  lesson.minutes = 8;
  const pages: Pick<
    LessonPage,
    "body" | "example" | "selfCheck" | "commonMistake"
  >[] = [
    {
      body: "Trí tuệ nhân tạo là lĩnh vực xây dựng hệ thống để thực hiện những nhiệm vụ như nhận diện hình ảnh, dự đoán hoặc xử lý ngôn ngữ. Học máy là một cách xây dựng AI: thay vì liệt kê mọi quy tắc, người phát triển dùng dữ liệu để mô hình học các mẫu hình. Không phải mọi hệ thống tự động đều dùng học máy.\n\nĐiểm cần phân biệt là cách hệ thống đưa ra kết quả: làm theo điều kiện được viết sẵn, hay áp dụng mẫu hình học được từ các ví dụ.",
      example: {
        scenario:
          "Một bộ lọc đánh dấu thư là rác nếu tiêu đề chứa đúng từ “trúng thưởng”. Bộ lọc khác được huấn luyện bằng nhiều thư đã gắn nhãn rác hoặc không rác.",
        explanation:
          "Bộ lọc thứ nhất chạy theo một quy tắc có sẵn. Bộ lọc thứ hai học quan hệ giữa đặc điểm của thư và nhãn từ dữ liệu, rồi dùng quan hệ đó để dự đoán thư mới. Cả hai đều tự động, nhưng chỉ mô tả thứ hai cho thấy có học máy.",
      },
      selfCheck: {
        question:
          "Ứng dụng báo thức reo đúng 7 giờ mỗi ngày. Chỉ dựa vào thông tin này, bạn có thể kết luận nó dùng học máy không? Vì sao?",
        hint: "Tìm bằng chứng hệ thống đã học từ dữ liệu, thay vì chỉ thực hiện một lịch đặt sẵn.",
        answer:
          "Không. Reo theo giờ đã đặt có thể được thực hiện bằng quy tắc đơn giản. Ta chưa có thông tin về dữ liệu huấn luyện hoặc một mô hình học từ ví dụ. Tự động hóa không đủ để kết luận có học máy.",
      },
      commonMistake:
        "Không đồng nhất “tự động” với “học máy”. Một điều kiện nếu–thì hoặc lịch hẹn cũng có thể tự động chạy mà không học từ dữ liệu.",
    },
    {
      body: "Trong học máy có giám sát, dữ liệu huấn luyện gồm các ví dụ và nhãn hoặc kết quả mong muốn. Mô hình điều chỉnh các tham số để giảm sai lệch trên những ví dụ đó. Sau huấn luyện, mô hình nhận đầu vào mới và đưa ra dự đoán.\n\nKết quả tốt trên dữ liệu đã thấy chưa đủ: cần đánh giá bằng các ví dụ chưa dùng để huấn luyện. Nếu dữ liệu quá hẹp hoặc chứa dấu hiệu gây nhầm lẫn, mô hình có thể học một quan hệ không đáng tin cậy.",
      example: {
        scenario:
          "Bạn huấn luyện bộ phân loại mèo và chó. Trong ảnh huấn luyện, tất cả mèo nằm trên ghế, còn tất cả chó đứng ngoài sân.",
        explanation:
          "Mô hình có thể dựa vào nền ghế hoặc sân thay vì đặc điểm con vật. Hãy thử bằng ảnh mới, trong đó có mèo ngoài sân và chó trên ghế. Nếu kết quả giảm mạnh, cần xem lại dữ liệu và cách mô hình học; không thể chỉ dựa vào điểm trên tập huấn luyện.",
      },
      selfCheck: {
        question:
          "Mô hình nhận diện trái cây chỉ được huấn luyện bằng ảnh chụp đủ sáng. Nó có thể gặp vấn đề gì khi dùng ban đêm, và bạn sẽ kiểm tra thế nào?",
        hint: "So sánh điều kiện của dữ liệu huấn luyện và điều kiện sử dụng.",
        answer:
          "Mô hình có thể dự đoán kém hơn vì ánh sáng khác làm thay đổi đặc điểm đầu vào. Hãy đánh giá bằng ảnh ban đêm chưa được dùng để huấn luyện, rồi phân tích lỗi. Điểm tốt trên ảnh ban ngày không chứng minh nó hoạt động tốt trong mọi điều kiện.",
      },
      commonMistake:
        "“Dự đoán đúng nhiều ví dụ” không có nghĩa mô hình hiểu như con người hoặc sẽ đúng trong mọi hoàn cảnh. Phạm vi dữ liệu và điều kiện sử dụng đều ảnh hưởng kết quả.",
    },
    {
      body: "Để hiểu một ứng dụng AI, hãy xác định ba phần: dữ liệu đầu vào, nhiệm vụ mô hình cần làm và cách kiểm tra đầu ra. Công cụ dịch nhận văn bản rồi tạo bản dịch; hệ thống gợi ý nhận các tín hiệu tương tác rồi xếp hạng nội dung. Hai nhiệm vụ này có cách đánh giá khác nhau.\n\nMột kết quả có vẻ hợp lý vẫn có thể sai. Mức kiểm tra nên phù hợp hậu quả: gợi ý bài hát có thể thử trực tiếp, nhưng bản dịch hướng dẫn quan trọng cần đối chiếu kỹ hơn.",
      example: {
        scenario:
          "Bạn dùng công cụ dịch để chuyển một hướng dẫn sử dụng máy sang tiếng Việt. Bản dịch trôi chảy nhưng câu về việc ngắt nguồn trước khi vệ sinh bị đảo nghĩa.",
        explanation:
          "Đầu vào là hướng dẫn gốc; nhiệm vụ là giữ đúng nghĩa khi chuyển ngôn ngữ. Sự trôi chảy chỉ phản ánh một mặt chất lượng. Cần đối chiếu những câu quyết định hành động, đặc biệt phủ định và điều kiện, với văn bản gốc hoặc người có chuyên môn.",
      },
      selfCheck: {
        question:
          "Ứng dụng gợi ý một video và công cụ dịch một điều khoản hợp đồng đều dùng AI. Bạn có nên kiểm tra hai đầu ra với cùng mức độ không?",
        hint: "Xét hậu quả nếu dự đoán sai, chứ không chỉ xét việc có dùng AI hay không.",
        answer:
          "Không nhất thiết. Với video, bạn có thể xem thử và bỏ qua nếu không phù hợp. Với điều khoản hợp đồng, sai nghĩa có thể ảnh hưởng quyết định quan trọng nên cần đối chiếu nguồn và nhờ người có chuyên môn khi cần. Mức kiểm tra phụ thuộc nhiệm vụ và hậu quả.",
      },
      commonMistake:
        "Không dùng một tiêu chí duy nhất cho mọi AI. “Nghe tự nhiên” có thể hữu ích khi chọn giọng đọc, nhưng không đủ để xác nhận một bản dịch đúng nghĩa.",
    },
  ];
  lesson.pages = lesson.pages.map((p: LessonPage, i: number) => ({ ...p, ...pages[i] }));
  lesson.quiz = {
    question:
      "Bộ lọc A chặn thư theo danh sách từ cố định. Bộ lọc B học từ thư đã gắn nhãn và được thử trên thư mới. Nhận định nào có cơ sở nhất?",
    choices: [
      "Cả hai đều học máy vì đều chạy tự động.",
      "B có học máy; việc thử trên thư mới giúp đánh giá khả năng áp dụng ngoài dữ liệu huấn luyện.",
      "A có học máy vì danh sách từ là dữ liệu.",
      "B sẽ luôn đúng vì đã được huấn luyện.",
    ],
    answer: 1,
    why: "A dùng quy tắc cố định; mô tả của B có quá trình học từ ví dụ. Kiểm tra trên thư mới giúp đánh giá khả năng áp dụng, nhưng không bảo đảm mọi dự đoán tương lai đều đúng.",
  };
}
