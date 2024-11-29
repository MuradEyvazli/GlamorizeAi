import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const FakeNavbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-lg">
      <div className="flex justify-center items-center px-6 py-4">
        <div className="text-2xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#66c1f6] to-[#5a5ede]">
          <Link href="/">
            <Image 
              src="/images/GlamorizeAi.png" 
              alt="Glamorize" 
              width={150} 
              height={100} 
              className="mx-auto"
            />
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default FakeNavbar;
