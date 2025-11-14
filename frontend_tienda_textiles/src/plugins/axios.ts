// src/api/axios.ts
import Axios, { type AxiosInstance } from 'axios'
import { getTokenFromLocalStorage } from '@/helpers' // <- léelo del helper robusto

const axios: AxiosInstance = Axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_ENDPOINT,
})

axios.interceptors.request.use((config) => {
  config.headers = config.headers || {}
  config.headers['Content-Type'] = 'application/json'

  const token = getTokenFromLocalStorage()
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  } else {
    // Asegura no enviar header vacío
    delete (config.headers as any)['Authorization']
  }
  return config
})

export default axios
