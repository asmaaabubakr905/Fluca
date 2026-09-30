import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

const RequireDriver = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  console.log('RequireDriver - Current user:', user);
  
  // If no user or user is not a driver, redirect to login
  if (!user || user.role !== 'Driver') {
    console.log('RequireDriver - Redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  console.log('RequireDriver - User authenticated, showing component');
  return children;
};

const RequirePassenger = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  console.log('RequirePassenger - Current user:', user);
  
  // If no user or user is not a passenger, redirect to login
  if (!user || user.role !== 'Passenger') {
    console.log('RequirePassenger - Redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  console.log('RequirePassenger - User authenticated, showing component');
  return children;
};

const Login = lazy(() => import('./DriverPages/Login'));
const Register = lazy(() => import('./DriverPages/SignUp'));
const DriverDashboard = lazy(() => import('./DriverPages/DriverDashboard'));
const ProfilePage = lazy(() => import('./PassangerComponents/pages/ProfilePage'));
const Layout = lazy(() => import('./DriverComponents/Layout'));
const PassengerLayout = lazy(() => import('./PassangerComponents/common/PassengerLayout'));
const Homepage = lazy(() => import('./PassangerComponents/pages/Homepage.jsx'));
const Language = lazy(() => import('./PassangerComponents/pages/Language.jsx'));
const RideType = lazy(() => import('./PassangerComponents/pages/RideType.jsx'));
const PrivateBooking = lazy(() => import('./PassangerComponents/pages/PrivateBooking.jsx'));
const SharedTrips = lazy(() => import('./PassangerComponents/pages/SharedTrips.jsx'));
const Offers = lazy(() => import('./PassangerComponents/pages/Offers.jsx'));
const TripDetails = lazy(() => import('./PassangerComponents/pages/TripDetails.jsx'));
const Tracking = lazy(() => import('./PassangerComponents/pages/Tracking.jsx'));
const Chat = lazy(() => import('./PassangerComponents/pages/Chat.jsx'));
const Rating = lazy(() => import('./PassangerComponents/pages/Rating.jsx'));
const PublicHomepage = lazy(() => import('./PassangerComponents/pages/PublicHomepage.jsx'));
const AdminDashboard = lazy(() => import('./admindashboard/admin.jsx'));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicHomepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />

          {/* Driver Routes */}
          <Route
            path="/driver"
            element={
              <RequireDriver>
                <Layout />
              </RequireDriver>
            }
          >
            <Route index element={<Navigate to="/driver/dashboard" replace />} />
            <Route path="dashboard" element={<DriverDashboard />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Passenger Routes with Layout */}
          <Route
            path="/passenger"
            element={
              <RequirePassenger>
                <PassengerLayout />
              </RequirePassenger>
            }
          >
            <Route index element={<Navigate to="/passenger/language" replace />} />
            <Route path="home" element={<Homepage />} />
            <Route path="/passenger/profile" element={<ProfilePage />} />
            <Route path="language" element={<Language />} />
            <Route path="ride-type" element={<RideType />} />
            <Route path="private-booking" element={<PrivateBooking />} />
            <Route path="shared-trips" element={<SharedTrips />} />
            <Route path="offers" element={<Offers />} />
            <Route path="trip-details" element={<TripDetails />} />
            <Route path="trip-details/:id" element={<TripDetails />} />
            <Route path="tracking" element={<Tracking />} />
            <Route path="tracking/:id" element={<Tracking />} />
            <Route path="chat" element={<Chat />} />
            <Route path="chat/:id" element={<Chat />} />
            <Route path="rating" element={<Rating />} />
            <Route path="rating/:id" element={<Rating />} />
            <Route path="admin" element={<AdminDashboard />} />
          </Route>
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;