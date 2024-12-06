import React from 'react';
import { Route, Routes } from 'react-router-dom';
import TripList from './components/TripList';
import ReservationForm from './components/ReservationForm';
import PaymentPage from './components/PaymentPage';
import Success from './components/Success';
import Fail from './components/Fail';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import User from './components/User';
import ProtectedRoute from './components/ProtectedRoute';
import UserRoute from './components/UserRoute';
import PublicRoute from './components/PublicRoute';
import CreateTrip from './components/CreateTrip';
import Reservations from './components/Resrvations';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Tripbyone from './components/Tripbyone';
import EditTrip from './components/EditTrip';


function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}><NavBar />
    <div style={{ flexGrow: 1 }}>
      
    <Routes>
    <Route path="/" element={<TripList />} />
      <Route path="/trips" element={<TripList />} />
      <Route path="/reserve/:tripId" element={<ReservationForm />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/success" element={<Success />} />
      <Route path="/fail" element={<Fail />} />
      <Route path="/trip/:tripId" element={<Tripbyone />} />
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
       {/* <Route 
        path="/register" 
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } 
      />*/}
      <Route 
        path="/admin-dashboard" 
        element={
          <ProtectedRoute>
            <AdminDashboard />
           
          </ProtectedRoute>
        } 
      />
       <Route path="createtrip" element={<ProtectedRoute><CreateTrip /></ProtectedRoute>} />
       <Route path="/edit-trip/:id" element={<ProtectedRoute><EditTrip /></ProtectedRoute>} />
       <Route path="reservations" element={<ProtectedRoute><Reservations /></ProtectedRoute>} />
      <Route 
        path="/user-dashboard" 
        element={
          <UserRoute>
            <User />
          </UserRoute>
        } 
      />
    </Routes>
    </div>
    <Footer />
    </div>
  );
}

export default App;