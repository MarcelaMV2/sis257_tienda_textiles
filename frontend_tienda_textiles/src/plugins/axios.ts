// src/api/axios.ts
import Axios, { type AxiosInstance } from 'axios'
import { getTokenFromLocalStorage } from '@/helpers'

const axios: AxiosInstance = Axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_ENDPOINT,
})

axios.interceptors.request.use((config) => {
  config.headers = config.headers || {}

  // ← Si el body es FormData, NO toques el Content-Type
  // Axios lo manejará automáticamente con el boundary correcto
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json'
  }

  const token = getTokenFromLocalStorage()
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  } else {
    delete (config.headers as any)['Authorization']
  }

  return config
})

export default axios
