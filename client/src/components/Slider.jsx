import React from 'react';
import "../build/css/Slider.css";

const Slider = () => {
  return (
    <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img
            src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=2000&q=100"
            className="d-block w-100"
            alt="Paris"
          />
          <div className="carousel-caption d-none d-md-block">
            <h5>Paris</h5>
            <p>Experience the romance and charm of the City of Light.</p>
          </div>
        </div>
        <div className="carousel-item">
          <img
            src="https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=2000&q=100"
            className="d-block w-100"
            alt="Tulum"
          />
          <div className="carousel-caption d-none d-md-block">
            <h5>Tulum</h5>
            <p>Explore the stunning beaches and ancient ruins of Tulum.</p>
          </div>
        </div>
        <div className="carousel-item">
          <img
            src="https://images.unsplash.com/photo-1552074284-5e88ef1aef18?auto=format&fit=crop&w=2000&q=100"
            className="d-block w-100"
            alt="Cancún"
          />
          <div className="carousel-caption d-none d-md-block">
            <h5>Cancún</h5>
            <p>Enjoy pristine beaches and crystal-clear Caribbean waters.</p>
          </div>
        </div>
      </div>

      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExample"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExample"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Slider;
