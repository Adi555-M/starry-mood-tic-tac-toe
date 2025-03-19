import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, X, RotateCcw, Award, Send, ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from 'canvas-confetti';

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
  questionType: "personal" | "general";
};

// Truth questions for personal category
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

// Truth questions for general knowledge category
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

// Dare challenges for personal category
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

// Dare challenges for general knowledge category
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

const TruthDare: React.FC<TruthDareProps> = ({ winner, losers, onNewGame, questionType }) => {
  const [selectedLoser, setSelectedLoser] = useState<Player | null>(null);
  const [selectedType, setSelectedType] = useState<"truth" | "dare" | null>(null);
  const [challenge, setChallenge] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [answering, setAnswering] = useState<boolean>(false);
  const [accepted, setAccepted] = useState<boolean | null>(null);
  const [completed, setCompleted] = useState<boolean>(false);

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
  };

  const selectType = (type: "truth" | "dare") => {
    setSelectedType(type);
    setChallenge("");
    setAnswer("");
    setAnswering(false);
    setAccepted(null);
    setCompleted(false);
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
    setAccepted(null);
    setCompleted(false);
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
  };

  const handleSubmitAnswer = () => {
    if (answer.trim().length === 0) return;
    setAnswering(false);
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
    
    // Use the appropriate dare set based on questionType
    const dareOptions = questionType === "personal" ? personalDares : generalDares;
    const randomDare = dareOptions[Math.floor(Math.random() * dareOptions.length)];
    
    setChallenge(randomDare);
    setAnswer("");
    setAnswering(false);
    setAccepted(null);
    setCompleted(false);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-purple-50 via-blue-50 to-blue-100">
      {winner && (
        <motion.div
          className="text-center mb-8"
          variants={resultVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <h2 className="text-3xl font-bold text-purple-700 mb-2">
            <Award className="inline-block mr-2 align-middle text-yellow-500" />
            Congratulations, {winner.name}!
          </h2>
          <p className="text-lg text-gray-700">You are the Starry Tic Tac Toe champion!</p>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {!selectedLoser && (
          <motion.div
            key="loser-selection"
            className="mb-8 text-center"
            variants={loserVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h3 className="text-2xl font-semibold text-blue-700 mb-4">Select a Loser:</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {losers.map((loser) => (
                <motion.button
                  key={loser.id}
                  className="bg-red-200 hover:bg-red-300 text-red-700 font-bold py-2 px-4 rounded shadow"
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
        {selectedLoser && !selectedType && (
          <motion.div
            key="type-selection"
            className="mb-8 text-center"
            variants={typeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h3 className="text-2xl font-semibold text-green-700 mb-4">
              Challenge {selectedLoser.name} with:
            </h3>
            <div className="flex justify-center gap-4">
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
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {selectedLoser && selectedType && !challenge && (
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
        {selectedLoser && selectedType && challenge && !answering && !completed && (
          <motion.div
            key="challenge-display"
            className="mb-8 p-6 rounded-lg shadow-xl bg-white/80 backdrop-blur-md text-center"
            variants={challengeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              {selectedType === "truth" ? "Truth:" : "Dare:"}
            </h4>
            <p className="text-md text-gray-700 mb-4">{challenge}</p>
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
        {selectedLoser && selectedType === "truth" && challenge && answering && (
          <motion.div
            key="answer-input"
            className="mb-8 p-6 rounded-lg shadow-xl bg-white/80 backdrop-blur-md text-center"
            variants={answerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Your Answer:</h4>
            <Input
              type="text"
              placeholder="Type your answer here..."
              value={answer}
              onChange={handleAnswerChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
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
        {selectedLoser && selectedType === "truth" && challenge && !answering && challenge && accepted === null && completed === false && (
          <motion.div
            key="answer-approval"
            className="mb-8 p-6 rounded-lg shadow-xl bg-white/80 backdrop-blur-md text-center"
            variants={challengeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              {selectedLoser.name}'s Answer:
            </h4>
            <p className="text-md text-gray-700 mb-4">{answer}</p>
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
                Accept <ThumbsUp className="inline-block ml-2" />
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
                Reject <ThumbsDown className="inline-block ml-2" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {selectedLoser && selectedType && challenge && completed && (
          <motion.div
            key="challenge-result"
            className="mb-8 p-6 rounded-lg shadow-xl bg-white/80 backdrop-blur-md text-center"
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
                {selectedLoser.name} successfully answered the truth!
              </p>
            )}
            {accepted === false && (
              <p className="text-md text-orange-700 mb-4">
                {selectedLoser.name} completed the dare!
              </p>
            )}
            <motion.button
              className="bg-blue-300 hover:bg-blue-400 text-blue-800 font-bold py-3 px-6 rounded-full shadow-md"
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
