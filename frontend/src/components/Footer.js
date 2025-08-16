import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-bottom">
          <div className="footer-bottom-text">
            ©2025 AI Meeting Notes Summarizer
          </div>
          <div className="footer-bottom-text">
            Made with<span style={{ color: '#ef4444' }}>❤️</span>for better productivity
          </div>
          <div className="footer-version">
            v1.0.0
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
