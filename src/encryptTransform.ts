import { createTransform } from 'redux-persist';
import CryptoJS from 'crypto-js';

// Fallback to assertion typecast to handle strict string validation
const SECRET_KEY: string = process.env.REACT_APP_REDUX_ENCRYPT_KEY || 'my-super-secret-key';

export const encryptTransform = createTransform<any, string>(
  // 1. Inbound state transformation: Triggered on save mutations
  (inboundState: any): string => {
    const stringified = JSON.stringify(inboundState);
    return CryptoJS.AES.encrypt(stringified, SECRET_KEY).toString();
  },
  // 2. Outbound state transformation: Triggered on rehydration reload maps
  (outboundState: string): any => {
    if (!outboundState) return outboundState;
    try {
      const bytes = CryptoJS.AES.decrypt(outboundState, SECRET_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error("Failed to decrypt Redux Persist state:", error);
      return undefined; // Gracefully handles corrupted local storage keys
    }
  },
  { whitelist: ['cart'] } // Specifies targeted encryption boundaries
);