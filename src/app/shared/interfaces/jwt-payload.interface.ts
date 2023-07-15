export interface JwtPayload {
  sub: any;
  iat?: number;
  exp?: number;
  type?: string;
}
