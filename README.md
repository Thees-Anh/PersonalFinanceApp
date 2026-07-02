<h1 align="center">Ứng Dụng Quản Lý Tài Chính Cá Nhân 💰</h1>

<p align="center">
  Một ứng dụng di động đa nền tảng, chuyên nghiệp được xây dựng bằng <strong>React Native (Expo)</strong> và <strong>Java (Spring Boot)</strong> giúp người dùng theo dõi thu chi, quản lý ngân sách và lên kế hoạch tài chính một cách toàn diện.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java" />
  <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
</p>

---

## 🌟 Kịch Bản & Chức Năng Nổi Bật

Ứng dụng được thiết kế để bao quát toàn bộ vòng đời tài chính của bạn thông qua các tính năng cốt lõi sau:

1. **Giao Dịch (Transactions) - *Ghi nhận hàng ngày***
   - **Mô tả:** Nơi bạn ghi lại các khoản thu (lương, thưởng) và chi (ăn uống, đi lại). 
   - **Tính năng:** Phân loại theo danh mục, thêm ghi chú, xóa giao dịch. Mọi thay đổi lập tức phản ánh lên Số dư tổng (Total Balance) trên trang chủ.

2. **Thống Kê (Analytics) - *Phân tích chi tiêu***
   - **Mô tả:** Giúp bạn nhìn nhận thói quen tiêu tiền của mình.
   - **Tính năng:** Trực quan hóa dữ liệu bằng Biểu đồ tròn (Pie Chart) cho phân bổ danh mục và Biểu đồ cột (Bar Chart) so sánh Thu - Chi trong tuần/tháng.

3. **Ngân Sách (Budget) - *Giới hạn chi tiêu***
   - **Mô tả:** Ngăn chặn việc "vung tay quá trán".
   - **Tính năng:** Đặt ngân sách cho từng danh mục (vd: Ăn uống 3.000.000đ). Hệ thống có thanh tiến độ cảnh báo màu đỏ khi bạn chi tiêu sắp vượt ngưỡng.

4. **Mục Tiêu Tiết Kiệm (Saving Goals) - *Hiện thực hóa ước mơ***
   - **Mô tả:** Dùng để tiết kiệm cho những món đồ lớn như Mua xe, Đổi điện thoại.
   - **Tính năng:** Đặt số tiền mục tiêu và hạn chót. Bạn có thể nạp tiền (Add Funds) nhiều lần. Ứng dụng tự động tính phần trăm hoàn thành (%) và số tiền còn thiếu.

5. **Hóa Đơn Định Kỳ (Subscriptions) - *Theo dõi phí cố định***
   - **Mô tả:** Theo dõi các dịch vụ như Netflix, Spotify, Tiền điện, Internet.
   - **Tính năng:** Nhập số tiền và chu kỳ (Hàng tháng/Hàng năm). Hệ thống tự đếm lùi số ngày đến hạn thanh toán, báo màu cam/đỏ nếu sắp hoặc đã quá hạn.

6. **Khoản Nợ (Debts) - *Sổ nợ thông minh***
   - **Mô tả:** Không bao giờ quên tiền mình đã cho vay hoặc đi vay.
   - **Tính năng:** Phân biệt "Tôi Đi Vay" và "Tôi Cho Vay". Có ghi nhận Lãi suất, Ngày đến hạn và Nút công tắc chuyển đổi nhanh trạng thái **CHƯA TRẢ -> ĐÃ TRẢ**.

7. **Phân Quyền & Quản Trị (Admin Panel) - *Kiểm soát hệ thống***
   - **Mô tả:** Hệ thống phân quyền (Role-Based Access Control) chặt chẽ giữa User và Admin.
   - **Tính năng:** Admin có Dashboard riêng biệt để theo dõi tổng quan số liệu toàn hệ thống. Cung cấp bộ công cụ **Quản lý người dùng** (Chặn/Mở chặn tài khoản chống spam) và **Hệ thống Phát Thông Báo (System Announcements)** với chuông báo đỏ Real-time tới toàn bộ thiết bị của người dùng.

8. **Đa Ngôn Ngữ & Giao Diện (Tiếng Việt/English, Dark/Light Mode)**
   - Hệ thống i18n hỗ trợ dịch toàn bộ ứng dụng sang Tiếng Việt.

---

## 🛠 Công Nghệ Sử Dụng

### Frontend (Mobile App)
- **Framework**: React Native với Expo
- **Điều hướng**: React Navigation (Bottom Tabs & Stack)
- **Quản lý State**: Zustand
- **Biểu đồ**: `react-native-gifted-charts`
- **Xử lý API**: Axios

### Backend (REST API)
- **Nền tảng**: Java (JDK 17+)
- **Framework**: Spring Boot 3
- **Cơ sở dữ liệu**: MongoDB & Spring Data MongoDB
- **Bảo mật & Auth**: JSON Web Tokens (JWT), Spring Security, BCrypt

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Test 

Làm theo các bước dưới đây để chạy và kiểm thử (test) chương trình trên máy tính của bạn.

### Yêu Cầu Hệ Thống (Prerequisites)
- [Java Development Kit (JDK)](https://adoptium.net/) (Phiên bản 17 trở lên).
- [Node.js & npm](https://nodejs.org/) (Bản LTS).
- [MongoDB](https://www.mongodb.com/try/download/community) (Cài đặt máy chủ cục bộ hoặc dùng MongoDB Atlas).

### Bước 1: Khởi động Backend (Spring Boot)
Mở Terminal / Command Prompt và di chuyển vào thư mục `backend`:
```bash
cd backend
```

(Tùy chọn) Cấu hình URI của MongoDB trong file `src/main/resources/application.properties` nếu bạn dùng database riêng. Mặc định hệ thống dùng `mongodb://localhost:27017/personalfinance`.

Chạy lệnh sau để tải thư viện và chạy server Backend:
```bash
# Trên Windows:
.\mvnw.cmd spring-boot:run

# Trên Mac/Linux:
./mvnw spring-boot:run
```
> **Kiểm thử:** Backend sẽ chạy thành công tại địa chỉ `http://localhost:5000`.

### Bước 2: Khởi động Frontend (React Native / Expo)
Mở một cửa sổ Terminal **mới**, di chuyển vào thư mục `frontend`:
```bash
cd frontend
```

Cài đặt các gói thư viện NPM:
```bash
npm install
```

Khởi động máy chủ Expo:
```bash
npx expo start -c
```

### Bước 3: Chạy App Trên Thiết Bị Để Test (Expo Go)
Để test ứng dụng với trải nghiệm thực tế tốt nhất, hãy dùng điện thoại của bạn:

1. **Tải App Expo Go**: Cài đặt ứng dụng "Expo Go" từ App Store (iOS) hoặc Google Play (Android).
2. **Cùng Mạng Wi-Fi**: Đảm bảo điện thoại và máy tính của bạn đang kết nối chung một mạng Wi-Fi.
3. **Cấu hình IP máy chủ**: 
   - Mở file `frontend/src/api/client.ts` trên máy tính.
   - Đổi `baseURL: 'http://localhost:5000/api'` thành địa chỉ IP mạng LAN của máy tính bạn. 
   - *Ví dụ: `baseURL: 'http://192.168.1.5:5000/api'`*. (Có thể dùng lệnh `ipconfig` trên CMD để xem IP).
4. **Quét Mã QR**: 
   - Dùng camera (iOS) hoặc app Expo Go (Android) quét mã QR hiện ra ở Terminal ở Bước 2.
   - Ứng dụng sẽ tự động tải (bundle) và hiển thị trên điện thoại.

### Kịch Bản Test (Test Scenario)
1. **Đăng ký / Đăng nhập**: Tạo một tài khoản mới và đăng nhập.
2. **Ngôn ngữ**: Vào Tab **Profile** -> Chọn Language -> Chuyển sang Tiếng Việt.
3. **Thêm Giao Dịch**: Bấm nút **[+] Thêm** (ở giữa) -> Nhập số tiền 500.000, Chọn danh mục "Ăn uống". Quay lại trang chủ để xem Số dư tổng giảm xuống.
4. **Mục Tiêu Tiết Kiệm**: Bấm nút **Goals** -> Tạo mục tiêu "Mua iPhone" (30 triệu). Bấm vào mục tiêu -> Nạp 10 triệu và xem thanh tiến độ tăng lên.
5. **Khoản Nợ**: Bấm nút **Debts** -> Tạo một bản ghi "Tôi đi vay" 1 triệu. Bấm nút "CHƯA TRẢ" trên thẻ (card) để đổi ngay lập tức thành trạng thái "ĐÃ TRẢ" màu xanh.
6. **Kiểm Thử Quyền Admin**: Thoát tài khoản hiện tại, đăng nhập bằng `admin@personalfinance.com` (mật khẩu: `admin123`). Vào **Tab Admin** bên dưới góc phải, thử đăng 1 thông báo mới hoặc khóa (Ban) một người dùng bất kỳ. Đăng nhập lại bằng tài khoản bị khóa để xác minh lớp bảo mật.

---

## 📂 Cấu Trúc Thư Mục Chính

```
PersonalFinanceApp/
├── backend/                  # Chứa toàn bộ mã nguồn Java Spring Boot
│   ├── src/main/java/.../
│   │   ├── controllers/      # Chứa các Endpoints API (GoalController, DebtController...)
│   │   ├── models/           # Định nghĩa cấu trúc Database (Debt, Goal, User...)
│   │   ├── repositories/     # Tương tác với MongoDB
│   │   └── security/         # Xử lý bảo mật JWT
│   └── pom.xml               
├── frontend/                 # Chứa toàn bộ mã nguồn React Native (Expo)
│   ├── src/
│   │   ├── api/              # Cấu hình Axios gọi API backend
│   │   ├── screens/          # Giao diện chính (DashboardScreen, GoalsScreen, DebtsScreen...)
│   │   ├── store/            # Quản lý State toàn cục bằng Zustand
│   │   └── utils/            # Hệ thống đa ngôn ngữ (i18n.ts)
│   └── App.tsx               # Điểm khởi chạy của ứng dụng
└── README.md
```

---

**Cảm ơn bạn đã quan tâm đến dự án. Chúc bạn một ngày làm việc năng suất!**
