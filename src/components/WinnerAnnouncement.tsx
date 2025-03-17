
import React from "react";
import { motion } from "framer-motion";
import { Trophy, Star, PartyPopper, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Player = {
  id: number;
  name: string;
  mood: "angry" | "sad" | "happy" | "neutral";
  symbol: string;
};

type WinnerAnnouncementProps = {
  winner: Player | null;
};

const WinnerAnnouncement: React.FC<WinnerAnnouncementProps> = ({ winner }) => {
  if (!winner) return null;

  const getMoodColor = (mood: Player["mood"]) => {
    switch (mood) {
      case "angry": return "text-mood-angry";
      case "sad": return "text-mood-sad";
      case "happy": return "text-mood-happy";
      case "neutral": return "text-mood-neutral";
      default: return "text-primary";
    }
  };

  const celebrationIcons = [
    { icon: Trophy, delay: 0.3 },
    { icon: PartyPopper, delay: 0.5 },
    { icon: Star, delay: 0.7 },
    { icon: Sparkles, delay: 0.9 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mb-8 relative"
    >
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-starry-purple/30"
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              scale: 0,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </motion.div>

      <motion.h2
        variants={itemVariants} 
        className="text-4xl sm:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-starry-blue to-starry-purple bg-clip-text text-transparent"
      >
        Congratulations!
      </motion.h2>

      <motion.div 
        variants={itemVariants}
        className="flex justify-center mb-6"
      >
        <div className="relative">
          <motion.div
            className={cn(
              "text-6xl sm:text-7xl md:text-8xl",
              getMoodColor(winner.mood)
            )}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            {winner.symbol}
          </motion.div>
          
          <motion.div 
            className="absolute -inset-4 rounded-full opacity-50 -z-10"
            animate={{
              scale: [1, 1.2, 1],
              background: [
                "radial-gradient(circle, rgba(147,51,234,0.3) 0%, rgba(147,51,234,0) 70%)",
                "radial-gradient(circle, rgba(79,70,229,0.3) 0%, rgba(79,70,229,0) 70%)",
                "radial-gradient(circle, rgba(147,51,234,0.3) 0%, rgba(147,51,234,0) 70%)",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="text-2xl sm:text-3xl font-medium text-center mb-2"
      >
        {winner.name} is the Winner!
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="flex justify-center gap-4 mt-4"
      >
        {celebrationIcons.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20, rotate: 0 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              rotate: [-10, 10, -10],
            }}
            transition={{ 
              delay: item.delay,
              duration: 0.5,
              rotate: {
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
              }
            }}
            className="text-starry-purple"
          >
            <item.icon size={28} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default WinnerAnnouncement;
