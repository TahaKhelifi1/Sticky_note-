import React, { useEffect, useState } from 'react';
import './styles/Login.scss';
import ForgotPassword from './ForgotPassword';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  axios.defaults.baseURL = "http://localhost:3000";
  axios.defaults.withCredentials = true;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { login ,user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  // ****** Don't use Internal implementation for the login make sure you use the context ********** //

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
    
  //   try {
  //     // Add login logic here
  //     const res = await axios.post("http://localhost:3000/auth/login", { email, password }, { withCredentials: true });
  
  //     if (res.status === 200) {
  //       toast.success('Login finished successfully');
  //       navigate('/dashboard');
  //     } else {
  //       toast.warning('Something went wrong');
  //     }
  //   } catch (err) {
  //     toast.error('Server problem');
  //     console.error(err); // Log the error for debugging
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password); // Use the login function
      toast.success('Login successful');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response.data.error);
    }
  };
  

  return (
    <>
    {!showForgotPassword && <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Login</button>
      </form>
      <div className="forgot-password">
        <button onClick={() => navigate('/sign-up')}>I don't have an account</button>
        <button onClick={() => setShowForgotPassword(true)}>Forgot Password?</button>
      </div>
    </div>}
    {showForgotPassword && <ForgotPassword setShowForgotPassword={setShowForgotPassword} />}
    </>
  );
};

export default Login;
