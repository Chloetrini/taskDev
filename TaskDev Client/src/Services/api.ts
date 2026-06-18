const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5200";

//TASK

export const getTasks = async () => {
  const res = await fetch(`${BASE_URL}/api/tasks`, {
    method: "GET",
    credentials: "include", 
  });
  return res.json();
};

export const getTaskById = async (id: string) => {
  const res = await fetch(`${BASE_URL}/api/tasks/${id}`, { 
    method: "GET" ,
  credentials: "include",});
  return res.json();
};

export const createTask = async (data: object) => {
  const res = await fetch(`${BASE_URL}/api/tasks`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateTask = async (id: string, data: object) => {
  const res = await fetch(`${BASE_URL}/api/tasks/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteTask = async (id: string) => {
  const res = await fetch(`${BASE_URL}/api/tasks/${id}`, {
     method: "DELETE",
     credentials: "include"
   });
  return res.json();
};


// AUTH

export const registerUser = async (data: object) => {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return res.json();
};

export const loginUser = async (data: object) => {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return res.json();
};

export const logoutUser = async () => {
  const res = await fetch(`${BASE_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  return res.json();
};

export const getCurrentUser = async () => {
  const res = await fetch(`${BASE_URL}/api/auth/me`, {
    method: "GET",
    credentials: "include",
  });
  return res.json();
};

export const forgotPassword = async (data: object) => {
  const res = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return res.json();
};

export const resetPassword = async (token: string, data: object) => {
  const res = await fetch(`${BASE_URL}/api/auth/reset-password/${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return res.json();
};
export const verifyEmail = async (token: string) => {
  const res = await fetch(`${BASE_URL}/api/auth/verify-email/${token}`, {
    method: "GET",
    credentials: "include",
  });
  return res.json();
};

export const updateProfile = async (data: object) => {
  const res = await fetch(`${BASE_URL}/api/auth/profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return res.json();
};