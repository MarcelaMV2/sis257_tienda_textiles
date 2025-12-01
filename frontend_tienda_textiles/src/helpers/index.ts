// src/helpers/index.ts
export function getTokenFromLocalStorage(): string | null {
  try {
    const token = localStorage.getItem('token')
    if (!token) return null

    const payload = parseJwt(token)
    // Si no se pudo parsear o no hay exp o rol, trata el token como inválido
    if (!payload || typeof payload.exp !== 'number' || !payload.rol) return null

    const now = Math.floor(Date.now() / 1000)
    if (payload.exp > now) return token
    return null
  } catch {
    return null
  }
}

export function parseJwt(token?: string): any | null {
  try {
    if (!token) return null
    const parts = token.split('.')
    if (parts.length < 2) return null

    const segment = parts[1]
    if (!segment) return null

    const base64 = segment.replace(/-/g, '+').replace(/_/g, '/')

    const jsonPayload = decodeURIComponent(
      Array.prototype.map
        .call(atob(base64), (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}
