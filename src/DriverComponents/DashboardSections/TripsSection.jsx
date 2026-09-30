import React, { useState, useEffect, useCallback } from "react";
import {
  FaClipboardList,
  FaEdit,
  FaTimes,
  FaLock,
  FaLockOpen,
  FaImage,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { apiGet, apiPost, apiPut, apiDelete, apiPatch } from "../../api";
import { Play, Check, Lock } from "lucide-react";

const TripsSection = () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const [trips, setTrips] = useState([]);
  const [editingTrip, setEditingTrip] = useState(null);
  const [newTrip, setNewTrip] = useState({
    start: "",
    destination: "",
    date: "",
    startTime: "",
    endTime: "",
    price: "",
    seats: user?.boatCapacity || 1,
    availableSeats: user?.boatCapacity || 1,
    passengers: [],
    image: null,
    description: "",
    status: "Not Started",
    closed: false,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const fileInput = React.useRef();
  const [filter, setFilter] = useState({ status: "All", destination: "" });
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    action: null,
    tripId: null,
  });
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });
  const [startCoords, setStartCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);

  const nileLocations = [
    { name: "Aswan Corniche", lat: 24.0889, lng: 32.8998 },
    { name: "Botanical Island", lat: 24.0895, lng: 32.8872 },
    { name: "Philae Temple", lat: 24.0247, lng: 32.8846 },
    { name: "Elephantine Island", lat: 24.0881, lng: 32.8856 },
    { name: "Nubian Village", lat: 24.0516, lng: 32.8822 },
    { name: "Kitchener Island", lat: 24.0902, lng: 32.8879 },
  ];

  // يجب تعريف availablePrivateTrips هنا قبل أي useEffect أو استخدام له
  const availablePrivateTrips = trips.filter(
    (trip) => trip.type === "private" && !trip.accepted && !trip.captain
  );

  // جلب العروض الخاصة بالكابتن
  const [offersByTrip, setOffersByTrip] = useState({});
  const fetchOffersForTrip = useCallback(
    async (tripId) => {
      try {
        const data = await apiGet(`/offers/trip/${tripId}`);
        console.log("Fetched offers for trip:", tripId, data);
        setOffersByTrip((prev) => ({
          ...prev,
          [tripId]: data.filter((o) => o.captain?._id === user.id),
        }));
      } catch (error) {
        console.error("Error fetching offers for trip:", tripId, error);
        setToast({
          show: true,
          message: "Failed to fetch offers",
          type: "error",
        });
      }
    },
    [user.id]
  );

  useEffect(() => {
    if (!user) return;
    apiGet("/trips", { driverEmail: user.email }).then((data) => {
      setTrips(data);
    });
  }, [user]);

  // قلل عدد الريكوستات المتزامنة: جرب فقط أول رحلة خاصة متاحة
  useEffect(() => {
    if (availablePrivateTrips.length > 0) {
      fetchOffersForTrip(availablePrivateTrips[0]._id);
    }
    // إذا أردت لاحقًا جلب العروض لكل الرحلات، استخدم batching أو زر منفصل لكل رحلة
  }, [availablePrivateTrips, fetchOffersForTrip]);

  // Edit Trip
  const handleEditClick = (trip) => setEditingTrip(trip);
  const handleUpdateTrip = (e) => {
    e.preventDefault();
    // استخرج الوقت من editingTrip.date
    const dateObj = new Date(editingTrip.date);
    const timeString = dateObj.toTimeString().slice(0, 5); // "HH:MM"
    // Map frontend fields to backend fields
    const tripData = {
      from: editingTrip.start,
      to: editingTrip.destination,
      date: editingTrip.date,
      time: timeString, // أضف الوقت هنا
      price: editingTrip.price,
      seats: editingTrip.seats,
      availableSeats: editingTrip.availableSeats,
      description: editingTrip.description,
      status: editingTrip.status,
      closed: editingTrip.closed,
      image: editingTrip.image,
      // Add boatType, boatId if needed
    };
    apiPut(`/trips/${editingTrip._id}`, tripData).then(() => {
      apiGet("/trips", { driverEmail: user.email }).then((data) => {
        setTrips(data);
        setEditingTrip(null);
      });
    });
  };
  // Close Trip (with confirmation)
  const handleCloseTrip = (id) => {
    setConfirmModal({ open: true, action: "close", tripId: id });
  };
  // Delete Trip (with confirmation)
  const handleDeleteTrip = (id) => {
    setConfirmModal({ open: true, action: "delete", tripId: id });
  };
  // Execute confirmed action
  const handleConfirmAction = () => {
    if (confirmModal.action === "close") {
      const trip = trips.find((t) => t._id === confirmModal.tripId);
      apiPut(`/trips/${confirmModal.tripId}`, {
        ...trip,
        closed: !trip.closed,
      }).then(() => {
        apiGet("/trips", { driverEmail: user.email }).then((data) => {
          setTrips(data);
          setToast({
            show: true,
            message: "Trip status updated!",
            type: "success",
          });
        });
      });
    } else if (confirmModal.action === "delete") {
      apiDelete(`/trips/${confirmModal.tripId}`).then(() => {
        apiGet("/trips", { driverEmail: user.email }).then((data) => {
          setTrips(data);
          setToast({
            show: true,
            message: "Trip deleted successfully!",
            type: "success",
          });
        });
      });
    }
    setConfirmModal({ open: false, action: null, tripId: null });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      2500
    );
  };

  // إضافة رحلة جديدة
  const handleNewTripChange = (e) => {
    const { name, value } = e.target;
    setNewTrip((trip) => ({ ...trip, [name]: value }));
  };
  const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_SIZE) {
      setToast({
        show: true,
        message: 'The image is too large. Please compress the image or choose one smaller than 10 MB.',
        type: 'error',
      });
      return;
    }
    console.log(
      "Selected file:",
      file.name,
      "Size:",
      file.size,
      "Type:",
      file.type
    );
    const reader = new FileReader();
    reader.onload = (ev) => {
      console.log("File converted to base64, length:", ev.target.result.length);
      setNewTrip((trip) => ({ ...trip, image: ev.target.result }));
      setImagePreview(ev.target.result);
    };
    reader.readAsDataURL(file);
  };
  const handleAddTrip = (e) => {
    e.preventDefault();
    // استخرج الوقت من newTrip.date
    const dateObj = new Date(newTrip.date);
    const timeString = dateObj.toTimeString().slice(0, 5); // "HH:MM"
    // Map frontend fields to backend fields
    const tripData = {
      from: newTrip.start,
      to: newTrip.destination,
      date: newTrip.date,
      time: timeString, // أضف الوقت هنا
      price: newTrip.price,
      seats: Number(newTrip.seats),
      availableSeats: Number(newTrip.seats),
      description: newTrip.description,
      status: "Not Started",
      closed: false,
      image: newTrip.image,
      // Add boatType, boatId if needed
    };
    console.log("Sending trip data:", tripData);
    console.log("Image data:", newTrip.image ? "Image present" : "No image");
    apiPost("/trips", tripData).then(() => {
      apiGet("/trips", { driverEmail: user.email }).then((data) => {
        setTrips(data);
        setNewTrip({
          start: "",
          destination: "",
          date: "",
          price: "",
          seats: "",
          availableSeats: "",
          passengers: [],
          image: null,
          description: "",
          status: "Not Started",
          closed: false,
        });
        setImagePreview(null);
        if (fileInput.current) fileInput.current.value = "";
        setToast({
          show: true,
          message: "Trip added successfully!",
          type: "success",
        });
      });
    });
  };

  // إضافة دالة لتغيير حالة الرحلة
  const handleChangeStatus = async (tripId, newStatus) => {
    try {
      await apiPatch(`/trips/${tripId}/status`, { status: newStatus });
      const data = await apiGet("/trips", { driverEmail: user.email });
      setTrips(data);
      setToast({
        show: true,
        message: `Trip marked as ${newStatus}!`,
        type: "success",
      });
    } catch (err) {
      setToast({
        show: true,
        message: "Failed to update status",
        type: "error",
      });
    }
  };

  const getStatusBadge = (status, closed) => {
    if (closed) return "bg-red-200 text-red-800";
    switch (status) {
      case "Started":
        return "bg-blue-200 text-blue-800";
      case "Completed":
        return "bg-green-200 text-green-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  // دالة لتنسيق التاريخ بشكل أوضح
  function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  // فلترة الرحلات
  const filteredTrips = trips.filter((trip) => {
    const statusMatch =
      filter.status === "All" ||
      (filter.status === "Closed"
        ? trip.closed
        : trip.status === filter.status && !trip.closed);
    const destinationMatch =
      !filter.destination ||
      (trip.destination || trip.to || "")
        .toLowerCase()
        .includes(filter.destination.toLowerCase());
    return statusMatch && destinationMatch;
  });

  return (
    <motion.div initial="hidden" animate="visible" className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
        <FaClipboardList className="text-blue-400" /> My Trips
      </h2>
      {/* شريط الفلترة */}
      <div className="flex flex-col md:flex-row gap-4 mb-4 items-center">
        <select
          value={filter.status}
          onChange={(e) => setFilter((f) => ({ ...f, status: e.target.value }))}
          className="px-3 py-2 border rounded-lg bg-white shadow-sm"
        >
          <option value="All">All Statuses</option>
          <option value="Not Started">Not Started</option>
          <option value="Started">Started</option>
          <option value="Completed">Completed</option>
          <option value="Closed">Closed</option>
        </select>
        <input
          type="text"
          placeholder="Filter by destination..."
          value={filter.destination}
          onChange={(e) =>
            setFilter((f) => ({ ...f, destination: e.target.value }))
          }
          className="px-3 py-2 border rounded-lg bg-white shadow-sm"
        />
      </div>
      {/* Add New Trip Form */}
      <form
        onSubmit={handleAddTrip}
        className="relative mb-12 overflow-hidden rounded-3xl shadow-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-blue-100 p-1"
      >
        <div className="absolute inset-0 pointer-events-none z-0 bg-gradient-to-br from-blue-200/30 via-white/0 to-blue-100/40" />
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-semibold text-blue-800 mb-1">
              Start
            </label>
            <select
              name="start"
              value={newTrip.start || ""}
              onChange={(e) => {
                const loc = nileLocations.find(
                  (l) => l.name === e.target.value
                );
                setNewTrip((trip) => ({ ...trip, start: e.target.value }));
                setStartCoords(loc ? { lat: loc.lat, lng: loc.lng } : null);
              }}
              className="px-4 py-2 border-2 border-blue-200 rounded-xl w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all bg-white shadow-sm"
              required
            >
              <option value="">Select location</option>
              {nileLocations.map((loc) => (
                <option key={loc.name} value={loc.name}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-semibold text-blue-800 mb-1">
              Destination
            </label>
            <select
              name="destination"
              value={newTrip.destination || ""}
              onChange={(e) => {
                const loc = nileLocations.find(
                  (l) => l.name === e.target.value
                );
                setNewTrip((trip) => ({
                  ...trip,
                  destination: e.target.value,
                }));
                setDestinationCoords(
                  loc ? { lat: loc.lat, lng: loc.lng } : null
                );
              }}
              className="px-4 py-2 border-2 border-blue-200 rounded-xl w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all bg-white shadow-sm"
              required
            >
              <option value="">Select location</option>
              {nileLocations.map((loc) => (
                <option key={loc.name} value={loc.name}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-semibold text-blue-800 mb-1">
              Date & Time
            </label>
            <input
              type="datetime-local"
              name="date"
              value={newTrip.date || ""}
              onChange={handleNewTripChange}
              className="px-4 py-2 border-2 border-blue-200 rounded-xl w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all bg-white shadow-sm"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-semibold text-blue-800 mb-1">
              Price
            </label>
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={newTrip.price || ""}
              onChange={handleNewTripChange}
              className="px-4 py-2 border-2 border-blue-200 rounded-xl w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all bg-white shadow-sm"
              required
              min="1"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-semibold text-blue-800 mb-1">
              Seats
            </label>
            <input
              type="number"
              name="seats"
              placeholder={`Max seats: ${user?.boatCapacity || 1}`}
              value={newTrip.seats || ""}
              onChange={handleNewTripChange}
              min="1"
              max={user?.boatCapacity || 100}
              className="px-4 py-2 border-2 border-blue-200 rounded-xl w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all bg-white shadow-sm"
            />
            <span className="text-xs text-blue-400 mt-1">
              Based on your boat capacity
            </span>
          </div>
          <div className="flex flex-col gap-2 md:col-span-3">
            <label className="block text-sm font-semibold text-blue-800 mb-1">
              Trip Description
            </label>
            <textarea
              name="description"
              placeholder="Trip Description..."
              value={newTrip.description || ""}
              onChange={handleNewTripChange}
              className="px-4 py-2 border-2 border-blue-200 rounded-xl w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all bg-white shadow-sm"
              rows={2}
              required
            />
          </div>
          <div className="flex flex-row gap-4 md:col-span-3 justify-between items-center mt-2">
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInput}
                className="hidden"
                id="trip-image-upload"
              />
              <label
                htmlFor="trip-image-upload"
                className="cursor-pointer flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-xl font-semibold shadow-sm border border-blue-200 transition-all"
              >
                <FaImage /> {imagePreview ? "Change Image" : "Upload Image"}
              </label>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded-xl border-2 border-blue-200 ml-2 shadow"
                />
              )}
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-10 py-3 rounded-2xl font-bold shadow-lg hover:from-blue-700 hover:to-blue-600 transition-all text-lg tracking-wide"
            >
              Add Trip
            </button>
          </div>
        </div>
      </form>
      {/* قائمة الرحلات الخاصة المتاحة لجميع الكباتن */}
      {availablePrivateTrips.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-bold text-blue-700 mb-2">
            Private Trips Awaiting Captain Approval
          </h3>
          <div className="grid gap-4">
            {availablePrivateTrips.map((trip) => (
              <motion.div
                key={trip._id}
                variants={itemVariants}
                className="p-6 border border-blue-200 bg-white rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-lg text-blue-700">
                      {trip.from || trip.start}
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className="font-bold text-lg text-blue-700">
                      {trip.to || trip.destination}
                    </span>
                    <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-bold">
                      Private Trip
                    </span>
                    {trip.accepted && (
                      <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-bold">
                        Accepted
                      </span>
                    )}
                  </div>
                  <div className="text-gray-600 text-sm mb-2">
                    <span className="font-bold">Date:</span>{" "}
                    {formatDate(trip.date)}
                  </div>
                  <div className="text-gray-600 text-sm mb-1">
                    Time: {trip.time || trip.startTime}
                  </div>
                  <div className="text-gray-600 text-sm mb-1">
                    Seats: {trip.seats}
                  </div>
                  <SendOfferForm
                    tripId={trip._id}
                    onOfferSent={() => {
                      setToast({
                        show: true,
                        message: "Offer sent!",
                        type: "success",
                      });
                      fetchOffersForTrip(trip._id);
                    }}
                  />
                  {/* Show captain's offers for this trip */}
                  {offersByTrip[trip._id] &&
                    offersByTrip[trip._id].length > 0 && (
                      <div className="mt-3 p-2 bg-blue-50 rounded">
                        <h4 className="font-bold text-sm mb-1 text-blue-700">
                          Your Offers for this Trip:
                        </h4>
                        {offersByTrip[trip._id].map((offer) => (
                          <div key={offer._id} className="mb-2">
                            <span className="font-semibold">
                              Offer Price: {offer.price} EGP
                            </span>
                            {offer.status === "pending" && (
                              <span className="ml-2 text-gray-500">
                                Waiting for passenger approval
                              </span>
                            )}
                            {offer.status === "accepted" && (
                              <span className="ml-2 text-green-600 font-bold">
                                Accepted
                              </span>
                            )}
                            {offer.status === "rejected" && (
                              <span className="ml-2 text-red-600 font-bold">
                                Rejected
                              </span>
                            )}
                            {offer.status === "counter" &&
                              offer.counterPrice && (
                                <>
                                  <span className="ml-2 text-yellow-600 font-bold">
                                    New proposed price: {offer.counterPrice} EGP
                                  </span>
                                  <button
                                    className="ml-2 px-2 py-1 bg-green-600 text-white rounded text-xs font-bold hover:bg-green-700 transition-colors"
                                    onClick={async () => {
                                      try {
                                        console.log(
                                          "Accepting new price for offer:",
                                          offer._id
                                        );
                                        const response = await apiPatch(
                                          `/offers/${offer._id}/accept`
                                        );
                                        console.log(
                                          "Accept response:",
                                          response
                                        );
                                        await fetchOffersForTrip(trip._id);
                                        setToast({
                                          show: true,
                                          message: "New price accepted!",
                                          type: "success",
                                        });
                                      } catch (err) {
                                        console.error(
                                          "Error accepting new price:",
                                          err
                                        );
                                        setToast({
                                          show: true,
                                          message:
                                            "Failed to accept new price: " +
                                            (err.message || ""),
                                          type: "error",
                                        });
                                      }
                                    }}
                                  >
                                    Accept New Price
                                  </button>
                                  <button
                                    className="ml-2 px-2 py-1 bg-red-600 text-white rounded text-xs font-bold hover:bg-red-700 transition-colors"
                                    onClick={async () => {
                                      try {
                                        await apiPatch(
                                          `/offers/${offer._id}/reject`
                                        );
                                        fetchOffersForTrip(trip._id);
                                        setToast({
                                          show: true,
                                          message: "Proposed price rejected!",
                                          type: "success",
                                        });
                                      } catch (err) {
                                        setToast({
                                          show: true,
                                          message:
                                            "Failed to reject proposed price: " +
                                            (err.message || ""),
                                          type: "error",
                                        });
                                      }
                                    }}
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      <AnimatePresence>
        {filteredTrips.length === 0 ? (
          <p className="text-gray-500">No trips match your filters.</p>
        ) : (
          <div className="grid gap-4">
            {filteredTrips.map((trip) => (
              <motion.div
                key={trip._id}
                variants={itemVariants}
                className={`p-6 border rounded-2xl shadow-xl bg-white flex flex-col md:flex-row md:items-center gap-4 relative ${
                  trip.type === "private" ? "border-blue-400 bg-blue-50" : ""
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-lg text-blue-700">
                      {trip.from || trip.start}
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className="font-bold text-lg text-blue-700">
                      {trip.to || trip.destination}
                    </span>
                    {trip.type === "private" && (
                      <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-bold">
                        Private Trip
                      </span>
                    )}
                    {trip.type === "private" && trip.accepted && (
                      <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-bold">
                        Accepted
                      </span>
                    )}
                  </div>
                  <div className="text-gray-600 text-sm mb-2">
                    <span className="font-bold">Date:</span>{" "}
                    {new Date(trip.date).toLocaleDateString("en-GB", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div className="text-gray-600 text-sm mb-1">
                    Time: {trip.time || trip.startTime}
                  </div>
                  <div className="text-gray-600 text-sm mb-1">
                    Seats: {trip.seats}
                  </div>
                  {/* Progress Stepper for Trip Status */}
                  <div className="flex items-center gap-2 mt-2">
                    {["Started", "Completed", "Closed"].map((stage, idx) => {
                      const statusOrder = ["Started", "Completed", "Closed"];
                      const currentIdx = trip.closed
                        ? 2
                        : statusOrder.indexOf(trip.status || "Started");
                      const isActive = idx <= currentIdx;
                      const colors = [
                        "bg-blue-600 text-white", // Started
                        "bg-green-600 text-white", // Completed
                        "bg-gray-400 text-white", // Closed
                      ];
                      const icons = [
                        <Play className="w-4 h-4" />, // Started
                        <Check className="w-4 h-4" />, // Completed
                        <Lock className="w-4 h-4" />, // Closed
                      ];
                      return (
                        <React.Fragment key={stage}>
                          <div className={`flex flex-col items-center`}>
                            <div
                              className={`w-7 h-7 flex items-center justify-center rounded-full font-bold text-xs shadow-md transition-all duration-300 ${
                                isActive
                                  ? colors[idx]
                                  : "bg-gray-200 text-gray-400"
                              }`}
                            >
                              {icons[idx]}
                            </div>
                            <span
                              className={`mt-1 text-[10px] font-semibold ${
                                isActive ? "text-gray-900" : "text-gray-400"
                              }`}
                            >
                              {stage}
                            </span>
                          </div>
                          {idx < 2 && (
                            <div
                              className={`w-6 h-1 ${
                                currentIdx > idx ? "bg-blue-600" : "bg-gray-200"
                              } mx-1 rounded`}
                            ></div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 flex flex-col items-start sm:items-end">
                  <div className="flex gap-3 mt-2 items-center">
                    <button
                      onClick={() => handleCloseTrip(trip._id)}
                      className={`text-gray-500 hover:text-yellow-600`}
                      title={trip.closed ? "Open Trip" : "Close Trip"}
                    >
                      {trip.closed ? <FaLock /> : <FaLockOpen />}
                    </button>
                    <button
                      onClick={() => handleEditClick(trip)}
                      className="text-gray-500 hover:text-blue-600"
                      title="Edit Trip"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteTrip(trip._id)}
                      className="text-gray-500 hover:text-red-600"
                      title="Delete Trip"
                    >
                      <FaTimes />
                    </button>
                    {trip.status === "Not Started" && !trip.closed && (
                      <button
                        onClick={() => handleChangeStatus(trip._id, "Started")}
                        className="text-blue-600 hover:text-blue-800 font-semibold border border-blue-600 px-3 py-1 rounded"
                        title="Mark as Started"
                      >
                        Mark as Started
                      </button>
                    )}
                    {trip.status === "Started" && !trip.closed && (
                      <button
                        onClick={() => handleChangeStatus(trip._id, "Completed")}
                        className="text-green-600 hover:text-green-800 font-semibold border border-green-600 px-3 py-1 rounded"
                        title="Mark as Completed"
                      >
                        Mark as Completed
                      </button>
                    )}
                    {trip.status === "Completed" && !trip.closed && (
                      <button
                        onClick={() => handleChangeStatus(trip._id, "Closed")}
                        className="text-red-600 hover:text-red-800 font-semibold border border-red-600 px-3 py-1 rounded"
                        title="Mark as Closed"
                      >
                        Mark as Closed
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Edit Trip Modal */}
      <AnimatePresence>
        {editingTrip && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Edit Trip</h2>
                <button
                  onClick={() => setEditingTrip(null)}
                  className="text-gray-400 hover:text-gray-700"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              <form
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                onSubmit={handleUpdateTrip}
              >
                <input
                  type="text"
                  placeholder="Start"
                  value={editingTrip.start}
                  onChange={(e) =>
                    setEditingTrip((t) => ({ ...t, start: e.target.value }))
                  }
                  className="px-4 py-2 border rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="Destination"
                  value={editingTrip.destination}
                  onChange={(e) =>
                    setEditingTrip((t) => ({
                      ...t,
                      destination: e.target.value,
                    }))
                  }
                  className="px-4 py-2 border rounded-lg"
                  required
                />
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  التاريخ والوقت
                </label>
                <input
                  type="datetime-local"
                  value={editingTrip.date}
                  onChange={(e) =>
                    setEditingTrip((t) => ({ ...t, date: e.target.value }))
                  }
                  className="px-4 py-2 border rounded-lg"
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={editingTrip.price}
                  onChange={(e) =>
                    setEditingTrip((t) => ({ ...t, price: e.target.value }))
                  }
                  className="px-4 py-2 border rounded-lg"
                  required
                  min="1"
                />
                <input
                  type="number"
                  placeholder={`Max seats: ${user?.seats || "N/A"}`}
                  value={editingTrip.seats}
                  onChange={(e) =>
                    setEditingTrip((t) => ({ ...t, seats: e.target.value }))
                  }
                  className="px-4 py-2 border rounded-lg"
                  required
                  min="1"
                  max={user?.seats}
                />
                <textarea
                  placeholder="Trip Description..."
                  value={editingTrip.description || ""}
                  onChange={(e) =>
                    setEditingTrip((t) => ({
                      ...t,
                      description: e.target.value,
                    }))
                  }
                  className="px-4 py-2 border rounded-lg md:col-span-2"
                  rows={2}
                  required
                />
                <div className="col-span-1 md:col-span-2 flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setEditingTrip(null)}
                    className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* نافذة التأكيد */}
      <AnimatePresence>
        {confirmModal.open && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                {confirmModal.action === "delete"
                  ? "Delete Trip"
                  : "Close/Open Trip"}
              </h3>
              <p className="mb-6 text-gray-600">
                {confirmModal.action === "delete"
                  ? "Are you sure you want to delete this trip? This action cannot be undone."
                  : "Are you sure you want to close/open this trip?"}
              </p>
              <div className="flex justify-center gap-4">
                <button
                  className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
                  onClick={() =>
                    setConfirmModal({ open: false, action: null, tripId: null })
                  }
                >
                  Cancel
                </button>
                <button
                  className={`px-5 py-2 rounded-lg font-semibold text-white transition ${
                    confirmModal.action === "delete"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-yellow-600 hover:bg-yellow-700"
                  }`}
                  onClick={handleConfirmAction}
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast إشعار */}
      {toast.show && (
        <div
          className={`fixed top-6 right-6 z-[100] px-6 py-3 rounded-lg shadow-lg text-white font-semibold transition-all animate-fade-in-up ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}
    </motion.div>
  );
};

function SendOfferForm({ tripId, onOfferSent }) {
  const [price, setPrice] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const handleSend = async (e) => {
    e.preventDefault();
    if (!price) return;
    setLoading(true);
    try {
      await apiPost("/offers", { tripId, price: Number(price) });
      setPrice("");
      if (onOfferSent) onOfferSent();
    } catch (err) {
      alert("فشل إرسال العرض: " + (err.response?.data?.message || err.message));
    }
    setLoading(false);
  };
  return (
    <form onSubmit={handleSend} className="flex items-center gap-2 mt-2">
      <input
        type="number"
        min="1"
        required
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="حدد السعر (جنيه)"
        className="px-2 py-1 border rounded w-28 text-sm"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold hover:bg-blue-700"
      >
        {loading ? "...جاري الإرسال" : "إرسال عرض"}
      </button>
    </form>
  );
}

export default TripsSection;
