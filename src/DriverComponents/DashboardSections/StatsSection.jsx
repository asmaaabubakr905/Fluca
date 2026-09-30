import React, { useEffect, useState } from "react";
import {
  FaShip,
  FaMoneyBillWave,
  FaUsers,
  FaMapMarkerAlt,
  FaChartBar,
  FaCalendarAlt,
} from "react-icons/fa";
import { apiGet } from "../../api";

const StatsSection = () => {
  const [trips, setTrips] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const [tripsData, bookingsData] = await Promise.all([
          apiGet("/trips?my=1"),
          apiGet("/bookings/driver"),
        ]);
        setTrips(tripsData);
        setBookings(bookingsData);
      } catch {
        // ignore error for now
      }
      setLoading(false);
    }
    fetchStats();
  }, []);

  // استخراج الشهور والسنوات المتاحة
  const months = Array.from(
    new Set(trips.map((t) => new Date(t.date).getMonth() + 1))
  );
  const years = Array.from(
    new Set(trips.map((t) => new Date(t.date).getFullYear()))
  );

  // فلترة الرحلات حسب الفلتر الزمني
  let filteredTrips = trips;
  if (filter === "month" && selectedMonth && selectedYear) {
    filteredTrips = trips.filter((t) => {
      const d = new Date(t.date);
      return (
        d.getMonth() + 1 === Number(selectedMonth) &&
        d.getFullYear() === Number(selectedYear)
      );
    });
  } else if (filter === "year" && selectedYear) {
    filteredTrips = trips.filter(
      (t) => new Date(t.date).getFullYear() === Number(selectedYear)
    );
  }

  // إحصائيات عامة
  const totalTrips = filteredTrips.length;
  const totalPassengers = bookings.reduce((sum, b) => sum + b.seats, 0);
  const totalEarnings = bookings.reduce(
    (sum, b) => sum + b.seats * (b.trip?.price || 0),
    0
  );

  // أرباح هذا الشهر وعدد الرحلات
  const now = new Date();
  const thisMonthTrips = trips.filter((t) => {
    const d = new Date(t.date);
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  });
  const thisMonthEarnings = bookings
    .filter((b) => {
      const d = new Date(b.trip?.date);
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, b) => sum + b.seats * (b.trip?.price || 0), 0);

  // الوجهة الأكثر تكرارًا
  const destCount = {};
  trips.forEach((t) => {
    const dest = t.to || t.destination;
    destCount[dest] = (destCount[dest] || 0) + 1;
  });
  const mostDest =
    Object.entries(destCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

  // حساب عدد الرحلات لكل شهر
  const getMonthYear = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${d.getMonth() + 1}`;
  };
  const monthlyTrips = {};
  trips.forEach((t) => {
    const key = getMonthYear(t.date);
    monthlyTrips[key] = (monthlyTrips[key] || 0) + 1;
  });
  const monthsKeys = Object.keys(monthlyTrips).sort();

  if (loading)
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Statistics Dashboard</h2>
            <p className="text-blue-100">Track your performance and earnings</p>
          </div>
          <div className="flex gap-2 items-center">
           
           
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<FaShip className="text-2xl" />}
          title="Total Trips"
          value={totalTrips}
          color="blue"
          subtitle="Completed journeys"
        />
        <StatCard
          icon={<FaMoneyBillWave className="text-2xl" />}
          title="Total Earnings"
          value={`${totalEarnings.toLocaleString()} EGP`}
          color="green"
          subtitle="Total revenue"
        />
        <StatCard
          icon={<FaUsers className="text-2xl" />}
          title="Total Passengers"
          value={totalPassengers}
          color="indigo"
          subtitle="Served customers"
        />
        <StatCard
          icon={<FaMapMarkerAlt className="text-2xl" />}
          title="Top Destination"
          value={mostDest}
          color="purple"
          subtitle="Most popular route"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trips Chart */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl">
              <FaChartBar className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                Trips per Month
              </h3>
              <p className="text-gray-500 text-sm">Monthly trip distribution</p>
            </div>
          </div>

          {monthsKeys.length === 0 ? (
            <div className="flex items-center justify-center h-40">
              <div className="text-center">
                <FaChartBar className="text-gray-300 text-4xl mx-auto mb-2" />
                <p className="text-gray-500">No data available yet</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Chart Bars */}
              <div className="flex items-end gap-4 h-32 px-2">
                {monthsKeys.map((month) => {
                  const maxTrips = Math.max(...Object.values(monthlyTrips));
                  const height =
                    maxTrips > 0 ? (monthlyTrips[month] / maxTrips) * 100 : 20;
                  return (
                    <div
                      key={month}
                      className="flex flex-col items-center flex-1 group"
                    >
                      <div className="relative">
                        <div
                          className="bg-gradient-to-t from-blue-600 via-blue-500 to-blue-400 w-8 rounded-t-lg transition-all duration-300 hover:from-blue-700 hover:to-blue-600 hover:scale-105 shadow-lg"
                          style={{
                            height: `${Math.max(height, 20)}px`,
                            minHeight: "20px",
                          }}
                        ></div>
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                          {monthlyTrips[month]} trips
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Month Labels */}
              <div className="flex justify-between gap-4 px-2">
                {monthsKeys.map((month) => (
                  <div
                    key={month}
                    className="flex flex-col items-center flex-1"
                  >
                    <span className="text-xs font-semibold text-gray-700 mb-1">
                      {month}
                    </span>
                    <span className="text-xs text-blue-600 font-bold">
                      {monthlyTrips[month]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* This Month Summary */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl">
              <FaCalendarAlt className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">This Month</h3>
              <p className="text-gray-500 text-sm">Current month performance</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
              <div className="flex items-center gap-3">
                <FaShip className="text-blue-600 text-lg" />
                <span className="text-gray-700 font-medium">Total Trips</span>
              </div>
              <span className="text-2xl font-bold text-blue-600">
                {thisMonthTrips.length}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
              <div className="flex items-center gap-3">
                <FaMoneyBillWave className="text-green-600 text-lg" />
                <span className="text-gray-700 font-medium">Earnings</span>
              </div>
              <span className="text-2xl font-bold text-green-600">
                {thisMonthEarnings.toLocaleString()} EGP
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color, subtitle }) => {
  const colors = {
    blue: {
      gradient: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    green: {
      gradient: "from-green-500 to-green-600",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    indigo: {
      gradient: "from-indigo-500 to-indigo-600",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
    purple: {
      gradient: "from-purple-500 to-purple-600",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  };

  const colorScheme = colors[color];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
      <div className="flex items-center gap-4">
        <div
          className={`${colorScheme.iconBg} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}
        >
          <div className={colorScheme.iconColor}>{icon}</div>
        </div>
        <div className="flex-1">
          <div className="text-2xl font-bold text-gray-800 mb-1">{value}</div>
          <div className="text-sm font-semibold text-gray-700 mb-1">
            {title}
          </div>
          {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
