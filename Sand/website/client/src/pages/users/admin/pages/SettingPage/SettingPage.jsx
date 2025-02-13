import React, { useState } from 'react';
import axios from 'axios';
import emailjs from 'emailjs-com';
import './SettingPage.css';

const SettingPage = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const handleSendOtp = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/v1/user/sendOtp', {
        currentPassword,
      });
      if (response.status === 200) {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setVerificationCode(code);
        sendVerificationCode(response.data.email, code);
        setOtpSent(true);
        setMessage('OTP sent to your email.');
      } else {
        setMessage('Error sending OTP.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setMessage('Error sending OTP.');
    }
  };

  const sendVerificationCode = (email, code) => {
    const templateParams = {
      to_email: email,
      code: code,
    };

    emailjs.send('service_92zeeyo', 'template_oyh4qjg', templateParams, 'falgunipar2024@gmail.com')
      .then((response) => {
        console.log('Verification code sent!', response.status, response.text);
      })
      .catch((error) => {
        console.error('Failed to send verification code:', error);
      });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('New password and confirm password do not match.');
      return;
    }

    if (otp !== verificationCode) {
      setMessage('Invalid OTP.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/v1/user/changePassword', {
        currentPassword,
        newPassword,
        otp,
      });
      if (response.status === 200) {
        setMessage('Password changed successfully.');
      } else {
        setMessage('Error changing password.');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage('Error changing password.');
    }
  };

  return (
    <div className="setting-page-container">
      <h1>Settings</h1>
      <form onSubmit={handleChangePassword}>
        <div className="form-group">
          <label>Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {otpSent && (
          <div className="form-group">
            <label>OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
        )}
        {!otpSent ? (
          <button type="button" onClick={handleSendOtp}>
            Send OTP
          </button>
        ) : (
          <button type="submit">Change Password</button>
        )}
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default SettingPage;