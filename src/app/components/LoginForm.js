import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginForm({ onGoogleLogin, onEmailLogin, onEmailSignup }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    onEmailLogin(email, password);
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    onEmailSignup(email, password);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-teal-400 to-blue-500">
      <div className="relative flex flex-col items-center space-y-8 p-8 bg-white shadow-lg rounded-lg">
        <div className="relative bg-blue-600 p-6 rounded-lg flex items-center space-x-4 shadow-lg">
          <h1 className="text-4xl font-extrabold text-white text-center">
            Welcome to NutriCard!
          </h1>
        </div>
        <div className="flex items-center justify-center w-full max-w-md">
          <AnimatePresence>
            <motion.div
              key="login-signup-container"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="relative bg-gray-100 p-8 rounded-lg shadow-lg w-full"
            >
              <div className="flex justify-center mb-6">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`px-4 py-2 border-b-2 ${isLogin ? 'border-teal-500 text-teal-500' : 'text-gray-600'} transition-colors duration-300`}
                >
                  Login
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`px-4 py-2 border-b-2 ${!isLogin ? 'border-teal-500 text-teal-500' : 'text-gray-600'} transition-colors duration-300`}
                >
                  Signup
                </button>
              </div>
              <motion.div
                key={isLogin ? 'login' : 'signup'}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
              >
                {isLogin ? (
                  <div>
                    <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Login</h2>
                    <button
                      onClick={onGoogleLogin}
                      className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                      Login with Google
                    </button>
                    <form onSubmit={handleLoginSubmit} className="mt-4 space-y-4">
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border border-gray-300 bg-white text-gray-800 rounded-lg focus:border-teal-500 focus:outline-none transition duration-200"
                      />
                      <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border border-gray-300 bg-white text-gray-800 rounded-lg focus:border-teal-500 focus:outline-none transition duration-200"
                      />
                      <button
                        type="submit"
                        className="w-full bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600 transition duration-200"
                      >
                        Login
                      </button>
                    </form>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Signup</h2>
                    <button
                      onClick={onGoogleLogin}
                      className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                      Signup with Google
                    </button>
                    <form onSubmit={handleSignupSubmit} className="mt-4 space-y-4">
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border border-gray-300 bg-white text-gray-800 rounded-lg focus:border-teal-500 focus:outline-none transition duration-200"
                      />
                      <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border border-gray-300 bg-white text-gray-800 rounded-lg focus:border-teal-500 focus:outline-none transition duration-200"
                      />
                      <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-3 border border-gray-300 bg-white text-gray-800 rounded-lg focus:border-teal-500 focus:outline-none transition duration-200"
                      />
                      <button
                        type="submit"
                        className="w-full bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600 transition duration-200"
                      >
                        Signup
                      </button>
                    </form>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
