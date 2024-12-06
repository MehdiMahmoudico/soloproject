import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../build/css/CreateTrip.css";

const EditTrip = () => {
  const { id } = useParams();
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setMessage("Unauthorized: No token found.");
          setIsLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:8080/api/trips/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFormData({
          destination: response.data.destination || "",
          startDate: response.data.startDate || "",
          endDate: response.data.endDate || "",
          price: response.data.price || "",
          availableSeats: response.data.availableSeats || "",
        });

        // If there are images, set them in the preview
        if (response.data.images) {
          setPreviewUrls(response.data.images.map((img) => img.url));
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching trip data:", error);
        setMessage(error.response?.data?.message || "Failed to load trip details.");
        setIsLoading(false);
      }
    };

    if (id) {
      fetchTrip();
    } else {
      setMessage("Invalid trip ID.");
      setIsLoading(false);
    }
  }, [id]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    // Create preview URLs for selected files
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
    setMessage("");
    
    // Validation logic for start and end dates
    const today = new Date().toISOString().split("T")[0];
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
  
      const response = await axios.put(`http://localhost:8080/api/trips/edit/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (selectedFiles.length > 0) {
        const formDataImages = new FormData();
        selectedFiles.forEach(file => {
          formDataImages.append('newImages', file); 
        });
  
        await axios.put(`http://localhost:8080/api/trips/${id}/images`, formDataImages, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", 
          },
        });
      }
  
      setMessage("Trip updated successfully!");
    } catch (error) {
      console.error(error);
      setMessage("Failed to update trip. Please try again.");
    }
  };

  if (isLoading) {
    return <p>Loading trip details...</p>;
  }

  return (
    <div className="create-trip-container">
    <div className="create-trip-content">
      <h1 className="title">Edit Trip</h1>
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
          <label className="label">Add Images</label>
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
                style={{ backgroundColor: '#069188' }}
              />
            ))}
          </div>
        )}

        <button type="submit" className="submit-btn">
          Update Trip
        </button>
      </form>
    </div></div>
  );
};

export default EditTrip;
