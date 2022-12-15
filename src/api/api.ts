import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
})

api.interceptors.request.use(config => {
    if (!config.headers) {
        config.headers = {}
    }
    const adminToken = localStorage.getItem('adminToken')
    if (adminToken) {
        config.headers.admin_token = adminToken
    }
    return config
})

api.interceptors.response.use(response => {
    return response
})

export default api
