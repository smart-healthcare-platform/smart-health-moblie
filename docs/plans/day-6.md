# Kế hoạch Ngày 6: Hồ sơ & Hoàn thiện (Profile & Polish)

**Mục tiêu chính:** Hoàn thiện các màn hình phụ trợ, đồng thời rà soát và nâng cao chất lượng trải nghiệm người dùng trên toàn bộ ứng dụng.

---

### Nhiệm vụ 1: Xây dựng Màn hình Hồ sơ (Est: 3 giờ)

1.  **Tạo Màn hình**:
    -   Tạo tệp `app/(tabs)/profile.tsx`.
2.  **Lấy và Hiển thị Dữ liệu**:
    -   Sử dụng `useSelector` để lấy đối tượng `user` từ `authSlice`.
    -   Hiển thị các thông tin cá nhân của người dùng:
        -   Ảnh đại diện (`Avatar`).
        -   Họ và tên.
        -   Email, số điện thoại.
        -   Ngày sinh, giới tính.
3.  **Thêm các Hành động**:
    -   Tạo một danh sách các "hành động" hoặc "lối tắt". Mỗi mục là một `TouchableOpacity` có icon và text.
    -   Các mục bao gồm:
        -   "Chỉnh sửa thông tin" (có thể tạm thời chưa cần làm màn hình chỉnh sửa).
        -   "Lịch sử cuộc hẹn" (điều hướng đến tab Lịch hẹn).
        -   "Cài đặt" (placeholder).
        -   "Đăng xuất".
4.  **Kết nối Nút Đăng xuất**:
    -   Đảm bảo nút "Đăng xuất" `dispatch` action `clearAuth` để đưa người dùng về màn hình đăng nhập.

### Nhiệm vụ 2: Đánh bóng Toàn bộ Ứng dụng (Polishing) (Est: 5 giờ)

Đây là giai đoạn quan trọng để biến một ứng dụng "chạy được" thành một ứng dụng "dùng tốt".

1.  **Rà soát Luồng người dùng (User Flow Review)**:
    -   Đi qua tất cả các luồng đã làm: Đăng nhập -> Xem lịch sử -> Đặt lịch hẹn -> Chẩn đoán -> Xem hồ sơ -> Đăng xuất.
    -   Ghi chú lại những điểm chưa mượt mà, thiếu phản hồi cho người dùng.
2.  **Thêm Chỉ báo Tải (Loading Indicators)**:
    -   **Toàn màn hình**: Sử dụng một component `LoadingOverlay` cho các tác vụ chặn như đăng nhập, đăng ký.
    -   **Trong component**: Sử dụng `ActivityIndicator` nhỏ bên cạnh nút hoặc thay cho nội dung khi một phần của màn hình đang tải (ví dụ: tải danh sách lịch hẹn).
3.  **Xử lý Trạng thái Lỗi (Error Handling)**:
    -   Đảm bảo mọi lệnh gọi API đều nằm trong khối `try...catch`.
    -   Khi có lỗi, sử dụng `Alert.alert` của React Native để hiển thị thông báo lỗi một cách rõ ràng và thân thiện cho người dùng. Ví dụ: "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin." thay vì chỉ log lỗi ra console.
4.  **Thống nhất Giao diện (UI Consistency)**:
    -   Tạo một tệp `constants/Colors.ts` và `constants/Styles.ts` để định nghĩa các màu sắc và style chung (cỡ chữ, padding,...).
    -   Áp dụng các hằng số này trên toàn bộ ứng dụng để đảm bảo sự nhất quán.
    -   Kiểm tra lại các nút, form nhập liệu, tiêu đề để chúng có cùng một phong cách thiết kế.
5.  **Tối ưu hóa `FlatList`**:
    -   Đảm bảo đã sử dụng `keyExtractor` đúng cách.
    -   Sử dụng `memo` cho các component item trong danh sách (`AppointmentCard`) để tránh re-render không cần thiết.

---

### Kết quả cần đạt cuối ngày:

-   Màn hình Hồ sơ hiển thị đúng thông tin người dùng và có nút đăng xuất hoạt động.
-   Tất cả các màn hình đều có chỉ báo tải khi thực hiện tác vụ bất đồng bộ.
-   Các lỗi từ API được xử lý và thông báo cho người dùng một cách tường minh.
-   Giao diện người dùng trên toàn ứng dụng trông nhất quán và chuyên nghiệp hơn.
-   Ứng dụng cho cảm giác sử dụng mượt mà, phản hồi tốt hơn.