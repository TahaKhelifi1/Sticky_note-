import React, { useState,useEffect } from 'react';
import './styles/SignUp.scss';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Import toast from react-toastify
import axios from 'axios';
import { useAuth } from '../../Context/AuthContext';

const SignUp = () => {

  axios.defaults.baseURL = "http://localhost:3000";
  axios.defaults.withCredentials = true;

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
      if (user) {
        navigate('/dashboard');
      }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.warning("Passwords don't match");
      return;
    }
    // Add sign-up logic here
    try {
      const res = await axios.post("/auth/register", {
        username,
        email,
        password
      }, {
        withCredentials: true
      });
  
      if (res.status === 201) {
        toast.success('Sign-up finished successfully');
        navigate('/login');
      } else {
        alert("Something went wrong");
      }
    } catch (err) {
      toast.error("Server problem");
      console.error(err); // Log the error for debugging
    }
  };
  

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
      <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      <div className="links">
        <button onClick={() => navigate('/login')}>I already have an account</button>
      </div>
    </div>
  );
};

export default SignUp;
