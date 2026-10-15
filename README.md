# 💰 Expense & Budget Tracker

A full-stack, personal finance management web application built with **React, Node.js, Express.js, and MongoDB**. Designed with a glassmorphic user interface, interactive visual analytics charts, JWT-authenticated protected routes, monthly budget category tracking, live search/filtering, transaction pagination, and CSV/PDF report exporting.

---

## 🌟 Features Overview

### 🔐 Authentication & Security
- **JWT Authentication & Security**: Password hashing with `bcryptjs`, persistent token storage, and backend route protection middleware.
- **User Preference Customization**: Multi-currency support (`$`, `€`, `£`, `₹`, `LKR`, `A$`, `C$`).
- **Instant Demo Account**: One-click auto-fill demo credentials (`john@example.com` / `password123`) for quick evaluation.

### 📊 Dashboard & Financial Summary
- **Real-time Overview Cards**: Live updates of Total Income, Total Expenses, Net Balance (cash flow state), and Monthly Budget Progress.
- **Budget Alert Notifications**: Visual warning banners when category spending reaches 80% or exceeds 100% of set limits.
- **Interactive Expense Charts**:
  - **Doughnut Chart**: Category-wise expense percentage distribution.
  - **Bar Chart**: Monthly cash flow comparison of Income vs Expenses.
- **Recent Transactions Table**: Quick view of recent records with direct Edit and Delete capabilities.

### 💳 Transaction Management & Analytics
- **Add, Edit & Delete Records**: Seamless modal form for logging income or expenses with date, payment method, category, and notes.
- **Live Search & Multi-criteria Filter**: Real-time filtering by keyword, transaction type (`Income` / `Expense`), category, and custom date range (`From` / `To`).
- **Pagination**: Paginated transaction history with page navigation controls.
- **Exporting Options**:
  - **CSV Export**: Download filtered transactions as spreadsheet `.csv`.
  - **PDF Export**: Generate PDF report documents with formatted summary tables.

### 🎯 Monthly Budget Setting & Tracking
- **Category Budget Limits**: Set target monthly spending limits for categories such as Food & Dining, Rent, Utilities, Entertainment, etc.
- **Visual Progress Bars**: Dynamic color-coded progress bars (Green = On Track, Amber = Near Limit, Red = Over Budget).

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons, Chart.js, React-Chartjs-2, React Router DOM v6, Axios |
| **Backend** | Node.js, Express.js, JSONWebToken (JWT), bcryptjs, json2csv, pdfkit-table, dotenv, cors |
| **Database** | MongoDB, Mongoose ODM (with automatic fallback to zero-config In-Memory MongoDB) |
| **Version Control**| Git & GitHub |

---

## 📁 Repository Directory Structure

```
Expense & Budget Tracker/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB Mongoose connection & in-memory fallback
│   ├── controllers/
│   │   ├── authController.js        # JWT Register, Login, Profile controllers
│   │   ├── transactionController.js # CRUD, pagination, filter, CSV & PDF export
│   │   └── budgetController.js     # Monthly budget limit management & progress calculation
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT bearer token verification
│   │   └── errorMiddleware.js       # Global error handler
│   ├── models/
│   │   ├── User.js                  # User schema with bcrypt hook
│   │   ├── Transaction.js           # Income & Expense schema
│   │   └── Budget.js                # Monthly category budget schema
│   ├── routes/
│   │   ├── authRoutes.js            # Auth API routes
│   │   ├── transactionRoutes.js     # Transaction API routes
│   │   └── budgetRoutes.js          # Budget API routes
│   ├── .env.example
│   ├── seed.js                      # Database seed script with sample data
│   ├── server.js                    # Express app entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Charts/             # Doughnut & Bar chart components
│   │   │   ├── Navbar.jsx          # Top navigation bar
│   │   │   ├── StatCard.jsx        # Summary metric card
│   │   │   ├── TransactionModal.jsx# Add/Edit record modal
│   │   │   ├── BudgetModal.jsx     # Set budget goal modal
│   │   │   └── ExportModal.jsx     # Report export dialog
│   │   ├── context/
│   │   │   ├── AuthContext.jsx     # User authentication state
│   │   │   └── FinanceContext.jsx  # Transactions & budgets state management
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx       # Financial overview dashboard
│   │   │   ├── Transactions.jsx    # Full history, search, pagination, export
│   │   │   ├── Budgets.jsx         # Monthly budget progress tracker
│   │   │   ├── Analytics.jsx       # Deep financial insights & rankings
│   │   │   ├── Login.jsx           # Glassmorphism login page
│   │   │   └── Register.jsx        # Signup page
│   │   ├── services/
│   │   │   └── api.js              # Axios HTTP client with JWT interceptor
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css               # Tailwind CSS & custom design system
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## ⚡ Quick Start & Installation

### Prerequisites
- **Node.js**: v18+ installed
- **npm**: v9+ installed
- *(Optional)* **MongoDB**: Local MongoDB server or MongoDB Atlas URI (If not present, the app automatically runs an in-memory MongoDB instance with pre-seeded demo data!).

---

### 1️⃣ Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `backend/` (or copy `.env.example`):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/expense_tracker
   JWT_SECRET=super_secret_jwt_key_expense_budget_tracker_2026
   NODE_ENV=development
   ```
4. *(Optional)* Seed initial sample data into MongoDB:
   ```bash
   npm run seed
   ```
5. Start the backend server:
   ```bash
   npm run dev
   ```
   *The backend server will run on `http://localhost:5000`.*

---

### 2️⃣ Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## 🔑 Demo Account Credentials

You can sign in immediately using the auto-fill button on the login screen or enter manually:

- **Email**: `john@example.com`
- **Password**: `password123`

---

## 📡 REST API Reference

### 1. Authentication Endpoints (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT token | Public |
| `GET` | `/api/auth/me` | Fetch current logged-in user profile | Private |
| `PUT` | `/api/auth/profile` | Update profile / currency preference | Private |

### 2. Transaction Endpoints (`/api/transactions`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/transactions` | Fetch paginated, filtered, & searched transactions | Private |
| `POST` | `/api/transactions` | Create new income/expense record | Private |
| `PUT` | `/api/transactions/:id` | Update existing transaction record | Private |
| `DELETE` | `/api/transactions/:id` | Delete transaction record | Private |
| `GET` | `/api/transactions/export/csv` | Download CSV spreadsheet report | Private |
| `GET` | `/api/transactions/export/pdf` | Download formatted PDF report document | Private |

### 3. Budget Endpoints (`/api/budgets`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/budgets` | Fetch monthly category budget limits & spent progress | Private |
| `POST` | `/api/budgets` | Set / update category monthly budget limit | Private |
| `DELETE` | `/api/budgets/:id` | Remove category budget limit | Private |

---

## 📄 License
This project is completed as part of the Software Engineering Module Individual Assignment.
