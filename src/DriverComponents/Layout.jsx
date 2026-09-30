import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
// import Footer from './Footer';

const Layout = () => {
  const location = useLocation();
  return (
    <div>
      <Navbar />
      <main className="pt-16">
        <Outlet key={location.pathname} />
      </main>
    </div>
  );
};

export default Layout; 