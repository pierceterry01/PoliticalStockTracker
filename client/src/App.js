import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/landing-page';
import LoginPage from './components/login';
import RegisterPage from './components/register';
import PortfolioPage from './components/portfolio';
import StockViewPage from './components/stock-view';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

        <Route path="/portfolio" element={<PortfolioPage />} />

        <Route path="/stock-view" element={<StockViewPage />} />
        

      </Routes>
    </Router>
  );
}

export default App;
