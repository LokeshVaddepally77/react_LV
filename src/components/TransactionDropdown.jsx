import React, { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const TransactionDropdown = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');

  const categories = ['Housing', 'Food', 'Transport', 'Entertainment', 'Shopping', 'Utilities', 'Healthcare', 'Other'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Form validation
    if (!description || !amount || !category) {
      setError('Please fill in all fields');
      return;
    }

    if (!user?.uid) {
      setError('User not authenticated');
      return;
    }

    try {
      // Creating transaction document
      const transactionData = {
        title: description,
        category: category,
        amount: parseFloat(amount),
        timestamp: serverTimestamp()
      };

      // Adding to Firestore
      await addDoc(collection(db, 'users', user.uid, 'transactions'), transactionData);

      // Reset form and close dropdown
      setDescription('');
      setAmount('');
      setCategory('');
      setIsOpen(false);
      setError('');
    } catch (error) {
      console.error('Error adding transaction:', error);
      setError('Failed to add transaction. Please try again.');
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center space-x-1"
      >
        <span>Transactions</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl z-50">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Add Transaction</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-2 bg-red-50 text-red-500 text-sm rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                step="0.01"
                min="0"
              />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <button
                type="submit"
                className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Add Transaction
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionDropdown;