import { useState, useRef } from "react"
import InputFilesList from "./InputFilesList";
import SearchIcon from "../Icons/SearchIcon";
import FileIcon from "../Icons/FileIcon";
import Response from './Response';
import axios from 'axios';
import type {prompt,chatInfo} from '../types/index.ts'
import Loading from "./Loading.tsx";


interface ChatResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
      role: string;
    };
    finishReason: string;
    avgLogprobs: number;
  }[];
}

const InputForm = ({ isSideBarOpen} : {isSideBarOpen:boolean}) => {
    const [files, setFiles] = useState<File[] | null>(null);
    const fileNameRef = useRef<HTMLInputElement | null>(null);
    const [isSearchButtonClicked, setIsSearchButtonClicked] = useState<boolean>(false);
    const [requestPrompt, setRequestPrompt] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<any>("");
    const [response, setResponse] = useState<string>("");
    const [isPromptValid, setIsPromptValid] = useState<boolean>(false);
    const [chat, setChat] = useState<chatInfo[]>([])

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

    const handleSearch = async(e)=> {
        e.preventDefault();
        if(requestPrompt.trim()===""){
            alert("Please enter a valid prompt");
            return;
        }
        try{
            setIsPromptValid(true);
            setIsSearchButtonClicked(true);
            setIsLoading(true)
            const req:prompt = { prompt:requestPrompt.trim() } 
            const res = await axios.post<ChatResponse>("http://localhost:8081/api/chat/ask", req);
            const text = res.data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
                console.log(text);
                setResponse(text);
                setChat(prevChat => {
                    return [...prevChat, 
                        {id:prevChat.length+1, sender:"user", message:requestPrompt},
                        {id:prevChat.length+1, sender:"server", message:text}
                    ]
                })
            } else {
                setError("No valid response text found.");
            }
            setIsLoading(false);
            setRequestPrompt("");
        }catch(error){
            console.error(error);
            setError(error);
        }
    }
    
    return (
        <div className={`flex flex-col gap-8 mt-30 items-center ${isSideBarOpen ? 'transition duration-300 translate-x-30' : 'transition duration-300'}`}>
            {chat.length!==0 &&
                <div className="w-full max-w-4xl max-h-[70vh] overflow-y-auto mb-40">
                    <ul className="flex flex-col gap-2">
                        {chat.map(msg => (
                            <li key={msg.id} className={`px-4 py-2 rounded-2xl ${msg.sender==='user' ? 'self-end bg-blue-300 text-blue-600' : 'self-start text-white w-full max-w-2xl overflow-hidden'}`}>
                                <h6 className="font-medium">{msg.message}</h6>
                            </li>
                        ))}
                    </ul>
                </div>
            }
            <div className={`flex justify-center ${isSearchButtonClicked ? 'hidden' : ''}`}>
                <h1 className="text-4xl text-center font-bold text-white font-serif">How can i help you today?</h1>
            </div>
            <div className={`flex justify-center ${isSearchButtonClicked ? 'transition duration-500 translate-y-120 fixed' : ''}`}>
                <div className="w-180 px-5 py-3 flex justify-between opacity-80 bg-blue-200 rounded-full focus:outline-0 shadow-lg shadow-blue-600">
                    <div className="flex flex-row space-x-3">
                        <button title="Add Files" className="group btn-custom" onClick={handleFileInput}>
                            <FileIcon />
                        </button>
                        <input 
                            className="w-150 outline-0 font-medium"
                            type="text"
                            placeholder="enter your prompt here" 
                            value={requestPrompt} 
                            onChange={(e)=>setRequestPrompt(e.target.value)}
                        ></input>
                    </div>
                    <button title="search" className="group btn-custom" onClick={handleSearch}>
                        <SearchIcon />
                    </button>
                </div>
            </div>
            <input type="file" ref={fileNameRef} onChange={handleFileChange} className="hidden"></input>
            {files!==null && <InputFilesList inputFiles={files} onRemoveFile={handleFileRemoval} isSearchButtonClicked={isSearchButtonClicked}/>}
            {error && 
                <div className="p-4 bg-red-600 text-white w-full max-w-xl overflow-hidden flex justify-center rounded-full">
                    <h4 className="font-medium">{error}</h4>
                </div>
            }
        </div>
    )
}

export default InputForm