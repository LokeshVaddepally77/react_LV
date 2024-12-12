import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, BarChart2, Clock } from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center">
          <span className="text-blue-500 text-3xl font-bold mr-2">$</span>
          <span className="text-xl font-semibold">Finance Flow</span>
        </div>
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
          <button 
            onClick={() => navigate('/login')} 
            className="px-6 py-2 text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-lg font-medium"
          >
            Log in
          </button>
          <button 
            onClick={() => navigate('/signup')} 
            className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-4">
          Take Control of Your <span className="text-blue-500">Finances</span>
        </h1>
        <p className="text-lg text-orange-500 mb-6">
          Track expenses, manage budgets, and achieve your financial goals with our
          easy-to-use personal finance tool.
        </p>
        <button
          onClick={() => navigate('/signup')}
          className="px-8 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
        >
          Start Tracking Now
        </button>
      </div>

      {/* Features */}
      <div className="grid gap-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Shield className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-1">Secure & Private</h3>
            <p className="text-gray-600">Your financial data is encrypted and secure</p>
          </div>
        </div>
        
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-50 rounded-lg">
            <BarChart2 className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-1">Smart Analytics</h3>
            <p className="text-gray-600">Get insights into your spending habits</p>
          </div>
        </div>
        
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Clock className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-1">Real-time Tracking</h3>
            <p className="text-gray-600">Monitor your expenses as they happen</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;