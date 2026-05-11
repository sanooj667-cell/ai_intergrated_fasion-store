import api from "./axios";

export const getAddresses = async () => {
  const response = await api.get("/addresses/");
  return response.data;
};

export const createAddress = async (payload) => {
  const response = await api.post("/addresses/", payload);
  return response.data;
};

export const updateAddress = async (id, payload) => {
  const response = await api.patch(`/addresses/${id}/`, payload);
  return response.data;
};

export const deleteAddress = async (id) => {
  const response = await api.delete(`/addresses/${id}/`);
  return response.data;
};

