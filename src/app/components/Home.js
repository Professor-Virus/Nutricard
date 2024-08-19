"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./Navbar";
import { firestore } from "../firebase";
import Link from "next/link";
import {
  doc,
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  getDoc,
  updateDoc,
  setDoc,
  arrayUnion
} from "firebase/firestore";
import { motion } from "framer-motion";
import OpenAI from "openai";
import dynamic from "next/dynamic";

const LoadingAnimation = dynamic(() => import('./LoadingAnimation'), {
  ssr: false
});

export default function Home({ user, hasSubscription, onSubscribe = null }) {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOpenForm = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      setShowForm(false);
      await fetchResponse(inputText);
      setInputText("");
      // setShowForm(false);
    } catch (error) {
      console.error("Error generating flashcards:", error);
      alert("Failed to generate flashcards. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchResponse = async (text) => {
    const instructionString = `
    Please take the following piece of text:\n '${text}\n' and generate a few questions and answers based on it. 
    The output should be an array of objects in the following format, and return only the array:
    [
        { question: "First question here", answer: "Corresponding answer here" },
        { question: "Second question here", answer: "Corresponding answer here" },
        { question: "Third question here", answer: "Corresponding answer here" }
    ]`;

    try {
      const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.NEXT_PUBLIC_OPEN_ROUTER,
        dangerouslyAllowBrowser: true,
        defaultHeaders: {},
      });
  
      const completion = await openai.chat.completions.create({
        model: "nousresearch/hermes-3-llama-3.1-405b",
        messages: [{ role: "user", content: instructionString }],
      });
  
      const generatedFlashcards = JSON.parse(completion.choices[0].message.content);
      await saveGeneratedFlashcards(generatedFlashcards);

      return generatedFlashcards;
    } catch (error) {
      console.error("Error in fetchResponse:", error.message || error);
      throw new Error("Failed to generate questions and answers.");
    }
  };

  const saveGeneratedFlashcards = async (flashcards) => {
    if (!user) {
      alert("You must be logged in to save flashcards.");
      return;
    }

    try {
      const userRef = doc(firestore, "users", user.id);
      const userDoc = await getDoc(userRef);

      const newFlashcardSet = {
        id: Date.now().toString(),
        name: `AI Generated Set - ${new Date().toLocaleDateString()}`,
        flashcards: flashcards,
      };

      if (userDoc.exists()) {
        await updateDoc(userRef, {
          flashcardSets: arrayUnion(newFlashcardSet)
        });
      } else {
        await setDoc(userRef, {
          flashcardSets: [newFlashcardSet],
          isSubscribed: false,
          session_id: null
        });
      }

      alert("AI-generated flashcard set saved successfully!");
    } catch (error) {
      console.error("Error saving AI-generated flashcard set: ", error);
      alert("Failed to save AI-generated flashcard set. Please try again.");
    }
  };

  useEffect(() => {
    if (user) {
      const userRef = doc(firestore, "users", user.id);
      const unsubscribe = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          setFlashcardSets(userData.flashcardSets || []);
        }
      });

      return () => unsubscribe();
    }
  }, [user]);

  const goToCreateFlashcard = () => {
    router.push("/create-flashcard");
  };

  const editFlashcardSet = (setId) => {
    router.push(`/edit-flashcard-set/${setId}`);
  };

  const deleteFlashcardSet = async (setId) => {
    try {
      const userRef = doc(firestore, "users", user.id);
      await updateDoc(userRef, {
        flashcardSets: flashcardSets.filter((set) => set.id !== setId),
      });
    } catch (error) {
      console.error("Error deleting flashcard set:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Navbar hasSubscription={hasSubscription} onSubscribe={onSubscribe} />
      <div className="flex-grow p-8">
        <motion.h1
          className="text-4xl font-bold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Your Flashcard Sets
        </motion.h1>
        <div className="flex mb-6">
          <motion.button
            onClick={goToCreateFlashcard}
            className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded mr-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            Create New Flashcard Set
          </motion.button>
          {hasSubscription && (
            <motion.button
              onClick={handleOpenForm}
              className="bg-purple-600 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              Generate AI Flashcards
            </motion.button>
          )}
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
          }}
        >
          {flashcardSets.map((set) => (
            <motion.div
              key={set.id}
              className="bg-gray-800 p-4 rounded-lg shadow-lg"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <h3 className="font-bold mb-2 text-lg text-blue-400">
                {set.name}
              </h3>
              <p className="text-gray-300 mb-2">
                {set.flashcards.length} cards
              </p>
              <div className="flex justify-between">
                <Link href={`/flashcard-set/${set.id}`} passHref>
                  <motion.button
                    className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-1 px-2 rounded text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    View
                  </motion.button>
                </Link>
                <motion.button
                  onClick={() => editFlashcardSet(set.id)}
                  className="bg-green-600 hover:bg-green-800 text-white font-bold py-1 px-2 rounded text-sm mx-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  Edit
                </motion.button>
                <motion.button
                  onClick={() => deleteFlashcardSet(set.id)}
                  className="bg-red-600 hover:bg-red-800 text-white font-bold py-1 px-2 rounded text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {showForm && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h2 className="text-2xl font-bold mb-4">Generate AI Flashcards</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="inputText" className="block mb-2">Enter your text:</label>
                  <textarea
                    id="inputText"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="w-full p-2 bg-gray-700 text-white rounded"
                    rows="4"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded"
                  >
                    Generate
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <LoadingAnimation />
          </div>
        )}
      </div>
    </div>
  );
}