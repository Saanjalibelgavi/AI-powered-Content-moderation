import axios from 'axios';

// Configuration for Flask backend with ML models
const AI_API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 60000, // 60 seconds for ML model processing
};

// Create axios instance
const apiClient = axios.create(AI_API_CONFIG);

/**
 * Convert File or base64 image to base64 string
 * @param {File|string} image - Image file or base64 string
 * @returns {Promise<string>} - Base64 encoded image
 */
const imageToBase64 = (image) => {
  return new Promise((resolve, reject) => {
    if (typeof image === 'string') {
      resolve(image);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(image);
  });
};

/**
 * Analyze text and image content using Hugging Face Transformers + OpenCV
 * @param {string} text - Text content to analyze
 * @param {File|string} image - Image file or base64 string
 * @param {string} platform - Platform selection (instagram, facebook, linkedin, twitter)
 * @returns {Promise} - Analysis results with captions and moderation
 */
export const analyzeContent = async (text, image, platform = 'instagram') => {
  try {
    // Convert image to base64 if it's a File
    let imageBase64 = '';
    if (image) {
      imageBase64 = await imageToBase64(image);
    }

    const response = await apiClient.post('/analyze', {
      text: text || '',
      image: imageBase64,
      platform: platform || 'instagram',
    });

    return response.data;
  } catch (error) {
    console.error('Error analyzing content:', error);
    throw error;
  }
};

/**
 * Check backend health status
 * @returns {Promise} - Health status
 */
export const checkHealth = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    console.error('Error checking health:', error);
    throw error;
  }
};

/**
 * Expected response format from Flask backend:
 * {
 *   "decision": "approved" | "rejected",
 *   "confidence": 0.85,
 *   "captions": {
 *     "instagram": ["caption1", "caption2", "caption3"],
 *     "facebook": ["caption1", "caption2", "caption3"],
 *     "linkedin": ["caption1", "caption2", "caption3"]
 *   },
 *   "hashtags": {
 *     "instagram": [["#tag1", "#tag2"], ["#tag3"], ["#tag4"]],
 *     "facebook": [...],
 *     "linkedin": [...]
 *   },
 *   "insights": {
 *     "engagement_score": 85,
 *     "sentiment": "POSITIVE",
 *     "toxicity_level": "Low",
 *     "readability": "High",
 *     "visual_appeal": "High",
 *     "authenticity": "85%"
 *   },
 *   "text_analysis": {
 *     "label": "POSITIVE",
 *     "score": 0.95
 *   },
 *   "image_analysis": {
 *     "faces_detected": 2,
 *     "has_people": true,
 *     "is_complex": true,
 *     "brightness": 150.5,
 *     "edge_density": 0.15,
 *     "top_predictions": [...]
 *   }
 * }
 */

export default {
  analyzeContent,
  checkHealth,
};
