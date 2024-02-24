import React, { useState } from 'react';
import style from './Style.module.css';

function Setting() {
  const [formData, setFormData] = useState({
    name: '',
    oldPassword: '',
    newPassword: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (formData.newPassword.length < 6) {
        setErrorMessage('New password must be at least 6 characters long.');
        setSuccessMessage('');
        return;
      }
       // Get email from local storage
    const email = localStorage.getItem('email');

    // Check if email is available
    if (!email) {
      throw new Error('Email not found in local storage.');
    }

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/user/update/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
         body: JSON.stringify({ ...formData, email })
      });
  
      // Log the response body for debugging
      console.log(await response.json());
  
      if (!response.ok) {
        throw new Error('Failed to update password.');
      }
  
      setSuccessMessage('Password updated successfully!');
      setErrorMessage('');
      // Reset form fields after successful submission
      setFormData({
        name: '',
        oldPassword: '',
        newPassword: ''
      });
    } catch (error) {
      console.error('Error updating password:', error);
      setSuccessMessage('');
      setErrorMessage(error.message || 'Failed to update password. Please try again.');
    }
  };
  
  return (
    <div className={style.passwordUpdateForm}>
      {errorMessage && <div className={style.errorMessage}>{errorMessage}</div>}
      {successMessage && <div className={style.successMessage}>{successMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className={style.inputGroup}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className={style.inputField}
          />
          <i className={`fas fa-user ${style.icon}`} /> {/* Replace the class with your icon library */}
        </div>
        <div className={style.inputGroup}>
          <input
            type="password"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            placeholder="Old Password"
            className={style.inputField}
          />
          <i className={`fas fa-lock ${style.icon}`} /> {/* Replace the class with your icon library */}
        </div>
        <div className={style.inputGroup}>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="New Password"
            className={style.inputField}
          />
          <i className={`fas fa-lock ${style.icon}`} /> {/* Replace the class with your icon library */}
        </div>
        <button type="submit" className={style.submitButton}>Update Password</button>
      </form>
    </div>
  );
}

export default Setting;
