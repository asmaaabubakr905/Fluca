import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaEnvelope, FaPhone, FaIdCard, FaCar, FaCamera, FaTrash, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { apiGet, apiPut } from '../api';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    async function fetchProfile() {
      try {
        const user = await apiGet('/auth/profile');
        setUser(user);
      } catch (err) {
        // handle error
      }
    }
    fetchProfile();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setFormData({ ...formData, profileImage: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageDelete = () => {
    setFormData({ ...formData, profileImage: null });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    // Reset form data if canceling
    if (isEditing) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        nationalId: user.nationalId,
        vehicle: user.vehicle,
        profileImage: user.profileImage,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    // 1. Update all users list in localStorage
    let allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    allUsers = allUsers.map(u => (u.email === user.email ? { ...u, ...formData } : u));
    localStorage.setItem('users', JSON.stringify(allUsers));

    // 2. Update currentUser in localStorage
    const updatedUser = { ...user, ...formData };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setUser(updatedUser);

    // 3. Dispatch event to update Navbar
    window.dispatchEvent(new Event('userUpdated'));

    // 4. Exit editing mode
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 space-y-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative group">
              {formData.profileImage ? (
                <img src={formData.profileImage} alt="Profile" className="w-32 h-32 rounded-full object-cover shadow-lg" />
              ) : (
                <FaUserCircle className="w-32 h-32 text-gray-400" />
              )}
              {isEditing && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <label htmlFor="imageUpload" className="cursor-pointer text-white mx-2" title="Change Image">
                    <FaCamera size={24} />
                  </label>
                  <input id="imageUpload" type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  <button onClick={handleImageDelete} className="cursor-pointer text-white mx-2" title="Delete Image">
                    <FaTrash size={20} />
                  </button>
                </div>
              )}
            </div>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="text-3xl font-bold text-gray-900 text-center bg-gray-100 border-b-2 border-blue-500 focus:outline-none"
              />
            ) : (
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
            )}
            <span className="text-md text-gray-500">{user.role}</span>
          </div>

          <div className="border-t border-gray-200 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <ProfileField icon={<FaEnvelope />} label="Email Address" value={user.email} isStatic />
              
              <ProfileField icon={<FaPhone />} label="Phone Number" name="phone" value={formData.phone} isEditing={isEditing} onChange={handleInputChange} />
              
              <ProfileField icon={<FaIdCard />} label="National ID" value={user.nationalId} isStatic />
              
              <ProfileField icon={<FaCar />} label="Vehicle" name="vehicle" value={formData.vehicle} isEditing={isEditing} onChange={handleInputChange} />
            </div>
          </div>

          <div className="flex justify-center pt-6">
            {isEditing ? (
              <div className="flex space-x-4">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                >
                  <FaSave /> Save Changes
                </button>
                <button
                  onClick={handleEditToggle}
                  className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-lg transition-colors"
                >
                  <FaTimes /> Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={handleEditToggle}
                className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold py-2 px-6 rounded-lg transition-colors"
              >
                <FaEdit /> Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({ icon, label, value, name, isEditing, onChange, isStatic = false }) => {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
        {icon} {label}
      </label>
      {isEditing && !isStatic ? (
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          className="w-full px-3 py-2 text-md text-gray-800 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      ) : (
        <p className="text-md text-gray-800 bg-gray-50 px-3 py-2 rounded-lg">{value}</p>
      )}
    </div>
  );
};

export default ProfilePage; 