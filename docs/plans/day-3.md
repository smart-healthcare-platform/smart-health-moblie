# Kế hoạch Ngày 3: Lịch sử & Chi tiết Lịch hẹn

**Mục tiêu chính:** Hoàn thiện tính năng xem lại lịch sử khám bệnh, một trong những tính năng quan trọng nhất đối với bệnh nhân.

---

### Nhiệm vụ 1: Xây dựng Màn hình Lịch sử Lịch hẹn (Est: 5 giờ)

1.  **Tạo Màn hình**:
    -   Tạo tệp `app/(tabs)/appointments.tsx`. Đây sẽ là màn hình chính cho tab "Lịch hẹn".
2.  **Lấy Dữ liệu từ API**:
    -   Trong `appointments.tsx`, sử dụng `useEffect` để gọi hàm `appointmentService.getByPatientId` khi màn hình được tải lần đầu.
    -   Lấy `patientId` của người dùng đang đăng nhập từ Redux store (`useSelector`).
    -   Lưu danh sách lịch hẹn trả về vào một state của component (`useState<Appointment[]>([])`).
3.  **Thiết kế Giao diện Danh sách**:
    -   Sử dụng component `FlatList` của React Native để hiển thị danh sách lịch hẹn một cách hiệu quả.
    -   Tạo một component con `AppointmentCard.tsx` trong `components/` để hiển thị thông tin cho mỗi lịch hẹn.
    -   **`AppointmentCard`**:
        -   Hiển thị các thông tin quan trọng: Tên bác sĩ, chuyên khoa, ngày giờ, và trạng thái (ví dụ: "Đã xác nhận", "Đã hoàn thành") với màu sắc khác nhau.
        -   Bọc toàn bộ card trong `TouchableOpacity` để có thể nhấn vào.
4.  **Xử lý Trạng thái Tải và Lỗi**:
    -   Hiển thị `ActivityIndicator` trong khi đang chờ API trả về dữ liệu.
    -   Nếu không có lịch hẹn nào, hiển thị một thông báo thân thiện ("Bạn chưa có lịch hẹn nào.").
    -   Nếu có lỗi xảy ra khi gọi API, hiển thị thông báo lỗi.
5.  **Thêm Chức năng "Pull to Refresh"**:
    -   Sử dụng thuộc tính `onRefresh` và `refreshing` của `FlatList` để cho phép người dùng vuốt xuống để tải lại danh sách.

### Nhiệm vụ 2: Xây dựng Màn hình Chi tiết Lịch hẹn (Est: 3 giờ)

1.  **Điều hướng**:
    -   Khi người dùng nhấn vào một `AppointmentCard`, sử dụng hook `useRouter` của `expo-router` để điều hướng đến một màn hình chi tiết mới.
    -   Ví dụ: `router.push('/appointment-detail/123')`, với `123` là ID của lịch hẹn.
2.  **Tạo Màn hình Chi tiết**:
    -   Tạo tệp `app/appointment-detail/[id].tsx`. Expo-router sẽ tự động nhận diện `[id]` là một tham số.
    -   Sử dụng hook `useLocalSearchParams` để lấy `id` từ URL.
    -   Gọi API `appointmentService.getDetailsAppointmentForDoctor` (hoặc một API chi tiết tương tự cho bệnh nhân) với `id` đã lấy được.
3.  **Hiển thị Thông tin Chi tiết**:
    -   Hiển thị tất cả các thông tin chi tiết của cuộc hẹn:
        -   Thông tin bác sĩ (ảnh, tên, chuyên khoa).
        -   Thời gian chính xác.
        -   Lý do khám/ghi chú.
        -   Kết quả khám, đơn thuốc (nếu có).
        -   Trạng thái.

---

### Kết quả cần đạt cuối ngày:

-   Người dùng có thể vào tab "Lịch hẹn" và thấy danh sách tất cả các cuộc hẹn của mình.
-   Danh sách hiển thị các thông tin quan trọng và có trạng thái rõ ràng.
-   Người dùng có thể nhấn vào một cuộc hẹn để xem trang chi tiết với đầy đủ thông tin.
-   Chức năng làm mới danh sách hoạt động.
-   Giao diện xử lý tốt các trường hợp: đang tải, không có dữ liệu, và có lỗi.