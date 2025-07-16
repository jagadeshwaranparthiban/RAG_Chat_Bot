import './App.css'
import { useState } from 'react';
import ItemCard from '../components/ItemCard'
import InputForm from '../components/InputForm'
import SideSection from '../components/SideSection'
import type {Item, CartItem } from './types/index'

function App() {

  const [sidebarOpen, setSidebarOpen] = useState(false);


  let items: Item[]=[
    {
      id:1,
      name:"Burger",
      description:"A tasty and juicy beef patty burger",
      price:"$49",
      count:0
    },
    {
      id:2,
      name:"Pizza",
      description:"Delicious thin crust pepporoni Pizza",
      price:"$99",
      count:0
    },
    {
      id:3,
      name:"Cola",
      description:"A Chill drink",
      price:"$19",
      count:0
    }
  ]
  const [cartItems, setCartItems] = useState<typeof items>([]);

  // const handleItemIncrement = (id:number)=>{
  //   setCartItems((prevItems)=>{
  //     const existingItem = prevItems.find(item => item.id===id);
  //     if(existingItem){
  //       return prevItems.map((item)=>(
  //         item.id===id ? { ...item, count:item.count+1} : item
  //       ))
  //     }else{
  //       const itemToAdd = items.find(item => item.id===id);
  //       if(itemToAdd){
  //         return [...prevItems, {...itemToAdd, count:1}];
  //       }
  //     }
  //     return prevItems;
  //   })
  //   items.map((item)=>(
  //     item.id===id ? {...item,count:item.count+1} : item
  //   ))
  //   console.log(cartItems)
  // }

  // const handleItemDecrement = (id:number)=>{
  //   setCartItems(prevItems => {
  //     const existingItem = prevItems.find(item => item.id===id);
  //     if(!existingItem) return prevItems;
  //     if(existingItem.count===1){
  //       return prevItems.filter(item => item.id===id);
  //     }else{
  //       return prevItems.map((item)=>(
  //         item.id===id ? {...item, count:item.count-1} : item
  //       ));
  //     }
  //   })
  //   items.map((item)=>(
  //     item.id===id ? item.count===0 ? item : {...item,count:item.count-1} : item
  //   ))
  //   console.log(cartItems)
  // }


        {/* <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
        {
          items.map((item) => (
            <li>
              <ItemCard
                item={item}
                handleItemIncrement={handleItemIncrement}
                handleItemDecrement={handleItemDecrement}
              />
            </li>
          ))
        }
      </ul> */}

  return (
    <div className='h-full bg-linear-to-t from-slate-900 to-blue-900'>
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute top-4 left-4 z-50 px-2 py-1 bg-transparent text-white text-lg hover:font-medium hover:text-blue-500 rounded-full hover:shadow-md hover:bg-white transition duration-300"
      >
        {sidebarOpen ? '<-' : '☰'}
      </button>

      <div
        className={`fixed top-0 left-0 h-full w-1/5 bg-gradient-to-r from-slate-600 to-blue-500 rounded-r-lg transform transition-transform duration-300 ease-in-out z-40 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SideSection />
      </div>

      <div className='h-[100vh] bg-linear-to-r from-slate-600 to-blue-500 rounded-lg flex justify-center'>
        <InputForm />
      </div>
    </div>
  )
}

export default App
