import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

const request = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:6061/api',
    timeout: 15000
})

// 请求拦截器
request.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`  // ✅ 修复这里
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// 响应拦截器
request.interceptors.response.use(
    (response) => {
        const res = response.data
        if (res.code === 200) {
            return res.data
        } else if (res.code === 401) {
            ElMessage.error(res.message || '登录已过期，请重新登录')
            localStorage.removeItem('token')
            router.push('/login')
            return Promise.reject(res)
        } else {
            ElMessage.error(res.message || '请求失败')
            return Promise.reject(res)
        }
    },
    (error) => {
        ElMessage.error(error.message || '网络错误')
        return Promise.reject(error)
    }
)

export default request