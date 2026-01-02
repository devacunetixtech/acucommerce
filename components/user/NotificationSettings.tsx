'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';

interface NotificationPreferences {
  emailNotifications: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  newsletter: boolean;
}

export default function NotificationSettings() {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailNotifications: true,
    orderUpdates: true,
    promotions: false,
    newsletter: false,
  });

  const handleToggle = (key: keyof NotificationPreferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    // In real app, send to API
    console.log('Saving preferences:', preferences);
    alert('Notification preferences saved!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4 pb-4 border-b">
        <input
          type="checkbox"
          checked={preferences.emailNotifications}
          onChange={() => handleToggle('emailNotifications')}
          className="mt-1"
        />
        <div className="flex-1">
          <h3 className="font-medium">Email Notifications</h3>
          <p className="text-sm text-gray-600">
            Receive notifications via email
          </p>
        </div>
      </div>

      <div className="flex items-start gap-4 pb-4 border-b">
        <input
          type="checkbox"
          checked={preferences.orderUpdates}
          onChange={() => handleToggle('orderUpdates')}
          className="mt-1"
        />
        <div className="flex-1">
          <h3 className="font-medium">Order Updates</h3>
          <p className="text-sm text-gray-600">
            Get notified about order status changes
          </p>
        </div>
      </div>

      <div className="flex items-start gap-4 pb-4 border-b">
        <input
          type="checkbox"
          checked={preferences.promotions}
          onChange={() => handleToggle('promotions')}
          className="mt-1"
        />
        <div className="flex-1">
          <h3 className="font-medium">Promotions & Deals</h3>
          <p className="text-sm text-gray-600">
            Receive special offers and discount codes
          </p>
        </div>
      </div>

      <div className="flex items-start gap-4 pb-4">
        <input
          type="checkbox"
          checked={preferences.newsletter}
          onChange={() => handleToggle('newsletter')}
          className="mt-1"
        />
        <div className="flex-1">
          <h3 className="font-medium">Newsletter</h3>
          <p className="text-sm text-gray-600">
            Stay updated with our latest products and news
          </p>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
      >
        Save Preferences
      </button>
    </div>
  );
}