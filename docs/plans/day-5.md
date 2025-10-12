# Kế hoạch Ngày 5: Chẩn đoán & Chatbot AI

**Mục tiêu chính:** Tích hợp hai tính năng thông minh, tạo giá trị gia tăng cho ứng dụng. Các tính năng này chủ yếu dựa vào giao diện và kết nối API đơn giản.

---

### Nhiệm vụ 1: Xây dựng Màn hình Chẩn đoán (Est: 4 giờ)

1.  **Tạo Màn hình**:
    -   Tạo tệp `app/(tabs)/diagnosis.tsx`.
2.  **Thiết kế Giao diện**:
    -   Tạo một giao diện form đơn giản.
    -   Sử dụng một `TextInput` lớn, nhiều dòng (`multiline={true}`) để người dùng nhập các triệu chứng của họ, phân tách bằng dấu phẩy.
    -   Một nút "Bắt đầu Chẩn đoán".
    -   Một khu vực để hiển thị kết quả sau khi API trả về.
3.  **Kết nối API**:
    -   Khi người dùng nhấn nút, lấy nội dung từ `TextInput`.
    -   Gọi API endpoint `/api/diagnosis` (đã tồn tại từ web). Endpoint này có thể nằm trong một service mới, ví dụ `diagnosis.service.ts`.
    -   `payload` gửi đi có thể là một đối tượng `{ symptoms: "symptom1, symptom2,..." }`.
4.  **Hiển thị Kết quả**:
    -   API có thể trả về một danh sách các bệnh có khả năng mắc phải cùng với xác suất.
    -   Thiết kế một component `PredictionResult.tsx` để hiển thị mỗi kết quả.
    -   Component này có thể bao gồm tên bệnh và một thanh tiến trình (`ProgressBar`) để biểu diễn xác suất.
    -   Sử dụng `FlatList` để hiển thị danh sách các kết quả dự đoán.
    -   **Quan trọng**: Hiển thị một cảnh báo rõ ràng rằng "Kết quả chỉ mang tính tham khảo và không thay thế cho chẩn đoán của bác sĩ chuyên khoa."

### Nhiệm vụ 2: Xây dựng Màn hình Chatbot AI (Est: 4 giờ)

1.  **Tạo Màn hình**:
    -   Tạo một màn hình mới, có thể truy cập từ một nút trên tab Trang chủ, ví dụ: `app/chatbot.tsx`.
2.  **Thiết kế Giao diện Chat**:
    -   Đây là một giao diện chat tiêu chuẩn.
    -   Sử dụng `FlatList` để hiển thị danh sách tin nhắn. `FlatList` cần được đảo ngược (`inverted`) để tin nhắn mới nhất xuất hiện ở dưới cùng.
    -   Tạo một component `MessageBubble.tsx` để hiển thị tin nhắn. Component này sẽ có hai biến thể style: một cho tin nhắn của người dùng (bên phải), một cho tin nhắn của bot (bên trái).
    -   Phía dưới cùng là một `TextInput` và một nút "Gửi".
3.  **Kết nối Logic/API**:
    -   Quản lý danh sách tin nhắn trong một state của component (`useState<Message[]>([])`).
    -   Khi người dùng gửi một tin nhắn:
        1.  Thêm tin nhắn của người dùng vào danh sách state để cập nhật UI ngay lập tức.
        2.  Gọi API của chatbot với nội dung tin nhắn.
        3.  Hiển thị một chỉ báo "Bot đang nhập..."
        4.  Khi API trả về phản hồi của bot, thêm tin nhắn của bot vào danh sách state.

---

### Kết quả cần đạt cuối ngày:

-   Màn hình Chẩn đoán hoạt động: người dùng có thể nhập triệu chứng, gửi và nhận lại danh sách các bệnh có khả năng mắc phải.
-   Màn hình Chatbot hoạt động: người dùng có thể có một cuộc hội thoại hỏi-đáp cơ bản với bot AI.
-   Giao diện của cả hai tính năng rõ ràng, dễ sử dụng và xử lý được trạng thái đang tải.