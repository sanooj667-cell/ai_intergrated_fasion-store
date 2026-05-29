import api from "./axios";

export const generateTryOn = async (formData) => {
  const response = await api.post("/tryon/generate/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getTryOnHistory = async () => {
  const response = await api.get("/tryon/history/");
  return response.data;
};
