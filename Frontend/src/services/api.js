import axios from 'axios';

const API_BASE_URL = 'https://inventorymanagmentapp-production.up.railway.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Items API
export const getItems = (search = '') => {
  const params = search ? { search } : {};
  return api.get('/items', { params });
};

export const getItem = (id) => {
  return api.get(`/items/${id}`);
};

export const createItem = (itemData) => {
  return api.post('/items', itemData);
};

export const updateItemQuantity = (id, change) => {
  return api.patch(`/items/${id}/quantity`, { change });
};

export const updateItem = (id, itemData) => {
  return api.put(`/items/${id}`, itemData);
};

export const deleteItem = (id) => {
  return api.delete(`/items/${id}`);
};

// History API
export const getHistory = (limit = 30) => {
  return api.get('/history', { params: { limit } });
};

export const getItemHistory = (itemId) => {
  return api.get(`/history/item/${itemId}`);
};

export const cleanupOldHistory = () => {
  return api.delete('/history/cleanup');
};

export const deleteAllHistory = () => {
  return api.delete('/history/all');
};

export default api;
