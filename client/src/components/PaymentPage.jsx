import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import '../build/css/PaymentPage.css';

const PaymentPage = () => {
  const location = useLocation();
  const { tripId, clientId, paymentAmount, firstName,tripName } = location.state || {}; 

  const [amount, setAmount] = useState(paymentAmount * 1000);
  const [currency, setCurrency] = useState("TND");
  const [receiverWalletId, setReceiverWalletId] = useState("673537b0be3490452075a977");
  const [description, setDescription] = useState(`payment for client ${firstName || ''}`);
  const [lifespan, setLifespan] = useState(30); 
  const success = useNavigate();

  const handleSubmit = async () => {
    const paymentRequest = {
      amount: parseFloat(amount),
      receiverWalletId: receiverWalletId,
      description: description,
      lifespan: lifespan,
      silentWebhook: true,
      //successUrl: "http://51.20.40.246/success", 
      //failUrl: "http://localhost:3000/fail", 
    };

    try {
      const response = await axios.post("http://localhost:8080/api/payments/initiate", paymentRequest);
      const payUrl = response.data.payUrl;
      const paymentId = response.data.paymentRef;

      if (payUrl && paymentId) {
        await axios.put(`http://localhost:8080/api/clients/${clientId}/payment-ref`, {
          paymentRef: paymentId,
        });
        window.location.href = payUrl;
      } else {
        throw new Error("Payment URL not found in the response.");
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Error initiating payment. Please try again.");
    }
  };

  useEffect(() => {
    handleSubmit();
  }, []); 

  return (
    <div className="payment-page container text-center d-flex align-items-center justify-content-center vh-100">
    <div className="card shadow-lg p-4 d-flex flex-column align-items-center justify-content-center">
      <h2 className="mb-3 text-primary animate-title">
        Initiating Payment for Trip {tripName}
      </h2>
      <p className="mb-3 text-primary animate-title lead mb-4">
        Client: <strong>{firstName}</strong>
      </p>
      <div className="spinner-container d-flex flex-column align-items-center">
        <div className="spinner-border text-primary mb-4" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted">
          Please wait while we redirect you to the payment page...
        </p>
      </div>
    </div>
  </div>
  
  );
};

export default PaymentPage;
