import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SocketProvider } from "../context/SocketContext";
import MessageList from "./MessageList";
import ChatInterface from "./ChatInterface";
import { ArrowLeft } from "lucide-react";

const MessagingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user || JSON.parse(localStorage.getItem("user"));

  const preSelectedChat = location.state?.preSelectedChat;
  const [selectedChat, setSelectedChat] = useState(preSelectedChat || null);
  const [showChat, setShowChat] = useState(!!preSelectedChat);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setShowChat(true);
  };

  const handleBack = () => {
    setShowChat(false);
    setSelectedChat(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">Please login to access messages.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <SocketProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate(-1)}
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">💬</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 hidden sm:inline">
                  {user?.email}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden" style={{ height: "calc(100vh - 200px)" }}>
            <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
              <div
                className={`lg:col-span-1 border-r border-gray-200 ${
                  showChat ? "hidden lg:block" : "block"
                }`}
              >
                <MessageList user={user} onSelectChat={handleSelectChat} />
              </div>

              <div
                className={`lg:col-span-2 ${
                  showChat ? "block" : "hidden lg:block"
                }`}
              >
                <ChatInterface
                  user={user}
                  selectedChat={selectedChat}
                  onBack={handleBack}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </SocketProvider>
  );
};

export default MessagingPage;
