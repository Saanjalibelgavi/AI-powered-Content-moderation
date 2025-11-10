import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Instagram, Facebook, Linkedin, Copy, Check, Sparkles, Shield, TrendingUp, Hash } from 'lucide-react';
import '../styles/ResultsPage.css';

const ResultsPage = () => {
  const [inputData, setInputData] = useState(null);
  const [results, setResults] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [selectedHashtags, setSelectedHashtags] = useState({
    instagram: [],
    facebook: [],
    linkedin: []
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Get analysis results from session storage
    const data = sessionStorage.getItem('analysisResults');
    if (!data) {
      navigate('/input');
      return;
    }

    const analysisResults = JSON.parse(data);
    
    // Set input data for display
    setInputData({
      text: analysisResults.originalText,
      imagePreview: analysisResults.originalImage
    });

    // Transform backend results to match component structure
    const transformedResults = {
      decision: {
        approved: analysisResults.decision === 'approved',
        confidence: (analysisResults.confidence * 100).toFixed(1),
        reason: analysisResults.decision === 'approved'
          ? "Content analyzed by AI models (Transformers + OpenCV) - Safe for posting"
          : "Content contains potentially sensitive material detected by ML models"
      },
      captions: analysisResults.captions,
      hashtags: analysisResults.hashtags,
      insights: {
        sentiment: analysisResults.insights.sentiment,
        engagementScore: analysisResults.insights.engagement_score,
        toxicityLevel: analysisResults.insights.toxicity_level,
        readability: analysisResults.insights.readability,
        visualAppeal: analysisResults.insights.visual_appeal,
        authenticity: analysisResults.insights.authenticity,
        bestTimeToPost: analysisResults.insights.best_time_to_post,
        engagementPrediction: analysisResults.insights.engagement_prediction
      },
      mlAnalysis: {
        textAnalysis: analysisResults.text_analysis,
        imageAnalysis: analysisResults.image_analysis
      }
    };

    setResults(transformedResults);
  }, [navigate]);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleHashtagToggle = (platform, hashtag) => {
    setSelectedHashtags(prev => {
      const platformHashtags = prev[platform];
      if (platformHashtags.includes(hashtag)) {
        return {
          ...prev,
          [platform]: platformHashtags.filter(h => h !== hashtag)
        };
      } else {
        return {
          ...prev,
          [platform]: [...platformHashtags, hashtag]
        };
      }
    });
  };

  const copyWithHashtags = (caption, platform, captionIndex) => {
    const hashtags = results.hashtags[platform][captionIndex];
    const selectedTags = selectedHashtags[platform].length > 0 
      ? selectedHashtags[platform] 
      : hashtags;
    const fullText = `${caption}\n\n${selectedTags.join(' ')}`;
    navigator.clipboard.writeText(fullText);
    setCopiedId(`${platform}-${captionIndex}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleNewAnalysis = () => {
    sessionStorage.removeItem('inputData');
    navigate('/input');
  };

  if (!inputData || !results) {
    return (
      <div className="loading-screen">
        <div className="spinner-large"></div>
        <p>Loading results...</p>
      </div>
    );
  }

  return (
    <div className="results-page">
      <nav className="navbar">
        <div className="nav-content">
          <button onClick={handleNewAnalysis} className="back-button">
            <ArrowLeft size={20} />
            New Analysis
          </button>
          <div className="logo-section">
            <Sparkles size={32} />
            <h1>ContentAI Results</h1>
          </div>
        </div>
      </nav>

      <div className="results-container">
        {/* Decision Banner */}
        <div className={`decision-banner ${results.decision.approved ? 'approved' : 'rejected'}`}>
          <div className="decision-icon">
            {results.decision.approved ? (
              <CheckCircle size={64} />
            ) : (
              <XCircle size={64} />
            )}
          </div>
          <div className="decision-content">
            <h2>{results.decision.approved ? 'Content Approved' : 'Content Flagged'}</h2>
            <p>{results.decision.reason}</p>
            <div className="confidence-badge">
              <Shield size={20} />
              Confidence: {results.decision.confidence}%
            </div>
          </div>
        </div>

        {/* Original Content */}
        <div className="original-content-section">
          <h3>Your Content</h3>
          <div className="content-grid">
            <div className="content-text-display">
              <p>{inputData.text}</p>
            </div>
            <div className="content-image-display">
              <img src={inputData.imagePreview} alt="Uploaded content" />
            </div>
          </div>
        </div>

        {/* Insights Section */}
        <div className="insights-section">
          <h3>
            <TrendingUp size={24} />
            Content Insights
          </h3>
          <div className="insights-grid">
            <div className="insight-card">
              <span className="insight-label">Sentiment</span>
              <span className="insight-value">{results.insights.sentiment}</span>
            </div>
            <div className="insight-card">
              <span className="insight-label">Best Time to Post</span>
              <span className="insight-value">{results.insights.bestTimeToPost}</span>
            </div>
            <div className="insight-card">
              <span className="insight-label">Engagement</span>
              <span className="insight-value">{results.insights.engagementPrediction}</span>
            </div>
          </div>
        </div>

        {/* Platform Captions */}
        <div className="captions-section">
          <h3>Platform-Specific Captions</h3>
          
          {/* Instagram */}
          <div className="platform-block instagram slide-in" style={{ animationDelay: '0.1s' }}>
            <div className="platform-header">
              <Instagram size={32} />
              <h4>Instagram</h4>
            </div>
            <div className="captions-list">
              {results.captions.instagram.map((caption, index) => (
                <div key={`ig-${index}`} className="caption-card pop-in" style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
                  <div className="caption-content">
                    <p className="caption-text">{caption}</p>
                    <div className="hashtag-section">
                      <div className="hashtag-label">
                        <Hash size={16} />
                        <span>Suggested Hashtags:</span>
                      </div>
                      <div className="hashtag-pills">
                        {results.hashtags.instagram[index].map((tag, tagIndex) => (
                          <button
                            key={`ig-tag-${index}-${tagIndex}`}
                            className={`hashtag-pill ${selectedHashtags.instagram.includes(tag) ? 'selected' : ''}`}
                            onClick={() => handleHashtagToggle('instagram', tag)}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button 
                    className="copy-btn instagram-btn"
                    onClick={() => copyWithHashtags(caption, 'instagram', index)}
                  >
                    {copiedId === `instagram-${index}` ? (
                      <>
                        <Check size={16} />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Facebook */}
          <div className="platform-block facebook slide-in" style={{ animationDelay: '0.4s' }}>
            <div className="platform-header">
              <Facebook size={32} />
              <h4>Facebook</h4>
            </div>
            <div className="captions-list">
              {results.captions.facebook.map((caption, index) => (
                <div key={`fb-${index}`} className="caption-card pop-in" style={{ animationDelay: `${0.5 + index * 0.1}s` }}>
                  <div className="caption-content">
                    <p className="caption-text">{caption}</p>
                    <div className="hashtag-section">
                      <div className="hashtag-label">
                        <Hash size={16} />
                        <span>Suggested Hashtags:</span>
                      </div>
                      <div className="hashtag-pills">
                        {results.hashtags.facebook[index].map((tag, tagIndex) => (
                          <button
                            key={`fb-tag-${index}-${tagIndex}`}
                            className={`hashtag-pill ${selectedHashtags.facebook.includes(tag) ? 'selected' : ''}`}
                            onClick={() => handleHashtagToggle('facebook', tag)}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button 
                    className="copy-btn facebook-btn"
                    onClick={() => copyWithHashtags(caption, 'facebook', index)}
                  >
                    {copiedId === `facebook-${index}` ? (
                      <>
                        <Check size={16} />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* LinkedIn */}
          <div className="platform-block linkedin slide-in" style={{ animationDelay: '0.7s' }}>
            <div className="platform-header">
              <Linkedin size={32} />
              <h4>LinkedIn</h4>
            </div>
            <div className="captions-list">
              {results.captions.linkedin.map((caption, index) => (
                <div key={`li-${index}`} className="caption-card pop-in" style={{ animationDelay: `${0.8 + index * 0.1}s` }}>
                  <div className="caption-content">
                    <p className="caption-text">{caption}</p>
                    <div className="hashtag-section">
                      <div className="hashtag-label">
                        <Hash size={16} />
                        <span>Suggested Hashtags:</span>
                      </div>
                      <div className="hashtag-pills">
                        {results.hashtags.linkedin[index].map((tag, tagIndex) => (
                          <button
                            key={`li-tag-${index}-${tagIndex}`}
                            className={`hashtag-pill ${selectedHashtags.linkedin.includes(tag) ? 'selected' : ''}`}
                            onClick={() => handleHashtagToggle('linkedin', tag)}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button 
                    className="copy-btn linkedin-btn"
                    onClick={() => copyWithHashtags(caption, 'linkedin', index)}
                  >
                    {copiedId === `linkedin-${index}` ? (
                      <>
                        <Check size={16} />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="actions-footer">
          <button onClick={handleNewAnalysis} className="new-analysis-btn">
            <Sparkles size={20} />
            Analyze New Content
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
