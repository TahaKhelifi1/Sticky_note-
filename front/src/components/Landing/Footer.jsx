import React from 'react';
import './styles/Footer.scss';

const Footer = () => {
  return (
    <footer className="footer" id='about'>
      <p>&copy; {new Date().getFullYear()} StickyNotes. All Rights Reserved.</p>
      <div className="social-links">
        <a href="https://facebook.com">Facebook</a>
        <a href="https://twitter.com">Twitter</a>
        <a href="https://github.com">GitHub</a>
      </div>
    </footer>
  );
};

export default Footer;
