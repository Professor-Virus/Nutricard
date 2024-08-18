import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./Navbar";
import { firestore } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import Link from 'next/link'; // Import Link for navigation

export default function Home({ user, hasSubscription, onSubscribe }) {
  const [flashcards, setFlashcards] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const q = query(collection(firestore, "flashcards"), where("userId", "==", user.id));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const userFlashcards = [];
        querySnapshot.forEach((doc) => {
          userFlashcards.push({ id: doc.id, ...doc.data() });
        });
        setFlashcards(userFlashcards);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const goToCreateFlashcard = () => {
    router.push("/create-flashcard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Navbar hasSubscription={hasSubscription} onSubscribe={onSubscribe} />
      <div className="flex-grow p-8">
        <h1 className="text-4xl font-bold mb-6">Your Flashcards</h1>
        <button
          onClick={goToCreateFlashcard}
          className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded mb-6 transition duration-200"
        >
          Create Flashcard
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flashcards.map((card) => (
            <Link href={`/flashcard/${card.id}`} key={card.id}>
              <div className="bg-gray-800 p-4 rounded-lg shadow-lg cursor-pointer hover:bg-gray-700 transition duration-200">
                <h3 className="font-bold mb-2 text-lg text-blue-400">{card.question}</h3>
                <p className="text-gray-300 truncate">{card.answer}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
