# Finance Dashboard UI - FinTrack

⚡ Built as part of a Frontend Developer Internship Assignment

An elegant, responsive, and interactive **Finance Dashboard** designed to simplify how users track, analyze, and understand their financial activity.

This project demonstrates strong fundamentals in **frontend architecture, UI/UX design, data visualization, and state management**, with a focus on delivering clarity through design rather than unnecessary complexity.

---

* 🚀 **Live Demo:** https://finance-dashboard-ui-pi-swart.vercel.app/

---

## 🧠 Project Overview

Managing personal finances often involves scattered data and limited visibility into spending habits. This dashboard addresses that gap by presenting financial data in a **structured, visual, and interactive format**.

The goal was to design an interface that is:

* **Intuitive** → Easy to understand at a glance
* **Interactive** → Allows exploration through filters and charts
* **Insightful** → Provides meaningful observations, not just raw data

---

## 🎯 Objectives

* Build a clean and modern dashboard interface
* Implement reusable and modular components
* Provide meaningful financial insights using visualizations
* Simulate real-world application behavior (roles, filters, analytics)
* Ensure responsiveness across devices

---

## ✨ Core Features

### 📊 Financial Overview

* Displays key metrics:

  * Total Balance
  * Total Income
  * Total Expenses
* Provides a quick snapshot of financial health

---

### 📈 Data Visualization

**Time-Based Trends**

* Visual representation of financial activity over time
* Helps identify patterns, growth, or decline

**Category-Based Analysis**

* Pie chart showing spending distribution
* Quickly highlights high-expense categories

---

### 💳 Transactions Management

A structured and interactive transaction table including:

* Date
* Amount
* Category
* Transaction Type

**Functionalities:**

* 🔍 Real-time search
* 🔃 Sorting (amount/date)
* 🎯 Filtering (time range, category, type)

---

### 👤 Role-Based UI Simulation

Implements frontend-based role behavior:

* **Viewer Mode**

  * Read-only access
  * Focus on data visualization

* **Admin Mode**

  * Can add/edit transactions
  * Demonstrates interactive capabilities

This simulates real-world access control without backend complexity.

---

### 📊 Insights & Analytics

Provides meaningful observations derived from data:

* Highest spending category
* Monthly expense comparison
* Trend-based insights

Transforms raw financial data into actionable understanding.

---

### ⚙️ State Management Strategy

The application state is handled using **React hooks**, ensuring:

* Clear data flow
* Minimal complexity
* Easy maintainability

State includes:

* Transactions data
* Filters and search queries
* Selected user role

---

### 🎨 UI & UX Design

The interface is designed with a focus on:

* Clean layout and readability
* Strong visual hierarchy
* Consistent component design

Enhancements include:

* 🌙 Dark mode support
* 📱 Fully responsive layout
* 🚫 Graceful handling of empty states

---

## 🚀 Additional Enhancements

Beyond the core requirements, the following features were implemented to enhance usability and realism:

### 🌙 Dark Mode Support

Implemented using Tailwind’s class-based theming to improve accessibility and provide a better viewing experience in different lighting conditions.

---

### 📤 Data Export Functionality

Users can export transaction data in **CSV/Excel format** using the XLSX library, simulating real-world financial reporting features.

---

### 📱 Responsive Design

The dashboard adapts seamlessly across mobile, tablet, and desktop devices, ensuring consistent usability.

---

### 🎯 Advanced Filtering

Multiple filters (time range, category, transaction type) work together, allowing users to deeply analyze their financial data.

---

### ⚡ Interactive UI Feedback

Hover effects, transitions, and dynamic updates improve responsiveness and user engagement.

---

### 🧠 Empty State Handling

The UI gracefully handles scenarios where no data is available, preventing confusion and maintaining clarity.

---

### 📊 Dynamic Charts

All charts update in real-time based on applied filters, making the dashboard highly interactive and data-driven.

---

These enhancements reflect a focus on building a polished, user-centric application rather than just meeting minimum requirements.

---

## 🛠 Tech Stack

| Layer         | Technology    |
| ------------- | ------------- |
| Frontend      | React (Vite)  |
| Styling       | Tailwind CSS  |
| Visualization | Recharts      |
| Data Export   | XLSX          |
| Tooling       | Vite + ESLint |

---

## 🏗 Architecture Approach

The project follows a **component-based architecture**, ensuring:

* Reusability
* Maintainability
* Separation of concerns

Each section (Dashboard, Transactions, Insights) is modular and independently manageable.

---

## ⚖️ Technical Decisions & Trade-offs

* **Recharts** was chosen for its simplicity and seamless React integration
* **Tailwind CSS** enabled rapid UI development and consistent styling
* **React hooks** were used instead of Redux to keep the project lightweight
* Mock data was used to focus purely on frontend implementation

---

## 🚧 Limitations

* No backend or database integration
* Data is not persistent (resets on refresh)
* Role-based access is simulated

---

## 🔮 Future Enhancements

* Backend integration (Node.js / Firebase)
* Authentication and authorization system
* Persistent data storage
* Advanced analytics and forecasting

---

## ⚙️ Setup Instructions

```bash
# Clone the repository
git clone https://github.com/your-username/finance-dashboard-ui.git

# Navigate to the project
cd finance-dashboard-ui

# Install dependencies
npm install

# Run the app
npm run dev
```

---

## 🧪 Evaluation Alignment

This project aligns with the assignment requirements by demonstrating:

* ✔ Clean and intuitive UI design
* ✔ Responsive layout across devices
* ✔ Functional data visualization
* ✔ Transaction management with filtering & sorting
* ✔ Role-based UI behavior
* ✔ Structured and maintainable code

---

## 🙌 Author

**Sakshi Kumari**
Frontend Developer Intern Applicant 🚀

---

⭐ If you like this project, feel free to star the repository!
