import type { Item,ItemCardProps } from '../types/index.ts'

const  ItemCard = ({item, handleItemIncrement, handleItemDecrement}:ItemCardProps) => {
  return (
        <div className='bg-gray-300 m-4 px-4 py-2 w-100 flex flex-row justify-between rounded-lg'>
          <div className='flex flex-col'>
            <h1 className='text-xl font-bold'>{item.name}</h1>
            <h4 className='text-red-500 font-medium'>{item.price}</h4>
            <p className='text-sm'>{item.description}</p>
          </div>
          <div className='flex justify-center items-center'>
            <div className='flex flex-row gap-2'>
              <button className='rounded-full bg-green-500 px-2 mt-2 text-white font-medium hover:bg-green-400' onClick={(e) => {e.preventDefault(); handleItemIncrement(item.id)}}>+</button>
              <h6 className='mt-1'>{item.count}</h6>
              <button className='rounded-full bg-red-500 px-2 mt-2 text-white font-medium hover:bg-red-400' onClick={(e) => {e.preventDefault(); handleItemDecrement(item.id)}}>-</button>
            </div>
          </div>
        </div>
  )
}

export default ItemCard