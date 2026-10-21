import React from 'react';
import { getAvatarById } from '../config/avatars';
import './ScoreCard.css';

/**
 * Player Score Card matching the reference artwork:
 * - Cartoon header label ("PLAYER 1" / "PLAYER 2" or custom names)
 * - Wooden square frame displaying the selected avatar
 * - Overlapping glossy red circular score badge with green leaves
 * - Active turn highlighting with subtle bounce and leaf glow
 */
export default function ScoreCard({
  playerNumber, // 1 or 2
  playerName,
  avatarId,
  score,
  isActiveTurn,
  isWinner,
}) {
  const avatar = getAvatarById(avatarId);

  return (
    <div
      className={`scorecard-container scorecard-p${playerNumber} ${
        isActiveTurn ? 'active-turn' : ''
      } ${isWinner ? 'winner-card' : ''}`}
    >
      {/* Player Header Title */}
      <div className="scorecard-title">
        {playerName.toUpperCase()}
      </div>

      {/* Wooden Square Frame */}
      <div className="scorecard-frame">
        <div className="scorecard-avatar-well">
          {avatar.type === 'image' ? (
            <img
              src={avatar.src}
              alt={avatar.name}
              className="scorecard-avatar-img"
            />
          ) : (
            <span
              className="scorecard-avatar-symbol"
              style={{ color: avatar.color }}
            >
              {avatar.symbol}
            </span>
          )}
        </div>

        {/* Glossy Red Score Badge with Green Leaves (as seen in reference art) */}
        <div className="score-badge-wrapper">
          {/* Decorative Green Leaves behind badge */}
          <svg className="badge-leaves-svg" viewBox="0 0 70 70">
            <path
              d="M 32 36 C 45 20, 68 22, 66 40 C 64 54, 46 56, 32 36 Z"
              fill="#52af1d"
              stroke="#2c690a"
              strokeWidth="2"
            />
            <path
              d="M 36 32 C 24 16, 2 24, 6 42 C 10 56, 26 52, 36 32 Z"
              fill="#62c422"
              stroke="#2c690a"
              strokeWidth="2"
            />
            <path
              d="M 34 38 C 48 54, 38 68, 22 64 C 14 56, 22 42, 34 38 Z"
              fill="#429a14"
              stroke="#1e4e06"
              strokeWidth="2"
            />
          </svg>

          {/* Red circular badge */}
          <div className="score-badge-circle">
            <span className="score-badge-number">{score}</span>
          </div>
        </div>

        {/* Turn indicator glow pill */}
        {isActiveTurn && (
          <div className="turn-indicator-pill">
            <span>TURN</span>
          </div>
        )}
      </div>
    </div>
  );
}
