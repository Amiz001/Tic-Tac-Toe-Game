import React, { useState, useEffect, useRef, useCallback } from 'react';
import BackgroundSky from './components/BackgroundSky';
import GameBoard from './components/GameBoard';
import ScoreCard from './components/ScoreCard';
import Controls from './components/Controls';
import SetupModal from './components/SetupModal';
import SettingsModal from './components/SettingsModal';
import WinnerModal from './components/WinnerModal';
import { checkWinner, getAIMove } from './utils/gameLogic';
import {
  saveGameState,
  loadGameState,
  clearGameState,
} from './services/storageService';
import audioService from './services/audioService';
import { DEFAULT_P1_AVATAR, DEFAULT_P2_AVATAR } from './config/avatars';
import './App.css';

export default function App() {
  const initialCache = useRef(loadGameState());

  const [hasSavedGame, setHasSavedGame] = useState(Boolean(initialCache.current));
  const [isSetupOpen, setIsSetupOpen] = useState(!initialCache.current);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Game Settings & State
  const [gameMode, setGameMode] = useState(initialCache.current?.gameMode || 'single');
  const [difficulty, setDifficulty] = useState(initialCache.current?.difficulty || 'medium');
  const [player1, setPlayer1] = useState(
    initialCache.current?.player1 || {
      name: 'Player 1',
      avatarId: DEFAULT_P1_AVATAR,
      score: 0,
    }
  );
  const [player2, setPlayer2] = useState(
    initialCache.current?.player2 || {
      name: 'BugBot',
      avatarId: DEFAULT_P2_AVATAR,
      score: 0,
    }
  );

  const [board, setBoard] = useState(
    initialCache.current?.board || Array(9).fill(null)
  );
  const [currentTurn, setCurrentTurn] = useState(
    initialCache.current?.currentTurn || 'p1'
  );
  const [winnerInfo, setWinnerInfo] = useState(
    initialCache.current?.winnerInfo || null
  );

  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isBgmActive, setIsBgmActive] = useState(!audioService.bgmMuted);

  // Sync state to LocalStorage with TTL
  const persist = useCallback(() => {
    saveGameState({
      gameMode,
      difficulty,
      player1,
      player2,
      board,
      currentTurn,
      winnerInfo,
    });
  }, [gameMode, difficulty, player1, player2, board, currentTurn, winnerInfo]);

  useEffect(() => {
    if (!isSetupOpen) {
      persist();
    }
  }, [persist, isSetupOpen]);

  // Handle cell click by human player
  const handleCellClick = (index) => {
    if (board[index] !== null || winnerInfo !== null || isAiThinking) return;

    const newBoard = [...board];
    newBoard[index] = currentTurn;
    setBoard(newBoard);

    const result = checkWinner(newBoard);

    if (result.winner || result.isDraw) {
      handleGameConclusion(result);
    } else {
      setCurrentTurn(currentTurn === 'p1' ? 'p2' : 'p1');
    }
  };

  // Handle game conclusion (win or draw)
  const handleGameConclusion = (result) => {
    setWinnerInfo(result);

    if (result.winner === 'p1') {
      audioService.playWinSound();
      setPlayer1((prev) => ({ ...prev, score: prev.score + 1 }));
    } else if (result.winner === 'p2') {
      audioService.playWinSound();
      setPlayer2((prev) => ({ ...prev, score: prev.score + 1 }));
    } else if (result.isDraw) {
      audioService.playDrawSound();
    }
  };

  // AI Turn effect for Single Player mode
  useEffect(() => {
    if (
      gameMode === 'single' &&
      currentTurn === 'p2' &&
      winnerInfo === null &&
      !isSetupOpen
    ) {
      setIsAiThinking(true);

      const aiTimer = setTimeout(() => {
        const move = getAIMove(board, 'p2', 'p1', difficulty);
        if (move !== null && board[move] === null) {
          audioService.playPlaceSound();
          const newBoard = [...board];
          newBoard[move] = 'p2';
          setBoard(newBoard);

          const result = checkWinner(newBoard);
          if (result.winner || result.isDraw) {
            handleGameConclusion(result);
          } else {
            setCurrentTurn('p1');
          }
        }
        setIsAiThinking(false);
      }, 550); // Natural thinking cadence

      return () => clearTimeout(aiTimer);
    }
  }, [currentTurn, gameMode, winnerInfo, board, difficulty, isSetupOpen]);

  // Start new game from SetupModal
  const handleStartGame = ({ gameMode: newMode, difficulty: newDiff, player1: newP1, player2: newP2 }) => {
    setGameMode(newMode);
    setDifficulty(newDiff);
    setPlayer1({ ...newP1, score: 0 });
    setPlayer2({ ...newP2, score: 0 });
    setBoard(Array(9).fill(null));
    setCurrentTurn('p1');
    setWinnerInfo(null);
    setIsSetupOpen(false);
    setHasSavedGame(false);
  };

  // Resume saved game
  const handleResumeSavedGame = () => {
    const saved = loadGameState();
    if (saved) {
      setGameMode(saved.gameMode);
      setDifficulty(saved.difficulty);
      setPlayer1(saved.player1);
      setPlayer2(saved.player2);
      setBoard(saved.board);
      setCurrentTurn(saved.currentTurn);
      setWinnerInfo(saved.winnerInfo);
    }
    setIsSetupOpen(false);
  };

  // Restart current round (retains player scores)
  const handleRestartBoard = () => {
    setBoard(Array(9).fill(null));
    setWinnerInfo(null);
    setCurrentTurn('p1');
  };

  // Reset scores to 0
  const handleResetScores = () => {
    setPlayer1((prev) => ({ ...prev, score: 0 }));
    setPlayer2((prev) => ({ ...prev, score: 0 }));
    handleRestartBoard();
  };

  // Exit game and wipe session cache
  const handleExitGame = () => {
    if (window.confirm('Do you want to exit the current game? This will reset the match.')) {
      clearGameState();
      setHasSavedGame(false);
      handleRestartBoard();
      setIsSetupOpen(true);
    }
  };

  // Toggle background music
  const handleToggleBGM = () => {
    const active = audioService.toggleBGM();
    setIsBgmActive(active);
  };

  return (
    <BackgroundSky>
      <main className="game-desktop-stage">
        {/* Main Board Section with Side Controls */}
        <div className="board-and-controls-row">
          <GameBoard
            board={board}
            onCellClick={handleCellClick}
            winningLine={winnerInfo?.line}
            currentTurn={currentTurn}
            player1={player1}
            player2={player2}
            onExitGame={handleExitGame}
            isAiThinking={isAiThinking}
          />

          <Controls
            isBgmActive={isBgmActive}
            onToggleAudio={handleToggleBGM}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onRestartBoard={handleRestartBoard}
          />
        </div>

        {/* Bottom Player Score Cards */}
        <div className="scorecards-row">
          <ScoreCard
            playerNumber={1}
            playerName={player1.name}
            avatarId={player1.avatarId}
            score={player1.score}
            isActiveTurn={currentTurn === 'p1' && !winnerInfo}
            isWinner={winnerInfo?.winner === 'p1'}
          />

          <ScoreCard
            playerNumber={2}
            playerName={player2.name}
            avatarId={player2.avatarId}
            score={player2.score}
            isActiveTurn={currentTurn === 'p2' && !winnerInfo}
            isWinner={winnerInfo?.winner === 'p2'}
          />
        </div>
      </main>

      {/* Pre-Game Setup Modal */}
      <SetupModal
        isOpen={isSetupOpen}
        onStartGame={handleStartGame}
        hasSavedGame={hasSavedGame}
        onResumeSavedGame={handleResumeSavedGame}
        initialSettings={{
          gameMode,
          difficulty,
          player1,
          player2,
        }}
      />

      {/* In-Game Settings / Menu Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        gameMode={gameMode}
        difficulty={difficulty}
        onChangeDifficulty={setDifficulty}
        onResetScores={handleResetScores}
        onOpenSetup={() => {
          setIsSettingsOpen(false);
          setIsSetupOpen(true);
        }}
        isBgmActive={isBgmActive}
        onToggleBGM={handleToggleBGM}
      />

      {/* Winner Celebration Modal */}
      <WinnerModal
        winnerInfo={winnerInfo}
        player1={player1}
        player2={player2}
        onPlayAgain={handleRestartBoard}
        onExit={handleExitGame}
      />
    </BackgroundSky>
  );
}
