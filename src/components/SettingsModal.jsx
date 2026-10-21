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
          {/* Sound toggles */}
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
