import React from 'react';
import './styles/Header.scss';
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <h2>StickyNotes</h2>
      </div>
      <nav className="nav">
        <ul>
          <li><a href="#features">Features</a></li>
          <li><a href="#about">About</a></li>
          <li><Link to="/login" className="login-button">Login</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
