// src/api.js
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

function getToken() {
  // Try to get token directly
  let token = localStorage.getItem("token");
  if (!token) {
    // Fallback: try to get from currentUser if available
    try {
      const user = JSON.parse(localStorage.getItem("currentUser"));
      if (user && user.token) token = user.token;
    } catch {}
  }
  return token;
}

// Helper to set token after login
export function setToken(token) {
  if (token) localStorage.setItem("token", token);
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { ...authHeaders() },
    credentials: "include",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiPost(path, data, isForm = false) {
  const headers = isForm
    ? authHeaders()
    : { "Content-Type": "application/json", ...authHeaders() };
  const body = isForm ? data : JSON.stringify(data);
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers,
    body,
    credentials: "include",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiPut(path, data, isForm = false) {
  const headers = isForm
    ? authHeaders()
    : { "Content-Type": "application/json", ...authHeaders() };
  const body = isForm ? data : JSON.stringify(data);
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PUT",
    headers,
    body,
    credentials: "include",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiDelete(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
    credentials: "include",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiPatch(path, data) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!res.ok) {
    const errorText = await res.text();
    let errorMessage;
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || errorText;
    } catch {
      errorMessage = errorText || `HTTP ${res.status}: ${res.statusText}`;
    }
    throw new Error(errorMessage);
  }
  return res.json();
}
