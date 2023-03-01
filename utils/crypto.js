import CryptoJS from "crypto-js";

export function decryptCrypto(value) {
  try {
    const decrypt = CryptoJS.AES.decrypt(value, process.env.CRYPTO_SECRET_KEY).toString(CryptoJS.enc.Utf8);
    return decrypt;
  } catch (error) {
    return "";
  }
}

export function encryptCrypto(value) {
  return CryptoJS.AES.encrypt(value, process.env.CRYPTO_SECRET_KEY).toString();
}
