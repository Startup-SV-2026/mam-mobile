# 🌱 Mầm — Học một điều mới mỗi ngày

App học bằng tiếng Việt viết bằng **TypeScript strict**, React Native và Expo SDK 54. Chạy cùng code trên iOS, Android và web. Lấy cảm hứng từ cách học ngắn của [Wondering](https://wondering.app/), sử dụng thương hiệu và giao diện riêng của Mầm.

## Chạy app

Node.js 22 LTS trở lên và npm.

```bash
npm install
npm run web
```

Mở địa chỉ Expo in ra, thường là http://localhost:8081. Trên màn hình lớn, app hiển thị trong khung điện thoại. Dùng `npm run ios` với Xcode/iOS Simulator, hoặc `npm start` để chạy bằng Expo Go tương thích SDK 54 trên thiết bị.

## Có trong bản 0.2

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
- `src/components/Icon.tsx`: các ký hiệu điều hướng tạm. Có thể thay phần render bằng SVG hoặc bộ icon riêng.
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

Chưa có video/podcast, FSRS, streak bạn bè, đăng nhập, đồng bộ cloud, thanh toán hoặc bản phát hành App Store. Giao diện hiện theo hướng học ngắn và khám phá của Wondering, chưa sao chép đầy đủ mọi tính năng của sản phẩm đó.
