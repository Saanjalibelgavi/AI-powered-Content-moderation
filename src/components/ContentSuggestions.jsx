import React, { useState } from 'react';
import { Copy, Check, MessageSquare, Hash, Wand2 } from 'lucide-react';
import '../styles/ContentSuggestions.css';

const ContentSuggestions = ({ suggestions }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [selectedTone, setSelectedTone] = useState('Inspirational');

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="content-suggestions">
      <h2 className="section-title">
        <Wand2 size={24} />
        AI Content Suggestions
      </h2>

      {/* Tone Selector */}
      <div className="tone-selector">
        <label>Select Tone:</label>
        <div className="tone-buttons">
          {suggestions.tones.map((tone) => (
            <button
              key={tone}
              className={`tone-button ${selectedTone === tone ? 'active' : ''}`}
              onClick={() => setSelectedTone(tone)}
            >
              {tone}
            </button>
          ))}
        </div>
      </div>

      {/* Caption Suggestions */}
      <div className="suggestions-group">
        <h3 className="group-title">
          <MessageSquare size={20} />
          Caption Suggestions
        </h3>
        <div className="suggestions-list">
          {suggestions.captions.map((caption, index) => (
            <div key={index} className="suggestion-item">
              <p className="suggestion-text">{caption}</p>
              <button 
                className="copy-button"
                onClick={() => handleCopy(caption, `caption-${index}`)}
              >
                {copiedIndex === `caption-${index}` ? (
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

      {/* Hashtag Suggestions */}
      <div className="suggestions-group">
        <h3 className="group-title">
          <Hash size={20} />
          Hashtag Suggestions
        </h3>
        <div className="suggestions-list">
          {suggestions.hashtags.map((hashtag, index) => (
            <div key={index} className="suggestion-item">
              <p className="suggestion-text hashtag-text">{hashtag}</p>
              <button 
                className="copy-button"
                onClick={() => handleCopy(hashtag, `hashtag-${index}`)}
              >
                {copiedIndex === `hashtag-${index}` ? (
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
  );
};

export default ContentSuggestions;
