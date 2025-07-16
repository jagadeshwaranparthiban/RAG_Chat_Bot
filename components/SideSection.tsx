import ChatHistory from '../components/ChatHistory'

const SideSection = () => {
  return (
    <div className="mt-15 flex flex-col gap-4 px-4 py-5 w-full">
        <div className="flex flex-row space-x-2 items-center">
            <div className="h-10 w-10 px-1 bg-pink-300 rounded-full text-white flex justify-center items-center font-bold">
                J
            </div>
            <h5 className="font-medium text-white">Jagadeshwaran</h5>
        </div>
        <div className='mt-10'>
            <ChatHistory />
        </div>
    </div>
  )
}

export default SideSection