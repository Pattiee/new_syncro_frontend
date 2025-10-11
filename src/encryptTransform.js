// encryptTransform.js
import { createTransform } from 'redux-persist';
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'my-super-secret-key'; // use env var in production

export const encryptTransform = createTransform(
  // transform state on save
  (inboundState) => {
    const stringified = JSON.stringify(inboundState);
    return CryptoJS.AES.encrypt(stringified, SECRET_KEY).toString();
  },
  // transform state on load
  (outboundState) => {
    if (!outboundState) return outboundState;
    const bytes = CryptoJS.AES.decrypt(outboundState, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  },
  { whitelist: ['cart'] } // only encrypt cart slice
);
