import React, { useState, useRef } from 'react';

const FileUpload = ({ onFileContent, accept = '.txt,.md,.doc,.docx' }) => {
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const supportedFormats = ['TXT', 'MD', 'DOC', 'DOCX'];

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file) => {
    setError('');
    setProcessing(true);

    // File size check (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError('File size must be less than 10MB');
      setProcessing(false);
      return;
    }

    // File type check
    const allowedTypes = [
      'text/plain',
      'text/markdown',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    const fileExtension = file.name.split('.').pop().toLowerCase();
    const isValidExtension = ['txt', 'md', 'doc', 'docx'].includes(fileExtension);

    if (!allowedTypes.includes(file.type) && !isValidExtension) {
      setError('Please upload a valid text file (TXT, MD, DOC, DOCX)');
      setProcessing(false);
      return;
    }

    try {
      let content = '';

      if (file.type === 'text/plain' || fileExtension === 'txt' || fileExtension === 'md') {
        // Handle text files
        content = await readTextFile(file);
      } else if (fileExtension === 'doc' || fileExtension === 'docx') {
        // For Word documents, we'll need to handle them differently
        // For now, let's show an error message suggesting to save as text
        setError('Word documents are not fully supported yet. Please save your document as a .txt file and try again.');
        setProcessing(false);
        return;
      }

      if (content.trim()) {
        setUploadedFile({
          name: file.name,
          size: formatFileSize(file.size),
          content: content
        });
        
        // Pass the content to the parent component
        onFileContent(content);
      } else {
        setError('The file appears to be empty or could not be read.');
      }
    } catch (err) {
      console.error('Error reading file:', err);
      setError('Failed to read the file. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const readTextFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const removeFile = () => {
    setUploadedFile(null);
    setError('');
    onFileContent('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  if (uploadedFile) {
    return (
      <div className="file-upload-container">
        <div className="uploaded-file-info">
          <div className="uploaded-file-details">
            <div className="uploaded-file-icon">📄</div>
            <div>
              <div className="uploaded-file-name">{uploadedFile.name}</div>
              <div className="uploaded-file-size">{uploadedFile.size}</div>
            </div>
          </div>
          <div className="uploaded-file-actions">
            <button
              type="button"
              onClick={removeFile}
              className="file-remove-btn"
              title="Remove file"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (processing) {
    return (
      <div className="file-upload-container">
        <div className="file-processing">
          <div className="file-processing-spinner"></div>
          <span>Processing file...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="file-upload-container">
      {error && (
        <div className="file-error">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      <div
        className={`file-upload-area ${dragOver ? 'dragover' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="file-upload-input"
          accept={accept}
          onChange={handleFileSelect}
        />
        
        <div className="file-upload-content">
          <div className="file-upload-icon">📁</div>
          <div className="file-upload-text">
            Drop your transcript file here or click to browse
          </div>
          <div className="file-upload-hint">
            Upload meeting notes, call transcripts, or any text document
          </div>
          <div className="file-upload-formats">
            {supportedFormats.map((format) => (
              <span key={format} className="file-format-tag">
                {format}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
