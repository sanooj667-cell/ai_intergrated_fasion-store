import api from "./axios";

export const createRazorpayOrder = async () => {
  const response = await api.post("/payments/create-order/");
  return response.data;
};

export const verifyPayment = async (payload) => {
  const response = await api.post("/payments/verify-payment/", payload);
  return response.data;
};
