import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import '../styles/NavBar.css';
import UserContext from './UserContext';

function NavBar() {
  const { user } = useContext(UserContext);

  return (
    <header className="nav-header">
      <Link to="/" className="logo">
        Outsider Trading
      </Link>
      <nav className="nav-links">
        <Link to="/stock-view">Search</Link>
        <Link to="/following">Follow</Link>
        <Link to="/portfolio">Portfolio</Link>
      </nav>
      <div className="header-icons">
        <Link to="/settings" className="profile">
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="Profile"
              className="profile-picture"
            />
          ) : (
            <span className="profile-icon">&#128100;</span>
          )}
          <span className="profile-name">{user.username}</span>
        </Link>
      </div>
    </header>
  );
}

export default NavBar;