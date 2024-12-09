import '../styles/RegisterPage.css';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Client-side validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            username,
            email,
            password,
            confirmPassword,
          },
        }),
      });

      if (response.ok) {
        setSuccess("Account created successfully! Redirecting to login...");
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else if (response.status === 422) {
        const data = await response.json();
        const validationErrors = data.errors.map((err) => err.msg).join(', ');
        setError(validationErrors || "Invalid input.");
      } else if (response.status === 409) {
        setError('Username already exists. Please choose a different one.');
      } else {
        setError("An unexpected error occurred.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to the server.");
    }
  };

  return (
    <div className="register-body">
      {/* Link back to home page */}
      <Link to="/" className="back-arrow">&#8592; Back to Home</Link>
      <div className="register-container">
        <header className="register-header">
          <h1>Outsider Trading</h1>
        </header>
        {/* Register form content */}
        <div className="register-form-content">
          <h2>Create Your Account</h2>
          <div className="header-line"></div>
          {/* Success/Error messages */}
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          {/* Registration form */}
          <form className="register-form" onSubmit={handleRegister}>
            {/* Username input field */}
            <div className="register-form-group">
              <label htmlFor="username" className="register-label">Username</label>
              <input
                className="register-input"
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            {/* Email input field */}
            <div className="register-form-group">
              <label htmlFor="email" className="register-label">Email</label>
              <input
                className="register-input"
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {/* Password input field */}
            <div className="register-form-group">
              <label htmlFor="password" className="register-label">Password</label>
              <input
                className="register-input"
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {/* Confirm password input field */}
            <div className="register-form-group">
              <label htmlFor="confirmPassword" className="register-label">Confirm Password</label>
              <input
                className="register-input"
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {/* Submit button */}
            <div className="register-form-group">
              <input type="submit" value="Create Account" className="register-button" />
            </div>
            {/* Link to login page if user has account */}
            <div className="register-form-group">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="login-link">Sign in here</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
