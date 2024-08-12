import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'

export default function Navbar({ onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      console.log('Logged out successfully') // Debugging log
      if (onLogout) onLogout() // Call the onLogout callback if provided
      router.push('/') // Redirect to login page or homepage
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const handleNavigation = () => {
    console.log('Navigating to home') // Debugging log
    router.push('/')
    setIsMenuOpen(false) 
  }

  return (
    <header className="bg-gradient-to-r from-teal-400 to-blue-500 text-white p-4 shadow-md flex items-center justify-between">
      <div className="text-2xl font-bold cursor-pointer" onClick={handleNavigation}>
        Nutricard
      </div>
      <button
        className="lg:hidden p-2 text-white"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
        </svg>
      </button>
      <nav className="hidden lg:flex space-x-4">
        <button onClick={handleLogout} className="bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded">
          Logout
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-16 right-0 bg-gray-900 text-white w-48 shadow-lg rounded-md z-50">
          <ul className="flex flex-col">
            <li>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 hover:bg-teal-600"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
