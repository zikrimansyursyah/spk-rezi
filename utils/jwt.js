import { SignJWT, jwtVerify } from "jose";

export async function sign(token, isLongTime = false) {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 120 * (isLongTime ? 420 : 60);

  return await new SignJWT(token).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(exp).setIssuedAt(iat).setNotBefore(iat).sign(new TextEncoder().encode(process.env.JWT_SECRET_KEY));
}

export async function verify(token) {
  const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET_KEY));
  return payload;
}
