import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Profile = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState({ name: '', email: '' });
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' });

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
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

  const handleChangePassword = async () => {
    try {
      await axios.post('/api/user/change-password', passwords, { withCredentials: true });
      alert('Password changed!');
      setPasswords({ oldPassword: '', newPassword: '' });
    } catch (err) {
      console.error(err);
      alert('Failed to change password');
    }
  };

  return (
    <div className="container my-5">
      <div className={`card ${darkMode ? 'bg-dark text-light' : ''} shadow p-4`}>
        <h3 className="text-center mb-4">👤 Profile</h3>

        <div className="mb-3">
          <label className="form-label">Name</label>
          {editMode ? (
            <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} />
          ) : (
            <p>{user.name}</p>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          {editMode ? (
            <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} />
          ) : (
            <p>{user.email}</p>
          )}
        </div>

        <div className="d-flex justify-content-between">
          {editMode ? (
            <>
              <button className="btn btn-success" onClick={handleUpdate}>Save</button>
              <button className="btn btn-secondary" onClick={handleEditToggle}>Cancel</button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={handleEditToggle}>Edit Profile</button>
          )}
        </div>

        <hr className="my-4" />

        <h5 className="mb-3">🔐 Change Password</h5>
        <input
          type="password"
          name="oldPassword"
          className="form-control mb-2"
          placeholder="Old Password"
          value={passwords.oldPassword}
          onChange={handlePasswordChange}
        />
        <input
          type="password"
          name="newPassword"
          className="form-control mb-3"
          placeholder="New Password"
          value={passwords.newPassword}
          onChange={handlePasswordChange}
        />
        <button className="btn btn-warning" onClick={handleChangePassword}>Change Password</button>
      </div>
    </div>
  );
};

export default Profile;
