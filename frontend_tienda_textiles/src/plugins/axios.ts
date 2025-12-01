// src/api/axios.ts
import Axios, { type AxiosInstance } from 'axios'
import { getTokenFromLocalStorage } from '@/helpers'

const axios: AxiosInstance = Axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_ENDPOINT,
})

axios.interceptors.request.use((config) => {
  config.headers = config.headers || {}

  // ← Detecta si el body es FormData
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json'
  }
  // Si ES FormData, no toques Content-Type y déjalo como está

  const token = getTokenFromLocalStorage()
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  } else {
    delete (config.headers as any)['Authorization']
  }

  return config
})

export default axios
