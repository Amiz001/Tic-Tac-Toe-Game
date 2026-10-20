/**
 * Core Tic-Tac-Toe Game Logic, Win Detection, and AI Engine.
 */

export const WINNING_COMBINATIONS = [
  // Rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Columns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonals
  [0, 4, 8],
  [2, 4, 6],
];

/**
 * Evaluates the current board for a winner or tie.
 * @param {Array<string|null>} board - 9-element array ('p1', 'p2', or null)
 * @returns {{ winner: 'p1'|'p2'|null, line: number[]|null, isDraw: boolean }}
 */
export function checkWinner(board) {
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        winner: board[a],
        line: combination,
        isDraw: false,
      };
    }
  }

  const isFull = board.every((cell) => cell !== null);
  if (isFull) {
    return {
      winner: null,
      line: null,
      isDraw: true,
    };
  }

  return {
    winner: null,
    line: null,
    isDraw: false,
  };
}

/**
 * Returns available move indices on the board.
 * @param {Array<string|null>} board
 * @returns {number[]}
 */
export function getAvailableMoves(board) {
  const moves = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      moves.push(i);
    }
  }
  return moves;
}

/**
 * Minimax recursive algorithm with depth weighting for unbeatable AI.
 * @param {Array<string|null>} newBoard
 * @param {string} player - Current player in simulation ('p1' or 'p2')
 * @param {string} aiPlayer - The AI's symbol
 * @param {string} humanPlayer - The human's symbol
 * @param {number} depth - Recursion depth
 * @returns {{ score: number, index?: number }}
 */
function minimax(newBoard, player, aiPlayer, humanPlayer, depth = 0) {
  const availableMoves = getAvailableMoves(newBoard);
  const result = checkWinner(newBoard);

  if (result.winner === aiPlayer) {
    return { score: 10 - depth };
  } else if (result.winner === humanPlayer) {
    return { score: depth - 10 };
  } else if (result.isDraw || availableMoves.length === 0) {
    return { score: 0 };
  }

  const moves = [];

  for (let i = 0; i < availableMoves.length; i++) {
    const index = availableMoves[i];
    newBoard[index] = player;

    let moveResult;
    if (player === aiPlayer) {
      moveResult = minimax(newBoard, humanPlayer, aiPlayer, humanPlayer, depth + 1);
      moves.push({ index, score: moveResult.score });
    } else {
      moveResult = minimax(newBoard, aiPlayer, aiPlayer, humanPlayer, depth + 1);
      moves.push({ index, score: moveResult.score });
    }

    newBoard[index] = null; // Backtrack
  }

  let bestMoveIndex = 0;
  if (player === aiPlayer) {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMoveIndex = i;
      }
    }
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMoveIndex = i;
      }
    }
  }

  return moves[bestMoveIndex];
}

/**
 * Calculates the next AI move based on chosen difficulty.
 * @param {Array<string|null>} board
 * @param {string} aiPlayer - 'p2'
 * @param {string} humanPlayer - 'p1'
 * @param {'easy'|'medium'|'master'} difficulty
 * @returns {number|null} Best move index (0-8)
 */
export function getAIMove(board, aiPlayer = 'p2', humanPlayer = 'p1', difficulty = 'master') {
  const available = getAvailableMoves(board);
  if (available.length === 0) return null;

  // 1. EASY: 70% random, 30% smart move
  if (difficulty === 'easy') {
    if (Math.random() < 0.7) {
      const randomIndex = Math.floor(Math.random() * available.length);
      return available[randomIndex];
    }
  }

  // 2. MEDIUM: Blocks immediate win, takes winning move, else semi-random
  if (difficulty === 'medium') {
    // Check if AI can win immediately
    for (const move of available) {
      const copy = [...board];
      copy[move] = aiPlayer;
      if (checkWinner(copy).winner === aiPlayer) {
        return move;
      }
    }

    // Check if human can win immediately and block them
    for (const move of available) {
      const copy = [...board];
      copy[move] = humanPlayer;
      if (checkWinner(copy).winner === humanPlayer) {
        return move;
      }
    }

    // Prefer center if available
    if (board[4] === null && Math.random() < 0.6) {
      return 4;
    }

    // Prefer corners if available
    const corners = [0, 2, 6, 8].filter((c) => board[c] === null);
    if (corners.length > 0 && Math.random() < 0.5) {
      return corners[Math.floor(Math.random() * corners.length)];
    }

    // Otherwise random
    return available[Math.floor(Math.random() * available.length)];
  }

  // 3. MASTER: Unbeatable Minimax
  // Optimization for first move on empty board to eliminate recursion overhead
  if (available.length === 9) {
    const openings = [0, 2, 4, 6, 8];
    return openings[Math.floor(Math.random() * openings.length)];
  }

  const best = minimax([...board], aiPlayer, aiPlayer, humanPlayer, 0);
  return best ? best.index : available[0];
}
