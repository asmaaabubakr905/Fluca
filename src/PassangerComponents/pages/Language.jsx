import React from 'react';
import { Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../passangercontext/AppContext';
import Header from '../common/Header.jsx';

const Language = () => {
  const navigate = useNavigate();
  const { selectedLanguage, setSelectedLanguage } = useAppContext();

  const handleLanguageSelect = (language) => {
    console.log('Language selected:', language, 'navigating to ride-type');
    setSelectedLanguage(language);
    navigate('/passenger/ride-type');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        
        
        <div className="bg-white rounded-3xl shadow-lg p-8 border border-blue-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-blue-500" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">Choose Language</h2>
            <p className="text-gray-600 text-lg">Select your preferred language for your Flucca journey</p>
          </div>
          
          <div className="space-y-4">
            <button 
              onClick={() => handleLanguageSelect('en')}
              className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 hover:bg-blue-50 ${
                selectedLanguage === 'en' 
                  ? 'border-blue-400 bg-blue-50 text-gray-900' 
                  : 'border-gray-200 bg-gray-50 text-gray-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-lg">English</span>
                <span className="text-2xl">🇺🇸</span>
              </div>
            </button>
            
            <button 
              onClick={() => handleLanguageSelect('ar')}
              className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 hover:bg-blue-50 ${
                selectedLanguage === 'ar' 
                  ? 'border-blue-400 bg-blue-50 text-gray-900' 
                  : 'border-gray-200 bg-gray-50 text-gray-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-lg">Arabic</span>
                <span className="text-2xl">🇸🇦</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Language;