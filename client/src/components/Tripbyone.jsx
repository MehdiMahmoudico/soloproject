import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../build/css/Tripbyone.css';

const Tripbyone = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  // Fetch trip details when the component mounts or tripId changes
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/trips/${tripId}`)
      .then((response) => {
        setTrip(response.data);
      })
      .catch((error) => {
        console.error('Error fetching trip details:', error);
        setError('Error fetching trip details');
      });
  }, [tripId]);

  // Automatically cycle through images every 3 seconds
  useEffect(() => {
    if (trip && trip.images && trip.images.length > 0) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % trip.images.length);
      }, 3000); // Change image every 3 seconds

      return () => clearInterval(interval); // Cleanup interval on component unmount
    }
  }, [trip]);

  // Handle image change on button click (next/previous)
  const handleImageChange = (direction) => {
    if (direction === 'next') {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % trip.images.length);
    } else if (direction === 'prev') {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex - 1 + trip.images.length) % trip.images.length
      );
    }
  };

  const handleReserve = () => {
    console.log('Reserved trip:', trip.destination);
    navigate(`/reserve/${tripId}`);
  };

  // Show error if there's an issue fetching the trip
  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  // Show loading message until the trip data is available
  if (!trip) {
    return <div>Loading...</div>;
  }

  return (
    <div className="custom-container mt-5">
      <h1>{trip.destination}</h1>
      <p><strong>Start Date:</strong> {trip.startDate}</p>
      <p><strong>End Date:</strong> {trip.endDate}</p>
      <p><strong>Price:</strong> ${trip.price}</p>
      <p><strong>Available Seats:</strong> {trip.availableSeats}</p>

      {/* Image Slider */}
      {trip.images && trip.images.length > 0 ? (
        <div className="image-slider-container">
          {/* Previous Button */}
          <button
            className="slider-button prev"
            onClick={() => handleImageChange('prev')}
          >
            &#8592;
          </button>

          {/* Image Display */}
          <div className="slider-image-container2">
            <img
              src={`${process.env.PUBLIC_URL}/upload/${trip.images[currentImageIndex]}`}
              alt={`Trip image ${currentImageIndex + 1}`}
              className="slider-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/fallback-image.jpg'; // Use fallback image if the image fails to load
              }}
            />
          </div>

          {/* Next Button */}
          <button
            className="slider-button next"
            onClick={() => handleImageChange('next')}
          >
            &#8594;
          </button>
        </div>
      ) : (
        <div>No images available</div>
      )}

      {/* Reserve Button */}
      <div className="mt-3">
        <button onClick={handleReserve} className="btn btn-primary">
          Reserve This Trip
        </button>
      </div>
    </div>
  );
};

export default Tripbyone;
