import { useState } from 'react'

import './App.css'
import Navbar from './components/Navbar'
import Background from './components/Background'
import Footer from './components/Footer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar />
      <div className="lg:min-h-[87vh]  bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]">
      <Background />
      </div>
      <Footer/>

    </>
  )
}

export default App
