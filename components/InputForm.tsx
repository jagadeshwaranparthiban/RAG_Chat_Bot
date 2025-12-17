import { useState, useRef, type KeyboardEvent, type MouseEvent } from "react"
import InputFilesList from "./InputFilesList";
import SearchIcon from "../Icons/SearchIcon";
import FileIcon from "../Icons/FileIcon";
import Response from './Response';
import axios from 'axios';
import type {prompt,chatInfo} from '../types/index.ts'
import Loading from "./Loading.tsx";


interface ChatResponse {
    llm_answer?: string;
    results: {
        heading: string;
        gist: string | null;
        main_content: string;
        sub_sections: {
            sub_heading: string;
            content: string;
        }[];
    }[];
    total_results: number;
    total_chunks: number;
    total_documents: number;
}

const InputForm = ({ isSideBarOpen} : {isSideBarOpen:boolean}) => {
    const API_URL = (import.meta as any).env.VITE_API_BASE || "http://localhost:8000";
    const [files, setFiles] = useState<File[] | null>(null);
    const fileNameRef = useRef<HTMLInputElement | null>(null);
    const [isSearchButtonClicked, setIsSearchButtonClicked] = useState<boolean>(false);
    const [requestPrompt, setRequestPrompt] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<any>("");
    const [response, setResponse] = useState<string>("");
    const [llmResponse, setLlmResponse] = useState<string>("");
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

    const handleSearch = async(e: KeyboardEvent<HTMLInputElement> | MouseEvent<HTMLButtonElement> | any)=> {
        e.preventDefault();
        if(requestPrompt.trim()===""){
            alert("Please enter a valid prompt");
            return;
        }
        try{
            setIsPromptValid(true);
            setIsSearchButtonClicked(true);
            setIsLoading(true)
            console.log(files)

            const formData = new FormData();
            formData.append("query", requestPrompt.trim());
            files?.forEach(file => formData.append("files", file));
             
            const res = await axios.post<ChatResponse>(`${API_URL}/ask`, 
                formData, { 
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );
            if (res.data?.llm_answer) {
                setLlmResponse(res.data.llm_answer);
                setChat(prevChat => {
                    return [...prevChat, 
                        {id:prevChat.length+1, sender:"user", files:files, message:requestPrompt},
                        {id:prevChat.length+2, sender:"server", message:res.data.llm_answer}
                    ]
                })
            } else {
                setError("No LLM answer found.");
            }
            setIsLoading(false);
            setRequestPrompt("");
            setFiles([]);
        }catch(error){
            console.error(error);
            setError(error);
        }
    }
    
    return (
        <div className={`flex flex-col gap-8 mt-30 items-center ${isSideBarOpen ? 'transition duration-300 translate-x-30' : 'transition duration-300'}`}>
            {llmResponse &&
                <Response text={llmResponse} />
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
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSearch(e);
                                }
                            }}
                        ></input>
                    </div>
                    <button title="search" className="group btn-custom" onClick={handleSearch}>
                        <SearchIcon />
                    </button>
                </div>
            </div>
            <input 
                type="file" 
                ref={fileNameRef} 
                onChange={handleFileChange} 
                className="hidden"                             
            ></input>
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