import { useState, useEffect } from "react"
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, BarChart, Bar
} from "recharts"
import * as XLSX from "xlsx"


function App() {
  // Main state for managing app data and UI behavior
  // transactions → stores all entries
  // role → controls access (viewer/admin)
  // filters → used for search, sorting, and time range


  const [transactions, setTransactions] = useState([])
  const [role, setRole] = useState("viewer")
  const [darkMode, setDarkMode] = useState(true)
  const [activeTab, setActiveTab] = useState("summary")
  const [collapsed, setCollapsed] = useState(false)

  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [timeFilter, setTimeFilter] = useState("all")

  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)

  const [newTransaction, setNewTransaction] = useState({
    amount: "",
    category: "",
    type: "expense",
    date: ""
  })



  // Load saved transactions from localStorage on initial render
  // If nothing is found, fallback to sample data for demo
  useEffect(() => {
    const saved = localStorage.getItem("transactions")
    if (saved) {
      const parsed = JSON.parse(saved)
      if (parsed.length > 0) {
        setTransactions(parsed)
        return
      }
    }

    setTransactions([
      { id: 1, amount: 45000, category: "Salary", type: "income", date: "2026-01-01" },
      { id: 2, amount: 1200, category: "Food", type: "expense", date: "2026-01-02" },
      { id: 3, amount: 8000, category: "Rent", type: "expense", date: "2026-01-05" },
      { id: 4, amount: 2000, category: "Freelance", type: "income", date: "2026-01-10" },
      { id: 5, amount: 700, category: "Transport", type: "expense", date: "2026-01-11" },
      { id: 6, amount: 46000, category: "Salary", type: "income", date: "2026-02-01" },
      { id: 7, amount: 5000, category: "Shopping", type: "expense", date: "2026-02-03" },
      { id: 8, amount: 1500, category: "Food", type: "expense", date: "2026-02-06" },
      { id: 9, amount: 3000, category: "Bills", type: "expense", date: "2026-02-09" },
      { id: 10, amount: 10000, category: "Freelance", type: "income", date: "2026-02-18" },
      { id: 11, amount: 47000, category: "Salary", type: "income", date: "2026-03-01" },
      { id: 12, amount: 2200, category: "Food", type: "expense", date: "2026-03-04" },
      { id: 13, amount: 9000, category: "Travel", type: "expense", date: "2026-03-07" },
      { id: 14, amount: 4000, category: "Shopping", type: "expense", date: "2026-03-12" },
      { id: 15, amount: 15000, category: "Freelance", type: "income", date: "2026-03-20" },
      { id: 16, amount: 48000, category: "Salary", type: "income", date: "2026-04-01" },
      { id: 17, amount: 1800, category: "Transport", type: "expense", date: "2026-04-02" },
      { id: 18, amount: 6000, category: "Medical", type: "expense", date: "2026-04-05" },
      { id: 19, amount: 2500, category: "Bills", type: "expense", date: "2026-04-08" },
      { id: 20, amount: 20000, category: "Freelance", type: "income", date: "2026-04-15" },
    ])
  }, [])



  // Persist transactions in localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions))
  }, [transactions])



  // Updates form input fields as user types
  const handleChange = (e) => {
    setNewTransaction({ ...newTransaction, [e.target.name]: e.target.value })
  }


  // Handles both adding new transactions and editing existing ones
  // Only admin is allowed to perform this action
  const handleAddTransaction = () => {
    if (role !== "admin") return;
    if (!newTransaction.amount || !newTransaction.category || !newTransaction.date) {
      alert("Fill all fields")
      return
    }

    const entry = {
      ...newTransaction,
      id: editId || Date.now(),
      amount: Number(newTransaction.amount)
    }

    if (editId) {
      setTransactions(transactions.map(t => t.id === editId ? entry : t))
      setEditId(null)
    } else {
      setTransactions([...transactions, entry])
    }

    setNewTransaction({ amount: "", category: "", type: "expense", date: "" })
    setShowForm(false)
  }



  // Deletes a transaction (restricted to admin)
  const handleDelete = (id) => {
    if (role === "admin") setTransactions(transactions.filter(t => t.id !== id))
  }


  // Loads selected transaction into form for editing
  const handleEdit = (t) => {
    if (role === "admin") {
      setEditId(t.id)
      setNewTransaction(t)
      setShowForm(true)
    }
  }


  // Calculate total income, expenses, and remaining balance
  // These values drive the dashboard summary
  const income = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0)
  const expenses = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0)
  const balance = income - expenses


  // Helper to calculate total expenses for a given month
  // Used for comparisons like current vs previous month
  const getMonthlyTotal = (monthOffset) => {
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() - monthOffset);
    const m = targetDate.getMonth();
    const y = targetDate.getFullYear();

    return transactions
      .filter(t => {
        const d = new Date(t.date);
        return d.getMonth() === m && d.getFullYear() === y && t.type === "expense";
      })
      .reduce((s, t) => s + t.amount, 0);
  }


  // Compare spending trends across months to generate insights
  const currentMonthExp = getMonthlyTotal(0);
  const prevMonthExp = getMonthlyTotal(1);
  const last3MonthsAvg = (getMonthlyTotal(1) + getMonthlyTotal(2) + getMonthlyTotal(3)) / 3;

  const calcDiff = (curr, prev) => prev === 0 ? 0 : ((curr - prev) / prev) * 100;
  const monthDiff = calcDiff(currentMonthExp, prevMonthExp);
  const avgDiff = calcDiff(currentMonthExp, last3MonthsAvg);
  const categories = [...new Set(transactions.map(t => t.category))]


  // Apply filters based on:
  // - time range
  // - transaction type
  // - category
  // - search keyword
  let filtered = transactions.filter(t => {
    const date = new Date(t.date)
    const today = new Date()
    const diff = (today - date) / (1000 * 60 * 60 * 24)

    return (
      (timeFilter === "all" || diff <= Number(timeFilter)) &&
      (filterType === "all" || t.type === filterType) &&
      (categoryFilter === "all" || t.category === categoryFilter) &&
      t.category.toLowerCase().includes(search.toLowerCase())
    )
  })
  // Sort transactions either by amount or by date (latest first)
  filtered.sort((a, b) =>
    sortBy === "amount"
      ? b.amount - a.amount
      : new Date(b.date) - new Date(a.date)
  )

  const filteredByTime = transactions.filter(t => {
    if (timeFilter === "all") return true;

    const diff = (new Date() - new Date(t.date)) / (1000 * 60 * 60 * 24);
    return diff <= Number(timeFilter);
  });



  // Prepare data for trend chart (sorted by date)
  const lineData = filteredByTime
    .sort((a, b) => new Date(a.date) - new Date(b.date)) // oldest → newest
    .map(t => ({
      date: t.date,
      amount: t.amount
    }));


  // Group expenses by month for comparison charts
  const comparisonData = filteredByTime
    .filter(t => t.type === "expense")
    .reduce((acc, t) => {
      const month = t.date.slice(0, 7);
      acc[month] = (acc[month] || 0) + t.amount;
      return acc;
    }, {});

  const comparisonDataArr = Object.keys(comparisonData)
    .sort()
    .map(key => ({
      name: key,
      value: comparisonData[key]
    }));


  // Build monthly summary including income, expense, and savings
  const monthlyDataMap = {};
  filteredByTime.forEach(t => {
    const month = t.date.slice(0, 7);
    if (!monthlyDataMap[month]) {
      monthlyDataMap[month] = { month, expense: 0, income: 0 };
    }
    if (t.type === "expense") monthlyDataMap[month].expense += t.amount;
    else monthlyDataMap[month].income += t.amount;
  });
  Object.values(monthlyDataMap).forEach(m => {
    m.savings = m.income - m.expense;
  });
  const monthlyData = Object.values(monthlyDataMap);


  // Calculate total spending per category (for pie chart)
  const categoryTotals = {}
  filteredByTime.forEach(t => {
    if (t.type === "expense") {
      categoryTotals[t.category] =
        (categoryTotals[t.category] || 0) + t.amount
    }
  })

  const totalExpense = Object.values(categoryTotals).reduce((a, b) => a + b, 0);
  const pieData = Object.keys(categoryTotals).map(key => ({
    category: key,
    value: categoryTotals[key],
    percent: totalExpense
      ? +((categoryTotals[key] / totalExpense) * 100).toFixed(1)
      : 0
  }));

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]



  // Export filtered data as CSV file
  const exportCSV = () => {
    const data = filteredByTime;

    const csv = data.map(t =>
      `${t.date},${t.category},${t.type},${t.amount}`
    ).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "filtered-transactions.csv";
    a.click();
  };


  // Export filtered data as JSON file
  const exportJSON = () => {
    const data = filteredByTime;

    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      { type: "application/json" }
    );

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "filtered-transactions.json";
    a.click();
  };


  // Export filtered data as Excel file using XLSX
  const exportExcel = () => {
    const data = filteredByTime;

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered Data");
    XLSX.writeFile(workbook, "filtered-transactions.xlsx");
  };


  // Find highest spending category for insights section
  const topCategory = Object.entries(
    transactions.filter(t => t.type === "expense")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount
        return acc
      }, {})
  ).sort((a, b) => b[1] - a[1])[0]

  return (
    <div className={`${darkMode ? "dark" : ""} flex h-screen overflow-hidden font-sans transition-colors duration-500`}>




      {/* SIDEBAR */}
      <div className={`${collapsed ? "w-20" : "w-72"} hidden lg:flex flex-col h-full bg-white dark:bg-[#0a0a0c] border-r border-gray-200 dark:border-gray-800 p-6 shadow-xl text-gray-900 dark:text-white transition-all duration-300`}>
        <div className="flex items-center gap-3 mb-10 px-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="mb-6 text-xs text-gray-500 hover:text-blue-500 transition"
          >
            {collapsed ? "➡" : "⬅"}
          </button>
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">F</div>
          <h2 className="text-xl font-bold tracking-tight">FinTrack</h2>
        </div>

        <nav className="flex-1">
          {["summary", "transactions", "insights", "recent activity", "notifications", "settings"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full ${collapsed ? "justify-center" : "justify-start"} px-4 py-3 rounded-xl mb-2 transition-all flex items-center gap-3 font-medium ${activeTab === tab
                ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
            >
              <span className={`capitalize ${collapsed ? "hidden" : "block"}`}>
                {tab}
              </span>
            </button>
          ))}
        </nav>

        {!collapsed && (
          <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-800">

            <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-3 block">
              Data Management
            </label>

            <select
              onChange={(e) => {
                if (e.target.value === "csv") exportCSV()
                if (e.target.value === "json") exportJSON()
                if (e.target.value === "excel") exportExcel()
              }}
              className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 dark:text-gray-300"
            >
              <option>Export Reports</option>
              <option value="csv">CSV Spreadsheet</option>
              <option value="json">JSON Feed</option>
              <option value="excel">Microsoft Excel</option>
            </select>

            {/* Contact Section */}
            <div className="mt-6 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">

              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">
                Support
              </p>

              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Having trouble or noticed something off? We're here to help.
              </p>

              <a
                href="https://fintrack.ac.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 mt-3 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline transition"
              >
                🌐 fintrack.ac.in
              </a>

            </div>

          </div>
        )}
      </div>


      {/* MAIN CONTENT */}
      <div className="flex-1 bg-gray-50/50 dark:bg-[#020203] p-4 sm:p-6 lg:p-10 overflow-y-auto">
        {/* 📱 MOBILE NAVBAR */}
        <div className="lg:hidden flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            FinTrack
          </h2>

          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="p-2 rounded-lg bg-white dark:bg-gray-900 border dark:border-gray-700 text-sm"
          >
            <option value="summary">Summary</option>
            <option value="transactions">Transactions</option>
            <option value="insights">Insights</option>
            <option value="recent activity">Recent Activity</option>
            <option value="notifications">Notifications</option>
            <option value="settings">Settings</option>

          </select>
        </div>

        {/* HEADER BAR */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white capitalize tracking-tight">{activeTab}</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your financial ecosystem seamlessly.</p>
          </div>

          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Perspective</p>
              <select
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  if (e.target.value !== "admin") setShowForm(false);
                }}
                className="p-2.5 px-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm text-sm font-medium outline-none text-gray-700 dark:text-gray-300"
              >
                <option value="viewer">Viewer Mode</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Period</p>
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="p-2.5 px-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm text-sm font-medium outline-none text-gray-700 dark:text-gray-300"
              >
                <option value="all">All Time</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 3 months</option>
                <option value="180">Last 6 months</option>
                <option value="365">Last 1 year</option>
              </select>
            </div>

            <button
              onClick={() => setDarkMode(prev => !prev)}
              className="p-2.5 px-5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl font-bold text-sm shadow-lg transition-transform active:scale-95"
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>
        </div>

        {/* Overview section showing key financial metrics and charts */}
        {activeTab === "summary" && (
          <div className="space-y-6 animate-in fade-in duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-card p-6 border-l-4 border-l-blue-500">
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Total Net Balance</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">₹{balance.toLocaleString()}</h3>
                <div className="mt-2 text-[10px] font-bold text-blue-500">LIQUID CAPITAL</div>
              </div>
              <div className="glass-card p-6 border-l-4 border-l-emerald-500">
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Monthly Revenue</p>
                <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">₹{income.toLocaleString()}</h3>
                <div className="mt-2 text-[10px] font-bold text-emerald-500">{(income > 0 ? (balance / income) * 100 : 0).toFixed(1)}% SAVINGS RATE</div>
              </div>
              <div className="glass-card p-6 border-l-4 border-l-rose-500">
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Total Expenditure</p>
                <h3 className="text-2xl font-bold text-rose-600 dark:text-rose-400">₹{expenses.toLocaleString()}</h3>
                <div className="mt-2 text-[10px] font-bold text-rose-500">{(income > 0 ? (expenses / income) * 100 : 0).toFixed(1)}% BURN RATE</div>
              </div>
              <div className="glass-card p-6 border-l-4 border-l-purple-500">
                <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Avg daily spend</p>
                <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400">₹{Math.round(expenses / (timeFilter === "all" ? 30 : Number(timeFilter))).toLocaleString()}</h3>
                <div className="mt-2 text-[10px] font-bold text-purple-500">30-DAY CYCLE BASIS</div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="glass-card p-8">
                <h3 className="font-bold mb-6 text-gray-800 dark:text-gray-200">Cash Flow Trends</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={lineData}>
                    <defs>
                      <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? "#333" : "#eee"} />
                    <XAxis dataKey="date" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="amount" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAmt)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="glass-card p-8">
                <h3 className="font-bold mb-6 text-gray-800 dark:text-gray-200">Expense Allocation</h3>
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart margin={{ top: 20, bottom: 20 }}>
                    <Pie
                      data={pieData}
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      nameKey="category"
                      labelLine={false}
                      label={({ category, percent }) =>
                        `${category} ${percent}%`
                      }
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>

                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

              <div className="glass-card p-8">
                <h3 className="font-bold mb-6 text-gray-800 dark:text-gray-200">
                  Income vs Expense
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#333" : "#eee"} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                    <Bar dataKey="income" fill="#10b981" />
                    <Bar dataKey="expense" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="glass-card p-8">
                <h3 className="font-bold mb-6 text-gray-800 dark:text-gray-200">
                  Monthly Savings Trend
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#333" : "#eee"} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                    <Line type="monotone" dataKey="savings" stroke="#10b981" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Transactions section where user can view, filter and manage entries */}
        {activeTab === "transactions" && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <input placeholder="Search category..." value={search} onChange={(e) => setSearch(e.target.value)} className="glass-card px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white" />
              <select onChange={(e) => setFilterType(e.target.value)} className="glass-card px-4 py-3 outline-none dark:bg-gray-900 dark:text-white">
                <option value="all">All Types</option>
                <option value="income">Income Only</option>
                <option value="expense">Expense Only</option>
              </select>
              <select onChange={(e) => setCategoryFilter(e.target.value)} className="glass-card px-4 py-3 outline-none dark:bg-gray-900 dark:text-white">
                <option value="all">All Categories</option>
                {categories.map((c, i) => <option key={i}>{c}</option>)}
              </select>
              <select onChange={(e) => setSortBy(e.target.value)} className="glass-card px-4 py-3 outline-none dark:bg-gray-900 dark:text-white">
                <option value="date">Sort by Date</option>
                <option value="amount">Sort by Amount</option>
              </select>
            </div>

            <div className="glass-card overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <h3 className="font-bold text-gray-800 dark:text-white">Transaction History</h3>
                {role === "admin" && (
                  <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all"
                  >
                    {showForm ? "✕ Close Editor" : "+ New Entry"}
                  </button>
                )}
              </div>

              {showForm && role === "admin" && (
                <div className="p-6 bg-gray-50 dark:bg-gray-800/50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 border-b border-gray-100 dark:border-gray-800">
                  <input name="amount" placeholder="Amount ₹" value={newTransaction.amount} onChange={handleChange} className="p-2.5 rounded-lg border dark:border-gray-700 dark:bg-gray-900 outline-none text-white" />
                  <input name="category" placeholder="Category" value={newTransaction.category} onChange={handleChange} className="p-2.5 rounded-lg border dark:border-gray-700 dark:bg-gray-900 outline-none text-white" />
                  <select name="type" value={newTransaction.type} onChange={handleChange} className="p-2.5 rounded-lg border dark:border-gray-700 dark:bg-gray-900 outline-none text-white">
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                  <input type="date" name="date" value={newTransaction.date} onChange={handleChange} className="p-2.5 rounded-lg border dark:border-gray-700 dark:bg-gray-900 outline-none text-white" />
                  <button onClick={handleAddTransaction} className="bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-colors">
                    {editId ? "Update" : "Confirm"}
                  </button>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800/30 text-gray-400 text-[11px] uppercase tracking-widest font-bold">
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-right">Amount</th>
                      {role === "admin" && <th className="px-6 py-4 text-center">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {filtered.length === 0 ? (
                      <tr>
                        <td
                          colSpan={role === "admin" ? 4 : 3}
                          className="text-center py-10 text-gray-500 dark:text-gray-400"
                        >
                          🚫 No transactions available
                        </td>
                      </tr>
                    ) : (
                      filtered.map(t => (
                        <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${t.type === 'income' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                              <span className="font-semibold text-gray-700 dark:text-gray-200">{t.category}</span>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">
                            {t.date}
                          </td>

                          <td className={`px-6 py-4 text-right font-bold ${t.type === 'income'
                            ? 'text-emerald-600'
                            : 'text-gray-900 dark:text-white'
                            }`}>
                            {t.type === 'income' ? '+' : '-'} ₹{t.amount.toLocaleString()}
                          </td>

                          {role === "admin" && (
                            <td className="px-6 py-4 text-center space-x-2">
                              <button
                                onClick={() => handleEdit(t)}
                                className="text-blue-500 hover:text-blue-700 text-xs font-bold"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(t.id)}
                                className="text-rose-500 hover:text-rose-700 text-xs font-bold"
                              >
                                Del
                              </button>
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Insights section highlighting spending patterns and financial health */}
        {activeTab === "insights" && (
          <div className="space-y-8 animate-in zoom-in duration-500">

            {/* TOP CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">

              {/* PRIMARY EXPENSE */}
              <div className="glass-card p-8 border-b-4 border-b-rose-500">
                <p className="text-xs uppercase tracking-widest font-bold text-red-500 mb-2">
                  Primary Expense
                </p>
                <h2 className="text-3xl font-black text-rose-500">
                  {topCategory ? topCategory[0] : "N/A"}
                </h2>
                <p className="text-rose-500 font-bold mt-2 text-xl">
                  ₹{topCategory ? topCategory[1].toLocaleString() : 0}
                </p>
              </div>

              {/* SAVINGS */}
              <div className="glass-card p-8 border-b-4 border-b-emerald-500">
                <p className="text-xs uppercase tracking-widest font-bold text-emerald-500 mb-2">
                  Savings Velocity
                </p>
                <h2 className="text-3xl font-black text-emerald-500">
                  {income > 0 ? ((balance / income) * 100).toFixed(1) : 0}%
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 italic">
                  Retained from total income
                </p>
              </div>

              {/* MOM VARIANCE */}
              <div className="glass-card p-8 border-b-4 border-b-blue-500">
                <p className="text-xs uppercase tracking-widest font-bold text-blue-500 mb-2">
                  MOM Variance
                </p>
                <h2 className={`text-3xl font-black ${monthDiff > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                  {monthDiff > 0 ? "+" : ""}{monthDiff.toFixed(1)}%
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                  Vs Previous Month
                </p>
              </div>

              {/* WEALTH */}
              <div className="glass-card p-8 border-b-4 border-b-purple-500">
                <p className="text-xs uppercase tracking-widest font-bold text-indigo-500 mb-2">
                  Wealth Ratio
                </p>
                <h2 className="text-3xl font-black text-purple-500">
                  {expenses > 0 ? (balance / expenses).toFixed(2) : "0"}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 italic">
                  Balance to Expense Ratio
                </p>
              </div>

              {/* FINANCIAL HEALTH */}
              <div className="glass-card p-8 border-b-4 border-b-indigo-500">
                <p className="text-xs uppercase tracking-widest font-bold text-pink-500 mb-2">
                  Financial Health
                </p>
                <h2 className="text-3xl font-black text-indigo-500">
                  {balance > (income * 0.2) ? "Excellent" : "Stable"}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                  {monthDiff > 0
                    ? `Spending increased by ${monthDiff.toFixed(1)}%. Review ${topCategory?.[0]} budget.`
                    : "Spending reduced. Your financial position is improving."}
                </p>
              </div>
            </div>


            {/* SMART FINANCIAL MESSAGE */}
            <div className="glass-card p-8 text-center border border-slate-200 dark:border-slate-800">
              <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">
                Financial Insight Summary
              </h2>
              <p className={`text-lg font-semibold ${monthDiff > 0 ? "text-rose-500" : "text-emerald-500"
                }`}>
                {monthDiff > 0
                  ? `⚠️ Your expenses increased by ${monthDiff.toFixed(1)}% compared to last month. It's time to take control and optimize your spending habits. Small changes can create big savings!`
                  : `🔥 Great job! Your expenses decreased by ${Math.abs(monthDiff).toFixed(1)}% this month. You're moving towards stronger financial discipline. Keep it up!`}
              </p>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch mt-4 auto-rows-fr">

              {/* GRAPHS */}
              <div className="glass-card p-6 xl:col-span-2 flex flex-col h-auto sm:h-[340px] md:h-[380px] xl:h-full">
                <h3 className="font-bold mb-6 text-slate-900 dark:text-white">
                  Strategic Expense Benchmark
                </h3>

                <ResponsiveContainer
                  width="100%"
                  height={window.innerWidth < 640 ? 220 : 450}
                >
                  <BarChart data={comparisonDataArr}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? "#333" : "#eee"} />
                    <XAxis dataKey="name" stroke="#888" fontSize={12} />
                    <YAxis stroke="#888" fontSize={12} />
                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                    <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={60}>
                      {comparisonDataArr.map((entry, index) => (
                        <Cell key={index} fill={index === 2 ? (monthDiff > 0 ? '#ef4444' : '#10b981') : '#3b82f6'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* QUICK OBSERVATIONS*/}
              <div className="glass-card p-6 border border-slate-200 dark:border-slate-800 flex flex-col h-full min-h-[350px]">

                <h4 className="font-bold text-slate-900 dark:text-white mb-4">
                  Quick Observations
                </h4>

                <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                  AI-driven insights based on your financial behavior
                </p>

                <ul className="space-y-6 text-[15px] leading-relaxed">

                  <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                    <div className="w-2 h-2 mt-2 rounded-full bg-emerald-500"></div>
                    <span>Your primary income source remains <b>Salary</b>, ensuring a stable income stream.</span>
                  </li>

                  <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                    <span>Average monthly spending is <b>₹{Math.round(last3MonthsAvg).toLocaleString()}</b>, defining your lifestyle baseline.</span>
                  </li>

                  <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                    <div className="w-2 h-2 mt-2 rounded-full bg-rose-500"></div>
                    <span>Most volatile category is <b>{topCategory?.[0]}</b>, causing major expense fluctuations.</span>
                  </li>

                  <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                    <div className="w-2 h-2 mt-2 rounded-full bg-purple-500"></div>
                    <span>Savings rate is <b>{(income > 0 ? (balance / income) * 100 : 0).toFixed(1)}%</b>, reflecting strong discipline.</span>
                  </li>

                  <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                    <div className="w-2 h-2 mt-2 rounded-full bg-yellow-500"></div>
                    <span>Current month spending is <b>₹{currentMonthExp.toLocaleString()}</b>, showing trend changes.</span>
                  </li>

                  <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                    <div className="w-2 h-2 mt-2 rounded-full bg-indigo-500"></div>
                    <span>{avgDiff.toFixed(1)}% deviation from your 3-month average spending pattern.</span>
                  </li>

                  <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                    <div className="w-2 h-2 mt-2 rounded-full bg-pink-500"></div>
                    <span>Maintaining this savings rate will significantly improve long-term financial growth.</span>
                  </li>

                  <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                    <div className="w-2 h-2 mt-2 rounded-full bg-cyan-500"></div>
                    <span>Reducing spending in <b>{topCategory?.[0]}</b> can boost savings efficiency.</span>
                  </li>

                  <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                    <div className="w-2 h-2 mt-2 rounded-full bg-orange-500"></div>
                    <span>Expense spikes suggest irregular spending habits that can be optimized.</span>
                  </li>

                  <li className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                    <div className="w-2 h-2 mt-2 rounded-full bg-lime-500"></div>
                    <span>Overall, your financial trajectory is positive with scope for further optimization.</span>
                  </li>

                </ul>

              </div>

            </div>

          </div>
        )}

        {activeTab === "recent activity" && (
          <div className="glass-card p-8 animate-in fade-in duration-500">
            <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
              Recent Activity
            </h3>

            <div className="space-y-4">
              {transactions.slice(0, 10).map((t, i) => (
                <div key={i} className="flex justify-between items-center border-b pb-3 border-gray-100 dark:border-gray-800">
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">{t.category}</p>
                    <p className="text-xs text-gray-500">{t.date}</p>
                  </div>
                  <p className={`font-bold ${t.type === "income" ? "text-emerald-500" : "text-rose-500"}`}>
                    {t.type === "income" ? "+" : "-"} ₹{t.amount}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="glass-card p-8 animate-in fade-in duration-500">
            <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
              Notifications
            </h3>

            <div className="space-y-4 text-sm">

              {expenses > income && (
                <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600">
                  ⚠️ Your expenses are higher than your income.
                </div>
              )}

              {balance > income * 0.3 && (
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600">
                  💰 Great job! You're saving well this month.
                </div>
              )}

              {filtered.length === 0 && (
                <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500">
                  📭 No transactions found for selected filters.
                </div>
              )}

            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === "settings" && (
          <div className="glass-card p-10 max-w-2xl animate-in fade-in duration-500 text-gray-900 dark:text-white">
            <h3 className="text-xl font-bold mb-6">User Configuration</h3>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
              <div>
                <p className="font-bold">System Role</p>
                <p className="text-sm text-gray-500">Defines your access permissions</p>
              </div>
              <span className="px-4 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-xs font-black uppercase rounded-full">
                {role}
              </span>
            </div>
          </div>
        )}

      </div>
    </div >
  )
}

export default App









