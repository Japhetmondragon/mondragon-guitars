import axios from 'axios'

export const adminAPI = axios.create({
  baseURL: import.meta.env.VITE_ADMIN_API,
})

adminAPI.interceptors.request.use((config) => {
  const adminInfo = localStorage.getItem('adminInfo')
  if (adminInfo) {
    const { token } = JSON.parse(adminInfo)
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const publicAPI = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_API,
})