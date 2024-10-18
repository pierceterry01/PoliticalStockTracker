import '../styles/styles.css';
import React from 'react';
import { Link } from 'react-router-dom'; 

function PortfolioPage() {
    return (
        <div>
            <h1>Portfolio Page</h1>
            <p>PLACEHOLDER</p>
            <Link to="/stock-view">Stock View</Link>
        </div>
    )
}

export default PortfolioPage;