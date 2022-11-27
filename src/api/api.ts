import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

api.interceptors.request.use(async (config) => {
  return config
})

api.interceptors.response.use(async (response) => {
  return response
})

export default api
