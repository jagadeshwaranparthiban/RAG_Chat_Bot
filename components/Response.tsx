const Response = ({ text }:{ text:string }) => {
  return (
    <div className={`px-4 py-2 max-h-[70vh] w-full mb-40 text-white font-medium flex justify-start overflow-x-hidden max-w-4xl overflow-y-auto rounded-md scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-blue-300 self-start`}>
        <p className="whitespace-pre-wrap leading-relaxed">{text}</p>
    </div>
  )
}

export default Response