import Cookies from "js-cookie";
import { encryptData, decryptData } from "./crypto";

export const setEncryptedCookie = (name: string, data: object | string) => {
  const encrypted = encryptData(data);
  Cookies.set(name, encrypted);
};

export const getDecryptedCookie = <T = any>(
  name: string
): T | string | null => {
  const encrypted = Cookies.get(name);
  if (!encrypted) return null;

  try {
    const decrypted = decryptData(encrypted);
    try {
      return JSON.parse(decrypted) as T;
    } catch {
      return decrypted;
    }
  } catch (error) {
    console.error("Failed to decrypt cookie", error);
    return null;
  }
};

export const clearCookie = (name: string) => {
  Cookies.remove(name, { secure: true, sameSite: "Strict" });
};
