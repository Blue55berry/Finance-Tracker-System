import React, { useState, useEffect } from 'react';
import { expenseService } from '../services/expenseService';
import { borrowingService } from '../services/borrowingServices';
import io from 'socket.io-client';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import DateRangePicker from '../components/expenses/common/DateRangePicker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date()
  });
  const [expensesData, setExpensesData] = useState({
    byCategory: [],
    byDay: []
  });
  const [borrowingsData, setBorrowingsData] = useState([]);
  const [borrowingsByLender, setBorrowingsByLender] = useState([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    fetchAnalyticsData();

    const socket = io('http://localhost:5000');
    socket.on('data-updated', () => {
      fetchAnalyticsData();
    });

    return () => {
      socket.disconnect();
    };
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const startDate = dateRange.startDate.toISOString();
      const endDate = dateRange.endDate.toISOString();

      console.log('Fetching analytics data...');
      const results = await Promise.allSettled([
        expenseService.getExpensesByCategory(startDate, endDate),
        expenseService.getExpensesByDay(startDate, endDate),
        borrowingService.getBorrowingsByDate(startDate, endDate),
        borrowingService.getBorrowingsByLender(startDate, endDate),
        expenseService.getExpenses({ limit: 5 }),
        borrowingService.getBorrowings({ limit: 5 })
      ]);
      console.log('Promise.allSettled results:', results);

      const [
        categoryDataResult,
        dailyDataResult,
        borrowingsResult,
        byLenderResult,
        recentExpensesResult,
        recentBorrowingsResult
      ] = results;

      if (categoryDataResult.status === 'fulfilled') {
        setExpensesData(prev => ({ ...prev, byCategory: categoryDataResult.value }));
      } else {
        console.error('expenseService.getExpensesByCategory rejected:', categoryDataResult.reason);
      }

      if (dailyDataResult.status === 'fulfilled') {
        const dailyData = dailyDataResult.value;
        setExpensesData(prev => ({ ...prev, byDay: dailyData }));
        const total = dailyData.reduce((total, day) => total + day.totalAmount, 0);
        setTotalSpent(total);
      } else {
        console.error('expenseService.getExpensesByDay rejected:', dailyDataResult.reason);
      }

      if (borrowingsResult.status === 'fulfilled') {
        setBorrowingsData(borrowingsResult.value);
      } else {
        console.error('borrowingService.getBorrowingsByDate rejected:', borrowingsResult.reason);
      }

      if (byLenderResult.status === 'fulfilled') {
        setBorrowingsByLender(byLenderResult.value);
      } else {
        console.error('borrowingService.getBorrowingsByLender rejected:', byLenderResult.reason);
      }

      if (recentExpensesResult.status === 'fulfilled' && recentBorrowingsResult.status === 'fulfilled') {
        const recentExpenses = recentExpensesResult.value.expenses.map(e => ({ ...e, type: 'expense' }));
        const recentBorrowings = recentBorrowingsResult.value.map(b => ({ ...b, type: 'borrowing' }));
        const combined = [...recentExpenses, ...recentBorrowings];
        combined.sort((a, b) => new Date(b.date) - new Date(a.date));
        setRecentTransactions(combined.slice(0, 5));
      } else {
        if (recentExpensesResult.status === 'rejected') {
          console.error('expenseService.getExpenses rejected:', recentExpensesResult.reason);
        }
        if (recentBorrowingsResult.status === 'rejected') {
          console.error('borrowingService.getBorrowings rejected:', recentBorrowingsResult.reason);
        }
      }

      const errors = results
        .filter(result => result.status === 'rejected')
        .map(result => result.reason?.message || result.reason?.toString() || 'Unknown error');

      if (errors.length > 0) {
        setError('Error(s) fetching data: ' + errors.join('; '));
      }

    } catch (err) {
      setError('An unexpected error occurred. Please check console for details.');
      console.error('Critical Error in fetchAnalyticsData:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
  };

  const categoryChartData = {
    labels: expensesData.byCategory.map(item => item._id),
    datasets: [
      {
        label: 'Spending by Category',
        data: expensesData.byCategory.map(item => item.totalAmount),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(199, 199, 199, 0.6)'
        ],
        borderWidth: 1
      }
    ]
  };

  const dailyChartData = {
    labels: expensesData.byDay.map(item => new Date(item._id).toLocaleDateString()),
    datasets: [
      {
        label: 'Daily Expenses',
        data: expensesData.byDay.map(item => item.totalAmount),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const borrowingsByLenderChartData = {
    labels: borrowingsByLender.map(item => item._id),
    datasets: [
      {
        label: 'Amount Borrowed',
        data: borrowingsByLender.map(item => item.totalAmount),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      }
    ]
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Financial Analytics</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="mb-6">
        <DateRangePicker
          initialStartDate={dateRange.startDate}
          initialEndDate={dateRange.endDate}
          onDateRangeChange={handleDateRangeChange}
        />
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Spending Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-blue-800">Total Expenses</h3>
              <span className="text-xs font-semibold text-green-600 bg-green-200 px-2 py-1 rounded-full">Live</span>
            </div>
            <p className="text-3xl sm:text-4xl font-bold text-blue-900 mt-2">
              ₹{totalSpent.toFixed(2)}
            </p>
          </div>

          <div className="bg-green-100 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-800">Average Daily Spending</h3>
            <p className="text-2xl sm:text-3xl font-bold text-green-900 mt-2">
              ₹{(totalSpent / (expensesData.byDay.length || 1)).toFixed(2)}
            </p>
          </div>

          <div className="bg-purple-100 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-purple-800">Total Borrowed</h3>
            <p className="text-2xl sm:text-3xl font-bold text-purple-900 mt-2">
              ₹{borrowingsData.reduce((total, item) => total + item.amount, 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Spending by Category</h2>
          <div className="h-64 sm:h-72 md:h-80 lg:h-96">
            <Pie data={categoryChartData} options={{ maintainAspectRatio: false, responsive: true }} />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Daily Spending</h2>
          <div className="h-64 sm:h-72 md:h-80 lg:h-96">
            <Line data={dailyChartData} options={{ maintainAspectRatio: false, responsive: true }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Top Expense Categories</h2>
          <div className="h-64 sm:h-72 md:h-80 lg:h-96">
            <Bar
              data={{
                labels: expensesData.byCategory.slice(0, 5).map(item => item._id),
                datasets: [
                  {
                    label: 'Amount',
                    data: expensesData.byCategory.slice(0, 5).map(item => item.totalAmount),
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                  }
                ]
              }}
              options={{ maintainAspectRatio: false, responsive: true }}
            />
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Recent Transactions</h2>
          <ul className="divide-y divide-gray-200">
            {recentTransactions.map(tx => (
              <li key={`${tx.type}-${tx._id}`} className="py-3 flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-2 rounded-full mr-3 ${tx.type === 'expense' ? 'bg-red-100' : 'bg-blue-100'}`}>
                    {tx.type === 'expense' ? '💸' : '💰'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {tx.type === 'expense' ? tx.description || tx.category : `Borrowed from ${tx.from}`}
                    </p>
                    <p className="text-xs text-gray-500">{new Date(tx.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className={`text-sm font-medium ${tx.type === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
                  {tx.type === 'expense' ? '-' : '+'}₹{tx.amount.toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
