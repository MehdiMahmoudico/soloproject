import React, { useState } from "react";
import axios from "axios";
import "../build/css/CreateTrip.css";
const CreateTrip = () => {
  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    price: "",
    availableSeats: "",
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    // Create preview URLs
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    if (formData.startDate < today) {
      setMessage("Start date cannot be in the past.");
      return;
    }
  
    if (formData.endDate < formData.startDate) {
      setMessage("End date cannot be before the start date.");
      return;
    }
    try {
      const token = localStorage.getItem("token");

      const tripResponse = await axios.post("http://localhost:8080/api/trips/create", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const tripId = tripResponse.data.id;

      if (selectedFiles.length > 0) {
        const formData = new FormData();
        selectedFiles.forEach(file => {
          formData.append('images', file);
        });

        await axios.post(`http://localhost:8080/api/trips/${tripId}/images`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      setMessage("Trip created successfully!");
      setFormData({
        destination: "",
        startDate: "",
        endDate: "",
        price: "",
        availableSeats: "",
      });
      setSelectedFiles([]);
      setPreviewUrls([]);
    } catch (error) {
      console.error(error);
      setMessage("Failed to create trip. Please try again.");
    }
  };

  return (
    <div className="create-trip-container">
      <div className="create-trip-content">
        <h1 className="title">Create Trip</h1>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label className="label">Destination</label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <div className="form-group">
            <label className="label">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <div className="form-group">
            <label className="label">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <div className="form-group">
            <label className="label">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <div className="form-group">
            <label className="label">Available Seats</label>
            <input
              type="number"
              name="availableSeats"
              value={formData.availableSeats}
              onChange={handleChange}
              className="input"
              required
            />
          </div>
          <div className="form-group">
            <label className="label">Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="file-input"
            />
          </div>

          {previewUrls.length > 0 && (
            <div className="preview-container">
              {previewUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="preview-image"
                />
              ))}
            </div>
          )}

          <button type="submit" className="submit-btn">
            Create Trip
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTrip;
