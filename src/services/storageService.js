/**
 * Storage Service with Auto-Expiring TTL Caching.
 * Automatically preserves ongoing game state, scores, and player customizations
 * across page reloads. If inactive for longer than CACHE_TTL_MS (30 mins),
 * or when explicitly exited, the cache automatically purges.
 */

const STORAGE_KEY = 'TICTACTOE_BUG_GAME_STATE_V1';
const AUDIO_SETTINGS_KEY = 'TICTACTOE_BUG_AUDIO_SETTINGS_V1';

// Default TTL: 30 minutes in milliseconds
export const CACHE_TTL_MS = 30 * 60 * 1000;

/**
 * Saves current game state with a fresh activity timestamp.
 * @param {Object} state
 */
export function saveGameState(state) {
  try {
    const payload = {
      ...state,
      lastActive: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn('Failed to save game state to localStorage:', err);
  }
}

/**
 * Loads game state from localStorage.
 * If expired (> CACHE_TTL_MS) or corrupted, clears the cache and returns null.
 * @returns {Object|null}
 */
export function loadGameState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const data = JSON.parse(raw);
    const now = Date.now();

    // Check if the cached session has expired
    if (!data.lastActive || now - data.lastActive > CACHE_TTL_MS) {
      console.log('Game state cache expired (> 30 mins inactive). Resetting session.');
      clearGameState();
      return null;
    }

    return data;
  } catch (err) {
    console.warn('Failed to parse cached game state:', err);
    clearGameState();
    return null;
  }
}

/**
 * Purges the game state cache immediately (e.g. upon user exit).
 */
export function clearGameState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear game state from localStorage:', err);
  }
}

/**
 * Saves audio preferences (mute, volume).
 * @param {{ bgmMuted: boolean, sfxMuted: boolean, bgmVolume: number, sfxVolume: number }} settings
 */
export function saveAudioSettings(settings) {
  try {
    localStorage.setItem(AUDIO_SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.warn('Failed to save audio settings:', err);
  }
}

/**
 * Loads audio preferences.
 * @returns {{ bgmMuted: boolean, sfxMuted: boolean, bgmVolume: number, sfxVolume: number }|null}
 */
export function loadAudioSettings() {
  try {
    const raw = localStorage.getItem(AUDIO_SETTINGS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    return null;
  }
}
