import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState({ name: '', email: '', role: '' });
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', role: '' });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDarkMode(document.body.classList.contains('dark-mode'));
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    setDarkMode(document.body.classList.contains('dark-mode'));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    axios
      .get('/api/user/me', { withCredentials: true })
      .then((res) => {
        setUser(res.data.user);
        setFormData(res.data.user);
      })
      .catch((err) => {
        console.error(err);
        alert('Failed to fetch user data');
      });
  }, []);

  const handleEditToggle = () => setEditMode(!editMode);
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    if (!formData.name || !formData.email) {
      alert('Name and email cannot be empty');
      return;
    }
    try {
      const res = await axios.put('/api/user/update', formData, { withCredentials: true });
      setUser(res.data.user);
      setEditMode(false);
      alert('Profile updated!');
    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
    }
  };

  return (
    <div className="container-db pb-3">
      <div className={`dashboard-container mx-auto animate-in ${darkMode ? 'dark-bg-db' : 'light-bg-db'}`} style={{ maxWidth: '1000px' }}>
        <h2 className={`text-center fw-bold mb-4 ${darkMode ? 'text-white' : 'text-dark'} animate-in`}>
          👤 Profile Details
        </h2>

        <div className="animate-in">
          {/* Name */}
          <div className="mb-4">
            <label className={`form-label ${darkMode ? 'text-white' : 'text-dark'}`}>Name</label>
            {editMode ? (
              <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} />
            ) : (
              <div className={`form-control-plaintext ${darkMode ? 'text-white' : 'text-dark'}`}>{user.name}</div>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className={`form-label ${darkMode ? 'text-white' : 'text-dark'}`}>Email</label>
            {editMode ? (
              <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} />
            ) : (
              <div className={`form-control-plaintext ${darkMode ? 'text-white' : 'text-dark'}`}>{user.email}</div>
            )}
          </div>

          {/* Role */}
          <div className="mb-4">
            <label className={`form-label ${darkMode ? 'text-white' : 'text-dark'}`}>Role</label>
            {editMode ? (
              <input type="text" name="role" className="form-control" value={formData.role} onChange={handleChange} />
            ) : (
              <div className={`form-control-plaintext ${darkMode ? 'text-white' : 'text-dark'}`}>{user.role || 'N/A'}</div>
            )}
          </div>

          {/* Buttons */}
          <div className="d-flex justify-content-between align-items-center mb-4 animate-in">
            {editMode ? (
              <>
                <button className="btn btn-success me-2 w-50" onClick={handleUpdate}>💾 Save</button>
                <button className="btn btn-secondary w-50" onClick={handleEditToggle}>❌ Cancel</button>
              </>
            ) : (
              <button className="btn btn-primary w-100" onClick={handleEditToggle}>✏️ Edit Profile</button>
            )}
          </div>

          <hr className={darkMode ? 'border-light' : ''} />

          {/* Change Password */}
          <div className="text-center animate-in">
            <NavLink to="/change-password">
              <button className="btn btn-warning">🔒 Change Password</button>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
