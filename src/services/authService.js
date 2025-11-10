import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Authentication service for user login and signup
 */
const authService = {
  /**
   * Register a new user
   */
  async signup(email, password) {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, {
        email,
        password
      });
      
      // Store user data in sessionStorage
      if (response.data.user) {
        sessionStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error.response?.data || { error: 'Signup failed' };
    }
  },

  /**
   * Login an existing user
   */
  async login(email, password) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      
      // Store user data in sessionStorage
      if (response.data.user) {
        sessionStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error.response?.data || { error: 'Login failed' };
    }
  },

  /**
   * Logout current user
   */
  logout() {
    sessionStorage.removeItem('user');
  },

  /**
   * Get current logged-in user
   */
  getCurrentUser() {
    const userStr = sessionStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.getCurrentUser();
  }
};

export default authService;
