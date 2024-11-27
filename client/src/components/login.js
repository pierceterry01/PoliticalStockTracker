import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/LoginPage.css'; // Ensure this imports LoginPage.css

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // LOGIN LOGIC CAN GO HERE
  };

  return (
    <div className="login-body">
      <Link to="/" className="back-arrow">&#8592; Back</Link>
      <div className="login-container">
        <div className="login-header">
          <h1>Outsider Trading</h1>
        </div>
        <div className="login-form-content">
          <h2>Login</h2>
          <div className="header-line"></div>
          <form onSubmit={handleLogin}>
            <div className="login-form-group">
              <label className="login-label" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="custom-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="login-form-group">
              <label className="login-label" htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className="custom-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="login-button" type="submit">Login</button>
          </form>
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="create-account-link">
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
