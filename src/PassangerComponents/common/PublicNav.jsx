import React, { useState, useEffect } from 'react';

const PublicNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Load Font Awesome
  useEffect(() => {
    if (!document.querySelector('link[href*="font-awesome"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
      document.head.appendChild(link);
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="relative">
      {/* Glassmorphism background with gradient */}
      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50/90 via-white/95 to-indigo-50/90 backdrop-blur-xl shadow-2xl border-b border-blue-200/30 fixed w-full top-0 z-50">
        
        {/* Brand Logo with enhanced styling */}
        <div className="flex items-center space-x-3">
          <a href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              {/* Animated background circle */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-all duration-500 transform group-hover:scale-110"></div>
              <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-2xl shadow-lg">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.64 2.62.99 4 .99h2v-2h-2zM3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.89-6.68c.08-.26.06-.54-.06-.78s-.34-.42-.6-.5L20 10.62V6c0-1.1-.9-2-2-2h-3V1H9v3H6c-1.1 0-2 .9-2 2v4.62l-1.29.83c-.26.08-.48.26-.6.5s-.14.52-.06.78L3.95 19zM6 6h12v3.97L12 8 6 9.97V6z"/>
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                Flucca
              </span>
              <span className="text-xs text-blue-500/70 font-medium tracking-wider">
                RIDE WITH US
              </span>
            </div>
          </a>
        </div>

        {/* Desktop Navigation - Only Login and Signup */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Login Button */}
          <a
            href="/login"
            className="relative group px-6 py-3 text-blue-600 hover:text-white transition-all duration-300 font-medium rounded-2xl overflow-hidden border-2 border-blue-500 hover:border-blue-600"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-2xl"></div>
            <span className="relative z-10 flex items-center space-x-2">
              <i className="fas fa-sign-in-alt transform group-hover:scale-110 transition-transform duration-300"></i>
              <span>Login</span>
            </span>
          </a>
          
          {/* Signup Button */}
          <a
            href="/signup"
            className="relative group px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            <span className="relative z-10 flex items-center space-x-2">
              <i className="fas fa-user-plus transform group-hover:scale-110 transition-transform duration-300"></i>
              <span>Sign Up</span>
            </span>
          </a>
        </div>

        {/* Enhanced Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="relative group p-2 text-blue-600 hover:text-white focus:outline-none transition-all duration-300 rounded-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            <svg className="relative z-10 h-6 w-6 transform transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Enhanced Mobile Navigation - Only Login and Signup */}
      {isMenuOpen && (
        <div className="md:hidden fixed top-20 left-4 right-4 z-40">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-200/30 overflow-hidden">
            <div className="p-4 space-y-3">
              {/* Mobile Login Button */}
              <a
                href="/login"
                className="group flex items-center space-x-3 w-full px-4 py-3 text-blue-600 hover:text-white rounded-2xl transition-all duration-300 font-medium relative overflow-hidden border-2 border-blue-500 hover:border-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-2xl"></div>
                <i className="fas fa-sign-in-alt relative z-10 transform group-hover:scale-110 transition-transform duration-300 text-lg"></i>
                <span className="relative z-10">Login</span>
              </a>
              
              {/* Mobile Signup Button */}
              <a
                href="/signup"
                className="group flex items-center space-x-3 w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg relative overflow-hidden"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-2xl"></div>
                <i className="fas fa-user-plus relative z-10 transform group-hover:scale-110 transition-transform duration-300 text-lg"></i>
                <span className="relative z-10">Sign Up</span>
              </a>
            </div>
          </div>
        </div>
      )}
      
      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </nav>
  );
};

export default PublicNav; 