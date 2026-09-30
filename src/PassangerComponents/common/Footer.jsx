import React, { useEffect } from 'react';

const Footer = ({ hasNewMessage }) => {
  // Load Font Awesome
  useEffect(() => {
    if (!document.querySelector('link[href*="font-awesome"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
      document.head.appendChild(link);
    }
  }, []);

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-blue-900/90 to-indigo-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative">
                {/* Animated background circle */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl blur-lg opacity-50"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl shadow-xl">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.64 2.62.99 4 .99h2v-2h-2zM3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.89-6.68c.08-.26.06-.54-.06-.78s-.34-.42-.6-.5L20 10.62V6c0-1.1-.9-2-2-2h-3V1H9v3H6c-1.1 0-2 .9-2 2v4.62l-1.29.83c-.26.08-.48.26-.6.5s-.14.52-.06.78L3.95 19zM6 6h12v3.97L12 8 6 9.97V6z"/>
                  </svg>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
                  Flucca
                </div>
                <span className="text-sm text-blue-300/70 font-medium tracking-wider">
                  RIDE WITH US
                </span>
              </div>
            </div>
            
            <p className="text-blue-100/80 mb-6 max-w-md leading-relaxed">
              Leading platform for boat rentals and marine trips. We provide you with the best sea travel experience with shared trips and private bookings.
            </p>
            
            {/* Social Media Links */}
            <div className="flex space-x-4">
              {[
                { icon: "fab fa-facebook-f", href: "#", color: "hover:text-blue-400" },
                { icon: "fab fa-twitter", href: "#", color: "hover:text-sky-400" },
                { icon: "fab fa-instagram", href: "#", color: "hover:text-pink-400" },
                { icon: "fab fa-linkedin-in", href: "#", color: "hover:text-blue-500" }
              ].map((social, index) => (
                <a 
                  key={index}
                  href={social.href} 
                  className={`group relative p-3 text-blue-200/60 ${social.color} transition-all duration-300 rounded-xl overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-white/10 transform scale-0 group-hover:scale-100 transition-transform duration-300 rounded-xl"></div>
                  <i className={`${social.icon} text-lg relative z-10 transform group-hover:scale-110 transition-transform duration-300`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-blue-300 flex items-center space-x-2">
              <i className="fas fa-link text-lg"></i>
              <span>Quick Links</span>
            </h3>
            <ul className="space-y-3">
              {[
                { to: "/passenger/home", label: "Home", icon: "fas fa-home" },
                { to: "/passenger/shared-trips", label: "Shared Trips", icon: "fas fa-users" },
                { to: "/passenger/private-booking", label: "Private Booking", icon: "fas fa-car" },
                { to: "/passenger/offers", label: "Offers", icon: "fas fa-gift" },
                { to: "/passenger/chat", label: "Chat", icon: "fas fa-comments" }
              ].map((link, index) => (
                <li key={index} className="relative">
                  <a 
                    href={link.to}
                    className="group flex items-center space-x-3 text-blue-100/70 hover:text-white transition-all duration-300 py-1"
                  >
                    <i className={`${link.icon} w-4 text-blue-400 group-hover:text-blue-300 transition-colors duration-300`}></i>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Help */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-blue-300 flex items-center space-x-2">
              <i className="fas fa-life-ring text-lg"></i>
              <span>Support & Help</span>
            </h3>
            <ul className="space-y-3">
              {[
                { label: "Help Center", icon: "fas fa-question-circle" },
                { label: "Privacy Policy", icon: "fas fa-shield-alt" },
                { label: "Terms of Service", icon: "fas fa-file-contract" },
                { label: "Contact Us", icon: "fas fa-envelope" },
                { label: "FAQ", icon: "fas fa-comments-dollar" }
              ].map((link, index) => (
                <li key={index}>
                  <a 
                    href="#"
                    className="group flex items-center space-x-3 text-blue-100/70 hover:text-white transition-all duration-300 py-1"
                  >
                    <i className={`${link.icon} w-4 text-blue-400 group-hover:text-blue-300 transition-colors duration-300`}></i>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-12 p-8 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 backdrop-blur-sm rounded-3xl border border-blue-400/20">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-blue-300 mb-3 flex items-center justify-center space-x-2">
              <i className="fas fa-paper-plane"></i>
              <span>Stay Updated</span>
            </h3>
            <p className="text-blue-100/70 mb-6">Subscribe to get the latest offers and updates</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <div className="relative flex-1">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-blue-400/30 rounded-2xl text-white placeholder-blue-200/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                />
              </div>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2">
                <i className="fas fa-paper-plane"></i>
                <span>Subscribe</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-blue-400/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-blue-200/60 text-sm flex items-center space-x-2">
              <i className="fas fa-copyright"></i>
              <span>2024 Flucca. All rights reserved. Made with ❤️</span>
            </p>
            <div className="flex space-x-8">
              {[
                { label: "Privacy Policy", icon: "fas fa-user-shield" },
                { label: "Terms of Service", icon: "fas fa-file-contract" },
                { label: "Sitemap", icon: "fas fa-sitemap" }
              ].map((link, index) => (
                <a 
                  key={index}
                  href="#" 
                  className="group text-blue-200/60 hover:text-blue-300 text-sm transition-all duration-300 flex items-center space-x-1"
                >
                  <i className={`${link.icon} text-xs group-hover:scale-110 transition-transform duration-300`}></i>
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;