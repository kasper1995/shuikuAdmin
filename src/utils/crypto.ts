
import CryptoJS from 'crypto-js';

export function getMd5Hash(input: string): string {
  console.log(input);
  return CryptoJS.MD5(input).toString();
}


export function getBase64Encode(input: string): string {
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(input));
}
