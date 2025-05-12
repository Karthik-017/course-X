import React from "react";
import { useSettings } from "../context/SettingsContext";

const Settings = () => {
  const { setLogo } = useSettings();

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setLogo(localUrl);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">Settings</h2>

      <div>
        <label className="block mb-2 text-gray-700 font-medium">Upload Logo</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleLogoChange}
          className="block w-full text-sm text-gray-500 file:mr-8 file:py-4 file:px-8
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700
                     hover:file:bg-blue-100"
        />
      </div>
    </div>
  );
};

export default Settings;
