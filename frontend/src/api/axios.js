import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL: API_BASE_URL,
});

export const getPrompts = async () => {
  const response = await API.get("/prompts");
  return response.data;
};

export const getPrompt = async (id) => {
  const response = await API.get(`/prompts/${id}`);
  return response.data;
};

export const createPrompt = async (data) => {
  const userEmail = localStorage.getItem("userEmail") || "";
  const response = await API.post("/prompts", data, {
    headers: { "x-user-email": userEmail },
  });
  return response.data;
};

export const deletePrompt = async (id) => {
  const userEmail = localStorage.getItem("userEmail") || "";
  const response = await API.delete(`/prompts/${id}`, {
    headers: { "x-user-email": userEmail },
  });
  return response.data;
};

export const registerUser = async (data) => {
  const response = await API.post("/auth/register", data);
  return response.data;
};

export const loginUser = async (data) => {
  const response = await API.post("/auth/login", data);
  return response.data;
};

export default API;
