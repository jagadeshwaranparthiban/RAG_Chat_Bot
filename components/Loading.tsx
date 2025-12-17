
const Loading = () => {
  return (
    <div className="flex flex-row space-x-3 h-16">
      <div className="px-2 py-2 w-10 h-10 border-5 border-white border-t-transparent rounded-full animate-spin"></div>
      <div className="items-center mt-2">
        <h6 className="text-white opacity-80">Fetching response..</h6>
      </div>
    </div>
  )
}

export default Loading