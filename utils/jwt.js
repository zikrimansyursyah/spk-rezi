import { JWT_SECRET_KEY } from "@/services/constants";
import jwt from "jsonwebtoken";

export function verifyJWT(value) {
  try {
    const result = jwt.verify(value, JWT_SECRET_KEY);
    return result;
  } catch (error) {
    return null;
  }
}

export function signJWT(value, expired = "12h") {
  return jwt.sign(value, JWT_SECRET_KEY, { expiresIn: expired });
}
