import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Manager from './components/Manager'
import Footer from './components/Footer'

function App() {
  const [count, setCount] = useState(0)

  return (
 <>

    <Navbar/>
    <Manager/>
    <Footer/>
    
    


 </>       
  )
}

export default App
