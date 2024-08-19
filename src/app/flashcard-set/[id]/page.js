'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { firestore } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion"; // Import Framer Motion
import { useUser } from "@clerk/nextjs";

export default function FlashcardSetDetail({ params }) {
  const [flashcardSet, setFlashcardSet] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [mode, setMode] = useState('view');
  const router = useRouter();
  const { id } = params;
  const { isLoaded, isSignedIn, user } = useUser();  // Use destructuring to get more info

  useEffect(() => {
    const fetchFlashcardSet = async () => {
      if (!isLoaded || !isSignedIn) return;  // Don't fetch if user isn't loaded or signed in
      
      try {
        const userRef = doc(firestore, "users", user.id);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const set = userData.flashcardSets.find(set => set.id === id);
          if (set) {
            setFlashcardSet(set);
          } else {
            console.log("No such flashcard set!");
            router.push("/");
          }
        } else {
          console.log("No such user!");
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching flashcard set:", error);
        router.push("/");
      }
    };

    fetchFlashcardSet();
  }, [id, router, isLoaded, isSignedIn, user]);

  if (!isLoaded || !isSignedIn) {
    return <div>Loading...</div>;
  }

  if (!flashcardSet) {
    return <div>Loading flashcard set...</div>;
  }

  const currentCard = flashcardSet.flashcards[currentCardIndex];

  const nextCard = () => {
    setShowAnswer(false);
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcardSet.flashcards.length);
  };

  const prevCard = () => {
    setShowAnswer(false);
    setCurrentCardIndex((prevIndex) => (prevIndex - 1 + flashcardSet.flashcards.length) % flashcardSet.flashcards.length);
  };

  const renderViewMode = () => (
    <motion.div 
      className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-4">Question:</h2>
      <p className="text-xl mb-6">{currentCard.question}</p>
      {showAnswer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-4">Answer:</h2>
          <p className="text-xl mb-6">{currentCard.answer}</p>
        </motion.div>
      )}
      <div className="flex justify-between">
        <button onClick={prevCard} className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded">
          Previous
        </button>
        <button onClick={() => setShowAnswer(!showAnswer)} className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded">
          {showAnswer ? "Hide Answer" : "Show Answer"}
        </button>
        <button onClick={nextCard} className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded">
          Next
        </button>
      </div>
    </motion.div>
  );

  const renderTestMode = () => (
    <motion.div 
      className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-4">Test Your Knowledge</h2>
      <p className="text-xl mb-6">{currentCard.question}</p>
      <textarea
        className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
        rows="3"
        placeholder="Type your answer here"
      ></textarea>
      <button onClick={() => setShowAnswer(!showAnswer)} className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded">
        {showAnswer ? "Hide Answer" : "Check Answer"}
      </button>
      {showAnswer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-4"
        >
          <h3 className="text-xl font-bold mb-2">Correct Answer:</h3>
          <p className="text-lg">{currentCard.answer}</p>
        </motion.div>
      )}
    </motion.div>
  );

  const renderMemorizeMode = () => (
    <motion.div 
      className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-4">Memorization Exercise</h2>
      <p className="text-xl mb-6">{showAnswer ? currentCard.answer : currentCard.question}</p>
      <button onClick={() => setShowAnswer(!showAnswer)} className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded">
        {showAnswer ? "Show Question" : "Show Answer"}
      </button>
      <div className="mt-4 flex justify-between">
        <button onClick={prevCard} className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded">
          Previous
        </button>
        <button onClick={nextCard} className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded">
          Next
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-white">
      <motion.h1 
        className="text-3xl font-bold mb-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        {flashcardSet.name}
      </motion.h1>
      <motion.div 
        className="mb-6 flex justify-center space-x-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button onClick={() => setMode('view')} className={`px-4 py-2 rounded ${mode === 'view' ? 'bg-blue-600' : 'bg-gray-600'}`}>View</button>
        <button onClick={() => setMode('test')} className={`px-4 py-2 rounded ${mode === 'test' ? 'bg-blue-600' : 'bg-gray-600'}`}>Test</button>
        <button onClick={() => setMode('memorize')} className={`px-4 py-2 rounded ${mode === 'memorize' ? 'bg-blue-600' : 'bg-gray-600'}`}>Memorize</button>
      </motion.div>
      {mode === 'view' && renderViewMode()}
      {mode === 'test' && renderTestMode()}
      {mode === 'memorize' && renderMemorizeMode()}
      <motion.div 
        className="text-center mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <button onClick={() => router.push("/")} className="bg-gray-600 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded">
          Back to Home
        </button>
      </motion.div>
    </div>
  );
}
