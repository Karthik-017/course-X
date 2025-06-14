import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserSettings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    username: '',
    occupation: 'Full Stack Developer'
  });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Get token from localStorage or wherever you store it
  const getAuthToken = () => {
    return localStorage.getItem('token'); // Adjust based on your auth storage
  };

  useEffect(() => {
    const fetchUserData = async () => {
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
          ...response.data.user,
          occupation: response.data.user.occupation || 'Full Stack Developer'
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getAuthToken();
      await axios.put('http://localhost:8000/user/me', user, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update profile');
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

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
   <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">PROFILE</h2>
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-2xl">👤</span>
          </div>
          <div>
            <button 
              className="text-blue-600 hover:text-blue-800"
              onClick={() => navigate('/change-password')} // Example navigation
            >
              PASSWORD
            </button>
            <div className="flex space-x-2 mt-2">
              {/* Social icons would go here */}
              <button className="text-gray-500 hover:text-gray-700">
                <i className="fab fa-twitter"></i>
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <i className="fab fa-github"></i>
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <i className="fab fa-linkedin"></i>
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-medium mb-2">First Name</h3>
            {editMode ? (
              <input
                type="text"
                name="firstName"
                value={user.firstName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            ) : (
              <p>{user.firstName}</p>
            )}
            
            <h3 className="font-medium mt-4 mb-2">User Name</h3>
            {editMode ? (
              <input
                type="text"
                name="username"
                // value={user.username || user.email.split('@')[0]}
                value={user.username}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            ) : (
              <p>{user.username || user.email.split('@')[0]}</p>
            )}
            
            <h3 className="font-medium mt-4 mb-2">Skill/Occupation</h3>
            {editMode ? (
              <input
                type="text"
                name="occupation"
                value={user.occupation}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            ) : (
              <p>{user.occupation}</p>
            )}
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Last Name</h3>
            {editMode ? (
              <input
                type="text"
                name="lastName"
                value={user.lastName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            ) : (
              <p>{user.lastName}</p>
            )}
            
            <h3 className="font-medium mt-4 mb-2">Phone Number</h3>
            {editMode ? (
              <input
                type="text"
                name="phone"
                value={user.phone || ''}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="+1-202-555-0174"
              />
            ) : (
              <p>{user.phone || 'Not provided'}</p>
            )}
            
            <h3 className="font-medium mt-4 mb-2">Display Name Publicly As</h3>
            <p>{user.firstName}</p>
            
            <h3 className="font-medium mt-4 mb-2">Bio</h3>
            {editMode ? (
              <textarea
                name="bio"
                value={user.bio || ''}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                rows="3"
                placeholder="Lorem Ipsum, dolor sit amet consectetur adipisicing elit."
              />
            ) : (
              <p>{user.bio || 'No bio provided'}</p>
            )}
          </div>
        </div>
      </div>
      
      {editMode ? (
        <div className="flex space-x-4">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
          <button
            onClick={() => setEditMode(false)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setEditMode(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Update Info
        </button>
      )}
      
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">CHANGE PASSWORD</h2>
        <form onSubmit={handlePasswordSubmit} className="max-w-md">
          <div className="mb-4">
            <label className="block mb-2">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserSettings;