import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...', inline = false }) => {
  const sizeClasses = {
    small: 'loading-spinner',
    medium: 'loading-spinner loading-spinner-large',
    large: 'loading-spinner loading-spinner-large'
  };

  if (inline) {
    return (
      <div className="flex items-center gap-2">
        <div className="loading-spinner"></div>
        {text && (
          <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            {text}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="loading-container">
      <div className={sizeClasses[size]}></div>
      {text && (
        <p style={{ 
          color: '#6b7280', 
          fontSize: '0.875rem',
          textAlign: 'center',
          margin: 0,
          opacity: 0.8
        }}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
