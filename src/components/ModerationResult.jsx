import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Shield } from 'lucide-react';
import '../styles/ModerationResult.css';

const ModerationResult = ({ result }) => {
  const { isApproved, confidence, flags, categories } = result;

  const flaggedItems = Object.entries(flags).filter(([_, value]) => value);

  return (
    <div className="moderation-result">
      <h2 className="section-title">
        <Shield size={24} />
        Moderation Result
      </h2>

      <div className={`status-card ${isApproved ? 'approved' : 'rejected'}`}>
        <div className="status-icon">
          {isApproved ? (
            <CheckCircle size={48} />
          ) : (
            <XCircle size={48} />
          )}
        </div>
        <div className="status-content">
          <h3>{isApproved ? 'Content Approved' : 'Content Flagged'}</h3>
          <p>
            {isApproved 
              ? 'This image is safe for social media posting'
              : 'This image contains content that may violate community guidelines'}
          </p>
          <div className="confidence-bar">
            <label>Confidence Score: {confidence}%</label>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${confidence}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {!isApproved && flaggedItems.length > 0 && (
        <div className="flags-section">
          <h4>
            <AlertTriangle size={20} />
            Detected Issues
          </h4>
          <div className="flags-list">
            {flaggedItems.map(([flag, _]) => (
              <span key={flag} className="flag-badge">
                {flag.charAt(0).toUpperCase() + flag.slice(1)}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="categories-section">
        <h4>Categories</h4>
        <div className="categories-list">
          {categories.map((category, index) => (
            <span key={index} className="category-badge">
              {category}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModerationResult;
