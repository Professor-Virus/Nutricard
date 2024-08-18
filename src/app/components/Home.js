import { useState } from "react";
import Navbar from "./Navbar";

export default function Home({ user, hasSubscription, onSubscribe }) {
  const [flashcards, setFlashcards] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const addFlashcard = () => {
    if (question && answer) {
      setFlashcards([...flashcards, { question, answer }]);
      setQuestion("");
      setAnswer("");
    }
  };

  const generateAIFlashcards = async () => {
    try {
      const topic = prompt("Enter a topic for flashcards:");
      if (!topic) return;
  
      const response = await fetch("/api/generate-flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to generate flashcards");
      }
  
      const aiFlashcards = await response.json();
      setFlashcards([...flashcards, ...aiFlashcards]);
    } catch (error) {
      console.error("Error generating AI flashcards:", error);
      alert("Failed to generate AI flashcards. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar hasSubscription={hasSubscription} onSubscribe={onSubscribe} />
      <div className="flex-grow p-8 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Create Flashcards</h1>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="text"
            placeholder="Answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
          />
          <button
            onClick={addFlashcard}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
          >
            Add Flashcard
          </button>
          <button
            onClick={generateAIFlashcards}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Generate AI Flashcards
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {flashcards.map((card, index) => (
            <div key={index} className="bg-white p-4 rounded shadow">
              <h3 className="font-bold mb-2">{card.question}</h3>
              <p>{card.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}