import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Image as ImageIcon, LogOut, Sparkles, Send, X, FileText } from 'lucide-react';
import { analyzeContent } from '../services/aiService';
import '../styles/InputPage.css';

const InputPage = () => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text || !image) return;

    setIsAnalyzing(true);

    try {
      // Call ML backend API with Hugging Face Transformers + OpenCV
      const results = await analyzeContent(text, image);
      
      // Store results for the results page
      sessionStorage.setItem('analysisResults', JSON.stringify({
        ...results,
        originalText: text,
        originalImage: imagePreview
      }));
      
      navigate('/results');
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Please ensure the backend server is running.');
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="input-page">
      <nav className="navbar">
        <div className="nav-content">
          <div className="logo-section">
            <Sparkles size={32} />
            <h1>ContentAI</h1>
          </div>
          <button onClick={handleLogout} className="logout-button">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </nav>

      <div className="input-container">
        <div className="input-header">
          <h2>Create Content for Moderation</h2>
          <p>Upload an image and provide text to generate platform-specific captions</p>
        </div>

        <form onSubmit={handleSubmit} className="input-form">
          <div className="form-grid">
            {/* Text Input Section */}
            <div className="form-section">
              <label className="section-label">
                <FileText size={24} />
                <span>Content Text</span>
              </label>
              <div className="text-input-container">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter your content text here... This will be analyzed along with your image to generate platform-specific captions and moderation decisions."
                  className="text-input"
                  rows={12}
                  required
                />
                <div className="char-count">
                  {text.length} characters
                </div>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="form-section">
              <label className="section-label">
                <ImageIcon size={24} />
                <span>Upload Image</span>
              </label>
              
              {!imagePreview ? (
                <div 
                  className="image-upload-zone"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                  <Upload size={48} className="upload-icon-large" />
                  <h3>Drop your image here</h3>
                  <p>or click to browse</p>
                  <span className="file-types">JPG, PNG, GIF, WebP (Max 10MB)</span>
                </div>
              ) : (
                <div className="image-preview-box">
                  <button type="button" className="remove-image-btn" onClick={removeImage}>
                    <X size={20} />
                  </button>
                  <img src={imagePreview} alt="Preview" className="preview-image" />
                  <div className="image-info">
                    <span>✓ Image uploaded successfully</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="submit-section">
            <button 
              type="submit" 
              className="analyze-submit-button"
              disabled={!text || !image || isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <div className="spinner-small"></div>
                  Analyzing Content...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Generate & Analyze
                  <Send size={20} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputPage;
