import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiPost } from '../api';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('Passenger');
  const [boatType, setBoatType] = useState('');
  const [boatId, setBoatId] = useState('');
  const [seats, setSeats] = useState('');
  const [boatImage, setBoatImage] = useState(null);
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('role', role);
      formData.append('phone', phone);
      if (role === 'Driver') {
        formData.append('boatType', boatType);
        formData.append('boatId', boatId);
        formData.append('seats', seats);
        if (boatImage) formData.append('boatImage', boatImage);
      }
      await apiPost('/auth/register', formData, true);
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      alert('Registration failed: ' + err.message);
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

          {/* Right Side - Register Form */}
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
                <h1 className="text-2xl font-bold text-blue-800 mb-2">Create Your Account</h1>
                <p className="text-blue-600 text-sm">Sign up to start your journey</p>
              </div>

              {/* Register Form */}
              <div className="space-y-6 relative z-10">
                {/* Name Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-blue-700 block">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-white/50 border border-blue-300 rounded-xl text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                      placeholder="John Doe"
                      required
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                    </div>
                  </div>
                </div>

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

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-blue-700 block">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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

                {/* Register as */}
                <div className="space-y-4">
                  <label className="text-sm font-medium text-blue-700 block mb-1">Register as</label>
                  <div className="flex gap-4">
                    <label className="flex items-center cursor-pointer">
                      <input type="radio" name="role" value="Passenger" checked={role === 'Passenger'} onChange={() => setRole('Passenger')} className="accent-blue-600" />
                      <span className="ml-2 text-blue-600">Passenger</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input type="radio" name="role" value="Driver" checked={role === 'Driver'} onChange={() => setRole('Driver')} className="accent-blue-600" />
                      <span className="ml-2 text-blue-600">Driver (Boat Captain)</span>
                    </label>
                  </div>
                </div>

                {/* Driver-specific fields */}
                {role === 'Driver' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-blue-700 block">Boat Type</label>
                      <input type="text" value={boatType} onChange={e => setBoatType(e.target.value)} className="w-full px-4 py-3 bg-white/50 border border-blue-300 rounded-xl text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300" placeholder="e.g. Felucca, Yacht" required={role === 'Driver'} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-blue-700 block">Boat ID</label>
                      <input type="text" value={boatId} onChange={e => setBoatId(e.target.value)} className="w-full px-4 py-3 bg-white/50 border border-blue-300 rounded-xl text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300" placeholder="Boat Registration ID" required={role === 'Driver'} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-blue-700 block">Number of Seats</label>
                      <input type="number" value={seats} onChange={e => setSeats(e.target.value)} className="w-full px-4 py-3 bg-white/50 border border-blue-300 rounded-xl text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300" placeholder="e.g. 8" required={role === 'Driver'} min="1" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-blue-700 block">Boat Image (optional)</label>
                      <input type="file" accept="image/*" onChange={e => setBoatImage(e.target.files[0])} className="w-full" />
                    </div>
                  </>
                )}

                {/* Phone Number Field - يظهر دائماً */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-blue-700 block">Phone Number</label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-white/50 border border-blue-300 rounded-xl text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                      placeholder="Eg. 01012345678"
                      required
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm0 10a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2zm10-10a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zm0 10a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Register Button */}
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-800 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                  <span>Sign Up</span>
                </button>
              </div>

              {/* Divider */}
              <div className="my-6 flex items-center relative z-10">
                <div className="flex-1 border-t border-blue-300"></div>
                <span className="px-4 text-blue-600 text-sm">or</span>
                <div className="flex-1 border-t border-blue-300"></div>
              </div>

              {/* Social Sign Up */}
              {/* <div className="space-y-3 relative z-10">
                <button className="w-full bg-white/50 backdrop-blur-sm border border-blue-300 text-blue-800 py-3 px-4 rounded-xl font-medium hover:bg-white/70 transition-all duration-300 flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span>Sign Up with Google</span>
                </button>
              </div> */}

              {/* Login Link */}
              <div className="mt-6 text-center relative z-10">
                <p className="text-blue-600 text-sm">
                  Already have an account?{' '}
                  <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }} className="text-blue-500 hover:text-blue-700 font-semibold transition-colors">
                    Log In
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
      <style>{`
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

export default Register;