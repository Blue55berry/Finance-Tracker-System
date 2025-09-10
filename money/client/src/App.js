import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/expenses/common/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Borrowings from './pages/Borrowings';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Income from './pages/Income';
import Receipts from './pages/Receipts';
import MainLayout from './layouts/MainLayout';
import ProofDetails from './components/ProofDetails';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<PrivateRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/borrowings" element={<Borrowings />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/income" element={<Income />} />
              <Route path="/receipts" element={<Receipts />} />
              <Route path="/receipts/:id" element={<ProofDetails />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
