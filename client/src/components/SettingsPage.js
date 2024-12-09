import React, { useState, useContext } from 'react';
import '../styles/SettingsPage.css';
import UserContext from './UserContext';
import { useNavigate } from 'react-router-dom';

function SettingsPage() {
  const { user, setUser } = useContext(UserContext);
  const [displayName, setDisplayName] = useState(user.username);
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(user.profilePicture);

  const navigate = useNavigate();

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const newProfilePicture = URL.createObjectURL(file);
      setProfilePicture(newProfilePicture);
    }
  };

  const handleConfirmChanges = () => {
    setUser({
      ...user,
      displayName,
      profilePicture,
    });

    alert('Changes have been saved.');
    navigate('/'); // Redirect if desired
  };

  return (
    <div className="settings-page">
      <main className="settings-main">
        {/* Profile Settings */}
        <section className="settings-section">
          <h2>Profile Settings</h2>
          <div className="settings-item">
            <label htmlFor="displayName">Display Name</label>
            <input
              type="text"
              id="displayName"
              className="custom-input"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <div className="settings-item">
            <label htmlFor="profilePicture">Profile Picture</label>
            <input
              type="file"
              id="profilePicture"
              accept="image/*"
              onChange={handleProfilePictureChange}
            />
            {profilePicture && (
              <img
                src={profilePicture}
                alt="Profile"
                className="profile-preview"
              />
            )}
          </div>
        </section>

        {/* Account Security */}
        <section className="settings-section">
          <h2>Account Security</h2>
          <div className="settings-item">
            <label htmlFor="password">Change Password</label>
            <input
              type="password"
              id="password"
              className="custom-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {/* Confirm Changes Button */}
          <div className="confirm-changes-section">
            <button className="confirm-changes-btn" onClick={handleConfirmChanges}>
              Confirm Changes
            </button>
          </div>
        </section>
        <div className="privacy-disclaimer">
          <h2>Privacy Policy</h2>
          <p>Outsider Trading is committed to maintaining security and integrity when it comes to the data of our users.
            We adhere to stringent privacy standards and will never share personal information with outside parties.
            Our privacy policies are designed to prioritize your security and transparency, as well as to adhere to present standards.
          </p>
        </div>
      </main>
    </div>
  );
}

export default SettingsPage;
