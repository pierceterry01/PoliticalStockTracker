import React from 'react';
import { Link } from 'react-router-dom'; 

function LandingPage() {
  return (
    <div>
      <h1>Landing Page</h1>
      <p>PLACEHOLDER</p>
      <Link to="/login">Login</Link><br></br>
      <Link to="/register">Register</Link>
    </div>
  );
}

export default LandingPage;
