import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, User, Calendar, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const Reviews = () => {
  const [currentReview, setCurrentReview] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const navigate = useNavigate();
   const handleSetSail = () => {
    console.log('Set Sail clicked - navigating to language');
    navigate('/passenger/language');
  };
 

  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      country: "United States",
      rating: 5,
      date: "December 2024",
      title: "Magical Sunset Experience",
      review: "The sunset felucca ride in Aswan was absolutely magical! Captain Ahmed was incredibly knowledgeable about the history and made us feel so welcome. The views of Philae Temple from the water were breathtaking. Highly recommend Flucca for an authentic Nile experience!",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
      experience: "Sunset Cruise"
    },
    {
      id: 2,
      name: "Marco Rossi",
      country: "Italy",
      rating: 5,
      date: "November 2024",
      title: "Perfect Family Adventure",
      review: "We took our family of 5 on the full-day adventure and it exceeded all expectations. The kids loved the Nubian village visit and the traditional music. The felucca was comfortable and safe. Captain Mahmoud shared amazing stories about Aswan's history. Unforgettable memories!",
      image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150",
      experience: "Full Day Adventure"
    },
    {
      id: 3,
      name: "Emma Thompson",
      country: "United Kingdom",
      rating: 5,
      date: "October 2024",
      title: "Authentic Cultural Experience",
      review: "The temple explorer tour was phenomenal! Visiting Philae Temple by felucca felt like stepping back in time. The Nubian captain's knowledge of ancient Egypt was impressive. The traditional tea service on board was a lovely touch. Flucca provides the most authentic experience in Aswan!",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
      experience: "Temple Explorer"
    },
    {
      id: 4,
      name: "Ahmed Hassan",
      country: "Egypt",
      rating: 5,
      date: "September 2024",
      title: "Professional Service",
      review: "As an Egyptian, I was impressed by the professionalism and authenticity of Flucca. They maintain the traditional felucca experience while ensuring modern safety standards. Perfect for showing visitors the real beauty of Aswan and the Nile. The interactive map feature is brilliant!",
      image: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150",
      experience: "Cultural Tour"
    },
    {
      id: 5,
      name: "Lisa Chen",
      country: "Singapore",
      rating: 5,
      date: "August 2024",
      title: "Photography Paradise",
      review: "The photography tour was incredible! Captain Omar knew all the best spots for capturing Aswan's beauty. The golden hour shots of the felucca against the Nile backdrop are stunning. The equipment was well-maintained and the crew was very accommodating. Perfect for photography enthusiasts!",
      image: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150",
      experience: "Photography Tour"
    },
    {
      id: 6,
      name: "Hans Mueller",
      country: "Germany",
      rating: 5,
      date: "July 2024",
      title: "Romantic Getaway",
      review: "My wife and I celebrated our anniversary with Flucca's sunset cruise. It was incredibly romantic! The peaceful atmosphere, traditional music, and stunning views made it perfect. The crew went above and beyond to make our evening special. We'll definitely return to Aswan!",
      image: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150",
      experience: "Sunset Cruise"
    }
  ];

  const stats = [
    { number: "2,500+", label: "Happy Travelers" },
    { number: "4.9", label: "Average Rating" },
    { number: "98%", label: "Satisfaction Rate" },
    { number: "50+", label: "Countries Served" }
  ];

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentReview((prev) => (prev + 1) % reviews.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, reviews.length]);

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
    setIsAutoPlaying(false);
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
    setIsAutoPlaying(false);
  };

  const goToReview = (index) => {
    setCurrentReview(index);
    setIsAutoPlaying(false);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section id="reviews" className="py-20 bg-gradient-to-br from-blue-50 via-white to-cyan-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-cyan-200 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-blue-300 rounded-full opacity-25 animate-ping"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full mb-6">
            <Quote className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            What Our Guests
            <span className="block text-blue-600">Say About Flucca</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real experiences from travelers who discovered the magic of Aswan with our authentic felucca adventures
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-100">
                <div className="text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Review Carousel */}
        <div className="relative">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-blue-100">
            {reviews.map((review, index) => (
              <div
                key={review.id}
                className={`absolute inset-0 transition-all duration-500 transform ${
                  index === currentReview
                    ? 'opacity-100 translate-x-0'
                    : index < currentReview
                    ? 'opacity-0 -translate-x-full'
                    : 'opacity-0 translate-x-full'
                }`}
              >
                {/* Decorative Side */}
                <div className="hidden md:block w-2 bg-gradient-to-b from-blue-600 to-cyan-600 h-full"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Review Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.slice(0, 6).map((review, index) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-100 cursor-pointer"
              onClick={() => goToReview(index)}
            >
              <div className="flex items-center mb-4">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-100 mr-3"
                />
                <div>
                  <h4 className="font-bold text-gray-900">{review.name}</h4>
                  <div className="flex items-center text-gray-500 text-sm">
                    <MapPin className="w-3 h-3 mr-1" />
                    {review.country}
                  </div>
                </div>
              </div>

              <div className="flex items-center mb-3">
                <div className="flex mr-2">{renderStars(review.rating)}</div>
                <span className="text-sm text-gray-500">{review.date}</span>
              </div>

              <h5 className="font-bold text-blue-600 mb-2">{review.title}</h5>
              <p className="text-gray-600 text-sm line-clamp-3">
                "{review.review.substring(0, 120)}..."
              </p>

              <div className="mt-4 text-xs text-blue-600 font-semibold">
                {review.experience}
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
            <h3 className="text-3xl font-bold mb-4">Ready to Create Your Own Story?</h3>
            <p className="text-xl mb-6 opacity-90">
              Join thousands of satisfied travelers who discovered the magic of Aswan with Flucca
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
  );
};

export default Reviews;