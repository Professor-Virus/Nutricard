import { NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../../firebase"; // Adjust the path as needed


export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  console.log(userId)

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userRef = doc(firestore, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { isSubscribed, flashcards, session_id } = userDoc.data();
    console.log(userDoc.data())

    return NextResponse.json(
      {
        hasSubscription: isSubscribed,
        flashCards: flashcards,
        sessionId: session_id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user subscription:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
