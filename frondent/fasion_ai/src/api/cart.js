import api from "./axios";

export const getCartItems = async () => {
  const response = await api.get("/cart/");
  return response.data;
};

export const addToCart = async ({ product_id, quantity = 1 }) => {
  const response = await api.post("/cart/add/", { product_id, quantity });
  return response.data;
};

export const updateCartItemQuantity = async (id, quantity) => {
  const response = await api.patch(`/cart/update/${id}/`, { quantity });
  return response.data;
};

export const removeCartItem = async (id) => {
  const response = await api.delete(`/cart/remove/${id}/`);
  return response.data;
};
