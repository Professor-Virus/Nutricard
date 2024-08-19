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
  const [collectedText, setCollectedText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOpenForm = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCollectedText(inputText);
    console.log(inputText);
    fetchResponse(inputText)
    setLoading(true)
    setInputText("");
    setShowForm(false);
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
  
      console.log(completion.choices[0].message.content);
      // const answer = completion.choices[0].message.content
      // const arrayStringMatch = answer.match(/\[.*\];/s);
      // if (arrayStringMatch) {
      //   try {
      //     questions = JSON.parse(arrayStringMatch[0].replace(/;$/, ''));
      //     console.log(questions);
      //   } catch (error) {
      //     console.error('Error parsing the array string:', error);
      //   }
      // } else {
      //   console.error('No array found in the code block.');
      // }
      return completion.choices[0].message.content; 
    } catch (error) {
      console.error("Error in fetchResponse:", error.message || error);
      // Optionally, re-throw the error or return a fallback value
      throw new Error("Failed to generate questions and answers.");
    }finally {
      setLoading(false);
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

  const viewFlashcardSet = (setId) => {
    router.push(`/flashcard-set/${setId}`);
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
        <motion.button
          onClick={goToCreateFlashcard}
          className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded mb-6"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          Create New Flashcard Set
        </motion.button>
        {hasSubscription && (
          <motion.button
            onClick={handleOpenForm}
            className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded mb-6"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            Generate AI flashcards
          </motion.button>
        )}

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
          {showForm && (
            <div className="form-container">
              <form onSubmit={handleSubmit}>
                <label htmlFor="inputText">Enter your text:</label>
                <input
                  type="text"
                  id="inputText"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="text-black"
                />
                <button type="submit" className="submit-button">
                  Submit
                </button>
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </form>
            </div>
          )}

        {loading && (<LoadingAnimation/>)}  
        </motion.div>
      </div>
    </div>
  );
}
