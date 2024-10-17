import '../styles/styles.css';
import React from 'react';
import { Link } from 'react-router-dom';

function RegisterPage() {
    return (
        <div className="create-account-body">
            <Link to="/" className="back-arrow">&#8592;</Link> 
            <header className="create-account-header">
                <h1>Outsider Trading</h1>
            </header>
            <div className="create-account-forms">
                <h1>Create Account</h1>
                <div className="header-line"></div>
                <div className="create-account-form-content">
                    <form>
                        <div className="create-account-form-group">
                            <label htmlFor="username" className="create-account-label">Username</label>
                            <input className="create-account-input" type="text" id="username" name="username" />
                        </div>
                        <div className="create-account-form-group">
                            <label htmlFor="email" className="create-account-label">Email</label>
                            <input className="create-account-input" type="text" id="email" name="email" />
                        </div>
                        <div className="create-account-form-group">
                            <label htmlFor="password" className="create-account-label">Password</label>
                            <input className="create-account-input" type="password" id="password" name="password" />
                        </div>
                        <div className="create-account-form-group">
                            <input type="submit" value="Create Account" className="create-account-button" />
                        </div>
                        <div className="create-account-form-group">
                            <Link to="/login" className="login-link">Sign in here</Link> 
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage