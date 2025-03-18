
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type StartScreenProps = {
  onStart: () => void;
};

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  // Create an array of random stars for the background effect
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1, // 1-4px
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 5, // 0-5s delay for animation
  }));

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-starry-blue to-starry-purple">
      {/* Stars background */}
      {stars.map(star => (
        <motion.div
          key={star.id}
          className="star"
          initial={{ opacity: 0.1 }}
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: star.delay,
          }}
          style={{
            width: star.size,
            height: star.size,
            top: star.top,
            left: star.left,
          }}
        />
      ))}

      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-8"
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-white mb-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.5,
              delay: 0.5,
              type: "spring", 
              stiffness: 100 
            }}
          >
            <span className="inline-block mr-2">Starry</span>
            <motion.span
              className="inline-block text-starry-lightpurple"
              animate={{ rotate: [0, 5, 0, -5, 0] }}
              transition={{ 
                duration: 5, 
                repeat: Infinity,
                repeatType: "reverse" 
              }}
            >
              Tic Tac Toe
            </motion.span>
          </motion.h1>
          <motion.p 
            className="text-white/80 text-lg md:text-xl max-w-lg mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            A multi-player tic-tac-toe game with mood selection and truth or dare challenges
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="glass-card max-w-2xl w-full mb-8 p-6 text-left bg-white/80 backdrop-blur-lg shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">How to Play</h2>
          <ul className="space-y-3 text-gray-800 font-medium">
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center bg-starry-purple/20 text-starry-purple h-6 w-6 rounded-full text-sm mr-2 mt-0.5">1</span>
              <span>Select the number of players (2-6) and choose a mood for each player</span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center bg-starry-purple/20 text-starry-purple h-6 w-6 rounded-full text-sm mr-2 mt-0.5">2</span>
              <span>The board size will automatically adjust based on the number of players</span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center bg-starry-purple/20 text-starry-purple h-6 w-6 rounded-full text-sm mr-2 mt-0.5">3</span>
              <span>Take turns placing your symbol on the board to create a line (horizontal, vertical, or diagonal)</span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center bg-starry-purple/20 text-starry-purple h-6 w-6 rounded-full text-sm mr-2 mt-0.5">4</span>
              <span>The winner gets a title, while the losers must face truth or dare challenges!</span>
            </li>
          </ul>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className={cn(
            "bg-white text-starry-purple font-bold text-xl rounded-full px-10 py-4",
            "shadow-glow-lg hover:shadow-glow-lg transition-all duration-300"
          )}
        >
          Start Game
        </motion.button>
      </div>
    </div>
  );
};

export default StartScreen;
