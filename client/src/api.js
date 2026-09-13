const base = import.meta.env.VITE_API_URL || '/api';

const json = async (res) => {
  const data = await res.json().catch(() => ({ error: 'Network error. Please try again.' }));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
};

export const getDemos = () => fetch(`${base}/demos`).then(json);
export const getCaseStudies = () => fetch(`${base}/case-studies`).then(json);

export const submitOrder = (body) =>
  fetch(`${base}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }).then(json);

export const getOrder = (token) =>
  fetch(`${base}/orders/track/${token}`).then(json);

export const loginAdmin = (body) =>
  fetch(`${base}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }).then(json);

export const getAdminOrders = (token, qs = '') =>
  fetch(`${base}/admin/orders?${qs}`, { headers: { Authorization: `Bearer ${token}` } }).then(json);

export const updateAdminOrder = (token, id, body) =>
  fetch(`${base}/admin/orders/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body)
  }).then(json);

export const getAdminStats = (token) =>
  fetch(`${base}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }).then(json);

export const getAdminDemos = (token) =>
  fetch(`${base}/admin/demos`, { headers: { Authorization: `Bearer ${token}` } }).then(json);

export const upsertDemo = (token, body) =>
  fetch(`${base}/admin/demos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body)
  }).then(json);

export const deleteDemo = (token, id) =>
  fetch(`${base}/admin/demos/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }).then(json);

export const getAdminCaseStudies = (token) =>
  fetch(`${base}/admin/case-studies`, { headers: { Authorization: `Bearer ${token}` } }).then(json);

export const upsertCaseStudy = (token, body) =>
  fetch(`${base}/admin/case-studies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body)
  }).then(json);

export const deleteCaseStudy = (token, id) =>
  fetch(`${base}/admin/case-studies/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }).then(json);

export const triggerReminder = (token) =>
  fetch(`${base}/admin/reminder`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } }).then(json);
