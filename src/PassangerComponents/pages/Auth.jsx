import React from 'react';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../common/Header.jsx';
import { apiPost } from '../../api';

const Auth = () => {
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    try {
      const res = await apiPost('/auth/login', { email, password });
      localStorage.setItem('token', res.token);
      localStorage.setItem('currentUser', JSON.stringify(res.user));
      navigate('/passenger/language');
    } catch (err) {
      alert('Login failed: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Header title="" backTo="/passenger" showBack={true} className="mb-6 bg-transparent shadow-none border-none" />
        
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-blue-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Aboard</h2>
            <p className="text-gray-600">Sign in to start your maritime journey</p>
          </div>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input 
                type="email" 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input 
                type="password" 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your password"
              />
            </div>
          </div>
          
          <button 
            onClick={() => handleLogin(email, password)}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Sign In
          </button>
          
          <p className="text-center text-gray-600 mt-6">
            New to AquaFlow? 
            <span className="text-blue-600 font-semibold cursor-pointer hover:underline ml-1">
              Create account
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;