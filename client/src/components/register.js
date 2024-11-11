import '../styles/RegisterPage.css';
import React from 'react';
import { Link } from 'react-router-dom';

function RegisterPage() {
    return (
        <div className="register-body">
            {/* Link to go back to the home page */}
            <Link to="/" className="back-arrow">&#8592; Back to Home</Link>
            <div className="register-container">
                {/* Header displaying the app name */}
                <header className="register-header">
                    <h1>Outsider Trading</h1>
                </header>

                {/* Register form content */}
                <div className="register-form-content">
                    <h2>Create Your Account</h2>
                    <div className="header-line"></div> {/* Decorative line under "Create Your Account" */}

                    {/* Registration form */}
                    <form className="register-form">
                        {/* Username input field */}
                        <div className="register-form-group">
                            <label htmlFor="username" className="register-label">Username</label>
                            <input className="register-input" type="text" id="username" name="username" required />
                        </div>

                        {/* Email input field */}
                        <div className="register-form-group">
                            <label htmlFor="email" className="register-label">Email</label>
                            <input className="register-input" type="email" id="email" name="email" required />
                        </div>

                        {/* Password input field */}
                        <div className="register-form-group">
                            <label htmlFor="password" className="register-label">Password</label>
                            <input className="register-input" type="password" id="password" name="password" required />
                        </div>

                        {/* Confirm password input field */}
                        <div className="register-form-group">
                            <label htmlFor="confirmPassword" className="register-label">Confirm Password</label>
                            <input className="register-input" type="password" id="confirmPassword" name="confirmPassword" required />
                        </div>

                        {/* Submit button */}
                        <div className="register-form-group">
                            <input type="submit" value="Create Account" className="register-button" />
                        </div>

                        {/* Link to go to login page if user has an account */}
                        <div className="register-form-group">
                            <p>Already have an account? <Link to="/login" className="login-link">Sign in here</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
