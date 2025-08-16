import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import TextareaAutosize from 'react-textarea-autosize';

import apiService from '../services/apiService';
import LoadingSpinner from '../components/LoadingSpinner';
import FileUpload from '../components/FileUpload';

const HomePage = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    originalText: '',
    customPrompt: '',
    title: '',
    tags: []
  });
  
  const [newTag, setNewTag] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [serverStatus, setServerStatus] = useState({ connected: false, checking: true });

  // Common prompts for quick selection
  const commonPrompts = [
    "Summarize in bullet points for executives",
    "Highlight only action items and next steps",
    "Create a detailed meeting summary with key decisions",
    "Extract key topics and main discussion points",
    "Focus on deadlines and deliverables mentioned",
    "Summarize technical discussions and requirements",
    "Create a brief overview for team members who missed the meeting"
  ];

  useEffect(() => {
    checkServerConnection();
  }, []);

  const checkServerConnection = async () => {
    try {
      await apiService.healthCheck();
      setServerStatus({ connected: true, checking: false });
    } catch (error) {
      setServerStatus({ connected: false, checking: false });
      toast.error('Unable to connect to server. Please check if the backend is running.');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const selectCommonPrompt = (prompt) => {
    setFormData(prev => ({
      ...prev,
      customPrompt: prompt
    }));
  };

  const handleFileContent = (content) => {
    setFormData(prev => ({
      ...prev,
      originalText: content
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.originalText.trim()) {
      toast.error('Please enter the meeting transcript or notes');
      return;
    }
    
    if (!formData.customPrompt.trim()) {
      toast.error('Please enter a custom prompt or select one from the examples');
      return;
    }
    
    if (!formData.title.trim()) {
      toast.error('Please enter a title for this summary');
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await apiService.generateSummary({
        originalText: formData.originalText.trim(),
        customPrompt: formData.customPrompt.trim(),
        title: formData.title.trim(),
        tags: formData.tags
      });

      toast.success('Summary generated successfully!');
      navigate(`/summary/${response.data.id}`);
      
    } catch (error) {
      console.error('Error generating summary:', error);
      toast.error(error.message || 'Failed to generate summary');
    } finally {
      setIsGenerating(false);
    }
  };

  const loadSampleData = () => {
    const sampleData = {
      title: 'Weekly Team Standup - Product Development',
      originalText: `Team Standup Meeting - March 15, 2024

Attendees: John (PM), Sarah (Dev Lead), Mike (Backend), Lisa (Frontend), Tom (QA)

Updates:
- John: Product roadmap review completed. New feature requests from client need prioritization by Friday.
- Sarah: Architecture review for user authentication system finished. Implementation can start Monday.
- Mike: API endpoints for user management 80% complete. Will finish by Wednesday.
- Lisa: Dashboard UI components completed. Working on responsive design this week.
- Tom: Test cases for login flow written. Automation scripts need 2 more days.

Blockers:
- Mike: Waiting for database schema approval from architecture team
- Lisa: Need final designs from UX team for mobile layout

Action Items:
- John will prioritize new feature requests by end of week
- Sarah will review Mike's API documentation by Tuesday
- Lisa will coordinate with UX team for mobile designs
- Tom will start testing Mike's completed endpoints
- Next meeting scheduled for Monday 9 AM

Decision Made: Deploy to staging environment this Friday for client demo`,
      customPrompt: 'Summarize in bullet points for executives, focusing on progress, blockers, and key decisions',
      tags: ['standup', 'product-development', 'weekly-meeting']
    };

    setFormData(sampleData);
    toast.info('Sample data loaded! You can modify it or generate the summary directly.');
  };

  if (serverStatus.checking) {
    return (
      <div className="container text-center container-glass">
        <LoadingSpinner text="Connecting to server..." size="large" />
      </div>
    );
  }

  if (!serverStatus.connected) {
    return (
      <div className="container container-warning">
        <div className="alert alert-error">
          <span>❌</span>
          <div className="alert-content">
            <div className="alert-title">Server Connection Failed</div>
            <p>Unable to connect to the backend server. Please ensure the server is running on port 5000.</p>
            <button 
              onClick={checkServerConnection}
              className="btn btn-secondary btn-small mt-2"
            >
              🔄 Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container container-glass">
      {/* Hero Section */}
      <div className="text-center mb-4" style={{ 
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(29, 78, 216, 0.1) 100%)',
        padding: '2rem',
        borderRadius: '16px',
        marginBottom: '2rem'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖✨</div>
        <h2 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          color: '#1d4ed8', 
          marginBottom: '1rem',
          lineHeight: '1.2'
        }}>
          AI-Powered Meeting Notes Summarizer
        </h2>
        <p style={{ 
          color: '#4b5563', 
          fontSize: '1.25rem',
          maxWidth: '600px',
          margin: '0 auto 1.5rem'
        }}>
          Transform your meeting transcripts into structured, actionable summaries with the power of AI
        </p>
        
        <button
          onClick={loadSampleData}
          className="btn btn-secondary"
        >
          📋 Load Sample Data
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Title */}
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            📝 Summary Title
          </label>
          <input
            id="title"
            type="text"
            className="form-input"
            placeholder="e.g., Weekly Team Standup, Client Meeting, Project Review..."
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            maxLength={200}
          />
          <div className={`char-count ${formData.title.length > 180 ? 'warning' : ''} ${formData.title.length > 195 ? 'danger' : ''}`}>
            {formData.title.length}/200
          </div>
        </div>

        {/* Original Text */}
        <div className="form-group">
          <label htmlFor="originalText" className="form-label">
            📄 Meeting Transcript / Notes
          </label>
          
          {/* File Upload Component */}
          <FileUpload onFileContent={handleFileContent} />
          
          {/* Divider */}
          <div className="file-upload-divider">
            <span>Or type/paste your text below</span>
          </div>
          
          <TextareaAutosize
            id="originalText"
            className="form-textarea large"
            placeholder="Paste your meeting transcript, call notes, or any text you want to summarize..."
            value={formData.originalText}
            onChange={(e) => handleInputChange('originalText', e.target.value)}
            minRows={8}
            maxRows={20}
            maxLength={50000}
          />
          <div className={`char-count ${formData.originalText.length > 45000 ? 'warning' : ''} ${formData.originalText.length > 48000 ? 'danger' : ''}`}>
            {formData.originalText.length.toLocaleString()}/50,000 characters
          </div>
        </div>

        {/* Custom Prompt */}
        <div className="form-group">
          <label htmlFor="customPrompt" className="form-label">
            🎯 Custom Instructions
          </label>
          
          {/* Common Prompts */}
          <div className="mb-4">
            <div className="form-hint">
              💡 Quick select common instructions:
            </div>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '0.5rem',
              marginTop: '0.75rem'
            }}>
              {commonPrompts.map((prompt, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => selectCommonPrompt(prompt)}
                  className="btn btn-secondary btn-small"
                  style={{ 
                    fontSize: '0.75rem',
                    background: formData.customPrompt === prompt ? 'rgba(255, 147, 51, 0.1)' : undefined,
                    borderColor: formData.customPrompt === prompt ? 'rgba(255, 147, 51, 0.3)' : undefined,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <TextareaAutosize
            id="customPrompt"
            className="form-textarea"
            placeholder="Describe how you want the AI to summarize your text..."
            value={formData.customPrompt}
            onChange={(e) => handleInputChange('customPrompt', e.target.value)}
            minRows={3}
            maxRows={8}
            maxLength={1000}
          />
          <div className={`char-count ${formData.customPrompt.length > 900 ? 'warning' : ''} ${formData.customPrompt.length > 950 ? 'danger' : ''}`}>
            {formData.customPrompt.length}/1,000 characters
          </div>
        </div>

        {/* Tags */}
        <div className="form-group">
          <label htmlFor="newTag" className="form-label">
            🏷️ Tags (Optional)
          </label>
          
          <div className="form-row">
            <input
              id="newTag"
              type="text"
              className="form-input"
              placeholder="Add tags to organize your summaries..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleTagKeyPress}
              maxLength={50}
            />
            <button
              type="button"
              onClick={addTag}
              className="btn btn-secondary"
              disabled={!newTag.trim()}
              style={{ height: '58px' }}
            >
              ➕ Add
            </button>
          </div>
          
          {formData.tags.length > 0 && (
            <div className="tags-container" style={{ marginTop: '1rem' }}>
              {formData.tags.map((tag, index) => (
                <span key={index} className="tag">
                  🏷️ {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="tag-remove"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="form-group text-center">
          <button
            type="submit"
            disabled={isGenerating || !formData.originalText.trim() || !formData.customPrompt.trim() || !formData.title.trim()}
            className="btn btn-primary btn-large"
            style={{ 
              minWidth: '300px',
              maxWidth: '400px',
              width: '100%'
            }}
          >
            {isGenerating ? (
              <>
                <div className="loading-spinner"></div>
                Generating Summary...
              </>
            ) : (
              <>
                🚀 Generate AI Summary
              </>
            )}
          </button>
          
          {isGenerating && (
            <div className="form-hint" style={{ justifyContent: 'center', marginTop: '1rem' }}>
              ⏳ This may take 10-30 seconds depending on the text length...
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default HomePage;
