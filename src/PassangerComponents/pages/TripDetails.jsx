import React, { useEffect } from "react";
import {
  Star,
  Anchor,
  Plus,
  Minus,
  Clock,
  Users,
  MapPin,
  Ship,
  Calendar,
  Play,
  Check,
  Lock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../passangercontext/AppContext";
import Header from "../common/Header.jsx";
import { apiGet, apiPost } from "../../api";

const TripDetails = () => {
  const navigate = useNavigate();
  const { selectedTrip, selectedSeats, setSelectedSeats, setSelectedTrip } =
    useAppContext();
  const tripId = selectedTrip?.id;

  console.log("TripDetails - Component rendered");
  console.log("TripDetails - selectedTrip from context:", selectedTrip);
  console.log(
    "TripDetails - selectedTrip image:",
    selectedTrip?.image
      ? "Present (length: " + selectedTrip.image.length + ")"
      : "Not present"
  );
  console.log(
    "TripDetails - selectedTrip description:",
    selectedTrip?.description ? "Present" : "Not present"
  );
  console.log("TripDetails - selectedSeats from context:", selectedSeats);

  useEffect(() => {
    async function fetchTrip() {
      if (!selectedTrip && tripId) {
        try {
          const data = await apiGet(`/trips/${tripId}`);
          localStorage.setItem('privateTripId', data._id);
          setSelectedTrip(data);
        } catch (err) {
          alert("Failed to load trip: " + err.message);
        }
      }
    }
    fetchTrip();
  }, [selectedTrip, tripId]);

  if (!selectedTrip) {
    console.log("TripDetails - No trip selected, showing fallback");
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Ship className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Trip Selected
          </h3>
          <p className="text-gray-500">Please select a trip to view details</p>
        </div>
      </div>
    );
  }

  const totalPrice = selectedTrip.price * selectedSeats;
  const availableSeats =
    selectedTrip.seats - (selectedTrip.passengers?.length || 0);

  const incrementSeats = () => {
    if (selectedSeats < availableSeats) {
      setSelectedSeats(selectedSeats + 1);
    }
  };

  const decrementSeats = () => {
    if (selectedSeats > 1) {
      setSelectedSeats(selectedSeats - 1);
    }
  };

  const handleBookSeats = async () => {
    try {
      // Fetch latest trip data before booking
      const latestTrip = await apiGet(`/trips/${selectedTrip._id}`);
      const latestAvailableSeats =
        latestTrip.seats - (latestTrip.passengers?.length || 0);
      if (selectedSeats > latestAvailableSeats) {
        alert("Sorry, not enough seats available. Please try again.");
        localStorage.setItem('privateTripId', latestTrip._id);
        setSelectedTrip(latestTrip); // update UI with latest data
        return;
      }
      await apiPost("/bookings", {
        tripId: selectedTrip._id,
        seats: selectedSeats,
      });
      alert("Booking successful!");
      navigate("/passenger/tracking");
    } catch (err) {
      alert("Booking failed: " + (err.message || err));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Header title="Voyage Details" backTo="/passenger/shared-trips" />

      <div className="px-4 py-6 w-full">
        <div className="max-w-6xl mx-auto">
          {/* Progress Stepper for Trip Status */}
          <div className="flex justify-center items-center mb-8">
            {["Started", "Completed", "Closed"].map((stage, idx) => {
              const statusOrder = ["Started", "Completed", "Closed"];
              const currentIdx = statusOrder.indexOf(
                selectedTrip?.status || "Started"
              );
              const isActive = idx <= currentIdx;
              const colors = [
                "bg-blue-600 text-white", // Started
                "bg-green-600 text-white", // Completed
                "bg-gray-400 text-white", // Closed
              ];
              const icons = [
                <Play className="w-5 h-5" />, // Started
                <Check className="w-5 h-5" />, // Completed
                <Lock className="w-5 h-5" />, // Closed
              ];
              return (
                <React.Fragment key={stage}>
                  <div className={`flex flex-col items-center`}>
                    <div
                      className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-lg shadow-md transition-all duration-300 ${
                        isActive ? colors[idx] : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      {icons[idx]}
                    </div>
                    <span
                      className={`mt-2 text-xs font-semibold ${
                        isActive ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {stage}
                    </span>
                  </div>
                  {idx < 2 && (
                    <div
                      className={`w-10 h-1 ${
                        currentIdx > idx ? "bg-blue-600" : "bg-gray-200"
                      } mx-2 rounded`}
                    ></div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Hero Section with Captain Info - Full Width */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl shadow-2xl p-8 mb-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-24 translate-x-24"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-16 -translate-x-16"></div>
            <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/5 rounded-full"></div>

            <div className="relative z-10">
              <div className="flex items-center space-x-6 mb-8">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/30">
                  <Anchor className="w-12 h-12 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">
                    {selectedTrip.captain?.name || "Captain"}
                  </h2>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-yellow-300 fill-current" />
                      <span className="text-lg font-medium">
                        {selectedTrip.rating}
                      </span>
                    </div>
                    <span className="text-white/70 text-lg">•</span>
                    <span className="text-white/70 text-lg">127 voyages</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center space-x-3 mb-2">
                    <Clock className="w-5 h-5 text-white/80" />
                    <span className="text-sm text-white/80 font-medium">
                      Departure Time
                    </span>
                  </div>
                  <div className="text-xl font-semibold">
                    {selectedTrip.time}
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center space-x-3 mb-2">
                    <Users className="w-5 h-5 text-white/80" />
                    <span className="text-sm text-white/80 font-medium">
                      Available Seats
                    </span>
                  </div>
                  <div className="text-xl font-semibold">
                    {availableSeats} seats
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center space-x-3 mb-2">
                    <Ship className="w-5 h-5 text-white/80" />
                    <span className="text-sm text-white/80 font-medium">
                      Boat Type
                    </span>
                  </div>
                  <div className="text-xl font-semibold">
                    {selectedTrip.captain?.boatType || "---"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Left Column - Trip Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Trip Information Card */}
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <Ship className="w-6 h-6 mr-3 text-blue-600" />
                  Trip Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-lg">
                          $
                        </span>
                      </div>
                      <span className="text-gray-700 font-medium">
                        Price per passenger
                      </span>
                    </div>
                    <span className="font-bold text-2xl text-blue-600">
                      ${selectedTrip.price}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Ship className="w-6 h-6 text-blue-600" />
                      </div>
                      <span className="text-gray-700 font-medium">
                        Boat Type
                      </span>
                    </div>
                    <span className="font-semibold text-lg text-blue-600">
                      {selectedTrip.captain?.boatType || "---"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Route Details Card */}
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <MapPin className="w-6 h-6 mr-3 text-blue-600" />
                  Route Details
                </h3>

                <div className="relative">
                  <div className="absolute left-6 top-12 bottom-12 w-1 bg-gradient-to-b from-blue-400 to-blue-500"></div>

                  <div className="space-y-8">
                    <div className="flex items-center space-x-6">
                      <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center shadow-lg">
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </div>
                      <div className="flex-1">
                        <div className="text-xl font-semibold text-gray-800 mb-1">
                          {selectedTrip.from}
                        </div>
                        <div className="text-gray-500">Departure Point</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </div>
                      <div className="flex-1">
                        <div className="text-xl font-semibold text-gray-800 mb-1">
                          {selectedTrip.to}
                        </div>
                        <div className="text-gray-500">Destination</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trip Image and Description Card */}
              {(selectedTrip.image || selectedTrip.description) && (
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <Ship className="w-6 h-6 mr-3 text-blue-600" />
                    Trip Details
                  </h3>

                  <div className="space-y-6">
                    {selectedTrip.image && (
                      <div className="relative group">
                        <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          Trip Image
                        </h4>
                        <div className="relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.01]">
                          <img
                            src={selectedTrip.image}
                            alt="Trip"
                            className="w-full object-contain transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-full text-sm font-semibold text-gray-700 shadow-lg">
                            📸 Trip Photo
                          </div>
                          <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-2 rounded-xl text-white text-sm font-medium">
                            Click to view
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedTrip.description && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-700 mb-3">
                          Description
                        </h4>
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                          <p className="text-gray-700 leading-relaxed">
                            {selectedTrip.description}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Seat Selection */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 sticky top-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <Users className="w-6 h-6 mr-3 text-blue-600" />
                  Select Seats
                </h3>

                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-3xl p-6 border border-blue-200">
                  <div className="flex flex-col items-center space-y-6 mb-6">
                    <div className="flex items-center space-x-6">
                      <button
                        onClick={decrementSeats}
                        // disabled={selectedSeats <= 1}
                        className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <Minus className="w-6 h-6 text-blue-600" />
                      </button>

                      <div className="text-center">
                        <div className="text-4xl font-bold text-gray-900 mb-2">
                          {selectedSeats}
                        </div>
                        <div className="text-lg text-gray-600 font-medium">
                          {selectedSeats === 1 ? "Passenger" : "Passengers"}
                        </div>
                      </div>

                      <button
                        onClick={incrementSeats}
                        // disabled={
                        //   !selectedTrip.availableSeats ||
                        //   selectedSeats >= selectedTrip.availableSeats
                        // }
                        className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <Plus className="w-6 h-6 text-blue-600" />
                      </button>
                    </div>

                    <div className="text-center w-full">
                      <div className="text-4xl font-bold text-blue-600 mb-2">
                        ${totalPrice}
                      </div>
                      <div className="text-lg text-gray-600 font-medium">
                        Total Price
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 border border-blue-200">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-base font-medium text-gray-700">
                        {availableSeats} seats remaining
                      </span>
                    </div>
                  </div>
                </div>

                {/* Booking Button */}
                <div className="mt-8">
                  <button
                    onClick={handleBookSeats}
                    disabled={
                      selectedSeats > availableSeats || availableSeats <= 0
                    }
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-2xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed group-hover:shadow-2xl flex items-center justify-center space-x-2"
                  >
                    <div className="flex items-center justify-center space-x-3">
                      <Calendar className="w-6 h-6" />
                      <span>
                        Book {selectedSeats}{" "}
                        {selectedSeats === 1 ? "Seat" : "Seats"} & Pay $
                        {totalPrice}
                      </span>
                    </div>
                  </button>
                  {availableSeats <= 0 && (
                    <div className="text-red-500 mt-2 font-semibold">
                      No seats available for this trip.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetails;
