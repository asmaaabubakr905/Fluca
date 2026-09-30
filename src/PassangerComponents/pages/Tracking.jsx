import React, { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  Phone,
  Navigation,
  Waves,
  Star,
  Anchor,
  Clock,
  MapPin,
  Users,
  Shield,
  Wifi,
  Battery,
  AlertCircle,
  Info,
  Zap,
  Send,
  Compass,
  Play,
  Check,
  Lock,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../passangercontext/AppContext";
import { apiGet, apiPost, apiPatch } from '../../api';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import boatIconUrl from "../../assets/sailboat.png";
import userIconUrl from '../../assets/person-icons-person-icon--m2i8m2A0K9H7N4m2.png';
import socket from '../../socket';
import Chat from './Chat';

const ORS_API_KEY = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjZjNjEwYzVjMTU2MTRiMjlhYjdmZWQxMTExNGJiYzk5IiwiaCI6Im11cm11cjY0In0=';

async function getRoute(start, end) {
  try {
    // For now, return a simple straight line between points to avoid CORS issues
    // You can implement a proper route calculation later
    return [[start.lat, start.lng], [end.lat, end.lng]];
    
    // Commented out the original API call due to CORS issues
    // const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}&start=${start.lng},${start.lat}&end=${end.lng},${end.lat}`;
    // const res = await fetch(url);
    // const data = await res.json();
    // if (data && data.features && data.features[0]) {
    //   return data.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
    // }
    // return [];
  } catch (error) {
    console.error('Error fetching route:', error);
    return [[start.lat, start.lng], [end.lat, end.lng]];
  }
}

const Tracking = () => {
  const navigate = useNavigate();
  const { selectedSeats, selectedTrip, setSelectedTrip, hasNewMessage, setHasNewMessage } = useAppContext();
  const [timeRemaining, setTimeRemaining] = useState(180);
  const isConnected = true;
  const [showSafetyTips, setShowSafetyTips] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('currentUser'));
  const [captainLocation, setCaptainLocation] = useState(null);
  const [passengerLocation, setPassengerLocation] = useState(null);
  const [resetMapFlag, setResetMapFlag] = useState(0);
  const [routePoints, setRoutePoints] = useState([]);
  const [showTripDetails, setShowTripDetails] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const lastMessageId = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const notificationAudio = useRef(null);

  // إضافة: جلب بيانات الرحلة الخاصة إذا لم يكن هناك selectedTrip (فقط للبرايفت)
  useEffect(() => {
    if (!selectedTrip) {
      const privateTripId = localStorage.getItem('privateTripId');
      if (privateTripId) {
        setIsLoading(true);
        apiGet(`/trips/${privateTripId}`)
          .then(trip => {
            localStorage.setItem('privateTripId', trip._id);
            setSelectedTrip(trip);
            setIsLoading(false);
          })
          .catch(err => {
            console.error('Error fetching private trip:', err);
            setError('Failed to load trip data: ' + (err.message || 'Unknown error'));
            setIsLoading(false);
            // Clear invalid trip ID from localStorage
            localStorage.removeItem('privateTripId');
          });
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [selectedTrip, setSelectedTrip]);

  // Polling: تحديث بيانات الرحلة كل 5 ثواني
  useEffect(() => {
    if (!selectedTrip || !selectedTrip._id) return;
    
    let isMounted = true;
    const fetchTripData = async () => {
      try {
        const updatedTrip = await apiGet(`/trips/${selectedTrip._id}`);
        if (isMounted) {
          localStorage.setItem('privateTripId', updatedTrip._id);
          setSelectedTrip(updatedTrip);
        }
      } catch (err) {
        console.error('Error fetching trip data:', err);
        if (isMounted && err.message.includes('not found')) {
          setError('Trip not found or has been cancelled');
          // Optionally redirect to home or show a message
        }
      }
    };
    
    fetchTripData();
    const interval = setInterval(fetchTripData, 5000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [selectedTrip?._id, setSelectedTrip]);

  // جلب موقع الكابتن كل 5 ثواني
  useEffect(() => {
    if (!selectedTrip || !selectedTrip._id) return;
    let isMounted = true;
    const fetchLocation = async () => {
      try {
        const res = await apiGet(`/trips/${selectedTrip._id}/location`);
        if (isMounted && res.location) {
          setCaptainLocation(res.location);
        }
      } catch (err) {
        console.error('Error fetching captain location:', err);
        // Don't show error for location polling failures
      }
    };
    fetchLocation();
    const interval = setInterval(fetchLocation, 5000);
    return () => { 
      isMounted = false; 
      clearInterval(interval); 
    };
  }, [selectedTrip]);

  // جلب موقع الراكب (live location)
  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported');
      return;
    }
    
    let watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setPassengerLocation({ 
          lat: pos.coords.latitude, 
          lng: pos.coords.longitude 
        });
      },
      (err) => {
        console.error('Geolocation error:', err);
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // توجيه تلقائي إذا أصبحت حالة الرحلة Closed
  useEffect(() => {
    if (selectedTrip && selectedTrip.status === "Closed") {
      navigate("/passenger/rating");
    }
  }, [selectedTrip, navigate]);

  // جلب رسائل الشات عند فتح الصفحة وكل 5 ثواني
  useEffect(() => {
    if (!selectedTrip || !selectedTrip._id || !user) return;
    let isMounted = true;
    const fetchMessages = async () => {
      try {
        // الطرف الآخر: إذا كنت باسنجر، الطرف الآخر هو الكابتن، والعكس
        let otherUserId = null;
        if (user.role === 'Passenger' && selectedTrip.captain) {
          otherUserId = selectedTrip.captain._id || selectedTrip.captain;
        }
        if (user.role === 'Driver' && selectedTrip.passengers && selectedTrip.passengers[0]) {
          otherUserId = selectedTrip.passengers[0]._id || selectedTrip.passengers[0];
        }
        if (!otherUserId) return;
        
        const res = await apiGet(`/chat?userId=${otherUserId}&trip=${selectedTrip._id}`);
        if (isMounted) setChatMessages(res);
      } catch (err) {
        console.error('Error fetching chat messages:', err);
      }
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => { 
      isMounted = false; 
      clearInterval(interval); 
    };
  }, [selectedTrip, user]);

  // Scroll to bottom on new message
  useEffect(() => { 
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); 
  }, [chatMessages]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercentage = ((180 - timeRemaining) / 180) * 100;

  // Phone call handler
  const handlePhoneCall = () => {
    if (selectedTrip && selectedTrip.captain && selectedTrip.captain.phone) {
      const phone = selectedTrip.captain.phone;
      if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        window.location.href = `tel:${phone}`;
      } else {
        alert(`Captain's Phone: ${phone}`);
      }
    } else {
      alert('No phone number available for the captain.');
    }
  };

  const handleCompleteVoyage = async () => {
    try {
      if (!selectedTrip || !selectedTrip._id) {
        alert('No trip selected!');
        return;
      }
      await apiPatch(`/trips/${selectedTrip._id}/status`, { status: 'Completed' });
      navigate('/passenger/rating');
    } catch (err) {
      alert('Failed to complete voyage: ' + (err.response?.data?.message || err.message));
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedTrip || !user) return;
    try {
      let receiver = null;
      if (user.role === 'Passenger' && selectedTrip.captain) {
        receiver = selectedTrip.captain._id || selectedTrip.captain;
      }
      if (user.role === 'Driver' && selectedTrip.passengers && selectedTrip.passengers[0]) {
        receiver = selectedTrip.passengers[0]._id || selectedTrip.passengers[0];
      }
      if (!receiver) return;
      
      const msg = { receiver, message: newMessage, trip: selectedTrip._id };
      await apiPost('/chat', msg);
      setNewMessage('');
      
      // جلب الرسائل بعد الإرسال مباشرة
      const res = await apiGet(`/chat?userId=${receiver}&trip=${selectedTrip._id}`);
      setChatMessages(res);
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message');
    }
  };

  // إعداد Marker system pin احترافي للكابتن (أزرق)
  const captainCustomIcon = new L.Icon({
    iconUrl: 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-2x-blue.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    shadowSize: [41, 41],
    className: 'captain-marker',
  });
  
  // إعداد Marker system pin احترافي للراكب (أخضر)
  const passengerCustomIcon = new L.Icon({
    iconUrl: 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-2x-green.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    shadowSize: [41, 41],
    className: 'passenger-marker',
  });

  // حساب النقاط المهمة للخريطة
  const boundsPoints = [];
  if (captainLocation && captainLocation.lat && captainLocation.lng) {
    boundsPoints.push([captainLocation.lat, captainLocation.lng]);
  }
  if (passengerLocation && passengerLocation.lat && passengerLocation.lng) {
    boundsPoints.push([passengerLocation.lat, passengerLocation.lng]);
  }
  if (selectedTrip && selectedTrip.from && typeof selectedTrip.from.lat === 'number' && typeof selectedTrip.from.lng === 'number') {
    boundsPoints.push([selectedTrip.from.lat, selectedTrip.from.lng]);
  }
  if (selectedTrip && selectedTrip.to && typeof selectedTrip.to.lat === 'number' && typeof selectedTrip.to.lng === 'number') {
    boundsPoints.push([selectedTrip.to.lat, selectedTrip.to.lng]);
  }

  // مكون لضبط fitBounds مرة واحدة فقط عند تغيير الرحلة أو بداية Started
  function FitBoundsComponent({ points, tripId, tripStatus, resetFlag }) {
    const map = useMap();
    const prevTripId = React.useRef();
    const prevStatus = React.useRef();
    const didFit = React.useRef(false);
    useEffect(() => {
      // fitBounds عند تغيير الرحلة أو بداية Started أو عند الضغط على زر إعادة الضبط
      if (
        prevTripId.current !== tripId ||
        (tripStatus === 'Started' && prevStatus.current !== 'Started') ||
        resetFlag // كل ضغطة زر تعطي قيمة جديدة
      ) {
        if (points.length > 1) {
          map.fitBounds(points, { padding: [60, 60] });
          didFit.current = true;
        }
      }
      prevTripId.current = tripId;
      prevStatus.current = tripStatus;
      // eslint-disable-next-line
    }, [tripId, tripStatus, resetFlag, map]);
    return null;
  }

  function ResetMapControl({ points, resetFlag }) {
    const map = useMap();
    useEffect(() => {
      if (resetFlag && points.length > 1) {
        map.invalidateSize();
        setTimeout(() => {
          map.fitBounds(points, { padding: [60, 60] });
        }, 100);
      }
      // eslint-disable-next-line
    }, [resetFlag]);
    return null;
  }

  useEffect(() => {
    if (!selectedTrip || !selectedTrip._id) return;
    socket.emit('joinTrip', selectedTrip._id);
    const handleCaptainLocationUpdate = ({ lat, lng }) => {
      setCaptainLocation({ lat, lng });
      console.log('Received captainLocationUpdate from socket.io:', lat, lng);
    };
    socket.on('captainLocationUpdate', handleCaptainLocationUpdate);
    return () => {
      socket.off('captainLocationUpdate', handleCaptainLocationUpdate);
    };
  }, [selectedTrip]);

  useEffect(() => {
    if (
      captainLocation && passengerLocation &&
      typeof captainLocation.lat === 'number' && typeof captainLocation.lng === 'number' &&
      typeof passengerLocation.lat === 'number' && typeof passengerLocation.lng === 'number'
    ) {
      getRoute(captainLocation, passengerLocation).then(setRoutePoints);
    } else {
      setRoutePoints([]);
    }
  }, [captainLocation, passengerLocation]);

  // مراقبة وصول رسائل جديدة بدون /chat/latest
  useEffect(() => {
    if (!selectedTrip || !selectedTrip._id) return;
    const user = JSON.parse(localStorage.getItem('currentUser'));
    let isMounted = true;
    const otherUserId = selectedTrip.captain && user.role === 'Passenger'
      ? (selectedTrip.captain._id || selectedTrip.captain)
      : (selectedTrip.passengers && selectedTrip.passengers[0] && user.role === 'Driver')
        ? (selectedTrip.passengers[0]._id || selectedTrip.passengers[0])
        : null;
    if (!otherUserId) return;
    
    const fetchMessages = async () => {
      try {
        const res = await apiGet(`/chat?userId=${otherUserId}&trip=${selectedTrip._id}`);
        if (!isMounted) return;
        if (Array.isArray(res) && res.length > 0) {
          const lastMsg = res[res.length - 1];
          console.log('Last message:', lastMsg);
          console.log('Current user ID:', user.id);
          console.log('Last message sender:', lastMsg.sender);
          console.log('Last message ID:', lastMsg._id);
          console.log('Previous message ID:', lastMessageId.current);
          
          if (
            lastMessageId.current &&
            lastMsg._id !== lastMessageId.current &&
            lastMsg.sender !== user.id &&
            !showChatModal
          ) {
            console.log('New message detected! Playing notification...');
            setHasNewMessage(true);
            // Play notification sound with error handling
            if (notificationAudio.current) {
              try {
                notificationAudio.current.volume = 0.5;
                const playPromise = notificationAudio.current.play();
                if (playPromise !== undefined) {
                  playPromise.catch(error => {
                    console.log('Audio play failed:', error);
                  });
                }
              } catch (error) {
                console.log('Audio play error:', error);
              }
            }
          }
          lastMessageId.current = lastMsg._id;
        }
      } catch (err) {
        console.error('Error fetching chat messages for notification:', err);
      }
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 4000);
    return () => { 
      isMounted = false; 
      clearInterval(interval); 
    };
    // eslint-disable-next-line
  }, [selectedTrip, showChatModal]);

  // عند فتح الشات، صفر العداد
  useEffect(() => {
    if (showChatModal) setHasNewMessage(false);
  }, [showChatModal]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading trip data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Trip</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/passenger/homepage')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  // Show no trip selected state
  if (!selectedTrip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Navigation className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Trip Selected</h2>
          <p className="text-gray-600 mb-4">Please select a trip to start tracking</p>
          <button 
            onClick={() => navigate('/passenger/homepage')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200 px-6 py-4 mt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
              <Navigation className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Live Tracking</h1>
              <p className="text-sm text-gray-600">Real-time voyage monitoring</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full border border-green-200">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-700 font-semibold">Connected</span>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowChatModal(true);
                  setHasNewMessage(false);
                }}
                className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Message</span>
                {hasNewMessage && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg animate-bounce">1</span>
                )}
              </button>
              <button
                onClick={handlePhoneCall}
                className="p-3 bg-gradient-to-r from-green-600 to-green-700 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Phone className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="w-full relative" style={{ height: '350px' }}>
        <MapContainer
          center={[24.0889, 32.8998]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
          dragging={true}
          className="z-0"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <ResetMapControl
            points={routePoints.length > 1 ? routePoints : boundsPoints}
            resetFlag={resetMapFlag}
          />
          
          {/* Marker الكابتن */}
          {captainLocation && captainLocation.lat && captainLocation.lng && (
            <Marker position={[captainLocation.lat, captainLocation.lng]} icon={captainCustomIcon}>
              <Popup className="font-semibold">Captain Now</Popup>
            </Marker>
          )}
          {/* Marker الراكب */}
          {passengerLocation && passengerLocation.lat && passengerLocation.lng && (
            <Marker position={[passengerLocation.lat, passengerLocation.lng]} icon={passengerCustomIcon}>
              <Popup className="font-semibold">Your Current Location</Popup>
            </Marker>
          )}
          {/* Marker نقطة الانطلاق */}
          {selectedTrip && selectedTrip.from && typeof selectedTrip.from.lat === 'number' && typeof selectedTrip.from.lng === 'number' && (
            <Marker position={[selectedTrip.from.lat, selectedTrip.from.lng]}>
              <Popup className="font-semibold">Departure Point</Popup>
            </Marker>
          )}
          {/* Marker الوجهة */}
          {selectedTrip && selectedTrip.to && typeof selectedTrip.to.lat === 'number' && typeof selectedTrip.to.lng === 'number' && (
            <Marker position={[selectedTrip.to.lat, selectedTrip.to.lng]}>
              <Popup className="font-semibold">Destination</Popup>
            </Marker>
          )}
          {/* الخط بين الكابتن والراكب إذا كان الاثنين موجودين */}
          {routePoints.length > 1 ? (
            <Polyline
              positions={routePoints}
              color="rgba(34,34,34,0.7)"
              weight={4}
              opacity={0.9}
              dashArray={null}
              lineCap="round"
              lineJoin="round"
            />
          ) : (
            captainLocation && passengerLocation &&
            typeof captainLocation.lat === 'number' && typeof captainLocation.lng === 'number' &&
            typeof passengerLocation.lat === 'number' && typeof passengerLocation.lng === 'number' && (
              <Polyline positions={[[captainLocation.lat, captainLocation.lng], [passengerLocation.lat, passengerLocation.lng]]} color="#F59E42" weight={4} opacity={0.8} />
            )
          )}
        </MapContainer>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8 space-y-8">
        {/* Progress Stepper for Trip Status */}
        <div className="flex justify-center items-center mb-8">
          {['Started', 'Completed', 'Closed'].map((stage, idx) => {
            const statusOrder = ['Started', 'Completed', 'Closed'];
            const currentIdx = statusOrder.indexOf(selectedTrip?.status || 'Started');
            const isActive = idx <= currentIdx;
            const colors = [
              'bg-gradient-to-br from-blue-600 to-blue-700 text-white', // Started
              'bg-gradient-to-br from-green-600 to-green-700 text-white', // Completed
              'bg-gradient-to-br from-gray-500 to-gray-600 text-white'   // Closed
            ];
            const icons = [
              <Play className="w-5 h-5" />, // Started
              <Check className="w-5 h-5" />, // Completed
              <Lock className="w-5 h-5" />  // Closed
            ];
            return (
              <React.Fragment key={stage}>
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 flex items-center justify-center rounded-full font-bold text-lg shadow-lg border-2 transition-all duration-300 ${isActive ? colors[idx] : 'bg-gray-200 text-gray-400 border-gray-300'}`}>
                    {icons[idx]}
                  </div>
                  <span className={`mt-3 text-sm font-semibold ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>{stage}</span>
                </div>
                {idx < 2 && (
                  <div className={`w-16 h-1 ${currentIdx > idx ? 'bg-gradient-to-r from-blue-600 to-green-600' : 'bg-gray-200'} mx-4 rounded-full transition-all duration-300`}></div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Captain Info Card */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 hover:shadow-3xl transition-all duration-300">
          <div className="flex items-center space-x-6 mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl flex items-center justify-center shadow-xl">
                <Anchor className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full border-4 border-white shadow-lg animate-pulse"></div>
            </div>
            <div className="flex-1">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{selectedTrip && selectedTrip.captain ? (selectedTrip.captain.name || 'Captain') : 'Captain'}</h3>
              <div className="flex items-center space-x-4 mb-3">
                <div className="flex items-center space-x-2 bg-yellow-50 px-3 py-1 rounded-full">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="text-gray-800 font-bold">4.9</span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-green-600 text-lg font-semibold flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Online
                </span>
              </div>
              <p className="text-gray-600 text-lg">{selectedTrip && selectedTrip.captain ? (selectedTrip.captain.boatType || '---') : '---'} • {selectedTrip && selectedTrip.captain ? (selectedTrip.captain.boatId || '---') : '---'}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={() => {
                setShowChatModal(true);
                setHasNewMessage(false);
              }}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105 relative"
            >
              <MessageCircle className="w-6 h-6" />
              <span>Message</span>
              {hasNewMessage && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg animate-bounce">1</span>
              )}
            </button>
            <button 
              onClick={handlePhoneCall}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Phone className="w-6 h-6" />
              <span>Call</span>
            </button>
            <button
              onClick={() => setShowTripDetails(true)}
              className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 text-blue-700 py-4 px-6 rounded-xl font-semibold hover:from-blue-50 hover:to-blue-100 transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105 border border-blue-200"
            >
              <Info className="w-6 h-6" />
              <span>Trip Details</span>
            </button>
          </div>
        </div>

        {/* Trip Details Modal */}
        {showTripDetails && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full mx-4 relative animate-fade-in-up">
              <button 
                onClick={() => setShowTripDetails(false)} 
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-3">
                <Info className="w-7 h-7" /> 
                Trip Details
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <div>
                    <span className="font-semibold text-gray-800">From:</span> 
                    <span className="ml-2 text-gray-700">{selectedTrip?.from?.name || selectedTrip?.from || '---'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-green-600" />
                  <div>
                    <span className="font-semibold text-gray-800">To:</span> 
                    <span className="ml-2 text-gray-700">{selectedTrip?.to?.name || selectedTrip?.to || '---'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <div>
                    <span className="font-semibold text-gray-800">Date:</span> 
                    <span className="ml-2 text-gray-700">{selectedTrip?.date ? new Date(selectedTrip.date).toLocaleString() : '---'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                  <Users className="w-5 h-5 text-orange-600" />
                  <div>
                    <span className="font-semibold text-gray-800">Seats:</span> 
                    <span className="ml-2 text-gray-700">{selectedTrip?.seats || '---'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg">
                  <Anchor className="w-5 h-5 text-indigo-600" />
                  <div>
                    <span className="font-semibold text-gray-800">Captain:</span> 
                    <span className="ml-2 text-gray-700">{selectedTrip?.captain?.name || '---'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-lg">
                  <Shield className="w-5 h-5 text-teal-600" />
                  <div>
                    <span className="font-semibold text-gray-800">Boat ID:</span> 
                    <span className="ml-2 text-gray-700">{selectedTrip?.captain?.boatId || '---'}</span>
                  </div>
                </div>
                {selectedTrip?.price && (
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <span className="font-semibold text-gray-800">Price:</span> 
                    <span className="ml-2 text-gray-700 font-bold text-lg">{selectedTrip?.price} EGP</span>
                  </div>
                )}
                {selectedTrip?.description && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <span className="font-semibold text-gray-800">Description:</span> 
                    <p className="mt-1 text-gray-700">{selectedTrip?.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Modal - Fixed z-index */}
      {showChatModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setShowChatModal(false)}>
          <div className="relative w-full max-w-4xl h-[80vh] mx-4" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setShowChatModal(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold z-10 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors bg-white shadow-lg"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="bg-white rounded-3xl shadow-2xl h-full overflow-hidden">
              <Chat setHasNewMessage={setHasNewMessage} />
            </div>
          </div>
        </div>
      )}
      <audio 
        ref={notificationAudio} 
        src="https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" 
        preload="auto"
        onError={(e) => console.log('Audio error:', e)}
        onLoadStart={() => console.log('Audio loading started')}
        onCanPlay={() => console.log('Audio can play')}
      />
    </div>
  );
};

export default Tracking;
