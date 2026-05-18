import axios from 'axios';

export const chatApi = axios.create({
  baseURL: 'http://localhost:3001/api/chat',
  timeout: 30000,
});
