# Kế hoạch Ngày 2: Xác thực & Điều hướng (Authentication & Navigation)

**Mục tiêu chính:** Hoàn thiện luồng xác thực người dùng. Kết thúc ngày hôm nay, người dùng phải có khả năng đăng nhập, đăng ký, đăng xuất, và ứng dụng phải tự động điều hướng họ đến đúng khu vực.

---

### Nhiệm vụ 1: Xây dựng Giao diện Xác thực (Est: 3 giờ)

1.  **Tạo các tệp màn hình**:
    -   Trong `app/(auth)/`, tạo `LoginScreen.tsx` và `RegisterScreen.tsx`.
    -   `app/(auth)/_layout.tsx` sẽ định nghĩa Stack Navigator cho nhóm này.
2.  **Thiết kế Giao diện Người dùng (UI)**:
    -   Sử dụng các component cơ bản của React Native (`View`, `Text`, `TextInput`, `Button`, `StyleSheet`).
    -   **`LoginScreen.tsx`**:
        -   Tiêu đề "Đăng nhập".
        -   Ô nhập `Email`.
        -   Ô nhập `Mật khẩu` (với `secureTextEntry={true}`).
        -   Nút "Đăng nhập".
        -   Một liên kết văn bản để điều hướng sang màn hình Đăng ký.
    -   **`RegisterScreen.tsx`**:
        -   Tương tự Login, thêm các trường cần thiết (ví dụ: "Họ và tên").

### Nhiệmvụ 2: Kết nối Logic Xác thực (Est: 3 giờ)

1.  **Quản lý Trạng thái Form**:
    -   Sử dụng `useState` trong từng màn hình để quản lý giá trị của các ô nhập liệu.
2.  **Xử lý Sự kiện `onPress`**:
    -   Khi người dùng nhấn nút "Đăng nhập" trên `LoginScreen`:
        -   Gọi hàm `authService.login(email, password)`.
        -   Sử dụng `try...catch` để xử lý lỗi (ví dụ: sai mật khẩu).
        -   Nếu thành công, `dispatch` action `setCredentials` với dữ liệu nhận được.
    -   Tương tự cho màn hình Đăng ký.
3.  **Hiển thị Phản hồi**:
    -   Sử dụng `Alert.alert` để hiển thị các thông báo lỗi hoặc thành công một cách đơn giản.
    -   Thêm `ActivityIndicator` để hiển thị trạng thái đang tải khi gọi API.

### Nhiệm vụ 3: Thiết lập Điều hướng Gốc (Est: 2 giờ)

1.  **Tạo `RootLayout.tsx`**:
    -   Đây sẽ là layout gốc của ứng dụng (có thể là `app/_layout.tsx`).
    -   Trong component này, sử dụng `useSelector` để lấy trạng thái `isLoggedIn` và `isInitialized` từ `authSlice`.
2.  **Điều hướng có Điều kiện**:
    -   Nếu `!isInitialized`, hiển thị một màn hình tải toàn trang (`SplashScreen` hoặc `ActivityIndicator`).
    -   Nếu `isInitialized` và `isLoggedIn`, hiển thị `<Tabs />` (Tab Navigator chính).
    -   Nếu `isInitialized` và `!isLoggedIn`, hiển thị `<Stack />` của nhóm `(auth)`.
3.  **Thiết lập Tab Navigator**:
    -   Trong `app/(tabs)/_layout.tsx`, định nghĩa các tab chính của ứng dụng (Trang chủ, Lịch hẹn,...) với các icon phù hợp. Các màn hình nội dung có thể chỉ là placeholder ở bước này.
4.  **Xử lý Đăng xuất**:
    -   Tạo một màn hình `ProfileScreen.tsx` trong `(tabs)`.
    -   Thêm một nút "Đăng xuất" trên màn hình này.
    -   Khi nhấn nút, `dispatch` action `clearAuth`. Ứng dụng sẽ tự động render lại RootLayout và chuyển người dùng về màn hình Đăng nhập.

---

### Kết quả cần đạt cuối ngày:

-   Người dùng có thể mở app, thấy màn hình đăng nhập.
-   Có thể nhập thông tin và đăng nhập thành công.
-   Sau khi đăng nhập, được chuyển hướng đến màn hình chính với các tab điều hướng.
-   Có thể vào tab "Hồ sơ" và đăng xuất để quay lại màn hình đăng nhập.
-   Luồng đăng ký hoạt động.