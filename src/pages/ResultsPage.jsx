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
    console.log('Session data:', data);
    if (!data) {
      console.log('No data found, navigating to input');
      navigate('/input');
      return;
    }

    const analysisResults = JSON.parse(data);
    console.log('Analysis results:', analysisResults);
    
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
      captions: analysisResults.captions || [],
      hashtags: analysisResults.hashtags || [],
      bestTimeSchedule: analysisResults.best_time_schedule,
      platform: analysisResults.platform || 'instagram',
      insights: {
        sentiment: analysisResults.insights.sentiment
      },
      mlAnalysis: {
        textAnalysis: analysisResults.text_analysis,
        imageAnalysis: analysisResults.image_analysis
      }
    };

    console.log('Transformed results:', transformedResults);
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
          <div className="insights-grid-two">
            <div className="insight-card-large">
              <span className="insight-label">Sentiment</span>
              <span className="insight-value">{results.insights?.sentiment || 'POSITIVE'}</span>
            </div>
            <div className="insight-card-large">
              <span className="insight-label">Best Time to Post on Instagram</span>
              <div className="schedule-table">
                {results.bestTimeSchedule ? Object.entries(results.bestTimeSchedule).map(([day, time]) => (
                  <div key={day} className="schedule-row">
                    <span className="schedule-day">{day}</span>
                    <span className="schedule-time">{time}</span>
                  </div>
                )) : (
                  <div className="no-schedule">Loading schedule...</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Platform Captions */}
        <div className="captions-section">
          <h3>
            {results.platform === 'instagram' && <><Instagram size={24} /> Instagram Captions</>}
            {results.platform === 'facebook' && <><Facebook size={24} /> Facebook Captions</>}
            {results.platform === 'linkedin' && <><Linkedin size={24} /> LinkedIn Captions</>}
            {results.platform === 'twitter' && <>🐦 Twitter Captions</>}
          </h3>
          
          <div className="platform-block slide-in">
            <div className="captions-list">
              {results.captions && results.captions.length > 0 ? results.captions.map((caption, index) => (
                <div key={`caption-${index}`} className="caption-card pop-in" style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
                  <div className="caption-content">
                    <p className="caption-text">{caption}</p>
                    <div className="hashtag-section">
                      <div className="hashtag-label">
                        <Hash size={16} />
                        <span>Suggested Hashtags:</span>
                      </div>
                      <div className="hashtag-pills">
                        {results.hashtags && results.hashtags[index] && results.hashtags[index].map((tag, tagIndex) => (
                          <button
                            key={`tag-${index}-${tagIndex}`}
                            className={`hashtag-pill ${selectedHashtags[results.platform]?.includes(tag) ? 'selected' : ''}`}
                            onClick={() => handleHashtagToggle(results.platform, tag)}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button 
                    className="copy-btn"
                    onClick={() => copyWithHashtags(caption, results.platform, index)}
                  >
                    {copiedId === `${results.platform}-${index}` ? (
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
              )) : (
                <div className="no-captions-message">
                  <p>No captions available</p>
                </div>
              )}
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
