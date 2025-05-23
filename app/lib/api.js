import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api'; // your Spring Boot backend URL

const getToken = () => {
  // If using localStorage
  return localStorage.getItem('token'); // or sessionStorage or from a cookie
};

// Axios instance with JWT
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to each request
axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const getPosts = async () => {
  const response = await axiosInstance.get('/posts/all-posts');
  return response.data;
};

export const getCategories = async () => {
  const response = await axiosInstance.get('/categories/all');
  return response.data;
};
