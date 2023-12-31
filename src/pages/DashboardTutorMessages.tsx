import React, { useEffect, useState } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  orderBy,
} from "firebase/firestore";
import db from "../firebase"; // Assuming db is your Firestore instance

const groupMessagesByDate = (messages) => {
  return messages.reduce((groups, message) => {
    const date = message.timestamp.toDate().toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});
};

const DashboardTutorMessages = () => {
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

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp.toDate()); // Convert Firestore timestamp to JS Date
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
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

  const renderMessages = () => {
    const chatMessages = getChatMessages(selectedChatId);
    const groupedMessages = groupMessagesByDate(chatMessages);

    return Object.keys(groupedMessages).map((date) => (
      <div key={date}>
        <div className="text-center my-4 p-1 bg-gray-300 rounded">
          {date}
        </div>
        {groupedMessages[date].map((message, index) => (
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
            <div className="flex items-end justify-center">
              <div className="text-xs text-gray-500 mr-2">{message.sender === user.username && formatTimestamp(message.timestamp)}</div> 
              <div>{message.content}</div>
              <div className="text-xs text-gray-500 ml-2">{message.sender !== user.username && formatTimestamp(message.timestamp)}</div>
            </div>
          </div>
        </div>
        ))}
      </div>
    ));
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
      const messagesQuery = query(
        collection(db, "messages"),
        orderBy("timestamp", "desc")
      );
      const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
        const fetchedMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(fetchedMessages);

        // Sort chats based on the latest message timestamp
        combinedChats.sort((a, b) => {
          const lastMessageA = fetchedMessages.find(
            (message) => message.chatId === a.chatId
          );
          const lastMessageB = fetchedMessages.find(
            (message) => message.chatId === b.chatId
          );
          const timestampA = lastMessageA ? lastMessageA.timestamp.seconds : 0;
          const timestampB = lastMessageB ? lastMessageB.timestamp.seconds : 0;
          return timestampB - timestampA; // Sort in descending order
        });

        setChats(combinedChats);
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
    <div className="flex h-[90vh]">
      {/* Chat List */}
      <div className="w-1/4 bg-gradient-to-b from-gray-200 to-gray-300 p-4 overflow-y-auto max-h-[90vh]">
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
      <div className="flex flex-col w-3/4 bg-gradient-to-b from-white to-gray-100 max-h-[90vh]">
        {/* Chat Messages */}
        <div className="flex-grow overflow-y-auto p-4">
          {messages && renderMessages()}
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

export default DashboardTutorMessages;
