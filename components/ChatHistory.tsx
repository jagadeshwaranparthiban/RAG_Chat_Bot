const ChatHistory = () => {
    const chats = ["Add space to card","RAG solution plan","Websockets explained","SDE Intern tips"]
    return (
        <div className="flex flex-col gap-3">
            <h4 className="text-white text-lg font-medium">Chats</h4>
            <ul className="text-white flex flex-col gap-1">
                {chats.map((chat)=>(
                    <li key={chats.indexOf(chat)}>
                        <div className="w-full p-2 bg-transparent rounded-lg hover:bg-blue-200 hover:font-medium hover:text-blue-400 transition duration-100">
                            <button className="cursor-pointer">
                            {chat}
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ChatHistory