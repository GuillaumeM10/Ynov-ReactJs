import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

if (!API_KEY) {
  throw new Error("API_KEY is not defined");
}

if (!API_URL) {
  throw new Error("API_URL is not defined");
}

if (API_KEY) {
  api.defaults.params = {};
  api.defaults.params["api_key"] = API_KEY;
  api.defaults.params["language"] = "fr-FR";
  api.defaults.params["region"] = "FR";
}

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export default api;

// call exemple : api.get("/movie/popular");
