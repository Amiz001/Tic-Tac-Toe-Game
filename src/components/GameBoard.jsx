import React from 'react';
import { getAvatarById } from '../config/avatars';
import audioService from '../services/audioService';
import './GameBoard.css';

/**
 * GameBoard Component matching the reference artwork:
 * - Puzzle Board.webp wooden frame with vines, ropes, and leaves
 * - 3D Cartoon "TIC-TAC-TOE" banner centered on the top branch
 * - Interactive Red "X" exit button on top-right leaf cluster
 * - 3x3 interactive cell grid positioned over parchment area
 * - Winning line animation and ghost previews on hover
 */
export default function GameBoard({
  board,
  onCellClick,
  winningLine,
  currentTurn,
  player1,
  player2,
  onExitGame,
  isAiThinking,
}) {
  const currentAvatar =
    currentTurn === 'p1'
      ? getAvatarById(player1.avatarId)
      : getAvatarById(player2.avatarId);

  return (
    <div className="game-board-wrapper">
      {/* 3D Jungle Wooden Header Banner */}
      <div className="board-header-banner">
        <h1 className="game-title">TIC-TAC-TOE</h1>
      </div>

      {/* Frame Container with Puzzle Board.webp */}
      <div className="board-frame-container">
        <img
          src="/images/Puzzle Board.webp"
          alt="Wooden Tic Tac Toe Frame"
          className="board-frame-bg"
          draggable={false}
        />

        {/* Top-Right Red "X" Exit Button Hotspot */}
        <button
          type="button"
          className="board-exit-btn"
          title="Exit to Main Menu"
          onClick={() => {
            audioService.playClickSound();
            onExitGame();
          }}
        >
          <span className="sr-only">Exit Game</span>
        </button>

        {/* 3x3 Interactive Play Grid aligned on parchment */}
        <div className="parchment-grid">
          {board.map((cellValue, index) => {
            const isWinningCell = winningLine && winningLine.includes(index);
            const isOccupied = cellValue !== null;
            const cellAvatar = cellValue
              ? cellValue === 'p1'
                ? getAvatarById(player1.avatarId)
                : getAvatarById(player2.avatarId)
              : null;

            return (
              <button
                key={index}
                type="button"
                className={`grid-cell cell-${index} ${
                  isOccupied ? 'occupied' : 'empty'
                } ${isWinningCell ? 'winning-cell' : ''}`}
                disabled={isOccupied || isAiThinking}
                onClick={() => {
                  if (!isOccupied && !isAiThinking) {
                    audioService.playPlaceSound();
                    onCellClick(index);
                  }
                }}
              >
                {/* Placed Avatar */}
                {isOccupied && cellAvatar && (
                  <div className="cell-marker-container">
                    {cellAvatar.type === 'image' ? (
                      <img
                        src={cellAvatar.src}
                        alt={cellAvatar.name}
                        className="cell-bug-img"
                        draggable={false}
                      />
                    ) : (
                      <span
                        className="cell-symbol"
                        style={{ color: cellAvatar.color }}
                      >
                        {cellAvatar.symbol}
                      </span>
                    )}
                  </div>
                )}

                {/* Ghost preview on hover for empty cells */}
                {!isOccupied && !isAiThinking && (
                  <div className="cell-ghost-preview">
                    {currentAvatar.type === 'image' ? (
                      <img
                        src={currentAvatar.src}
                        alt="preview"
                        className="ghost-bug-img"
                        draggable={false}
                      />
                    ) : (
                      <span
                        className="ghost-symbol"
                        style={{ color: currentAvatar.color }}
                      >
                        {currentAvatar.symbol}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
