import React from 'react'

const Navbar = () => {
    return (
       
            <nav className="flex justify-around bg-gradient-to-tr from-white to-blue-700  font-sora h-[3rem]">
                <div className=' font-semibold items-center'> <span>&lt;</span><span className='text-[1.6rem]
                '>Pass</span><span className=' text-[2.4rem] bg-gradient-to-tr from-pink-600 to-yellow-400  text-transparent bg-clip-text '>Op</span> <span>/ &gt;</span></div>
              
                <button className=' flex items-center border border-cyan-600 p-1 rounded-full gap-3'>
                    <img  className='w-7 py-1' src="/icons/github.svg" alt="" />
                    <span className='font-bold px-1 '>Github</span>
                </button>
            </nav>
         
    )
}

export default Navbar
