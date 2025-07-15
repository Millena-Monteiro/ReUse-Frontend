import axios from "axios";

const api = axios.create({
  baseURL: "https://reuse-lwju.onrender.com", // troque pela sua URL real
});

export default api;
