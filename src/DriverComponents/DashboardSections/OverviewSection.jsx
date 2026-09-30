import React, { useEffect, useState } from "react";
import {
  FaShip,
  FaMoneyBillWave,
  FaUsers,
  FaStar,
  FaClipboardList,
  FaUsers as FaUsersIcon,
} from "react-icons/fa";
import { apiGet } from "../../api";

const OverviewSection = () => {
  const [trips, setTrips] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const captainId = user?.id || user?._id;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [tripsData, requestsData, ratingsData] = await Promise.all([
          apiGet("/trips?my=1"),
          apiGet("/bookings/driver"),
          apiGet(`/ratings/captain/${captainId}`),
        ]);
        setTrips(tripsData);
        setJoinRequests(requestsData);
        setRatings(ratingsData);
      } catch (err) {
        setError("Failed to load dashboard data");
      }
      setLoading(false);
    }
    if (captainId) fetchData();
  }, [captainId]);

  // إحصائيات سريعة
  const totalTrips = trips.length;
  const totalEarnings = joinRequests.reduce(
    (sum, b) => sum + b.seats * (b.trip?.price || 0),
    0
  );
  const totalPassengers = joinRequests.reduce((sum, b) => sum + b.seats, 0);
  const avgRating = ratings.length
    ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(
        1
      )
    : 0;

  // آخر 3 رحلات خاصة
  const lastPrivateTrips = [...trips]
    .filter((t) => t.type === "private")
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);
  // آخر 3 رحلات مشتركة
  const lastSharedTrips = [...trips]
    .filter((t) => t.type === "shared" || t.type === "public")
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);
  // آخر 3 طلبات انضمام
  const lastRequests = [...joinRequests]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 3);
  // إشعار مختصر
  const pendingRequests = joinRequests.filter(
    (r) => r.status === "Pending"
  ).length;
  const upcomingTrips = trips.filter(
    (t) => new Date(t.date) > new Date()
  ).length;

  if (loading)
    return <div className="p-8 text-center">Loading dashboard...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="relative min-h-screen py-8 px-2 md:px-8 overflow-x-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      {/* خلفية عصرية */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-blue-200/30 to-indigo-200/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-indigo-300/20 to-purple-200/10 rounded-full blur-2xl"></div>
      </div>
      <div className="space-y-10 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 tracking-tight text-center drop-shadow-lg">
          Driver Dashboard
        </h2>
        {/* إشعار مختصر */}
        {(pendingRequests > 0 || upcomingTrips > 0) && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-lg flex items-center gap-4 shadow-md">
            {pendingRequests > 0 && (
              <span>
                لديك <b>{pendingRequests}</b> طلبات انضمام جديدة
              </span>
            )}
            {pendingRequests > 0 && upcomingTrips > 0 && (
              <span className="mx-2">|</span>
            )}
            {upcomingTrips > 0 && (
              <span>
                لديك <b>{upcomingTrips}</b> رحلات قادمة
              </span>
            )}
          </div>
        )}
        {/* بطاقات إحصائية */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <StatCard
            icon={<FaShip />}
            title="Total Trips"
            value={totalTrips}
            color="blue"
          />
          <StatCard
            icon={<FaMoneyBillWave />}
            title="Total Earnings"
            value={`${totalEarnings} EGP`}
            color="green"
          />
          <StatCard
            icon={<FaUsers />}
            title="Total Passengers"
            value={totalPassengers}
            color="indigo"
          />
          <StatCard
            icon={<FaStar />}
            title="Avg. Rating"
            value={avgRating}
            color="yellow"
          />
        </div>
        {/* آخر الرحلات الخاصة */}
        <SectionCard
          title="Private Trips"
          icon={<FaClipboardList className="text-blue-400" />}
          items={lastPrivateTrips}
          emptyMsg="No private trips yet."
        />
        {/* آخر الرحلات المشتركة */}
        <SectionCard
          title="Shared Trips"
          icon={<FaClipboardList className="text-blue-400" />}
          items={lastSharedTrips}
          emptyMsg="No shared trips yet."
        />
        {/* آخر الطلبات */}
        <div className="bg-white/90 rounded-2xl shadow-xl p-8 mb-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FaUsersIcon className="text-blue-400" /> Latest Join Requests
          </h3>
          {lastRequests.length === 0 ? (
            <p className="text-gray-500">No join requests yet.</p>
          ) : (
            <ul className="divide-y">
              {lastRequests.map((req) => (
                <li
                  key={req._id}
                  className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 hover:bg-blue-50 rounded-xl transition-all"
                >
                  <span className="font-semibold text-gray-700 flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full inline-block mr-2"
                      style={{
                        background:
                          req.status === "Pending"
                            ? "#facc15"
                            : req.status === "Accepted"
                            ? "#22c55e"
                            : "#ef4444",
                      }}
                    ></span>
                    {req.passenger?.name || req.passenger?.email}
                  </span>
                  <span className="text-sm text-gray-500">
                    Trip:{" "}
                    {(req.trip?.from || req.trip?.start) &&
                    (req.trip?.to || req.trip?.destination)
                      ? `${req.trip?.from || req.trip?.start} → ${
                          req.trip?.to || req.trip?.destination
                        }`
                      : "-"}
                  </span>
                  <span
                    className={`text-xs font-bold ${
                      req.status === "Pending"
                        ? "text-yellow-600"
                        : req.status === "Accepted"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {req.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => {
  const colors = {
    blue: "from-blue-500 to-blue-400",
    green: "from-green-500 to-green-400",
    indigo: "from-indigo-500 to-indigo-400",
    yellow: "from-yellow-400 to-yellow-300",
  };
  return (
    <div
      className={`bg-gradient-to-br ${colors[color]} text-white rounded-2xl shadow-2xl p-5 flex flex-col items-center gap-3 hover:scale-105 transition-transform duration-300`}
    >
      <div className="bg-white/30 p-3 rounded-full shadow-lg mb-1 flex items-center justify-center text-2xl">
        {icon}
      </div>
      <div className="text-2xl font-extrabold drop-shadow-lg">{value}</div>
      <div className="text-sm opacity-90 font-semibold tracking-wide">
        {title}
      </div>
    </div>
  );
};

const SectionCard = ({ title, icon, items, emptyMsg }) => (
  <div className="bg-white/90 rounded-2xl shadow-xl p-8 mb-6">
    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
      {icon} {title}
    </h3>
    {items.length === 0 ? (
      <p className="text-gray-500">{emptyMsg}</p>
    ) : (
      <ul className="divide-y">
        {items.map((trip) => (
          <li
            key={trip._id}
            className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 hover:bg-blue-50 rounded-xl transition-all"
          >
            <span className="font-semibold text-gray-700 flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-full inline-block mr-2 ${
                  trip.type === "private" ? "bg-blue-400" : "bg-indigo-400"
                }`}
              ></span>
              {trip.from || trip.start} → {trip.to || trip.destination}
            </span>
            <span className="text-sm text-gray-500">
              {new Date(trip.date).toLocaleString()}
            </span>
            <span
              className={`text-xs font-bold ${
                trip.status === "Started"
                  ? "text-blue-600"
                  : trip.status === "Completed"
                  ? "text-green-600"
                  : trip.closed
                  ? "text-red-600"
                  : "text-gray-500"
              }`}
            >
              {trip.status}
              {trip.closed ? " (Closed)" : ""}
            </span>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default OverviewSection;
