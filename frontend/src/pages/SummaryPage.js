import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import TextareaAutosize from 'react-textarea-autosize';

import apiService from '../services/apiService';
import LoadingSpinner from '../components/LoadingSpinner';
import EmailInput from '../components/EmailInput';

const SummaryPage = () => {
  const { id } = useParams();
  
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedSummary, setEditedSummary] = useState('');
  const [saving, setSaving] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [recipientEmails, setRecipientEmails] = useState([]);
  const [shareHistory, setShareHistory] = useState(null);

  useEffect(() => {
    fetchSummary();
  }, [id]);

  useEffect(() => {
    if (summary) {
      fetchShareHistory();
    }
  }, [summary]);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const response = await apiService.getSummary(id);
      setSummary(response.data);
      setEditedSummary(response.data.editedSummary || response.data.generatedSummary);
    } catch (error) {
      console.error('Error fetching summary:', error);
      toast.error(error.message || 'Failed to load summary');
    } finally {
      setLoading(false);
    }
  };

  const fetchShareHistory = async () => {
    try {
      const response = await apiService.getShareHistory(id);
      setShareHistory(response.data);
    } catch (error) {
      console.error('Error fetching share history:', error);
      // Don't show error toast for share history as it's not critical
    }
  };

  const handleSaveEdit = async () => {
    if (!editedSummary.trim()) {
      toast.error('Summary cannot be empty');
      return;
    }

    try {
      setSaving(true);
      const response = await apiService.updateSummary(id, {
        editedSummary: editedSummary.trim()
      });
      
      setSummary(prev => ({
        ...prev,
        editedSummary: response.data.editedSummary,
        finalSummary: response.data.finalSummary,
        updatedAt: response.data.updatedAt
      }));
      
      setEditing(false);
      toast.success('Summary updated successfully!');
    } catch (error) {
      console.error('Error updating summary:', error);
      toast.error(error.message || 'Failed to update summary');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedSummary(summary.editedSummary || summary.generatedSummary);
    setEditing(false);
  };

  const handleShare = async () => {
    if (recipientEmails.length === 0) {
      toast.error('Please add at least one recipient email');
      return;
    }

    try {
      setSharing(true);
      const response = await apiService.shareSummary(id, recipientEmails);
      
      toast.success(`Summary shared successfully with ${response.data.recipients.length} recipient(s)!`);
      setShowShareModal(false);
      setRecipientEmails([]);
      
      // Refresh share history
      fetchShareHistory();
      
      // Update summary with sharing status
      setSummary(prev => ({
        ...prev,
        isShared: true
      }));
      
    } catch (error) {
      console.error('Error sharing summary:', error);
      toast.error(error.message || 'Failed to share summary');
    } finally {
      setSharing(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(summary.finalSummary);
      toast.success('Summary copied to clipboard!');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast.error('Failed to copy summary');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container text-center container-glass">
        <LoadingSpinner text="Loading summary..." size="large" />
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="container container-warning">
        <div className="alert alert-error">
          <span>❌</span>
          <div className="alert-content">
            <div className="alert-title">Summary Not Found</div>
            <p>The requested summary could not be found.</p>
            <Link to="/" className="btn btn-primary mt-2">
              ← Create New Summary
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="container container-glass">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              color: '#1d4ed8',
              marginBottom: '0.5rem',
              lineHeight: '1.2'
            }}>
              {summary.title}
            </h1>
            <div className="summary-meta">
              <span>📅 Created: {formatDate(summary.createdAt)}</span>
              {summary.updatedAt !== summary.createdAt && (
                <span>✏️ Updated: {formatDate(summary.updatedAt)}</span>
              )}
              {summary.isShared && (
                <span style={{ color: '#059669' }}>✅ Shared</span>
              )}
            </div>
          </div>
          
          <Link to="/" className="btn btn-secondary">
            ← Back
          </Link>
        </div>

        {/* Tags */}
        {summary.tags && summary.tags.length > 0 && (
          <div className="tags-container">
            {summary.tags.map((tag, index) => (
              <span key={index} className="tag">
                🏷️ {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Original Context (collapsible) */}
      <div className="container container-glass">
        <details style={{ cursor: 'pointer' }}>
          <summary style={{ 
            fontWeight: '600', 
            padding: '0.75rem 0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>📄</span>
            Original Text & Instructions
          </summary>
          <div className="mt-3">
            <div className="mb-4">
              <h4 style={{ fontWeight: '600', marginBottom: '0.75rem', color: '#1d4ed8' }}>
                🎯 Custom Instructions:
              </h4>
              <div style={{ 
                fontStyle: 'italic', 
                color: '#4b5563',
                background: 'rgba(59, 130, 246, 0.05)',
                padding: '1rem',
                borderRadius: '8px',
                borderLeft: '4px solid #3b82f6'
              }}>
                "{summary.customPrompt}"
              </div>
            </div>
            <div>
              <h4 style={{ fontWeight: '600', marginBottom: '0.75rem', color: '#1d4ed8' }}>
                📝 Original Text:
              </h4>
              <div style={{ 
                background: 'rgba(248, 250, 252, 0.8)', 
                padding: '1.5rem', 
                borderRadius: '12px',
                maxHeight: '300px',
                overflowY: 'auto',
                whiteSpace: 'pre-wrap',
                fontSize: '0.875rem',
                color: '#374151',
                lineHeight: '1.6',
                border: '1px solid rgba(191, 219, 254, 0.5)'
              }}>
                {summary.originalText}
              </div>
            </div>
          </div>
        </details>
      </div>

      {/* Summary Content */}
      <div className="container container-primary">
        <div className="flex items-center justify-between mb-4">
          <h3 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#1d4ed8'
          }}>
            <span>📝</span>
            AI Summary
            {summary.editedSummary && (
              <span style={{ 
                fontSize: '0.75rem', 
                color: '#059669', 
                background: 'rgba(16, 185, 129, 0.1)',
                padding: '0.25rem 0.5rem',
                borderRadius: '12px',
                fontWeight: '500'
              }}>
                Edited
              </span>
            )}
          </h3>
          
          <div className="summary-actions">
            <button
              onClick={copyToClipboard}
              className="btn btn-secondary btn-small"
            >
              📋 Copy
            </button>
            
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="btn btn-secondary btn-small"
              >
                ✏️ Edit
              </button>
            )}
            
            <button
              onClick={() => setShowShareModal(true)}
              className="btn btn-primary btn-small"
            >
              📧 Share
            </button>
          </div>
        </div>

        {editing ? (
          <div>
            <TextareaAutosize
              value={editedSummary}
              onChange={(e) => setEditedSummary(e.target.value)}
              className="form-textarea"
              minRows={10}
              maxRows={25}
              placeholder="Edit your summary..."
              maxLength={10000}
            />
            <div className={`char-count ${editedSummary.length > 9000 ? 'warning' : ''} ${editedSummary.length > 9500 ? 'danger' : ''}`}>
              {editedSummary.length.toLocaleString()}/10,000 characters
            </div>
            
            <div className="flex gap-2 justify-end mt-4">
              <button
                onClick={handleCancelEdit}
                className="btn btn-secondary"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="btn btn-success"
                disabled={saving || !editedSummary.trim()}
              >
                {saving ? (
                  <>
                    <div className="loading-spinner"></div>
                    Saving...
                  </>
                ) : (
                  '💾 Save Changes'
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="summary-display">
            <div className="summary-content">
              {summary.finalSummary}
            </div>
          </div>
        )}
      </div>

      {/* Share History */}
      {shareHistory && shareHistory.isShared && (
        <div className="container container-success">
          <h4 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>📧</span>
            Sharing History
          </h4>
          
          <div className="grid grid-3 gap-4 mb-4">
            <div className="text-center">
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e40af' }}>
                {shareHistory.totalShares}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Total Shares
              </div>
            </div>
            <div className="text-center">
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626' }}>
                {shareHistory.uniqueRecipients}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Unique Recipients
              </div>
            </div>
            <div className="text-center">
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1d4ed8' }}>
                {shareHistory.shareHistory.length}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Share Events
              </div>
            </div>
          </div>

          {shareHistory.shareHistory.length > 0 && (
            <details>
              <summary style={{ 
                cursor: 'pointer', 
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>👥</span>
                View Share Details
              </summary>
              <div className="mt-3 space-y-2">
                {shareHistory.shareHistory.map((share, index) => (
                  <div key={index} className="flex justify-between items-center py-2 px-3" style={{ 
                    fontSize: '0.875rem',
                    background: 'rgba(255, 255, 255, 0.5)',
                    borderRadius: '8px'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>📧</span>
                      {share.email}
                    </span>
                    <span style={{ color: '#6b7280' }}>
                      {formatDate(share.sharedAt)}
                    </span>
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>📧</span>
              Share Summary
            </h3>
            
            <div className="form-group">
              <label className="form-label">
                Recipient Email Addresses
              </label>
              <EmailInput
                emails={recipientEmails}
                setEmails={setRecipientEmails}
                placeholder="Enter email addresses to share this summary..."
              />
            </div>

            <div className="alert alert-info">
              <span>ℹ️</span>
              <div className="alert-content">
                The recipients will receive a beautifully formatted email with the complete summary.
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => {
                  setShowShareModal(false);
                  setRecipientEmails([]);
                }}
                className="btn btn-secondary"
                disabled={sharing}
              >
                Cancel
              </button>
              <button
                onClick={handleShare}
                className="btn btn-primary"
                disabled={sharing || recipientEmails.length === 0}
              >
                {sharing ? (
                  <>
                    <div className="loading-spinner"></div>
                    Sending...
                  </>
                ) : (
                  `📤 Send to ${recipientEmails.length} recipient${recipientEmails.length !== 1 ? 's' : ''}`
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryPage;
