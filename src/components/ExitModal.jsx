import React from 'react';
import audioService from '../services/audioService';
import './ExitModal.css';

/**
 * Custom Exit Confirmation Modal matching the game's cartoon aesthetic.
 * Replaces generic browser window.confirm with wooden buttons and playful styling.
 */
export default function ExitModal({
  isOpen,
  onConfirm,
  onCancel,
  title = 'EXIT GAME?',
  message = 'Are you sure you want to leave? Your active round and cached progress will be cleared.',
}) {
  if (!isOpen) return null;

  return (
    <div className="exit-modal-backdrop" onClick={onCancel}>
      <div
        className="exit-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Wooden Header Banner */}
        <div className="exit-modal-header">
          <h2 className="exit-modal-title">{title}</h2>
        </div>

        <div className="exit-modal-body">
          {/* Animated Bug Warning Icon */}
          <div className="exit-modal-icon-badge">
            <span className="exit-modal-emoji" role="img" aria-label="warning">
              🍃
            </span>
            <img
              src="/images/bug_red.webp"
              alt="Bug Warning"
              className="exit-modal-bug-img"
            />
            <span className="exit-modal-question">?</span>
          </div>

          <p className="exit-modal-text">{message}</p>

          {/* Action Buttons */}
          <div className="exit-modal-actions">
            <button
              type="button"
              className="exit-btn btn-stay"
              onClick={() => {
                audioService.playClickSound();
                onCancel();
              }}
            >
              🎮 STAY & PLAY
            </button>
            <button
              type="button"
              className="exit-btn btn-confirm-exit"
              onClick={() => {
                audioService.playClickSound();
                onConfirm();
              }}
            >
              🚪 YES, EXIT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
