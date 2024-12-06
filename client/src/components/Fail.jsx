import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react"; 
import "../build/css/Fail.css";

const Fail = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/trips");
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="fail-page">
      <div className="fail-box">
        <div className="icon-wrapper">
          <XCircle className="icon" />
        </div>
        <h3 >Payment Failed</h3>
        <p>
          Unfortunately, your payment attempt was unsuccessful. You will be
          redirected to the trips page shortly.
        </p>
      </div>
    </div>
  );
};

export default Fail;
