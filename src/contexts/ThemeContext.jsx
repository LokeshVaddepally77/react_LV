import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const ThemeContext = createContext();

export const ThemeProvider = ({ children, user }) => {
  const [theme, setTheme] = useState('Light');

  useEffect(() => {
    const loadTheme = async () => {
      if (!user?.uid) return;
      
      try {
        const preferencesDoc = doc(db, 'users', user.uid, 'settings', 'preferences');
        const docSnap = await getDoc(preferencesDoc);
        
        if (docSnap.exists()) {
          const { theme } = docSnap.data();
          if (theme) {
            setTheme(theme);
            applyTheme(theme);
          }
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };

    loadTheme();
  }, [user]);

  const applyTheme = (newTheme) => {
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark', 'theme-normal');
    root.classList.add(`theme-${newTheme.toLowerCase()}`);
  };

  const updateTheme = async (newTheme) => {
    if (!user?.uid) return;

    try {
      const preferencesDoc = doc(db, 'users', user.uid, 'settings', 'preferences');
      await setDoc(preferencesDoc, { theme: newTheme }, { merge: true });
      setTheme(newTheme);
      applyTheme(newTheme);
    } catch (error) {
      console.error('Error updating theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);