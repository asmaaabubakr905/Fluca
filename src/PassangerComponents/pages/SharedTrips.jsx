import React, { useState, useMemo, useEffect } from "react";
import {
  Users,
  Star,
  Search,
  MapPin,
  Clock,
  Filter,
  ChevronRight,
  Calendar,
  Navigation,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../passangercontext/AppContext";
import { apiGet } from "../../api";
import Header from "../common/Header.jsx";

const SharedTrips = () => {
  const navigate = useNavigate();
  const { setSelectedTrip } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [trips, setTrips] = useState([]);

  const filters = [
    { id: "all", label: "All Trips" },
    { id: "morning", label: "Morning" },
    { id: "afternoon", label: "Afternoon" },
    { id: "evening", label: "Evening" },
  ];

  useEffect(() => {
    async function fetchTrips() {
      try {
        const data = await apiGet("/trips");
        console.log("SharedTrips - Fetched trips:", data.length);
        data.forEach((trip, index) => {
          console.log(`Trip ${index + 1}:`, {
            id: trip._id,
            from: trip.from,
            to: trip.to,
            hasImage: !!trip.image,
            imageLength: trip.image ? trip.image.length : 0,
            hasDescription: !!trip.description,
          });
        });
        setTrips(data);
      } catch (err) {
        alert("Failed to load trips: " + err.message);
      }
    }
    fetchTrips();
  }, []);

  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      const matchesSearch =
        trip.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.captain.toLowerCase().includes(searchTerm.toLowerCase());

      if (selectedFilter === "all") return matchesSearch;

      const tripHour = parseInt(trip.time.split(":")[0]);
      switch (selectedFilter) {
        case "morning":
          return matchesSearch && tripHour >= 6 && tripHour < 12;
        case "afternoon":
          return matchesSearch && tripHour >= 12 && tripHour < 17;
        case "evening":
          return matchesSearch && (tripHour >= 17 || tripHour < 6);
        default:
          return matchesSearch;
      }
    });
  }, [searchTerm, selectedFilter, trips]);

  const handleTripSelect = async (trip) => {
    setIsLoading(true);
    console.log("SharedTrips - handleTripSelect called with trip:", trip);
    console.log("SharedTrips - Setting selectedTrip in context");
    localStorage.setItem('privateTripId', trip._id);
    setSelectedTrip(trip);

    // Simulate loading for better UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log("SharedTrips - Navigating to /passenger/trip-details");
    navigate("/passenger/trip-details");
  };

  const getTimeCategory = (time) => {
    const hour = parseInt(time.split(":")[0]);
    if (hour >= 6 && hour < 12) return "morning";
    if (hour >= 12 && hour < 17) return "afternoon";
    return "evening";
  };

  const getTimeCategoryColor = (category) => {
    switch (category) {
      case "morning":
        return "bg-yellow-100 text-yellow-800";
      case "afternoon":
        return "bg-orange-100 text-orange-800";
      case "evening":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Header title="Available Voyages" backTo="/passenger/ride-type" />

      <div className="px-4 py-6 max-w-4xl mx-auto">
        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search destinations, captains, or routes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200 shadow-sm"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all duration-200 ${
                  selectedFilter === filter.id
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredTrips.length} voyage{filteredTrips.length !== 1 ? "s" : ""}{" "}
            available
          </p>
        </div>

        {/* Trips Grid */}
        <div className="space-y-4">
          {filteredTrips.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No voyages found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            filteredTrips.map((trip) => {
              const timeCategory = getTimeCategory(trip.time);
              return (
                <div
                  key={trip._id}
                  className="group bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden transform hover:-translate-y-1"
                >
                  <div className="p-6">
                    {/* Header with Route and Price */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        {/* Route Visualization */}
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="flex flex-col items-center space-y-2">
                            <div className="w-4 h-4 bg-blue-400 rounded-full shadow-lg"></div>
                            <div className="w-0.5 h-8 bg-gradient-to-b from-blue-400 to-blue-500"></div>
                            <div className="w-4 h-4 bg-blue-500 rounded-full shadow-lg"></div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <MapPin className="w-4 h-4 text-blue-400" />
                              <span className="font-semibold text-gray-800">
                                {trip.from}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4 text-blue-500" />
                              <span className="font-semibold text-gray-800">
                                {trip.to}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Trip Image and Description */}
                        {trip.image && (
                          <div className="mb-4 relative group">
                            <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                              <img
                                src={trip.image}
                                alt="Trip"
                                className="w-full object-contain transition-transform duration-300 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-sm">
                                Trip Photo
                              </div>
                            </div>
                          </div>
                        )}
                        {trip.description && (
                          <div className="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {trip.description}
                            </p>
                          </div>
                        )}

                        {/* Time and Date */}
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {trip.time}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">Today</span>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getTimeCategoryColor(
                              timeCategory
                            )}`}
                          >
                            {timeCategory.charAt(0).toUpperCase() +
                              timeCategory.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="text-right ml-4">
                        <div className="text-3xl font-bold text-blue-500 mb-1">
                          ${trip.price}
                        </div>
                        <div className="text-sm text-gray-500">per person</div>
                      </div>
                    </div>

                    {/* Trip Details */}
                    <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-2xl">
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                          <Users className="w-5 h-5 text-gray-500" />
                          <div>
                            <div className="text-sm font-medium text-gray-700">
                              {trip.availableSeats > 0
                                ? trip.availableSeats
                                : "0"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {trip.availableSeats > 0
                                ? "seats left"
                                : "Fully Booked"}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                          <div>
                            <div className="text-sm font-medium text-gray-700">
                              {trip.rating}
                            </div>
                            <div className="text-xs text-gray-500">rating</div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-700">
                          {trip.captain?.name}
                        </div>
                        <div className="text-xs text-gray-500">Captain</div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleTripSelect(trip)}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-2xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed group-hover:shadow-2xl flex items-center justify-center space-x-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Loading...</span>
                        </>
                      ) : (
                        <>
                          <span>View Details</span>
                          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Stats */}
        {filteredTrips.length > 0 && (
          <div className="mt-8 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Average price: $
                {Math.round(
                  filteredTrips.reduce((sum, trip) => sum + trip.price, 0) /
                    filteredTrips.length
                )}
              </span>
              <span>
                Best rated:{" "}
                {Math.max(...filteredTrips.map((trip) => trip.rating))} ⭐
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedTrips;
