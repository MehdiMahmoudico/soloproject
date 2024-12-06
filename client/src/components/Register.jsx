import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    passwordConfirmation: "",
  });

  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.passwordConfirmation) {
      setErrors(["Passwords do not match"]);
      return; 
    }

    try {
      const response = await axios.post("http://localhost:8080/api/users/register", formData);
      alert("Registration successful!");
      setErrors([]);
      navigate("/login");

    } catch (err) {
      if (err.response) {
        if (err.response.data && Array.isArray(err.response.data)) {
          setErrors(err.response.data.map((error) => error.defaultMessage || error));
        } else {
          setErrors([err.response.data || "An unknown error occurred"]);
        }
      } else {
        setErrors(["An error occurred while connecting to the server"]);
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h3 className="register-title">Register</h3>
        {errors.length > 0 && (
          <div className="error-messages">
            {errors.map((error, index) => (
              <p key={index} className="error-message">
                {error}
              </p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="input-group">
            <label className="input-label">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div className="input-group">
            <label className="input-label">Password Confirmation</label>
            <input
              type="password"
              name="passwordConfirmation"
              value={formData.passwordConfirmation}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <button type="submit" className="submit-button">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
