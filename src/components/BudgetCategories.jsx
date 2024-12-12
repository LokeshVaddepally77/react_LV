import React, { useState, useEffect } from 'react';
import { X, Pencil } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const CATEGORY_COLORS = {
  Housing: 'bg-blue-500',
  Food: 'bg-green-500',
  Transport: 'bg-red-500',
  Utilities: 'bg-yellow-500',
  Entertainment: 'bg-purple-500',
  Education: 'bg-indigo-500',
  Shopping: 'bg-pink-500',
  Healthcare: 'bg-teal-500'
};

const DEFAULT_CATEGORIES = [
  { id: '1', name: 'Housing', totalAmount: 0, color: CATEGORY_COLORS.Housing },
  { id: '2', name: 'Food', totalAmount: 0, color: CATEGORY_COLORS.Food },
  { id: '3', name: 'Transport', totalAmount: 0, color: CATEGORY_COLORS.Transport },
  { id: '4', name: 'Utilities', totalAmount: 0, color: CATEGORY_COLORS.Utilities },
  { id: '5', name: 'Entertainment', totalAmount: 0, color: CATEGORY_COLORS.Entertainment },
  { id: '6', name: 'Education', totalAmount: 0, color: CATEGORY_COLORS.Education }
];

const BudgetCategories = ({ isOpen, onClose, transactions = [], user }) => {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Loading initial categories from Firestore
  useEffect(() => {
    const loadCategories = async () => {
      if (!user?.uid) return;

      try {
        const categoriesDoc = doc(db, 'users', user.uid, 'settings', 'budgetCategories');
        const docSnap = await getDoc(categoriesDoc);

        if (docSnap.exists()) {
          const storedCategories = docSnap.data().categories;
          const categoriesWithColors = storedCategories.map(cat => ({
            ...cat,
            color: CATEGORY_COLORS[cat.name],
            usedAmount: 0
          }));
          setCategories(categoriesWithColors);
        } else {
          const defaultCategoriesWithUsed = DEFAULT_CATEGORIES.map(cat => ({
            ...cat,
            usedAmount: 0
          }));
          await setDoc(categoriesDoc, { categories: defaultCategoriesWithUsed });
          setCategories(defaultCategoriesWithUsed);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [user?.uid]);

  // Calculating used amounts from transactions
  useEffect(() => {
    if (!categories.length) return;

    const calculateUsedAmounts = () => {
      const updatedCategories = categories.map(category => {
        const categoryTransactions = transactions.filter(t => t.category === category.name);
        const usedAmount = categoryTransactions.reduce((sum, t) => {
          const amount = typeof t.amount === 'string' ? parseFloat(t.amount) : t.amount;
          return sum + (amount || 0);
        }, 0);

        return {
          ...category,
          usedAmount
        };
      });

      setCategories(updatedCategories);
    };

    calculateUsedAmounts();
  }, [transactions, categories.length]);

  const CategoryBudgetModal = () => {
    const [modalAmount, setModalAmount] = useState(
      editingCategory?.totalAmount?.toString() || ''
    );

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!modalAmount || isNaN(modalAmount)) return;

      try {
        const updatedCategories = categories.map(cat =>
          cat.id === editingCategory.id
            ? { ...cat, totalAmount: parseFloat(modalAmount) }
            : cat
        );

        const categoriesDoc = doc(db, 'users', user.uid, 'settings', 'budgetCategories');
        await setDoc(categoriesDoc, { categories: updatedCategories });

        setCategories(updatedCategories);
        setEditingCategory(null);
      } catch (error) {
        console.error('Error saving category budget:', error);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Set Budget for {editingCategory?.name}</h2>
            <button
              onClick={() => setEditingCategory(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Budget Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  placeholder="Amount"
                  value={modalAmount}
                  onChange={(e) => setModalAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold">Budget Categories</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                  <span className="font-medium">{category.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">
                    ${(category.usedAmount || 0).toFixed(2)}/${(category.totalAmount || 0).toFixed(2)}
                  </span>
                  <button
                    onClick={() => setEditingCategory(category)}
                    className="hover:bg-gray-100 p-1 rounded"
                  >
                    <Pencil className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${category.color}`}
                  style={{
                    width: `${category.totalAmount ? (Math.min((category.usedAmount || 0) / category.totalAmount * 100, 100)) : 0}%`
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {editingCategory && <CategoryBudgetModal />}
    </div>
  );
};

export default BudgetCategories;