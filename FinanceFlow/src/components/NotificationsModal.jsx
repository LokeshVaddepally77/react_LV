import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const NotificationsModal = ({ isOpen, onClose, user }) => {
  const [notifications, setNotifications] = useState({
    pushNotifications: true,
    emailAlerts: true,
    smsUpdates: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      if (!user?.uid) return;
      
      try {
        const notificationsDoc = doc(db, 'users', user.uid, 'settings', 'notifications');
        const docSnap = await getDoc(notificationsDoc);
        
        if (docSnap.exists()) {
          setNotifications(docSnap.data());
        } else {
          // Initializing default notifications
          await setDoc(notificationsDoc, notifications);
        }
      } catch (error) {
        console.error('Error loading notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [user]);

  const handleToggle = (setting) => {
    setNotifications(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSave = async () => {
    try {
      const notificationsDoc = doc(db, 'users', user.uid, 'settings', 'notifications');
      await setDoc(notificationsDoc, notifications);
      onClose();
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Notifications</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <span className="text-gray-700">Push Notifications</span>
            <button
              onClick={() => handleToggle('pushNotifications')}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
                notifications.pushNotifications ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${
                  notifications.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-gray-700">Email Alerts</span>
            <button
              onClick={() => handleToggle('emailAlerts')}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
                notifications.emailAlerts ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${
                  notifications.emailAlerts ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-gray-700">SMS Updates</span>
            <button
              onClick={() => handleToggle('smsUpdates')}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
                notifications.smsUpdates ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${
                  notifications.smsUpdates ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsModal;