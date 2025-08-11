import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'https://live-courses.onrender.com/api',
  withCredentials: true,
});

export default axiosInstance;
