import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignUp from './SignUp';
import { apiPost } from '../api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // جلب بيانات آخر سائق مسجل (لو موجود)
  let users = JSON.parse(localStorage.getItem('users') || '[]');
  const lastDriver = users.reverse().find(u => u.role === 'Driver');

  const handleLogin = async (email, password) => {
    try {
      const res = await apiPost('/auth/login', { email, password });
      localStorage.setItem('token', res.token);
      localStorage.setItem('currentUser', JSON.stringify(res.user));
      if (res.user.role === 'Driver') {
        navigate('/driver/dashboard');
      } else if (res.user.role === 'Passenger') {
        navigate('/passenger');
      } else {
        alert('Invalid user role');
      }
    } catch (err) {
      alert('Login failed: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-100 to-blue-200 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.2) 1px, transparent 0)',
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 flex items-center justify-center">
        <div className="grid md:grid-cols-2 gap-8 items-center w-full max-w-5xl">
          
          {/* Left Side - Boat Illustration */}
          <div className="hidden md:flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              {/* Main Boat Illustration */}
              <div className="w-80 h-80 rounded-full bg-gradient-to-br from-blue-200/20 to-blue-400/20 backdrop-blur-sm border border-blue-200/50 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-300/10 to-transparent"></div>
                
                {/* Animated Boat SVG */}
                <svg className="w-48 h-48 text-blue-500 animate-bob" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.64 2.62.99 4 .99h2v-2h-2zM3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.89-6.68c.08-.26.06-.54-.06-.78s-.34-.42-.6-.5L20 10.62V6c0-1.1-.9-2-2-2h-3V1H9v3H6c-1.1 0-2 .9-2 2v4.62l-1.29.83c-.26.08-.48.26-.6.5s-.14.52-.06.78L3.95 19zM6 6h12v3.97L12 8 6 9.97V6z"/>
                </svg>
                
                {/* Ripple Effects */}
                <div className="absolute bottom-8 left-8 w-16 h-16 bg-blue-300/20 rounded-full animate-ripple"></div>
                <div className="absolute top-8 right-8 w-12 h-12 bg-blue-200/20 rounded-full animate-ripple delay-300"></div>
                <div className="absolute bottom-16 right-16 w-8 h-8 bg-blue-400/20 rounded-full animate-ripple delay-700"></div>
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-blue-800">Join Our Platform</h2>
              <p className="text-blue-600 max-w-sm">Discover Egypt with our premium travel experience</p>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-blue-200/50 p-8 relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-300 via-blue-400 to-blue-300 rounded-t-2xl"></div>
              
              {/* Header */}
              <div className="text-center mb-8 relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  {/* Boat Icon */}
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.64 2.62.99 4 .99h2v-2h-2zM3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.89-6.68c.08-.26.06-.54-.06-.78s-.34-.42-.6-.5L20 10.62V6c0-1.1-.9-2-2-2h-3V1H9v3H6c-1.1 0-2 .9-2 2v4.62l-1.29.83c-.26.08-.48.26-.6.5s-.14.52-.06.78L3.95 19zM6 6h12v3.97L12 8 6 9.97V6z"/>
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-blue-800 mb-2">Welcome Back!</h1>
                <p className="text-blue-600 text-sm">Log in to continue your journey</p>
              </div>

              {/* Login Form */}
              <div className="space-y-6 relative z-10">
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-blue-700 block">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-white/50 border border-blue-300 rounded-xl text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                      placeholder="example@email.com"
                      required
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-blue-700 block">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-white/50 border border-blue-300 rounded-xl text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700 transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" className="rounded border-blue-300 bg-white/50 text-blue-500 focus:ring-blue-400 focus:ring-offset-0" />
                    <span className="ml-2 text-blue-600">Remember me</span>
                  </label>
                  <a href="#" className="text-blue-500 hover:text-blue-700 font-medium transition-colors">
                    Forgot your password?
                  </a>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  onClick={() => handleLogin(email, password)}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-800 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                  <span>Log In</span>
                </button>
                {/* Register Button */}
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="w-full mt-4 bg-white border border-blue-400 text-blue-700 py-3 px-4 rounded-xl font-semibold hover:bg-blue-50 hover:text-blue-900 transition-all duration-300 shadow flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                  </svg>
                  <span>Register</span>
                </button>
              </div>

              {/* Divider */}
              <div className="my-6 flex items-center relative z-10">
                <div className="flex-1 border-t border-blue-300"></div>
                <span className="px-4 text-blue-600 text-sm">or</span>
                <div className="flex-1 border-t border-blue-300"></div>
              </div>

              {/* Social Login */}
             
              {/* Sign Up Link */}
              <div className="mt-6 text-center relative z-10">
                <p className="text-blue-600 text-sm">
                  New here?{' '}
                  <a href="/Signup" onClick={(e) => { e.preventDefault(); navigate('/Signup'); }} className="text-blue-500 hover:text-blue-700 font-semibold transition-colors">
                    Sign Up
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Elements */}
      <div className="absolute bottom-8 left-8 w-12 h-12 bg-gradient-to-br from-blue-200/30 to-blue-400/30 rounded-full animate-bounce backdrop-blur-sm border border-blue-200/50"></div>
      <div className="absolute top-8 right-8 w-8 h-8 bg-gradient-to-br from-blue-400/30 to-blue-200/30 rounded-full animate-bounce delay-500 backdrop-blur-sm border border-blue-200/50"></div>
      <div className="absolute bottom-20 right-20 w-6 h-6 bg-gradient-to-br from-blue-300/30 to-blue-400/30 rounded-full animate-bounce delay-1000 backdrop-blur-sm border border-blue-200/50"></div>

      {/* Inline CSS for Animations */}
      <style jsx>{`
        @keyframes bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .animate-bob { animation: bob 3s ease-in-out infinite; }
        .animate-ripple { animation: ripple 2s ease-out infinite; }
      `}</style>
    </div>
  );
}

export default Login;