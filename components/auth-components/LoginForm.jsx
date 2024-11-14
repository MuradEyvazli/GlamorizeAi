'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await signIn('credentials', { email, password, redirect: false })
      if (res.error) {
        setError("Invalid Credentials")
        return
      }
      router.replace('/dashboard');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex h-screen">
      {/* Left Side: Background Image */}
      <div className="w-1/2 bg-cover bg-center relative" style={{ backgroundImage: "url('/images/sal.jpg')" }}>
        <div className="absolute bottom-10 left-10 text-white text-2xl font-semibold">
          <h2>AI Generative</h2>
          <p>Anything you can Imagine</p>
          <p className="text-sm mt-2">Generate any type of art with Glamorize AI by Murad Eyvazli</p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="w-full max-w-md p-10 bg-opacity-20 backdrop-blur-lg bg-gray-900 rounded-lg shadow-lg"
        >
          <h1 className="text-4xl font-extrabold mb-6 text-white">Welcome Back!</h1>
          <p className="text-gray-400 mb-8">Enter your email and password</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <input
                type="email"
                placeholder="Email address"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-12 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                📧
              </span>
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-12 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                🔒
              </span>
            </div>

            {error && (
              <div className="text-red-600 text-center text-sm mt-2">
                {error}
              </div>
            )}

            <button className="mt-6 bg-indigo-600 text-white font-semibold py-3 rounded-lg transition hover:bg-indigo-500">
              Sign in
            </button>
          </form>

          <p className="mt-6 text-center text-gray-400">
            Don’t have an account?{' '}
            <Link href="/register" className="text-indigo-500 underline">
              Register
            </Link>
            
          </p>
          
        </motion.div>
        <motion.div>
        <Link className='mt-8 flex' href="/"><Image src="/images/whiteLogo.png" alt="Glamorize" width={40} height={50} /></Link>
        </motion.div>
        
        
      </div>
      
    </div>
  )
}

export default LoginForm
