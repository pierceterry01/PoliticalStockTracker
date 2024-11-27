import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/NavBar.css'; // Make sure to create and import the CSS file

function NavBar() {
  const location = useLocation();

  // Render the login button only if on the landing page
  const isLandingPage = location.pathname === "/";

  return (
    <header className="nav-header">
      <Link to="/" className="logo">Outsider Trading</Link>
      <nav className="nav-links">
        <Link to="/stock-view">Search</Link>
        <Link to="/following">Follow</Link>
        <Link to="/portfolio">Portfolio</Link>
      </nav>
      <div className="header-icons">
        {/* Profile icon and name not displayed on the landing page header */}
        {!isLandingPage && (
          <Link to="/settings" className="profile">
            <span className="profile-icon">&#128100;</span>
            <span className="profile-name">Username</span>
          </Link>
        )}
        
        {/* login button only appears on the landing page */}
        {isLandingPage && (
          <Link to="/login" className="login-btn">Login</Link>
        )}
      </div>
    </header>
  );
}

export default NavBar;
