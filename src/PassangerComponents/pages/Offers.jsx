import React, { useEffect, useState } from "react";
import {
  Star,
  Phone,
  MessageCircle,
  Anchor,
  Clock,
  MapPin,
  Users,
  Shield,
  Filter,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiGet, apiPost, apiPatch } from '../../api';
import Header from "../common/Header.jsx";

const Offers = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [counterPrice, setCounterPrice] = useState({});
  const [acceptedOfferId, setAcceptedOfferId] = useState(null);
  const [rejectedOffers, setRejectedOffers] = useState([]);
  const tripId = localStorage.getItem('privateTripId');

  useEffect(() => {
    async function fetchOffers() {
      try {
        if (!tripId) return;
        const data = await apiGet(`/offers/trip/${tripId}`);
        setOffers(data);
      } catch (err) {
        alert('Failed to load offers: ' + err.message);
      }
    }
    fetchOffers();
    // polling كل 5 ثواني
    const interval = setInterval(fetchOffers, 5000);
    return () => clearInterval(interval);
  }, [tripId]);

  const handleAccept = async (offerId) => {
    await apiPatch(`/offers/${offerId}/accept`);
    setAcceptedOfferId(offerId);
    alert('Offer accepted!');
    navigate('/passenger/tracking');
  };
  const handleReject = async (offerId) => {
    await apiPatch(`/offers/${offerId}/reject`);
    setRejectedOffers(prev => [...prev, offerId]);
    alert('Offer rejected!');
  };
  const handleCounter = async (offerId) => {
    const price = counterPrice[offerId];
    if (!price) return alert('Enter your counter price');
    await apiPatch(`/offers/${offerId}/counter`, { counterPrice: Number(price) });
    alert('Counter price sent to captain!');
    // أعد تحميل العروض
    window.location.reload();
  };

  const handleChat = () => {
    console.log("=== CHAT CLICKED ===");
    console.log("About to navigate to /passenger/chat");
    navigate("/passenger/chat");
  };

  const handleCall = (phoneNumber, captainName) => {
    console.log("=== CALL CLICKED ===");
    console.log("Calling captain:", captainName);
    console.log("Phone number:", phoneNumber);

    // Create a phone call link
    const phoneLink = `tel:${phoneNumber}`;

    // For mobile devices, this will open the phone app
    // For desktop, it might open a calling service or show a prompt
    window.location.href = phoneLink;

    // Alternative approach for better cross-platform support
    if (navigator.userAgent.match(/iPhone|iPad|iPod|Android/i)) {
      // Mobile device - use tel: protocol
      window.location.href = phoneLink;
    } else {
      // Desktop - show a prompt or use a calling service
      if (confirm(`Call ${captainName} at ${phoneNumber}?`)) {
        window.location.href = phoneLink;
      }
    }
  };

  // Check user authentication on component mount
  React.useEffect(() => {
    console.log("=== OFFERS PAGE MOUNTED ===");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Header title="Available Captains" backTo="/passenger/private-booking" />

      <div className="px-2 py-2 max-w-6xl mx-auto">
        {/* Compact Header Section */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mb-2 shadow-lg">
            <Anchor className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 mb-1">
            Captains Are Responding
          </h1>
          <p className="text-sm text-gray-600 mb-2">
            We're finding the best captains for your journey
          </p>

          {/* Compact Loading Animation */}
          <div className="flex justify-center items-center space-x-1">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
            <span className="text-xs text-gray-500 ml-1">
              Finding offers...
            </span>
          </div>
        </div>

        {/* Compact Actions Bar */}
        <div className="flex justify-between items-center mb-3 px-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">
              {offers.length} offers available
            </span>
          </div>
          <div className="flex space-x-1">
            <button className="p-1.5 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
              <Filter className="w-3 h-3 text-gray-600" />
            </button>
            <button className="p-1.5 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
              <RefreshCw className="w-3 h-3 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Responsive Offers Grid - 2 columns on larger screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-2">
          {offers
            .filter(offer => !rejectedOffers.includes(offer._id))
            .filter(offer => !acceptedOfferId || offer._id === acceptedOfferId)
            .map((offer, index) => (
            <div
              key={offer._id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transform transition-all duration-300 hover:scale-[1.01] hover:shadow-xl animate-fade-in"
              style={{
                animationDelay: `${index * 0.1}s`,
                animation: "fadeInUp 0.6s ease-out forwards",
              }}
            >
              <div className="p-4 pb-2">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Anchor className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-800">
                        {offer.captain?.name || 'Captain'}
                      </h3>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-600">Price offer from captain</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-xl shadow-lg">
                      <div className="text-lg font-bold">{offer.price} EGP</div>
                      <div className="text-xs opacity-90">Offer Price</div>
                    </div>
                  </div>
                </div>
                {/* حالة العرض */}
                <div className="mt-2">
                  {offer.status === 'accepted' && <span className="text-green-600 font-bold">Offer Accepted</span>}
                  {offer.status === 'rejected' && <span className="text-red-600 font-bold">Offer Rejected</span>}
                  {offer.status === 'counter' && offer.counterPrice && <span className="text-yellow-600 font-bold">New Price: {offer.counterPrice} EGP (Waiting for captain approval)</span>}
                  {offer.status === 'pending' && <span className="text-gray-500">Waiting for passenger approval</span>}
                </div>
              </div>
              <div className="px-4 pb-4">
                <div className="flex space-x-2 mb-3">
                  <button
                    onClick={() => handleAccept(offer._id)}
                    className="flex-1 flex items-center justify-center space-x-1 bg-green-600 text-white py-2 px-3 rounded-xl text-sm font-medium hover:bg-green-700 transition-all duration-200"
                  >
                    <span>Accept Offer</span>
                  </button>
                  <button
                    onClick={() => handleReject(offer._id)}
                    className="flex-1 flex items-center justify-center space-x-1 bg-red-100 text-red-700 py-2 px-3 rounded-xl text-sm font-medium hover:bg-red-200 transition-all duration-200"
                  >
                    <span>Reject</span>
                  </button>
                </div>
                <form onSubmit={e => { e.preventDefault(); handleCounter(offer._id); }} className="flex items-center gap-2 mt-2">
                  <input
                    type="number"
                    min="1"
                    value={counterPrice[offer._id] || ''}
                    onChange={e => setCounterPrice(cp => ({ ...cp, [offer._id]: e.target.value }))}
                    placeholder="New counter price"
                    className="px-2 py-1 border rounded w-28 text-sm"
                  />
                  <button type="submit" className="bg-yellow-500 text-white px-3 py-1 rounded text-sm font-bold hover:bg-yellow-600">
                    Send Counter Price
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>

        {/* Compact Bottom Info */}
        <div className="text-center mt-4 p-3 bg-white rounded-xl shadow-lg border border-gray-100 mx-2">
          <p className="text-xs text-gray-600">
            All captains are verified and insured. Your safety is our priority.
          </p>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-4 right-4">
        <button className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 flex items-center justify-center">
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default Offers;
