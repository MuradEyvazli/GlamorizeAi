import React from 'react'

const AllButton = ({title}) => {
  return (
    <div className="mt-4">
            <button className="px-10 py-2 bg-gradient-to-r from-[#66c1f6] to-[#5a5ede] text-white font-semibold rounded-xl hover:shadow-2xl hover:scale-105 transition-all transform duration-300 ease-in-out">
              {title}
            </button>
          </div>
  )
}

export default AllButton