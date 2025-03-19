
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Shuffle, MessageSquare, Send, ArrowRight, AlertCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import WinnerAnnouncement from "./WinnerAnnouncement";
import { useToast } from "@/hooks/use-toast";

type Player = {
  id: number;
  name: string;
  mood: "angry" | "sad" | "happy" | "neutral";
  symbol: string;
};

type QuestionType = "personal" | "general";

type TruthDareProps = {
  winner: Player | null;
  losers: Player[];
  onNewGame: () => void;
  questionType: QuestionType;
};

// Truth and dare questions/tasks based on question type
const personalTruths = [
  "What's the most embarrassing thing you've ever done?",
  "What's your biggest fear?",
  "What's a secret you've never told anyone?",
  "Who do you have a crush on right now?",
  "What's the worst lie you've ever told?",
  "What's your most unusual talent?",
  "What's your biggest regret?",
  "What's the strangest dream you've ever had?",
  "What's the last lie you told?",
  "What's the weirdest thing you've done when you were alone?",
];

const generalTruths = [
  "What year did World War II end?",
  "Who painted the Mona Lisa?",
  "What is the capital of Australia?",
  "Which planet is known as the Red Planet?",
  "Who wrote 'Romeo and Juliet'?",
  "In what year did Mahatma Gandhi die?",
  "What is the largest ocean on Earth?",
  "Who was the first person to walk on the moon?",
  "What is the chemical symbol for gold?",
  "Who invented the telephone?",
];

const personalDares = [
  "Do your best impression of another player",
  "Let another player post anything they want on your social media",
  "Call someone and sing them Happy Birthday, even if it's not their birthday",
  "Do 20 jumping jacks",
  "Speak in an accent for the next three rounds",
  "Let the group go through your phone for 1 minute",
  "Eat a spoonful of the spiciest condiment available",
  "Send a text to your crush or a random contact",
  "Wear your clothes backwards for the rest of the game",
  "Do your best dance move right now",
];

const generalDares = [
  "Name 10 countries in 20 seconds",
  "Recite the alphabet backwards within 30 seconds",
  "Name 5 elements from the periodic table in 15 seconds",
  "Balance a book on your head and walk across the room",
  "Draw a recognizable animal with your eyes closed",
  "Solve a simple math problem like 17 x 13 without a calculator",
  "Name 8 different types of fruit in 20 seconds",
  "Build a house of cards with at least two levels",
  "List the last 5 presidents or prime ministers in order",
  "Try to juggle 3 items for at least 10 seconds",
];

const TruthDare: React.FC<TruthDareProps> = ({ winner, losers, onNewGame, questionType }) => {
  const { toast } = useToast();
  const [gameMode, setGameMode] = useState<"waiting" | "group" | "individual">("waiting");
  const [currentLoser, setCurrentLoser] = useState<Player | null>(null);
  const [selectedType, setSelectedType] = useState<"truth" | "dare" | null>(null);
  const [challenge, setChallenge] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [answers, setAnswers] = useState<{ player: Player; answer: string; type: "truth" | "dare" }[]>([]);
  const [answering, setAnswering] = useState<boolean>(false);
  const [completedChallenges, setCompletedChallenges] = useState<number>(0);
  const [isAnswerRejected, setIsAnswerRejected] = useState<boolean>(false);
  const [dareAfterTruth, setDareAfterTruth] = useState<boolean>(false);
  const [answeredTruth, setAnsweredTruth] = useState<boolean>(false);

  // Only show group option if there are more than 2 losers
  const showGroupOption = losers.length > 2;

  const handleGameModeSelect = (mode: "group" | "individual") => {
    setGameMode(mode);
    if (mode === "individual" && losers.length > 0) {
      setCurrentLoser(losers[0]);
    }
    
    toast({
      title: mode === "group" ? "Group Challenge Started" : "Individual Challenges Started",
      description: mode === "group" 
        ? "Everyone will participate in the same challenge" 
        : "Each player will face their own challenge"
    });
  };

  const handleTypeSelect = (type: "truth" | "dare") => {
    setSelectedType(type);
    
    // Use the appropriate question set based on questionType
    let options: string[];
    if (type === "truth") {
      options = questionType === "personal" ? personalTruths : generalTruths;
    } else {
      options = questionType === "personal" ? personalDares : generalDares;
    }
    
    const randomChallenge = options[Math.floor(Math.random() * options.length)];
    setChallenge(randomChallenge);
    setAnswering(type === "truth");
    setIsAnswerRejected(false);
    setDareAfterTruth(false);
    setAnsweredTruth(false);
    
    toast({
      title: type === "truth" ? "Truth Selected" : "Dare Selected",
      description: type === "truth" 
        ? "Answer honestly!" 
        : "Time to be brave!"
    });
  };

  const validateTruthAnswer = (answer: string): boolean => {
    // Simple check for low-effort answers
    if (answer.length < 10) return false;
    
    // Check for one-word or very simple answers
    if (/^(yes|no|maybe|idk|i don't know)$/i.test(answer.trim())) return false;
    
    return true;
  };

  const handleSubmitAnswer = () => {
    if (!answer.trim() || !currentLoser || !selectedType) return;
    
    // Validate truth answers
    if (selectedType === "truth" && !validateTruthAnswer(answer)) {
      setIsAnswerRejected(true);
      toast({
        title: "Answer Rejected",
        description: "Your answer doesn't seem detailed enough. Try again or face a dare instead!",
        variant: "destructive"
      });
      return;
    }
    
    const newAnswers = [...answers, { 
      player: currentLoser, 
      answer: answer.trim(),
      type: selectedType
    }];
    
    setAnswers(newAnswers);
    setAnswer("");
    setAnswering(false);
    setCompletedChallenges(prev => prev + 1);
    setIsAnswerRejected(false);
    setAnsweredTruth(selectedType === "truth");
    
    toast({
      title: "Answer Submitted",
      description: `${currentLoser.name} completed their ${selectedType}!`,
      // Changed from "success" to "default" to fix TypeScript error
      variant: "default"
    });
  };

  const handleNext = () => {
    if (gameMode !== "individual" || !currentLoser) return;
    
    const currentIndex = losers.findIndex(p => p.id === currentLoser.id);
    if (currentIndex === losers.length - 1) {
      // Last loser, go back to waiting state
      toast({
        title: "All Challenges Completed",
        description: "Everyone has faced their truth or dare!"
      });
      onNewGame();
    } else {
      // Move to next loser
      setCurrentLoser(losers[currentIndex + 1]);
      setSelectedType(null);
      setChallenge("");
      setAnswer("");
      setAnswering(false);
      setDareAfterTruth(false);
      setIsAnswerRejected(false);
      setAnsweredTruth(false);
    }
  };

  const handleNewChallenge = () => {
    if (!selectedType) return;
    
    // Use the appropriate question set based on questionType and selectedType
    let options: string[];
    if (selectedType === "truth") {
      options = questionType === "personal" ? personalTruths : generalTruths;
    } else {
      options = questionType === "personal" ? personalDares : generalDares;
    }
    
    const randomChallenge = options[Math.floor(Math.random() * options.length)];
    setChallenge(randomChallenge);
    setAnswering(selectedType === "truth");
    setAnswer("");
    setIsAnswerRejected(false);
    
    toast({
      title: "New Challenge",
      description: "Try this one instead!"
    });
  };

  const handleSubmitGroupAnswer = () => {
    if (!answer.trim() || !selectedType) return;
    
    // Validate truth answers for group mode as well
    if (selectedType === "truth" && !validateTruthAnswer(answer)) {
      setIsAnswerRejected(true);
      toast({
        title: "Answer Rejected",
        description: "Your answer doesn't seem detailed enough. Try again or face a dare instead!",
        variant: "destructive"
      });
      return;
    }
    
    // For group mode, we just show the answer was submitted
    setAnswer("");
    setAnswering(false);
    setCompletedChallenges(prev => prev + 1);
    setIsAnswerRejected(false);
    setAnsweredTruth(selectedType === "truth");
    
    toast({
      title: "Group Challenge Completed",
      description: selectedType === "truth" 
        ? "Thanks for sharing with the group!" 
        : "Great job completing the dare!",
      // Changed from "success" to "default" to fix TypeScript error
      variant: "default"
    });
  };

  const handleSkipChallenge = () => {
    if (gameMode === "individual" && currentLoser) {
      toast({
        title: "Challenge Skipped",
        description: `${currentLoser.name} skipped their challenge`
      });
      handleNext();
    } else {
      setSelectedType(null);
      setChallenge("");
      setAnswer("");
      setAnswering(false);
      setIsAnswerRejected(false);
      setDareAfterTruth(false);
      setAnsweredTruth(false);
      
      toast({
        title: "Challenge Skipped",
        description: "Moving on..."
      });
    }
  };

  const handleSwitchToDare = () => {
    // Switch from truth to dare if answer is rejected
    setSelectedType("dare");
    
    // Use the appropriate dare set based on questionType
    const dareOptions = questionType === "personal" ? personalDares : generalDares;
    const randomDare = dareOptions[Math.floor(Math.random() * dareOptions.length)];
    
    setChallenge(randomDare);
    setAnswer("");
    setAnswering(false);
    setIsAnswerRejected(false);
    setDareAfterTruth(true);
    
    toast({
      title: "Switched to Dare",
      description: "You must complete this dare now!"
    });
  };

  const progressPercentage = gameMode === "individual" 
    ? ((losers.findIndex(p => p.id === currentLoser?.id) + 1) / losers.length) * 100
    : (completedChallenges / losers.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-3xl mx-auto p-6"
    >
      {winner && <WinnerAnnouncement winner={winner} />}

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-10 text-center"
      >
        <div className="inline-flex items-center justify-center px-4 py-1 mb-2 rounded-full bg-starry-purple/10 text-sm">
          Game Results
        </div>
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-starry-blue to-starry-purple bg-clip-text text-transparent">
          {winner ? `${winner.name} Wins!` : "It's a Draw!"}
        </h1>
        {winner && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.5 }}
            className="mb-4 flex justify-center"
          >
            <span 
              className={cn(
                "text-6xl inline-block transform rotate-12",
                winner.mood === "angry" ? "text-mood-angry" : 
                winner.mood === "sad" ? "text-mood-sad" : 
                winner.mood === "happy" ? "text-mood-happy" : 
                "text-mood-neutral"
              )}
            >
              {winner.symbol}
            </span>
          </motion.div>
        )}
        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          Now it's time for the losers to face truth or dare!
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {gameMode === "waiting" && (
          <motion.div
            key="mode-selection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-6 text-center border-2 border-black/5"
          >
            <h2 className="text-2xl font-bold mb-6">Choose Truth or Dare Mode</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {showGroupOption && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleGameModeSelect("group")}
                  className="glass-button bg-starry-purple/10 hover:bg-starry-purple/20 text-starry-purple px-8 py-4 border border-black/5"
                >
                  Group Challenge
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleGameModeSelect("individual")}
                className="glass-button bg-starry-purple/10 hover:bg-starry-purple/20 text-starry-purple px-8 py-4 border border-black/5"
              >
                Individual Challenges
              </motion.button>
            </div>
          </motion.div>
        )}

        {gameMode === "group" && (
          <motion.div
            key="group-challenge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-6 text-center border-2 border-black/5"
          >
            <h2 className="text-2xl font-bold mb-2">Group Challenge</h2>
            <p className="text-gray-600 mb-6">All losers must participate in this challenge</p>
            
            {!selectedType ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTypeSelect("truth")}
                  className="glass-button bg-starry-blue/10 hover:bg-starry-blue/20 text-starry-blue px-8 py-4 border border-black/5"
                >
                  Truth
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTypeSelect("dare")}
                  className="glass-button bg-starry-blue/10 hover:bg-starry-blue/20 text-starry-blue px-8 py-4 border border-black/5"
                >
                  Dare
                </motion.button>
              </div>
            ) : (
              <div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-8 p-6 bg-white/70 rounded-lg shadow-lg relative border-2 border-black/5"
                >
                  <div className="absolute -top-3 -left-3 bg-starry-purple text-white text-sm font-bold px-3 py-1 rounded-full">
                    {dareAfterTruth ? "Dare (After Truth)" : (selectedType === "truth" ? "Truth" : "Dare")}
                  </div>
                  <p className="text-xl font-medium">{challenge}</p>
                  <button
                    onClick={handleNewChallenge}
                    className="absolute -bottom-3 -right-3 bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 border border-black/5"
                  >
                    <Shuffle size={16} />
                  </button>
                </motion.div>
                
                {answering && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-8"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 text-gray-400" size={18} />
                        <Textarea
                          placeholder="Enter your answer... (be detailed and honest!)"
                          className={`pl-10 resize-none border-2 ${isAnswerRejected ? 'border-red-500 focus:ring-red-500' : 'border-black/5'}`}
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value)}
                        />
                        {isAnswerRejected && (
                          <div className="flex justify-between items-center mt-2 p-2 bg-red-50 text-red-600 rounded text-sm border border-red-200">
                            <div className="flex items-center gap-2">
                              <AlertCircle size={16} />
                              <span>Your answer doesn't seem honest or detailed enough</span>
                            </div>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={handleSwitchToDare}
                              className="text-xs"
                            >
                              Switch to Dare
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-end">
                        <Button 
                          onClick={handleSubmitGroupAnswer}
                          className="bg-starry-purple text-white flex items-center gap-2"
                        >
                          Submit <Send size={16} />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {answeredTruth && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200 text-green-700"
                  >
                    <p className="font-medium">Truth answer submitted successfully!</p>
                    <p className="text-sm">Good job being honest!</p>
                  </motion.div>
                )}
                
                <div className="mt-6">
                  <p className="text-sm text-gray-500 mb-2">Losers</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {losers.map(loser => (
                      <div 
                        key={loser.id}
                        className="px-3 py-1 rounded-full bg-white/70 text-sm font-medium flex items-center gap-1 border border-black/5"
                      >
                        {loser.name} <span>{loser.symbol}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-3 justify-center mt-8">
                  <Button 
                    onClick={handleSkipChallenge}
                    variant="outline"
                    className="bg-white/70 border-none"
                  >
                    Skip
                  </Button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onNewGame}
                    className="bg-gradient-to-r from-starry-blue to-starry-purple text-white font-medium px-8 py-3 rounded-xl hover:opacity-90 transition-all shadow-glow-md hover:shadow-glow-lg"
                  >
                    New Game
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {gameMode === "individual" && currentLoser && (
          <motion.div
            key={`individual-${currentLoser.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-6 text-center border-2 border-black/5"
          >
            <h2 className="text-2xl font-bold mb-2">
              {currentLoser.name}'s Challenge
            </h2>
            <p className="text-gray-600 mb-6 flex items-center justify-center gap-2">
              <span>Current player:</span> 
              <span 
                className={cn(
                  "text-2xl",
                  currentLoser.mood === "angry" ? "text-mood-angry" : 
                  currentLoser.mood === "sad" ? "text-mood-sad" : 
                  currentLoser.mood === "happy" ? "text-mood-happy" : 
                  "text-mood-neutral"
                )}
              >
                {currentLoser.symbol}
              </span>
            </p>
            
            {!selectedType ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTypeSelect("truth")}
                  className="glass-button bg-starry-blue/10 hover:bg-starry-blue/20 text-starry-blue px-8 py-4 border border-black/5"
                >
                  Truth
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTypeSelect("dare")}
                  className="glass-button bg-starry-blue/10 hover:bg-starry-blue/20 text-starry-blue px-8 py-4 border border-black/5"
                >
                  Dare
                </motion.button>
              </div>
            ) : (
              <div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-8 p-6 bg-white/70 rounded-lg shadow-lg relative border-2 border-black/5"
                >
                  <div className="absolute -top-3 -left-3 bg-starry-purple text-white text-sm font-bold px-3 py-1 rounded-full">
                    {dareAfterTruth ? "Dare (After Truth)" : (selectedType === "truth" ? "Truth" : "Dare")}
                  </div>
                  <p className="text-xl font-medium">{challenge}</p>
                  <button
                    onClick={handleNewChallenge}
                    className="absolute -bottom-3 -right-3 bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 border border-black/5"
                  >
                    <Shuffle size={16} />
                  </button>
                </motion.div>
                
                {answering && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-8"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-3 text-gray-400" size={18} />
                        <Textarea
                          placeholder="Enter your answer... (be detailed and honest!)"
                          className={`pl-10 resize-none border-2 ${isAnswerRejected ? 'border-red-500 focus:ring-red-500' : 'border-black/5'}`}
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value)}
                        />
                        {isAnswerRejected && (
                          <div className="flex justify-between items-center mt-2 p-2 bg-red-50 text-red-600 rounded text-sm border border-red-200">
                            <div className="flex items-center gap-2">
                              <AlertCircle size={16} />
                              <span>Your answer doesn't seem honest or detailed enough</span>
                            </div>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={handleSwitchToDare}
                              className="text-xs"
                            >
                              Switch to Dare
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-end">
                        <Button 
                          onClick={handleSubmitAnswer}
                          className="bg-starry-purple text-white flex items-center gap-2"
                        >
                          Submit <Send size={16} />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {answeredTruth && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200 text-green-700"
                  >
                    <p className="font-medium">Truth answer submitted successfully!</p>
                    <p className="text-sm">Good job being honest!</p>
                  </motion.div>
                )}
                
                {answers.length > 0 && answers.some(a => a.player.id === currentLoser.id) && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-white/50 rounded-lg border border-black/5"
                  >
                    <p className="text-sm text-gray-500 mb-1">Your Answer:</p>
                    <p className="text-lg">
                      {answers.find(a => a.player.id === currentLoser.id)?.answer}
                    </p>
                  </motion.div>
                )}
                
                <div className="mt-6">
                  <p className="text-sm text-gray-500 mb-2">
                    Player {losers.findIndex(p => p.id === currentLoser.id) + 1} of {losers.length}
                  </p>
                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-starry-blue to-starry-purple h-full"
                      style={{ 
                        width: `${progressPercentage}%` 
                      }}
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 justify-center mt-8">
                  <Button 
                    onClick={handleSkipChallenge}
                    variant="outline"
                    className="bg-white/70 border-none"
                  >
                    Skip
                  </Button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNext}
                    className="bg-gradient-to-r from-starry-blue to-starry-purple text-white font-medium px-8 py-3 rounded-xl hover:opacity-90 transition-all shadow-glow-md hover:shadow-glow-lg flex items-center gap-2"
                  >
                    {losers.findIndex(p => p.id === currentLoser.id) === losers.length - 1 
                      ? "New Game" 
                      : (
                        <>
                          Next Player <ArrowRight size={16} />
                        </>
                      )
                    }
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TruthDare;
