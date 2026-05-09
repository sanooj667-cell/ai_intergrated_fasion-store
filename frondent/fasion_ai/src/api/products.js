import api from "./axios";

const sanitizeParams = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && String(value).trim() !== "",
    ),
  );

export const getProducts = async (params = {}) => {
  const response = await api.get("/products/", {
    params: sanitizeParams(params),
  });
  return response.data;
};

export const getProductDetail = async (id, relatedLimit = 4) => {
  const response = await api.get(`/products/${id}/`, {
    params: sanitizeParams({ related_limit: relatedLimit }),
  });
  return response.data;
};
