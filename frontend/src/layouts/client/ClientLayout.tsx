import React from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import Header from './Header';
import BenefitsBar from './BenefitsBar';
import Footer from './Footer';

const ClientLayout = () => {
  return (
    <div className="min-h-screen bg-canvas flex flex-col font-sans">
      <TopBar />
      <Header />
      <BenefitsBar />
      
      {/* Main Content Area */}
      <div className="flex-grow">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
};

export default ClientLayout;
