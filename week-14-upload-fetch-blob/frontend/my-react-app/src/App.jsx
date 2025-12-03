import React, { useState, useEffect } from 'react';
import './App.css';  // Optional styles

function App() {
  const [postId, setPostId] = useState('123');
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);  // Array of selected File objects
  const [attachments, setAttachments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchAttachments();
  }, [postId]);

  const fetchAttachments = async () => {
    try {
      const res = await fetch(`/api/challenges/${postId}`);
      const data = await res.json();
      setAttachments(data.attachments || []);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('postId', postId);
    formData.append('message', message);
    files.forEach(file => formData.append('files', file));

    try {
      const res = await fetch('/api/challenges', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setMessage('');
        setFiles([]);  // Clear selected
        fetchAttachments();
        alert('Upload done!');
      }
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles(prevFiles => [...prevFiles, ...newFiles]);  // Append to existing (allows multiple selects)
  };

  const removeFile = (indexToRemove) => {
    setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  const clearAllFiles = () => {
    setFiles([]);
  };

  const handleCardClick = (attachment) => {
    setSelectedFile(attachment);
  };

  const closeModal = () => {
    setSelectedFile(null);
  };

  // Helper: Get icon for file preview
  const getFileIcon = (file) => {
    const type = file.type;
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('video/')) return '🎥';
    if (type === 'application/pdf') return '📄';
    if (type.includes('spreadsheet')) return '📊';  // XLSX
    if (type.includes('word')) return '📝';  // DOCX
    return '📎';  // Generic
  };

  // Helper: Format file size
  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Upload & View Files (All Types)</h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Post ID (e.g., 123)" 
          value={postId} 
          onChange={(e) => setPostId(e.target.value)} 
          required 
        />
        <textarea 
          placeholder="Your message (optional)" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
        />
        <input 
          type="file" 
          multiple 
          accept=""  // All MIME types
          onChange={handleFileChange} 
        />
        {files.length > 0 && (
          <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '4px', maxHeight: '150px', overflowY: 'auto' }}>
            <h4>Selected Files ({files.length})</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {files.map((file, index) => (
                <li key={index} style={{ display: 'flex', alignItems: 'center', background: '#f8f9fa', padding: '5px', borderRadius: '4px', fontSize: '12px' }}>
                  {getFileIcon(file)} {file.name} ({formatSize(file.size)})
                  <button 
                    type="button" 
                    onClick={() => removeFile(index)} 
                    style={{ marginLeft: '5px', background: '#dc3545', color: 'white', border: 'none', padding: '2px 6px', borderRadius: '2px', cursor: 'pointer', fontSize: '10px' }}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <button 
              type="button" 
              onClick={clearAllFiles} 
              style={{ marginTop: '5px', background: '#6c757d', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
            >
              Clear All
            </button>
          </div>
        )}
        <button type="submit" disabled={files.length > 50}>Submit</button>  {/* Optional: Limit to 50 */}
      </form>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {attachments.map((att, i) => (
          <div 
            key={i} 
            onClick={() => handleCardClick(att)} 
            style={{ 
              width: '150px', 
              border: '1px solid #ccc', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              overflow: 'hidden' 
            }}
          >
            {att.type.startsWith('image/') && (
              <img src={att.url} alt={att.name} style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
            )}
            {att.type.startsWith('video/') && (
              <video src={att.url} style={{ width: '100%', height: '100px' }} muted preload="metadata" />
            )}
            {att.type === 'application/pdf' && (
              <div style={{ height: '100px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>
                📄
              </div>
            )}
            {/* Fallback for all other MIME types */}
            {!(att.type.startsWith('image/') || att.type.startsWith('video/') || att.type === 'application/pdf') && (
              <div style={{ height: '100px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>
                📎
              </div>
            )}
            <p style={{ margin: '5px', fontSize: '12px', textAlign: 'center' }}>{att.name}</p>
          </div>
        ))}
      </div>

      {selectedFile && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 
        }}>
          <button onClick={closeModal} style={{ position: 'absolute', top: '10px', right: '10px', color: 'white' }}>Close</button>
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', maxWidth: '80%', maxHeight: '80vh', overflow: 'auto' }}>
            {selectedFile.type.startsWith('image/') && (
              <img src={selectedFile.url} alt={selectedFile.name} style={{ maxWidth: '100%', maxHeight: '80vh' }} />
            )}
            {selectedFile.type.startsWith('video/') && (
              <video src={selectedFile.url} controls style={{ maxWidth: '100%', maxHeight: '80vh' }} />
            )}
            {selectedFile.type === 'application/pdf' && (
              <a href={selectedFile.url} target="_blank" rel="noopener noreferrer">Open PDF</a>
            )}
            {/* Download for all other MIME types */}
            {!(selectedFile.type.startsWith('image/') || selectedFile.type.startsWith('video/') || selectedFile.type === 'application/pdf') && (
              <a 
                href={selectedFile.url} 
                download={selectedFile.name} 
                style={{ display: 'block', textAlign: 'center', padding: '20px', color: '#007bff', fontSize: '18px' }}
              >
                📎 Download {selectedFile.name}
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;