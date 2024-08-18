"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import LoginForm from "../components/LoginForm";
import Home from "../components/Home";
import { useRouter } from "next/navigation";
import { getStripe } from "../stripeClient";

export default function Page() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [hasSubscription, setHasSubscription] = useState(false);
  const [paidRoute, setPaidRoute] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
       checkSubscription();
       console.log("PaidRoute is ", paidRoute)
    }
  }, [isLoaded, isSignedIn]);

  const checkSubscription = async () => {
    try {
      const response = await fetch(`/api/check-subscription?userId=${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const data = await response.json();
      console.log(data)
      setHasSubscription(data.hasSubscription);
      setPaidRoute(data.sessionId);
      setFlashcards(data.flashCards);
    } catch (err) {
      console.error("Error in checkSubscription:", err);
    }
  };

  const handleSubscribe = async () => {
    try {
      const stripe = await getStripe();
      if (!stripe) {
        throw new Error("Failed to initialize Stripe");
      }

      const { error } = await stripe.redirectToCheckout({
        lineItems: [
          {
            price: "price_1PoYwuFUIGgXxE0FpjIT1pcp",
            quantity: 1,
          },
        ],
        mode: "subscription",
        successUrl: `${window.location.origin}/success/?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/canceled`,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error in handleSubscribe:", error);
    }
  };

  if (!isLoaded || !isSignedIn) {
    return <LoginForm />;
  }

  return (
    <Home
      user={user}
      hasSubscription={hasSubscription}
      onSubscribe={handleSubscribe}
    />
  );
}
