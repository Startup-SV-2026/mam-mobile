# 🌱 Mầm — Học một điều mới mỗi ngày

App học bằng tiếng Việt viết bằng **TypeScript strict**, React Native và Expo SDK 54. Chạy cùng code trên iOS, Android và web. Mầm giúp khám phá kiến thức bằng bài học ngắn, lộ trình cá nhân hóa và minh họa trực quan.

## Chạy app

Node.js 22 LTS trở lên và npm.

```bash
npm install
npm run web
```

Mở địa chỉ Expo in ra, thường là http://localhost:8081. Trên màn hình lớn, app hiển thị trong khung điện thoại. Dùng `npm run ios` với Xcode/iOS Simulator, hoặc `npm start` để chạy bằng Expo Go tương thích SDK 54 trên thiết bị.

## Giao diện 0.3 — branch `mam-ui`

- Nền kem, icon nét nâu, thanh điều hướng dạng viên nổi và nút xanh có độ nổi, theo bộ ảnh tham khảo người dùng cung cấp.
- Trang chủ là lộ trình uốn nhẹ: bài đã học có dấu tích, bài hiện tại có biểu tượng Mầm, bài tiếp theo mở khi hoàn thành các bài trước.
- Chạm vào nút bài để chọn đọc, luyện tập hoặc hỏi gia sư.
- Thư viện có Khám phá/Của tôi, tìm kiếm, lọc chủ đề, lọc trạng thái, sắp xếp theo bài đã học/tổng bài. Không hiển thị số liệu trending giả.
- Màn đọc có thanh tiến độ, ghi chú tự lưu, đánh dấu thẻ và nút hành động cố định. Thẻ đã lưu có thể đọc lại từ Cá nhân hoặc Của tôi.
- Hình bìa là SVG tự dựng, thay tại `CourseArt.tsx`. Icon nét tại `Icon.tsx`; sử dụng hình minh họa và biểu tượng riêng của Mầm.
- Sơ đồ dùng dữ liệu có cấu trúc (`steps`, `comparison`, `cycle`), render bằng React Native/SVG. Gemini tạo dữ liệu sơ đồ cho khóa mới; khóa cũ vẫn đọc được, dùng bố cục tóm tắt nếu chưa có sơ đồ. Có sơ đồ soạn sẵn trong `data/visuals.ts`. Không render SVG/HTML tùy ý do AI gửi về.
- Tiến độ v1 được giữ; thêm thẻ, ghi chú và khóa đang chọn vào cùng dữ liệu cục bộ.

## Tính năng học tập

- Trang chủ mới: tạo khóa học, nhịp học hôm nay, tiếp tục hành trình, gợi ý chủ đề.
- Khám phá: tìm kiếm và lọc 5 khóa mẫu, gồm 15 bài học bằng tiếng Việt.
- Lộ trình → thẻ kiến thức → câu hỏi tương tác → hoàn thành bài.
- XP cho lần hoàn thành đầu tiên; học lại không cộng XP trùng. Streak dựa trên ngày địa phương.
- Ôn tập từ các bài đã hoàn thành. Đúng: lịch 1, 3, 7, 14, 30 ngày; sai: hỏi lại sau 10 phút. Đây là bộ lịch đơn giản, **không phải FSRS**. Bài đã học từ bản cũ sẽ được đưa vào ôn ngay.
- Gia sư AI trong bài: giải thích đơn giản hơn, ví dụ thực tế, câu hỏi tự kiểm tra; cần bật backend.
- Tạo khóa AI theo chủ đề, mục tiêu và trình độ; cần bật backend.
- Tiến độ và khóa AI lưu bằng AsyncStorage. Giữ khóa lưu trữ v1 để đọc tiến độ cũ; kiểm tra cấu trúc khi tải dữ liệu.

Các khóa mẫu hoạt động không cần API key. Không hiển thị câu trả lời AI giả khi backend chưa cấu hình.

## Bật tạo khóa và gia sư AI

Terminal 1:

```bash
cp server/.env.example server/.env
```

Trong `server/.env`, điền key Gemini của bạn vào `GEMINI_API_KEY` (không gửi key vào chat):

```dotenv
AI_PROVIDER=gemini
GEMINI_API_KEY=key_cua_ban
GEMINI_MODEL=gemini-3.1-flash-lite
PORT=8787
```

File local đã được chuẩn bị nếu trước đó chưa có. Nếu đã có file, chỉnh file đó thay vì chép đè. Sau khi sửa key hoặc model, khởi động lại backend. Chạy:

```bash
npm run api
```

Terminal 2:

```bash
cp .env.example .env
npm run web
```

Kiểm tra http://localhost:8787/health: `provider: "gemini"` và `aiConfigured: true` nghĩa là server đã nhận khóa, chưa xác nhận khóa hoạt động với nhà cung cấp. Nếu đã có file `.env`, chỉnh file đó thay vì chép đè.

Trên iPhone thật, đặt `EXPO_PUBLIC_API_URL` thành IP LAN của Mac, ví dụ `http://192.168.1.15:8787`, và khởi động lại Expo. Không đưa khóa bí mật vào `EXPO_PUBLIC_*`.

Gemini được gọi qua REST `generateContent`; key nằm trong header phía server. Khóa học dùng JSON Schema và được kiểm tra cấu trúc trước khi gửi về app. Tham khảo [API Google](https://ai.google.dev/api/generate-content) và [model mặc định](https://ai.google.dev/gemini-api/docs/models/gemini-3.1-flash-lite).

Hạn mức miễn phí tùy model, khu vực và tài khoản; cấu hình này không tự giới hạn chi phí nếu tài khoản đã bật thanh toán. Khi nhận HTTP 429, app báo chạm quota và không tự gọi lại hoặc chuyển nhà cung cấp. Xem [hạn mức/giá Gemini](https://ai.google.dev/gemini-api/docs/pricing). Có thể đổi `GEMINI_MODEL` sang model tài khoản bạn được phép dùng.

Nếu muốn dùng cấu hình OpenAI cũ, đặt `AI_PROVIDER=openai`, `OPENAI_API_KEY` và `OPENAI_MODEL`. Khi không có `AI_PROVIDER`, server ưu tiên key Gemini hợp lệ về mặt cấu hình, rồi đến key OpenAI; không tự chuyển sang OpenAI nếu Gemini lỗi.

Backend có `POST /api/course` và `POST /api/tutor`. Request có giới hạn kích thước, kiểm tra dữ liệu và timeout. Mỗi lần tạo khóa/hỏi gia sư có thể phát sinh phí API. Backend hiện phục vụ phát triển local/LAN; chưa có tài khoản, giới hạn chi phí hay rate limiting để triển khai công khai.

## Thay icon

- `assets/icon.png`: icon mầm cây tạm 1024 × 1024, dùng cho launcher và favicon. Thay bằng PNG của bạn; cấu hình nằm trong `app.json`. Icon launcher được áp dụng khi build app riêng, không thay icon của Expo Go.
- `src/components/Icon.tsx`: các icon SVG điều hướng tạm. Có thể thay phần render bằng SVG hoặc bộ icon riêng.
- Emoji trong khóa học: nằm trong `data/courses.ts`.

## Kiểm tra

```bash
npm run typecheck
npm test
npx expo export --platform web
```

Tests kiểm tra dữ liệu mẫu, lịch ôn, dữ liệu cũ và adapter AI bằng phản hồi giả lập: ánh xạ hội thoại, JSON Schema, quota, phản hồi rỗng/bị chặn/bị ngắt. Không cần key thật để chạy tests. Build web và TypeScript không thay thế kiểm tra trực tiếp trên thiết bị iOS/Android. AI cần được thử với khóa API hợp lệ.

## Cấu trúc

```text
App.tsx                    Màn hình và điều phối luồng học
index.ts                   Expo entry
src/components/Icon.tsx    Icon tạm
src/components/Review.tsx  Trải nghiệm ôn tập
src/components/Tutor.tsx   Gia sư AI
src/lib/learning.ts        Lịch ôn và ngày học
src/types/course.ts        Kiểu dữ liệu và kiểm tra runtime
data/courses.ts            Nội dung mẫu
server/index.ts            Backend AI TypeScript
server/ai.ts               Adapter Gemini/OpenAI
server/course-schema.ts    JSON Schema khóa học
tests/*.test.ts            Kiểm tra logic học tập và adapter AI
assets/icon.png            Icon ứng dụng tạm
```

Chưa có video/podcast, FSRS, streak bạn bè, đăng nhập, đồng bộ cloud, thanh toán hoặc bản phát hành App Store.

## Tranh minh họa tự động — `mam-illustrations`

Luồng mới: Gemini tạo nội dung + kế hoạch tranh (`scene`, `caption`, `alt`) cho mỗi bài → backend xếp hàng vẽ một tranh chính/bài → app cho học ngay với sơ đồ → ảnh xuất hiện khi hoàn tất. Không gọi lại model ảnh khi mở bài.

- Xem ngay phong cách: mở **Khám phá vũ trụ → Vũ trụ rộng đến đâu? → Đọc bài học**. Tranh mẫu được tạo bằng công cụ ImageGen, được đóng gói tại `assets/illustrations/space.png`; không cần API ảnh để xem mẫu. Prompt và ghi chú nằm trong `assets/illustrations/README.md`.
- Với khóa AI mới, model văn bản lập kế hoạch tranh; model ảnh Gemini thực hiện kế hoạch đó. Cả hai dùng bộ quy tắc màu pastel/nền kem/chất liệu đất sét và giấy, không chữ trong ảnh. Hình ảnh chỉ là minh họa nghệ thuật; không được xem là tư liệu lịch sử hay mô hình khoa học chính xác.
- Sơ đồ `steps`, `comparison`, `cycle`, `timeline` được dựng bằng code, nhãn và số liệu là chữ thật. Khóa cũ không có dữ liệu sơ đồ sẽ chỉ hiện ý chính, không còn lặp ba tiêu đề thành ô màu.
- Bài cũ có thể nhấn **Tạo tranh minh họa** ở phần đầu bài. Ảnh và mã tham chiếu được lưu để dùng lại.

### Bật model ảnh

API tạo văn bản hoạt động không đồng nghĩa tài khoản có quyền/quota tạo ảnh. Kiểm tra [tài liệu tạo ảnh Gemini](https://ai.google.dev/gemini-api/docs/generate-content/image-generation) và [giá/hạn mức](https://ai.google.dev/gemini-api/docs/pricing) của model trước khi bật. Cấu hình mặc định để **false**, không tự gọi API ảnh bằng key hiện tại.

Trong `server/.env`:

```dotenv
IMAGE_GENERATION_ENABLED=true
GEMINI_IMAGE_MODEL=gemini-3.1-flash-image
# Có thể dùng key riêng; nếu không khai báo, dùng GEMINI_API_KEY.
# GEMINI_IMAGE_API_KEY=
```

Dừng rồi chạy lại `npm run api`. Lệnh này dùng Node watch để tự khởi động lại backend khi code đổi; thay đổi file `.env` vẫn cần restart thủ công. Sau khi bật, mỗi khóa mới có 3 bài sẽ xếp hàng tối đa 3 lần tạo tranh. Server chỉ chạy một tác vụ ảnh tại một thời điểm. Mỗi tác vụ lỗi chỉ thử lại khi người dùng bấm nút, tối đa 2 lần gọi/tác vụ; không tự chuyển model/nhà cung cấp hay bật thanh toán.

`GET /health` có `images.enabled`, `images.configured`, `images.model`. `configured` chỉ xác nhận cấu hình cục bộ có key, không xác nhận quyền hay quota Google. Ảnh được phục vụ từ backend tại `/media/illustrations/:id`; điện thoại dùng cùng địa chỉ backend như phần tạo khóa.

### Bộ nhớ và trạng thái

- Cache mặc định: `server/.cache/illustrations` (ngoài Git). Không lưu base64 vào AsyncStorage. Mã ảnh được băm theo nội dung kế hoạch, model và phiên bản phong cách; yêu cầu trùng dùng cùng kết quả.
- Trạng thái `queued → generating → ready/failed` được lưu ra đĩa. App kiểm tra trạng thái khi đang đọc bài và dừng kiểm tra khi hoàn tất/rời bài.
- Restart server giữ ảnh đã vẽ và hàng đợi chưa chạy. Tác vụ đang gọi nhà cung cấp khi server bị dừng chuyển thành lỗi để không tự gọi trùng và phát sinh phí; có thể thử lại thủ công.
- Khi ảnh lỗi/quota/mất mạng, nội dung và sơ đồ vẫn học được. Cache nằm trên máy chủ: ảnh khóa AI cần backend để tải; tranh mẫu đóng gói trong app dùng được offline.
- Chưa có bộ kiểm duyệt độ chính xác tự động cho tranh. Prompt và caption không bảo đảm trang phục lịch sử, chi tiết khoa học hoặc hình nhân vật luôn đúng.

Kiểm tra bổ sung dùng phản hồi ảnh giả lập ở cấp API, không tốn quota thật: tạo khóa trả về trước khi ảnh xong, lấy trạng thái, tải ảnh, dùng lại cache sau restart, chống gọi trùng và xử lý quota/ảnh lỗi. Kiểm tra HTTP cần quyền mở localhost trong môi trường sandbox.
