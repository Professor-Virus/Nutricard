import Navbar from "./Navbar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center bg-gray-100">
        <h1 className="text-4xl font-bold text-gray-800">Welcome to the Home Page!</h1>
      </div>
    </div>
  );
}