import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserSettings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('PROFILE');
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    username: '',
    occupation: ''
  });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [socialLinks, setSocialLinks] = useState({
    twitter: "",
    github: "",
    linkedin: ""
  });

  // Get token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  const fetchProfile = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:8000/user/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUser({
        firstName: response.data.user.firstName || '',
        lastName: response.data.user.lastName || '',
        email: response.data.user.email || '',
        phone: response.data.user.phone || '',
        bio: response.data.user.bio || '',
        username: response.data.user.username || '',
        occupation: response.data.user.occupation || 'Full Stack Developer'
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      navigate('/login');
    }
  };

  const fetchSocialLinks = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get('http://localhost:8000/user/me/socials', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSocialLinks({
        twitter: response.data.socialLinks?.twitter || "",
        github: response.data.socialLinks?.github || "",
        linkedin: response.data.socialLinks?.linkedin || ""
      });
    } catch (error) {
      console.error('Error fetching social links:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchProfile();
      await fetchSocialLinks();
      setLoading(false);
    };
    fetchData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialLinkChange = (e) => {
    const { name, value } = e.target;
    setSocialLinks(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getAuthToken();
      const response = await axios.put('http://localhost:8000/user/me', user, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUser(response.data.user);
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
      alert(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    try {
      const token = getAuthToken();
      await axios.put('http://localhost:8000/user/me/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      alert('Password changed successfully!');
    } catch (error) {
      console.error('Error changing password:', error);
      alert(error.response?.data?.message || 'Failed to change password');
    }
  };

  const handleSocialSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getAuthToken();
      const response = await axios.put('http://localhost:8000/user/me/socials', socialLinks, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Social links updated successfully!');
    } catch (error) {
      console.error('Error updating social links:', error);
      alert(error.response?.data?.message || 'Failed to update social links');
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  const tabs = ['PROFILE', 'PASSWORD', 'SOCIAL ICON'];

  const renderProfileTab = () => (
    <div className="mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            {editMode ? (
              <input
                type="text"
                name="firstName"
                value={user.firstName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            ) : (
              <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                {user.firstName || 'Not provided'}
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">User Name</label>
            {editMode ? (
              <input
                type="text"
                name="username"
                value={user.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            ) : (
              <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                {user.username || 'Not provided'}
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Skill/Occupation</label>
            {editMode ? (
              <input
                type="text"
                name="occupation"
                value={user.occupation}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            ) : (
              <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                {user.occupation || 'Not provided'}
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            {editMode ? (
              <input
                type="text"
                name="lastName"
                value={user.lastName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            ) : (
              <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                {user.lastName || 'Not provided'}
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            {editMode ? (
              <input
                type="text"
                name="phone"
                value={user.phone || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="+1-202-555-0174"
              />
            ) : (
              <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
                {user.phone || 'Not provided'}
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700">
              {user.email}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
        {editMode ? (
          <textarea
            name="bio"
            value={user.bio || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            rows="4"
            placeholder="Tell us about yourself..."
          />
        ) : (
          <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700 min-h-[100px]">
            {user.bio || 'No bio provided'}
          </div>
        )}
      </div>
      
      <div className="mt-8">
        {editMode ? (
          <div className="flex space-x-4">
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Save Changes
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Update Info
          </button>
        )}
      </div>
    </div>
  );

  const renderPasswordTab = () => (
    <div className="mt-8">
      <div className="max-w-md space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
          <input
            type="password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>
        <button
          type="button"
          onClick={handlePasswordSubmit}
          className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          Change Password
        </button>
      </div>
    </div>
  );

  const renderSocialIconTab = () => (
    <div className="mt-8">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
          <span className="text-2xl">👤</span>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">Social Media Links</h3>
          <p className="text-sm text-gray-500">Connect your social media accounts</p>
        </div>
      </div>
      
      <form onSubmit={handleSocialSubmit} className="max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Twitter Username</label>
          <input
            type="text"
            name="twitter"
            value={socialLinks.twitter}
            onChange={handleSocialLinkChange}
            placeholder="your_twitter_handle"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Username</label>
          <input
            type="text"
            name="github"
            value={socialLinks.github}
            onChange={handleSocialLinkChange}
            placeholder="your_github_username"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
          <input
            type="text"
            name="linkedin"
            value={socialLinks.linkedin}
            onChange={handleSocialLinkChange}
            placeholder="https://linkedin.com/in/your-profile"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        
        <button
          type="submit"
          className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          Save Social Links
        </button>
      </form>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">My Profile</h1>
      
      {/* Tab Navigation */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="mt-1">
        {activeTab === 'PROFILE' && renderProfileTab()}
        {activeTab === 'PASSWORD' && renderPasswordTab()}
        {activeTab === 'SOCIAL ICON' && renderSocialIconTab()}
      </div>
    </div>
  );
};

export default UserSettings;