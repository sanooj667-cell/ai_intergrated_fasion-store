import api from "./axios";

const sanitizeParams = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && String(value).trim() !== "",
    ),
  );

export const getAdminStats = async (params = {}) => {
  const { data } = await api.get("/admin/stats/", { params: sanitizeParams(params) });
  return data;
};

export const getAdminOrders = async (params = {}) => {
  const { data } = await api.get("/admin/orders/", { params: sanitizeParams(params) });
  return data;
};

export const getAdminUsers = async (params = {}) => {
  const { data } = await api.get("/admin/users/", { params: sanitizeParams(params) });
  return data;
};

export const getAdminProducts = async (params = {}) => {
  const { data } = await api.get("/admin/products/", { params: sanitizeParams(params) });
  return data;
};

export const createAdminProduct = async (formData) => {
  const { data } = await api.post("/admin/products/", formData);
  return data;
};

export const updateAdminProduct = async (id, formData) => {
  const { data } = await api.patch(`/admin/products/${id}/`, formData);
  return data;
};

export const deleteAdminProduct = async (id) => {
  await api.delete(`/admin/products/${id}/`);
};
