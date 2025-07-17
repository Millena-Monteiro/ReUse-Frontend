// src/lib/api.ts
import axios from "axios";

export const authApi = axios.create({
  baseURL: "/api",
});



export const dataApi = axios.create({
  baseURL: "https://reuse-lwju.onrender.com",
});

export default {
  auth: authApi,
  data: dataApi,
};