# 📊 Finance Dashboard UI - FinTrack

⚡ Built as part of a Frontend Developer Internship Assignment

An elegant, responsive, and interactive **Finance Dashboard** designed to help users track, analyze, and understand their financial activity through intuitive visualizations and structured data.

This project goes beyond basic UI implementation by focusing on **data-driven insights, interaction design, and real-world feature simulation**.

---

## 🚀 Live Demo
👉 https://finance-dashboard-ui-pi-swart.vercel.app/

---

## 🧠 Project Overview
Managing personal finances often involves scattered data and poor visibility into spending patterns. This dashboard solves that by transforming raw transaction data into **clear, interactive, and actionable insights**.

The application is designed to be:
* **Intuitive** → Easy to understand at a glance
* **Interactive** → Dynamic filtering and real-time updates
* **Insightful** → Converts data into meaningful observations
* **Practical** → Simulates real-world financial tools

---

## 🎯 Objectives
* Build a clean, modern dashboard interface
* Implement modular and reusable components
* Visualize financial data effectively
* Simulate real-world features (roles, exports, analytics)
* Maintain strong state management and UI consistency

---

## ✨ Core Features

### 📊 Financial Overview
Provides a snapshot of financial health through key metrics:
* Total Balance
* Total Income
* Total Expenses
* Savings Rate & Burn Rate
* Average Daily Spending
👉 These metrics are dynamically calculated from transaction data.

### 📈 Advanced Data Visualization
* **Time-Based Trends**
  * Area chart showing transaction flow over time
  * Helps identify financial patterns and fluctuations
* **Category-Based Analysis**
  * Pie chart displaying expense distribution
  * Includes percentage contribution per category
* **Monthly Analytics**
  * Bar chart (Income vs Expense)
  * Line chart (Savings trend)
👉 All charts are derived from processed data, not static values.

### 🔄 Dynamic Chart System
All visualizations update in real-time based on:
* Selected time range (30 days, 3/6 months, etc.)
* Applied filters
**Why this matters:**
Creates a highly interactive experience similar to real financial dashboards.

### 💳 Transactions Management System
A fully interactive transaction table with:
* Date, Category, Amount, Type
* Color indicators for income/expense
**Functionalities:**
* 🔍 Real-time search
* 🔃 Sorting (amount/date)
* 🎯 Multi-level filtering
* ➕ Add/Edit/Delete (Admin only)
👉 Built using controlled forms and conditional rendering.

### 🔍 Multi-Level Filtering Engine
Filters are applied simultaneously:
* Time-based filtering
* Category filtering
* Transaction type filtering
* Search-based filtering
* Sorting logic
**How it works:**
All filters operate on a derived dataset, ensuring consistent results across charts and tables.

### 👤 Role-Based UI Simulation
Simulates access control at UI level:
* **Viewer Mode**
  * Read-only access
  * Focus on analytics
* **Admin Mode**
  * Add/Edit/Delete transactions
  * Full interaction capability
**Implementation:**
Actions are conditionally executed based on role state.

### 📊 Insights & Analytics Engine
Dynamic insights generated from data:
* Highest spending category
* Month-over-month comparison
* 3-month average deviation
* Savings rate
* Financial health indicator
👉 Converts raw data into decision-making insights

### 🔴🟢 Month-over-Month Expense Analysis
The system compares current month expenses with the previous month and generates:
* 🔴 Red indicator → When spending has increased
* 🟢 Green indicator → When spending has decreased

It also calculates:
* Percentage change in spending
* Deviation from 3-month average

**💡 Smart Insight Message**
Based on this comparison, the dashboard generates a dynamic recommendation message:
* Alerts users when spending increases
* Encourages users when spending improves
👉 This transforms the dashboard from a data display → decision-support system

### 📤 Advanced Data Export System
Users can export filtered data in:
* JSON
* CSV
* Excel (via XLSX)
**Key Capability:**
* Export reflects active filters
* Supports time-based selection (30/90/180/365 days)
**Why this matters:**
Simulates real-world financial reporting tools.

---

## 🧠 Advanced Features (Beyond Requirements)
* **💾 Data Persistence (localStorage)**
  * Loads saved transactions on startup
  * Falls back to sample data if empty
  * Automatically saves updates
  👉 Ensures continuity without backend.
* **🌙 Dark Mode Support**
  * Implemented using Tailwind class-based theming
  * Toggle available in UI
  👉 Enhances accessibility and user comfort.
* **🎛 UI Interaction System**
  * Sidebar collapse/expand
  * Tab-based navigation
  * Mobile responsive dropdown navigation
  * Smooth transitions and animations
* **📱 Fully Responsive Design**
  * Works across mobile, tablet, and desktop
  * Adaptive layouts and components
* **🚫 Empty State Handling**
  * Displays meaningful messages when no data is available
  * Prevents UI confusion
* **🔔 Notifications System**
  * Displays contextual alerts based on: Overspending, Savings performance, No data scenarios
  👉 Logic-driven UI feedback system.
* **🕒 Recent Activity Panel**
  * Shows latest transactions
  * Quick overview of recent financial actions
  👉 Enhances dashboard usability.
* **🆘 Help & Support Section**
  * UI-level support section included in sidebar
  * Provides quick access to assistance

⚠️ **Note:** This is a UI simulation, not connected to backend services.

---

## ⚙️ State Management Strategy
Implemented using React Hooks:
**State Segments:**
* **Data State** → Transactions
* **UI State** → Tabs, dark mode, sidebar
* **Filter State** → Search, category, type, time
* **Form State** → Add/Edit transaction
👉 Keeps application lightweight while maintaining clarity.

---

## 🏗 Architecture Approach
* Component-based design
* Clear separation of concerns
* Modular sections: Dashboard, Transactions, Insights

---

## ⚖️ Technical Decisions
* **Recharts** → Easy integration for charts
* **Tailwind CSS** → Rapid and consistent styling
* **React Hooks** → Lightweight state management
* **XLSX** → Excel export capability

---

## ⚡ Performance Considerations
* Efficient data transformations using array methods
* Derived datasets for charts
* Minimal unnecessary re-renders

---

## 🚧 Limitations
* No backend integration
* Data persistence limited to localStorage
* Role-based access is simulated
* Help/Support is UI-only (non-functional backend)

---

## 🔮 Future Enhancements
* Backend integration (Node.js / Firebase)
* Authentication system
* Cloud data persistence
* Advanced analytics & forecasting
* Real notification system

---

## ⚙️ Setup Instructions

```bash
git clone https://github.com/KaavyaSaaksh/Finance-Dashboard-UI
cd Finance-Dashboard-UI
npm install
npm run dev
```

---
## 🧪 Evaluation Alignment
* Clean UI & UX
* Responsive design
* Functional dashboard
* Role-based behavior
* Data visualization
* State management
* Export functionality
* Advanced features beyond requirements
---

## Author
**Sakshi Kumari** Frontend Developer Intern Applicant 

---

