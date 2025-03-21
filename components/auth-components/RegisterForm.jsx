'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { FaUser, FaEnvelope, FaLock, FaGoogle, FaFacebook, FaApple, FaCheck } from 'react-icons/fa'

const RegisterForm = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const router = useRouter()

  // Check password strength
  const checkPasswordStrength = (password) => {
    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 1;
    
    // Contains number
    if (/\d/.test(password)) score += 1;
    
    // Contains special character
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    
    // Contains uppercase and lowercase
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
    
    setPasswordStrength(score);
    return score;
  }

  const handlePassword = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  }

  const strengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-200 dark:bg-gray-700';
    if (passwordStrength === 1) return 'bg-red-500';
    if (passwordStrength === 2) return 'bg-yellow-500';
    if (passwordStrength === 3) return 'bg-blue-500';
    if (passwordStrength === 4) return 'bg-green-500';
  }

  const strengthLabel = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength === 1) return 'Weak';
    if (passwordStrength === 2) return 'Fair';
    if (passwordStrength === 3) return 'Good';
    if (passwordStrength === 4) return 'Strong';
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!name || !email || !password) {
      setError('All fields are required');
      return;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Password strength validation
    if (passwordStrength < 2) {
      setError('Please choose a stronger password');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await res.json();
      
      if (res.status === 400 && data.error) {
        setError(data.error);
        setLoading(false);
      } else if (res.ok) {
        setError('');
        e.target.reset();
        // Automatically sign in the user after successful registration
        await signIn('credentials', { 
          email, 
          password, 
          redirect: false 
        });
        router.push('/dashboard');
      } else {
        setError('Registration failed. Please try again.');
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred. Please try again later.');
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

  // Features list
  const features = [
    'AI-powered personal styling',
    'Virtual wardrobe management',
    'Fashion trend recommendations',
    'Style matching with celebrities',
    'Unlimited outfit combinations'
  ];

  return (
    <div className='flex flex-col lg:flex-row h-screen'>
      {/* Left Side: Background Image with Overlay */}
      <div className="lg:w-1/2 w-full h-1/3 lg:h-full bg-cover bg-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/90 to-indigo-900/80 mix-blend-multiply"></div>
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
          
          <div className="mt-auto space-y-6">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl md:text-5xl font-bold"
            >
              Elevate Your Style <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">
                With AI Technology
              </span>
            </motion.h2>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <p className="text-lg text-white/80 mb-4">Join thousands of style enthusiasts who love Glamorize AI:</p>
              
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + (index * 0.1), duration: 0.5 }}
                    className="flex items-center"
                  >
                    <div className="w-5 h-5 rounded-full bg-indigo-400/30 flex items-center justify-center mr-3">
                      <FaCheck className="text-xs text-white" />
                    </div>
                    {feature}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="pt-4 flex items-center space-x-4"
            >
              <div className="flex -space-x-4">
                {[4, 5, 6, 7].map(img => (
                  <div key={img} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                    <Image src={`https://i.pravatar.cc/100?img=${img}`} alt="User" width={40} height={40} />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-white bg-indigo-600 flex items-center justify-center text-xs">
                  +2k
                </div>
              </div>
              <p className="text-sm text-white/80">Join our growing community today!</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right Side: Register Form */}
      <div className='lg:w-1/2 w-full flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900 px-4 md:px-16 py-8'>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          <motion.div variants={itemVariants} className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Create Your Account
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Join Glamorize AI and transform your style
            </p>
          </motion.div>
          
          <motion.form 
            variants={itemVariants}
            onSubmit={handleSubmit} 
            className="space-y-5 backdrop-blur-sm bg-white dark:bg-gray-800/50 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700/50"
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                            bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400
                            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
            
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="Create a secure password"
                  onChange={handlePassword}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                            bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400
                            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
              
              {/* Password strength indicator */}
              {password && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${strengthColor()}`} 
                        style={{ width: `${passwordStrength * 25}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-xs text-gray-600 dark:text-gray-400 min-w-[50px] text-right">
                      {strengthLabel()}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {passwordStrength < 2 && 'Use 8+ characters with a mix of letters, numbers & symbols'}
                  </div>
                </div>
              )}
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
            
            <div className="mt-2">
              <button 
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 flex justify-center items-center rounded-lg text-white font-medium
                           bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all
                           ${loading ? 'opacity-80 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </>
                ) : 'Create Account'}
              </button>
            </div>
            
            <div className="relative flex items-center justify-center mt-4">
              <div className="border-t border-gray-300 dark:border-gray-700 absolute w-full"></div>
              <div className="bg-white dark:bg-gray-800 px-3 relative text-sm text-gray-500 dark:text-gray-400">Or sign up with</div>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                className="flex justify-center items-center py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg
                           hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
              >
                <FaGoogle className="text-red-500" />
              </button>
              <button
                type="button"
                className="flex justify-center items-center py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg
                           hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
              >
                <FaFacebook className="text-blue-600" />
              </button>
              <button
                type="button"
                className="flex justify-center items-center py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg
                           hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
              >
                <FaApple className="text-gray-900 dark:text-white" />
              </button>
            </div>
          </motion.form>
          
          <motion.p variants={itemVariants} className="mt-6 text-center text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link href="/" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">
              Sign in
            </Link>
          </motion.p>
          
          <motion.p variants={itemVariants} className="mt-6 text-center text-xs text-gray-500 dark:text-gray-500">
            By signing up, you agree to our{' '}
            <Link href="/terms" className="underline">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="underline">Privacy Policy</Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}

export default RegisterForm