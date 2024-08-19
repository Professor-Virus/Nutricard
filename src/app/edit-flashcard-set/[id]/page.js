'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { firestore } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";

export default function EditFlashcardSet({ params }) {
  const [flashcardSet, setFlashcardSet] = useState(null);
  const [setName, setSetName] = useState("");
  const router = useRouter();
  const { id } = params;
  const { user } = useUser();

  useEffect(() => {
    const fetchFlashcardSet = async () => {
      if (!user) return;

      try {
        const userRef = doc(firestore, "users", user.id);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const set = userData.flashcardSets.find(set => set.id === id);
          if (set) {
            setFlashcardSet(set);
            setSetName(set.name);
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
  }, [id, router, user]);

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFlashcards = flashcardSet.flashcards.map((card, i) =>
      i === index ? { ...card, [name]: value } : card
    );
    setFlashcardSet({ ...flashcardSet, flashcards: updatedFlashcards });
  };

  const addFlashcard = () => {
    setFlashcardSet({
      ...flashcardSet,
      flashcards: [...flashcardSet.flashcards, { question: "", answer: "" }]
    });
  };

  const deleteFlashcard = (index) => {
    const updatedFlashcards = flashcardSet.flashcards.filter((_, i) => i !== index);
    setFlashcardSet({ ...flashcardSet, flashcards: updatedFlashcards });
  };

  const saveFlashcardSet = async () => {
    if (!user) {
      alert("You must be logged in to save flashcards.");
      return;
    }

    try {
      const userRef = doc(firestore, "users", user.id);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const updatedSets = userData.flashcardSets.map(set =>
          set.id === id ? { ...flashcardSet, name: setName } : set
        );

        await updateDoc(userRef, {
          flashcardSets: updatedSets
        });

        alert("Flashcard set updated successfully!");
        router.push("/");
      }
    } catch (error) {
      console.error("Error updating flashcard set: ", error);
      alert("Failed to update flashcard set. Please try again.");
    }
  };

  if (!flashcardSet) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-white">
      <motion.h1
        className="text-4xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Edit Flashcard Set
      </motion.h1>
      <input
        type="text"
        placeholder="Flashcard Set Name"
        value={setName}
        onChange={(e) => setSetName(e.target.value)}
        className="w-full p-3 mb-6 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
      />
      {flashcardSet.flashcards.map((card, index) => (
        <motion.div
          key={index}
          className="mb-8 bg-gray-800 p-4 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <input
            type="text"
            name="question"
            placeholder="Question"
            value={card.question}
            onChange={(e) => handleInputChange(index, e)}
            className="w-full p-3 mb-4 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            name="answer"
            placeholder="Answer"
            value={card.answer}
            onChange={(e) => handleInputChange(index, e)}
            className="w-full p-3 mb-4 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={() => deleteFlashcard(index)}
            className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded w-full transition duration-200"
          >
            Delete
          </button>
        </motion.div>
      ))}
      <motion.button
        onClick={addFlashcard}
        className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded mb-4 transition duration-200 w-full"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Add Another Flashcard
      </motion.button>
      <motion.button
        onClick={saveFlashcardSet}
        className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded transition duration-200 w-full"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Save Changes
      </motion.button>
    </div>
  );
}