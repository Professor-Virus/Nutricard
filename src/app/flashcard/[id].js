'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { firestore } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function FlashcardDetail({ params }) {
  const [flashcard, setFlashcard] = useState(null);
  const [viewMode, setViewMode] = useState('view'); // 'view' or 'test'
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const fetchFlashcard = async () => {
      const docRef = doc(firestore, "flashcards", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setFlashcard(docSnap.data());
      } else {
        console.log("No such document!");
        router.push("/");
      }
    };

    fetchFlashcard();
  }, [id, router]);

  if (!flashcard) return <div>Loading...</div>;

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">{flashcard.question}</h1>
      <div className="text-lg mb-6 text-center">
        {viewMode === 'view' ? (
          <p>{flashcard.answer}</p>
        ) : (
          <div>
            {/* Add test functionality here */}
            <p>Test Mode (Feature coming soon)</p>
          </div>
        )}
      </div>
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setViewMode(viewMode === 'view' ? 'test' : 'view')}
          className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded transition duration-200"
        >
          {viewMode === 'view' ? 'Test Yourself' : 'View Answer'}
        </button>
        <button
          onClick={() => router.push("/")}
          className="bg-gray-600 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded transition duration-200"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
