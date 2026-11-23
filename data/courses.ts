import { refineSampleVisuals } from "./visual-refinements";
import { addLessonDepth } from "./lesson-depth";
import { addSampleVisuals } from "./visuals";
import type { Course, Lesson, LessonPage } from "../src/types/course";
// Curated Vietnamese lessons. All lessons below are authored sample content, not AI output.
const lesson = (
  title: string,
  subtitle: string,
  pages: LessonPage[],
  question: string,
  choices: string[],
  answer: number,
  why: string,
  section?: string,
): Lesson => ({
  title,
  subtitle,
  minutes: Math.max(2, pages.length),
  pages,
  quiz: { question, choices, answer, why },
  ...(section ? { section } : {}),
});

export const STARTER_COURSES: Course[] = [
  {
    id: "space",
    title: "Khám phá vũ trụ",
    subtitle: "Từ Trái Đất đến các vì sao",
    category: "Khoa học",
    emoji: "🪐",
    color: "#DBE9FF",
    accent: "#385D9A",
    level: "Người mới",
    source: "sample",
    lessons: [
      lesson(
        "Vũ trụ rộng đến đâu?",
        "Nhìn lên bầu trời",
        [
          {
            kicker: "01 · BẮT ĐẦU",
            title: "Chúng ta đang ở đâu?",
            body: "Trái Đất là một hành tinh quay quanh Mặt Trời. Mặt Trời chỉ là một ngôi sao trong hàng trăm tỉ ngôi sao thuộc Ngân Hà.",
            emoji: "🌍",
            takeaway: "Trái Đất → Hệ Mặt Trời → Ngân Hà",
          },
          {
            kicker: "02 · KHÁM PHÁ",
            title: "Ánh sáng cũng cần thời gian",
            body: "Ánh sáng Mặt Trời mất khoảng 8 phút 20 giây để đến Trái Đất. Vì thế, khi nhìn lên trời, bạn đang nhìn thấy một phần quá khứ.",
            emoji: "☀️",
            takeaway: "Nhìn xa trong vũ trụ cũng là nhìn về quá khứ.",
          },
          {
            kicker: "03 · GHI NHỚ",
            title: "Một năm ánh sáng là gì?",
            body: "Đó là quãng đường ánh sáng đi được trong một năm, không phải đơn vị thời gian. Các nhà thiên văn dùng nó để đo khoảng cách rất lớn.",
            emoji: "✨",
            takeaway: "Năm ánh sáng đo khoảng cách, không đo thời gian.",
          },
        ],
        "Năm ánh sáng dùng để đo điều gì?",
        ["Thời gian", "Khoảng cách", "Nhiệt độ", "Khối lượng"],
        1,
        "Năm ánh sáng là quãng đường ánh sáng đi trong một năm.",
      ),
      lesson(
        "Vì sao có ngày và đêm?",
        "Một vòng quay kỳ diệu",
        [
          {
            kicker: "01 · HÌNH DUNG",
            title: "Trái Đất tự quay",
            body: "Trái Đất quay quanh trục của nó khoảng một vòng mỗi 24 giờ. Phần hướng về Mặt Trời được chiếu sáng, phần còn lại ở trong bóng tối.",
            emoji: "🌗",
            takeaway: "Tự quay quanh trục tạo nên ngày và đêm.",
          },
          {
            kicker: "02 · PHÂN BIỆT",
            title: "Quay quanh Mặt Trời",
            body: "Trái Đất cũng chuyển động quanh Mặt Trời, hoàn thành một vòng sau khoảng 365,25 ngày. Đây là chuyển động khác với tự quay quanh trục.",
            emoji: "🌞",
            takeaway: "Một ngày ≈ 24 giờ; một năm ≈ 365,25 ngày.",
          },
          {
            kicker: "03 · THỬ NGHĨ",
            title: "Tại sao có múi giờ?",
            body: "Vì các vị trí trên Trái Đất lần lượt đón ánh sáng Mặt Trời, các nơi có giờ địa phương khác nhau. Hệ thống múi giờ giúp chúng ta thống nhất cách tính giờ.",
            emoji: "🕰️",
            takeaway: "Trái Đất không được chiếu sáng cùng lúc ở mọi nơi.",
          },
        ],
        "Nguyên nhân chủ yếu tạo ra ngày và đêm là gì?",
        [
          "Mặt Trăng chuyển động",
          "Trái Đất tự quay",
          "Trái Đất đổi kích thước",
          "Mặt Trời tắt sáng",
        ],
        1,
        "Sự tự quay của Trái Đất khiến các vùng lần lượt sáng và tối.",
      ),
      lesson(
        "Bí mật của các hành tinh",
        "Hàng xóm của chúng ta",
        [
          {
            kicker: "01 · BẢN ĐỒ",
            title: "Tám hành tinh",
            body: "Hệ Mặt Trời có tám hành tinh được công nhận, từ Sao Thủy đến Sao Hải Vương. Chúng chuyển động quanh Mặt Trời theo các quỹ đạo riêng.",
            emoji: "🌌",
            takeaway: "Có 8 hành tinh trong Hệ Mặt Trời.",
          },
          {
            kicker: "02 · SO SÁNH",
            title: "Hành tinh đá và khí",
            body: "Sao Thủy, Sao Kim, Trái Đất và Sao Hỏa là các hành tinh đất đá. Sao Mộc và Sao Thổ là các hành tinh khí khổng lồ.",
            emoji: "🔭",
            takeaway: "Các hành tinh khác nhau về cấu tạo và kích thước.",
          },
          {
            kicker: "03 · TÒ MÒ",
            title: "Vì sao Sao Hỏa nổi tiếng?",
            body: "Sao Hỏa có dấu vết cho thấy nước lỏng từng tồn tại trên bề mặt. Đây là một trong những lý do các nhà khoa học quan tâm đến hành tinh này.",
            emoji: "🔴",
            takeaway: "Bằng chứng về nước giúp nghiên cứu lịch sử Sao Hỏa.",
          },
        ],
        "Hành tinh nào thuộc nhóm hành tinh đất đá?",
        ["Sao Mộc", "Sao Thổ", "Sao Hỏa", "Sao Hải Vương"],
        2,
        "Sao Hỏa là một trong bốn hành tinh đất đá.",
      ),
    ],
  },
  {
    id: "mind",
    title: "Tâm lý học thú vị",
    subtitle: "Hiểu bộ não và chính mình",
    category: "Tâm lý",
    emoji: "🧠",
    color: "#F7DFF0",
    accent: "#944D7D",
    level: "Người mới",
    source: "sample",
    lessons: [
      lesson(
        "Não bộ thích điều gì?",
        "Bộ máy dự đoán",
        [
          {
            kicker: "01 · QUAN SÁT",
            title: "Não luôn tìm quy luật",
            body: "Não bộ liên tục nhận thông tin và đưa ra dự đoán để giúp ta phản ứng nhanh hơn. Khi một điều bất ngờ xảy ra, sự chú ý thường tăng lên.",
            emoji: "🧩",
            takeaway: "Bộ não thường xử lý thế giới bằng dự đoán.",
          },
          {
            kicker: "02 · THỬ NGHIỆM",
            title: "Sự chú ý có giới hạn",
            body: "Chúng ta không thể tập trung sâu vào mọi thứ cùng lúc. Chuyển qua lại giữa nhiều nhiệm vụ có thể làm giảm hiệu suất.",
            emoji: "🎯",
            takeaway: "Tập trung vào một việc giúp giảm việc chuyển đổi chú ý.",
          },
          {
            kicker: "03 · ỨNG DỤNG",
            title: "Học thành từng phần",
            body: "Chia kiến thức thành những phần nhỏ, ôn lại theo khoảng cách và tự kiểm tra có thể hỗ trợ việc ghi nhớ lâu hơn.",
            emoji: "📚",
            takeaway: "Học ngắn, tự kiểm tra và ôn tập đều đặn.",
          },
        ],
        "Cách nào thường hỗ trợ ghi nhớ hiệu quả?",
        [
          "Đọc liên tục không nghỉ",
          "Tự kiểm tra và ôn cách quãng",
          "Chỉ tô màu ghi chú",
          "Chuyển việc liên tục",
        ],
        1,
        "Tự kiểm tra và ôn tập cách quãng là hai kỹ thuật học tập có cơ sở nghiên cứu.",
      ),
      lesson(
        "Thói quen hình thành ra sao?",
        "Một hành động nhỏ",
        [
          {
            kicker: "01 · CƠ CHẾ",
            title: "Tín hiệu và hành động",
            body: "Một thói quen thường gắn với bối cảnh lặp lại: có tín hiệu, ta thực hiện hành động, rồi nhận được một kết quả nào đó.",
            emoji: "🔁",
            takeaway: "Bối cảnh lặp lại giúp hành vi trở nên quen thuộc.",
          },
          {
            kicker: "02 · BẮT ĐẦU",
            title: "Hãy làm thật nhỏ",
            body: "Để xây dựng thói quen đọc sách, bạn có thể bắt đầu bằng hai trang mỗi tối. Mục tiêu nhỏ khiến việc bắt đầu dễ hơn.",
            emoji: "🌱",
            takeaway: "Mục tiêu nhỏ giúp tạo đà duy trì.",
          },
          {
            kicker: "03 · THỰC HÀNH",
            title: "Gắn với việc sẵn có",
            body: "Bạn có thể đặt mục tiêu: “Sau khi đánh răng buổi tối, mình đọc hai trang sách.” Tín hiệu rõ ràng giúp dễ nhớ hơn.",
            emoji: "🪥",
            takeaway: "Gắn hành vi mới với một thói quen đã có.",
          },
        ],
        "Ví dụ nào là một tín hiệu thói quen rõ ràng?",
        [
          "Khi có thời gian",
          "Sau khi đánh răng",
          "Ngày nào đó",
          "Khi cảm thấy hoàn hảo",
        ],
        1,
        "Một hoạt động lặp lại cụ thể có thể trở thành tín hiệu cho thói quen mới.",
      ),
      lesson(
        "Cảm xúc nói gì với ta?",
        "Lắng nghe bản thân",
        [
          {
            kicker: "01 · NHẬN BIẾT",
            title: "Cảm xúc mang thông tin",
            body: "Cảm xúc có thể báo hiệu điều gì đang quan trọng với chúng ta. Cảm thấy lo không tự động có nghĩa nguy hiểm thực sự đang hiện diện.",
            emoji: "💭",
            takeaway:
              "Cảm xúc là tín hiệu, không phải lúc nào cũng là sự thật.",
          },
          {
            kicker: "02 · ĐẶT TÊN",
            title: "Gọi tên cảm xúc",
            body: "Thử mô tả cụ thể: “Mình đang hơi thất vọng vì kế hoạch đổi.” Việc gọi tên có thể giúp bạn quan sát trải nghiệm rõ hơn.",
            emoji: "🗣️",
            takeaway: "Mô tả cảm xúc cụ thể giúp ta hiểu phản ứng.",
          },
          {
            kicker: "03 · NHẸ NHÀNG",
            title: "Đừng vội phán xét",
            body: "Có thể cho mình thời gian trước khi phản hồi, hoặc nói chuyện với một người đáng tin. Cảm xúc khó chịu không làm bạn trở thành người xấu.",
            emoji: "🫶",
            takeaway: "Tạo khoảng dừng trước khi hành động.",
          },
        ],
        "Khi cảm xúc mạnh xuất hiện, điều gì có thể hữu ích?",
        [
          "Phớt lờ hoàn toàn",
          "Gọi tên cảm xúc",
          "Quyết định ngay lập tức",
          "Đổ lỗi cho bản thân",
        ],
        1,
        "Gọi tên và quan sát cảm xúc giúp tạo khoảng dừng trước hành động.",
      ),
    ],
  },
  {
    id: "money",
    title: "Tiền bạc thông minh",
    subtitle: "Nền tảng tài chính cá nhân",
    category: "Đời sống",
    emoji: "💸",
    color: "#E5F2C8",
    accent: "#55782A",
    level: "Người mới",
    source: "sample",
    lessons: [
      lesson(
        "Tiền đi đâu mỗi tháng?",
        "Chi tiêu có chủ đích",
        [
          {
            kicker: "01 · QUAN SÁT",
            title: "Thu nhập và chi tiêu",
            body: "Một ngân sách đơn giản bắt đầu từ hai câu hỏi: Bạn có bao nhiêu tiền vào? Và tiền đi đâu? Hãy theo dõi chi tiêu trước khi điều chỉnh.",
            emoji: "🧾",
            takeaway: "Biết dòng tiền trước khi đưa ra quyết định.",
          },
          {
            kicker: "02 · PHÂN LOẠI",
            title: "Cần và muốn",
            body: "Nhu cầu cơ bản có thể gồm nhà ở, thực phẩm, đi lại. Mong muốn như giải trí và mua sắm cũng có giá trị, nhưng cần được cân đối.",
            emoji: "⚖️",
            takeaway: "Phân loại giúp ưu tiên, không phải cấm chi tiêu.",
          },
          {
            kicker: "03 · BẮT ĐẦU",
            title: "Một bước dễ làm",
            body: "Trong bảy ngày tới, ghi lại mọi khoản chi dù nhỏ. Nhìn vào dữ liệu thật có ích hơn việc đoán mình đã tiêu bao nhiêu.",
            emoji: "🗓️",
            takeaway: "Thử ghi chép chi tiêu trong 7 ngày.",
          },
        ],
        "Bước đầu tiên để lập ngân sách thường là gì?",
        [
          "Mua thêm đồ",
          "Theo dõi tiền vào và ra",
          "Đầu tư hết tiền",
          "Vay thêm tiền",
        ],
        1,
        "Hiểu rõ thu nhập và chi tiêu giúp xây dựng kế hoạch phù hợp.",
      ),
      lesson(
        "Quỹ khẩn cấp là gì?",
        "Một chiếc đệm an toàn",
        [
          {
            kicker: "01 · HIỂU",
            title: "Khoản tiền dự phòng",
            body: "Quỹ khẩn cấp dùng cho những việc bất ngờ nhưng cần thiết, như sửa xe hoặc chi phí y tế. Nó khác với quỹ du lịch.",
            emoji: "🛟",
            takeaway: "Dành tiền riêng cho điều ngoài dự tính.",
          },
          {
            kicker: "02 · TỪ TỪ",
            title: "Bắt đầu từ số nhỏ",
            body: "Không nhất thiết phải tiết kiệm nhiều ngay ngày đầu. Một khoản tự động chuyển mỗi tháng giúp việc tích lũy đều đặn hơn.",
            emoji: "🐢",
            takeaway: "Tính đều đặn quan trọng hơn khởi đầu lớn.",
          },
          {
            kicker: "03 · LƯU Ý",
            title: "Dễ lấy khi cần",
            body: "Quỹ khẩn cấp nên đặt ở nơi tương đối an toàn và có thể truy cập nhanh, thay vì tài sản biến động mạnh.",
            emoji: "🏦",
            takeaway: "Tính thanh khoản là đặc điểm quan trọng.",
          },
        ],
        "Quỹ khẩn cấp phù hợp nhất với mục đích nào?",
        [
          "Mua hàng theo xu hướng",
          "Chi phí bất ngờ cần thiết",
          "Đặt cược",
          "Đầu cơ ngắn hạn",
        ],
        1,
        "Quỹ khẩn cấp là tiền dự phòng cho các tình huống không lường trước.",
      ),
      lesson(
        "Lãi kép hoạt động thế nào?",
        "Thời gian là người bạn",
        [
          {
            kicker: "01 · KHÁI NIỆM",
            title: "Lãi sinh ra lãi",
            body: "Khi lãi được cộng vào số tiền ban đầu và tiếp tục tạo ra lãi, đó là lãi kép. Hiệu quả phụ thuộc vào lãi suất, thời gian và cách tính lãi.",
            emoji: "🌿",
            takeaway: "Lãi kép = lãi tính cả trên khoản lãi đã có.",
          },
          {
            kicker: "02 · VÍ DỤ",
            title: "Một phép tính nhỏ",
            body: "Giả sử 100 đồng tăng 10% mỗi năm và lãi được nhập gốc: năm đầu là 110 đồng; năm sau thành 121 đồng.",
            emoji: "📈",
            takeaway: "100 → 110 → 121 khi lãi kép 10%/năm.",
          },
          {
            kicker: "03 · CÂN NHẮC",
            title: "Lợi nhuận không chắc chắn",
            body: "Trong thực tế, đầu tư có rủi ro và mức sinh lời có thể thay đổi. Ví dụ 10% ở đây chỉ để minh họa phép tính.",
            emoji: "🧮",
            takeaway: "Lãi kép là phép toán, không phải cam kết lợi nhuận.",
          },
        ],
        "Nếu 100 đồng tăng 10%/năm theo lãi kép, sau 2 năm thành bao nhiêu?",
        ["110", "120", "121", "200"],
        2,
        "100 × 1,1 × 1,1 = 121 đồng.",
      ),
    ],
  },
  {
    id: "ai",
    title: "AI từ con số 0",
    subtitle: "Hiểu công nghệ đang đổi thế giới",
    category: "Công nghệ",
    emoji: "🤖",
    color: "#E8E1FF",
    accent: "#6851A9",
    level: "Người mới",
    source: "sample",
    lessons: [
      lesson(
        "AI thực sự là gì?",
        "Bắt đầu từ điều cơ bản",
        [
          {
            kicker: "01 · GIẢI MÃ",
            title: "Máy học từ dữ liệu",
            body: "Trí tuệ nhân tạo là lĩnh vực phát triển hệ thống có thể thực hiện những nhiệm vụ thường cần trí tuệ con người, như nhận diện hình ảnh hoặc xử lý ngôn ngữ.",
            emoji: "🤖",
            takeaway:
              "AI là tập hợp nhiều kỹ thuật, không phải một ứng dụng duy nhất.",
          },
          {
            kicker: "02 · DỄ HIỂU",
            title: "Mô hình và dữ liệu",
            body: "Nhiều hệ thống AI học các quy luật thống kê từ dữ liệu trong quá trình huấn luyện. Chúng không tự động hiểu thế giới theo cách con người hiểu.",
            emoji: "🧠",
            takeaway: "Dự đoán hợp lý không luôn đồng nghĩa hiểu đúng.",
          },
          {
            kicker: "03 · THỰC TẾ",
            title: "AI quanh bạn",
            body: "Gợi ý video, lọc thư rác, phụ đề tự động và công cụ dịch đều có thể dùng AI. Mỗi ứng dụng có mục tiêu và giới hạn riêng.",
            emoji: "📱",
            takeaway: "AI hiện diện trong rất nhiều công cụ quen thuộc.",
          },
        ],
        "Ví dụ nào có thể sử dụng AI?",
        [
          "Gợi ý video cá nhân hóa",
          "Bút chì gỗ",
          "Ghế không cảm biến",
          "Cốc thủy tinh",
        ],
        0,
        "Hệ thống gợi ý video thường dùng mô hình học máy phân tích tín hiệu người dùng.",
      ),
      lesson(
        "Vì sao AI có thể sai?",
        "Dùng AI cẩn thận",
        [
          {
            kicker: "01 · QUAN TRỌNG",
            title: "Câu trả lời trôi chảy vẫn có thể sai",
            body: "Một mô hình ngôn ngữ có thể tạo thông tin không chính xác hoặc bịa nguồn. Đây thường được gọi là hiện tượng “ảo giác” AI.",
            emoji: "🌀",
            takeaway: "Diễn đạt tự tin không chứng minh thông tin là đúng.",
          },
          {
            kicker: "02 · KIỂM TRA",
            title: "Tìm nguồn gốc",
            body: "Với thông tin quan trọng, nên so sánh với nguồn uy tín và kiểm tra ngày cập nhật. Hãy đặc biệt cẩn thận với y tế, luật và tài chính.",
            emoji: "🔎",
            takeaway: "Dùng AI để hỗ trợ, không thay thế kiểm chứng.",
          },
          {
            kicker: "03 · BẢO MẬT",
            title: "Dữ liệu của bạn",
            body: "Không nhập mật khẩu, số giấy tờ hay thông tin riêng tư nhạy cảm vào công cụ AI nếu chưa hiểu chính sách dữ liệu của công cụ đó.",
            emoji: "🔐",
            takeaway: "Bảo vệ dữ liệu cá nhân khi sử dụng AI.",
          },
        ],
        "Cách tốt nhất để xử lý một thông tin quan trọng do AI đưa ra?",
        [
          "Tin ngay vì AI tự tin",
          "Kiểm tra từ nguồn đáng tin",
          "Chia sẻ ngay",
          "Bỏ hết ngữ cảnh",
        ],
        1,
        "Kiểm chứng với nguồn đáng tin là bước an toàn khi dùng AI.",
      ),
      lesson(
        "Viết câu lệnh hiệu quả",
        "Prompt rõ ràng hơn",
        [
          {
            kicker: "01 · THỬ",
            title: "Cung cấp mục tiêu",
            body: "Thay vì “Giúp mình học”, hãy thử “Giải thích hiện tượng cầu vồng cho học sinh lớp 7 bằng 3 ví dụ dễ hiểu”.",
            emoji: "✍️",
            takeaway: "Nêu mục tiêu, đối tượng và định dạng.",
          },
          {
            kicker: "02 · CẢI TIẾN",
            title: "Đặt giới hạn",
            body: "Bạn có thể chỉ định độ dài, phong cách và yêu cầu AI hỏi lại khi thiếu dữ liệu. Điều này giúp câu trả lời phù hợp hơn.",
            emoji: "🎛️",
            takeaway: "Ràng buộc cụ thể thường giúp giảm mơ hồ.",
          },
          {
            kicker: "03 · VÒNG LẶP",
            title: "Đối thoại để cải thiện",
            body: "Nếu kết quả chưa đạt, hãy nói rõ phần nào cần sửa. Prompt tốt thường được cải thiện qua vài lượt tương tác.",
            emoji: "💬",
            takeaway: "Tinh chỉnh có mục tiêu thay vì bắt đầu lại.",
          },
        ],
        "Prompt nào rõ ràng nhất?",
        [
          "Viết đi",
          "Nói thêm",
          "Giải thích lãi kép bằng ví dụ 100 nghìn đồng cho người mới",
          "Hay hơn",
        ],
        2,
        "Prompt này cung cấp chủ đề, đối tượng và một ví dụ mong muốn.",
      ),
    ],
  },
  {
    id: "english",
    title: "Tiếng Anh đời thường",
    subtitle: "Tự tin bắt đầu hội thoại",
    category: "Ngôn ngữ",
    emoji: "🗣️",
    color: "#FFE7D1",
    accent: "#A56438",
    level: "Người mới",
    source: "sample",
    lessons: [
      lesson(
        "Chào hỏi tự nhiên",
        "Bắt đầu cuộc trò chuyện",
        [
          {
            kicker: "01 · TỪ VỰNG",
            title: "Hello! How are you?",
            body: "“How are you?” là một cách hỏi thăm quen thuộc. Bạn có thể đáp: “I’m good, thanks. How about you?” trong ngữ cảnh thân mật.",
            emoji: "👋",
            takeaway: "How about you? = Còn bạn thì sao?",
          },
          {
            kicker: "02 · GIAO TIẾP",
            title: "Nice to meet you",
            body: "Khi gặp người mới, bạn có thể nói “Nice to meet you.” Người kia thường đáp “Nice to meet you, too.”",
            emoji: "🤝",
            takeaway: "Nice to meet you = Rất vui được gặp bạn.",
          },
          {
            kicker: "03 · LUYỆN TẬP",
            title: "Thử nói thành tiếng",
            body: "“Hi, I’m Minh. Nice to meet you!” Hãy nói chậm và rõ. Trôi chảy đến từ những lần luyện tập ngắn, lặp lại.",
            emoji: "🎤",
            takeaway: "Một mẫu câu dùng thật tốt hơn mười câu chỉ đọc.",
          },
        ],
        "Câu nào phù hợp khi lần đầu gặp một người?",
        [
          "Nice to meet you",
          "See you yesterday",
          "I am table",
          "It raining tomorrow",
        ],
        0,
        "“Nice to meet you” là cách nói tự nhiên khi gặp người mới.",
      ),
      lesson(
        "Gọi món ở quán",
        "Học bằng tình huống",
        [
          {
            kicker: "01 · MẪU CÂU",
            title: "I’d like a coffee, please",
            body: "“I’d like…” là cách lịch sự để nói bạn muốn gọi món. “I’d like a tea, please” nghĩa là “Cho tôi một trà, làm ơn”.",
            emoji: "☕",
            takeaway: "I’d like… = Tôi muốn… (lịch sự).",
          },
          {
            kicker: "02 · CÂU HỎI",
            title: "For here or to go?",
            body: "Nhân viên có thể hỏi “For here or to go?” tức là dùng tại chỗ hay mang đi. Bạn chỉ cần đáp “For here, please” hoặc “To go, please”.",
            emoji: "🥐",
            takeaway: "To go = Mang đi.",
          },
          {
            kicker: "03 · THỰC HÀNH",
            title: "Một lượt gọi món",
            body: "Staff: “What can I get for you?” You: “I’d like a sandwich and a water, please.” Staff: “For here?” You: “Yes, please.”",
            emoji: "🧋",
            takeaway: "Thực hành theo hội thoại ngắn.",
          },
        ],
        "“To go, please” nghĩa là gì?",
        ["Tại chỗ", "Mang đi", "Không đường", "Thêm đá"],
        1,
        "“To go” nghĩa là mang đồ ăn hoặc thức uống đi.",
      ),
      lesson(
        "Hỏi đường đơn giản",
        "Đi đâu cũng tự tin",
        [
          {
            kicker: "01 · HỎI",
            title: "Excuse me, where is…?",
            body: "Bạn có thể bắt đầu lịch sự bằng “Excuse me”. Ví dụ: “Excuse me, where is the train station?”",
            emoji: "🗺️",
            takeaway: "Where is…? = … ở đâu?",
          },
          {
            kicker: "02 · NGHE",
            title: "Turn left, turn right",
            body: "“Turn left” là rẽ trái; “turn right” là rẽ phải; “go straight” là đi thẳng. Ba cụm từ này rất thường gặp khi hỏi đường.",
            emoji: "🚦",
            takeaway: "Left = trái, right = phải, straight = thẳng.",
          },
          {
            kicker: "03 · LỊCH SỰ",
            title: "Thank you so much!",
            body: "Sau khi được giúp, hãy cảm ơn. Bạn có thể nói “Thank you!” hoặc “Thanks a lot!” rồi mỉm cười.",
            emoji: "🌟",
            takeaway: "Lời cảm ơn giúp cuộc trò chuyện tự nhiên hơn.",
          },
        ],
        "“Go straight” có nghĩa là gì?",
        ["Rẽ trái", "Dừng lại", "Đi thẳng", "Quay lại"],
        2,
        "“Go straight” là chỉ dẫn đi thẳng.",
      ),
    ],
  },
  {
    id: "tran-mong",
    title: "Nhà Trần & Ba lần kháng Mông Nguyên",
    subtitle: "Bí quyết chiến thắng đế chế hùng mạnh nhất thế giới",
    category: "Lịch sử",
    emoji: "⚔️",
    color: "#E8F5E9",
    accent: "#2E7D32",
    level: "Người mới",
    source: "sample",
    lessons: [
      // ── CHƯƠNG 1 ────────────────────────────────────────────────────────
      lesson(
        "Vó ngựa thảo nguyên & Sự lựa chọn sinh tử",
        "Khi kẻ thù bất khả chiến bại áp sát biên cương",
        [
          {
            kicker: "01 · BỐI CẢNH",
            title: "Cỗ máy chiến tranh Á-Âu",
            body: "Thế kỷ XIII, vó ngựa Mông Cổ càn quét từ thảo nguyên sang châu Âu, san phẳng kinh đô Bagdad và thôn tính Trung Hoa. Chưa một quốc gia nào cản được bước chân họ.",
            emoji: "🐎",
            takeaway:
              "Mông Cổ là đế chế quân sự hùng mạnh và tàn bạo nhất thế giới lúc bấy giờ.",
          },
          {
            kicker: "02 · TÌNH THẾ",
            title: "Áp lực ngàn cân",
            body: "Năm 1258, tướng Uriyangkhadai dẫn 3 vạn kỵ binh tinh nhuệ ập vào Đại Việt. Đứng trước sức mạnh áp đảo, triều đình non trẻ của vua Trần Thái Tông phải đối mặt ngã rẽ sống còn.",
            emoji: "⚡",
            takeaway:
              "Đại Việt đứng trước nguy cơ diệt vong trước đoàn quân viễn chinh bất khả bại.",
          },
          {
            kicker: "03 · BẢN LĨNH",
            title: "Lời thề chém đầu",
            body: "Khi vua lo lắng hỏi ý, Thái sư Trần Thủ Độ khẳng khái thưa: “Đầu thần chưa rơi xuống đất, bệ hạ đừng lo”. Khí phách ấy trở thành chỗ dựa tinh thần cho cả giang sơn.",
            emoji: "🗡️",
            takeaway:
              "Bản lĩnh kiên định của lãnh đạo là điểm tựa sống còn trong nghịch cảnh.",
          },
        ],
        "Câu nói nổi tiếng của Thái sư Trần Thủ Độ thể hiện điều gì?",
        [
          "Sự nhượng bộ để tìm kiếm hoà hoãn",
          "Ý chí quyết chiến kiên định bảo vệ giang sơn",
          "Kế hoạch rút quân ra nước ngoài",
          "Sự hoang mang trước sức mạnh địch",
        ],
        1,
        "Lời khẳng khái của Trần Thủ Độ đập tan dao động, củng cố niềm tin tuyệt đối cho triều đình và quân dân.",
        "1. Kháng chiến lần thứ nhất (1258)",
      ),

      lesson(
        "Vườn không nhà trống & Đòn Đông Bộ Đầu",
        "Nghệ thuật làm suy kiệt và phản kích",
        [
          {
            kicker: "01 · KẾ SÁCH",
            title: "Thành không một bóng người",
            body: "Nhà Trần chủ động rút lui, di tản toàn bộ nhân dân và đốt sạch kho lương. Quân Mông Cổ chiếm được Thăng Long nhưng chỉ thấy phố xá hoang tàn, không một hạt thóc thừa.",
            emoji: "🏚️",
            takeaway:
              "Chủ động nhường thành để triệt tiêu nguồn tiếp tế của kẻ thù viễn chinh.",
          },
          {
            kicker: "02 · ĐỊCH SUY",
            title: "Đói khát và bệnh tật",
            body: "Kỵ binh thảo nguyên quen cướp bóc để nuôi quân bỗng rơi vào cảnh cạn kiệt lương thực. Khí hậu nhiệt đới ẩm ướt làm dịch bệnh bùng phát, binh lính hoang mang tột độ.",
            emoji: "🌧️",
            takeaway:
              "Biến điểm mạnh càn quét của địch thành thế mắc kẹt không lối thoát.",
          },
          {
            kicker: "03 · PHẢN CÔNG",
            title: "Sấm sét Đông Bộ Đầu",
            body: "Chờ địch kiệt sức, quân Trần mở cuộc phản công chớp nhoáng tại bến Đông Bộ Đầu. Quân Mông Cổ vỡ trận tháo chạy, kết thúc thắng lợi cuộc kháng chiến lần thứ nhất.",
            emoji: "🏆",
            takeaway:
              "Nhẫn nại phòng ngự, chờ đối thủ suy yếu rồi phản kích quyết định.",
          },
        ],
        "Chiến lược “Vườn không nhà trống” nhắm vào điểm yếu cốt tử nào của quân Mông Cổ?",
        [
          "Khả năng bơi lội của binh lính",
          "Sự phụ thuộc hoàn toàn vào cướp bóc lương thực tại chỗ",
          "Vũ khí cận chiến thô sơ",
          "Thiếu tướng lĩnh chỉ huy giàu kinh nghiệm",
        ],
        1,
        "Đoàn quân thảo nguyên viễn chinh rất cần lương thực tại chỗ; khi không thể cướp bóc, sức chiến đấu tự tan rã.",
        "1. Kháng chiến lần thứ nhất (1258)",
      ),

      // ── CHƯƠNG 2 ────────────────────────────────────────────────────────
      lesson(
        "50 vạn quân Nguyên & Thế cờ hiểm nghèo",
        "Cuộc phục thù quy mô chưa từng thấy",
        [
          {
            kicker: "01 · TÀN KHỐC",
            title: "Thế gọng kìm khổng lồ",
            body: "Năm 1285, Hốt Tất Liệt sai Thái tử Thoát Hoan dẫn 50 vạn quân — gấp 17 lần lần đầu — tràn qua biên giới, kết hợp đạo quân Toa Đô đánh thốc từ phía Nam lên.",
            emoji: "⚠️",
            takeaway:
              "50 vạn quân Nguyên tạo thế gọng kìm hai mặt nhằm xoá sổ Đại Việt.",
          },
          {
            kicker: "02 · BẢO TOÀN",
            title: "Lùi một bước để đi xa",
            body: "Trước thế giặc hung hãn như chẻ tre, Hưng Đạo Vương Trần Quốc Tuấn kiên quyết chỉ huy rút lui chiến lược, bảo toàn từng cánh quân chủ lực trong rừng sâu.",
            emoji: "🛡️",
            takeaway:
              "Không liều mạng đối đầu khi địch đang sung sức; giữ người là còn tất cả.",
          },
        ],
        "Mục đích chính của cuộc rút lui chiến lược đầu năm 1285 là gì?",
        [
          "Đầu hàng từng bước để xin hòa hoãn",
          "Bảo toàn lực lượng chủ lực và tránh mũi nhọn sung mãn của địch",
          "Chờ đợi viện binh từ các nước láng giềng",
          "Bỏ mặc đồng bằng để lui về cố thủ miền núi mãi mãi",
        ],
        1,
        "Rút lui chiến lược giúp bảo toàn sinh lực quân đội, làm địch hao mòn qua thời gian trước khi phản công.",
        "2. Kháng chiến lần thứ hai (1285)",
      ),

      lesson(
        "Hội nghị Diên Hồng — Tiếng hô bạt vía giặc",
        "Sức mạnh vô địch từ lòng dân",
        [
          {
            kicker: "01 · DÂN CHỦ",
            title: "Nhà vua hỏi ý dân",
            body: "Thượng hoàng Trần Thánh Tông triệu tập hàng ngàn vị bô lão đại diện muôn làng về điện Diên Hồng. Trước vận nước nguy nan, vua đặt câu hỏi: “Nên hoà hay nên đánh?”",
            emoji: "👑",
            takeaway:
              "Lần đầu tiên trong lịch sử, triều đình trao quyền quyết định vận mệnh cho nhân dân.",
          },
          {
            kicker: "02 · ĐỒNG LÒNG",
            title: "Một tiếng hô “ĐÁNH!”",
            body: "Không một giây do dự, muôn người như một đồng loạt giơ nắm tay thét vang: “ĐÁNH!”. Tiếng hô rung chuyển điện Diên Hồng, kết tinh ý chí quật cường của cả dân tộc.",
            emoji: "✊",
            takeaway:
              "Ý chí toàn dân đồng lòng tạo nên vũ khí tinh thần không gì phá vỡ.",
          },
          {
            kicker: "03 · SÁT THÁT",
            title: "Thề khắc trên da thịt",
            body: "Tướng sĩ đồng loạt thích hai chữ “Sát Thát” lên cánh tay, thề sống chết cùng non sông. Khí thế cả nước sôi sục, biến thành sức mạnh cản phá mọi bước tiến quân thù.",
            emoji: "🔥",
            takeaway:
              "Sự đồng lòng từ trên xuống dưới biến một nước nhỏ thành pháo đài bất khả xâm phạm.",
          },
        ],
        "Ý nghĩa lớn nhất của Hội nghị Diên Hồng là gì?",
        [
          "Kêu gọi các nước láng giềng gửi quân viện trợ",
          "Quy tụ và nhân lên sức mạnh đoàn kết toàn dân để quyết chiến",
          "Tìm kiếm thỏa hiệp ngoại giao có lợi cho triều đình",
          "Phân chia quyền lực giữa vua và các tù trưởng",
        ],
        1,
        "Diên Hồng là biểu tượng sáng ngời của sức mạnh đoàn kết dân tộc: vua tin dân, dân dốc lòng vì nước.",
        "2. Kháng chiến lần thứ hai (1285)",
      ),

      lesson(
        "Hịch tướng sĩ & Đại thắng Thăng Long",
        "Lời hiệu triệu bất hủ và ngày khải hoàn",
        [
          {
            kicker: "01 · HIỆU TRIỆU",
            title: "Tấm lòng người chủ soái",
            body: "Trần Hưng Đạo viết “Hịch tướng sĩ” lay động can trường: “Ta thường tới bữa quên ăn, nửa đêm vỗ gối...”. Áng văn thắp sáng danh dự và trách nhiệm thiêng liêng của người cầm gươm.",
            emoji: "📜",
            takeaway:
              "Lãnh đạo truyền cảm hứng bằng chính sự tận tụy và tâm huyết của bản thân.",
          },
          {
            kicker: "02 · NẮNG HÈ",
            title: "Thời cơ chín muồi",
            body: "Mùa hè 1285, quân Nguyên kiệt quệ vì nắng gắt và dịch bệnh. Lương thảo cạn kiệt, các cánh quân chiếm đóng rơi vào tình trạng bị cô lập khắp các vùng.",
            emoji: "☀️",
            takeaway:
              "Thời tiết và địa hình luôn là đồng minh trung thành của người hiểu rõ vùng đất.",
          },
          {
            kicker: "03 · SẤM SÉT",
            title: "Hàm Tử, Chương Dương",
            body: "Quân Trần mở cuộc đại phản công liên hoàn. Thuyền chiến Trần Quang Khải xé toang phòng tuyến Hàm Tử; Chương Dương rực lửa mở toang cửa ngõ vào kinh đô.",
            emoji: "🌊",
            takeaway:
              "Tập trung lực lượng mở những đòn điểm huyệt chính xác vào điểm yếu quân địch.",
          },
          {
            kicker: "04 · THÁO CHẠY",
            title: "Ống đồng nhục nhã",
            body: "Thăng Long sạch bóng quân thù. Thái tử Thoát Hoan quyền thế ngút trời phải chui vào ống đồng cho quân lính khiêng chạy thục mạng qua biên giới để giữ mạng.",
            emoji: "💨",
            takeaway:
              "Đạo quân 50 vạn ngạo mạn tan vỡ hoàn toàn trước trí tuệ và ý chí của Đại Việt.",
          },
        ],
        "Chiến dịch giải phóng Thăng Long năm 1285 giành thắng lợi nhờ yếu tố nào?",
        [
          "Quân Nguyên tự rút lui vì mùa đông lạnh giá",
          "Phản công đúng thời điểm địch suy kiệt, đánh liên hoàn vào các căn cứ then chốt",
          "Nhờ quân đội Champa đánh úp từ sau lưng Thoát Hoan",
          "Vũ khí súng thần công mới chế tạo của nhà Trần",
        ],
        1,
        "Trần Hưng Đạo chớp đúng thời cơ quân giặc mệt mỏi vào mùa hè, mở các trận đánh tiêu diệt liên hoàn Hàm Tử - Chương Dương.",
        "2. Kháng chiến lần thứ hai (1285)",
      ),

      // ── CHƯƠNG 3 ────────────────────────────────────────────────────────
      lesson(
        "Trận Bạch Đằng — Trí tuệ cọc ngầm & Thuỷ triều",
        "Đỉnh cao nghệ thuật quân sự sông nước",
        [
          {
            kicker: "01 · TỰ TIN",
            title: "Năm nay đánh giặc nhàn",
            body: "Năm 1288, Hốt Tất Liệt cay cú phái thuỷ bộ đại quân sang lần 3. Hiểu rõ tâm lý cay cú và quy luật của giặc, Trần Hưng Đạo bình thản tâu vua: “Năm nay đánh giặc nhàn”.",
            emoji: "🎯",
            takeaway:
              "Khi đã thấu triệt điểm mạnh yếu của đối thủ, thế trận hoàn toàn nằm trong tay.",
          },
          {
            kicker: "02 · MƯU KẾ",
            title: "Rừng cọc dưới đáy sông",
            body: "Hàng ngàn cọc gỗ lim bịt sắt nhọn bí mật được đóng xuống lòng sông Bạch Đằng. Độ cao của cọc được tính toán chính xác để chìm sâu khi triều lên và trồi lên khi triều rút.",
            emoji: "🪵",
            takeaway:
              "Kết hợp địa hình hiểm trở với quy luật tự nhiên để tạo thành bẫy tử thần vô hình.",
          },
          {
            kicker: "03 · DỤ ĐỊCH",
            title: "Thuyền nhỏ nhử hổ dữ",
            body: "Khi con nước dâng cao, chiến thuyền nhỏ Đại Việt ra khiêu chiến rồi giả vờ thua chạy. Đoàn thuyền chiến khổng lồ của Ô Mã Nhi đắc thắng đuổi theo vào sâu trong lòng sông.",
            emoji: "🎭",
            takeaway:
              "Dùng mồi nhử đánh trúng tính chủ quan, kiêu ngạo của kẻ thù.",
          },
          {
            kicker: "04 · ĐẠI THẮNG",
            title: "Nước rút, thuyền tan",
            body: "Thuỷ triều hạ nhanh chóng, bãi cọc nhô lên xé toạc đáy thuyền giặc. Thuyền cháy rực, quân Nguyên vỡ trận; danh tướng Ô Mã Nhi bị bắt sống. Mộng xâm lăng chấm dứt vĩnh viễn.",
            emoji: "🔥",
            takeaway:
              "Trận Bạch Đằng 1288 đi vào lịch sử quân sự thế giới như kiệt tác chiến thuật thuỷ chiến.",
          },
        ],
        "Yếu tố khoa học then chốt làm nên kỳ tích Bạch Đằng năm 1288 là gì?",
        [
          "Sức mạnh cơ bắp của thuỷ thủ Đại Việt",
          "Tính toán chính xác chu kỳ thuỷ triều lên xuống kết hợp bố trí cọc ngầm",
          "Số lượng chiến thuyền áp đảo đoàn tàu giặc",
          "Thời tiết sương mù dày đặc che giấu toàn bộ chiến trường",
        ],
        1,
        "Sự am hiểu tường tận chu kỳ thuỷ triều kết hợp với bãi cọc sắt ngầm đã biến con sông thành cạm bẫy hoàn hảo tiêu diệt hạm đội giặc.",
        "3. Kháng chiến lần thứ ba (1288)",
      ),

      lesson(
        "Khoan thư sức dân — Bài học muôn đời",
        "Kế sâu rễ bền gốc cho mọi thế hệ",
        [
          {
            kicker: "01 · DI HUẤN",
            title: "Sâu rễ bền gốc",
            body: "Trước lúc qua đời, khi vua hỏi kế sách giữ nước, Trần Hưng Đạo đúc kết bài học cốt tuỷ: “Khoan thư sức dân để làm kế sâu rễ bền gốc, đó là thượng sách giữ nước”.",
            emoji: "🌱",
            takeaway:
              "Gốc có vững thì cây mới bền; chăm lo bồi dưỡng sức dân là nền tảng của mọi thắng lợi.",
          },
          {
            kicker: "02 · KHỞI NGHIỆP",
            title: "Bài học cho người trẻ",
            body: "Thắng lợi của nhà Trần dạy chúng ta: tài nguyên hữu hạn không cản được thành công nếu có chiến lược thông minh, tinh thần đoàn kết và sự bền bỉ tích luỹ từ gốc rễ.",
            emoji: "⭐",
            takeaway:
              "Dù trong khởi nghiệp hay cuộc sống: Trí tuệ + Đoàn kết + Bền gốc luôn vượt trội sức mạnh cơ bắp.",
          },
        ],
        "Lời dạy “Khoan thư sức dân để làm kế sâu rễ bền gốc” mang ý nghĩa sâu sắc nào?",
        [
          "Khuyên triều đình bãi bỏ hoàn toàn quân đội thường trực",
          "Chăm lo bồi dưỡng đời sống và niềm tin của người dân làm nền tảng vững chắc nhất",
          "Khuyên nhân dân tự lo liệu phòng thủ không cần triều đình",
          "Tập trung của cải xây dựng thành luỹ kiên cố quanh hoàng cung",
        ],
        1,
        "Người dân chính là gốc rễ của quốc gia; khi lòng dân yên ấm và tin tưởng, đất nước sẽ có sức mạnh vô địch vượt qua mọi giông bão.",
        "3. Kháng chiến lần thứ ba (1288)",
      ),
    ],
  },
  {
    id: "ielts-sat",
    title: "IELTS & SAT Lexicon Mastery",
    subtitle: "Chinh phục từ vựng học thuật đỉnh cao qua Gốc từ & Flashcard",
    category: "Ngôn ngữ",
    emoji: "🎓",
    color: "#E8EEF5",
    accent: "#244A6F",
    level: "Nâng cao",
    source: "sample",
    lessons: [
      // ── CHƯƠNG 1: TÂM TRÍ & NHẬN THỨC ────────────────────────────────────
      lesson(
        "Nghệ thuật Hoài nghi (Skepticism & Epistemology)",
        "Tư duy phản biện và bằng chứng khoa học",
        [
          {
            kicker: "01 · TỪ VỰNG HỌC THUẬT",
            title: "Ubiquitous /juːˈbɪk.wɪ.təs/",
            body: "Từ mô tả sự phổ biến đến mức hiển nhiên trong xã hội hiện đại. Xuất hiện liên tục trong IELTS Writing Task 2 khi nói về công nghệ, truyền thông hay văn hóa đại chúng.",
            emoji: "🌐",
            takeaway:
              "Ubiquitous: có mặt ở khắp mọi nơi cùng một lúc (omnipresent).",
            vocab: {
              word: "Ubiquitous",
              type: "adj",
              ipa: "/juːˈbɪk.wɪ.təs/",
              meaning: "Có mặt ở khắp mọi nơi, phổ biến tràn lan",
              root: "Gốc La-tinh 'ubique' = khắp mọi nơi",
              example:
                "Smartphones have become ubiquitous in contemporary society, altering how humans interact.",
              synonyms: ["Omnipresent", "Pervasive", "Prevalent", "Universal"],
            },
          },
          {
            kicker: "02 · TỪ VỰNG HỌC THUẬT",
            title: "Empirical /ɪmˈpɪr.ɪ.kəl/",
            body: "Từ cốt lõi trong các bài đọc nghiên cứu khoa học của SAT và IELTS Reading. Phân biệt rõ giữa lý thuyết trừu tượng và kết quả đo đạc từ thực nghiệm.",
            emoji: "🔬",
            takeaway:
              "Empirical: dựa trên thực nghiệm và quan sát, thay vì lý thuyết suông.",
            vocab: {
              word: "Empirical",
              type: "adj",
              ipa: "/ɪmˈpɪr.ɪ.kəl/",
              meaning: "Dựa trên thực nghiệm, số liệu quan sát thực tế",
              root: "Gốc Hy Lạp 'empeiria' = kinh nghiệm, trải nghiệm thực tế",
              example:
                "There is little empirical evidence to substantiate the claim that social media decreases intellect.",
              synonyms: ["Observable", "Experimental", "Factual", "Verifiable"],
            },
          },
          {
            kicker: "03 · TỪ VỰNG HỌC THUẬT",
            title: "Fallacious /fəˈleɪ.ʃəs/",
            body: "Chỉ lập luận ngụy biện, nghe có vẻ thuyết phục nhưng sai lệch logic từ bên trong. Thường dùng trong phân tích phản biện ở Writing Task 2 và SAT Reading.",
            emoji: "⚠️",
            takeaway: "Fallacious: ngụy biện, sai lầm về mặt logic.",
            vocab: {
              word: "Fallacious",
              type: "adj",
              ipa: "/fəˈleɪ.ʃəs/",
              meaning: "Ngụy biện, lập luận sai lầm mang tính đánh lừa",
              root: "Gốc La-tinh 'fallere' = đánh lừa, lừa dối (cùng họ với 'false')",
              example:
                "The argument that wealth equates directly to happiness relies on fundamentally fallacious reasoning.",
              synonyms: ["Misleading", "Deceptive", "Erroneous", "Spurious"],
            },
          },
        ],
        "Trong bài thi SAT Reading, nếu tác giả chỉ trích một luận điểm là 'fallacious', điều đó nghĩa là gì?",
        [
          "Luận điểm đó hoàn toàn mới mẻ và mang tính đột phá",
          "Luận điểm đó dựa trên logic sai lệch và đánh lừa người đọc",
          "Luận điểm đó nhận được sự đồng thuận tuyệt đối của giới học thuật",
          "Luận điểm đó chỉ áp dụng được trong lịch sử cổ đại",
        ],
        1,
        "'Fallacious' xuất phát từ gốc La-tinh 'fallere' (lừa dối), dùng để chỉ những lập luận sai lầm về mặt logic.",
        "1. Tâm trí & Nhận thức (Cognition & Mind)",
      ),

      lesson(
        "Những cái bẫy thiên kiến (Cognitive Biases)",
        "Nghịch lý của tư duy và sự mâu thuẫn",
        [
          {
            kicker: "01 · TỪ VỰNG HỌC THUẬT",
            title: "Paradoxical /ˌpær.əˈdɒk.sɪ.kəl/",
            body: "Mô tả một tình huống tưởng chừng tự mâu thuẫn nhưng khi suy xét kỹ lại ẩn chứa sự thật sâu sắc. Cực kỳ được ưa chuộng trong các bài luận nghị luận xã hội.",
            emoji: "🌀",
            takeaway:
              "Paradoxical: nghịch lý, thoạt nhìn mâu thuẫn nhưng lại có lý.",
            vocab: {
              word: "Paradoxical",
              type: "adj",
              ipa: "/ˌpær.əˈdɒk.sɪ.kəl/",
              meaning: "Nghịch lý, tưởng mâu thuẫn nhưng thực tế lại đúng",
              root: "Gốc Hy Lạp 'para' (vượt ngoài) + 'doxa' (quan điểm thông thường)",
              example:
                "It is paradoxical that increased connectivity via technology often leads to profound social isolation.",
              synonyms: ["Contradictory", "Incongruous", "Anomalous", "Ironic"],
            },
          },
          {
            kicker: "02 · TỪ VỰNG HỌC THUẬT",
            title: "Heuristic /hjʊˈrɪs.tɪk/",
            body: "Quy tắc kinh nghiệm hoặc đường tắt tư duy giúp con người giải quyết vấn đề nhanh chóng. Từ quen thuộc trong tâm lý học nhận thức và kinh tế học hành vi.",
            emoji: "🧭",
            takeaway:
              "Heuristic: phương pháp phỏng đoán, đường tắt tư duy giải quyết vấn đề.",
            vocab: {
              word: "Heuristic",
              type: "noun/adj",
              ipa: "/hjʊˈrɪs.tɪk/",
              meaning: "Quy tắc phỏng đoán thực dụng giúp ra quyết định nhanh",
              root: "Gốc Hy Lạp 'heuriskein' = tìm thấy, khám phá (cùng họ với 'Eureka!')",
              example:
                "Human intuition relies on mental heuristics that prioritize speed over statistical precision.",
              synonyms: [
                "Rule of thumb",
                "Trial-and-error",
                "Practical method",
              ],
            },
          },
          {
            kicker: "03 · TỪ VỰNG HỌC THUẬT",
            title: "Ambivalent /æmˈbɪv.ə.lənt/",
            body: "Không phải là 'thờ ơ' (indifferent), mà là trải qua hai cảm xúc mâu thuẫn đối lập cùng lúc về một vấn đề (vừa thích vừa ghét, vừa muốn vừa e sợ).",
            emoji: "⚖️",
            takeaway:
              "Ambivalent: giằng xé nội tâm, có cảm xúc mâu thuẫn đối lập.",
            vocab: {
              word: "Ambivalent",
              type: "adj",
              ipa: "/æmˈbɪv.ə.lənt/",
              meaning: "Có cảm xúc mâu thuẫn trái ngược cùng lúc",
              root: "Gốc La-tinh 'ambi' (cả hai phía) + 'valere' (có giá trị, sức mạnh)",
              example:
                "Citizens remain ambivalent toward artificial intelligence, acknowledging both its promise and perils.",
              synonyms: ["Equivocal", "Conflicted", "Torn", "Undecided"],
            },
          },
        ],
        "Sự khác biệt quan trọng nhất giữa 'Ambivalent' và 'Indifferent' là gì?",
        [
          "'Ambivalent' là cực kỳ hào hứng, còn 'Indifferent' là căm ghét",
          "'Ambivalent' là có cảm xúc mâu thuẫn giằng xé, còn 'Indifferent' là hoàn toàn không quan tâm",
          "'Ambivalent' chỉ dùng cho đồ vật, còn 'Indifferent' chỉ dùng cho con người",
          "Hai từ này hoàn toàn đồng nghĩa và có thể thay thế nhau",
        ],
        1,
        "'Ambivalent' (ambi = cả hai) là có cả hai luồng cảm xúc trái ngược, còn 'Indifferent' là hoàn toàn thờ ơ, không để tâm.",
        "1. Tâm trí & Nhận thức (Cognition & Mind)",
      ),

      lesson(
        "Bản lĩnh học thuật (Academic Resilience)",
        "Nội lực vượt khó và cái bẫy tự mãn",
        [
          {
            kicker: "01 · TỪ VỰNG HỌC THUẬT",
            title: "Resilient /rɪˈzɪl.jənt/",
            body: "Khả năng phục hồi kỳ diệu sau chấn thương, khủng hoảng hoặc nghịch cảnh. Từ 'vàng' khi viết về cá nhân, nền kinh tế hoặc hệ sinh thái đối mặt thử thách.",
            emoji: "🌱",
            takeaway: "Resilient: kiên cường, mau phục hồi sau tổn thương.",
            vocab: {
              word: "Resilient",
              type: "adj",
              ipa: "/rɪˈzɪl.jənt/",
              meaning: "Kiên cường, có khả năng phục hồi nhanh sau biến cố",
              root: "Gốc La-tinh 'resilire' = bật ngược trở lại, không bị bẻ gãy",
              example:
                "A resilient economy adapts swiftly to unforeseen global disruptions without crumbling.",
              synonyms: ["Tenacious", "Adaptable", "Buoyant", "Indomitable"],
            },
          },
          {
            kicker: "02 · TỪ VỰNG HỌC THUẬT",
            title: "Complacent /kəmˈpleɪ.sənt/",
            body: "Thái độ tự mãn nguy hiểm khi đang ở vị trí dẫn đầu, không lường trước nguy cơ và ngừng nỗ lực cải thiện bản thân. Rất hay gặp trong các bài phân tích thất bại kinh doanh.",
            emoji: "🛋️",
            takeaway:
              "Complacent: tự mãn, ngủ quên trên chiến thắng và mất cảnh giác.",
            vocab: {
              word: "Complacent",
              type: "adj",
              ipa: "/kəmˈpleɪ.sənt/",
              meaning: "Tự mãn, chủ quan mất cảnh giác trước hiểm họa",
              root: "Gốc La-tinh 'complacere' = tự làm mình vừa lòng một cách thái quá",
              example:
                "Industry titans often become complacent, leaving themselves vulnerable to agile startups.",
              synonyms: ["Smug", "Self-satisfied", "Uncritical", "Careless"],
            },
          },
        ],
        "Trong ngữ cảnh cạnh tranh kinh tế, thái độ 'complacent' sẽ dẫn tới hậu quả nào?",
        [
          "Doanh nghiệp phát triển nhanh hơn dự kiến",
          "Doanh nghiệp chủ quan và bị đối thủ linh hoạt vượt mặt",
          "Doanh nghiệp cắt giảm toàn bộ chi phí vận hành",
          "Doanh nghiệp thu hút thêm nhiều nhà đầu tư mạo hiểm",
        ],
        1,
        "'Complacent' là sự tự mãn chủ quan, khiến các công ty lớn mất cảnh giác và dễ bị đào thải.",
        "1. Tâm trí & Nhận thức (Cognition & Mind)",
      ),

      // ── CHƯƠNG 2: XÃ HỘI & SỰ BIẾN THIÊN ────────────────────────────────
      lesson(
        "Quy luật của sự biến đổi (Change & Evolution)",
        "Từ những khoảnh khắc phù du đến bước ngoặt thời đại",
        [
          {
            kicker: "01 · TỪ VỰNG HỌC THUẬT",
            title: "Ephemeral /ɪˈfem.ər.əl/",
            body: "Chỉ những hiện tượng chỉ tồn tại trong thoáng chốc rồi biến mất. Hay dùng khi bàn luận về các trào lưu mạng xã hội, thời trang nhanh, hoặc danh vọng ảo.",
            emoji: "⏳",
            takeaway: "Ephemeral: phù du, ngắn ngủi, sớm nở tối tàn.",
            vocab: {
              word: "Ephemeral",
              type: "adj",
              ipa: "/ɪˈfem.ər.əl/",
              meaning: "Phù du, chỉ tồn tại trong một thời gian rất ngắn",
              root: "Gốc Hy Lạp 'ephemeros' = chỉ kéo dài trong một ngày (epi = trên, hemera = ngày)",
              example:
                "Fame on social media is notoriously ephemeral, fading as quickly as the next algorithm shift.",
              synonyms: ["Transient", "Fleeting", "Evanescent", "Short-lived"],
            },
          },
          {
            kicker: "02 · TỪ VỰNG HỌC THUẬT",
            title: "Cataclysmic /ˌkæt.əˈklɪz.mɪk/",
            body: "Mô tả một biến cố thảm khốc làm đảo lộn hoàn toàn trật tự hiện hữu. Dùng cho thiên tai, đại dịch hoặc các cuộc khủng hoảng tài chính toàn cầu.",
            emoji: "💥",
            takeaway:
              "Cataclysmic: biến động dữ dội mang tính hủy diệt hoặc đảo lộn lịch sử.",
            vocab: {
              word: "Cataclysmic",
              type: "adj",
              ipa: "/ˌkæt.əˈklɪz.mɪk/",
              meaning: "Mang tính thảm họa lớn làm đảo lộn cấu trúc thế giới",
              root: "Gốc Hy Lạp 'kataklysmos' = đại hồng thủy, ngập tràn hủy diệt",
              example:
                "The asteroid collision caused a cataclysmic extinction event that wiped out the dinosaurs.",
              synonyms: [
                "Disastrous",
                "Devastating",
                "Catastrophic",
                "Ruinous",
              ],
            },
          },
          {
            kicker: "03 · TỪ VỰNG HỌC THUẬT",
            title: "Paradigm shift /ˈpær.ə.daɪm ʃɪft/",
            body: "Cụm danh từ kinh điển chỉ sự thay đổi nền tảng trong cách con người nhìn nhận thế giới hoặc tiếp cận một ngành khoa học (ví dụ: phát minh ra Internet hay AI).",
            emoji: "🔄",
            takeaway:
              "Paradigm shift: bước chuyển biến mang tính cách mạng trong hệ tư duy.",
            vocab: {
              word: "Paradigm shift",
              type: "noun phrase",
              ipa: "/ˈpær.ə.daɪm ʃɪft/",
              meaning:
                "Sự thay đổi mô thức căn bản, bước ngoặt tư duy thời đại",
              root: "Gốc Hy Lạp 'paradeigma' = khuôn mẫu mẫu mực",
              example:
                "The advent of quantum mechanics marked a fundamental paradigm shift in modern physics.",
              synonyms: [
                "Revolutionary change",
                "Fundamental transition",
                "Sea change",
              ],
            },
          },
          {
            kicker: "04 · TỪ VỰNG HỌC THUẬT",
            title: "Inevitable /ɪnˈev.ɪ.tə.bəl/",
            body: "Tính từ đắt giá để khẳng định tính quy luật tất yếu không thể né tránh của lịch sử hay tiến trình tự nhiên. Dùng cực kỳ hiệu quả trong kết bài Task 2.",
            emoji: "🎯",
            takeaway: "Inevitable: tất yếu, không thể tránh khỏi.",
            vocab: {
              word: "Inevitable",
              type: "adj",
              ipa: "/ɪnˈev.ɪ.tə.bəl/",
              meaning: "Tất yếu, chắc chắn sẽ xảy ra và không thể ngăn cản",
              root: "Gốc La-tinh 'in-' (không) + 'evitabilis' (có thể tránh né)",
              example:
                "Urbanization appears inevitable as agrarian economies transition toward industrialization.",
              synonyms: [
                "Ineluctable",
                "Unavoidable",
                "Inescapable",
                "Destined",
              ],
            },
          },
        ],
        "Cụm từ 'Paradigm shift' mô tả điều gì trong tiến trình phát triển nhân loại?",
        [
          "Một sự cố kỹ thuật nhỏ cần bảo trì định kỳ",
          "Một bước chuyển biến mang tính cách mạng trong nhận thức và khuôn mẫu tư duy",
          "Sự sụt giảm doanh thu của một ngành nghề truyền thống",
          "Quá trình di cư từ nông thôn ra thành thị",
        ],
        1,
        "'Paradigm shift' chỉ một sự thay đổi căn bản trong hệ tư duy hoặc phương pháp luận của cả một thời đại.",
        "2. Xã hội & Sự biến thiên (Society & Flux)",
      ),

      lesson(
        "Bền vững & Hệ sinh thái (Ecology & Depletion)",
        "Bảo tồn tài nguyên và giảm thiểu hiểm họa",
        [
          {
            kicker: "01 · TỪ VỰNG HỌC THUẬT",
            title: "Mitigate /ˈmɪt.ɪ.ɡeɪt/",
            body: "Từ vựng 'quyền lực' nhất trong chủ đề Môi trường và Chính sách công. 'Mitigate' mang nghĩa làm giảm bớt mức độ nghiêm trọng hoặc tác hại tiêu cực của một vấn đề.",
            emoji: "🛡️",
            takeaway: "Mitigate: làm dịu bớt, giảm thiểu tác hại tiêu cực.",
            vocab: {
              word: "Mitigate",
              type: "verb",
              ipa: "/ˈmɪt.ɪ.ɡeɪt/",
              meaning:
                "Làm giảm nhẹ, giảm thiểu mức độ nghiêm trọng hoặc thiệt hại",
              root: "Gốc La-tinh 'mitis' (dịu dàng, mềm mỏng) + 'agere' (hành động)",
              example:
                "Governments must implement carbon taxes to mitigate the escalating impacts of climate change.",
              synonyms: ["Alleviate", "Attenuate", "Moderate", "Diminish"],
            },
          },
          {
            kicker: "02 · TỪ VỰNG HỌC THUẬT",
            title: "Exacerbate /ɪɡˈzæs.ə.beɪt/",
            body: "Trái nghĩa trực tiếp với 'Mitigate'. 'Exacerbate' dùng khi một hành động hay chính sách làm cho tình hình vốn đã xấu lại càng thêm tồi tệ và trầm trọng hơn.",
            emoji: "📈",
            takeaway: "Exacerbate: làm trầm trọng thêm, đổ dầu vào lửa.",
            vocab: {
              word: "Exacerbate",
              type: "verb",
              ipa: "/ɪɡˈzæs.ə.beɪt/",
              meaning: "Làm tồi tệ hơn, làm trầm trọng thêm vấn đề vốn có",
              root: "Gốc La-tinh 'ex-' (tăng cường) + 'acerbus' (cay đắng, chua chát)",
              example:
                "Unplanned urbanization severely exacerbates water shortages during summer months.",
              synonyms: ["Aggravate", "Worsen", "Inflame", "Compound"],
            },
          },
          {
            kicker: "03 · TỪ VỰNG HỌC THUẬT",
            title: "Depletion /dɪˈpliː.ʃən/",
            body: "Sự cạn kiệt nguồn lực tự nhiên (nước sạch, rừng nguyên sinh, nhiên liệu hóa thạch). Điểm tựa vững chắc cho các luận điểm Writing Task 2 chủ đề Tài nguyên.",
            emoji: "🪫",
            takeaway:
              "Depletion: sự cạn kiệt nghiêm trọng của một nguồn dự trữ.",
            vocab: {
              word: "Depletion",
              type: "noun",
              ipa: "/dɪˈpliː.ʃən/",
              meaning: "Sự cạn kiệt, suy giảm nghiêm trọng về số lượng",
              root: "Gốc La-tinh 'deplere' = múc cạn nước ra khỏi bình chứa",
              example:
                "The rapid depletion of groundwater reserves poses an existential threat to agriculture.",
              synonyms: ["Exhaustion", "Draining", "Diminution", "Reduction"],
            },
          },
        ],
        "Cặp từ nào dưới đây là từ trái nghĩa trực tiếp (Antonyms) trong các bài viết học thuật?",
        [
          "Mitigate và Alleviate",
          "Mitigate và Exacerbate",
          "Empirical và Verifiable",
          "Ephemeral và Transient",
        ],
        1,
        "'Mitigate' là làm giảm nhẹ thiệt hại, trong khi 'Exacerbate' là làm trầm trọng thêm vấn đề.",
        "2. Xã hội & Sự biến thiên (Society & Flux)",
      ),

      lesson(
        "Xung đột & Hòa giải (Conflict & Diplomacy)",
        "Sự phân cực và nghệ thuật tìm kiếm đồng thuận",
        [
          {
            kicker: "01 · TỪ VỰNG HỌC THUẬT",
            title: "Polarized /ˈpəʊ.lə.raɪzd/",
            body: "Trạng thái một tập thể hay xã hội bị chia rẽ sâu sắc thành hai thái cực đối đầu không khoan nhượng. Xuất hiện phổ biến trong đề thi SAT Writing và IELTS Reading.",
            emoji: "🧲",
            takeaway:
              "Polarized: phân cực sâu sắc, chia rẽ thành hai phe đối đầu.",
            vocab: {
              word: "Polarized",
              type: "adj",
              ipa: "/ˈpəʊ.lə.raɪzd/",
              meaning:
                "Bị phân cực sâu sắc, chia thành hai thái cực trái ngược",
              root: "Gốc La-tinh 'polus' = hai cực của trục Trái Đất",
              example:
                "Public opinion has become intensely polarized regarding mandatory vaccination policies.",
              synonyms: ["Divided", "Factional", "Segmented", "Partisan"],
            },
          },
          {
            kicker: "02 · TỪ VỰNG HỌC THUẬT",
            title: "Reconcile /ˈrek.ən.saɪl/",
            body: "Hành động dung hòa hai quan điểm, lý thuyết hoặc mục tiêu tưởng chừng hoàn toàn đối nghịch nhau (ví dụ: dung hòa tăng trưởng kinh tế và bảo vệ môi trường).",
            emoji: "🤝",
            takeaway:
              "Reconcile: hòa giải, tìm điểm chung để dung hòa hai mặt đối lập.",
            vocab: {
              word: "Reconcile",
              type: "verb",
              ipa: "/ˈrek.ən.saɪl/",
              meaning: "Hòa giải, dung hòa hai ý kiến hay mục tiêu trái ngược",
              root: "Gốc La-tinh 're-' (lại) + 'conciliare' (kết nối làm bạn)",
              example:
                "Policymakers must reconcile aggressive industrial expansion with ambitious climate targets.",
              synonyms: ["Harmonize", "Synthesize", "Resolve", "Accommodate"],
            },
          },
        ],
        "Trong cụm từ 'reconcile economic growth with environmental protection', từ 'reconcile' mang hàm ý gì?",
        [
          "Ưu tiên phát triển kinh tế và bỏ qua môi trường",
          "Tìm giải pháp cân bằng hài hòa giữa kinh tế và môi trường",
          "Đình chỉ các hoạt động kinh tế để trồng cây xanh",
          "Chuyển toàn bộ ngân sách môi trường cho các khu công nghiệp",
        ],
        1,
        "'Reconcile A with B' có nghĩa là dung hòa, tìm cách để hai mục tiêu tưởng như xung đột có thể cùng tồn tại.",
        "2. Xã hội & Sự biến thiên (Society & Flux)",
      ),

      // ── CHƯƠNG 3: NGHỆ THUẬT TRANH BIỆN & VIẾT HỌC THUẬT ─────────────────
      lesson(
        "Những cặp từ bẫy dễ nhầm lẫn trong SAT",
        "Làm chủ sắc thái tinh vi để không mất điểm oan",
        [
          {
            kicker: "01 · BẪY KINH ĐIỂN",
            title: "Disinterested vs Uninterested",
            body: "Một trong những cái bẫy SAT/IELTS phổ biến nhất. 'Disinterested' là công tâm vô tư không tư lợi cá nhân (như thẩm phán), còn 'Uninterested' chỉ đơn thuần là không có hứng thú.",
            emoji: "⚖️",
            takeaway:
              "Disinterested: vô tư khách quan; Uninterested: chán nản, không hứng thú.",
            vocab: {
              word: "Disinterested",
              type: "adj",
              ipa: "/dɪsˈɪn.trəs.tɪd/",
              meaning: "Vô tư, công tâm, không bị chi phối bởi lợi ích cá nhân",
              root: "Gốc 'dis-' (tách biệt) + 'interest' (lợi ích liên quan cá nhân)",
              example:
                "A scientific peer reviewer must be an entirely disinterested party without financial stakes.",
              synonyms: ["Impartial", "Unbiased", "Objective", "Equitable"],
            },
          },
          {
            kicker: "02 · TỪ VỰNG HỌC THUẬT",
            title: "Pragmatic /præɡˈmæt.ɪk/",
            body: "Cách tiếp cận dựa trên tính hiệu quả thực tế và điều kiện hiện hữu thay vì bám cứng vào lý tưởng viển vông. Từ ngữ thể hiện tư duy chín chắn của nhà quản lý.",
            emoji: "🛠️",
            takeaway:
              "Pragmatic: thực dụng tích cực, chú trọng hiệu quả thực tế.",
            vocab: {
              word: "Pragmatic",
              type: "adj",
              ipa: "/præɡˈmæt.ɪk/",
              meaning:
                "Thực dụng, giải quyết vấn đề dựa trên thực tế hơn là lý thuyết",
              root: "Gốc Hy Lạp 'pragma' = việc làm thực tế, hành động",
              example:
                "The mayor adopted a pragmatic approach to housing reform, focusing on immediate feasibility.",
              synonyms: ["Practical", "Utilitarian", "Hardheaded", "Sensible"],
            },
          },
          {
            kicker: "03 · BẪY KINH ĐIỂN",
            title: "Ingenuous vs Ingenious",
            body: "Hai từ chỉ khác nhau đúng một chữ cái nhưng nghĩa hoàn toàn khác. 'Ingenious' là tài giỏi khéo léo (thiên tài), còn 'Ingenuous' là chân thật, ngây thơ, không mưu mô.",
            emoji: "🎭",
            takeaway:
              "Ingenious = tài tình, khéo léo; Ingenuous = ngây thơ, chất phác.",
            vocab: {
              word: "Ingenious",
              type: "adj",
              ipa: "/ɪnˈdʒiː.ni.əs/",
              meaning: "Tài tình, thông minh xuất chúng, khéo léo",
              root: "Gốc La-tinh 'ingeniosus' = năng khiếu bẩm sinh, tài trí",
              example:
                "The engineer devised an ingenious filtration system capable of purifying river water in seconds.",
              synonyms: ["Inventive", "Brilliant", "Resourceful", "Astute"],
            },
          },
        ],
        "Khi chọn trọng tài cho một trận chung kết thể thao, ủy ban cần một người như thế nào?",
        [
          "Một người 'uninterested' trong kết quả trận đấu",
          "Một người 'disinterested' để đảm bảo tính công tâm và công bằng",
          "Một người 'ingenuous' dễ bị thuyết phục bởi đám đông",
          "Một người 'fallacious' sẵn sàng thay đổi luật bất cứ lúc nào",
        ],
        1,
        "'Disinterested' là công tâm, vô tư, không thiên vị phe nào; đây là phẩm chất bắt buộc của trọng tài và giám khảo.",
        "3. Nghệ thuật Tranh biện & Viết học thuật (Nuance & Rhetoric)",
      ),

      lesson(
        "The Root Word Multiplier (Bí kíp Gốc từ)",
        "Mở khóa hàng chục từ vựng qua một gốc từ cổ đại",
        [
          {
            kicker: "01 · GỐC THỜI GIAN",
            title: "Gốc từ: Chron- (Thời gian)",
            body: "Gốc Hy Lạp 'Chronos' là chìa khóa mở ra cả một họ từ vựng học thuật cao cấp trong SAT & IELTS: Chronological (theo thời gian), Synchronize (đồng bộ hóa), Chronic (kinh niên, mãn tính).",
            emoji: "⌛",
            takeaway:
              "Gốc 'chron-' luôn gắn liền với khái niệm dòng thời gian.",
            vocab: {
              word: "Chronological",
              type: "adj",
              ipa: "/ˌkrɒn.əˈlɒdʒ.ɪ.kəl/",
              meaning: "Được sắp xếp theo thứ tự thời gian xảy ra",
              root: "Gốc Hy Lạp 'chronos' (thời gian) + 'logos' (nghiên cứu, trật tự)",
              example:
                "The historian organized the archives in strict chronological order from 1800 to 1900.",
              synonyms: ["Sequential", "Consecutive", "Ordered"],
            },
          },
          {
            kicker: "02 · GỐC HÌNH DẠNG",
            title: "Gốc từ: Morph- (Hình thể, cấu trúc)",
            body: "Bắt nguồn từ nữ thần hình dạng Hy Lạp. Mở khóa các từ: Metamorphosis (sự lột xác biến hóa), Amorphous (vô định hình, không có cấu trúc rõ ràng), Morphology (hình thái học).",
            emoji: "🦋",
            takeaway:
              "Gốc 'morph-' đại diện cho hình dạng, cấu trúc và sự biến đổi thể thức.",
            vocab: {
              word: "Amorphous",
              type: "adj",
              ipa: "/əˈmɔː.fəs/",
              meaning:
                "Vô định hình, không có cấu trúc hoặc hình dạng xác định",
              root: "Gốc 'a-' (không có) + 'morphe' (hình dạng)",
              example:
                "Without clear leadership, the protest remained an amorphous movement without distinct goals.",
              synonyms: ["Shapeless", "Formless", "Unstructured", "Nebulous"],
            },
          },
          {
            kicker: "03 · GỐC ĐỐI LẬP",
            title: "Gốc từ: Bene- (Tốt) vs Mal- (Xấu)",
            body: "Cặp tiền tố La-tinh kinh điển nhất trong tiếng Anh. 'Bene-' mang phúc lành (Beneficial, Benevolent, Benefactor), trong khi 'Mal-' mang tai ương (Malicious, Malfunction, Malevolent).",
            emoji: "☯️",
            takeaway: "Bene = Tốt đẹp, hữu ích; Mal = Xấu xa, độc hại.",
            vocab: {
              word: "Benevolent",
              type: "adj",
              ipa: "/bəˈnev.əl.ənt/",
              meaning:
                "Nhân từ, giàu lòng hảo tâm, mong muốn điều tốt đẹp cho người khác",
              root: "Gốc La-tinh 'bene' (tốt) + 'velle' (mong muốn)",
              example:
                "A benevolent benefactor donated millions to fund scholarships for disadvantaged scholars.",
              synonyms: [
                "Altruistic",
                "Philanthropic",
                "Magnanimous",
                "Compassionate",
              ],
            },
          },
        ],
        "Dựa trên quy tắc gốc từ, từ 'Malevolent' có khả năng cao mang ý nghĩa nào?",
        [
          "Rất có lợi cho sức khỏe người già",
          "Có tâm địa độc ác, muốn gây hại cho người khác",
          "Xảy ra theo đúng trình tự thời gian",
          "Có hình dáng cấu trúc cực kỳ rõ ràng",
        ],
        1,
        "Tiền tố 'Mal-' nghĩa là xấu xa/độc hại, kết hợp với 'velle' (mong muốn) -> Malevolent là ác ý, muốn làm hại người khác.",
        "3. Nghệ thuật Tranh biện & Viết học thuật (Nuance & Rhetoric)",
      ),
    ],
  },
];

export const INTERESTS = [
  "Tất cả",
  "Khoa học",
  "Tâm lý",
  "Công nghệ",
  "Đời sống",
  "Ngôn ngữ",
  "Lịch sử",
];
export const COURSE_PALETTES = [
  ["#DBE9FF", "#385D9A", "🔭"],
  ["#E8E1FF", "#6851A9", "💡"],
  ["#F7DFF0", "#944D7D", "🌷"],
  ["#E5F2C8", "#55782A", "🧠"],
  ["#FFE7D1", "#A56438", "✨"],
];

// Attach lightweight, editable teaching diagrams to the authored examples.
addSampleVisuals(STARTER_COURSES);

addLessonDepth(STARTER_COURSES);

refineSampleVisuals(STARTER_COURSES);
