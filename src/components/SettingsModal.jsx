import React from 'react';
import audioService from '../services/audioService';
import './SettingsModal.css';

/**
 * Settings / Pause Modal:
 * Controls sound volumes, bot difficulty, rules, score resetting, and exiting.
 */
export default function SettingsModal({
  isOpen,
  onClose,
  gameMode,
  difficulty,
  onChangeDifficulty,
  onResetScores,
  onOpenSetup,
  isBgmActive,
  onToggleBGM,
}) {
  if (!isOpen) return null;

  return (
    <div className="settings-backdrop">
      <div className="settings-dialog">
        <div className="settings-header">
          <h2 className="settings-title">GAME SETTINGS</h2>
          <button
            type="button"
            className="settings-close-x"
            onClick={() => {
              audioService.playClickSound();
              onClose();
            }}
          >
            ✕
          </button>
        </div>

        <div className="settings-body">
          {/* Sound & Music Toggles & Sliders */}
          <div className="settings-section-card">
            <div className="settings-row">
              <span className="settings-label">BACKGROUND MUSIC</span>
              <button
                type="button"
                className={`toggle-pill-btn ${isBgmActive ? 'on' : 'off'}`}
                onClick={() => {
                  audioService.playClickSound();
                  onToggleBGM();
                }}
              >
                {isBgmActive ? '🔊 ON' : '🔇 MUTED'}
              </button>
            </div>
            <div className="slider-row">
              <span className="slider-label">Music Volume:</span>
              <input
                type="range"
                min="0"
                max="100"
                defaultValue={Math.round(audioService.bgmVolume * 100)}
                onChange={(e) => audioService.setBGMVolume(Number(e.target.value) / 100)}
                className="volume-slider"
              />
            </div>
          </div>

          <div className="settings-section-card">
            <div className="settings-row">
              <span className="settings-label">SOUND EFFECTS (SFX)</span>
              <button
                type="button"
                className={`toggle-pill-btn ${!audioService.sfxMuted ? 'on' : 'off'}`}
                onClick={() => {
                  audioService.toggleSFX();
                  audioService.playClickSound();
                }}
              >
                {!audioService.sfxMuted ? '🔔 ON' : '🔕 MUTED'}
              </button>
            </div>
            <div className="slider-row">
              <span className="slider-label">SFX Volume:</span>
              <input
                type="range"
                min="0"
                max="100"
                defaultValue={Math.round(audioService.sfxVolume * 100)}
                onChange={(e) => {
                  audioService.setSFXVolume(Number(e.target.value) / 100);
                  audioService.playClickSound();
                }}
                className="volume-slider"
              />
            </div>
          </div>

          {/* Difficulty (Single Player only) */}
          {gameMode === 'single' && (
            <div className="settings-row">
              <span className="settings-label">BOT DIFFICULTY</span>
              <div className="settings-diff-group">
                {['easy', 'medium', 'master'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    className={`diff-opt-btn ${difficulty === lvl ? 'active' : ''}`}
                    onClick={() => {
                      audioService.playSelectSound();
                      onChangeDifficulty(lvl);
                    }}
                  >
                    {lvl.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="settings-actions-stack">
            <button
              type="button"
              className="settings-action-btn btn-reset-score"
              onClick={() => {
                audioService.playClickSound();
                if (window.confirm('Reset all scores to 0?')) {
                  onResetScores();
                  onClose();
                }
              }}
            >
              🏆 RESET SCORES
            </button>

            <button
              type="button"
              className="settings-action-btn btn-change-mode"
              onClick={() => {
                audioService.playClickSound();
                onClose();
                onOpenSetup();
              }}
            >
              👥 CHANGE MODE & AVATARS
            </button>

            <button
              type="button"
              className="settings-action-btn btn-resume-play"
              onClick={() => {
                audioService.playClickSound();
                onClose();
              }}
            >
              ▶️ RESUME GAME
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
