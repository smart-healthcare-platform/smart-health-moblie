# Kế hoạch Ngày 4: Đặt lịch hẹn (Booking Flow)

**Mục tiêu chính:** Cho phép người dùng hoàn thành một luồng đặt lịch hẹn mới. Đây là một tính năng phức tạp, vì vậy chúng ta sẽ tập trung vào việc đơn giản hóa luồng so với phiên bản web để đảm bảo có thể hoàn thành trong một ngày.

---

### Nhiệm vụ 1: Thiết kế Luồng Đặt lịch Đơn giản hóa (Est: 1 giờ)

1.  **Phân tích luồng web**: Nhìn lại luồng 4 bước trên web.
2.  **Thiết kế luồng mobile**: Quyết định gộp thành một màn hình cuộn (ScrollView) duy nhất hoặc hai màn hình.
    -   **Phương án đề xuất (1 màn hình)**:
        -   Section 1: Tìm kiếm & Chọn Bác sĩ.
        -   Section 2: Chọn Ngày & Giờ.
        -   Section 3: Điền thông tin & Ghi chú.
        -   Section 4: Tóm tắt & Nút Xác nhận.
    -   Sử dụng `bookingSlice` để lưu trữ dữ liệu qua từng bước trong cùng một màn hình.

### Nhiệm vụ 2: Xây dựng Giao diện Màn hình Đặt lịch (Est: 4 giờ)

1.  **Tạo Màn hình `BookingScreen.tsx`**:
    -   Sử dụng `<ScrollView>` để chứa toàn bộ nội dung.
2.  **Section 1: Chọn Bác sĩ**:
    -   Tạo một component `DoctorSelection.tsx`.
    -   Hiển thị danh sách các bác sĩ (lấy từ `doctorService.getPublicDoctors`).
    -   Khi người dùng chọn một bác sĩ, `dispatch` action `setDoctor` của `bookingSlice`.
3.  **Section 2: Chọn Ngày & Giờ**:
    -   Khi đã chọn bác sĩ, hiển thị một component lịch (`Calendar`).
    -   Khi người dùng chọn một ngày, `dispatch` action `setDate`.
    -   Dựa trên ngày được chọn, gọi `doctorService.getDoctorSlots` và hiển thị các khung giờ trống dưới dạng một lưới các nút (`TimeSlotGrid`).
    -   Khi người dùng chọn một khung giờ, `dispatch` action `setSlot`.
4.  **Section 3: Điền thông tin**:
    -   Hiển thị các `TextInput` cho "Họ và tên", "Số điện thoại", "Ghi chú",...
    -   Khi người dùng nhập, `dispatch` action `setFormData`.
5.  **Section 4: Tóm tắt & Xác nhận**:
    -   Hiển thị lại các thông tin đã chọn từ `bookingSlice` (tên bác sĩ, ngày, giờ).
    -   Hiển thị nút "Xác nhận Đặt lịch".

### Nhiệm vụ 3: Kết nối Logic & Hoàn thiện (Est: 3 giờ)

1.  **Quản lý Trạng thái UI**:
    -   Ẩn/hiện các section một cách tuần tự. Ví dụ, chỉ hiển thị Section 2 sau khi người dùng đã chọn bác sĩ ở Section 1.
    -   Sử dụng `useSelector` để lấy dữ liệu từ `bookingSlice` và hiển thị trên UI.
2.  **Xử lý Nút Xác nhận**:
    -   Khi nhấn nút "Xác nhận Đặt lịch":
        -   Thu thập toàn bộ dữ liệu từ `bookingSlice`.
        -   Tạo `payload` cho API.
        -   Gọi `appointmentService.create(payload)`.
        -   Xử lý thành công: `dispatch` `resetBooking`, hiển thị thông báo thành công và điều hướng người dùng về màn hình Lịch sử hẹn.
        -   Xử lý lỗi: Hiển thị thông báo lỗi.
3.  **Dọn dẹp**:
    -   Đảm bảo `dispatch(resetBooking())` được gọi sau khi đặt lịch thành công hoặc khi người dùng rời khỏi màn hình đặt lịch để không bị lẫn dữ liệu cho lần đặt sau.

---

### Kết quả cần đạt cuối ngày:

-   Một màn hình "Đặt lịch" hoạt động đầy đủ.
-   Người dùng có thể chọn bác sĩ, chọn ngày giờ, điền thông tin và xác nhận.
-   Một lịch hẹn mới được tạo thành công trong hệ thống backend.
-   Sau khi đặt lịch thành công, người dùng được thông báo và chuyển hướng hợp lý.
-   Trạng thái trong `bookingSlice` được quản lý và dọn dẹp chính xác.