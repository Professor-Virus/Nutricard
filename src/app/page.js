'use client'
import { useState, useEffect } from 'react'
import { auth, firestore } from './firebase'
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import LoginForm from './components/LoginForm'
import Home from './components/Home'
import { useRouter } from 'next/navigation'

export default function Page() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
      } else {
        setUser(null)
        router.push('/')
      }
    })
    return () => unsubscribe()
  }, [router])

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider()
    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user
    } catch (error) {
      console.error('Error logging in with Google:', error)
    }
  }

  const handleEmailSignup = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      await setDoc(doc(firestore, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        createdAt: new Date().toISOString()
      })

      console.log('Signup successful')
    } catch (error) {
      console.error('Error signing up with email:', error)
    }
  }

  const handleEmailLogin = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      console.log('Login successful')
    } catch (error) {
      console.error('Error logging in with email:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await auth.signOut()
      setUser(null)
      router.push('/')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  if (!user) {
    return (
      <div className="app-container">
        <LoginForm
          onGoogleLogin={handleGoogleLogin}
          onEmailLogin={handleEmailLogin}
          onEmailSignup={handleEmailSignup}
        />
      </div>
    );
  }

  return <Home user={user} onLogout={handleLogout} />
}
