import React, { useState } from "react";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Star,
  ArrowRight,
  Search,
  Ship,
  Sparkles,
  Navigation,
  Anchor,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../passangercontext/AppContext";
import Header from "../common/Header.jsx";
import { apiPost } from "../../api";
import InteractiveMap from "../common/InteractiveMap";

const PrivateBooking = () => {
  const navigate = useNavigate();
  const { pickupLocation, setPickupLocation, destination, setDestination } =
    useAppContext();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [selecting, setSelecting] = useState("pickup"); // 'pickup' or 'destination'

  const handleFindCaptains = async () => {
    try {
      if (!selectedTime) {
        alert("Please select a trip time");
        return;
      }
      // Send private trip request
      const tripData = {
        from: pickupLocation,
        to: destination,
        date: selectedDate,
        time: selectedTime,
        seats: passengers,
        price: 0,
        type: "private",
      };
      const trip = await apiPost("/trips", tripData);
      if (trip && trip._id) {
        localStorage.setItem("privateTripId", trip._id);
      }
      alert("Private trip request sent successfully!");
      navigate("/passenger/offers");
    } catch (err) {
      alert("Failed to request private trip: " + err.message);
    }
  };

  // دالة تمرر للخريطة لتحديث المكان المختار
  const handleMapLocationSelect = (location, name = null) => {
    if (selecting === "pickup") {
      setPickupLocation(
        name || `${location[0].toFixed(5)}, ${location[1].toFixed(5)}`
      );
    } else {
      setDestination(
        name || `${location[0].toFixed(5)}, ${location[1].toFixed(5)}`
      );
    }
  };

  const popularDestinations = [
    {
      name: "Aswan Corniche",
      description: "Beautiful Nile-side promenade",
      rating: 4.8,
      lat: 24.0889,
      lng: 32.8998,
      image:
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=200&fit=crop",
    },
    {
      name: "Botanical Island",
      description: "Famous island with lush gardens",
      rating: 4.7,
      lat: 24.0895,
      lng: 32.8872,
      image:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop",
    },
    {
      name: "Philae Temple",
      description: "Ancient temple on an island",
      rating: 4.9,
      lat: 24.0247,
      lng: 32.8846,
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=200&fit=crop",
    },
    {
      name: "Elephantine Island",
      description: "Historic island in the Nile",
      rating: 4.6,
      lat: 24.0881,
      lng: 32.8856,
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=200&fit=crop",
    },
    {
      name: "Nubian Village",
      description: "Colorful village on the Nile",
      rating: 4.8,
      lat: 24.0516,
      lng: 32.8822,
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=200&fit=crop",
    },
    {
      name: "Kitchener Island",
      description: "Botanical gardens island",
      rating: 4.7,
      lat: 24.0902,
      lng: 32.8879,
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=200&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Professional Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-white/90 to-indigo-50/80"></div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-blue-200/20 to-indigo-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-indigo-200/15 to-purple-300/15 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <Header title="Private Charter Booking" backTo="/passenger/ride-type" />

        <div className="px-6 py-8 max-w-7xl mx-auto">
          {/* Enhanced Main Booking Card */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-12 mb-12 border border-white/30">
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full px-6 py-3 mb-6 shadow-lg">
                <Ship className="w-5 h-5" />
                <span className="font-semibold tracking-wide">
                  PRIVATE CHARTER
                </span>
              </div>
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                  Plan Your Perfect
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Maritime Journey
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Customize your exclusive boat charter with premium service and
                personalized experience
              </p>
            </div>

            <div className="space-y-10">
              {/* Map Selection Controls */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-6 border border-blue-100/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Navigation className="w-6 h-6 text-blue-600" />
                    <span className="font-bold text-gray-800 text-lg">
                      Select from Map
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      className={`px-6 py-3 rounded-2xl font-semibold border-2 transition-all duration-300 ${
                        selecting === "pickup"
                          ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                          : "bg-white text-blue-600 border-blue-300 hover:border-blue-400"
                      }`}
                      onClick={() => setSelecting("pickup")}
                    >
                      <MapPin className="w-4 h-4 inline mr-2" />
                      Departure
                    </button>
                    <button
                      className={`px-6 py-3 rounded-2xl font-semibold border-2 transition-all duration-300 ${
                        selecting === "destination"
                          ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                          : "bg-white text-blue-600 border-blue-300 hover:border-blue-400"
                      }`}
                      onClick={() => setSelecting("destination")}
                    >
                      <Anchor className="w-4 h-4 inline mr-2" />
                      Destination
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  Click on the map to set your{" "}
                  {selecting === "pickup" ? "departure point" : "destination"}{" "}
                  or type below
                </p>
              </div>

              {/* Enhanced Location Inputs */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pickup Location */}
                <div className="space-y-4">
                  <label className="block text-lg font-semibold text-gray-800 mb-3">
                    <MapPin className="w-5 h-5 inline mr-2 text-blue-600" />
                    Departure Point
                  </label>
                  <div className="relative group">
                    <div className="absolute left-6 top-1/2 transform -translate-y-1/2">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-lg flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      placeholder="Enter departure marina or location"
                      list="pickup-locations"
                      className="w-full py-6 pl-20 pr-6 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-gray-50 focus:bg-white text-lg group-hover:border-blue-300"
                    />
                    <datalist id="pickup-locations">
                      {popularDestinations.map((dest) => (
                        <option key={dest.name} value={dest.name} />
                      ))}
                    </datalist>
                  </div>
                </div>

                {/* Destination */}
                <div className="space-y-4">
                  <label className="block text-lg font-semibold text-gray-800 mb-3">
                    <Anchor className="w-5 h-5 inline mr-2 text-blue-600" />
                    Destination
                  </label>
                  <div className="relative group">
                    <div className="absolute left-6 top-1/2 transform -translate-y-1/2">
                      <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-full shadow-lg flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="Enter destination"
                      list="destination-locations"
                      className="w-full py-6 pl-20 pr-6 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-gray-50 focus:bg-white text-lg group-hover:border-blue-300"
                    />
                    <datalist id="destination-locations">
                      {popularDestinations.map((dest) => (
                        <option key={dest.name} value={dest.name} />
                      ))}
                    </datalist>
                  </div>
                </div>
              </div>

              {/* Enhanced Date, Time, and Passengers Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <label className="block text-lg font-semibold text-gray-800">
                    <Calendar className="w-5 h-5 inline mr-2 text-blue-600" />
                    Date
                  </label>
                  <div className="relative group">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full py-5 pl-12 pr-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-gray-50 focus:bg-white text-lg group-hover:border-blue-300"
                    />
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-lg font-semibold text-gray-800">
                    <Clock className="w-5 h-5 inline mr-2 text-blue-600" />
                    Time
                  </label>
                  <div className="relative group">
                    <input
                      type="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full py-5 pl-12 pr-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-gray-50 focus:bg-white text-lg group-hover:border-blue-300"
                    />
                    <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-lg font-semibold text-gray-800">
                    <Users className="w-5 h-5 inline mr-2 text-blue-600" />
                    Passengers
                  </label>
                  <div className="relative group">
                    <select
                      value={passengers}
                      onChange={(e) => setPassengers(parseInt(e.target.value))}
                      className="w-full py-5 pl-12 pr-12 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-gray-50 focus:bg-white appearance-none text-lg group-hover:border-blue-300"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "Passenger" : "Passengers"}
                        </option>
                      ))}
                    </select>
                    <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                    <ArrowRight className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Interactive Map */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100/50">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                    <Navigation className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Interactive Map
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Click on the map to set your locations
                    </p>
                  </div>
                </div>
                <InteractiveMap
                  onLocationSelect={handleMapLocationSelect}
                  selecting={selecting}
                  pickupLocation={pickupLocation}
                  destination={destination}
                />
              </div>
            </div>

            {/* Enhanced Submit Button */}
            <div className="mt-12 text-center">
              <button
                onClick={handleFindCaptains}
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-6 px-12 rounded-3xl font-bold hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl text-xl group"
              >
                <Search className="inline-block w-7 h-7 mr-3 group-hover:animate-pulse" />
                Find Available Captains
                <ArrowRight className="inline-block w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>

          {/* Enhanced Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Popular Destinations */}
            <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-10 border border-white/30">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Popular Destinations
                  </h3>
                  <p className="text-gray-600">Top-rated locations in Aswan</p>
                </div>
              </div>

              <div className="space-y-6">
                {popularDestinations.map((dest, index) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border border-gray-100 hover:border-blue-200"
                    onClick={() => {
                      setDestination(dest.name);
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-3xl">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                          <MapPin className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                            {dest.name}
                          </h4>
                          <p className="text-sm text-gray-600 mb-3">
                            {dest.description}
                          </p>
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-semibold text-gray-700">
                                {dest.rating}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              Excellent
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-2 transition-all duration-300 flex-shrink-0" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Pro Tips */}
            <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-10 text-white shadow-xl">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold">Pro Tips</h4>
                  <p className="text-blue-100 text-sm">
                    Make the most of your charter
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                  <div className="w-3 h-3 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="font-semibold text-lg">Book Early</span>
                    <p className="text-blue-100 mt-1 text-sm">
                      Reserve 24 hours in advance for best availability and
                      rates
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                  <div className="w-3 h-3 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="font-semibold text-lg">Weekend Rates</span>
                    <p className="text-blue-100 mt-1 text-sm">
                      Premium pricing during peak season weekends
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                  <div className="w-3 h-3 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="font-semibold text-lg">Weather Check</span>
                    <p className="text-blue-100 mt-1 text-sm">
                      Conditions may affect availability and routes
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                  <div className="w-3 h-3 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="font-semibold text-lg">
                      Flexible Cancellation
                    </span>
                    <p className="text-blue-100 mt-1 text-sm">
                      Free cancellation up to 24 hours before departure
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivateBooking;
