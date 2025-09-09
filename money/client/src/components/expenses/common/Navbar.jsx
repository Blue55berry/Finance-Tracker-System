import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600';
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-blue-600">FinanceTracker</Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/" className={`inline-flex items-center px-1 pt-1 ${isActive('/')}`}>
                Dashboard
              </Link>
              <Link to="/expenses" className={`inline-flex items-center px-1 pt-1 ${isActive('/expenses')}`}>
                Expenses
              </Link>
              <Link to="/income" className={`inline-flex items-center px-1 pt-1 ${isActive('/income')}`}>
                Income
              </Link>
              <Link to="/borrowings" className={`inline-flex items-center px-1 pt-1 ${isActive('/borrowings')}`}>
                Borrowings
              </Link>
              <Link to="/analytics" className={`inline-flex items-center px-1 pt-1 ${isActive('/analytics')}`}>
                Analytics
              </Link>
              <Link to="/receipts" className={`inline-flex items-center px-1 pt-1 ${isActive('/receipts')}`}>
                Receipts
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="ml-3 relative">
              <div className="flex items-center space-x-4">
                <div className="text-sm font-medium text-gray-700">{user?.name}</div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="block h-6 w-6 " xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`sm:hidden ${mobileMenuOpen ? 'block' : 'hidden'} w-full h-screen fixed top-0 left-0 bg-white z-50`}
      >
        {/* Close button */}
        <div className="flex justify-end p-4">
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            <span className="sr-only">Close menu</span>
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="pt-2 pb-3 space-y-1 w-full text-center mt-2">
          <Link to="/" className={`block pl-3 pr-4 py-2 border-l-4 hover:bg-gray-700 hover:text-white ${location.pathname === '/' ? 'border-blue-500 text-blue-700 bg-blue-50' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'}`} onClick={() => setMobileMenuOpen(false)}>
            Dashboard
          </Link>
          <Link to="/expenses" className={`block pl-3 pr-4 py-2 border-l-4 hover:bg-gray-700 hover:text-white ${location.pathname === '/expenses' ? 'border-blue-500 text-blue-700 bg-blue-50' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'}`} onClick={() => setMobileMenuOpen(false)}>
            Expenses
          </Link>
          <Link to="/income" className={`block pl-3 pr-4 py-2 border-l-4 hover:bg-gray-700 hover:text-white ${location.pathname === '/income' ? 'border-blue-500 text-blue-700 bg-blue-50' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'}`} onClick={() => setMobileMenuOpen(false)}>
            Income
          </Link>
          <Link to="/borrowings" className={`block pl-3 pr-4 py-2 border-l-4 hover:bg-gray-700 hover:text-white ${location.pathname === '/borrowings' ? 'border-blue-500 text-blue-700 bg-blue-50' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'}`} onClick={() => setMobileMenuOpen(false)}>
            Borrowings
          </Link>
          <Link to="/analytics" className={`block pl-3 pr-4 py-2 border-l-4 hover:bg-gray-700 hover:text-white ${location.pathname === '/analytics' ? 'border-blue-500 text-blue-700 bg-blue-50' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'}`} onClick={() => setMobileMenuOpen(false)}>
            Analytics
          </Link>
          <Link to="/receipts" className={`block pl-3 pr-4 py-2 border-l-4 hover:bg-gray-700 hover:text-white ${location.pathname === '/receipts' ? 'border-blue-500 text-blue-700 bg-blue-50' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'}`} onClick={() => setMobileMenuOpen(false)}>
            Receipts
          </Link>
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="flex items-center px-4 justify-center">
            <div className="ml-3">
              <div className="text-md text-2xl mb-4  font-medium text-gray-800 text-center ">{user?.name}</div>
              <div className="text-sm font-medium mb-4 text-gray-500 text-">{user?.email}</div>
            </div>
          </div>
          <div className="mt-3 space-y-1 w-2/3 mx-auto">
            <button
              onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
              className="block px-4 py-2 text-center bg-gray-700  rounded-xl hover:bg-white hover:text-black text-base font-medium text-white hover:text-gray-800 hover:bg-gray-100 w-full text-left"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
