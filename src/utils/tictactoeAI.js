// src/utils/tictactoeAI.js

export const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // filas
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columnas
  [0, 4, 8], [2, 4, 6],            // diagonales
]

export const HUMAN = 'X'
export const AI = 'O'

/**
 * Verifica si hay un ganador en el tablero.
 * @returns { winner: 'X' | 'O' | null, line: number[] | null }
 */
export const calculateWinner = (board) => {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line }
    }
  }
  return { winner: null, line: null }
}

/**
 * Verifica si el tablero está lleno (empate).
 */
export const isBoardFull = (board) => board.every((cell) => cell !== null)

/**
 * Evalúa el tablero desde la perspectiva de la IA.
 * +10 si gana la IA, -10 si gana el humano, 0 en otro caso.
 */
const evaluate = (board) => {
  const { winner } = calculateWinner(board)
  if (winner === AI) return 10
  if (winner === HUMAN) return -10
  return 0
}

/**
 * Minimax con poda Alfa-Beta.
 * @param board - estado actual del tablero
 * @param depth - profundidad de recursión (para priorizar victorias rápidas)
 * @param isMaximizing - true si es turno de la IA, false si es del humano
 * @param alpha - mejor valor ya garantizado para el maximizador
 * @param beta - mejor valor ya garantizado para el minimizador
 */
const minimax = (board, depth, isMaximizing, alpha, beta) => {
  const score = evaluate(board)

  // Casos base: victoria, derrota o empate
  if (score === 10) return score - depth // victoria más rápida = mejor
  if (score === -10) return score + depth // derrota más tardía = menos mala
  if (isBoardFull(board)) return 0 // empate

  if (isMaximizing) {
    let best = -Infinity
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = AI
        const value = minimax(board, depth + 1, false, alpha, beta)
        board[i] = null
        best = Math.max(best, value)
        alpha = Math.max(alpha, best)
        if (beta <= alpha) break // poda
      }
    }
    return best
  } else {
    let best = Infinity
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = HUMAN
        const value = minimax(board, depth + 1, true, alpha, beta)
        board[i] = null
        best = Math.min(best, value)
        beta = Math.min(beta, best)
        if (beta <= alpha) break // poda
      }
    }
    return best
  }
}

/**
 * Devuelve el mejor movimiento para la IA.
 * Si hay varios con el mismo puntaje, elige uno al azar para variar el juego.
 */
export const getBestMove = (board, difficulty = 'hard') => {
  // Nivel fácil: 30% de las veces juega aleatorio
  if (difficulty === 'easy' && Math.random() < 0.3) {
    return getRandomMove(board)
  }

  // Nivel medio: 10% de las veces juega aleatorio
  if (difficulty === 'medium' && Math.random() < 0.1) {
    return getRandomMove(board)
  }

  // Nivel difícil: Minimax perfecto
  let bestScore = -Infinity
  let bestMoves = []

  for (let i = 0; i < 9; i++) {
    if (board[i] === null) {
      const boardCopy = [...board]
      boardCopy[i] = AI
      const score = minimax(boardCopy, 0, false, -Infinity, Infinity)

      if (score > bestScore) {
        bestScore = score
        bestMoves = [i]
      } else if (score === bestScore) {
        bestMoves.push(i)
      }
    }
  }

  // Elegir un movimiento al azar entre los mejores (para variabilidad)
  return bestMoves[Math.floor(Math.random() * bestMoves.length)]
}

const getRandomMove = (board) => {
  const empty = board
    .map((cell, i) => (cell === null ? i : null))
    .filter((i) => i !== null)
  return empty[Math.floor(Math.random() * empty.length)]
}