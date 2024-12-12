import { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';
import { X } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const CategoryAnalysis = ({ transactions = [], onClose, isOpen, user }) => {
  const [categoryData, setCategoryData] = useState([]);
  const [showModal, setShowModal] = useState(isOpen);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBudgets = async () => {
      if (!user?.uid) return;
      
      try {
        const categoriesDoc = doc(db, 'users', user.uid, 'settings', 'budgetCategories');
        const docSnap = await getDoc(categoriesDoc);
        
        if (docSnap.exists()) {
          const storedCategories = docSnap.data().categories;
          
          // Calculating actual spending per category
          const categoryTotals = transactions.reduce((acc, transaction) => {
            if (transaction.category) {
              acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
            }
            return acc;
          }, {});

          // Format data for chart
          const formattedData = storedCategories.map(category => ({
            category: category.name,
            budget: category.totalAmount || 0,
            actual: categoryTotals[category.name] || 0
          }));

          setCategoryData(formattedData);
        }
      } catch (error) {
        console.error('Error loading category budgets:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBudgets();
  }, [user, transactions]);

  const handleClose = () => {
    setShowModal(false);
    onClose();
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Category Analysis</h2>
          <button 
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="w-full h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="category"
                  tick={{ fill: '#4B5563' }}
                />
                <YAxis
                  tick={{ fill: '#4B5563' }}
                  label={{ 
                    value: 'Amount ($)', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { fill: '#4B5563' }
                  }}
                />
                <Tooltip
                  formatter={(value) => [`$${value}`, '']}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.375rem'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="budget" 
                  name="Budget" 
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="actual" 
                  name="Actual" 
                  fill="#EF4444"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryAnalysis;