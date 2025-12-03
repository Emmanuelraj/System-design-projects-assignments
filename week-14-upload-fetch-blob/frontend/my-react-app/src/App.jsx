import React, { useState, useEffect } from 'react';
import './App.css';  // Optional styles

function App() {
  const [postId, setPostId] = useState('123');
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);
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
        setFiles([]);
        fetchAttachments();
        alert('Upload done!');
      }
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleCardClick = (attachment) => {
    setSelectedFile(attachment);
  };

  const closeModal = () => {
    setSelectedFile(null);
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
        <button type="submit">Submit</button>
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
              <div style={{ height: '100px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                📄 PDF
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