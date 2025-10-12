# Kế hoạch Sprint 7 Ngày: Chuyển đổi Smart Health sang Mobile

**Cảnh báo:** Đây là một kế hoạch cực kỳ tham vọng, yêu cầu tập trung cao độ và có thể phải chấp nhận một số sự đơn giản hóa về mặt giao diện để kịp tiến độ. Kế hoạch này thành công phụ thuộc rất nhiều vào khả năng tái sử dụng 100% logic (Redux, services) từ phiên bản web.

---

### Ngày 1: Nền tảng & Cốt lõi (Foundation & Core Logic Porting)

**Mục tiêu:** Xây dựng nền móng vững chắc cho ứng dụng.

**Nhiệm vụ chi tiết:**
1.  **Phân tích `package.json`**: Xác định và cài đặt tất cả các thư viện cần thiết (`@reduxjs/toolkit`, `react-redux`, `redux-persist`, `@react-native-async-storage/async-storage`, `axios`, `socket.io-client`, các gói `@react-navigation`).
2.  **Sao chép và di chuyển (Porting)**:
    -   Copy toàn bộ thư mục `redux`, `services`, `types`, `lib` từ `smart-health-website`.
    -   Tạo các thư mục tương ứng trong `smart-health-moblie`.
3.  **Điều chỉnh & Cấu hình**:
    -   Chỉnh sửa `redux/index.ts` để `redux-persist` sử dụng `@react-native-async-storage/async-storage`.
    -   Kiểm tra và đảm bảo tệp `lib/axios.ts` hoạt động mà không có lỗi trong môi trường React Native.

**Kết quả cần đạt (Deliverables):**
-   Một dự án React Native có thể chạy được với tất cả các thư viện cần thiết.
-   Toàn bộ logic nghiệp vụ (state, services) đã có mặt trong mã nguồn của ứng dụng di động.

---

### Ngày 2: Xác thực & Điều hướng (Authentication & Navigation)

**Mục tiêu:** Cho phép người dùng đăng nhập và thiết lập luồng điều hướng chính.

**Nhiệm vụ chi tiết:**
1.  **Xây dựng Giao diện (UI)**: Tạo các màn hình `LoginScreen.tsx` và `RegisterScreen.tsx` với các trường nhập liệu cơ bản.
2.  **Kết nối Logic**:
    -   Sử dụng `auth.service.ts` và `authSlice` để xử lý việc đăng nhập/đăng ký khi người dùng nhấn nút.
    -   Lưu token và thông tin người dùng vào Redux.
3.  **Thiết lập Điều hướng Gốc (Root Navigation)**:
    -   Tạo một bộ điều hướng gốc (Root Navigator) kiểm tra trạng thái `isLoggedIn` từ `authSlice`.
    -   Nếu đã đăng nhập, hiển thị Tab Navigator chính.
    -   Nếu chưa, hiển thị Stack Navigator cho màn hình xác thực.
4.  **Tạo Tab Navigator**: Thiết lập các tab cơ bản (ví dụ: Trang chủ, Lịch hẹn, Chẩn đoán, Hồ sơ) nhưng chưa cần nội dung chi tiết.

**Kết quả cần đạt:**
-   Người dùng có thể đăng nhập/đăng ký thành công.
-   Ứng dụng tự động chuyển hướng đến màn hình chính sau khi đăng nhập.
-   Nút Đăng xuất hoạt động.

---

### Ngày 3: Lịch sử & Chi tiết Lịch hẹn

**Mục tiêu:** Hoàn thành tính năng cốt lõi đầu tiên cho bệnh nhân.

**Nhiệm vụ chi tiết:**
1.  **Xây dựng Màn hình `AppointmentHistoryScreen.tsx`**:
    -   Gọi `appointmentService.getByPatientId` để lấy danh sách lịch hẹn.
    -   Hiển thị danh sách lịch hẹn dưới dạng các thẻ (Card). Mỗi thẻ hiển thị thông tin cơ bản (bác sĩ, ngày, giờ, trạng thái).
    -   Thêm các bộ lọc cơ bản (ví dụ: sắp tới, đã hoàn thành).
2.  **Xây dựng Giao diện Chi tiết**:
    -   Khi nhấn vào một lịch hẹn, hiển thị một Modal hoặc một màn hình mới (`AppointmentDetailScreen.tsx`) với đầy đủ thông tin chi tiết.

**Kết quả cần đạt:**
-   Bệnh nhân có thể xem toàn bộ lịch sử các cuộc hẹn của mình.
-   Có thể lọc và xem chi tiết từng cuộc hẹn.

---

### Ngày 4: Đặt lịch hẹn (Phiên bản đơn giản)

**Mục tiêu:** Cho phép người dùng đặt một lịch hẹn mới.

**Nhiệm vụ chi tiết:**
1.  **Đơn giản hóa Luồng**: Thay vì quy trình 4 bước như trên web, gộp lại thành 1 hoặc 2 màn hình.
2.  **Màn hình `BookingScreen.tsx`**:
    -   Phần 1: Chọn bác sĩ (có thể là một danh sách đơn giản).
    -   Phần 2: Hiển thị lịch và các khung giờ trống của bác sĩ đã chọn (tái sử dụng `doctorService.getDoctorSlots`).
    -   Phần 3: Form nhập thông tin bệnh nhân (nếu cần) và ghi chú.
    -   Nút "Xác nhận đặt lịch" gọi `appointmentService.create`.
3.  **Tái sử dụng `bookingSlice`**: Dùng Redux slice này để quản lý trạng thái của màn hình đặt lịch.

**Kết quả cần đạt:**
-   Người dùng có thể hoàn thành một luồng đặt lịch hẹn từ đầu đến cuối.

---

### Ngày 5: Chẩn đoán & Chatbot AI

**Mục tiêu:** Tích hợp các tính năng AI công khai.

**Nhiệm vụ chi tiết:**
1.  **Màn hình `DiagnosisScreen.tsx`**:
    -   Tạo giao diện form để người dùng nhập các triệu chứng.
    -   Khi gửi, gọi API endpoint `/api/diagnosis` (đã có từ web).
    -   Hiển thị kết quả dự đoán một cách trực quan.
2.  **Màn hình `ChatbotScreen.tsx`**:
    -   Xây dựng giao diện cửa sổ chat cơ bản (danh sách tin nhắn, ô nhập liệu).
    -   Kết nối với logic chat đã có (nếu có thể tái sử dụng) hoặc API của chatbot.

**Kết quả cần đạt:**
-   Hai tính năng AI cốt lõi từ web hoạt động trên mobile.

---

### Ngày 6: Hồ sơ & Hoàn thiện (Profile & Polish)

**Mục tiêu:** Hoàn thiện các tính năng phụ và đánh bóng toàn bộ ứng dụng.

**Nhiệm vụ chi tiết:**
1.  **Màn hình `ProfileScreen.tsx`**:
    -   Hiển thị thông tin cơ bản của người dùng (lấy từ `authSlice`).
    -   Thêm các liên kết đến các màn hình khác (ví dụ: Lịch sử hẹn).
    -   Thêm nút Đăng xuất.
2.  **Đánh bóng (Polishing)**:
    -   Rà soát lại toàn bộ các màn hình.
    -   Thêm các chỉ báo tải (Loading indicators) khi đang gọi API.
    -   Hiển thị thông báo lỗi/thành công một cách thân thiện.
    -   Đảm bảo UI nhất quán trên các màn hình.

**Kết quả cần đạt:**
-   Ứng dụng có giao diện hoàn chỉnh, mượt mà và chuyên nghiệp hơn.

---

### Ngày 7: Kiểm thử & Sửa lỗi (Testing & Bug Fixing)

**Mục tiêu:** Đảm bảo ứng dụng ổn định và sẵn sàng để bàn giao.

**Nhiệm vụ chi tiết:**
1.  **Kiểm thử End-to-End**: Thực hiện kiểm thử thủ công toàn bộ các luồng chính:
    -   Đăng ký -> Đăng nhập.
    -   Xem lịch sử hẹn.
    -   Đặt một lịch hẹn mới.
    -   Sử dụng tính năng chẩn đoán.
    -   Đăng xuất.
2.  **Ghi nhận & Sửa lỗi**: Tập trung sửa các lỗi nghiêm trọng (crash, sai logic) được tìm thấy.
3.  **Dọn dẹp mã nguồn**: Xóa các file không cần thiết, thêm chú thích nếu cần.

**Kết quả cần đạt:**
-   Một phiên bản (build) ổn định của ứng dụng, sẵn sàng cho việc demo hoặc bàn giao.