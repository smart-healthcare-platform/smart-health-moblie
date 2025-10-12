# Kế hoạch Ngày 1: Nền tảng & Cốt lõi (Foundation & Core Logic Porting)

**Mục tiêu chính:** Xây dựng bộ xương và hệ thần kinh cho ứng dụng. Kết thúc ngày hôm nay, chúng ta phải có một dự án chạy được, với toàn bộ logic nghiệp vụ từ phiên bản web đã được tích hợp.

---

### Nhiệm vụ 1: Phân tích và Cài đặt Thư viện (Est: 2 giờ)

1.  **Phân tích `package.json` của `smart-health-website`**:
    -   Mở tệp `package.json` của dự án web.
    -   Lên danh sách các thư viện logic cần thiết:
        -   `@reduxjs/toolkit`
        -   `react-redux`
        -   `redux-persist`
        -   `axios`
        -   `socket.io-client`
        -   `date-fns` (hoặc một thư viện xử lý ngày giờ tương tự cho RN)
2.  **Cài đặt Thư viện cho Mobile**:
    -   Mở terminal trong thư mục `smart-health-moblie`.
    -   Chạy lệnh `npm install` hoặc `yarn add` cho các thư viện đã liệt kê ở trên.
    -   **Quan trọng**: Cài đặt các thư viện dành riêng cho React Native:
        ```bash
        npm install @react-native-async-storage/async-storage
        npm install @react-navigation/native
        npm install react-native-screens react-native-safe-area-context
        ```

### Nhiệm vụ 2: Sao chép & Di chuyển Logic (Porting) (Est: 3 giờ)

1.  **Tạo Cấu trúc Thư mục**:
    -   Trong thư mục `smart-health-moblie`, tạo các thư mục sau (nếu chưa có):
        -   `src/redux/slices`
        -   `src/services`
        -   `src/types`
        -   `src/lib`
2.  **Sao chép Tệp**:
    -   Copy toàn bộ nội dung từ `smart-health-website/src/redux` sang `smart-health-moblie/src/redux`.
    -   Copy toàn bộ nội dung từ `smart-health-website/src/services` sang `smart-health-moblie/src/services`.
    -   Copy toàn bộ nội dung từ `smart-health-website/src/types` sang `smart-health-moblie/src/types`.
    -   Copy tệp `axios.ts` từ `smart-health-website/src/lib` sang `smart-health-moblie/src/lib`.

### Nhiệm vụ 3: Điều chỉnh & Cấu hình (Adaptation & Configuration) (Est: 3 giờ)

1.  **Cấu hình Redux Persist**:
    -   Mở tệp `smart-health-moblie/src/redux/index.ts`.
    -   Thay đổi import `storage` từ `redux-persist/lib/storage` (dành cho web) thành:
        ```typescript
        import AsyncStorage from '@react-native-async-storage/async-storage';
        ```
    -   Cập nhật `persistConfig` để sử dụng `AsyncStorage`.
2.  **Cấu hình Redux Store Provider**:
    -   Bọc toàn bộ ứng dụng trong `Provider` của `react-redux` và `PersistGate` của `redux-persist`. Thường thì việc này sẽ được thực hiện trong tệp `app/_layout.tsx`.
3.  **Kiểm tra Tương thích**:
    -   Mở các tệp vừa sao chép và tìm kiếm các import hoặc API dành riêng cho web (ví dụ: `window`, `localStorage` trực tiếp) và thay thế bằng các giải pháp tương đương trong React Native.
    -   Chạy ứng dụng lần đầu (`npm run start` hoặc `expo start`) để đảm bảo không có lỗi biên dịch nghiêm trọng nào từ các tệp logic vừa thêm vào.

---

### Kết quả cần đạt cuối ngày:

-   Dự án có thể khởi chạy trên máy ảo/thiết bị thật mà không bị crash.
-   Redux store được khởi tạo thành công và có thể đọc trạng thái (dù là rỗng) từ AsyncStorage.
-   Tất cả các tệp logic (slices, services) nằm đúng vị trí và không gây ra lỗi biên dịch.
-   **Không yêu cầu có bất kỳ giao diện người dùng nào được hoàn thiện.**