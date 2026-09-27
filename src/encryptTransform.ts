import { createTransform } from 'redux-persist';
import CryptoJS from 'crypto-js';

// Fallback to assertion typecast to handle strict string validation
const SECRET_KEY: string = process.env.REACT_APP_REDUX_ENCRYPT_KEY || 'my-super-secret-key';

// Replaced flexible wildcard 'any' bindings with safe layout 'unknown' constraints
export const encryptTransform = createTransform<unknown, string>(
  // 1. Inbound state transformation: Triggered on save mutations
  (inboundState: unknown): string => {
    const stringified = JSON.stringify(inboundState);
    return CryptoJS.AES.encrypt(stringified, SECRET_KEY).toString();
  },
  // 2. Outbound state transformation: Triggered on rehydration reload maps
  (outboundState: string): unknown => {
    if (!outboundState) {
      return outboundState;
    }
    try {
      const bytes = CryptoJS.AES.decrypt(outboundState, SECRET_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      
      if (!decrypted) {
        throw new Error("Decrypted string is empty or invalid.");
      }
      
      return JSON.parse(decrypted);
    } catch (error) {
      console.error("Failed to decrypt Redux Persist state safely:", error);
      return undefined; // Gracefully handles corrupted or tampered local storage entries
    }
  },
  { whitelist: ['cart'] } // Specifies targeted encryption boundaries
);

export default encryptTransform;