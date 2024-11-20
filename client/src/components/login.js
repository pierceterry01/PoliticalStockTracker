import '../styles/LoginPage.css';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';  

function LoginPage() {
    // TESTING
    // Circumvents login process and takes user directly to stock-view
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault(); 
        navigate('/stock-view'); 
    };
    return (
        <div className="login-body">
            {/* Link to go back to the landing page */}
            <Link to="/" className="back-arrow">&#8592; Back to Home</Link>
            <div className="login-container">
                {/* Header displaying the app name */}
                <header className="login-header">
                    <h1>Outsider Trading</h1>
                </header>

                {/* Login form content */}
                <div className="login-form-content">
                    <h2>Login</h2>
                    <div className="header-line"></div> {/* Decorative line under "Login" */}

                    {/* Login form */}
                    <form onSubmit={handleSubmit} className="login-form">
                        {/* Email input field */}
                        <div className="login-form-group">
                            <label htmlFor="email" className="login-label">Email</label>
                            <input className="login-input" type="email" id="email" name="email" required />
                        </div>

                        {/* Password input field */}
                        <div className="login-form-group">
                            <label htmlFor="password" className="login-label">Password</label>
                            <input className="login-input" type="password" id="password" name="password" required />
                        </div>

                        {/* Submit button */}
                        <div className="login-form-group">
                            <input type="submit" value="Log in" className="login-button" />
                        </div>

                        {/* Link to create a new account */}
                        <div className="login-form-group">
                            <p>Don't have an account? <Link to="/register" className="create-account-link">Create an Account</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
