import React, { useState, useRef, useEffect } from 'react';
import { FaUserEdit, FaSave, FaCamera, FaTrash } from 'react-icons/fa';
import { apiGet } from '../../api';

const getCurrentUser = () => JSON.parse(localStorage.getItem('currentUser'));
const setCurrentUser = (user) => localStorage.setItem('currentUser', JSON.stringify(user));

const ProfileSection = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ ...getCurrentUser() });
  const [profileImg, setProfileImg] = useState(getCurrentUser().profileImg || null);
  const fileInput = useRef();

  // Fetch latest profile from backend on mount
  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const user = await apiGet('/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm((prev) => ({ ...prev, ...user }));
        setCurrentUser({ ...getCurrentUser(), ...user });
        if (user.profileImg) setProfileImg(user.profileImg);
      } catch (err) {
        setError('Failed to fetch profile');
      }
      setLoading(false);
    }
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const updated = { ...form, profileImg };
    setCurrentUser(updated);
    window.dispatchEvent(new Event('profileImageUpdated'));
    setEditMode(false);
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setProfileImg(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteImg = () => {
    setProfileImg(null);
  };

  if (loading) return <div className="p-8 text-center">Loading profile...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile</h2>
      <div className="flex flex-col items-center gap-4">
        <div className="relative group">
          {profileImg ? (
            <img
              src={profileImg}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-blue-200 shadow"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center text-5xl font-bold text-blue-700 border-4 border-blue-200 shadow">
              {form.name ? form.name.charAt(0).toUpperCase() : <FaUserEdit />}
            </div>
          )}
          {editMode && (
            <>
              <button
                className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow hover:bg-blue-700"
                onClick={() => fileInput.current.click()}
                title="Upload"
              >
                <FaCamera />
              </button>
              {profileImg && (
                <button
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow hover:bg-red-600"
                  onClick={handleDeleteImg}
                  title="Delete"
                >
                  <FaTrash />
                </button>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInput}
                onChange={handleImageChange}
              />
            </>
          )}
        </div>
        <div className="w-full space-y-4 mt-4">
          <ProfileField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            editMode={editMode}
          />
          <ProfileField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            editMode={false}
          />
          <ProfileField
            label="Phone"
            name="phone"
            value={form.phone || ''}
            onChange={handleChange}
            editMode={editMode}
          />
          <ProfileField
            label="Boat Type"
            name="boatType"
            value={form.boatType || ''}
            onChange={handleChange}
            editMode={editMode}
          />
          
        </div>
        <div className="flex gap-4 mt-6">
          {editMode ? (
            <button
              className="bg-green-600 text-white rounded-lg px-6 py-2 hover:bg-green-700"
              onClick={handleSave}
            >
              <FaSave /> Save
            </button>
          ) : (
            <button
              className="bg-blue-600 text-white rounded-lg px-6 py-2 hover:bg-blue-700"
              onClick={() => setEditMode(true)}
            >
              <FaUserEdit /> Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({ label, name, value, onChange, editMode, type = 'text' }) => (
  <div className="flex flex-col gap-1">
    <label className="text-gray-600 font-semibold mb-1">{label}</label>
    {editMode ? (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
    ) : (
      <div className="bg-gray-100 rounded-lg px-3 py-2 text-gray-800">{value || <span className="text-gray-400">Not set</span>}</div>
    )}
  </div>
);

export default ProfileSection; 