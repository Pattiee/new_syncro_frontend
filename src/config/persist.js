import axios from "axios";

const API_BASE = "/api/state";
let saveTimer = null;
let pendingState = null;

export const loadState = async (token) => {
  if (!token) return undefined;
  try {
    const res = await axios.get(API_BASE, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 3000,
    });
    return res.data || undefined;
  } catch (err) {
    console.warn("loadState failed (falling back to defaults):", err?.message || err);
    return undefined;
  }
};

// non-blocking debounced save
export const saveState = (token, state) => {
  pendingState = state;

  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    const payload = pendingState;
    pendingState = null;
    if (!token) return;
    try {
      await axios.post(API_BASE, payload, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 3000,
      });
    } catch (err) {
      console.warn("saveState failed (will retry later):", err?.message || err);
      // optional: schedule a retry
      setTimeout(() => saveState(token, payload), 5000);
    }
  }, 500); // debounce window
};