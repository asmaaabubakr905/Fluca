import React, { useState } from "react";
import {
  Ship,
  Users,
  Sparkles,
  MapPin,
  Clock,
  Star,
  Waves,
  Anchor,
  Compass,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../passangercontext/AppContext";
import Header from "../common/Header.jsx";

const RideType = () => {
  const navigate = useNavigate();
  const { setSelectedRideType } = useAppContext();
  const [hoveredType, setHoveredType] = useState(null);

  const handleRideTypeSelect = (type, route) => {
    console.log("Ride type selected:", type, "navigating to:", route);
    setSelectedRideType(type);
    navigate(route);
  };

  const rideTypes = [
    {
      id: "private",
      title: "Private Charter",
      subtitle: "Your own exclusive boat experience",
      description:
        "Enjoy a personalized journey with complete privacy and flexibility",
      icon: Ship,
      price: "$35-65",
      features: [
        "Exclusive boat",
        "Flexible timing",
        "Custom route",
        "Premium service",
      ],
      color: "blue",
      route: "/passenger/private-booking",
      popular: true,
    },
    {
      id: "shared",
      title: "Shared Voyage",
      subtitle: "Join other passengers on scenic routes",
      description:
        "Connect with fellow travelers while exploring beautiful destinations",
      icon: Users,
      price: "$18-35",
      features: [
        "Group experience",
        "Fixed routes",
        "Social atmosphere",
        "Cost-effective",
      ],
      color: "teal",
      route: "/passenger/shared-trips",
    },
  ];

  const getColorClasses = (color, isHovered = false) => {
    const colors = {
      blue: {
        border: isHovered ? "border-blue-500" : "border-blue-200",
        bg: isHovered
          ? "bg-gradient-to-br from-blue-50 to-blue-100"
          : "bg-white",
        iconBg: isHovered ? "bg-blue-200" : "bg-blue-100",
        iconColor: "text-blue-600",
        priceColor: "text-blue-600",
        shadow: isHovered ? "shadow-blue-200" : "shadow-gray-200",
      },
      teal: {
        border: isHovered ? "border-blue-500" : "border-blue-200",
        bg: isHovered
          ? "bg-gradient-to-br from-blue-50 to-blue-100"
          : "bg-white",
        iconBg: isHovered ? "bg-blue-200" : "bg-blue-100",
        iconColor: "text-blue-600",
        priceColor: "text-blue-600",
        shadow: isHovered ? "shadow-blue-200" : "shadow-gray-200",
      },
    };
    return colors[color];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Professional Background with subtle patterns */}
      <div className="absolute inset-0">
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-white/90 to-indigo-50/80"></div>

        {/* Subtle geometric patterns */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
        </div>

        {/* Floating elements with reduced opacity */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-blue-200/20 to-indigo-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-indigo-200/15 to-purple-300/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-100/10 to-cyan-200/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-7xl">
          <Header
            title=""
            backTo="/passenger/language"
            showBack={true}
            className="mb-12 bg-transparent shadow-none border-none"
          />

          {/* Professional header section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-3 bg-white/90 backdrop-blur-md rounded-full px-6 py-3 mb-6 shadow-lg border border-white/20">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse"></div>
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-gray-700 tracking-wide">
                SELECT YOUR EXPERIENCE
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                How would you like
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                to sail?
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
              Choose your perfect maritime adventure and embark on an
              unforgettable journey across pristine waters
            </p>
          </div>

          {/* Enhanced ride options with side content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Main ride options */}
            <div className="lg:col-span-3 space-y-8">
              {rideTypes.map((rideType) => {
                const IconComponent = rideType.icon;
                const colors = getColorClasses(
                  rideType.color,
                  hoveredType === rideType.id
                );
                const isHovered = hoveredType === rideType.id;

                return (
                  <div
                    key={rideType.id}
                    className="relative group"
                    onMouseEnter={() => setHoveredType(rideType.id)}
                    onMouseLeave={() => setHoveredType(null)}
                  >
                    {rideType.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                        <div className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-white text-xs font-bold px-6 py-2 rounded-full shadow-xl flex items-center space-x-2 border-2 border-white">
                          <Star className="w-3 h-3" />
                          <span className="tracking-wide">MOST POPULAR</span>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() =>
                        handleRideTypeSelect(rideType.id, rideType.route)
                      }
                      className={`w-full p-10 rounded-3xl border-2 ${colors.border} ${colors.bg} transition-all duration-500 group-hover:scale-[1.02] ${colors.shadow} shadow-xl hover:shadow-2xl relative overflow-hidden group-hover:border-blue-400`}
                    >
                      {/* Professional gradient overlay */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-blue-50/40 transition-opacity duration-500 ${
                          isHovered ? "opacity-100" : "opacity-0"
                        }`}
                      ></div>

                      {/* Animated background gradient */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 transition-transform duration-1000 ${
                          isHovered ? "translate-x-full" : "-translate-x-full"
                        }`}
                      ></div>

                      <div className="relative z-10">
                        <div className="flex items-start space-x-8">
                          <div
                            className={`w-20 h-20 ${colors.iconBg} rounded-3xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg`}
                          >
                            <IconComponent
                              className={`w-10 h-10 ${colors.iconColor} transition-all duration-300`}
                            />
                          </div>

                          <div className="flex-1 text-left">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h3 className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors duration-300">
                                  {rideType.title}
                                </h3>
                                <p className="text-gray-500 font-medium text-lg">
                                  {rideType.subtitle}
                                </p>
                              </div>
                              <div className="text-right">
                                <div
                                  className={`text-3xl font-bold ${colors.priceColor} flex items-center space-x-1 mb-1`}
                                >
                                  <span>{rideType.price}</span>
                                </div>
                                <span className="text-sm text-gray-500 font-medium">
                                  per trip
                                </span>
                              </div>
                            </div>

                            <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                              {rideType.description}
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                              {rideType.features.map((feature, index) => (
                                <div
                                  key={index}
                                  className="flex items-center space-x-3 text-gray-700 font-medium"
                                >
                                  <div
                                    className={`w-3 h-3 rounded-full ${colors.iconBg} flex-shrink-0`}
                                  ></div>
                                  <span className="text-base">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Enhanced bottom info bar */}
                        <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between text-gray-600">
                          <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-5 h-5 text-blue-600" />
                              <span className="font-medium">
                                Flexible routes
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-5 h-5 text-blue-600" />
                              <span className="font-medium">30-90 min</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 text-green-600 font-semibold">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span>Instant booking</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Side content panel */}
            <div className="lg:col-span-1 space-y-8">
              {/* Quick tips */}
              <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/30">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Pro Tips</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 mb-1">
                        Early Booking
                      </p>
                      <p className="text-xs text-gray-600">
                        Secure the best rates and availability
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 mb-1">
                        Weather Updates
                      </p>
                      <p className="text-xs text-gray-600">
                        Real-time conditions and forecasts
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 mb-1">
                        Free Cancellation
                      </p>
                      <p className="text-xs text-gray-600">
                        Up to 24 hours before departure
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact support */}
              <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <Ship className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">Need Help?</h3>
                </div>
                <p className="text-sm mb-6 opacity-90 leading-relaxed">
                  Our maritime experts are here to guide you through the perfect
                  booking experience
                </p>
                <button className="w-full bg-white/20 backdrop-blur-sm rounded-2xl py-3 text-sm font-semibold hover:bg-white/30 transition-all duration-300 border border-white/30">
                  Contact Support
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced bottom section */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 text-center shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Ship className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3">
                Premium Fleet
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Luxury boats maintained to the highest standards with
                professional, certified crews
              </p>
            </div>
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 text-center shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3">
                Flexible Timing
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Book anytime, depart when you're ready with our 24/7
                availability system
              </p>
            </div>
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 text-center shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3">
                5-Star Experience
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Unforgettable memories guaranteed with our exceptional service
                and attention to detail
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideType;
