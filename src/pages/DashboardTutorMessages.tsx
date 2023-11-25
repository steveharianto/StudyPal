import React, { useState } from "react";
import { AiOutlineSend } from "react-icons/ai";

const DashboardTutorMessages = () => {
    const [selectedChat, setSelectedChat] = useState(0);
    const [inputMessage, setInputMessage] = useState("");
    const [chats, setChats] = useState([
        {
            id: 0,
            name: "Chat 1",
            messages: [
                { text: "Hello!", sender: "other" },
                { text: "How are you?", sender: "other" },
                { text: "I'm good, thanks for asking!", sender: "user" },
            ],
        },
        {
            id: 1,
            name: "Chat 2",
            messages: [
                { text: "Hey there!", sender: "other" },
                { text: "I'm using WhatsApp.", sender: "other" },
                { text: "That's great!", sender: "user" },
            ],
        },
        // Add more chats as needed
    ]);

    const handleChatSelect = (chatId) => {
        setSelectedChat(chatId);
    };

    const handleMessageSend = () => {
        if (inputMessage.trim() === "") return;
        const newMessage = { text: inputMessage, sender: "user" };

        const updatedChats = chats.map((chat) => {
            if (chat.id === selectedChat) {
                return { ...chat, messages: [...chat.messages, newMessage] };
            }
            return chat;
        });

        // Simulate a response from the other user
        setTimeout(() => {
            const response = { text: "Thanks for your message!", sender: "other" };
            const chatsWithResponse = updatedChats.map((chat) => {
                if (chat.id === selectedChat) {
                    return { ...chat, messages: [...chat.messages, response] };
                }
                return chat;
            });
            setChats(chatsWithResponse);
        }, 1000); // 1 second delay

        setChats(updatedChats);
        setInputMessage("");
    };

    return (
        <div className="flex h-[80vh]">
            {/* Chat List */}
            <div className="w-1/4 bg-gradient-to-b from-gray-200 to-gray-300 p-4 overflow-y-auto max-h-[80vh]">
                {chats.map((chat) => (
                    <div key={chat.id} className="p-3 mb-2 hover:bg-gradient-to-r from-purple-300 to-pink-300 cursor-pointer rounded-lg" onClick={() => handleChatSelect(chat.id)}>
                        <p className="font-semibold">{chat.name}</p>
                        <p className="text-sm text-gray-600">{chat.messages[chat.messages.length - 1].text}</p>
                    </div>
                ))}
            </div>

            {/* Chat Window */}
            <div className="flex flex-col w-3/4 bg-gradient-to-b from-white to-gray-100 max-h-[80vh]">
                {/* Chat Messages */}
                <div className="flex-grow overflow-y-auto p-4">
                    {chats[selectedChat].messages.map((message, index) => (
                        <div key={index} className={`flex mb-4 ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`p-3 rounded-lg ${message.sender === "user" ? "bg-blue-200" : "bg-green-200"} shadow-md`}>
                                <p>{message.text}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Message Input */}
                <div className="p-3 border-t-2 border-gray-300">
                    <div className="flex items-center space-x-3">
                        <input type="text" className="flex-grow p-3 border rounded-lg shadow-sm" placeholder="Type a message" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} onKeyPress={(e) => e.key === "Enter" && handleMessageSend()} />
                        <button className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg" onClick={handleMessageSend}>
                            <AiOutlineSend />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardTutorMessages;
