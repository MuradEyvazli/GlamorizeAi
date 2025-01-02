'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
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
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Left Side: Background Image */}
      <div className="lg:w-1/2 w-full h-1/3 lg:h-full bg-cover bg-center relative" style={{ backgroundImage: "url('/images/sal.jpg')" }}>
        <div className="absolute bottom-5 left-5 text-white text-lg md:text-2xl font-semibold">
          <h2>AI Generative</h2>
          <p>Anything you can Imagine</p>
          <p className="text-sm mt-2">Generate any type of art with Glamorize AI by Murad Eyvazli</p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="lg:w-1/2 w-full flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4 md:px-16 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="w-full max-w-md p-6 md:p-10 bg-opacity-20 backdrop-blur-lg bg-gray-900 rounded-lg shadow-lg"
        >
          <h1 className="text-2xl md:text-4xl font-extrabold mb-4 md:mb-6 text-white">Welcome Back!</h1>
          <p className="text-gray-400 mb-4 md:mb-8">Enter your email and password</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <input
                type="email"
                placeholder="Email address"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-10 py-2 md:px-12 md:py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">📧</span>
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-10 py-2 md:px-12 md:py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">🔒</span>
            </div>

            {error && (
              <div className="text-red-600 text-center text-sm mt-2">{error}</div>
            )}

            <button className="mt-4 md:mt-6 bg-indigo-600 text-white font-semibold py-2 md:py-3 rounded-lg transition hover:bg-indigo-500">Sign in</button>
          </form>

          <p className="mt-4 md:mt-6 text-center text-gray-400">
            Don’t have an account?{' '}
            <Link href="/register" className="text-indigo-500 underline">Register</Link>
          </p>
        </motion.div>
        <motion.div>
          <Link className='mt-4 md:mt-8 flex' href="/">
            <Image src="/images/whiteLogo.png" alt="Glamorize" width={40} height={50} />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default LoginForm
