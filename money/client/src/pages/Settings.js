import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Settings = () => {
  const { user, logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Form state for user settings
  const [settings, setSettings] = useState({
    budgetGoal: user?.budgetGoal || 0,
    notificationsEnabled: false,
    darkMode: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // This would typically call an API to update user settings
      // For now, just simulate success
      setTimeout(() => {
        setMessage({ 
          type: 'success', 
          text: 'Settings updated successfully!' 
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to update settings' 
      });
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      {message.text && (
        <div className={`p-4 mb-6 rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
        
        <div className="mb-4">
          <p className="text-gray-700 mb-1">Name</p>
          <p className="font-medium">{user?.name}</p>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-700 mb-1">Email</p>
          <p className="font-medium">{user?.email}</p>
        </div>
        
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Preferences</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="budgetGoal">
              Monthly Budget Goal (₹)
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="budgetGoal"
              name="budgetGoal"
              type="number"
              step="0.01"
              min="0"
              value={settings.budgetGoal}
              onChange={handleChange}
            />
          </div>
          
          <div className="mb-4 flex items-center">
            <input
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
              id="notificationsEnabled"
              name="notificationsEnabled"
              type="checkbox"
              checked={settings.notificationsEnabled}
              onChange={handleChange}
            />
            <label className="text-gray-700" htmlFor="notificationsEnabled">
              Enable notifications
            </label>
          </div>
          
          <div className="mb-6 flex items-center">
            <input
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
              id="darkMode"
              name="darkMode"
              type="checkbox"
              checked={settings.darkMode}
              onChange={handleChange}
            />
            <label className="text-gray-700" htmlFor="darkMode">
              Dark mode
            </label>
          </div>
          
          <div className="flex items-center justify-end">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
