import React, { useEffect, useState } from "react";
import {
  FaStar,
  FaUser,
  FaRoute,
  FaComments,
  FaThumbsUp,
} from "react-icons/fa";
import { apiGet } from "../../api";

const RatingsSection = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const captainId = user?.id || user?._id;

  useEffect(() => {
    async function fetchRatings() {
      setLoading(true);
      setError(null);
      try {
        const data = await apiGet(`/ratings/captain/${captainId}`);
        setRatings(data);
      } catch (err) {
        setError("Failed to load ratings");
      }
      setLoading(false);
    }
    if (captainId) fetchRatings();
  }, [captainId]);

  // Calculate average rating
  const averageRating =
    ratings.length > 0
      ? (
          ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        ).toFixed(1)
      : 0;

  // Count ratings by star
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  ratings.forEach((r) => {
    ratingCounts[r.rating] = (ratingCounts[r.rating] || 0) + 1;
  });

  if (loading)
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-2">⚠️</div>
          <div className="text-red-500 font-semibold">{error}</div>
        </div>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-xl">
            <FaThumbsUp className="text-white text-2xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-1">Passenger Ratings</h2>
            <p className="text-yellow-100">
              See what passengers say about your service
            </p>
          </div>
        </div>
      </div>

      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-xl">
              <FaStar className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                Average Rating
              </h3>
              <p className="text-gray-500 text-sm">Overall score</p>
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-800 mb-2">
              {averageRating}
            </div>
            <div className="flex justify-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`text-lg ${
                    star <= averageRating ? "text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-gray-500">
              {ratings.length} total reviews
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl">
              <FaThumbsUp className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Top Ratings</h3>
              <p className="text-gray-500 text-sm">5-star reviews</p>
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {ratingCounts[5]}
            </div>
            <div className="text-sm text-gray-500">5-star reviews</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl">
              <FaComments className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Total Reviews</h3>
              <p className="text-gray-500 text-sm">All feedback</p>
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {ratings.length}
            </div>
            <div className="text-sm text-gray-500">Total reviews</div>
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Rating Distribution
        </h3>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingCounts[star] || 0;
            const percentage =
              ratings.length > 0 ? (count / ratings.length) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-3">
                <div className="flex items-center gap-2 w-16">
                  <span className="text-sm font-medium text-gray-600">
                    {star}
                  </span>
                  <FaStar className="text-yellow-400 text-sm" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="w-12 text-right">
                  <span className="text-sm font-medium text-gray-600">
                    {count}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800">Recent Reviews</h3>
        </div>

      {ratings.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-300 text-4xl mb-2">⭐</div>
            <p className="text-gray-500">
              No ratings yet. Keep providing great service!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {ratings.map((rating) => (
              <div
                key={rating._id}
                className="p-6 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-full">
                      <FaUser className="text-white text-sm" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">
                        {rating.passenger?.name ||
                          rating.passenger?.email ||
                          "Anonymous"}
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            className={`text-sm ${
                              star <= rating.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="text-sm text-gray-500 ml-1">
                          ({rating.rating})
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(
                      rating.createdAt || rating.date
                    ).toLocaleDateString()}
                  </div>
                </div>

                {(rating.trip?.from || rating.trip?.start) &&
                  (rating.trip?.to || rating.trip?.destination) && (
                    <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                      <FaRoute className="text-blue-500" />
                      <span>
                        {rating.trip?.from || rating.trip?.start} →{" "}
                        {rating.trip?.to || rating.trip?.destination}
                      </span>
                    </div>
                  )}

                {rating.review && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {rating.review}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RatingsSection; 
