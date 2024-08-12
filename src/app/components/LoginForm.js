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
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100">
      <div className="relative flex flex-col items-center space-y-8 p-8">
        <div className="relative bg-white p-6 rounded-lg flex items-center space-x-4 shadow-md">  
          <h1 className="text-4xl font-bold text-gray-800 text-center">
            Welcome to the NutriCard!
          </h1>
        </div>
        <div className="flex items-center justify-center">
          <AnimatePresence>
            <motion.div
              key="login-signup-container"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.5 }}
              className="relative bg-white p-8 rounded-lg shadow-md w-full max-w-md"
            >
              <div className="flex justify-center mb-6">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`px-4 py-2 ${isLogin ? 'border-b-2 border-blue-500' : ''} text-gray-800`}
                >
                  Login
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`px-4 py-2 ${!isLogin ? 'border-b-2 border-blue-500' : ''} text-gray-800`}
                >
                  Signup
                </button>
              </div>
              <motion.div
                key={isLogin ? 'login' : 'signup'}
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {isLogin ? (
                  <div>
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
                    <button
                      onClick={onGoogleLogin}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
                    >
                      Login with Google
                    </button>
                    <form onSubmit={handleLoginSubmit} className="mt-4">
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full mb-4 p-2 border border-gray-300 bg-white text-gray-800 rounded"
                      />
                      <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full mb-4 p-2 border border-gray-300 bg-white text-gray-800 rounded"
                      />
                      <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-200"
                      >
                        Login
                      </button>
                    </form>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Signup</h2>
                    <button
                      onClick={onGoogleLogin}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
                    >
                      Signup with Google
                    </button>
                    <form onSubmit={handleSignupSubmit} className="mt-4">
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full mb-4 p-2 border border-gray-300 bg-white text-gray-800 rounded"
                      />
                      <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full mb-4 p-2 border border-gray-300 bg-white text-gray-800 rounded"
                      />
                      <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full mb-4 p-2 border border-gray-300 bg-white text-gray-800 rounded"
                      />
                      <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-200"
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