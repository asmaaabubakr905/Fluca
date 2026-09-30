import React from 'react';
import { Outlet } from 'react-router-dom';
import Nav from './Nav';
import Footer from './Footer';
import { useAppContext } from '../../passangercontext/AppContext';

const PassengerLayout = () => {
  const { hasNewMessage } = useAppContext();
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer hasNewMessage={hasNewMessage} />
    </div>
  );
};

export default PassengerLayout; 