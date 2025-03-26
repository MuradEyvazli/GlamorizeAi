'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { FaEnvelope, FaLock, FaGoogle, FaFacebook, FaApple } from 'react-icons/fa'

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const res = await signIn('credentials', { 
        email, 
        password, 
        redirect: false 
      });
      
      if (res.error) {
        setError("Invalid email or password");
        setLoading(false);
        return;
      }
      
      router.replace('/dashboard');
    } catch (error) {
      console.log(error);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  }
  
  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (error) {
      console.log(error);
      setError("Google sign in failed. Please try again.");
      setLoading(false);
    }
  }
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Left Side: Background Image with Overlay */}
      <div className="lg:w-1/2 w-full h-1/3 lg:h-full bg-cover bg-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 to-purple-900/80 mix-blend-multiply"></div>
        <div className="absolute inset-0 flex flex-col justify-between p-8 text-white z-10">
          <div className="flex items-center">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center">
              <Image 
                src="/images/whiteLogo.png" 
                alt="Glamorize AI" 
                width={40} 
                height={40} 
              />
            </div>
            <div className="ml-4">
              <h3 className="font-bold text-xl">Glamorize AI</h3>
              <p className="text-xs opacity-70">AI Fashion Stylist</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl md:text-5xl font-bold"
            >
              AI Generative <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">
                Fashion Platform
              </span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg text-white/80 max-w-md"
            >
              Transform your style with AI-powered fashion recommendations and virtual try-ons.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="pt-6 flex space-x-4"
            >
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                  <Image src="https://i.pravatar.cc/100?img=1" alt="User" width={40} height={40} />
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                  <Image src="https://i.pravatar.cc/100?img=2" alt="User" width={40} height={40} />
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                  <Image src="https://i.pravatar.cc/100?img=3" alt="User" width={40} height={40} />
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold">Trusted by 10,000+ stylists</p>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map(star => (
                    <svg key={star} className="w-4 h-4 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-1 text-sm text-white/70">4.9</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Right Side: Login Form */}
      <div className="lg:w-1/2 w-full flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900 px-4 md:px-16 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          <motion.div variants={itemVariants} className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Sign in to continue to Glamorize AI
            </p>
          </motion.div>
          
          <motion.form 
            variants={itemVariants}
            onSubmit={handleSubmit} 
            className="space-y-5 backdrop-blur-sm bg-white dark:bg-gray-800/50 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700/50"
          >
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                            bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400
                            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                            bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400
                            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm p-3 rounded-lg"
              >
                <p>{error}</p>
              </motion.div>
            )}
            
            <div>
              <button 
                type="submit" 
                disabled={loading}
                className={`w-full py-3 px-4 flex justify-center items-center rounded-lg text-white font-medium
                           bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all
                           ${loading ? 'opacity-80 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : 'Sign in'}
              </button>
            </div>
            
            <div className="relative flex items-center justify-center mt-4">
              <div className="border-t border-gray-300 dark:border-gray-700 absolute w-full"></div>
              <div className="bg-white dark:bg-gray-800 px-3 relative text-sm text-gray-500 dark:text-gray-400">Or continue with</div>
            </div>
            
            <div className="grid grid-cols-1">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="flex justify-center items-center py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg
                           hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
              >
                <FaGoogle className="text-red-500" />
              </button>
            </div>
          </motion.form>
          
          <motion.p variants={itemVariants} className="mt-6 text-center text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link href="/register" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">
              Create an account
            </Link>
          </motion.p>
          
          <motion.p variants={itemVariants} className="mt-6 text-center text-xs text-gray-500 dark:text-gray-500">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="underline">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="underline">Privacy Policy</Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}

export default LoginForm