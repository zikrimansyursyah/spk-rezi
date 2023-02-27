import { CRYPTO_SECRET_KEY } from "@/services/constants";
import CryptoJS from "crypto-js";

export function decryptCrypto(value) {
  return CryptoJS.AES.decrypt(value, CRYPTO_SECRET_KEY).toString(CryptoJS.enc.Utf8);
}

export function encryptCrypto(value) {
  return CryptoJS.AES.encrypt(value, CRYPTO_SECRET_KEY).toString();
}
