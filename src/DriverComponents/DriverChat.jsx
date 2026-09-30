import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { useAppContext } from "../passangercontext/AppContext";
import socket from "../socket";
import notificationSound from "../assets/notification.mp3";

const DriverChat = () => {
  const { setSelectedTrip } = useAppContext();
  const [trips, setTrips] = useState([]);
  const [activeTrip, setActiveTrip] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef(null);
  const audioRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const notificationAudio = useRef(null);

  // جلب كل الرحلات النشطة للكابتن
  useEffect(() => {
    async function fetchTrips() {
      const all = await fetch("/api/trips").then((res) => res.json());
      // فقط الرحلات التي بها ركاب ولم تنتهِ
      setTrips(
        all.filter(
          (t) =>
            t.captain &&
            t.captain._id === user.id &&
            t.passengers &&
            t.passengers.length > 0 &&
            t.status !== "Completed"
        )
      );
    }
    fetchTrips();
  }, []);

  // عند اختيار رحلة من القائمة
  useEffect(() => {
    if (activeTrip) {
      localStorage.setItem('privateTripId', activeTrip._id);
      setSelectedTrip(activeTrip);
    }
  }, [activeTrip, setSelectedTrip]);

  // جلب رسائل الشات عند فتح الصفحة وكل 5 ثواني
  useEffect(() => {
    if (!activeTrip || !activeTrip._id || !user) return;
    socket.emit("joinTrip", activeTrip._id);
    setChatMessages([]); // Clear messages when switching trips
    // Fetch initial messages
    const token = localStorage.getItem("token");
    fetch(
      `/api/chat?userId=${
        activeTrip.passengers[0]._id || activeTrip.passengers[0]
      }&trip=${activeTrip._id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
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
      console.log("[SOCKET] Driver received chatMessage:", msg);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      setHasNewMessage(true);
      if (msg.trip === activeTrip._id) {
        setChatMessages((prev) => [...prev, msg]);
        if (msg.sender !== user.id) {
          showBrowserNotification(msg.message);
        }
      }
    };
    socket.on("chatMessage", handleChatMessage);
    return () => {
      socket.off("chatMessage", handleChatMessage);
    };
  }, [activeTrip?._id, user?.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

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
    if (!newMessage.trim() || !activeTrip || !user) return;
    let receiver = null;
    if (
      user.role === "Driver" &&
      activeTrip &&
      activeTrip.passengers &&
      activeTrip.passengers[0]
    )
      receiver = activeTrip.passengers[0]._id || activeTrip.passengers[0];
    if (!receiver) return;

    const messageData = {
      tripId: activeTrip._id,
      sender: user.id,
      receiver,
      message: newMessage,
    };

    console.log("[SOCKET] Driver sending chatMessage:", messageData);
    socket.emit("chatMessage", messageData);
    setNewMessage("");
  };

  // حساب Badge (رسالة جديدة) لكل رحلة
  const getHasNewMessage = (trip) => {
    const lastMsg =
      chatMessages.length > 0 ? chatMessages[chatMessages.length - 1] : null;
    // إذا آخر رسالة من الراكب ولم يفتحها الكابتن
    if (lastMsg && lastMsg.sender !== user.id && lastMsg.trip === trip._id) {
      // تحقق من آخر وقت فتح الشات لهذه الرحلة
      const lastRead = localStorage.getItem("chat_last_read_" + trip._id);
      if (!lastRead || new Date(lastMsg.createdAt) > new Date(lastRead)) {
        return true;
      }
    }
    return false;
  };

  // عند فتح شات رحلة، اعتبر الرسائل مقروءة
  useEffect(() => {
    if (activeTrip && chatMessages.length > 0) {
      localStorage.setItem(
        "chat_last_read_" + activeTrip._id,
        new Date().toISOString()
      );
      setHasNewMessage(false);
    }
  }, [activeTrip, chatMessages]);

  return (
    <div className="min-h-[60vh] flex flex-col bg-slate-900/60">
      {/* قائمة الرحلات النشطة */}
      <div className="flex space-x-2 px-4 py-2 bg-slate-800/80 border-b border-slate-700 overflow-x-auto">
        {trips.map((trip) => (
          <button
            key={trip._id}
            onClick={() => setActiveTrip(trip)}
            className={`px-4 py-2 rounded-xl font-semibold mr-2 flex items-center space-x-2 ${
              activeTrip && activeTrip._id === trip._id
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-700"
            }`}
          >
            <span>
              {trip.from} → {trip.to}
            </span>
            {getHasNewMessage(trip) && (
              <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">
                New
              </span>
            )}
          </button>
        ))}
        {trips.length === 0 && (
          <span className="text-slate-400">لا توجد رحلات نشطة</span>
        )}
      </div>
      <div className="bg-slate-800/80 backdrop-blur-sm shadow-sm border-b border-slate-700 px-6 py-4">
        <div className="flex items-center">
          {activeTrip && activeTrip.passengers && activeTrip.passengers[0] && (
            <>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">
                  {activeTrip.passengers[0].name
                    ? activeTrip.passengers[0].name[0]
                    : "P"}
                </span>
              </div>
              <div>
                <h1 className="text-lg font-semibold">
                  {activeTrip.passengers[0].name || "الراكب"}
                </h1>
                <p className="text-sm text-slate-300">Online</p>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="flex-1 px-6 py-4 overflow-y-auto">
        <div className="space-y-4">
          {activeTrip &&
            Array.isArray(chatMessages) &&
            chatMessages.map((message, idx) => (
              <div
                key={message._id || idx}
                className={`flex ${
                  message.sender === user.id ? "justify-end" : "justify-start"
                } items-end`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-md border ${
                    message.sender === user.id
                      ? "bg-blue-600 text-white border-blue-400"
                      : "bg-white text-gray-900 border-gray-200"
                  } flex items-center`}
                >
                  {/* Red dot for messages from passenger */}
                  {message.sender !== user.id && (
                    <span className="text-red-500 text-lg mr-2">●</span>
                  )}
                  <p className="text-base leading-relaxed">{message.message}</p>
                  <div className="flex justify-end mt-1 w-full">
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
      <div className="bg-slate-800/80 backdrop-blur-sm border-t border-slate-700 px-6 py-4">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder={
              activeTrip ? "Type a message..." : "اختر رحلة لبدء الشات"
            }
            disabled={!activeTrip}
            className="flex-1 bg-slate-700 text-white px-4 py-3 rounded-xl border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400 disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 p-3 rounded-xl hover:bg-blue-700 transition-colors"
            disabled={!activeTrip}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
      {/* Audio element for notification sound */}
      <audio ref={audioRef} src={notificationSound} preload="auto" />
    </div>
  );
};

export default DriverChat;
