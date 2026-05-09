import api from './api'

const cleanParams = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && String(value).trim() !== '',
    ),
  )

export const getProducts = async (params = {}) => {
  const response = await api.get('/products/', {
    params: cleanParams(params),
  })
  return response.data
}

export const getProductById = async (id, params = {}) => {
  const response = await api.get(`/products/${id}/`, {
    params: cleanParams(params),
  })
  return response.data
}
