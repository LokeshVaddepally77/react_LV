import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const userService = {
  // Initializing user profile
  async initializeUserProfile(uid, email) {
    const userRef = doc(db, 'users', uid);
    const userData = {
      email,
      fullName: '',
      phone: '',
      dateOfBirth: '',
      location: '',
      budget: null,
      monthlyIncome: null,
      recoveryEmail: '',
      preferences: {
        theme: 'light',
        language: 'English (US)',
        pushNotifications: true,
        emailAlerts: true,
        smsUpdates: false
      },
      createdAt: new Date().toISOString()
    };

    await setDoc(userRef, userData);
    return userData;
  },

  // Get user profile
  async getUserProfile(uid) {
    const userRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userRef);
    return docSnap.exists() ? docSnap.data() : null;
  },

  // Updating budget
  async updateBudget(uid, budget) {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { budget });
  },

  // Updating monthly income
  async updateMonthlyIncome(uid, monthlyIncome) {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { monthlyIncome });
  },

  // Updating profile information
  async updateProfileInfo(uid, profileData) {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, profileData);
  },

  // Updating preferences
  async updatePreferences(uid, preferences) {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { preferences });
  },

  // Updating security settings
  async updateSecuritySettings(uid, securityData) {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, securityData);
  }
};