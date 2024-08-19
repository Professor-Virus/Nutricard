import { OpenRouter } from "openai";
import { auth } from "@clerk/nextjs";

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req) {
  const { userId } = auth();

  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { topic } = await req.json();

  try {
    const response = await openrouter.chat.completions.create({
      model: "llama-3.1-8b",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates flashcards on various topics.",
        },
        {
          role: "user",
          content: `Generate 5 flashcards about ${topic}. Each flashcard should have a question and an answer. Format the response as a JSON array of objects, each with 'question' and 'answer' properties.`,
        },
      ],
    });

    const flashcards = JSON.parse(response.choices[0].message.content);

    return new Response(JSON.stringify(flashcards), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating flashcards:", error);
    return new Response(JSON.stringify({ error: "Failed to generate flashcards" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}