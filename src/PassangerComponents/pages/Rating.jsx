import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiPost, apiPatch } from '../../api';
import { useAppContext } from '../../passangercontext/AppContext';

const Rating = () => {
  const navigate = useNavigate();
  const { selectedTrip } = useAppContext();
  const [selectedRating, setSelectedRating] = useState(0);
  const [review, setReview] = useState("");

  const handleSubmit = async () => {
    try {
      if (!selectedTrip || !selectedTrip._id) {
        alert('No trip selected!');
        return;
      }
      if (!selectedRating) {
        alert('Please select a rating!');
        return;
      }
      await apiPost('/ratings', { tripId: selectedTrip._id, rating: selectedRating, review });
      alert('Thank you for your feedback!');
      navigate('/passenger');
    } catch (err) {
      alert('Failed to submit rating: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center border border-blue-100">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Star className="w-8 h-8 text-teal-600" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Voyage Completed!</h2>
          <p className="text-gray-600 mb-8">How was your maritime experience?</p>
          
          <div className="flex justify-center space-x-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} className="p-1" onClick={() => setSelectedRating(star)}>
                <Star className={`w-8 h-8 ${selectedRating >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
              </button>
            ))}
          </div>
          
          <textarea 
            placeholder="Share your experience (optional)"
            className="w-full p-4 border border-gray-300 rounded-xl mb-6 h-24 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={review}
            onChange={e => setReview(e.target.value)}
          />
          
          <button 
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors mb-4"
          >
            Submit Rating
          </button>
          
          <button 
            onClick={() => navigate('/passenger/ride-type')}
            className="w-full text-blue-600 py-3 px-6 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
          >
            Book Another Voyage
          </button>
        </div>
      </div>
    </div>
  );
};

export default Rating;