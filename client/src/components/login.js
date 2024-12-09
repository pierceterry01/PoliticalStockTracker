import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css'; // Ensure this imports LoginPage.css
import UserContext from './UserContext'; // Import UserContext

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext); // Access setUser from UserContext

  // Frontend Validation Function
  const validateInputs = () => {
    if (!email) {
      setError('Email field cannot be empty.');
      return false;
    }
    if (!password) {
      setError('Password field cannot be empty.');
      return false;
    }
    setError(''); // Clear errors if validation passes
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
  
    // Validate inputs before sending the request
    if (!validateInputs()) return;
  
    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            email: email,
            password: password,
          },
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        setUser({ username: data.username });
        navigate('/portfolio');
      } else if (response.status === 401) {
        setError('Invalid email or password.');
      } else if (response.status === 422) {
        setError('Invalid input.');
      } else {
        setError('An unexpected error occurred.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to connect to the server.');
    }
  };
  

  return (
    <div className="login-body">
      <Link to="/" className="back-arrow">&#8592; Back to Home</Link>
      <div className="login-container">
        <div className="login-header">
          <h1>Outsider Trading</h1>
        </div>
        <div className="login-form-content">
          <h2>Login</h2>
          <div className="header-line"></div>
          {error && <p className="error-message">{error}</p>}
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
