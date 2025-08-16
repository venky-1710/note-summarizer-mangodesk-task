import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="header-logo">
          <span style={{ fontSize: '1.75rem', lineHeight: '1' }}>🤖</span>
          <div>
            <h1 style={{ margin: 0, lineHeight: '1.2' }}>AI Meeting Notes Summarizer</h1>
            <p style={{ 
              fontSize: '0.75rem', 
              opacity: 0.8, 
              margin: 0,
              fontWeight: 400,
              letterSpacing: '0.05em',
              lineHeight: '1.2'
            }}>
              Transform your meetings into actionable insights
            </p>
          </div>
        </Link>
        
        <nav className="header-nav">
          <Link 
            to="/" 
            className={`btn ${isActive('/') ? 'btn-secondary' : 'btn-primary'}`}
            style={{ textDecoration: 'none' }}
          >
            <span style={{ fontSize: '1.125rem', lineHeight: '1' }}>📝</span>
            <span className="btn-text">New Summary</span>
          </Link>
          <Link 
            to="/history" 
            className={`btn ${isActive('/history') ? 'btn-secondary' : 'btn-primary'}`}
            style={{ textDecoration: 'none' }}
          >
            <span style={{ fontSize: '1.125rem', lineHeight: '1' }}>📚</span>
            <span className="btn-text">History</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
