import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Users, Anchor, Navigation, Star,Ship } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import image1 from '../../assets/pexels-dajana-reci-289671698-16247245.jpg';
 import image2 from '../../assets/pexels-cristian-bagnarello-3619432-5727263.jpg';
 import image3 from '../../assets/pexels-eslames1-27407537.jpg';
// import BookingModal from './BookingModal'; // Ensure this component exists or remove if not needed

const Hero = ({ isPublicHomepage = false }) => {
  const navigate = useNavigate();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

const heroImages = [image1, image2, image3];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSetSail = () => {
    if (isPublicHomepage) {
      // Public homepage - go to signup
      console.log('Public homepage - navigating to signup');
      navigate('/signup');
    } else {
      // Passenger homepage - go to language page
      console.log('Passenger homepage - navigating to language');
      navigate('/passenger/language');
    }
  };

  return (
    <>
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image Slider */}
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image}
                alt={`Flucca ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 via-blue-800/50 to-cyan-900/70"></div>
            </div>
          ))}
        </div>

        {/* Animated Nile Waves */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="wave-container">
            <div className="wave wave1"></div>
            <div className="wave wave2"></div>
            <div className="wave wave3"></div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="floating-element floating-1">
            <Ship className="w-6 h-6 text-white-300 opacity-40" />
          </div>
          <div className="floating-element floating-2">
            <Navigation className="w-6 h-6 text-cyan-300 opacity-40" />
          </div>
          <div className="floating-element floating-3">
            <Star className="w-5 h-5 text-yellow-300 opacity-50" />
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
              <Ship className="w-6 h-6 text-white-300 opacity-40" />
            </div>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
              Sail the Legendary
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Nile with Flucca
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              Experience the timeless beauty of Aswan aboard authentic feluccas. Discover Philae Temple, 
              Elephantine Island, and the peaceful rhythm of the eternal Nile River with our expert Nubian captains.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <button
              onClick={handleSetSail}
              className="w-full sm:w-auto bg-white/20 backdrop-blur-sm text-white py-4 px-6 rounded-2xl font-semibold text-lg hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 border border-white/30"
            >
              Start Your Journey
            </button>
            <button
              onClick={() => scrollToSection('map')}
              className="w-full sm:w-auto bg-white/10 backdrop-blur-sm text-white px-10 py-5 rounded-2xl text-xl font-bold border-2 border-white/30 hover:bg-white/20 transition-all duration-300 shadow-xl"
            >
              <span className="flex items-center justify-center">
                Explore Interactive Map
                <MapPin className="ml-2 w-6 h-6 group-hover:bounce transition-transform" />
              </span>
            </button>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 right-8 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why Choose
              <span className="block text-blue-600">Flucca Experience</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the unique advantages that make our Nile adventures truly special
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-100">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ancient Aswan Sites</h3>
              <p className="text-gray-600 leading-relaxed">Visit Philae Temple, Elephantine Island, Unfinished Obelisk, and authentic Nubian villages along the Nile</p>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-100">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Perfect Timing</h3>
              <p className="text-gray-600 leading-relaxed">Magical sunrise, golden sunset, and full-day felucca sailing experiences on the Nile</p>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-100">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Nubian Masters</h3>
              <p className="text-gray-600 leading-relaxed">Authentic Nubian captains with generations of Nile sailing wisdom and Aswan heritage</p>
            </div>
          </div>
        </div>
      </section>

      {/* <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} /> */}

      <style jsx>{`
        .wave-container {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100px;
          overflow: hidden;
        }

        .wave {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 200%;
          height: 100px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          border-radius: 50%;
        }

        .wave1 {
          animation: wave 8s ease-in-out infinite;
        }

        .wave2 {
          animation: wave 8s ease-in-out infinite;
          animation-delay: -2s;
          opacity: 0.7;
        }

        .wave3 {
          animation: wave 8s ease-in-out infinite;
          animation-delay: -4s;
          opacity: 0.5;
        }

        @keyframes wave {
          0%, 100% {
            transform: translateX(-50%) translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateX(-50%) translateY(-20px) rotate(180deg);
          }
        }

        .floating-element {
          position: absolute;
          animation: float 6s ease-in-out infinite;
        }

        .floating-1 {
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }

        .floating-2 {
          top: 60%;
          right: 15%;
          animation-delay: 2s;
        }

        .floating-3 {
          bottom: 30%;
          left: 20%;
          animation-delay: 4s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
      `}</style>
    </>
  );
};

export default Hero;