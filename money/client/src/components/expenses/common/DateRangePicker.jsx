import React, { useState } from 'react';
import { format } from 'date-fns';

const DateRangePicker = ({ initialStartDate, initialEndDate, onDateRangeChange }) => {
  const [startDate, setStartDate] = useState(initialStartDate || new Date());
  const [endDate, setEndDate] = useState(initialEndDate || new Date());

  const handleStartDateChange = (e) => {
    const newStartDate = new Date(e.target.value);
    setStartDate(newStartDate);
    
    if (newStartDate > endDate) {
      setEndDate(newStartDate);
      onDateRangeChange({ startDate: newStartDate, endDate: newStartDate });
    } else {
      onDateRangeChange({ startDate: newStartDate, endDate });
    }
  };

  const handleEndDateChange = (e) => {
    const newEndDate = new Date(e.target.value);
    setEndDate(newEndDate);
    
    if (newEndDate < startDate) {
      setStartDate(newEndDate);
      onDateRangeChange({ startDate: newEndDate, endDate: newEndDate });
    } else {
      onDateRangeChange({ startDate, endDate: newEndDate });
    }
  };

  const formatDateForInput = (date) => {
    return format(date, 'yyyy-MM-dd');
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center p-4 bg-white rounded-lg shadow">
      <div className="w-full sm:w-auto">
        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
        <input
          type="date"
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formatDateForInput(startDate)}
          onChange={handleStartDateChange}
        />
      </div>
      
      <div className="hidden sm:block text-gray-500">to</div>
      
      <div className="w-full sm:w-auto">
        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
        <input
          type="date"
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formatDateForInput(endDate)}
          onChange={handleEndDateChange}
        />
      </div>
      
      <div className="flex space-x-2 mt-4 sm:mt-0">
        <button
          className="px-3 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded hover:bg-blue-200"
          onClick={() => {
            const today = new Date();
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(today.getDate() - 7);
            
            setStartDate(sevenDaysAgo);
            setEndDate(today);
            onDateRangeChange({ startDate: sevenDaysAgo, endDate: today });
          }}
        >
          Last 7 Days
        </button>
        
        <button
          className="px-3 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded hover:bg-blue-200"
          onClick={() => {
            const today = new Date();
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(today.getDate() - 30);
            
            setStartDate(thirtyDaysAgo);
            setEndDate(today);
            onDateRangeChange({ startDate: thirtyDaysAgo, endDate: today });
          }}
        >
          Last 30 Days
        </button>
      </div>
    </div>
  );
};

export default DateRangePicker;
