import React, { useState, useEffect } from "react";
import { useSettings } from "../context/SettingsContext";

const Settings = () => {
  const { logo, setLogo } = useSettings();
  const [theme, setTheme] = useState("light");
  const [newPassword, setNewPassword] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Load saved logo and theme on mount
  useEffect(() => {
    const savedLogo = localStorage.getItem("logo");
    if (savedLogo) setLogo(savedLogo);

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  // Handle logo upload and preview
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setLogo(localUrl);
      localStorage.setItem("logo", localUrl);
    }
  };

  // Theme toggle handler
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // Implement password change logic here
    alert(`Password changed to: ${newPassword}`);
  };

  // Handle notification preferences change
  const handleNotificationChange = () => {
    setNotificationsEnabled((prev) => !prev);
  };

  return (
    // Colors for the new theme
<div className="p-6 max-w-md mx-auto bg-[#ccf2ff] rounded-xl shadow-md space-y-6">
  <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-800 border-b pb-2">
    Settings
  </h2>

  <div>
    <label className="block mb-2 text-gray-800 dark:text-gray-800 font-medium">Upload Logo</label>
    <input
      type="file"
      accept="image/*"
      onChange={handleLogoChange}
      className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                 file:rounded-full file:border-0
                 file:text-sm file:font-semibold
                 file:bg-green-50 file:text-green-700
                 hover:file:bg-green-100"
    />
    {logo && (
      <img src={logo} alt="Preview Logo" className="mt-4 w-32 h-32 object-contain" />
    )}
  </div>

  <div>
    <label className="block mb-2 text-gray-800 dark:text-gray-800 font-medium">Theme</label>
    <button
      onClick={toggleTheme}
      className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
    >
      Switch to {theme === "light" ? "Dark" : "Light"} Mode
    </button>
  </div>

  {/* Security Settings */}
  <div className="mt-6">
    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-800">Security Settings</h3>

    <div className="mt-4">
      <label className="block text-gray-800 dark:text-gray-800 font-medium">Change Password</label>
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={handlePasswordChange}
        className="w-full mt-2 px-4 py-2 border rounded-md text-gray-900 dark:text-gray-100 bg-gray-200 dark:bg-gray-800"
      />
      <button
        onClick={handlePasswordSubmit}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Change Password
      </button>
    </div>

    <div className="mt-6">
      <label className="block text-gray-800 dark:text-gray-800 font-medium">Notification Preferences</label>
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={notificationsEnabled}
          onChange={handleNotificationChange}
          className="mr-2"
        />
        <span className="text-gray-800 dark:text-gray-500">
          Enable Email and In-App Notifications
        </span>
      </div>
    </div>
  </div>
</div>
  );
};

export default Settings;
