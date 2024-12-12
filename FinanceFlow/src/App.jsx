import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { store } from './store/store';
import { LandingPage } from './components/LandingPage';
import { LoginScreen } from './components/LoginScreen';  
import { SignUpScreen } from './components/SignUpScreen';
import { ForgotPassword } from './components/ForgotPassword';
import Dashboard from './components/Dashboard';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from './firebase';
import { ThemeProvider } from './contexts/ThemeContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

const LoadingSpinner = () => (
 <div className="min-h-screen bg-gray-50 flex items-center justify-center">
   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
 </div>
);

const ProtectedRoute = ({ children }) => {
 const [user, setUser] = useState(null);
 const [loading, setLoading] = useState(true);
 const [userData, setUserData] = useState(null);
 const navigate = useNavigate();
 const location = useLocation();

 useEffect(() => {
   const loadUserData = async (currentUser) => {
     if (currentUser) {
       try {
         const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
         if (userDoc.exists()) {
           setUserData(userDoc.data());
         }
       } catch (error) {
         console.error('Error loading user data:', error);
       }
     }
     setLoading(false);
   };

   const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
     setUser(currentUser);
     if (currentUser) {
       loadUserData(currentUser);
     } else {
       setLoading(false);
       if (location.pathname !== '/login') {
         navigate('/login', { state: { from: location.pathname } });
       }
     }
   });

   return () => unsubscribe();
 }, [navigate, location]);

 if (loading) {
   return <LoadingSpinner />;
 }

 return user ? React.cloneElement(children, { user, userData }) : <Navigate to="/login" state={{ from: location.pathname }} />;
};

const App = () => {
 const navigate = useNavigate();
 const [loading, setLoading] = useState(true);

 useEffect(() => {
   const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
     setLoading(false);
     if (currentUser && window.location.pathname === '/login') {
       navigate('/dashboard');
     }
   });

   return () => unsubscribe();
 }, [navigate]);

 const handleLogout = async () => {
   try {
     await signOut(auth);
     navigate('/');
   } catch (error) {
     console.error('Error signing out:', error);
   }
 };

 if (loading) {
   return <LoadingSpinner />;
 }

 return (
   <Provider store={store}>
     <ThemeProvider>
       <div className="min-h-screen bg-gray-50">
         <div className="container mx-auto p-4 max-w-7xl">
           <Routes>
             <Route path="/" element={<LandingPage />} />
             <Route path="/login" element={<LoginScreen />} />
             <Route path="/signup" element={<SignUpScreen />} />
             <Route path="/forgot-password" element={<ForgotPassword />} />
             <Route 
               path="/dashboard/" 
               element={
                 <ProtectedRoute>
                   <Dashboard onLogout={handleLogout} />
                 </ProtectedRoute>
               } 
             />
             <Route path="*" element={<Navigate to="/" replace />} />
           </Routes>
         </div>
       </div>
     </ThemeProvider>
   </Provider>
 );
};

export default App;