import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import "../build/css/ReservationForm.css";

function ReservationForm() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [paymentRef, setPaymentRef] = useState("");
  const [error, setError] = useState(null);
  const [trip, setTrip] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentOption, setPaymentOption] = useState("full"); // full or partial payment
  const [paymentAmount, setPaymentAmount] = useState(0); // To hold the calculated payment amount

  useEffect(() => {
    axios.get(`http://localhost:8080/api/trips/${tripId}`)
      .then(response => setTrip(response.data))
      .catch(error => setError(error.message));
  }, [tripId]);

  useEffect(() => {
    if (trip) {
      // Set the initial payment amount based on the trip price
      const amount = paymentOption === "partial" ? trip.price * 0.10 : trip.price;
      setPaymentAmount(amount);
    }
  }, [trip, paymentOption]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient({ ...client, [name]: value });
  };

  const handlePaymentChange = (e) => {
    setPaymentOption(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  };

  useEffect(() => {
    if (!isSubmitting) return;

    const createReservation = async () => {
      try {
        const clientResponse = await axios.post('http://localhost:8080/api/clients/create', client);
        const clientId = clientResponse.data.id;
        const reservation = {
          client: { id: clientId },
          trip: { id: tripId },
          reservationDate: new Date().toISOString(),
          status: 'PENDING',
        };
        await axios.post('http://localhost:8080/api/reservations', reservation);

        navigate('/payment', { state: { tripId, clientId, price: trip.price, paymentRef, paymentAmount, reservationStatus: reservation.status, reservationId: reservation.id, firstName: client.firstName, tripName: trip.destination } });
      } catch (error) {
        if (error.response && error.response.data) {
          setError(error.response.data);
        } else {
          setError(error.message);
        }
      } finally {
        setIsSubmitting(false);
      }
    };

    createReservation();
  }, [isSubmitting, client, tripId, navigate, paymentOption, paymentAmount, trip]);

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Reservation Form</h1>
      {error && (
        <div className="alert alert-danger">
          {typeof error === 'string' ? error : Object.values(error).map((msg, index) => (
            <div key={index}>{msg}</div>
          ))}
        </div>
      )}

      <form className='form' onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">First Name:</label>
          <input
            type="text"
            className="form-control"
            name="firstName"
            value={client.firstName}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Last Name:</label>
          <input
            type="text"
            className="form-control"
            name="lastName"
            value={client.lastName}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email:</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={client.email}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone:</label>
          <input
            type="text"
            className="form-control"
            name="phone"
            value={client.phone}
            onChange={handleChange}
          />
        </div>

        {trip && (
          <div className="mb-3">
            <label className="form-label">Trip Details:</label>
            <p><strong>Destination:</strong> {trip.destination}</p>
            <p><strong>Price:</strong> ${trip.price}</p>
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Payment Option:</label>
          <select
            className="form-control"
            value={paymentOption}
            onChange={handlePaymentChange}
          >
            <option value="full">Full Payment</option>
            <option value="partial">10% Payment</option>
          </select>
        </div>

        {trip && (
          <div className="mb-3">
            <label className="form-label">Amount to Pay:</label>
            <p><strong>${paymentAmount}</strong></p>
          </div>
        )}

        <div className="text-center">
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;
