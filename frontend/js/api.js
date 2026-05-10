const API_BASE = 'http://localhost:5000/api';

const api = {
  async request(method, endpoint, data = null) {
    const token = localStorage.getItem('traveloop_token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const opts = { method, headers };
    if (data) opts.body = JSON.stringify(data);
    const res = await fetch(`${API_BASE}${endpoint}`, opts);
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.message || 'Request failed');
    return json;
  },
  get: (ep) => api.request('GET', ep),
  post: (ep, d) => api.request('POST', ep, d),
  put: (ep, d) => api.request('PUT', ep, d),
  patch: (ep, d) => api.request('PATCH', ep, d),
  delete: (ep) => api.request('DELETE', ep),
};

window.api = api;
