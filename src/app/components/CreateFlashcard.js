'use client'

import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function CreateFlashcard() {
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
    try {
      const flashcardsCollection = collection(firestore, "flashcards");
      const batch = writeBatch(firestore);
  
      flashcards.forEach((card) => {
        const newDocRef = doc(flashcardsCollection);
        batch.set(newDocRef, {
          userId: user.id,
          question: card.question,
          answer: card.answer,
        });
      });
  
      await batch.commit();
      alert("Flashcards saved successfully!");
      router.push("/");
    } catch (error) {
      console.error("Error saving flashcards: ", error);
      alert("Failed to save flashcards. Please try again.");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6 text-center">Create Flashcards</h1>
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
        Save Flashcards
      </button>
    </div>
  );
}
