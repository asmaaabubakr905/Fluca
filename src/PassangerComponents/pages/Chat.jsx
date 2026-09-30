import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, Send, Anchor, Users } from "lucide-react";
import socket from "../../socket";
import notificationSound from "../../assets/notification.mp3";

import { useAppContext } from "../../passangercontext/AppContext";

const Chat = ({ setHasNewMessage }) => {
  const { selectedTrip } = useAppContext();
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const chatEndRef = useRef(null);
  const audioRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const notificationAudio = useRef(null);

  const participants = [];
  if (selectedTrip) {
    if (
      selectedTrip.captain &&
      (selectedTrip.captain._id || selectedTrip.captain) !== user.id
    ) {
      participants.push({
        _id: selectedTrip.captain._id || selectedTrip.captain,
        name: selectedTrip.captain.name || "Captain",
        role: "Captain",
      });
    }
    if (selectedTrip.passengers && Array.isArray(selectedTrip.passengers)) {
      selectedTrip.passengers.forEach((p) => {
        const pid = p._id || p;
        if (pid !== user.id) {
          participants.push({
            _id: pid,
            name: p.name || "Passenger",
            role: "Passenger",
          });
        }
      });
    }
  }

  useEffect(() => {
    if (!selectedTrip || !selectedTrip._id || !user || !selectedUser) return;
    socket.emit("joinTrip", selectedTrip._id);
    setChatMessages([]); // Clear messages when switching
    // Fetch initial messages
    const token = localStorage.getItem("token");
    fetch(`/api/chat?userId=${selectedUser._id}&trip=${selectedTrip._id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch chat messages");
        return res.json();
      })
      .then((data) => {
        setChatMessages(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setChatMessages([]);
      });
    // Listen for real-time messages
    const handleChatMessage = (msg) => {
      console.log("[SOCKET] Passenger received chatMessage:", msg);
      if (msg.trip === selectedTrip._id) {
        setChatMessages((prev) => [...prev, msg]);
        if (msg.sender !== user.id) {
          playNotification();
          showBrowserNotification(msg.message);
          setHasNewMessage && setHasNewMessage(true);
        }
      }
    };
    socket.on("chatMessage", handleChatMessage);
    return () => {
      socket.off("chatMessage", handleChatMessage);
    };
  }, [selectedTrip?._id, user?.id, selectedUser?._id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    if (!selectedUser && participants.length === 1) {
      setSelectedUser(participants[0]);
    }
  }, [participants, selectedUser]);

  // Ensure notification permission is requested on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission().then((perm) => {
        console.log("[NOTIFICATION] Permission status:", perm);
      });
    }
  }, []);

  useEffect(() => {
    notificationAudio.current = new Audio(notificationSound);
  }, []);

  // Play notification sound
  const playNotification = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      console.warn("[SOUND] audioRef is not set");
    }
  };

  // Show browser notification
  const showBrowserNotification = (message) => {
    if (document.hidden && "Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("New Chat Message", { body: message });
        console.log("[NOTIFICATION] Browser notification shown");
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification("New Chat Message", { body: message });
            console.log(
              "[NOTIFICATION] Browser notification shown after request"
            );
          } else {
            console.warn("[NOTIFICATION] Permission denied");
          }
        });
      } else {
        console.warn("[NOTIFICATION] Permission denied");
      }
    } else {
      console.log(
        "[NOTIFICATION] Not showing notification (tab focused or API unavailable)"
      );
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedTrip || !user || !selectedUser) return;
    const receiver = selectedUser._id;
    if (!receiver) return;

    const messageData = {
      tripId: selectedTrip._id,
      sender: user.id,
      receiver,
      message: newMessage,
    };

    console.log("[SOCKET] Passenger sending chatMessage:", messageData);
    socket.emit("chatMessage", messageData);
    setNewMessage("");
  };

  useEffect(() => {
    if (selectedTrip && chatMessages.length > 0) {
      setHasNewMessage && setHasNewMessage(false);
    }
  }, [selectedTrip, chatMessages]);

  // عند التمرير لنهاية الرسائل، اعتبر الرسائل مقروءة
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setHasNewMessage && setHasNewMessage(false);
    }
  };

  return (
    <div className="h-full min-h-0 flex flex-col" style={{ height: "100%" }}>
      {/* Header */}
      <div className="bg-slate-800/80 backdrop-blur-sm shadow-sm border-b border-slate-700 px-6 py-4">
        <div className="flex items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              {selectedUser ? (
                <Users className="w-5 h-5 text-white" />
              ) : (
                <Anchor className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-lg font-semibold">
                {selectedUser ? selectedUser.name : "Select User to Chat"}
              </h1>
              <p className="text-sm text-slate-300">
                {selectedUser
                  ? selectedUser.role === "Captain"
                    ? "Captain"
                    : "Passenger"
                  : ""}
              </p>
            </div>
          </div>
        </div>
        {participants.length > 1 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {participants.map((p) => (
              <button
                key={p._id}
                onClick={() => setSelectedUser(p)}
                className={`px-4 py-2 rounded-full border text-sm font-semibold transition-colors ${
                  selectedUser && selectedUser._id === p._id
                    ? "bg-blue-600 text-white border-blue-400"
                    : "bg-slate-700 text-white border-slate-500 hover:bg-blue-700"
                }`}
              >
                {p.name} {p.role === "Captain" ? "(Captain)" : ""}
              </button>
            ))}
          </div>
        )}
        {participants.length === 0 && (
          <span className="text-yellow-300 font-bold">
            No other participants in this trip yet.
          </span>
        )}
      </div>
      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4 bg-slate-900/60 scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-slate-800 min-h-0"
        style={{ maxHeight: "60vh" }}
        onScroll={handleScroll}
      >
        <div className="flex flex-col gap-4 justify-end min-h-full">
          {!selectedUser && (
            <div className="text-center text-yellow-300 font-bold">
              Select a user to start chatting.
            </div>
          )}
          {selectedUser &&
            Array.isArray(chatMessages) &&
            chatMessages.map((message, idx) => (
              <div
                key={message._id || idx}
                className={`flex ${
                  message.sender === user.id ? "justify-end" : "justify-start"
                } items-end`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-5 py-3 rounded-2xl shadow-lg border transition-all duration-200 ${
                    message.sender === user.id
                      ? "bg-blue-600 text-white border-blue-400"
                      : "bg-white text-gray-900 border-gray-200"
                  }`}
                  style={{ marginBottom: 2 }}
                >
                  <p className="text-base leading-relaxed break-words whitespace-pre-line">
                    {message.message}
                  </p>
                  <div className="flex justify-end mt-1">
                    <span
                      className={`text-xs ${
                        message.sender === user.id
                          ? "text-blue-200"
                          : "text-gray-400"
                      }`}
                    >
                      {new Date(
                        message.timestamp || message.createdAt
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          <div ref={chatEndRef} />
        </div>
      </div>
      {/* Input */}
      <div className="bg-white/90 backdrop-blur-md border-t border-slate-200 px-4 py-5 shadow-2xl flex flex-col items-center">
        <div className="flex items-center w-full max-w-2xl space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 bg-slate-100 text-gray-900 px-5 py-4 rounded-full border border-slate-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 placeholder-slate-400 text-base shadow-md"
            style={{ marginTop: 0 }}
            disabled={!selectedUser}
          />
          <button
            onClick={sendMessage}
            className={`bg-blue-600 p-4 rounded-full transition-colors shadow-lg flex items-center justify-center ${
              !selectedUser
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700"
            }`}
            style={{ marginLeft: 4 }}
            disabled={!selectedUser}
          >
            <Send className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
      {/* Audio element for notification sound */}
      <audio ref={audioRef} src={notificationSound} preload="auto" />
    </div>
  );
};

export default Chat;
