import React, { useEffect, useState } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import db from "../firebase"; // Assuming db is your Firestore instance

const DashboardStudentMessages = () => {
  const navigate = useNavigate();
  const { cookies } = useOutletContext();
  const [user, setUser] = useState({});
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [inputMessage, setInputMessage] = useState("");

  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);

  const getOtherParticipant = (chat) => {
    return chat.firstPerson === user.username
      ? chat.secondPerson
      : chat.firstPerson;
  };

  const handleChatSelect = (chatId) => {
    setSelectedChatId(chatId);
  };

  const handleMessageSend = async () => {
    if (inputMessage.trim() === "") return;

    const newMessage = {
      chatId: selectedChatId,
      sender: user.username,
      receiver: getOtherParticipant(
        chats.find((chat) => chat.chatId === selectedChatId)
      ),
      timestamp: new Date(),
      content: inputMessage,
      type: "text",
    };

    // Add new message to Firestore
    await addDoc(collection(db, "messages"), newMessage);

    setInputMessage("");
  };

  useEffect(() => {
    const userCookie = cookies.get("user");
    if (userCookie) {
      setUser({
        username: userCookie.username,
        fullname: userCookie.fullname,
        email: userCookie.email,
        role: userCookie.role,
        dateOfBirth: userCookie.dateOfBirth,
        phoneNumber: userCookie.phoneNumber,
        balance: userCookie.balance,
      });

      // Fetch chats where the user is firstPerson
      const firstPersonQuery = query(
        collection(db, "chats"),
        where("firstPerson", "==", userCookie.username)
      );
      const firstPersonChats = [];

      const unsubscribeFirst = onSnapshot(firstPersonQuery, (snapshot) => {
        snapshot.docs.forEach((doc) => {
          firstPersonChats.push({ chatId: doc.id, ...doc.data() });
        });
      });

      // Fetch chats where the user is secondPerson
      const secondPersonQuery = query(
        collection(db, "chats"),
        where("secondPerson", "==", userCookie.username)
      );
      let combinedChats = [];

      const unsubscribeSecond = onSnapshot(secondPersonQuery, (snapshot) => {
        const secondPersonChats = snapshot.docs.map((doc) => ({
          chatId: doc.id,
          ...doc.data(),
        }));
        combinedChats = [...firstPersonChats, ...secondPersonChats];
        setChats(combinedChats);
      });

      // Fetch messages
      const messagesQuery = query(collection(db, "messages"));
      const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
        const fetchedMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(fetchedMessages);
      });

      return () => {
        unsubscribeFirst();
        unsubscribeSecond();
        unsubscribeMessages();
      };
    } else {
      navigate("/");
    }
  }, []);

  const getChatMessages = (chatId) => {
    return messages
      .filter((message) => message.chatId === chatId)
      .sort((a, b) => a.timestamp - b.timestamp); 
  };

  const userInvolvedChats = chats.filter(
    (chat) =>
      chat.firstPerson === user.username || chat.secondPerson === user.username
  );

  return (
    <div className="flex h-[80vh]">
      {/* Chat List */}
      <div className="w-1/4 bg-gradient-to-b from-gray-200 to-gray-300 p-4 overflow-y-auto max-h-[80vh]">
        {userInvolvedChats.map((chat) => (
          <div
            key={chat.chatId}
            className={`p-3 mb-2 cursor-pointer rounded-lg ${
              chat.chatId === selectedChatId
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                : "hover:bg-gradient-to-r from-purple-300 to-pink-300"
            }`}
            onClick={() => handleChatSelect(chat.chatId)}
          >
            <p className="font-semibold">{getOtherParticipant(chat)}</p>
            <p className="text-sm">
              {getChatMessages(chat.chatId).slice(-1)[0]?.content ||
                "No messages yet"}
            </p>
          </div>
        ))}
      </div>

      {/* Chat Window */}
      <div className="flex flex-col w-3/4 bg-gradient-to-b from-white to-gray-100 max-h-[80vh]">
        {/* Chat Messages */}
        <div className="flex-grow overflow-y-auto p-4">
          {messages &&
            getChatMessages(selectedChatId).map((message, index) => (
              <div
                key={index}
                className={`flex mb-4 ${
                  message.sender === user.username
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`p-3 rounded-lg ${
                    message.sender === user.username
                      ? "bg-blue-200"
                      : "bg-green-200"
                  } shadow-md`}
                >
                  <p>{message.content}</p>
                </div>
              </div>
            ))}
        </div>

        {/* Message Input */}
        <div className="p-3 border-t-2 border-gray-300">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              className="flex-grow p-3 border rounded-lg shadow-sm"
              placeholder="Type a message"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleMessageSend()}
            />
            <button
              className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg"
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
