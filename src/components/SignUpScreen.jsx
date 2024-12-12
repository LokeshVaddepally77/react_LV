import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, CheckCircle } from 'lucide-react';
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from '../firebase';

export const SignUpScreen = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!email || !password || !confirmPassword || !firstName || !lastName) {
      setError('Please fill in all fields.');
      return false;
    }

    if (!termsAccepted) {
      setError('Please accept the Terms of Service and Privacy Policy.');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }

    if (password.length < 6) {
      setError('Password should be at least 6 characters long.');
      return false;
    }

    return true;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      try {
        await setDoc(doc(db, 'users', user.uid), {
          firstName,
          lastName,
          email,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          phoneNumber: '',
          location: '',
          preferences: {
            currency: 'USD',
            language: 'en',
            notifications: {
              email: true,
              push: true
            }
          }
        });

        setSuccess(true);
        await signOut(auth);
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);

      } catch (firestoreError) {
        console.error('Firestore Error:', firestoreError);
        setError('Account created but profile setup failed. Please try logging in.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }

    } catch (authError) {
      console.error('Auth Error:', authError);
      switch (authError.code) {
        case 'auth/email-already-in-use':
          setError('This email is already registered. Please use a different email.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/weak-password':
          setError('Password should be at least 6 characters long.');
          break;
        default:
          setError('An error occurred during registration. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const SuccessMessage = () => (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full mx-4">
        <div className="text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Account Created Successfully!
          </h3>
          <p className="text-gray-600 mb-4">
            You will be redirected to the login page in a moment.
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
        <h2 className="text-2xl font-bold mb-2">Create an account</h2>
        <p className="text-gray-600">Start your financial journey with us</p>
      </div>

      <form className="space-y-6" onSubmit={handleSignUp}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          <div className="relative">
            <input
              type="email"
              placeholder="Enter your email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2"
              disabled={loading}
            >
              {showPassword ? 
                <EyeOff className="h-5 w-5 text-gray-400" /> : 
                <Eye className="h-5 w-5 text-gray-400" />
              }
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2"
              disabled={loading}
            >
              {showConfirmPassword ? 
                <EyeOff className="h-5 w-5 text-gray-400" /> : 
                <Eye className="h-5 w-5 text-gray-400" />
              }
            </button>
          </div>
        </div>

        <div className="flex items-start">
          <input 
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            disabled={loading}
          />
          <span className="ml-2 text-gray-600">
            I agree to the{' '}
            <button 
              type="button"
              onClick={() => navigate('/terms')}
              className="text-blue-500 hover:text-blue-600"
              disabled={loading}
            >
              Terms of Service
            </button>
            {' '}and{' '}
            <button 
              type="button"
              onClick={() => navigate('/privacy')}
              className="text-blue-500 hover:text-blue-600"
              disabled={loading}
            >
              Privacy Policy
            </button>
          </span>
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
              Creating Account...
            </span>
          ) : (
            'Create Account'
          )}
        </button>

        <div className="text-center">
          <span className="text-gray-600">Already have an account? </span>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-blue-500 hover:text-blue-600"
            disabled={loading}
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUpScreen;