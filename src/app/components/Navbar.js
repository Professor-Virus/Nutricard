import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

export default function Navbar({ hasSubscription, onSubscribe }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleNavigation = () => {
    console.log("Navigating to home");
    router.push("/");
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-teal-400 to-blue-500 text-white p-4 shadow-md flex items-center justify-between">
      <div
        className="text-2xl font-bold cursor-pointer"
        onClick={handleNavigation}
      >
        Nutricard
      </div>
      <nav className="flex items-center space-x-4">
        {!hasSubscription && (
          <button
            onClick={onSubscribe}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
          >
            Upgrade to Premium
          </button>
        )}
        <UserButton />
      </nav>

      {/* Mobile menu button */}
      <button
        className="lg:hidden p-2 text-white"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16m-7 6h7"
          ></path>
        </svg>
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-16 right-0 bg-gray-900 text-white w-48 shadow-lg rounded-md z-50">
          <ul className="flex flex-col">
            {!hasSubscription && (
              <li>
                <button
                  onClick={onSubscribe}
                  className="w-full text-left px-4 py-2 hover:bg-gray-800"
                >
                  Upgrade to Premium
                </button>
              </li>
            )}
            <li className="px-4 py-2">
              <UserButton />
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}