'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { firestore } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function FlashcardSetDetail({ params }) {
  const [flashcardSet, setFlashcardSet] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const fetchFlashcardSet = async () => {
      const docRef = doc(firestore, "flashcardSets", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setFlashcardSet(docSnap.data());
      } else {
        console.log("No such document!");
        router.push("/");
      }
    };

    fetchFlashcardSet();
  }, [id, router]);

  if (!flashcardSet) return <div>Loading...</div>;

  const currentCard = flashcardSet.flashcards[currentCardIndex];

  const nextCard = () => {
    setShowAnswer(false);
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcardSet.flashcards.length);
  };

  const prevCard = () => {
    setShowAnswer(false);
    setCurrentCardIndex((prevIndex) => (prevIndex - 1 + flashcardSet.flashcards.length) % flashcardSet.flashcards.length);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">{flashcardSet.name}</h1>
      <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Question:</h2>
        <p className="text-xl mb-6">{currentCard.question}</p>
        {showAnswer && (
          <>
            <h2 className="text-2xl font-bold mb-4">Answer:</h2>
            <p className="text-xl mb-6">{currentCard.answer}</p>
          </>
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
      </div>
      <div className="text-center mt-6">
        <button onClick={() => router.push("/")} className="bg-gray-600 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded">
          Back to Home
        </button>
      </div>
    </div>
  );
}