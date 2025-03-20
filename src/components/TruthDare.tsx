
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, X, RotateCcw, Award, Send, ThumbsUp, ThumbsDown, MessageSquare, Lightbulb, Users, User, Check, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from 'canvas-confetti';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type Player = {
  id: number;
  name: string;
  mood: "angry" | "sad" | "happy" | "neutral";
  symbol: string;
};

type TruthDareProps = {
  winner: Player | null;
  losers: Player[];
  onNewGame: () => void;
};

type QuestionType = "personal" | "general";
type ChallengeMode = "group" | "individual";

// Truth questions for personal category - individual
const personalTruths = [
  "What is your biggest fear?",
  "What is your most embarrassing memory?",
  "What is something you've never told anyone?",
  "What is your biggest regret?",
  "What is the most trouble you've ever been in?",
  "What is your worst habit?",
  "What is the biggest lie you've ever told?",
  "What is something you're still trying to forgive yourself for?",
  "What is your biggest insecurity?",
  "What is the most rebellious thing you've ever done?",
  "What is a secret talent you have?",
  "What is the most childish thing you still do?",
  "What is a silly fear you have?",
  "What is your guilty pleasure?",
  "What is your most prized possession?",
];

// Truth questions for general knowledge category - individual
const generalTruths = [
  "Who was the first president of the United States?",
  "What is the capital of France?",
  "What year did World War II end?",
  "What is the largest planet in our solar system?",
  "Who painted the Mona Lisa?",
  "What is the chemical symbol for gold?",
  "What is the tallest mountain in the world?",
  "Who wrote Romeo and Juliet?",
  "What is the largest ocean on Earth?",
  "What is the smallest country in the world?",
  "What is the largest desert in the world?",
  "Who invented the telephone?",
  "What is the square root of 144?",
  "What is the most abundant gas in Earth's atmosphere?",
  "Who discovered penicillin?",
];

// Truth questions for personal category - group
const groupPersonalTruths = [
  "What is the most memorable thing your group has done together?",
  "If your group had to be stranded on a desert island, who would be the first to crack?",
  "What is a secret your entire group has kept from others?",
  "Which member of your group would you trust with your life and why?",
  "What is the funniest inside joke in your group?",
  "Which member of your group would survive a zombie apocalypse?",
  "If your group started a business together, what would it be?",
  "What's the biggest argument your group has ever had?",
  "If your group could travel anywhere together, where would you go?",
  "Which member of your group has changed the most since you've known them?",
  "What's one thing you wish your group did more often?",
  "If your group was a TV show, what genre would it be?",
  "What qualities make your group special compared to other friend groups?",
  "Which member of your group would you want as your lawyer if you got arrested?",
  "What's the most embarrassing thing that's happened when your group was together?",
];

// Truth questions for general knowledge category - group
const groupGeneralTruths = [
  "Name all seven continents as a group.",
  "As a group, list at least 8 elements from the periodic table.",
  "Together, name the last 5 Olympic host cities.",
  "As a group, name at least 10 countries in Europe.",
  "Together, list all the planets in our solar system in order from the sun.",
  "As a group, name at least 5 Shakespeare plays.",
  "Together, name 10 Marvel superheroes.",
  "As a group, list the last 6 U.S. presidents in order.",
  "Together, name at least 7 oceans and major seas.",
  "As a group, list at least 8 different types of musical instruments.",
  "Together, name at least 6 primary colors and secondary colors.",
  "As a group, list at least 5 different programming languages.",
  "Together, name at least 7 world-famous landmarks.",
  "As a group, name at least 8 different sports played in the Olympics.",
  "Together, list at least 5 different types of scientists and what they study.",
];

// Dare challenges for personal category - individual
const personalDares = [
  "Do your best impression of a celebrity",
  "Sing a song for 30 seconds",
  "Do 10 jumping jacks",
  "Let another player post a status on your social media",
  "Show the last text message you sent",
  "Show the most embarrassing photo on your phone",
  "Call a friend and tell them you love them",
  "Speak in an accent for the next 3 minutes",
  "Do your best dance move",
  "Tell a joke",
  "Take a silly selfie and show everyone",
  "Show your camera roll",
  "Let someone go through your browser history",
  "Show your screen time report",
  "Do a handstand or attempt to",
];

// Dare challenges for general knowledge category - individual
const generalDares = [
  "Name all 50 states in the USA in 2 minutes",
  "Name 10 countries in Europe in 30 seconds",
  "Recite the alphabet backwards",
  "Name 10 elements from the periodic table in 30 seconds",
  "Solve a simple math problem without using a calculator",
  "Name 5 books by Shakespeare in 30 seconds",
  "Name the last 5 presidents of your country in order",
  "Draw a world map from memory",
  "Name 10 animals that start with the letter 'A'",
  "Say 'She sells seashells by the seashore' 5 times fast",
  "Solve a riddle chosen by another player",
  "Name 7 wonders of the world",
  "Name 10 famous scientists",
  "Count to 20 in another language",
  "Recite a famous poem or quote from memory",
];

// Group dares
const groupDares = [
  "As a group, create a 30-second commercial for a ridiculous product",
  "Everyone in the group must do their best dance move one after another",
  "Form a human pyramid or attempt to for at least 5 seconds",
  "The entire group must sing 'Happy Birthday' in harmony",
  "Everyone in the group has to share an embarrassing story in under 60 seconds",
  "As a group, play charades where one person acts and everyone else guesses",
  "Hold hands and form a circle, then try to sit down and stand up together without letting go",
  "The group must tell a story where each person adds one sentence at a time",
  "Everyone in the group must switch shoes with someone else for the next round",
  "The group must take a funny photo together that could be used as a album cover",
  "Everyone must imitate the person to their right for 1 minute",
  "The entire group must do 10 jumping jacks in perfect synchronization",
  "Create a group handshake with at least 5 steps in 2 minutes",
  "As a group, play 'follow the leader' where one person leads movements for 1 minute",
  "Everyone must share the most embarrassing photo on their phone",
];

const TruthDare: React.FC<TruthDareProps> = ({ winner, losers, onNewGame }) => {
  const [selectedLoser, setSelectedLoser] = useState<Player | null>(null);
  const [selectedType, setSelectedType] = useState<"truth" | "dare" | null>(null);
  const [challenge, setChallenge] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [answering, setAnswering] = useState<boolean>(false);
  const [accepted, setAccepted] = useState<boolean | null>(null);
  const [completed, setCompleted] = useState<boolean>(false);
  const [questionType, setQuestionType] = useState<QuestionType>("personal");
  const [challengeMode, setChallengeMode] = useState<ChallengeMode | null>(null);
  const [showWinnerAnnouncement, setShowWinnerAnnouncement] = useState<boolean>(true);
  const [showHonestyReminder, setShowHonestyReminder] = useState<boolean>(false);
  const [answerError, setAnswerError] = useState<string>("");

  const form = useForm({
    defaultValues: {
      answer: "",
    },
  });

  const triggerConfetti = () => {
    // Trigger confetti effect for the winner
    if (typeof window !== 'undefined' && typeof confetti === 'function') {
      const end = Date.now() + (3 * 1000); // 3 seconds of confetti

      const colors = ['#8B5CF6', '#C4B5FD', '#7C3AED'];

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: colors,
          shapes: ['circle', 'square'],
          scalar: 1.2,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: colors,
          shapes: ['circle', 'square'],
          scalar: 1.2,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    }
  };

  useEffect(() => {
    if (winner) {
      triggerConfetti();
    }
  }, [winner]);

  const loserVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: 50, transition: { duration: 0.3 } },
  };

  const typeVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.3 } },
    exit: { opacity: 0, y: 50, transition: { duration: 0.3 } },
  };

  const challengeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.5, type: "spring", stiffness: 100 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } },
  };

  const answerVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.3 } },
    exit: { opacity: 0, x: 50, transition: { duration: 0.3 } },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.7 } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.3 } },
  };

  const resultVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.5, type: "spring", stiffness: 100 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } },
  };

  const selectLoser = (loser: Player) => {
    setSelectedLoser(loser);
    setSelectedType(null);
    setChallenge("");
    setAnswer("");
    setAnswering(false);
    setAccepted(null);
    setCompleted(false);
    setChallengeMode(null);
  };

  const selectMode = (mode: ChallengeMode) => {
    setChallengeMode(mode);
    setSelectedType(null);
    setChallenge("");
    setAnswer("");
    setAnswering(false);
    setAccepted(null);
    setCompleted(false);
  };

  const selectType = (type: "truth" | "dare") => {
    setSelectedType(type);
    setChallenge("");
    setAnswer("");
    setAnswering(false);
    setAccepted(null);
    setCompleted(false);
    
    // Show honesty reminder for truth challenges
    if (type === "truth") {
      setShowHonestyReminder(true);
    } else {
      setShowHonestyReminder(false);
    }
  };

  const handleNewChallenge = () => {
    if (!selectedType || !challengeMode) return;
    
    // Use the appropriate question set based on challengeMode, questionType, and selectedType
    let options: string[];
    
    if (challengeMode === "individual") {
      if (selectedType === "truth") {
        options = questionType === "personal" ? personalTruths : generalTruths;
      } else {
        options = questionType === "personal" ? personalDares : generalDares;
      }
    } else { // group mode
      if (selectedType === "truth") {
        options = questionType === "personal" ? groupPersonalTruths : groupGeneralTruths;
      } else {
        options = groupDares;
      }
    }
    
    const randomChallenge = options[Math.floor(Math.random() * options.length)];
    setChallenge(randomChallenge);
    setAnswering(selectedType === "truth");
    setAnswer("");
    setAccepted(null);
    setCompleted(false);
    setAnswerError("");
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAnswer(e.target.value);
    // Clear error when user starts typing
    if (answerError) setAnswerError("");
  };

  const handleSubmitAnswer = () => {
    // Validate answer length for personal truths
    if (selectedType === "truth" && questionType === "personal") {
      const wordCount = answer.trim().split(/\s+/).length;
      const lineCount = answer.trim().split(/\n/).filter(line => line.trim() !== '').length;
      
      if (wordCount < 15 || lineCount < 3) {
        setAnswerError("Please provide a detailed answer (at least 15 words and 3 lines) to ensure honesty.");
        return;
      }
    } else if (answer.trim().length < 5) {
      setAnswerError("Please provide a valid answer.");
      return;
    }
    
    setAnswering(false);
    setAnswerError("");
  };

  const handleAcceptAnswer = () => {
    setAccepted(true);
    setCompleted(true);
  };

  const handleRejectAnswer = () => {
    setAccepted(false);
    // Gives the loser a dare instead
    handleSwitchToDare();
  };

  const handleCompleteDare = () => {
    setCompleted(true);
  };

  const handleSwitchToDare = () => {
    // Switch from truth to dare if answer is rejected
    setSelectedType("dare");
    
    // Use the appropriate dare set based on challengeMode and questionType
    let dareOptions;
    if (challengeMode === "individual") {
      dareOptions = questionType === "personal" ? personalDares : generalDares;
    } else {
      dareOptions = groupDares;
    }
    
    const randomDare = dareOptions[Math.floor(Math.random() * dareOptions.length)];
    
    setChallenge(randomDare);
    setAnswer("");
    setAnswering(false);
    setAccepted(null);
    setCompleted(false);
  };

  const handleQuestionTypeSelect = (type: QuestionType) => {
    setQuestionType(type);
  };

  const handleCloseHonestyReminder = () => {
    setShowHonestyReminder(false);
  };

  const handleContinueFromWinner = () => {
    setShowWinnerAnnouncement(false);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-purple-50 via-blue-50 to-blue-100">
      {/* Winner Announcement Dialog */}
      <Dialog open={showWinnerAnnouncement && !!winner} onOpenChange={setShowWinnerAnnouncement}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center flex items-center justify-center gap-2">
              <Award className="h-6 w-6 text-yellow-500" />
              Congratulations, {winner?.name}!
            </DialogTitle>
            <DialogDescription className="text-center">
              You have won the Starry Tic Tac Toe challenge! Now it's time for some fun with Truth or Dare.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center my-4">
            <motion.div
              className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <span className="text-5xl">{winner?.symbol || "🏆"}</span>
            </motion.div>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button 
              onClick={handleContinueFromWinner}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-blue-500"
            >
              Continue to Truth or Dare!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Honesty Reminder Dialog */}
      <Dialog open={showHonestyReminder} onOpenChange={setShowHonestyReminder}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center flex items-center justify-center gap-2">
              <Shield className="h-6 w-6 text-purple-500" />
              Honesty Reminder
            </DialogTitle>
            <DialogDescription className="text-center">
              Please remember to answer truthfully! The game is more fun when everyone is honest.
              {challengeMode === "individual" && selectedType === "truth" && questionType === "personal" && (
                <p className="mt-2 font-medium">
                  For personal questions, provide detailed answers (at least 3 lines) to ensure honesty.
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button 
              onClick={handleCloseHonestyReminder}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-blue-500"
            >
              I Promise to Be Honest
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {winner && !showWinnerAnnouncement && (
        <motion.div
          className="text-center mb-8"
          variants={resultVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <h2 className="text-3xl font-bold text-purple-700 mb-2">
            <Award className="inline-block mr-2 align-middle text-yellow-500" />
            {winner.name}'s Victory Celebration
          </h2>
          <p className="text-lg text-gray-700">Time for some Truth or Dare fun!</p>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {!selectedLoser && !showWinnerAnnouncement && (
          <motion.div
            key="loser-selection"
            className="mb-8 text-center"
            variants={loserVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h3 className="text-2xl font-semibold text-blue-700 mb-4">Select a Player:</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {losers.map((loser) => (
                <motion.button
                  key={loser.id}
                  className="bg-blue-200 hover:bg-blue-300 text-blue-700 font-bold py-2 px-4 rounded shadow"
                  onClick={() => selectLoser(loser)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {loser.name}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {selectedLoser && !challengeMode && (
          <motion.div
            key="mode-selection"
            className="mb-8 text-center"
            variants={typeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h3 className="text-2xl font-semibold text-purple-700 mb-4">
              Choose Mode:
            </h3>
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <motion.div
                className="w-40 p-4 bg-white/80 backdrop-blur-sm shadow-lg rounded-lg cursor-pointer"
                onClick={() => selectMode("group")}
                whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(126, 34, 206, 0.4)" }}
                whileTap={{ scale: 0.95 }}
              >
                <Users className="w-10 h-10 mx-auto mb-2 text-purple-600" />
                <h4 className="text-lg font-semibold text-purple-700">Group</h4>
                <p className="text-sm text-gray-600">Challenges for everyone</p>
              </motion.div>
              
              <motion.div
                className="w-40 p-4 bg-white/80 backdrop-blur-sm shadow-lg rounded-lg cursor-pointer"
                onClick={() => selectMode("individual")}
                whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(126, 34, 206, 0.4)" }}
                whileTap={{ scale: 0.95 }}
              >
                <User className="w-10 h-10 mx-auto mb-2 text-blue-600" />
                <h4 className="text-lg font-semibold text-blue-700">Individual</h4>
                <p className="text-sm text-gray-600">Personal challenges</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {selectedLoser && challengeMode && !selectedType && (
          <motion.div
            key="type-selection"
            className="mb-8 text-center"
            variants={typeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h3 className="text-2xl font-semibold text-green-700 mb-4">
              {challengeMode === "group" ? "Challenge everyone with:" : `Challenge ${selectedLoser.name} with:`}
            </h3>
            
            {/* Truth or Dare Selection */}
            <div className="flex justify-center gap-4 mb-8">
              <motion.button
                className="bg-yellow-200 hover:bg-yellow-300 text-yellow-700 font-bold py-2 px-4 rounded shadow"
                onClick={() => selectType("truth")}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                Truth
              </motion.button>
              <motion.button
                className="bg-orange-200 hover:bg-orange-300 text-orange-700 font-bold py-2 px-4 rounded shadow"
                onClick={() => selectType("dare")}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                Dare
              </motion.button>
            </div>
            
            {/* Question Type Selection */}
            <div className="glass-card p-6 rounded-xl bg-white/20 backdrop-blur-md max-w-2xl w-full mb-4">
              <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Question Options</h2>
              <p className="text-gray-700 text-center mb-6">Choose the type of questions for truth or dare challenges:</p>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "p-4 rounded-xl cursor-pointer transition-all duration-300 w-[calc(50%-8px)] flex flex-col items-center",
                    questionType === "personal" 
                      ? "bg-purple-200 text-purple-700 shadow-md" 
                      : "bg-white/70 text-gray-700"
                  )}
                  onClick={() => handleQuestionTypeSelect("personal")}
                >
                  <MessageSquare size={32} className="mb-3" />
                  <h3 className="text-lg font-bold mb-2">Personal</h3>
                  <p className="text-sm opacity-90">
                    {challengeMode === "group" 
                      ? "Questions about your group's experiences and relationships" 
                      : "Questions about yourself, your experiences and preferences"}
                  </p>
                  
                  {questionType === "personal" && (
                    <motion.div 
                      initial={{ scale: 0 }} 
                      animate={{ scale: 1 }}
                      className="mt-3 bg-purple-300 px-3 py-1 rounded-full text-xs font-semibold"
                    >
                      Selected
                    </motion.div>
                  )}
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "p-4 rounded-xl cursor-pointer transition-all duration-300 w-[calc(50%-8px)] flex flex-col items-center",
                    questionType === "general" 
                      ? "bg-blue-200 text-blue-700 shadow-md" 
                      : "bg-white/70 text-gray-700"
                  )}
                  onClick={() => handleQuestionTypeSelect("general")}
                >
                  <Lightbulb size={32} className="mb-3" />
                  <h3 className="text-lg font-bold mb-2">General Knowledge</h3>
                  <p className="text-sm opacity-90">Trivia questions about history, science, and the world</p>
                  
                  {questionType === "general" && (
                    <motion.div 
                      initial={{ scale: 0 }} 
                      animate={{ scale: 1 }}
                      className="mt-3 bg-blue-300 px-3 py-1 rounded-full text-xs font-semibold"
                    >
                      Selected
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {selectedLoser && challengeMode && selectedType && !challenge && (
          <motion.div
            key="challenge-initiation"
            className="mb-8 text-center"
            variants={challengeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Prepare for the {selectedType}!
            </h3>
            <motion.button
              className="bg-purple-300 hover:bg-purple-400 text-purple-800 font-bold py-3 px-6 rounded-full shadow-md"
              onClick={handleNewChallenge}
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(126, 34, 206, 0.4)" }}
              whileTap={{ scale: 0.95 }}
            >
              Get {selectedType}! <Sparkles className="inline-block ml-2" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {selectedLoser && challengeMode && selectedType && challenge && !answering && !completed && (
          <motion.div
            key="challenge-display"
            className="mb-8 p-6 rounded-lg shadow-xl bg-white/80 backdrop-blur-md text-center max-w-2xl w-full"
            variants={challengeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              {selectedType === "truth" ? "Truth:" : "Dare:"}
            </h4>
            <div className="bg-white/50 p-4 rounded-lg shadow-inner mb-4">
              <p className="text-md text-gray-700">{challenge}</p>
            </div>
            
            {selectedType === "truth" ? (
              <motion.button
                className="bg-blue-300 hover:bg-blue-400 text-blue-800 font-bold py-2 px-4 rounded shadow"
                onClick={() => setAnswering(true)}
                variants={buttonVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                Answer <Send className="inline-block ml-2" />
              </motion.button>
            ) : (
              <motion.button
                className="bg-green-300 hover:bg-green-400 text-green-800 font-bold py-2 px-4 rounded shadow"
                onClick={handleCompleteDare}
                variants={buttonVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                Complete <ThumbsUp className="inline-block ml-2" />
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {selectedLoser && challengeMode && selectedType === "truth" && challenge && answering && (
          <motion.div
            key="answer-input"
            className="mb-8 p-6 rounded-lg shadow-xl bg-white/80 backdrop-blur-md text-center max-w-2xl w-full"
            variants={answerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Your Answer:</h4>
            
            {answerError && (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Validation Error</AlertTitle>
                <AlertDescription>{answerError}</AlertDescription>
              </Alert>
            )}
            
            {(questionType === "personal" && challengeMode === "individual") ? (
              <>
                <Textarea
                  placeholder="Type your detailed answer here... (at least 3 lines)"
                  value={answer}
                  onChange={handleAnswerChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 min-h-[120px]"
                />
                <p className="text-xs text-gray-500 mt-2 mb-4 text-left">
                  * Please provide a detailed answer (at least 3 lines) to ensure honesty
                </p>
              </>
            ) : (
              <Input
                type="text"
                placeholder="Type your answer here..."
                value={answer}
                onChange={handleAnswerChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            )}
            
            <div className="mt-4">
              <motion.button
                className="bg-purple-300 hover:bg-purple-400 text-purple-800 font-bold py-2 px-4 rounded shadow mr-2"
                onClick={handleSubmitAnswer}
                variants={buttonVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                Submit <Send className="inline-block ml-2" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {selectedLoser && challengeMode && selectedType === "truth" && challenge && !answering && challenge && accepted === null && completed === false && (
          <motion.div
            key="answer-approval"
            className="mb-8 p-6 rounded-lg shadow-xl bg-white/80 backdrop-blur-md text-center max-w-2xl w-full"
            variants={challengeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              {challengeMode === "group" ? "Group Answer:" : `${selectedLoser.name}'s Answer:`}
            </h4>
            <div className="bg-white/50 p-4 rounded-lg shadow-inner mb-4 text-left whitespace-pre-line">
              <p className="text-md text-gray-700">{answer}</p>
            </div>
            <div className="flex justify-center gap-4">
              <motion.button
                className="bg-green-300 hover:bg-green-400 text-green-800 font-bold py-2 px-4 rounded shadow"
                onClick={handleAcceptAnswer}
                variants={buttonVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                Accept <Check className="inline-block ml-2" />
              </motion.button>
              <motion.button
                className="bg-red-300 hover:bg-red-400 text-red-800 font-bold py-2 px-4 rounded shadow"
                onClick={handleRejectAnswer}
                variants={buttonVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                Reject <X className="inline-block ml-2" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {selectedLoser && challengeMode && selectedType && challenge && completed && (
          <motion.div
            key="challenge-result"
            className="mb-8 p-6 rounded-lg shadow-xl bg-white/80 backdrop-blur-md text-center max-w-2xl w-full"
            variants={resultVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h4 className="text-2xl font-semibold text-gray-800 mb-4">
              Challenge Completed!
            </h4>
            {accepted === true && (
              <p className="text-md text-green-700 mb-4">
                {challengeMode === "group" ? "The group" : selectedLoser.name} successfully answered the truth!
              </p>
            )}
            {accepted === false && (
              <p className="text-md text-orange-700 mb-4">
                {challengeMode === "group" ? "The group" : selectedLoser.name} completed the dare!
              </p>
            )}
            {selectedType === "dare" && accepted === null && (
              <p className="text-md text-blue-700 mb-4">
                {challengeMode === "group" ? "The group" : selectedLoser.name} completed the dare!
              </p>
            )}
            <motion.button
              className="bg-blue-300 hover:bg-blue-400 text-blue-800 font-bold py-3 px-6 rounded-full shadow-md mt-4"
              onClick={onNewGame}
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(59, 130, 246, 0.4)" }}
              whileTap={{ scale: 0.95 }}
            >
              New Game <RotateCcw className="inline-block ml-2" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {!winner && !selectedLoser && (
        <motion.div
          className="text-center"
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <Button onClick={onNewGame} className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
            Start Over
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default TruthDare;
