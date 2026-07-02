import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API });

// Attach admin token if present
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("kypau_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// ---------- public ----------
export const getPortfolio = () => api.get("/portfolio").then((r) => r.data);
export const submitContact = (payload) => api.post("/contact", payload).then((r) => r.data);
export const trackVisit = (page = "/") =>
    api.post("/analytics/track", { page, referrer: document.referrer || "" }).then((r) => r.data);
export const getVisitorCount = () => api.get("/analytics/visitor-count").then((r) => r.data);
export const trackProjectClick = (id) => api.post(`/projects/${id}/click`).then((r) => r.data);
export const getGithubRepos = () => api.get("/github/repos").then((r) => r.data);
export const getGithubOrg = () => api.get("/github/org").then((r) => r.data);
export const getGithubEvents = () => api.get("/github/events").then((r) => r.data);
export const resumeUrl = `${API}/resume`;

// ---------- auth ----------
export const login = (username, password) =>
    api.post("/auth/login", { username, password }).then((r) => r.data);
export const getMe = () => api.get("/auth/me").then((r) => r.data);
export const changePassword = (current_password, new_password) =>
    api.post("/auth/change-password", { current_password, new_password }).then((r) => r.data);

// ---------- admin ----------
export const getStats = () => api.get("/admin/stats").then((r) => r.data);
export const getAnalytics = (days = 30) => api.get(`/admin/analytics?days=${days}`).then((r) => r.data);
export const getMessages = (params = {}) =>
    api.get("/admin/messages", { params }).then((r) => r.data);
export const markMessageRead = (id) => api.patch(`/admin/messages/${id}/read`).then((r) => r.data);
export const deleteMessage = (id) => api.delete(`/admin/messages/${id}`).then((r) => r.data);
export const bulkDeleteMessages = (ids) =>
    api.post("/admin/messages/bulk-delete", { ids }).then((r) => r.data);

export const listContent = (coll) => api.get(`/admin/content/${coll}`).then((r) => r.data);
export const createContent = (coll, item) => api.post(`/admin/content/${coll}`, item).then((r) => r.data);
export const updateContent = (coll, id, item) =>
    api.put(`/admin/content/${coll}/${id}`, item).then((r) => r.data);
export const deleteContent = (coll, id) => api.delete(`/admin/content/${coll}/${id}`).then((r) => r.data);

export const listMedia = () => api.get("/admin/media").then((r) => r.data);
export const uploadMedia = (payload) => api.post("/admin/media", payload).then((r) => r.data);
export const deleteMedia = (id) => api.delete(`/admin/media/${id}`).then((r) => r.data);

export const getSettings = () => api.get("/admin/settings").then((r) => r.data);
export const updateSettings = (payload) => api.put("/admin/settings", payload).then((r) => r.data);
export const getLogs = () => api.get("/admin/logs").then((r) => r.data);
