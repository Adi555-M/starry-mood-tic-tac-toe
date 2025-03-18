
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type Player = {
  id: number;
  name: string;
  mood: "angry" | "sad" | "happy" | "neutral";
  symbol: string;
};

type GameBoardProps = {
  players: Player[];
  onGameEnd: (winner: Player | null, activePlayers: Player[]) => void;
};

const GameBoard: React.FC<GameBoardProps> = ({ players, onGameEnd }) => {
  const { toast } = useToast();
  const boardSize = players.length <= 3 ? 3 : players.length <= 5 ? 4 : 5;
  const [board, setBoard] = useState<(Player | null)[][]>(
    Array(boardSize).fill(null).map(() => Array(boardSize).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState<Player>(players[0]);
  const [winner, setWinner] = useState<Player | null>(null);
  const [moves, setMoves] = useState<number>(0);
  
  // Set winning length based on player count, but minimum 3
  const winningLength = Math.max(3, Math.min(4, players.length - 1));

  // Reset the game when players change
  useEffect(() => {
    setBoard(Array(boardSize).fill(null).map(() => Array(boardSize).fill(null)));
    setCurrentPlayer(players[0]);
    setWinner(null);
    setMoves(0);
  }, [players, boardSize]);

  const checkLineForWin = (line: (Player | null)[]) => {
    if (line.length < winningLength) return false;
    
    for (let i = 0; i <= line.length - winningLength; i++) {
      let streak = true;
      const playerId = line[i]?.id;
      
      if (playerId === undefined) continue;
      
      for (let j = 1; j < winningLength; j++) {
        if (line[i + j]?.id !== playerId) {
          streak = false;
          break;
        }
      }
      
      if (streak) return true;
    }
    
    return false;
  };

  const checkWinner = (board: (Player | null)[][], row: number, col: number, player: Player) => {
    // Check row
    if (checkLineForWin(board[row])) {
      return true;
    }

    // Check column
    const column = board.map(r => r[col]);
    if (checkLineForWin(column)) {
      return true;
    }

    // Check diagonal (top-left to bottom-right)
    const diagonal1: (Player | null)[] = [];
    const startRow = Math.max(0, row - col);
    const startCol = Math.max(0, col - row);
    for (let i = 0; i < boardSize; i++) {
      const r = startRow + i;
      const c = startCol + i;
      if (r < boardSize && c < boardSize) {
        diagonal1.push(board[r][c]);
      }
    }
    
    if (checkLineForWin(diagonal1)) {
      return true;
    }

    // Check diagonal (top-right to bottom-left)
    const diagonal2: (Player | null)[] = [];
    const startRow2 = Math.max(0, row - (boardSize - 1 - col));
    const startCol2 = Math.min(boardSize - 1, col + row);
    for (let i = 0; i < boardSize; i++) {
      const r = startRow2 + i;
      const c = startCol2 - i;
      if (r < boardSize && c >= 0) {
        diagonal2.push(board[r][c]);
      }
    }
    
    if (checkLineForWin(diagonal2)) {
      return true;
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
    setMoves(moves + 1);

    // Check for win
    if (checkWinner(newBoard, row, col, currentPlayer)) {
      setWinner(currentPlayer);
      toast({
        title: "Game Over!",
        description: `${currentPlayer.name} wins the game!`
      });
      
      // Get the active players at the end of the game
      // This includes everyone who was still in the game when it ended
      const remainingPlayers = players.filter(player => 
        player.id !== currentPlayer.id
      );
      
      onGameEnd(currentPlayer, remainingPlayers);
      return;
    }

    // Check for draw
    if (isBoardFull()) {
      toast({
        title: "Game Over!",
        description: "It's a draw!"
      });
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

  const getMoodBackground = (mood: Player["mood"]) => {
    switch (mood) {
      case "angry": return "bg-red-100";
      case "sad": return "bg-gray-100";
      case "happy": return "bg-yellow-100";
      case "neutral": return "bg-blue-100";
      default: return "bg-white/50";
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

      <div className="mb-4 text-center">
        <div className="flex justify-center gap-3 mb-2 flex-wrap">
          {players.map((player) => (
            <div
              key={player.id}
              className={cn(
                "px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 transition-all",
                player.id === currentPlayer.id
                  ? "bg-white shadow-glow-sm"
                  : "bg-white/50"
              )}
            >
              {player.name}{" "}
              <span className={getMoodColor(player.mood)}>{player.symbol}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500">
          Win Condition: Get <span className="font-bold text-starry-purple">{winningLength} in a row</span>!
        </p>
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
                "glass-card transition-all duration-300 border-2 border-black/10",
                cell ? getMoodGlow(cell.mood) : "hover:shadow-glow-sm",
                cell ? getMoodColor(cell.mood) : "text-gray-300",
                cell ? getMoodBackground(cell.mood) : "bg-white/50"
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
