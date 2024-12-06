import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react"; 
import "../build/css/Success.css";

const Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/trips");
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="success-page d-flex justify-content-center align-items-center vh-100">
      <div className="success-box shadow-lg p-4 text-center rounded">
        <div className="icon-wrapper mb-3">
          <CheckCircle2 className="icon1" />
        </div>
        <h3 className="text-success">Success!</h3>
        <p className="mt-2">
          Your payment was successful. You will be redirected to the trips page shortly.
        </p>
      </div>
    </div>
  );
};

export default Success;
