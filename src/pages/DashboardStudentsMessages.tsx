import React, { useState } from "react";
import { AiOutlineSend } from "react-icons/ai";

const DashboardStudentMessages = () => {
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
    <div className="flex" style={{ height: 'calc(100vh - 8.8rem)' }}>
      {/* Chat List */}
      <div className="w-1/4 bg-gray-200 p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 8.8rem)' }}>
        {chats.map((chat) => (
          <div
            key={chat.id}
            className="p-3 hover:bg-gray-300 cursor-pointer"
            onClick={() => handleChatSelect(chat.id)}
          >
            <p className="font-semibold">{chat.name}</p>
            <p className="text-sm text-gray-600">
              {chat.messages[chat.messages.length - 1].text}
            </p>
          </div>
        ))}
      </div>

      {/* Chat Window */}
      <div className="flex flex-col w-3/4 bg-white" style={{ maxHeight: 'calc(100vh - 8.8rem)' }}>
        {/* Chat Messages */}
        <div className="flex-grow overflow-y-auto p-4">
          {chats[selectedChat].messages.map((message, index) => (
            <div
              key={index}
              className={`flex mb-4 ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-2 rounded-md ${
                  message.sender === "user" ? "bg-blue-100" : "bg-gray-200"
                }`}
              >
                <p>{message.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-3 border-t-2">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              className="flex-grow p-2 border rounded"
              placeholder="Type a message"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleMessageSend()}
            />
            <button
              className="p-2 bg-blue-500 text-white rounded-full"
              onClick={handleMessageSend}
            >
              <AiOutlineSend />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStudentMessages;
