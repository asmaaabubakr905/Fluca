import React, { useEffect, useState } from 'react';
import { apiGet, apiPut } from '../../api';

const RequestsSection = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiGet('/bookings/driver');
      setRequests(data);
    } catch (err) {
      setError('Failed to load requests');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (bookingId, status) => {
    try {
      await apiPut(`/bookings/${bookingId}`, { status });
      fetchRequests();
    } catch (err) {
      alert('Failed to update booking');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading requests...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Booking Requests</h2>
      {requests.length === 0 ? (
        <div className="text-gray-500">No requests found.</div>
      ) : (
        <table className="w-full border rounded-2xl overflow-hidden shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Passenger</th>
              <th className="p-2">Trip</th>
              <th className="p-2">Seats</th>
              <th className="p-2">Status</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id} className="border-t">
                <td className="p-2">{req.passenger?.name || req.passenger?.email}</td>
                <td className="p-2">{req.trip?.from} → {req.trip?.to}</td>
                <td className="p-2">{req.seats}</td>
                <td className="p-2">{req.status}</td>
                <td className="p-2">
                  {req.status === 'Pending' && (
                    <>
                      <button onClick={() => handleAction(req._id, 'Confirmed')} className="bg-green-600 text-white rounded-lg px-4 py-2 hover:bg-green-700 transition-colors">Accept</button>
                      <button onClick={() => handleAction(req._id, 'Cancelled')} className="bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-600 transition-colors">Reject</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RequestsSection; 