import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../DriverComponents/Sidebar";
import OverviewSection from "../DriverComponents/DashboardSections/OverviewSection";
import TripsSection from "../DriverComponents/DashboardSections/TripsSection";
import RequestsSection from "../DriverComponents/DashboardSections/RequestsSection";
import StatsSection from "../DriverComponents/DashboardSections/StatsSection";
import RatingsSection from "../DriverComponents/DashboardSections/RatingsSection";
import ProfileSection from "../DriverComponents/DashboardSections/ProfileSection";
import DriverChat from "../DriverComponents/DriverChat";
import { AnimatePresence } from "framer-motion";
import { apiGet, apiPatch } from "../api";
import socket from '../socket';

const getCurrentUser = () => JSON.parse(localStorage.getItem("currentUser"));

const DriverDashboard = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [trips, setTrips] = useState([]);
  const [currentSection, setCurrentSection] = useState("overview");
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const lastMessageId = useRef(null);
  const notificationAudio = useRef(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user || user.role !== "Driver") {
      navigate("/login");
      return;
    }

    async function fetchTrips() {
      try {
        const data = await apiGet("/trips");
        setTrips(data);
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    }

    fetchTrips();
    // جلب الرحلات كل 5 ثواني
    const interval = setInterval(fetchTrips, 5000);
    return () => clearInterval(interval);
  }, [navigate, user]);

  useEffect(() => {
    // انضمام لغرفة الرحلة
    const activeTrip = trips.find(
      (t) =>
        t.status === "Started" &&
        t.captain &&
        (t.captain._id === user?.id || t.captain === user?.id)
    );
    if (activeTrip && activeTrip._id) {
      socket.emit("joinTrip", activeTrip._id);
    }
  }, [trips, user]);

  useEffect(() => {
    // ابحث عن رحلة نشطة (status = Started)
    const activeTrip = trips.find(
      (t) =>
        t.status === "Started" &&
        t.captain &&
        (t.captain._id === user?.id || t.captain === user?.id)
    );
    if (!activeTrip || !navigator.geolocation) return;

    // أرسل الموقع الحالي فورًا عند بداية Started
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        apiPatch(`/trips/${activeTrip._id}/location`, {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        if (socket) {
          console.log(
            "Driver sending captainLocation via socket.io:",
            activeTrip._id,
            pos.coords.latitude,
            pos.coords.longitude
          );
          socket.emit("captainLocation", {
            tripId: activeTrip._id,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        }
      },
      (err) => {
        // Provide specific error messages based on error code
        let errorMessage = "Unknown geolocation error";
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = "Location permission denied. Please enable location access.";
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable.";
            break;
          case err.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }
        console.error("Geolocation error:", errorMessage);
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );

    // تابع الموقع وارسله للباك اند وsocket.io
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        apiPatch(`/trips/${activeTrip._id}/location`, {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        // إرسال الموقع عبر socket.io
        if (socket) {
          console.log(
            "Driver sending captainLocation via socket.io:",
            activeTrip._id,
            pos.coords.latitude,
            pos.coords.longitude
          );
          socket.emit("captainLocation", {
            tripId: activeTrip._id,
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        }
      },
      (err) => {
        // Only log watch position errors occasionally to avoid spam
        if (Math.random() < 0.1) { // Only log 10% of errors to reduce spam
          let errorMessage = "Unknown geolocation error";
          switch (err.code) {
            case err.PERMISSION_DENIED:
              errorMessage = "Location permission denied. Please enable location access.";
              break;
            case err.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable.";
              break;
            case err.TIMEOUT:
              errorMessage = "Location request timed out.";
              break;
          }
          console.error("Geolocation watch error:", errorMessage);
        }
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, [trips, user]);

  // Poll for new chat messages for notification
  useEffect(() => {
    let isMounted = true;
    async function checkNewMessages() {
      try {
        const all = await apiGet('/trips');
        const activeTrips = all.filter(t => t.captain && (t.captain._id === user.id || t.captain === user.id) && t.passengers && t.passengers.length > 0 && t.status !== 'Completed');
        for (const trip of activeTrips) {
          const passenger = trip.passengers[0];
          if (!passenger) continue;
          const res = await apiGet(`/chat?userId=${passenger._id || passenger}&trip=${trip._id}`);
          if (Array.isArray(res) && res.length > 0) {
            const lastMsg = res[res.length - 1];
            lastMessageId.current = lastMsg._id;
          }
        }
      } catch (err) {}
    }
    checkNewMessages();
    const interval = setInterval(checkNewMessages, 4000);
    return () => { isMounted = false; clearInterval(interval); };
  }, [user, currentSection]);

  // عند فتح الشات، اعتبر الرسائل مقروءة
  useEffect(() => {
    if (currentSection === 'chat') setHasNewMessage(false);
  }, [currentSection]);

  // تحديث عدد الرسائل غير المقروءة عند استقبال رسالة جديدة عبر socket
  useEffect(() => {
    const handleNewMessage = (msg) => {
      // إذا لم يكن المستخدم في صفحة الشات
      if (currentSection !== 'chat') {
        setUnreadCount((prev) => prev + 1);
      }
    };
    socket.on('chatMessage', handleNewMessage);
    return () => {
      socket.off('chatMessage', handleNewMessage);
    };
  }, [currentSection]);

  // تصفير العداد عند فتح صفحة الشات
  useEffect(() => {
    if (currentSection === 'chat') setUnreadCount(0);
  }, [currentSection]);

  const renderSection = () => {
    switch (currentSection) {
      case "overview":
        return <OverviewSection />;
      case "trips":
        return <TripsSection />;
      case "requests":
        return <RequestsSection />;
      case "stats":
        return <StatsSection />;
      case "ratings":
        return <RatingsSection />;
      case "profile":
        return <ProfileSection />;
      case "chat":
        return <DriverChat />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
        unreadCount={unreadCount}
      />
      <main className="flex-1 ml-0 md:ml-56 pt-20 px-2 md:px-6 transition-all duration-300">
        <AnimatePresence mode="wait">
          <div
            key={currentSection}
            className="w-full max-w-5xl md:mx-auto bg-white rounded-2xl shadow-lg p-2 sm:p-4 md:p-8 min-h-[70vh] mt-2 md:mt-0"
          >
            {renderSection()}
          </div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default DriverDashboard;
