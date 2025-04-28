import React, { useState } from 'react';
import axios from 'axios';
import './styles/SettingsPage.scss';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiLock, FiUser } from 'react-icons/fi';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  axios.defaults.baseURL = "http://localhost:3000";
  axios.defaults.withCredentials = true;

  
  const handleUsernameChange = async (e) => {
    e.preventDefault();

    if (!username) {
      toast.warn('Username cannot be empty');
      return;
    }

    try {
      const response = await axios.put('/settings/username', { newUsername: username }, { withCredentials: true });
      toast.success(response.data.message);
    } catch (err) {
      toast.warn(err.response?.data?.message);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.warn('All password fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.warn('New passwords do not match');
      return;
    }

    try {
      const response = await axios.put(
        '/settings/password',
        { currentPassword, newPassword },
        { withCredentials: true }
      );
      toast.success(response.data.message);
    } catch (err) {
      toast.warn(err.response?.data?.message);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <form className="settings-form" onSubmit={handleUsernameChange}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                placeholder="Update your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary">
              Save Changes
            </button>
          </form>
        );
      case 'password':
        return (
          <form className="settings-form" onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                placeholder="Enter your current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary">
              Change Password
            </button>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="settings-container">
      <button className="back-button" onClick={() => navigate('/dashboard')}>
        <FiArrowLeft className="icon" />
        Back to Dashboard
      </button>
      
      <header className="settings-header">
        <h1 className="settings-title">Account Settings</h1>
        <p className="settings-subtitle">Manage your account preferences and security settings</p>
      </header>

      <div className="settings-menu">
        <button
          className={`menu-item ${activeTab === 'account' ? 'active' : ''}`}
          onClick={() => setActiveTab('account')}
        >
          <FiUser className="menu-icon" />
          Profile
        </button>
        <button
          className={`menu-item ${activeTab === 'password' ? 'active' : ''}`}
          onClick={() => setActiveTab('password')}
        >
          <FiLock className="menu-icon" />
          Security
        </button>
      </div>

      <div className="settings-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default SettingsPage;
