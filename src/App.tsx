import './App.css'
import { useState } from 'react';
// import ItemCard from '../components/ItemCard'
import InputForm from '../components/InputForm'
import SideSection from '../components/SideSection'
// import type { Item, CartItem } from '../types/index'
import ArrowIcon from '../Icons/ArrowIcon';

function App() {

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  
  return (
    <div className='h-screen overflow-y-auto bg-linear-to-t from-slate-900 to-blue-900'>
      <button
        title={sidebarOpen ? 'close' : 'open sidebar'}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute top-4 left-4 z-50 px-2 py-1 bg-transparent text-white text-lg hover:font-medium hover:text-blue-500 rounded-full hover:shadow-md hover:bg-white transition duration-300"
      >
        {sidebarOpen ? <ArrowIcon /> : '☰'}
      </button>

      <div
        className={`fixed top-0 left-0 h-full w-1/5 bg-gradient-to-r from-slate-600 to-blue-500 rounded-r-lg transform transition-transform duration-300 ease-in-out z-40 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SideSection />
      </div>

      <div className={`h-[100vh] bg-linear-to-r from-slate-600 to-blue-500 rounded-lg flex justify-center`}>
        <InputForm isSideBarOpen={sidebarOpen} />
      </div>
    </div>
  )
}

export default App
