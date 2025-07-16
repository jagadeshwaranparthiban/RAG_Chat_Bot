import { useState, useRef } from "react"
import InputFilesList from "./InputFilesList";
import SearchIcon from "../Icons/SearchIcon";
import FileIcon from "../Icons/FileIcon";


const InputForm = () => {
    const [files, setFiles] = useState<File[] | null>(null);
    const fileNameRef = useRef<HTMLInputElement | null>(null)

    const handleFileChange = (e:React.ChangeEvent<HTMLInputElement>)=> {
        if(!e.target.files) return;

        const file = e.target.files?.[0];
        console.log(file.name)

        const allowedExtensions = ['pdf', 'docx', 'txt'];
        const extension = file.name.split('.').pop()?.toLowerCase();
        if(extension && allowedExtensions.includes(extension)){
            setFiles(prevFiles => {
                return [...(prevFiles || []), file]
            })
        }else{
            alert("Only pdf, word and text files are allowed");
        }
    }

    const handleFileInput = ()=>{
        if(fileNameRef.current){
            fileNameRef.current.click();
        }
    }

    const handleFileRemoval = (file:File) => {
        setFiles(prev => prev?.filter(f => f.name !== file.name) || [])
    }
    
    return (
        <div className="flex flex-col gap-8 mt-50">
            <div className="flex justify-center">
                <h1 className="text-4xl text-center font-bold text-white font-serif">How can i help you today?</h1>
            </div>
            <div className="flex justify-center">
                <div className="w-150 px-5 py-3 flex justify-between opacity-80 bg-blue-200 rounded-full focus:outline-0 shadow-lg shadow-blue-600">
                    <div className="flex flex-row space-x-3">
                        <button className="group btn-custom" onClick={handleFileInput}>
                            <FileIcon />
                        </button>
                        <input className="w-120 outline-0 font-medium" type="text" placeholder="enter your prompt here"></input>
                    </div>
                    <button className="group btn-custom" onClick={()=>alert("button click!")}>
                        <SearchIcon />
                    </button>
                </div>
            </div>
            <input type="file" ref={fileNameRef} onChange={handleFileChange} className="hidden"></input>
            {/* {file && <span className="text-white text-sm">{file.name}</span>} */}
            {files!==null && <InputFilesList inputFiles={files} onRemoveFile={handleFileRemoval}/>}
        </div>
    )
}

export default InputForm