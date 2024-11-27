import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/LandingPage.css';
import landingPageImage from '../assets/images/landing-page-image.png';

function LandingPage() {
    const [isLoading, setIsLoading] = useState(false);

    const handleSignUpClick = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 2000); 
    };

    return (
        <div className="landing-page">
            {/* Header*/}
            <header className="landing-header">
                <div className="logo-title">
                    <h1>Outsider Trading</h1>
                </div>
                <div className="header-actions">
                    {/* Login button */}
                    <Link to="/login" className="btn login-btn">Login</Link>
                </div>
            </header>

            {/* Hero Section */}
            <div className="hero-section">
                <div className="hero-text">
                    <h1>Track Politicians, Trade Smarter.</h1> {/* Hero headline */}
                    <p>Make informed financial decisions by staying ahead of insider trading trends from political figures. Sign up today to gain access to real-time insights.</p> {/* Hero subtext */}
                    
                    {/* Signup button w/ spinner when loading */}
                    <Link to="/register" className="btn signup-btn" onClick={handleSignUpClick}>
                        {isLoading ? <div className="spinner"></div> : 'Get Started'} {/* Show spinner if loading */}
                    </Link>
                </div>
                <div className="hero-image">
                    <img src={landingPageImage} alt="Political and stock illustration" /> {/* Hero image */}
                </div>
            </div>
        </div>
    );
}

export default LandingPage;
