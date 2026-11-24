# 🌱 Mầm — Học một điều mới mỗi ngày

Mầm giúp khám phá kiến thức bằng bài học ngắn, lộ trình cá nhân hóa và minh họa trực quan.

## Yêu cầu môi trường

- **Node.js**: 22 LTS trở lên và `npm`
- **Expo Go**: Tương thích SDK 54 (nếu chạy trên điện thoại thật)

## Cài đặt & Khởi động

### 1. Cài đặt thư viện

```bash
npm install
```

### 2. Cấu hình Backend AI & Giọng đọc (Tùy chọn)

Nếu bạn muốn dùng tính năng AI tạo khóa học hoặc nghe bài giảng Podcast:

```bash
cp backend/.env.example backend/.env
# Điền GEMINI_API_KEY (Google AI Studio) hoặc FPT_API_KEY (FPT.AI)
```

### 3. Chạy ứng dụng

- **Chạy song song cả App & Backend (Khuyên dùng):**
  ```bash
  npm run dev
  ```
- **Chạy trên Web:**
  ```bash
  npm run web
  ```
  Mở địa chỉ in ra, thường là http://localhost:8081. Trên màn hình lớn, app tự hiển thị trong khung điện thoại.

- **Chạy trên thiết bị / máy ảo:**
  - `npm start`: Quét mã QR bằng ứng dụng Expo Go trên iOS / Android.
  - `npm run ios`: Chạy trên iOS Simulator (yêu cầu Xcode trên macOS).
  - `npm run android`: Chạy trên Android Emulator.

## Kiểm thử

```bash
npm test
```
