import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = ({ title, backTo, showBack = true, className = '', rightContent }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={`bg-white border border-blue-100 px-6 py-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {showBack && (
            <button
              onClick={handleBack}
              className="mr-4 p-2 rounded-full bg-blue-400 border border-blue-500 hover:bg-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
          )}
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        </div>
        {rightContent && (
          <div className="flex items-center space-x-2">
            {rightContent}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;