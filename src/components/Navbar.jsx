import React from 'react'

const Navbar = () => {
  return (
    <nav className='bg-slate-800 text-white'>
      <div className="mycontainer  flex justify-between items-center px-4 py-5 h-14">

        <div className="logo font-bold text-white text-2xl">
          
          <span className='text-green-700'>&lt;</span>
          Pass
          <span className='text-green-700'>MAN/ &gt;</span>
          
          </div>
      
      <button className='text-white w-14 my-5 bg-green-900'>
        <img className='invert p-2' src="icons/github.svg" alt="github logo" />
        
      </button>
      </div>
    </nav>
  )
}

export default Navbar
