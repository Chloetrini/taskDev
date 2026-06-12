const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5200";

export const getTasks = async () => {
  const res = await fetch(`${BASE_URL}/api/tasks`, {
     method: "GET" });
  return res.json();
};

export const getTaskById = async (id: string) => {
  const res = await fetch(`${BASE_URL}/api/tasks/${id}`, { 
    method: "GET" });
  return res.json();
};

export const createTask = async (data: object) => {
  const res = await fetch(`${BASE_URL}/api/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateTask = async (id: string, data: object) => {
  const res = await fetch(`${BASE_URL}/api/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteTask = async (id: string) => {
  const res = await fetch(`${BASE_URL}/api/tasks/${id}`, {
     method: "DELETE" });
  return res.json();
};