// src/services/apiClient.ts
import axios from 'axios';
import { API_BASE_URL } from '@/config/apiConfig';

const apiClient = axios.create({
  baseURL: API_BASE_URL
});

export default apiClient;
