import { auth } from "@clerk/nextjs";
import Stripe from "stripe";
import { firestore } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const stripeCustomerId = await getStripeCustomerId(userId);

    if (!stripeCustomerId) {
      return new Response(JSON.stringify({ hasSubscription: false }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: "active",
    });

    const hasSubscription = subscriptions.data.length > 0;

    return new Response(JSON.stringify({ hasSubscription }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error checking subscription:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}


async function getStripeCustomerId(userId) {
  const userRef = doc(firestore, 'users', userId);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists() && userDoc.data().stripeCustomerId) {
    return userDoc.data().stripeCustomerId;
  } else {
    // If the user doesn't have a Stripe customer ID, create one
    const stripeCustomer = await stripe.customers.create({
      metadata: { clerkUserId: userId },
    });

    // Update the user document with the new Stripe customer ID
    await setDoc(userRef, { stripeCustomerId: stripeCustomer.id }, { merge: true });

    return stripeCustomer.id;
  }
}