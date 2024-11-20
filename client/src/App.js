// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './components/landing-page';
import LoginPage from './components/login';
import RegisterPage from './components/register';
import PortfolioPage from './components/portfolio';
import StockViewPage from './components/stock-view';
import SettingsPage from './components/settings';
import PoliticianPage from './components/politician-page';
import PlaceholderPage from './components/PlaceholderPage'; // For pages not yet implemented

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes without NavBar */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Routes with NavBar */}
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/stock-view" element={<StockViewPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/politician/:politicianName" element={<PoliticianPage />} />
          <Route path="/following" element={<PlaceholderPage pageName="Following" />} />
          {/* Add additional routes as needed */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
