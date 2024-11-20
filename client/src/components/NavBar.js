// NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NavBar.css'; // Make sure to create and import the CSS file

function NavBar() {
  return (
    <header className="nav-header">
      <Link to="/" className="logo">Outsider Trading</Link>
      <nav className="nav-links">
        <Link to="/stock-view">Search</Link>
        <Link to="/following">Follow</Link>
        <Link to="/portfolio">Portfolio</Link>
      </nav>
      <div className="header-icons">
        <Link to="/settings" className="profile">
          <span className="profile-icon">&#128100;</span>
          <span className="profile-name">Username</span>
        </Link>
      </div>
    </header>
  );
}

export default NavBar;
