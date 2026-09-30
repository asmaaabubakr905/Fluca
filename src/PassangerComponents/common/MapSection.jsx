import React, { useState } from 'react';
import { MapPin, Navigation, Clock, Star, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import InteractiveMap from './InteractiveMap';

const MapSection = () => {
    const navigate = useNavigate();
  const [selectedRoute, setSelectedRoute] = useState('Sunset Cruise');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
   const handleSetSail = () => {
    console.log('Set Sail clicked - navigating to language');
    navigate('/passenger/language');
  };

  const routes = [
    {
      id: 'sunset-cruise',
      name: 'Sunset Cruise',
      duration: '2 hours',
      distance: '8 km',
      stops: ['Aswan Corniche', 'Elephantine Island', 'Botanical Garden', 'Old Cataract View'],
      price: '250 EGP',
      description: 'Perfect for romantic evenings and photography',
      rating: 4.9,
      highlights: ['Golden hour photography', 'Traditional tea service', 'Peaceful atmosphere']
    },
    {
      id: 'temple-explorer', 
      name: 'Temple Explorer',
      duration: '4 hours',
      distance: '15 km',
      stops: ['Old Cataract', 'Philae Temple', 'Nubian Village', 'Kitchener Island', 'Sehel Island'],
      price: '350 EGP',
      description: 'Discover ancient temples and Nubian culture',
      rating: 4.8,
      highlights: ['Temple visits', 'Cultural immersion', 'Expert guide']
    },
    {
      id: 'full-day',
      name: 'Full Day Adventure',
      duration: '8 hours',
      distance: '25 km',
      stops: ['Aswan High Dam', 'Unfinished Obelisk', 'Sehel Island', 'Nubian Museum', 'Tombs of Nobles', 'Monastery of St. Simeon'],
      price: '500 EGP',
      description: 'Complete Aswan experience with lunch included',
      rating: 5.0,
      highlights: ['All major sites', 'Traditional lunch', 'Full day experience']
    },
    {
      id: 'pharaoh-island',
      name: 'Pharaoh Island Adventure',
      duration: '3 hours',
      distance: '12 km',
      stops: ['Aswan Harbor', 'Pharaoh Island Fortress', 'Historical Ruins', 'Panoramic Viewpoint'],
      price: '400 EGP',
      description: 'Explore the ancient fortress with rich historical significance',
      rating: 4.9,
      highlights: ['Historical fortress', 'Archaeological insights', 'Stunning views']
    },
    {
      id: 'fox-island',
      name: 'Fox Island Discovery',
      duration: '2.5 hours',
      distance: '10 km',
      stops: ['Aswan Harbor', 'Fox Island', 'Natural Landscapes', 'Secluded Beaches'],
      price: '350 EGP',
      description: 'Discover the mysterious and peaceful Fox Island',
      rating: 4.8,
      highlights: ['Secluded exploration', 'Natural beauty', 'Bird watching']
    },
    {
      id: 'heisa-island',
      name: 'Heisa Island Experience',
      duration: '3.5 hours',
      distance: '14 km',
      stops: ['Aswan Harbor', 'Heisa Island', 'Nubian Village', 'Local Crafts Market'],
      price: '380 EGP',
      description: 'Immerse in traditional Nubian culture and local life',
      rating: 4.9,
      highlights: ['Nubian culture', 'Local crafts', 'Authentic cuisine']
    }
  ];

  const handleLocationSelect = (location) => {
    setUserLocation(location);
  };

  return (
    <>
      <section id="map" className="py-20 bg-gradient-to-br from-blue-50 via-white to-cyan-50 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-cyan-400 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-300 rounded-full animate-ping"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6">
              <Compass className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Interactive Nile
              <span className="text-blue-600 block">Navigation Map</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Explore Aswan's legendary sites with our professional interactive map. 
              Track your location, discover ancient temples, and plan your perfect felucca journey along the eternal Nile.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Live Stats Panel */}
            <div className="xl:col-span-1 space-y-6">
              {/* Live Stats */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Live Stats</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-600 mb-1">Weather</div>
                    <div className="font-semibold text-blue-600">Perfect ☀️</div>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-600 mb-1">Wind</div>
                    <div className="font-semibold text-green-600">12 km/h</div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-600 mb-1">Water</div>
                    <div className="font-semibold text-blue-600">Optimal</div>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-600 mb-1">Visibility</div>
                    <div className="font-semibold text-green-600">Excellent</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Map */}
            <div className="xl:col-span-3">
              <div className="bg-white rounded-2xl shadow-2xl p-6 border border-blue-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                    <MapPin className="w-6 h-6 text-blue-600 mr-2" />
                    Live Navigation Map
                  </h3>
                  <div className="flex items-center space-x-3">
                    {userLocation && (
                      <div className="flex items-center text-green-600 text-sm font-medium">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                        Location Active
                      </div>
                    )}
                    
                  </div>
                </div>
                
                <InteractiveMap 
                  selectedRoute={selectedRoute}
                  onLocationSelect={handleLocationSelect}
                />
                
                {/* Map Information */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl">
                    <h5 className="font-semibold text-gray-900 mb-2">Interactive Features</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Live GPS tracking</li>
                      <li>• Compass navigation</li>
                      <li>• Zoom controls</li>
                      <li>• Layer switching</li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl">
                    <h5 className="font-semibold text-gray-900 mb-2">Map Layers</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Street view</li>
                      <li>• Satellite imagery</li>
                      <li>• Historical sites</li>
                      <li>• Navigation routes</li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl">
                    <h5 className="font-semibold text-gray-900 mb-2">Smart Features</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Auto location detection</li>
                      <li>• Route optimization</li>
                      <li>• Weather integration</li>
                      <li>• Real-time updates</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

        

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white shadow-2xl">
              <h3 className="text-3xl font-bold mb-4">Ready to Explore Aswan?</h3>
              <p className="text-xl mb-6 opacity-90">
                Use our interactive map to plan your perfect Nile adventure
              </p>
               <button
              onClick={handleSetSail}
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Start Your Journey
            </button>
             
            </div>
          </div>
        </div>
      </section>

     
    </>
  );
};

export default MapSection;