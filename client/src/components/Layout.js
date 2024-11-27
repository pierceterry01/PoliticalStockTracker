import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

function Layout() {
  return (
    <div className="layout">
      <NavBar />
      <div className="layout-content">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
