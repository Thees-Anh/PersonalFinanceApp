<h1 align="center">Personal Finance App 💰</h1>

<p align="center">
  A comprehensive, cross-platform mobile application built with React Native (Expo) and Node.js to help users track their income, expenses, and monthly budgets effortlessly.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
</p>

---

## 🌟 Key Features

- **Secure Authentication**: User registration and login using JWT and bcrypt.
- **Dashboard Overview**: Instantly view your total balance, monthly income, and expenses.
- **Transaction Management**: Easily add, edit, or delete daily income and expense records.
- **Smart Analytics**: Visual representations of your spending habits using interactive Pie Charts and Bar Charts.
- **Budget Tracking**: Set monthly limits for specific categories (Food, Transport, etc.) and track your progress in real-time with dynamic progress bars.
- **Multi-language Support**: Seamlessly switch between English and Vietnamese across the entire application.
- **Dark/Light Mode**: User preferences for themes are fully supported.

## 🛠 Tech Stack

### Frontend (Mobile App)
- **Framework**: React Native with Expo
- **Navigation**: React Navigation (Bottom Tabs & Stack)
- **State Management**: Zustand
- **Charting**: `react-native-gifted-charts`
- **Networking**: Axios

### Backend (REST API)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB & Mongoose
- **Authentication**: JSON Web Tokens (JWT)

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local server or MongoDB Atlas cluster)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### 1. Clone the repository
```bash
git clone https://github.com/YourUsername/PersonalFinanceApp.git
cd PersonalFinanceApp
```

### 2. Backend Setup
Navigate to the `backend` directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/personalfinance
JWT_SECRET=your_super_secret_jwt_key
```
*(If you use MongoDB Atlas, replace `MONGODB_URI` with your connection string).*

Start the backend server:
```bash
npm start
# Server should now be running on http://localhost:5000
```

### 3. Frontend Setup
Open a new terminal window, navigate to the `frontend` directory and install dependencies:
```bash
cd frontend
npm install
```

Update the API base URL if necessary (default is usually set to `http://localhost:5000` or your local IP address in `frontend/src/api/client.ts`).

Start the Expo development server:
```bash
npx expo start -c
```
- Scan the QR code with the **Expo Go** app on your physical device.
- Or press `a` to run on Android Emulator / `i` for iOS Simulator.

---

## 📂 Project Structure

```
PersonalFinanceApp/
├── backend/
│   ├── controllers/      # Request handlers (auth, transactions, budgets)
│   ├── middleware/       # JWT authentication middleware
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API route definitions
│   └── index.js          # Entry point for Express server
│
├── frontend/
│   ├── src/
│   │   ├── api/          # Axios instances and API services
│   │   ├── components/   # Reusable UI components
│   │   ├── navigation/   # React Navigation setup
│   │   ├── screens/      # Application screens (Dashboard, Budget, etc.)
│   │   ├── store/        # Zustand state management
│   │   └── utils/        # i18n localization and helpers
│   └── App.tsx           # Entry point for Expo app
│
└── .gitignore
```

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](https://github.com/YourUsername/PersonalFinanceApp/issues).

## 📝 License
This project is open-source and available under the [MIT License](LICENSE).
