import axios from 'axios';

export const chatApi = axios.create({
  baseURL: '/api/chat',
  timeout: 30000,
});

export const mediaApi = axios.create({
  baseURL: '/api',
  timeout: 30000,
});
