import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import apiService from '../services/apiService';
import LoadingSpinner from '../components/LoadingSpinner';

const HistoryPage = () => {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [stats, setStats] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    summaryId: null,
    summaryTitle: '',
    deleting: false
  });

  useEffect(() => {
    fetchSummaries();
    fetchStats();
  }, [pagination.page]);

  const fetchSummaries = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllSummaries(pagination.page, pagination.limit);
      setSummaries(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.pagination.total,
        pages: response.pagination.pages
      }));
    } catch (error) {
      console.error('Error fetching summaries:', error);
      toast.error(error.message || 'Failed to load summaries');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiService.getShareStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Don't show error for stats as it's not critical
    }
  };

  const handleDelete = (id, title) => {
    setDeleteModal({
      show: true,
      summaryId: id,
      summaryTitle: title,
      deleting: false
    });
  };

  const handleDeleteConfirm = async () => {
    setDeleteModal(prev => ({ ...prev, deleting: true }));

    try {
      await apiService.deleteSummary(deleteModal.summaryId);
      toast.success('Summary deleted successfully');
      
      // Refresh the list
      fetchSummaries();
      fetchStats();
      
      // Close modal
      setDeleteModal({
        show: false,
        summaryId: null,
        summaryTitle: '',
        deleting: false
      });
    } catch (error) {
      console.error('Error deleting summary:', error);
      toast.error(error.message || 'Failed to delete summary');
      setDeleteModal(prev => ({ ...prev, deleting: false }));
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({
      show: false,
      summaryId: null,
      summaryTitle: '',
      deleting: false
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderPagination = () => {
    if (pagination.pages <= 1) return null;

    const pages = [];
    const currentPage = pagination.page;
    const totalPages = pagination.pages;

    // Always show first page
    pages.push(1);

    // Add pages around current page
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    if (start > 2) pages.push('...');
    
    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }

    if (end < totalPages - 1) pages.push('...');
    
    // Always show last page
    if (totalPages > 1) pages.push(totalPages);

    return (
      <div className="flex items-center justify-center gap-2 mt-4" style={{ flexWrap: 'wrap' }}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="btn btn-secondary btn-small"
          style={{ 
            minWidth: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.375rem'
          }}
        >
          <span className="mobile-hide">←</span>
          <span className="mobile-sm-hide"> Previous</span>
          <span className="mobile-show mobile-hide">Prev</span>
        </button>

        <div className="flex items-center gap-1" style={{ flexWrap: 'wrap' }}>
          {pages.map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} style={{ padding: '0 0.5rem', color: '#1e40af' }}>...</span>
            ) : (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`btn btn-small ${page === currentPage ? 'btn-primary' : 'btn-secondary'}`}
                style={{ 
                  minWidth: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {page}
              </button>
            )
          ))}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="btn btn-secondary btn-small"
          style={{ 
            minWidth: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.375rem'
          }}
        >
          <span className="mobile-sm-hide">Next </span>
          <span className="mobile-show mobile-hide">Next</span>
          <span className="mobile-hide">→</span>
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="container container-glass">
        <div className="flex items-center justify-between mb-4 mobile-stack">
          <div className="mobile-center">
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              color: '#1d4ed8',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <span>📚</span>
              Summary History
            </h1>
            <p style={{ color: '#4b5563', fontSize: '1.125rem' }}>
              View and manage your AI-generated summaries
            </p>
          </div>
          
          <Link to="/" className="btn btn-primary mobile-full-width">
            <span>📝</span>
            <span>New Summary</span>
          </Link>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="container container-primary">
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>📊</span>
            Statistics
          </h3>
          
          <div className="grid grid-3 gap-6">
            <div className="text-center">
              <div style={{ 
                fontSize: '2.5rem', 
                fontWeight: 'bold', 
                color: '#1e40af',
                marginBottom: '0.5rem'
              }}>
                {stats.totalSummaries}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Total Summaries
              </div>
            </div>
            
            <div className="text-center">
              <div style={{ 
                fontSize: '2.5rem', 
                fontWeight: 'bold', 
                color: '#dc2626',
                marginBottom: '0.5rem'
              }}>
                {stats.shareRate}%
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Share Rate
              </div>
            </div>
            
            <div className="text-center">
              <div style={{ 
                fontSize: '2.5rem', 
                fontWeight: 'bold', 
                color: '#1d4ed8',
                marginBottom: '0.5rem'
              }}>
                {stats.uniqueRecipients}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Unique Recipients
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summaries List */}
      {loading ? (
        <div className="container text-center container-glass">
          <LoadingSpinner text="Loading summaries..." size="large" />
        </div>
      ) : summaries.length === 0 ? (
        <div className="container text-center container-glass">
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.7 }}>📝</div>
          <h3 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            marginBottom: '0.75rem',
            color: '#1d4ed8'
          }}>
            No summaries yet
          </h3>
          <p style={{ 
            color: '#4b5563', 
            marginBottom: '2rem',
            fontSize: '1.125rem'
          }}>
            Create your first AI-powered summary to get started
          </p>
          <Link to="/" className="btn btn-primary btn-large">
            🚀 Create First Summary
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            {summaries.map((summary) => (
              <div key={summary._id} className="summary-card">
                <div className="flex items-start justify-between mobile-stack">
                  <div className="flex-1">
                    <Link 
                      to={`/summary/${summary._id}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <h3 style={{ 
                        fontSize: '1.25rem', 
                        fontWeight: '600', 
                        marginBottom: '0.75rem',
                        color: '#1d4ed8',
                        transition: 'color 0.2s ease',
                        lineHeight: '1.4'
                      }}
                      onMouseEnter={(e) => e.target.style.color = '#3b82f6'}
                      onMouseLeave={(e) => e.target.style.color = '#1d4ed8'}
                      >
                        {summary.title}
                      </h3>
                    </Link>
                    
                    <div className="flex flex-wrap items-center gap-4 mb-3 mobile-stack" style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <span>📅</span>
                        {formatDate(summary.createdAt)}
                      </span>
                      {summary.updatedAt !== summary.createdAt && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                          <span>✏️</span>
                          <span className="mobile-hide">Updated </span>
                          {formatDate(summary.updatedAt)}
                        </span>
                      )}
                      {summary.isShared && (
                        <span style={{ 
                          color: '#059669',
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.375rem'
                        }}>
                          <span>📧</span>
                          Shared
                        </span>
                      )}
                    </div>

                    {summary.tags && summary.tags.length > 0 && (
                      <div className="tags-container">
                        {summary.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="tag">
                            🏷️ {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mobile-full-width" style={{ marginLeft: '1rem' }}>
                    <Link 
                      to={`/summary/${summary._id}`}
                      className="btn btn-secondary btn-small mobile-full-width"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                      <span style={{ fontSize: '1.125rem' }}>👁️</span>
                      <span className="btn-text">View</span>
                    </Link>
                    
                    <button
                      onClick={() => handleDelete(summary._id, summary.title)}
                      className="btn btn-danger btn-small mobile-full-width"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                      <span style={{ fontSize: '1.125rem' }}>🗑️</span>
                      <span className="btn-text">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {renderPagination()}

          {/* Summary info */}
          <div className="text-center mt-6" style={{ color: '#6b7280', fontSize: '0.875rem', padding: '0 1rem' }}>
            <div className="mobile-sm-text-sm">
              Showing {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} summaries
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="modal-overlay" onClick={handleDeleteCancel}>
          <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon">
                🗑️
              </div>
              <h3 className="modal-title">Delete Summary</h3>
            </div>
            
            <div className="modal-body">
              <p style={{ color: '#374151', fontSize: '1rem', marginBottom: '1rem' }}>
                Are you sure you want to delete this summary? This action cannot be undone.
              </p>
              
              <div className="summary-title">
                {deleteModal.summaryTitle}
              </div>
              
              <p className="warning-text">
                Once deleted, this summary and all its associated data will be permanently removed from your account.
              </p>
            </div>
            
            <div className="modal-actions">
              <button
                onClick={handleDeleteCancel}
                className="btn btn-cancel"
                disabled={deleteModal.deleting}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <span>✕</span>
                <span>Cancel</span>
              </button>
              
              <button
                onClick={handleDeleteConfirm}
                className="btn btn-delete"
                disabled={deleteModal.deleting}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                {deleteModal.deleting ? (
                  <>
                    <div className="loading-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <span>🗑️</span>
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
