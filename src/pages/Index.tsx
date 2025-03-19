
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import StartScreen from "@/components/StartScreen";
import PlayerSelection from "@/components/PlayerSelection";
import GameBoard from "@/components/GameBoard";
import TruthDare from "@/components/TruthDare";
import { Sparkles } from "lucide-react";

type Player = {
  id: number;
  name: string;
  mood: "angry" | "sad" | "happy" | "neutral";
  symbol: string;
};

type GameState = "start" | "selection" | "playing" | "end";

const Index = () => {
  const [gameState, setGameState] = useState<GameState>("start");
  const [players, setPlayers] = useState<Player[]>([]);
  const [winner, setWinner] = useState<Player | null>(null);
  const [losers, setLosers] = useState<Player[]>([]);

  const handleStartGame = () => {
    setGameState("selection");
  };

  const handlePlayerSelection = (selectedPlayers: Player[]) => {
    setPlayers(selectedPlayers);
    setGameState("playing");
  };

  const handleGameEnd = (winner: Player | null, activePlayers: Player[]) => {
    setWinner(winner);
    
    // Determine losers: all players except the winner
    const losers = winner 
      ? players.filter(player => player.id !== winner.id)
      : players; // In case of a draw, all players are "losers"
    
    setLosers(losers);
    setGameState("end");
  };

  const handleNewGame = () => {
    setGameState("selection");
    setWinner(null);
    setLosers([]);
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-white via-purple-50 to-blue-50">
      <AnimatePresence mode="wait">
        {gameState === "start" && (
          <StartScreen 
            key="start-screen" 
            onStart={handleStartGame} 
          />
        )}
        
        {gameState === "selection" && (
          <PlayerSelection key="player-selection" onStart={handlePlayerSelection} />
        )}
        
        {gameState === "playing" && (
          <div key="game-board" className="min-h-screen w-full py-12 px-4">
            <GameBoard players={players} onGameEnd={handleGameEnd} />
          </div>
        )}
        
        {gameState === "end" && (
          <TruthDare
            key="truth-dare"
            winner={winner}
            losers={losers}
            onNewGame={handleNewGame}
          />
        )}
      </AnimatePresence>

      {/* Credits Section - Improved styling */}
      <motion.div 
        className="w-full text-center py-3 absolute bottom-0 left-0 right-0 backdrop-blur-sm bg-white/30"
        initial={{ opacity: 0.7 }}
        whileHover={{ opacity: 1, backgroundColor: "rgba(255, 255, 255, 0.5)" }}
        animate={{ 
          y: [0, 5, 0],
          transition: { 
            duration: 5, 
            repeat: Infinity,
            repeatType: "reverse" 
          }
        }}
      >
        <motion.div 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-300 bg-white/50 shadow-glow-sm"
          whileHover={{ scale: 1.05, boxShadow: "0 0 15px 0 rgba(139, 92, 246, 0.4)" }}
        >
          <Sparkles size={16} className="text-starry-purple" />
          <span className="font-semibold text-sm bg-gradient-to-r from-starry-purple to-starry-brightpurple text-transparent bg-clip-text">
            Created by Aaditya Mehta & MARB
          </span>
          <Sparkles size={16} className="text-starry-purple" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Index;
