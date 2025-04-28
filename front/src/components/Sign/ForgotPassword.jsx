import React, { useState } from 'react';
import { toast } from 'react-toastify'; // Import toast from react-toastify
import './styles/ForgotPassword.scss';
import axios from 'axios';

const ForgotPassword = ({ setShowForgotPassword }) => {
  const [email, setEmail] = useState('');

  axios.defaults.baseURL = import.meta.env.VITE_API_URL;
  axios.defaults.withCredentials = true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const resp = axios.post("/auth/forgot-password",{email},{withCredentials: true});
      console.log(resp);
      toast.success('A password reset link has been sent to your email!');
    }catch(err){
      console.log(err);
    }finally{
      setShowForgotPassword(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <h3>Forgot Password</h3>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email">Enter your email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Send Reset Link</button>
        <button type="button" onClick={() => setShowForgotPassword(false)}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
