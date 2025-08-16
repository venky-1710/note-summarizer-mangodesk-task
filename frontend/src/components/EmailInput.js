import React, { useState, useRef } from 'react';

const EmailInput = ({ emails, setEmails, placeholder = "Enter email addresses..." }) => {
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');
  const inputRef = useRef(null);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const addEmail = (email) => {
    const trimmedEmail = email.trim().toLowerCase();
    
    if (!trimmedEmail) return;
    
    if (!validateEmail(trimmedEmail)) {
      setInputError('Please enter a valid email address');
      return;
    }
    
    if (emails.includes(trimmedEmail)) {
      setInputError('This email is already added');
      return;
    }
    
    setEmails([...emails, trimmedEmail]);
    setInputValue('');
    setInputError('');
  };

  const removeEmail = (emailToRemove) => {
    setEmails(emails.filter(email => email !== emailToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === ';') {
      e.preventDefault();
      addEmail(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && emails.length > 0) {
      removeEmail(emails[emails.length - 1]);
    }
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      addEmail(inputValue);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const emailList = pastedText.split(/[,;\s\n]+/).filter(email => email.trim());
    
    emailList.forEach(email => {
      const trimmedEmail = email.trim().toLowerCase();
      if (validateEmail(trimmedEmail) && !emails.includes(trimmedEmail)) {
        setEmails(prev => [...prev, trimmedEmail]);
      }
    });
    
    setInputValue('');
    setInputError('');
  };

  return (
    <div className="email-input-container">
      <div className="email-tags">
        {emails.map((email, index) => (
          <div key={index} className="email-tag">
            <span>📧</span>
            <span>{email}</span>
            <button
              type="button"
              onClick={() => removeEmail(email)}
              aria-label={`Remove ${email}`}
              className="tag-remove"
            >
              ×
            </button>
          </div>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setInputError('');
          }}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onPaste={handlePaste}
          placeholder={emails.length === 0 ? placeholder : ''}
          className="email-input-field"
        />
      </div>
      
      {inputError && (
        <div className="alert alert-error">
          <span>⚠️</span>
          <div className="alert-content">
            {inputError}
          </div>
        </div>
      )}
      
      <div className="char-count" style={{ marginTop: '0.5rem' }}>
        💡 Tip: Separate emails with comma, semicolon, or press Enter. You can also paste multiple emails.
      </div>
    </div>
  );
};

export default EmailInput;
