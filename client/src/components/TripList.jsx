import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import '../build/css/TripList.css';
import Slider from './Slider';

function TripImagesSlider({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval); 
  }, [images.length]);

  return (
    <div className="slider-container">
      <img
        src={`${process.env.PUBLIC_URL}/upload/${images[currentIndex]}`}
        alt={`Slide ${currentIndex + 1}`}
        className="slider-image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/fallback-image.jpg';
        }}
      />
    </div>
  );
}

function TripList() {
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [userRole, setUserRole] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const tripsPerPage = 6;
  const navigate = useNavigate();
const handleEditTrip =(tripId) => { 
  navigate(`/edit-trip/${tripId}`);
};
  useEffect(() => {
    axios
      .get('http://localhost:8080/api/trips')
      .then((response) => {
        setTrips(response.data);
      })
      .catch((error) => {
        console.error('Error fetching trips:', error);
        setError(error.message);
      });

    // Get the user role from the JWT token
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  if (error) {
    return <div className="alert alert-danger">Error: {error}</div>;
  }

  // Filter trips based on search query
  const filteredTrips = trips.filter((trip) =>
    trip.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastTrip = currentPage * tripsPerPage;
  const indexOfFirstTrip = indexOfLastTrip - tripsPerPage;
  const currentTrips = filteredTrips.slice(indexOfFirstTrip, indexOfLastTrip);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredTrips.length / tripsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleReservationClick = (tripId) => {
    navigate(`/trip/${tripId}`);
  };

  const handleDeleteTrip = (tripId) => {
    const token = localStorage.getItem('token');
    if (!token || userRole !== 'ROLE_ADMIN') {
      setError('Unauthorized: Only administrators can delete trips');
      return;
    }

    axios
      .delete(`http://localhost:8080/api/trips/delete/${tripId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setTrips(trips.filter((trip) => trip.id !== tripId));
        setError(null); 
      })
      .catch((error) => {
        console.error('Error deleting trip:', error);
        if (error.response?.status === 403) {
          setError('Unauthorized: Only administrators can delete trips');
        } else {
          setError('Error deleting trip. Please try again later.');
        }
      });
  };

  return (
    <>  <Slider />
    <div className="custom-container mt-3">
    
      <h1 className="mb-4">Trip List</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by destination"
          className="form-control"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="row">
        {currentTrips.map((trip) => (
          <div key={trip.id} className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{trip.destination}</h5>
                <p className="card-text">
                  <strong>Dates:</strong> {trip.startDate} to {trip.endDate}
                </p>
                <p className="card-text">
                  <strong>Price:</strong> ${trip.price}
                </p>
                {/* Image Slider */}
                {trip.images && trip.images.length > 0 ? (
                  <TripImagesSlider images={trip.images} />
                ) : (
                  <div className="h-48 d-flex align-items-center justify-content-center">
                    <p>No images available</p>
                  </div>
                )}
                {/* Actions */}
                <div className="d-flex gap-2 mt-3">
                  <button
                    onClick={() => handleReservationClick(trip.id)}
                    className="btn btn-primary"
                  >
                    View Details
                  </button>
                  {userRole === 'ROLE_ADMIN' && (
                    <button
                      onClick={() => handleDeleteTrip(trip.id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                    
                  )}
                  {userRole === 'ROLE_ADMIN' && (
                    <button
                      onClick={() => handleEditTrip(trip.id)}
                      className="btn btn-danger"
                    >
                      Edit
                    </button>
                    
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="d-flex justify-content-between mt-4">
        <button
          onClick={handlePreviousPage}
          className="btn btn-secondary"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {Math.ceil(filteredTrips.length / tripsPerPage)}</span>
        <button
          onClick={handleNextPage}
          className="btn btn-secondary"
          disabled={currentPage === Math.ceil(filteredTrips.length / tripsPerPage)}
        >
          Next
        </button>
      </div>
    </div></>
  );
}

export default TripList;
