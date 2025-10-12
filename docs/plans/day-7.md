# Kế hoạch Ngày 7: Kiểm thử & Sửa lỗi (Testing & Bug Fixing)

**Mục tiêu chính:** Đảm bảo ứng dụng hoạt động ổn định, không có lỗi nghiêm trọng và sẵn sàng để bàn giao. Đây là ngày cuối cùng để "đóng gói" sản phẩm.

---

### Nhiệm vụ 1: Kiểm thử Toàn bộ Luồng (End-to-End Testing) (Est: 5 giờ)

Đây là hoạt động quan trọng nhất trong ngày. Cần thực hiện một cách có hệ thống trên cả hai nền tảng (iOS và Android nếu có thể).

1.  **Chuẩn bị Kịch bản Kiểm thử**:
    -   Viết ra các kịch bản kiểm thử chính dựa trên các luồng người dùng.
    -   **Kịch bản 1: Người dùng mới**
        -   Mở app -> Đăng ký tài khoản mới -> Đăng xuất -> Đăng nhập lại.
    -   **Kịch bản 2: Đặt lịch hẹn**
        -   Đăng nhập -> Vào màn hình đặt lịch -> Chọn bác sĩ -> Chọn ngày giờ -> Điền thông tin -> Xác nhận -> Kiểm tra lịch hẹn mới trong Lịch sử.
    -   **Kịch bản 3: Xem Lịch sử**
        -   Đăng nhập -> Vào Lịch sử hẹn -> Nhấn xem chi tiết một lịch hẹn.
    -   **Kịch bản 4: Sử dụng Tính năng AI**
        -   Đăng nhập -> Vào Chẩn đoán -> Nhập triệu chứng -> Xem kết quả.
        -   Đăng nhập -> Mở Chatbot -> Gửi vài tin nhắn.
    -   **Kịch bản 5: Dữ liệu không hợp lệ**
        -   Thử đăng nhập sai mật khẩu.
        -   Thử đăng ký với email đã tồn tại.
        -   Thử đặt lịch mà không điền đủ thông tin.

2.  **Thực hiện Kiểm thử**:
    -   Thực hiện từng bước trong các kịch bản đã viết.
    -   Ghi lại tất cả các lỗi tìm thấy, dù là nhỏ nhất, vào một danh sách (ví dụ: trong một tệp `BUGS.md`).
    -   Phân loại lỗi theo mức độ ưu tiên:
        -   **Blocker**: Gây crash app, không thể tiếp tục luồng.
        -   **Major**: Sai logic, hiển thị sai dữ liệu.
        -   **Minor**: Lỗi UI, chính tả, khoảng cách.

### Nhiệmvụ 2: Sửa lỗi (Bug Fixing) (Est: 3 giờ)

1.  **Ưu tiên Sửa lỗi**:
    -   Tập trung xử lý tất cả các lỗi **Blocker** và **Major** trước tiên.
    -   Nếu còn thời gian, xử lý các lỗi **Minor**.
2.  **Phương pháp Sửa lỗi**:
    -   Đọc kỹ mô tả lỗi.
    -   Sử dụng trình gỡ lỗi của React Native (Debugger) để đặt breakpoint và kiểm tra giá trị của biến.
    -   Kiểm tra lại logic ở cả phía UI và Redux/services.
    -   Sau khi sửa xong một lỗi, thực hiện lại đúng kịch bản kiểm thử đã gây ra lỗi đó để xác nhận đã khắc phục thành công.
3.  **Dọn dẹp Mã nguồn (Code Cleanup)**:
    -   Xóa các `console.log` đã dùng để debug.
    -   Thêm các chú thích cần thiết vào những đoạn code phức tạp.
    -   Format lại code cho thống nhất.

---

### Kết quả cần đạt cuối ngày:

-   Một danh sách các kịch bản kiểm thử đã được thực hiện và đánh dấu hoàn thành.
-   Tất cả các lỗi nghiêm trọng (Blocker, Major) đã được khắc phục.
-   Ứng dụng hoạt động ổn định trên các luồng người dùng chính.
-   Mã nguồn sạch sẽ và sẵn sàng để tạo một phiên bản build để bàn giao hoặc demo.
-   **Sản phẩm cuối cùng:** Một phiên bản ứng dụng MVP (Minimum Viable Product) hoàn chỉnh, đáp ứng các yêu cầu cốt lõi đã đề ra.