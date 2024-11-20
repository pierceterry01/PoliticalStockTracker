// SettingsPage.js
import React, { useState } from 'react';
import '../styles/SettingsPage.css';
import { useNavigate } from 'react-router-dom';

function SettingsPage() {
  const [displayName, setDisplayName] = useState('John Doe');
  const [email, setEmail] = useState('johndoe@example.com');
  const [password, setPassword] = useState('');
  const [timeZone, setTimeZone] = useState('GMT');
  const [darkMode, setDarkMode] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);

  const navigate = useNavigate();

  // Handle file upload for profile picture
  const handleProfilePictureChange = (event) => {
    setProfilePicture(URL.createObjectURL(event.target.files[0]));
  };

  // Handle dark/light mode toggle
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode', !darkMode);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      console.log('Account deleted');
    }
  };

  return (
    <div className="settings-page">
      {/* Main Content */}
      <main className="settings-main">
        {/* Profile Settings */}
        <section className="settings-section">
          <h2>Profile Settings</h2>
          <div className="settings-item">
            <label htmlFor="displayName">Display Name</label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <div className="settings-item">
            <label htmlFor="profilePicture">Profile Picture</label>
            <input type="file" id="profilePicture" onChange={handleProfilePictureChange} />
            {profilePicture && <img src={profilePicture} alt="Profile" className="profile-preview" />}
          </div>
          <div className="settings-item">
            <label htmlFor="timeZone">Time Zone</label>
            <select id="timeZone" value={timeZone} onChange={(e) => setTimeZone(e.target.value)}>
              <option value="GMT">GMT</option>
              <option value="PST">PST</option>
              <option value="EST">EST</option>
              <option value="CET">CET</option>
              <option value="IST">IST</option>
            </select>
          </div>
        </section>

        {/* Account Security */}
        <section className="settings-section">
          <h2>Account Security</h2>
          <div className="settings-item">
            <label htmlFor="email">Change Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="settings-item">
            <label htmlFor="password">Change Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="delete-account-btn" onClick={handleDeleteAccount}>
            Delete Account
          </button>
        </section>

        {/* Appearance Settings */}
        <section className="settings-section">
          <h2>Appearance</h2>
          <div className="dark-mode-switch">
            <label htmlFor="darkMode">Dark Mode</label>
            <input
              type="checkbox"
              id="darkMode"
              checked={darkMode}
              onChange={toggleDarkMode}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

export default SettingsPage;
