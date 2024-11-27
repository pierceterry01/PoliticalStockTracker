// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './components/UserContext';
import Layout from './components/Layout';
import LandingPage from './components/landing-page';
import LoginPage from './components/login';
import RegisterPage from './components/register';
import PortfolioPage from './components/portfolio';
import StockViewPage from './components/stock-view';
import SettingsPage from './components/SettingsPage';
import PoliticianPage from './components/politician-page';
import FollowingPage from './components/FollowingPage';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Routes without NavBar */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Routes with NavBar */}
          <Route element={<Layout />}>
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/stock-view" element={<StockViewPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route
              path="/politician/:politicianName"
              element={<PoliticianPage />}
            />
            <Route path="/following" element={<FollowingPage />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
