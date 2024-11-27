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
            // Redirect logic or sign-up flow here
        }, 2000); // Simulated loading time
    };

    return (
        <div className="landing-page">
            

            {/* Hero Section */}
            <div className="hero-section">
                <div className="hero-text">
                    <h1>Track Politicians, Trade Smarter.</h1> {/* Hero headline */}
                    <p>Make informed financial decisions by staying ahead of insider trading trends from political figures. Sign up today to gain access to real-time insights.</p> {/* Hero subtext */}
                    
                    {/* Signup button with spinner when loading */}
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
