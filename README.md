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

Hạn mức miễn phí tùy model, khu vực và tài khoản; cấu hình này không tự giới hạn chi phí nếu tài khoản đã bật thanh toán. Với API văn bản, HTTP 429 được báo cho người dùng, không tự gọi lại hoặc chuyển nhà cung cấp. API ảnh có hàng đợi và phân loại hạn mức riêng, mô tả ở phần cuối tài liệu. Xem [hạn mức/giá Gemini](https://ai.google.dev/gemini-api/docs/pricing). Có thể đổi `GEMINI_MODEL` sang model tài khoản bạn được phép dùng.

Nếu muốn dùng cấu hình OpenAI cũ, đặt `AI_PROVIDER=openai`, `OPENAI_API_KEY` và `OPENAI_MODEL`. Khi không có `AI_PROVIDER`, server ưu tiên key Gemini hợp lệ về mặt cấu hình, rồi đến key OpenAI; không tự chuyển sang OpenAI nếu Gemini lỗi.

Backend có `POST /api/course-chat`, `/api/course-plan`, `/api/lesson` và `/api/tutor`; `/api/course` giữ cho client cũ. Request có giới hạn kích thước, kiểm tra dữ liệu và timeout. Mỗi lần tạo khóa/hỏi gia sư có thể phát sinh phí API. Backend hiện phục vụ phát triển local/LAN; chưa có tài khoản, giới hạn chi phí hay rate limiting để triển khai công khai.

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

Chưa có video, FSRS, streak bạn bè, đăng nhập, đồng bộ cloud, thanh toán hoặc bản phát hành App Store.

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

Dừng rồi chạy lại `npm run api`. Lệnh này dùng Node watch để tự khởi động lại backend khi code đổi; thay đổi file `.env` vẫn cần restart thủ công. Sau khi bật, mỗi bài mới được soạn sẽ xếp hàng một tranh; khóa mới chỉ yêu cầu tranh cho bài 1.1 trước. Mỗi tranh có thể cần tối đa 3 lần gọi nếu gặp lỗi tạm thời. Server chỉ chạy một tác vụ ảnh tại một thời điểm. Lỗi tốc độ hoặc gián đoạn tạm thời được thử lại có giới hạn, tối đa 3 lần gọi mỗi lượt tác vụ; lỗi quota, quyền truy cập hoặc 429 không rõ nguyên nhân tạm dừng cả hàng đợi; không tự chuyển model/nhà cung cấp hay bật thanh toán.

`GET /health` có `images.enabled`, `images.configured`, `images.model`. `configured` chỉ xác nhận cấu hình cục bộ có key, không xác nhận quyền hay quota Google. Ảnh được phục vụ từ backend tại `/media/illustrations/:id`; điện thoại dùng cùng địa chỉ backend như phần tạo khóa.

### Bộ nhớ và trạng thái

- Cache mặc định: `server/.cache/illustrations` (ngoài Git). Không lưu base64 vào AsyncStorage. Mã ảnh dùng mô tả cảnh, model và phiên bản phong cách. Cảnh giống hệt nhau (bỏ qua khoảng trắng/hoa thường) dùng lại tranh dù chú thích khác; không tự thay bằng một tranh chỉ gần giống chủ đề.
- Trạng thái `queued → generating → ready/failed/paused` được lưu ra đĩa. App kiểm tra trạng thái khi đang đọc bài và dừng kiểm tra khi hoàn tất/rời bài.
- Restart server giữ ảnh đã vẽ và hàng đợi chưa chạy. Tác vụ đang gọi nhà cung cấp khi server bị dừng chuyển thành lỗi để không tự gọi trùng và phát sinh phí; có thể thử lại thủ công.
- Khi ảnh lỗi/quota/mất mạng, nội dung và sơ đồ vẫn học được. Cache nằm trên máy chủ: ảnh khóa AI cần backend để tải; tranh mẫu đóng gói trong app dùng được offline.
- Chưa có bộ kiểm duyệt độ chính xác tự động cho tranh. Prompt và caption không bảo đảm trang phục lịch sử, chi tiết khoa học hoặc hình nhân vật luôn đúng.

Kiểm tra bổ sung dùng phản hồi ảnh giả lập ở cấp API, không tốn quota thật: tạo khóa trả về trước khi ảnh xong, lấy trạng thái, tải ảnh, dùng lại cache sau restart, chống gọi trùng và xử lý quota/ảnh lỗi. Kiểm tra HTTP cần quyền mở localhost trong môi trường sandbox.


### Xử lý quota và trải nghiệm dự phòng

- Bài học không còn khung lỗi quota hoặc nút thử lại lớn. Khi chưa có ảnh, chỉ hiện một dòng nhỏ dẫn đến **Trạng thái AI**, còn nội dung/sơ đồ hiển thị bình thường.
- Mở **Cá nhân → Trạng thái AI**, hoặc nhấn liên kết ở bài học: xem model ảnh, quota đã phân loại, hàng đợi và thư viện tranh đã lưu. Tại đây có nút tiếp tục hàng đợi sau khi đã xử lý cấu hình/quota.
- Backend phân tích `QuotaFailure`, `RetryInfo` và `Retry-After`: quota bằng 0 hoặc theo ngày ưu tiên hơn gợi ý thử lại ngắn; giới hạn theo phút/giây có thể chờ và tự thử lại, tôn trọng thời gian nhà cung cấp và backoff tối thiểu 30 giây, tối đa 3 lần gọi/lượt tác vụ.
- HTTP 429 thiếu thông tin sẽ được ghi là chưa rõ loại hạn mức và tạm dừng, không tự suy ra rằng chỉ cần chờ. Lỗi quyền/model cũng dừng hàng đợi; không tự đổi model, provider hoặc billing.
- Trạng thái tạm dừng lưu trong `_pipeline.json` cùng cache, tồn tại sau restart. Chỉ nút tiếp tục trong Trạng thái AI mới mở lại hàng đợi khi đang bị dừng cứng. Không bật thanh toán hay điều chỉnh quota bằng thao tác này.
- Chỉ lưu thông tin chẩn đoán đã lọc (loại, quota metric, giới hạn, thời điểm thử lại). Không lưu phản hồi lỗi thô, URL chứa key hay credentials.
- Các tests cho quota 0, quota ngày/phút, trì hoãn, giới hạn số lần gọi, dừng sau restart và dùng lại ảnh đều dùng phản hồi giả lập.

### Chạy app và API cùng lúc

Sau khi cấu hình `.env` và `server/.env`, chạy `npm run dev` để mở cả Expo Web và backend AI. Nếu đã chạy hai tiến trình riêng, tiếp tục dùng chúng; không cần mở thêm bản thứ hai. Nhấn Ctrl+C để dừng các tiến trình do lệnh này tạo.

Nếu giao diện vẫn mở nhưng tính năng AI báo không kết nối, kiểm tra `http://localhost:8787/health` và chạy lại `npm run api` trong terminal riêng. Expo ở cổng 8081 không tự thay thế backend ở cổng 8787.


## Podcast / nghe bài giảng

Branch `mam-podcast`: chọn **Nghe bài giảng** từ lộ trình hoặc menu bài học. Podcast dùng một giọng tiếng Việt FPT.AI (`banmai`, nữ miền Bắc), không có lựa chọn giọng thiết bị. Có phát/tạm dừng, tiến/lùi 15 giây, tốc độ, bản đọc và trình phát nhỏ khi đổi màn hình. Nghe không tự đánh dấu hoàn thành bài; âm thanh tạm dừng khi app ra nền.

### Cấu hình

1. Lấy API key của dịch vụ Text to Speech tại https://console.fpt.ai.
2. Thêm `FPT_API_KEY=...` vào `server/.env`, rồi khởi động lại API bằng `npm run api`. Key giọng đọc độc lập với key Gemini tạo bài học; không đặt vào biến `EXPO_PUBLIC_*`.
3. Expo chỉ cần `EXPO_PUBLIC_API_URL` trỏ tới backend. Trên điện thoại thật, dùng IP LAN của máy chạy backend.

Backend `server/podcast.ts` gọi FPT v5, chia văn bản thành phần tối đa 5.000 ký tự và chờ file sẵn sàng. Tệp được lưu trong `server/.cache/podcasts` theo nội dung + giọng + tốc độ; nghe lại không gọi tạo giọng. URL của yêu cầu đang xử lý cũng được lưu để thử lại không tạo lại cùng nội dung. Lần đầu có thể mất vài phút, nhất là gói miễn phí. Bài dài phát lần lượt các phần, hiển thị thời gian của **phần hiện tại**. Tất cả nội dung, kể cả từ tiếng Anh trong bài, dùng cùng giọng Việt; phát âm ngoại ngữ tùy khả năng của FPT.

API `POST /api/podcast` nhận `{episodeId,title,segments:[{title,text,language}]}` và trả `{audioUrls:["/media/podcasts/<hash>", ...]}`. Route media hỗ trợ byte ranges để tua âm thanh. Khi chưa có key, app báo chưa kết nối giọng đọc; không tự chuyển sang giọng thiết bị. Adapter phía app: `src/audio/provider.ts`.

Tài liệu FPT: https://docs.fpt.ai/docs/vi/speech/api/text-to-speech.html. Chưa hỗ trợ tải xuống hoặc phát khi khóa màn hình. Native development build cũ cần build lại sau khi thêm `expo-audio`.


## Tạo khóa học qua hội thoại

Branch `mam-course-chat`: tab **Tạo khóa** bắt đầu bằng chủ đề tự do. AI hỏi thêm từng câu theo thông tin còn thiếu, có lựa chọn nhanh, trả lời tự do và **Để Mầm đề xuất**. Thông thường 2–3 câu, tối đa 4; yêu cầu đã đủ chi tiết có thể chuyển thẳng sang bản tóm tắt.

Người học xem/sửa chủ đề, mục tiêu, kiến thức đã có, phạm vi, kiểu bài tập, nhịp học và trình độ rồi mới nhấn **Tạo khóa học**. Sửa một câu trả lời cũ sẽ xóa các lượt sau để hỏi lại theo thông tin mới. Hội thoại đang làm được giữ khi đổi tab trong cùng phiên; chưa lưu bản nháp sau khi đóng app. Có dừng và thử lại khi lỗi; tạo khóa bị lỗi vẫn giữ bản tóm tắt.

`POST /api/course-chat` dùng cùng cấu hình Gemini/OpenAI trong `server/.env`, trả câu hỏi hoặc brief có kiểm tra cấu trúc. `/api/course-plan` nhận `brief` và `conversation`; prompt tạo đề cương và từng bài dùng bản tóm tắt đã chỉnh cùng các câu trả lời thay vì chỉ topic/level. Không tự mở một khóa mẫu trùng tên khi người học đang tạo khóa cá nhân. Khóa mẫu vẫn ở Thư viện. Khởi động lại API nếu server cũ báo không tìm thấy endpoint.


## Tạo từng bài theo tiến độ

Khóa AI mới dùng `POST /api/course-plan` để tạo đề cương 2–4 chương, mỗi chương 2–4 bài. Sau đó chỉ gọi `POST /api/lesson` cho bài **1.1**. Đề cương, brief và các bài đã có được lưu cùng khóa trong tiến độ local.

Sau khi người học hoàn thành quiz của bài hiện tại, app mới tự yêu cầu bài kế tiếp (1.2, rồi sang chương 2…). Khi yêu cầu thất bại, lộ trình và màn hình hoàn thành có nút thử lại; bài trước vẫn đọc được. Mở lại app sẽ tiếp tục tạo đúng bài còn thiếu nếu các bài trước đã hoàn thành. Không tự tạo trước cả chương và không tính một khóa đã xong chỉ vì bài đầu tiên đã hoàn thành.

Server lưu đề cương và từng bài trong `server/.cache/courses` (có thể đổi bằng `COURSE_CACHE_DIR`), theo model, brief, đề cương và ngữ cảnh. Yêu cầu trùng đang chạy được dùng chung, bài đã có được dùng lại. Prompt bài sau nhận đề cương và mục tiêu/tóm tắt của những bài đã học; không coi tiêu đề bài tương lai là kiến thức đã dạy. Hình minh họa chỉ được yêu cầu cho bài vừa tạo. Podcast và ôn tập chỉ dùng các bài đã có nội dung.

Khóa mẫu và khóa AI cũ đã tạo đủ nội dung tiếp tục hoạt động như trước, không tự xóa hoặc tạo lại. Endpoint `/api/course` được giữ để tương thích client cũ; luồng tạo khóa mới không dùng endpoint tạo toàn bộ này.


## Mascot chuyển động

`src/components/MamMascot.tsx` là nhân vật hạt mầm SVG riêng của Mầm, gồm thân xanh, hai lá, tay chân và biểu cảm. Có ba trạng thái `idle`, `thinking`, `happy`; chạm mascot ở màn tạo khóa/gia sư để chào và nhảy nhẹ. Nút Hỏi Mầm trên lộ trình và màn đọc mở gia sư; mascot xuất hiện khi AI đang trả lời và khi hoàn thành bài.

Animation dùng React Native Animated, không cần API hoặc dịch vụ ảnh. Tự dừng khi app ra nền, dọn các vòng lặp khi unmount và tôn trọng Reduce Motion. Chỉnh hình dáng, màu và chuyển động trong một component; logo Sprout vẫn giữ ở phần nhận diện app.


### Mascot khi chờ nội dung

`MascotLoading.tsx` dùng chung cho các trạng thái chờ: tải dữ liệu, chat, tạo khóa, soạn bài tiếp theo, bài tuần, tranh minh họa và podcast. Khi tạo khóa, phần tóm tắt được thay bằng mascot lớn và bước hiện tại: **Đang tạo đề cương** → **Đang soạn bài 1.1**. Đây là các giai đoạn thật của request; không hiển thị phần trăm hoặc thời gian chờ giả. Có nút dừng; khi lỗi/dừng, bản tóm tắt vẫn được giữ để thử lại. Animation vẫn tôn trọng Reduce Motion và dừng khi app ra nền.

## Visuals

Branch `mam-visuals`: 7 bìa chủ đề mới được tạo bằng imagegen tích hợp, dùng phong cách vật thể gốm/giấy và bảng màu xanh, kem, pastel. `CourseArt` chọn bìa theo tên và chủ đề khóa học, kể cả khóa có ID AI; đây là bộ bìa có sẵn, chưa tạo bìa riêng cho từng khóa. Ảnh gốc, ảnh tối ưu và prompts nằm trong `assets/artwork/PROMPTS.md`.

Minh họa kiến thức có 8 dạng: các bước, so sánh, chu trình có thể chạm, dòng thời gian, bản đồ ý tưởng, các lớp, công thức và số liệu. Chữ và số được app dựng trực tiếp để giữ độ rõ. Schema và prompt AI chọn dạng theo nội dung; công thức cần biểu thức, thẻ số liệu cần giá trị có căn cứ. Khóa cũ vẫn đọc được.

Prompt tạo tranh bài học dùng phiên bản `mam-editorial-v2`, chọn cảnh/vật thể theo chủ đề và tránh chữ hoặc biểu đồ do model vẽ. Thay đổi này không bật lại pipeline tạo ảnh đang tạm dừng vì hạn mức, cũng không tự tạo lại ảnh cũ.
