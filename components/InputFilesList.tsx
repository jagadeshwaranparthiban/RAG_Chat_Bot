const InputFilesList = ({ inputFiles, onRemoveFile, isSearchButtonClicked }: { inputFiles: File[] | null, onRemoveFile:(file:File)=>void, isSearchButtonClicked:boolean }) => {
    if(!inputFiles || inputFiles.length===0) return null;

    const removeFile = (file:File)=>{
        console.log(file.name)
        onRemoveFile(file)
    }
    
    return (
        <div className="">
            <ul className={`max-w-4xl flex flex-row space-x-3 transition duration-200 overflow-x-hidden ${isSearchButtonClicked ? 'hidden' : ''}`}>
                {inputFiles.map((file:File) => (
                    <li key={inputFiles.indexOf(file)} className="px-2 py-1 flex flex-row justify-between rounded-full bg-blue-200 text-blue-600">
                        <p>{file.name}</p>
                        <button className="ms-3 bg-transparent hover:bg-white hover:text-blue-600 transition duration-200 rounded-full px-1 text-white cursor-pointer" onClick={() => removeFile(file)}>X</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default InputFilesList