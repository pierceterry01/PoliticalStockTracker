import '../styles/styles.css';
import React from 'react';
import { Link } from 'react-router-dom';  

function LoginPage() {
    return (
        <div className="login-body">
            <Link to="/" className="back-arrow">&#8592;</Link> 
            <header className="login-header">
                <h1>Outsider Trading</h1>
            </header>
            <div className="sign-in-forms">
                <h1>Login</h1>
                <div className="header-line"></div>
                <div className="login-form-content">
                    <form>
                        <div className="login-form-group">
                            <label htmlFor="email" className="login-label">Email</label>
                            <input className="login-input" type="text" id="email" name="email" />
                        </div>
                        <div className="login-form-group">
                            <label htmlFor="password" className="login-label">Password</label>
                            <input className="login-input" type="password" id="password" name="password" />
                        </div>
                        <div className="login-form-group">
                            <input type="submit" value="Log in" className="login-button" />
                        </div>
                        <div className="login-form-group">
                            <Link to="/register" className="create-account-link">Create an Account here</Link> {}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
