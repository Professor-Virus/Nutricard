'use client'

import { useState } from "react";
import { doc, getDoc, updateDoc, setDoc, arrayUnion } from "firebase/firestore";
import { firestore } from "../firebase";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function CreateFlashcard() {
  const [setName, setSetName] = useState("");
  const [flashcards, setFlashcards] = useState([{ question: "", answer: "" }]);
  const { user } = useUser();
  const router = useRouter();

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFlashcards = flashcards.map((card, i) =>
      i === index ? { ...card, [name]: value } : card
    );
    setFlashcards(updatedFlashcards);
  };

  const addFlashcard = () => {
    setFlashcards([...flashcards, { question: "", answer: "" }]);
  };

  const deleteFlashcard = (index) => {
    setFlashcards(flashcards.filter((_, i) => i !== index));
  };

  const saveFlashcards = async () => {
    if (!user) {
      alert("You must be logged in to save flashcards.");
      return;
    }

    try {
      const userRef = doc(firestore, "users", user.id);
      const userDoc = await getDoc(userRef);

      const newFlashcardSet = {
        id: Date.now().toString(), // Generate a unique ID
        name: setName,
        flashcards: flashcards,
      };

      if (userDoc.exists()) {
        // If the user document exists, update it
        await updateDoc(userRef, {
          flashcardSets: arrayUnion(newFlashcardSet)
        });
      } else {
        // If the user document doesn't exist, create it
        await setDoc(userRef, {
          flashcardSets: [newFlashcardSet],
          isSubscribed: false,
          session_id: null
        });
      }

      alert("Flashcard set saved successfully!");
      router.push("/");
    } catch (error) {
      console.error("Error saving flashcard set: ", error);
      alert("Failed to save flashcard set. Please try again.");
    }
  };


  return (
    <div className="min-h-screen p-8 bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6 text-center">Create Flashcard Set</h1>
      <input
        type="text"
        placeholder="Flashcard Set Name"
        value={setName}
        onChange={(e) => setSetName(e.target.value)}
        className="w-full p-3 mb-6 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
      />
      {flashcards.map((card, index) => (
        <div key={index} className="mb-8 bg-gray-800 p-4 rounded-lg shadow-lg">
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
        </div>
      ))}
      <button
        onClick={addFlashcard}
        className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded mb-4 transition duration-200 w-full"
      >
        Add Another Flashcard
      </button>
      <button
        onClick={saveFlashcards}
        className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded transition duration-200 w-full"
      >
        Save Flashcard Set
      </button>
    </div>
  );
}