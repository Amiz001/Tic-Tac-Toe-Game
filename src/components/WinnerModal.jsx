import React from 'react';
import { getAvatarById } from '../config/avatars';
import audioService from '../services/audioService';
import './WinnerModal.css';

/**
 * Celebration modal when a round concludes (Win or Draw).
 */
export default function WinnerModal({
  winnerInfo,
  player1,
  player2,
  onPlayAgain,
  onExit,
}) {
  if (!winnerInfo) return null;

  const isDraw = winnerInfo.isDraw;
  const winnerPlayer = winnerInfo.winner === 'p1' ? player1 : player2;
  const avatar = winnerPlayer ? getAvatarById(winnerPlayer.avatarId) : null;

  return (
    <div className="winner-backdrop">
      {/* Celebratory cartoon particle bursts for victory */}
      {!isDraw && (
        <div className="confetti-container" aria-hidden="true">
          {[...Array(16)].map((_, i) => (
            <span key={i} className={`confetti-piece confetti-${i % 4}`} style={{
              left: `${10 + (i * 5.2)}%`,
              animationDelay: `${(i % 5) * 0.15}s`,
              transform: `rotate(${(i * 45) % 360}deg)`
            }} />
          ))}
        </div>
      )}

      <div className="winner-dialog">
        {/* Banner Header */}
        <div className="winner-banner">
          <h2 className="winner-banner-text">
            {isDraw ? 'IT IS A DRAW!' : 'WINNER!'}
          </h2>
        </div>

        <div className="winner-body">
          {!isDraw && avatar && (
            <div className="winner-avatar-showcase">
              <div className="winner-trophy-ring">
                {avatar.type === 'image' ? (
                  <img
                    src={avatar.src}
                    alt={avatar.name}
                    className="winner-bug-img"
                  />
                ) : (
                  <span
                    className="winner-symbol"
                    style={{ color: avatar.color }}
                  >
                    {avatar.symbol}
                  </span>
                )}
              </div>
              <h3 className="winner-player-name">{winnerPlayer.name}</h3>
              <p className="winner-subtext">Victorious Champion!</p>
            </div>
          )}

          {isDraw && (
            <div className="draw-showcase">
              <div className="draw-icons-duo">
                <img
                  src={getAvatarById(player1.avatarId).src || '/images/bug_red.webp'}
                  alt="p1"
                  className="draw-bug-thumb"
                />
                <span className="draw-vs">⚔️</span>
                <img
                  src={getAvatarById(player2.avatarId).src || '/images/bug5.webp'}
                  alt="p2"
                  className="draw-bug-thumb"
                />
              </div>
              <p className="draw-subtext">A fierce battle! Both bugs tied evenly!</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="winner-actions">
            <button
              type="button"
              className="wood-action-btn btn-play-again"
              onClick={() => {
                audioService.playClickSound();
                onPlayAgain();
              }}
            >
              🔄 PLAY AGAIN
            </button>
            <button
              type="button"
              className="wood-action-btn btn-exit-menu"
              onClick={() => {
                audioService.playClickSound();
                onExit();
              }}
            >
              🚪 EXIT GAME
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
