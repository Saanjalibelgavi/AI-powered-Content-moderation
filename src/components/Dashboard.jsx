import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Sparkles, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import ImageUpload from './ImageUpload';
import ContentSuggestions from './ContentSuggestions';
import ModerationResult from './ModerationResult';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [contentSuggestions, setContentSuggestions] = useState(null);
  const [moderationResult, setModerationResult] = useState(null);

  const handleImageUpload = (file) => {
    setUploadedImage(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Reset previous results
    setContentSuggestions(null);
    setModerationResult(null);
  };

  const handleAnalyzeContent = async () => {
    if (!uploadedImage) return;

    setIsAnalyzing(true);

    // Simulate AI analysis (replace with actual API call)
    setTimeout(() => {
      // Mock moderation result
      const mockModeration = {
        isApproved: Math.random() > 0.3,
        confidence: (Math.random() * 30 + 70).toFixed(1),
        flags: {
          inappropriate: Math.random() > 0.8,
          violence: Math.random() > 0.9,
          spam: Math.random() > 0.85,
          adult: Math.random() > 0.9
        },
        categories: ['General', 'Social Media Safe']
      };

      // Mock content suggestions
      const mockSuggestions = {
        captions: [
          "✨ Capturing moments that matter! What's your favorite memory from today?",
          "🌟 Living my best life, one photo at a time! #blessed",
          "💫 Sometimes the simplest moments are the most beautiful.",
          "📸 Making memories and loving every second of it!"
        ],
        hashtags: [
          "#photography #instagood #photooftheday #picoftheday",
          "#lifestyle #dailyinspiration #moments #memories",
          "#aesthetic #vibes #content #creative"
        ],
        tones: ['Inspirational', 'Casual', 'Professional', 'Fun']
      };

      setModerationResult(mockModeration);
      setContentSuggestions(mockSuggestions);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleReset = () => {
    setUploadedImage(null);
    setImagePreview(null);
    setContentSuggestions(null);
    setModerationResult(null);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo">
            <Sparkles size={32} />
            <h1>AI Content Moderation</h1>
          </div>
          <p className="subtitle">Upload images and get AI-powered content suggestions for social media</p>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-grid">
          {/* Upload Section */}
          <div className="dashboard-section upload-section">
            <ImageUpload 
              onImageUpload={handleImageUpload}
              imagePreview={imagePreview}
              onReset={handleReset}
            />
            
            {imagePreview && (
              <button 
                className="analyze-button"
                onClick={handleAnalyzeContent}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <div className="spinner"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Analyze & Generate Content
                  </>
                )}
              </button>
            )}
          </div>

          {/* Results Section */}
          <div className="dashboard-section results-section">
            {moderationResult && (
              <ModerationResult result={moderationResult} />
            )}

            {contentSuggestions && moderationResult?.isApproved && (
              <ContentSuggestions suggestions={contentSuggestions} />
            )}

            {!imagePreview && !isAnalyzing && (
              <div className="empty-state">
                <ImageIcon size={64} className="empty-icon" />
                <h3>No Image Selected</h3>
                <p>Upload an image to get started with AI-powered content moderation and suggestions</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
