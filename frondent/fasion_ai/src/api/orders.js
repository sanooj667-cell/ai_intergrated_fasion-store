import api from "./axios";

export const createOrder = async (payload) => {
  const response = await api.post("/orders/create/", payload);
  return response.data;
};

export const getOrders = async () => {
  const response = await api.get("/orders/");
  return response.data;
};

export const getOrder = async (id) => {
  const response = await api.get(`/orders/${id}/`);
  return response.data;
};

export const trackOrder = async (trackingId) => {
  const response = await api.get(`/orders/track/${encodeURIComponent(trackingId)}/`);
  return response.data;
};

export const updateOrderStatus = async (id, payload) => {
  const response = await api.patch(`/orders/status/${id}/`, payload);
  return response.data;
};
