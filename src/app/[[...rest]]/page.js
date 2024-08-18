'use client'
import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import LoginForm from '../components/LoginForm'
import Home from '../components/Home'
import { useRouter } from 'next/navigation'
import { getStripe } from '../stripeClient'

export default function Page() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [hasSubscription, setHasSubscription] = useState(false)
  const router = useRouter()

  // const handleLogout = async () => {
  //   try {
  //     console.log('Attempting to log out from Firebase...');
  //     await firebaseSignOut(auth);
  //     console.log('Logged out from Firebase successfully');

  //   console.log('Attempting to log out from Clerk...');
  //   await clerkSignOut();
  //   console.log('Logged out from Clerk successfully');

  //   console.log('Redirecting to login page...');
  //   await router.push('/');
  //   } catch (error) {
  //     console.error('Error logging out:', error)
  //   }
  // }

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      // Check subscription status
      checkSubscription()
    }
  }, [isLoaded, isSignedIn])

  const checkSubscription = async () => {
    const response = await fetch('/api/check-subscription')
    const data = await response.json()
    setHasSubscription(data.hasSubscription)
  }

  const handleSubscribe = async () => {
    // This call will ensure the user has a Stripe customer ID
    await fetch('/api/check-subscription')
    
    const stripe = await getStripe()
    const { error } = await stripe.redirectToCheckout({
      lineItems: [
        {
          price: 'price_1PoYwuFUIGgXxE0FpjIT1pcp',
          quantity: 1,
        },
      ],
      mode: 'subscription',
      successUrl: `${window.location.origin}/success`,
      cancelUrl: `${window.location.origin}/canceled`,
    })
    if (error) {
      console.warn('Error:', error)
    }
  }

  if (!isLoaded || !isSignedIn) {
    return <LoginForm />
  }

  return <Home user={user} hasSubscription={hasSubscription} onSubscribe={handleSubscribe} />
}
