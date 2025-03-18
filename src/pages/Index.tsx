
import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import StartScreen from "@/components/StartScreen";
import PlayerSelection from "@/components/PlayerSelection";
import GameBoard from "@/components/GameBoard";
import TruthDare from "@/components/TruthDare";

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
          <StartScreen key="start-screen" onStart={handleStartGame} />
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

      {/* Credits Section */}
      <div className="w-full text-center py-4 text-gray-500 text-sm absolute bottom-0 left-0 right-0 bg-transparent">
        Created by Aaditya Mehta
      </div>
    </div>
  );
};

export default Index;
