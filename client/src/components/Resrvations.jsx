import React, { useEffect, useState } from "react";
import axios from "axios";
import "../build/css/Reservations.css";

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [nameFilter, setNameFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [message, setMessage] = useState("");
  const [dateSort, setDateSort] = useState("desc"); // new state for date sorting

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/api/reservations/getAll", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReservations(response.data);
      setFilteredReservations(response.data);
    } catch (error) {
      console.error(error);
      setMessage("Failed to fetch reservations. Please try again.");
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    let filtered = [...reservations]; // Create a copy to avoid mutating the original array

    if (statusFilter !== "ALL") {
      filtered = filtered.filter((reservation) => reservation.status === statusFilter);
    }

    if (nameFilter) {
      const nameSearch = nameFilter.toLowerCase();
      filtered = filtered.filter(
        (reservation) =>
          reservation.client?.firstName?.toLowerCase().includes(nameSearch) ||
          reservation.client?.lastName?.toLowerCase().includes(nameSearch)
      );
    }

    if(paymentFilter) {
      const paymentSearch = paymentFilter.toLowerCase();
      filtered = filtered.filter((reservation) => 
        reservation.client?.paymentRef?.toLowerCase().includes(paymentSearch)
      );
    }

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.reservationDate).getTime();
      const dateB = new Date(b.reservationDate).getTime();
      return dateSort === "desc" ? dateB - dateA : dateA - dateB;
    });

    setFilteredReservations(filtered);
  }, [statusFilter, nameFilter, paymentFilter, reservations, dateSort]); // Added dateSort to dependencies

  const deleteReservation = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/api/reservations/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReservations((prev) => prev.filter((reservation) => reservation.id !== id));
    } catch (error) {
      console.error("Error deleting reservation:", error);
      setMessage("Failed to delete the reservation. Please try again.");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/reservations/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setReservations(
        reservations.map((reservation) =>
          reservation.id === id ? { ...reservation, status: response.data.status } : reservation
        )
      );
      setMessage("Status updated successfully.");
    } catch (error) {
      console.error(error);
      setMessage("Failed to update the status. Please try again.");
    }
  };

  const toggleDateSort = () => {
    setDateSort(prev => prev === "desc" ? "asc" : "desc");
  };

  return (
    <div className="reservations-container">
      <div className="reservations-content">
        <h1 style={{color:"#005F6A"}} className="title">Reservations</h1>
        {message && <p className="message">{message}</p>}
        <div className="filter-section">
          <div>
            <label htmlFor="status-filter">Filter by Status: </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">All</option>
              <option value="PENDING">Pending</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="CONFIRMED">Confirmed</option>
            </select>
          </div>
          <div>
            <label htmlFor="name-filter">Filter by Name: </label>
            <input
              type="text"
              id="name-filter"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              placeholder="Enter client name"
              className="filter-input"
            />
          </div>
          <div>
            <label htmlFor="payment-filter">Filter by Payment Ref: </label>
            <input
              type="text"
              id="payment-filter"
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              placeholder="Enter payment reference"
              className="filter-input"
            />
          </div>
        </div>

        {filteredReservations.length > 0 ? (
          <table className="reservations-table">
            <thead>
              <tr>
                <th>Reservation ID</th>
                <th>Client Payment Id</th>
                <th>Client Confirmations Coupon</th>
                <th>Client First Name</th>
                <th>Client Last Name</th>
                <th>Client Email</th>
                <th>Client Phone</th>
                <th>Trip Destination</th>
                <th>Trip Price</th>
                <th  onClick={toggleDateSort} className="sortable-header">
            Reservation Date
            <span className={`sort-arrow ${dateSort}`}>{dateSort === "desc" ? "↓" : "↓"}</span>
        </th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td>{reservation.id}</td>
                  <td>{reservation.client?.paymentRef || "N/A"}</td>
                  <td>{reservation.couponCode || "Not Paid yet"}</td>
                  <td>{reservation.client?.firstName || "N/A"}</td>
                  <td>{reservation.client?.lastName || "N/A"}</td>
                  <td>{reservation.client?.email || "N/A"}</td>
                  <td>{reservation.client?.phone || "N/A"}</td>
                  <td>{reservation.trip?.destination || "N/A"}</td>
                  <td>{reservation.trip?.price || "N/A"}</td>
                  <td>{new Date(reservation.reservationDate).toLocaleString()}</td>
                  <td>
                    <select
                      value={reservation.status}
                      onChange={(e) => updateStatus(reservation.id, e.target.value)}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="CANCELLED">Cancelled</option>
                      <option value="CONFIRMED">Confirmed</option>
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={() => deleteReservation(reservation.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No reservations found.</p>
        )}
      </div>
    </div>
  );
};

export default Reservations;