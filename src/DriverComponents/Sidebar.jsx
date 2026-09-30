import React, { useState, useEffect } from 'react';
import { FaTachometerAlt, FaClipboardList, FaUsers, FaChartBar, FaStar, FaUser, FaShip, FaBars, FaComments } from 'react-icons/fa';
import charterLunaYacht from '../assets/charter-luna-yacht.png';

const sections = [
  { key: 'overview', label: 'Dashboard', icon: <FaTachometerAlt size={22} /> },
  { key: 'trips', label: 'My Trips', icon: <FaClipboardList size={22} /> },
  { key: 'requests', label: 'Join Requests', icon: <FaUsers size={22} /> },
  { key: 'stats', label: 'Statistics', icon: <FaChartBar size={22} /> },
  { key: 'ratings', label: 'Ratings & Feedback', icon: <FaStar size={22} /> },
  { key: 'profile', label: 'Profile', icon: <FaUser size={22} /> },
  { key: 'chat', label: 'Chat', icon: <FaComments size={22} /> },
];

const Sidebar = ({ currentSection, onSectionChange, unreadCount }) => {
  const [open, setOpen] = useState(false);

  // Get current user from localStorage
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('currentUser'));
  } catch {}
  const firstLetter = user && user.name ? user.name.charAt(0).toUpperCase() : 'D';
  const fullName = user && user.name ? user.name : 'Driver';

  // Close sidebar when section changes
  const handleSectionChange = (key) => {
    onSectionChange(key);
    setOpen(false);
  };

  return (
    <>
      {/* Hamburger button for small screens */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-lg shadow-lg focus:outline-none"
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle Sidebar"
      >
        <FaBars size={22} />
      </button>
      {/* Sidebar */}
      <aside className={`bg-white shadow-2xl h-screen w-56 absolute md:fixed top-0 left-0 flex flex-col z-50 pt-0 transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:z-40`}
      >
        {/* App Logo */}
        <div className="flex flex-col items-center gap-1 justify-center h-20 border-b border-gray-100 mb-2 select-none">
          <div className="flex items-center gap-3 mt-2">
            <FaShip className="text-blue-600 text-3xl" />
            <span className="text-2xl font-extrabold text-blue-700 tracking-wide">Flucca</span>
          </div>
        </div>
        {/* Driver profile image or first letter of name */}
        <div className="flex flex-col items-center mb-4 cursor-pointer" onClick={() => handleSectionChange('profile')} title="Profile">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-700 border-2 border-blue-200">
            {firstLetter}
          </div>
          <span className="mt-2 text-sm font-semibold text-gray-700">{fullName}</span>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2">
          {sections.map(sec => (
            <button
              key={sec.key}
              onClick={() => handleSectionChange(sec.key)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-lg font-semibold transition-colors
                ${currentSection === sec.key ? 'bg-blue-600 text-white shadow-md scale-105' : 'text-gray-700 hover:bg-blue-100'}`}
              style={{ position: 'relative' }}
            >
              {sec.icon}
              <span>{sec.label}</span>
              {sec.key === 'chat' && unreadCount > 0 && (
                <span className="absolute right-4 top-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </nav>
      </aside>
      {/* Transparent background when sidebar is open on mobile */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden" onClick={() => setOpen(false)}></div>
      )}
    </>
  );
};

export default Sidebar; 