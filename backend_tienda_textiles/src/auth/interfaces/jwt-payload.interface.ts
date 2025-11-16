export interface JwtPayload {
  sub: number;
  rol?: string; // 👈 agrega
  email?: string; // opcional
  iat?: number;
  exp?: number;
}
