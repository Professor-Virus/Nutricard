import Navbar from "./Navbar";

export default function Home({ user, hasSubscription, onSubscribe }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />
      <div className="flex-grow flex items-center justify-center bg-gray-100">
        {hasSubscription ? (
          <h1 className="text-4xl font-bold text-gray-800">Welcome to the Premium Version!</h1>
        ) : (
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to the Free Version!</h1>
            <button
              onClick={onSubscribe}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Upgrade to Premium
            </button>
          </div>
        )}
      </div>
    </div>
  );
}