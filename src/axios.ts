import axios from "axios";

const api = axios.create({
  baseURL: "https://reuse-lwju.onrender.com", // URL real da API
});

export default api;
