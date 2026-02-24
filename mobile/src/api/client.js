import axios from "axios";

// Use your machine's LAN IP so the phone can reach the backend.
// Adjust if your IP changes.
const API_BASE_URL = "http://10.81.26.29:4000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
});

// Lightweight way for non-React modules to access the latest token.
let currentToken = null;
export function setAuthToken(token) {
  currentToken = token;
}

api.interceptors.request.use(
  async (config) => {
    if (currentToken) {
      config.headers.Authorization = `Bearer ${currentToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export async function fetchMedicines() {
  // Mirror the web frontend: backend exposes daily schedule at /medicines/daily
  const res = await api.get("/medicines/daily");
  return res.data;
}

export async function generateSchedule() {
  const res = await api.post("/ai/generate", {
    query: "Generate safe schedule and precautions"
  });
  return res.data.aiResult;
}

export async function applySchedule(optimizedSchedule) {
  const res = await api.post("/ai/apply", { optimizedSchedule });
  return res.data;
}

