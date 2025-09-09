import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/expenses/common/Navbar';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <footer className="bg-white shadow-inner py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Finance Tracker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
