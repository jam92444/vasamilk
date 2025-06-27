import CryptoJS from "crypto-js";
import {SECRET_KEY} from '../../public/config.ts'
// const SECRET_KEY = import.meta.env.VITE_SECRET_KEY || "dsjkfjksvvnlsdkffnlfkj";

export const encryptData = (data: any): string => {
  const stringData = typeof data === "string" ? data : JSON.stringify(data);
  return CryptoJS.AES.encrypt(stringData, SECRET_KEY).toString();
};

export const decryptData = (cipherText: string): string => {
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
