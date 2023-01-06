import axios, {AxiosHeaders} from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
})

api.interceptors.request.use(config => {
    const adminToken = localStorage.getItem('adminToken')
    if (adminToken) {
        (config.headers as AxiosHeaders).set('admin_token', adminToken)
    }
    return config
})

api.interceptors.response.use(response => {
    return response
})

export default api
