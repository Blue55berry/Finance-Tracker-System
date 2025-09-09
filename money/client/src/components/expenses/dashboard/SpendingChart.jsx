import React from 'react';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';

const SpendingChart = ({ data }) => {
  // If no data, return a message
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Weekly Spending</h2>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500">No spending data available for this week.</p>
        </div>
      </div>
    );
  }

  // Prepare data for chart
  const chartData = {
    labels: data.map(day => format(new Date(day._id), 'EEE')),
    datasets: [
      {
        label: 'Daily Spending',
        data: data.map(day => day.totalAmount),
        fill: false,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `$${context.raw.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₹' + value;
          }
        }
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Weekly Spending</h2>
      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default SpendingChart;
