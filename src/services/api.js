import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE;
const AUTH_URL = import.meta.env.VITE_AUTH_URL;
const FETCH_URL = import.meta.env.VITE_FETCH_URL;
const AI_AGENT_URL = import.meta.env.VITE_AI_AGENT_URL;

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

export const api = {
  auth: {
    login: () => window.location.href = `${AUTH_URL}/auth/login`,
    verify: (token) => axios.post(`${AUTH_URL}/auth/verify`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
  },
  videos: {
    getUserVideos: (userId) => axios.get(`${API_BASE}/video/user/${userId}`),
    getVideo: (videoId) => axios.get(`${API_BASE}/video/${videoId}`)
  },
  comments: {
    getVideoComments: (videoId, page = 1) =>
      axios.get(`${API_BASE}/comments/video/${videoId}?page=${page}&limit=100`),
    getTopLiked: (videoId) =>
      axios.get(`${API_BASE}/comments/video/${videoId}/top-likes?limit=10`)
  },
  analysis: {
    getVideoAnalysis: (videoId) => axios.get(`${API_BASE}/analysis/video/${videoId}`),
    getSummary: (videoId) => axios.get(`${API_BASE}/analysis/summary/${videoId}`)
  },
  fetch: {
    start: (videoId) => axios.post(`${FETCH_URL}/fetch`,
      { videoId },
      { headers: getAuthHeader() }
    )
  },
  ai: {
    chat: (videoId, userQuery) => axios.post(`${AI_AGENT_URL}/chat`,
      { videoId, userQuery },
      { headers: getAuthHeader() }
    )
  }
};

export const createWebSocket = (type, videoId, onMessage) => {
  const wsUrl = type === 'fetch' ? 'ws://localhost:4001' : 'ws://localhost:4002';
  const ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    ws.send(JSON.stringify({ type: 'subscribe', videoId }));
  };

  ws.onmessage = (event) => {
    onMessage(JSON.parse(event.data));
  };

  return ws;
};