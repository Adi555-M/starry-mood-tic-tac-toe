
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Player = {
  id: number;
  name: string;
  mood: "angry" | "sad" | "happy" | "neutral";
  symbol: string;
};

type GameBoardProps = {
  players: Player[];
  onGameEnd: (winner: Player | null, losers: Player[]) => void;
};

const GameBoard: React.FC<GameBoardProps> = ({ players, onGameEnd }) => {
  const boardSize = players.length <= 3 ? 3 : players.length <= 5 ? 4 : 5;
  const [board, setBoard] = useState<(Player | null)[][]>(
    Array(boardSize).fill(null).map(() => Array(boardSize).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState<Player>(players[0]);
  const [winner, setWinner] = useState<Player | null>(null);

  // Reset the game when players change
  useEffect(() => {
    setBoard(Array(boardSize).fill(null).map(() => Array(boardSize).fill(null)));
    setCurrentPlayer(players[0]);
    setWinner(null);
  }, [players, boardSize]);

  const checkWinner = (board: (Player | null)[][], row: number, col: number, player: Player) => {
    // Check row
    if (board[row].every(cell => cell?.id === player.id)) {
      return true;
    }

    // Check column
    if (board.every(r => r[col]?.id === player.id)) {
      return true;
    }

    // Check diagonal (top-left to bottom-right)
    if (row === col) {
      let diagonal = true;
      for (let i = 0; i < boardSize; i++) {
        if (board[i][i]?.id !== player.id) {
          diagonal = false;
          break;
        }
      }
      if (diagonal) return true;
    }

    // Check diagonal (top-right to bottom-left)
    if (row + col === boardSize - 1) {
      let diagonal = true;
      for (let i = 0; i < boardSize; i++) {
        if (board[i][boardSize - 1 - i]?.id !== player.id) {
          diagonal = false;
          break;
        }
      }
      if (diagonal) return true;
    }

    return false;
  };

  const isBoardFull = () => {
    return board.every(row => row.every(cell => cell !== null));
  };

  const handleCellClick = (row: number, col: number) => {
    if (board[row][col] !== null || winner) return;

    const newBoard = [...board];
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);

    if (checkWinner(newBoard, row, col, currentPlayer)) {
      setWinner(currentPlayer);
      const losers = players.filter(player => player.id !== currentPlayer.id);
      onGameEnd(currentPlayer, losers);
      return;
    }

    if (isBoardFull()) {
      onGameEnd(null, players);
      return;
    }

    // Move to next player
    const currentIndex = players.findIndex(p => p.id === currentPlayer.id);
    const nextIndex = (currentIndex + 1) % players.length;
    setCurrentPlayer(players[nextIndex]);
  };

  const getMoodColor = (mood: Player["mood"]) => {
    switch (mood) {
      case "angry": return "text-mood-angry";
      case "sad": return "text-mood-sad";
      case "happy": return "text-mood-happy";
      case "neutral": return "text-mood-neutral";
      default: return "text-primary";
    }
  };

  const getMoodGlow = (mood: Player["mood"]) => {
    switch (mood) {
      case "angry": return "shadow-[0_0_15px_rgba(239,68,68,0.5)]";
      case "sad": return "shadow-[0_0_15px_rgba(96,165,250,0.5)]";
      case "happy": return "shadow-[0_0_15px_rgba(16,185,129,0.5)]";
      case "neutral": return "shadow-[0_0_15px_rgba(167,139,250,0.5)]";
      default: return "shadow-glow-md";
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center justify-center px-4 py-1 mb-1 rounded-full bg-starry-purple/10 text-sm"
        >
          Current Turn
        </motion.div>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={cn(
            "text-3xl font-bold transition-all duration-300 flex items-center justify-center gap-2",
            getMoodColor(currentPlayer.mood)
          )}
        >
          {currentPlayer.name}
          <span className={cn("text-4xl", getMoodGlow(currentPlayer.mood))}>
            {currentPlayer.symbol}
          </span>
        </motion.h2>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="grid gap-3 w-full max-w-3xl mx-auto"
        style={{
          gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <motion.button
              key={`${rowIndex}-${colIndex}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: (rowIndex * boardSize + colIndex) * 0.05 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              className={cn(
                "aspect-square flex items-center justify-center rounded-xl text-4xl sm:text-5xl md:text-6xl",
                "glass-card transition-all duration-300",
                cell ? getMoodGlow(cell.mood) : "hover:shadow-glow-sm",
                cell ? getMoodColor(cell.mood) : "text-gray-300"
              )}
            >
              {cell ? (
                <motion.span
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 260, 
                    damping: 20 
                  }}
                >
                  {cell.symbol}
                </motion.span>
              ) : ""}
            </motion.button>
          ))
        )}
      </motion.div>
    </div>
  );
};

export default GameBoard;
