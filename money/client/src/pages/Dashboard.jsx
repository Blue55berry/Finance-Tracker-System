import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { expenseService } from '../services/expenseService';
import { borrowingService } from '../services/borrowingServices';
import { incomeService } from '../services/incomeService';
import DashboardSummary from '../dashboard/DashboardSummary';
import RecentExpenses from '../components/expenses/dashboard/RecentExpenses';
import BorrowingsOverview from '../components/expenses/dashboard/BorrowingOverview';
import SpendingChart from '../components/expenses/dashboard/SpendingChart';
import QuickAddExpense from '../components/expenses/QuickAddExpense';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({
    totalSpent: 0,
    totalBorrowed: 0,
    totalIncome: 0,
    weeklySpending: []
  });
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [borrowings, setBorrowings] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        const [weeklySummary, expenses, borrowingsData, incomeSummary] = await Promise.all([
          expenseService.getWeeklySummary(),
          expenseService.getExpenses({ limit: 5 }),
          borrowingService.getBorrowings(),
          incomeService.getIncomeSummary()
        ]);

        const totalBorrowed = borrowingsData.reduce(
          (total, item) => total + item.amount, 0
        );
        
        setSummary({
          totalSpent: weeklySummary.weekTotal,
          totalBorrowed,
          totalIncome: incomeSummary.totalIncome,
          weeklySpending: weeklySummary.dailyExpenses
        });
        
        setRecentExpenses(expenses);
        setBorrowings(borrowingsData);
        
      } catch (err) {
        setError(err.message);
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const handleAddExpense = async (newExpense) => {
    try {
      await expenseService.createExpense(newExpense);
      // Refresh data
      const expenses = await expenseService.getExpenses({ limit: 5 });
      setRecentExpenses(expenses);
      
      // Refresh weekly summary
      const weeklySummary = await expenseService.getWeeklySummary();
      setSummary(prev => ({
        ...prev,
        totalSpent: weeklySummary.weekTotal,
        weeklySpending: weeklySummary.dailyExpenses
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Welcome back, {user.name}!</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <DashboardSummary 
        totalSpent={summary.totalSpent} 
        totalBorrowed={summary.totalBorrowed}
        totalIncome={summary.totalIncome}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <SpendingChart data={summary.weeklySpending} />
        <QuickAddExpense onAddExpense={handleAddExpense} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentExpenses expenses={recentExpenses} />
        <BorrowingsOverview borrowings={borrowings} />
      </div>
    </div>
  );
};

export default Dashboard;
