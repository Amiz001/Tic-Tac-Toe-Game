/**
 * Audio Engine: Background Music & Zero-Latency Synthesized Web Audio SFX.
 * Provides a calm, low-loudness ambient soundscape and organic cartoon sound effects.
 */

import { saveAudioSettings, loadAudioSettings } from './storageService';

class AudioEngine {
  constructor() {
    this.audioCtx = null;
    this.bgmAudio = null;
    this.bgmVolume = 0.15; // Low loudness, calm vibe as requested
    this.sfxVolume = 0.25;
    this.bgmMuted = false;
    this.sfxMuted = false;
    this.isBgmPlaying = false;
    this.hasUserInteracted = false;

    // Load persisted preferences
    const saved = loadAudioSettings();
    if (saved) {
      if (typeof saved.bgmMuted === 'boolean') this.bgmMuted = saved.bgmMuted;
      if (typeof saved.sfxMuted === 'boolean') this.sfxMuted = saved.sfxMuted;
      if (typeof saved.bgmVolume === 'number') this.bgmVolume = saved.bgmVolume;
      if (typeof saved.sfxVolume === 'number') this.sfxVolume = saved.sfxVolume;
    }
  }

  /**
   * Initializes Web Audio Context upon user interaction.
   */
  initContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    this.hasUserInteracted = true;
  }

  /**
   * Initializes and plays the calm background music.
   */
  startBGM() {
    this.initContext();
    if (!this.bgmAudio) {
      this.bgmAudio = new Audio('/audio/bg-music.mp3');
      this.bgmAudio.loop = true;
      this.bgmAudio.volume = this.bgmMuted ? 0 : this.bgmVolume;
    }

    if (!this.bgmMuted && !this.isBgmPlaying) {
      this.bgmAudio.play().then(() => {
        this.isBgmPlaying = true;
      }).catch((err) => {
        // Autoplay policy prevented playback until gesture
        console.log('BGM autoplay awaiting user gesture:', err.message);
      });
    }
  }

  pauseBGM() {
    if (this.bgmAudio && this.isBgmPlaying) {
      this.bgmAudio.pause();
      this.isBgmPlaying = false;
    }
  }

  toggleBGM() {
    this.bgmMuted = !this.bgmMuted;
    if (this.bgmAudio) {
      this.bgmAudio.volume = this.bgmMuted ? 0 : this.bgmVolume;
      if (!this.bgmMuted && !this.isBgmPlaying) {
        this.startBGM();
      }
    } else if (!this.bgmMuted) {
      this.startBGM();
    }
    this.persistSettings();
    return !this.bgmMuted;
  }

  toggleSFX() {
    this.sfxMuted = !this.sfxMuted;
    this.persistSettings();
    return !this.sfxMuted;
  }

  setBGMVolume(volume) {
    this.bgmVolume = Math.max(0, Math.min(1, volume));
    if (this.bgmAudio && !this.bgmMuted) {
      this.bgmAudio.volume = this.bgmVolume;
    }
    this.persistSettings();
  }

  setSFXVolume(volume) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    this.persistSettings();
  }

  persistSettings() {
    saveAudioSettings({
      bgmMuted: this.bgmMuted,
      sfxMuted: this.sfxMuted,
      bgmVolume: this.bgmVolume,
      sfxVolume: this.sfxVolume,
    });
  }

  /* =====================================================================
     ZERO-LATENCY SYNTHESIZED WEB AUDIO SOUND EFFECTS
  ===================================================================== */

  /**
   * Light wooden click sound for buttons.
   */
  playClickSound() {
    if (this.sfxMuted) return;
    this.initContext();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const now = this.audioCtx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.06);

      gain.gain.setValueAtTime(this.sfxVolume * 0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch (e) {
      // AudioCtx not ready or unsupported
    }
  }

  /**
   * Cartoon bug placement pop sound with pitch bend.
   */
  playPlaceSound() {
    if (this.sfxMuted) return;
    this.initContext();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      // Bouncy wood-block chirp
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.16);

      gain.gain.setValueAtTime(this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch (e) {}
  }

  /**
   * Selection blip when picking avatars or changing settings.
   */
  playSelectSound() {
    if (this.sfxMuted) return;
    this.initContext();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.07);

      gain.gain.setValueAtTime(this.sfxVolume * 0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch (e) {}
  }

  /**
   * Joyful victory fanfare arpeggio (C-E-G-C major chords).
   */
  playWinSound() {
    if (this.sfxMuted) return;
    this.initContext();
    if (!this.audioCtx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        const noteStart = this.audioCtx.currentTime + i * 0.12;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0, noteStart);
        gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.8, noteStart + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.35);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 0.35);
      });
    } catch (e) {}
  }

  /**
   * Comedic gentle slide whistle for tie games.
   */
  playDrawSound() {
    if (this.sfxMuted) return;
    this.initContext();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.linearRampToValueAtTime(300, now + 0.2);
      osc.frequency.linearRampToValueAtTime(360, now + 0.35);
      osc.frequency.linearRampToValueAtTime(220, now + 0.55);

      gain.gain.setValueAtTime(this.sfxVolume * 0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.6);
    } catch (e) {}
  }
}

export const audioService = new AudioEngine();
export default audioService;
