import React, { useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import '../styles/ImageUpload.css';

const ImageUpload = ({ onImageUpload, imagePreview, onReset }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="image-upload-container">
      <h2 className="section-title">
        <Upload size={24} />
        Upload Image
      </h2>

      {!imagePreview ? (
        <div 
          className="upload-zone"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <ImageIcon size={48} className="upload-icon" />
          <h3>Drop your image here</h3>
          <p>or click to browse</p>
          <span className="upload-hint">Supports: JPG, PNG, GIF, WebP</span>
        </div>
      ) : (
        <div className="image-preview-container">
          <button className="remove-button" onClick={onReset}>
            <X size={20} />
          </button>
          <img src={imagePreview} alt="Preview" className="image-preview" />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
