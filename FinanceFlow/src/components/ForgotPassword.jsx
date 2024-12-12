import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../firebase';

export const ForgotPassword = ({ onNavigate }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email) {
      setError('Please enter your email address.');
      setLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
      setEmail('');
      
      // Redirecting to login after 3 seconds
      setTimeout(() => {
        onNavigate('login');
      }, 3000);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      switch (error.code) {
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/user-not-found':
          setError('No account found with this email address.');
          break;
        default:
          setError('An error occurred. Please try again later.');
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  // Success message component
  const SuccessMessage = () => (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full mx-4">
        <div className="text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Reset Email Sent!
          </h3>
          <p className="text-gray-600 mb-4">
            Please check your email for instructions to reset your password.
          </p>
          <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-[440px] mx-auto">
      {success && <SuccessMessage />}
      
      
      <button 
        onClick={() => navigate('/')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-8"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back
      </button>

      <div className="text-center mb-8">
        <span className="text-blue-500 text-4xl mb-4 inline-block">$</span>
        <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
        <p className="text-gray-600">Enter your email to receive reset instructions</p>
      </div>

      <form className="space-y-6" onSubmit={handlePasswordReset}>
        <div className="relative">
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <button
          type="submit"
          className={`w-full py-3 bg-gray-900 text-white rounded-lg font-medium ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
          }`}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              Sending...
            </span>
          ) : (
            'Reset Password'
          )}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;