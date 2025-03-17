
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

type MoodType = "angry" | "sad" | "happy" | "neutral";

type Player = {
  id: number;
  name: string;
  mood: MoodType;
  symbol: string;
};

type PlayerSelectionProps = {
  onStart: (players: Player[]) => void;
};

const moods: { name: MoodType; symbol: string }[] = [
  { name: "angry", symbol: "😠" },
  { name: "sad", symbol: "😢" },
  { name: "happy", symbol: "😊" },
  { name: "neutral", symbol: "😐" },
];

const PlayerSelection: React.FC<PlayerSelectionProps> = ({ onStart }) => {
  const [numPlayers, setNumPlayers] = useState(2);
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: "Player 1", mood: "happy", symbol: "😊" },
    { id: 2, name: "Player 2", mood: "neutral", symbol: "😐" },
  ]);

  useEffect(() => {
    // Update players array when numPlayers changes
    if (numPlayers > players.length) {
      // Add new players
      const newPlayers = [...players];
      for (let i = players.length + 1; i <= numPlayers; i++) {
        const randomMood = moods[Math.floor(Math.random() * moods.length)];
        newPlayers.push({
          id: i,
          name: `Player ${i}`,
          mood: randomMood.name,
          symbol: randomMood.symbol,
        });
      }
      setPlayers(newPlayers);
    } else if (numPlayers < players.length) {
      // Remove players
      setPlayers(players.slice(0, numPlayers));
    }
  }, [numPlayers]);

  const handleMoodChange = (playerId: number, mood: MoodType) => {
    const selectedMood = moods.find(m => m.name === mood);
    if (!selectedMood) return;
    
    setPlayers(
      players.map(player =>
        player.id === playerId
          ? { ...player, mood, symbol: selectedMood.symbol }
          : player
      )
    );
  };

  const handleNameChange = (playerId: number, name: string) => {
    setPlayers(
      players.map(player =>
        player.id === playerId ? { ...player, name } : player
      )
    );
  };

  const handleCustomSymbol = (playerId: number, symbol: string) => {
    if (symbol.length > 2) return; // Limit to 2 characters max
    
    setPlayers(
      players.map(player =>
        player.id === playerId ? { ...player, symbol } : player
      )
    );
  };

  const getMoodColor = (mood: MoodType) => {
    switch (mood) {
      case "angry": return "bg-mood-angry text-white";
      case "sad": return "bg-mood-sad text-white";
      case "happy": return "bg-mood-happy text-white";
      case "neutral": return "bg-mood-neutral text-white";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-3xl mx-auto p-6"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-10 text-center"
      >
        <div className="inline-flex items-center justify-center px-4 py-1 mb-2 rounded-full bg-starry-purple/10 text-sm">
          Game Setup
        </div>
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-starry-blue to-starry-purple bg-clip-text text-transparent">
          Player Selection
        </h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          Choose the number of players and select a mood for each player
        </p>
      </motion.div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-8 glass-card p-5"
      >
        <label className="text-xl font-medium mb-3 block">Number of Players</label>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setNumPlayers(Math.max(2, numPlayers - 1))}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-starry-purple/10 text-starry-purple hover:bg-starry-purple/20 transition-colors"
            disabled={numPlayers <= 2}
          >
            <Minus size={20} />
          </button>
          <span className="text-3xl font-bold w-10 text-center">{numPlayers}</span>
          <button
            onClick={() => setNumPlayers(Math.min(6, numPlayers + 1))}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-starry-purple/10 text-starry-purple hover:bg-starry-purple/20 transition-colors"
            disabled={numPlayers >= 6}
          >
            <Plus size={20} />
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {players.map((player, index) => (
          <motion.div
            key={player.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            className="glass-card p-5 mb-4 relative"
          >
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="w-full sm:w-1/3">
                <label className="text-sm mb-1 block">Player Name</label>
                <input
                  type="text"
                  value={player.name}
                  onChange={(e) => handleNameChange(player.id, e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-starry-purple/50 focus:border-transparent focus:outline-none"
                />
              </div>
              
              <div className="w-full sm:w-1/3">
                <label className="text-sm mb-1 block">Mood</label>
                <div className="flex gap-2">
                  {moods.map((mood) => (
                    <button
                      key={mood.name}
                      onClick={() => handleMoodChange(player.id, mood.name)}
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-all",
                        player.mood === mood.name
                          ? getMoodColor(mood.name) + " shadow-lg transform scale-110"
                          : "bg-gray-100 hover:bg-gray-200"
                      )}
                    >
                      {mood.symbol}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="w-full sm:w-1/3">
                <label className="text-sm mb-1 block">Symbol</label>
                <input
                  type="text"
                  value={player.symbol}
                  onChange={(e) => handleCustomSymbol(player.id, e.target.value)}
                  maxLength={2}
                  className={cn(
                    "w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-starry-purple/50 focus:outline-none text-center text-xl",
                    getMoodColor(player.mood).replace("bg-", "border-")
                  )}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-10 flex justify-center"
      >
        <button
          onClick={() => onStart(players)}
          className="bg-gradient-to-r from-starry-blue to-starry-purple text-white font-medium px-8 py-3 rounded-xl hover:opacity-90 transition-all shadow-glow-md hover:shadow-glow-lg"
        >
          Start Game
        </button>
      </motion.div>
    </motion.div>
  );
};

export default PlayerSelection;
