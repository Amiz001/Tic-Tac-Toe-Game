import React, { useState } from 'react';
import { AVATARS, DEFAULT_P1_AVATAR, DEFAULT_P2_AVATAR } from '../config/avatars';
import audioService from '../services/audioService';
import './SetupModal.css';

/**
 * Pre-Game Customization Modal:
 * Allows players to choose game mode (Single Player vs AI / Two Players Manual),
 * names, AI difficulty, and avatars with mutual exclusion check.
 */
export default function SetupModal({
  isOpen,
  onStartGame,
  hasSavedGame,
  onResumeSavedGame,
  initialSettings,
}) {
  if (!isOpen) return null;

  const [mode, setMode] = useState(initialSettings?.gameMode || 'single');
  const [difficulty, setDifficulty] = useState(initialSettings?.difficulty || 'medium');

  const [p1Name, setP1Name] = useState(initialSettings?.player1?.name || 'Player 1');
  const [p1Avatar, setP1Avatar] = useState(initialSettings?.player1?.avatarId || DEFAULT_P1_AVATAR);

  const [p2Name, setP2Name] = useState(
    initialSettings?.player2?.name || (mode === 'single' ? 'BugBot' : 'Player 2')
  );
  const [p2Avatar, setP2Avatar] = useState(initialSettings?.player2?.avatarId || DEFAULT_P2_AVATAR);

  const handleModeChange = (newMode) => {
    audioService.playClickSound();
    setMode(newMode);
    if (newMode === 'single') {
      setP2Name('BugBot');
    } else if (p2Name === 'BugBot') {
      setP2Name('Player 2');
    }
  };

  const handleSelectP1Avatar = (avatarId) => {
    if (avatarId === p2Avatar) {
      // Cannot choose same avatar
      return;
    }
    audioService.playSelectSound();
    setP1Avatar(avatarId);
  };

  const handleSelectP2Avatar = (avatarId) => {
    if (avatarId === p1Avatar) {
      // Cannot choose same avatar
      return;
    }
    audioService.playSelectSound();
    setP2Avatar(avatarId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    audioService.playClickSound();
    audioService.startBGM();

    onStartGame({
      gameMode: mode,
      difficulty,
      player1: {
        name: p1Name.trim() || 'Player 1',
        avatarId: p1Avatar,
      },
      player2: {
        name: p2Name.trim() || (mode === 'single' ? 'BugBot' : 'Player 2'),
        avatarId: p2Avatar,
      },
    });
  };

  return (
    <div className="setup-backdrop">
      <div className="setup-dialog">
        {/* Wooden banner header */}
        <div className="setup-header">
          <h2 className="setup-title">GAME SETUP</h2>
        </div>

        <form onSubmit={handleSubmit} className="setup-form">
          {/* Mode Selector */}
          <div className="setup-section">
            <span className="section-label">SELECT GAME MODE</span>
            <div className="mode-toggle-group">
              <button
                type="button"
                className={`mode-btn ${mode === 'single' ? 'active' : ''}`}
                onClick={() => handleModeChange('single')}
              >
                🎮 1 PLAYER (VS BOT)
              </button>
              <button
                type="button"
                className={`mode-btn ${mode === 'multi' ? 'active' : ''}`}
                onClick={() => handleModeChange('multi')}
              >
                👥 2 PLAYERS (MANUAL)
              </button>
            </div>
          </div>

          {/* Single Player Difficulty */}
          {mode === 'single' && (
            <div className="setup-section difficulty-section">
              <span className="section-label">BOT DIFFICULTY</span>
              <div className="difficulty-buttons">
                {['easy', 'medium', 'master'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    className={`diff-btn ${difficulty === lvl ? 'active' : ''}`}
                    onClick={() => {
                      audioService.playSelectSound();
                      setDifficulty(lvl);
                    }}
                  >
                    {lvl === 'easy' && '🌱 EASY'}
                    {lvl === 'medium' && '⚔️ MEDIUM'}
                    {lvl === 'master' && '👑 MASTER (MINIMAX)'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Players Customization Grid */}
          <div className="players-config-grid">
            {/* Player 1 Card */}
            <div className="player-config-card p1-card">
              <div className="card-badge p1-badge">PLAYER 1</div>
              <input
                type="text"
                className="name-input"
                value={p1Name}
                maxLength={14}
                onChange={(e) => setP1Name(e.target.value)}
                placeholder="Player 1 Name"
                required
              />

              <div className="avatar-selection-label">Choose Avatar:</div>
              <div className="avatar-picker-grid">
                {AVATARS.map((av) => {
                  const isSelected = p1Avatar === av.id;
                  const isOpponentSelected = p2Avatar === av.id;

                  return (
                    <button
                      key={av.id}
                      type="button"
                      disabled={isOpponentSelected}
                      title={
                        isOpponentSelected
                          ? `${av.name} is taken by Player 2`
                          : av.name
                      }
                      className={`avatar-option-btn ${isSelected ? 'selected' : ''} ${
                        isOpponentSelected ? 'disabled' : ''
                      }`}
                      onClick={() => handleSelectP1Avatar(av.id)}
                    >
                      {av.type === 'image' ? (
                        <img src={av.src} alt={av.name} className="avatar-thumb-img" />
                      ) : (
                        <span className="avatar-thumb-symbol" style={{ color: av.color }}>
                          {av.symbol}
                        </span>
                      )}
                      {isSelected && <span className="selection-checkmark">✓</span>}
                      {isOpponentSelected && <span className="taken-lock">🔒</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Player 2 Card */}
            <div className="player-config-card p2-card">
              <div className="card-badge p2-badge">
                {mode === 'single' ? 'SYSTEM (AI)' : 'PLAYER 2'}
              </div>
              <input
                type="text"
                className="name-input"
                value={p2Name}
                maxLength={14}
                disabled={mode === 'single'}
                onChange={(e) => setP2Name(e.target.value)}
                placeholder={mode === 'single' ? 'BugBot' : 'Player 2 Name'}
                required
              />

              <div className="avatar-selection-label">Choose Avatar:</div>
              <div className="avatar-picker-grid">
                {AVATARS.map((av) => {
                  const isSelected = p2Avatar === av.id;
                  const isOpponentSelected = p1Avatar === av.id;

                  return (
                    <button
                      key={av.id}
                      type="button"
                      disabled={isOpponentSelected}
                      title={
                        isOpponentSelected
                          ? `${av.name} is taken by Player 1`
                          : av.name
                      }
                      className={`avatar-option-btn ${isSelected ? 'selected' : ''} ${
                        isOpponentSelected ? 'disabled' : ''
                      }`}
                      onClick={() => handleSelectP2Avatar(av.id)}
                    >
                      {av.type === 'image' ? (
                        <img src={av.src} alt={av.name} className="avatar-thumb-img" />
                      ) : (
                        <span className="avatar-thumb-symbol" style={{ color: av.color }}>
                          {av.symbol}
                        </span>
                      )}
                      {isSelected && <span className="selection-checkmark">✓</span>}
                      {isOpponentSelected && <span className="taken-lock">🔒</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="setup-actions">
            {hasSavedGame && (
              <button
                type="button"
                className="wood-btn btn-resume"
                onClick={() => {
                  audioService.playClickSound();
                  audioService.startBGM();
                  onResumeSavedGame();
                }}
              >
                💾 RESUME SAVED GAME
              </button>
            )}
            <button type="submit" className="wood-btn btn-start">
              🚀 PLAY NOW
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
