import React, { useEffect, useState } from "react";
import "./RealTimeData.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faClock } from "@fortawesome/free-solid-svg-icons";
function RealTimeData() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000); // Update every second (1000 ms)

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const date = currentDateTime.toLocaleDateString(); // e.g., '11/7/2024'
  const time = currentDateTime.toLocaleTimeString(); // e.g., '14:30:45'

  return (
    <div className="realtimedatadiv align-items-center shadow w-100 bg-white">
      <div className="row px-sm-4  pt-2 px-3 text-secondary">
        <div className="col-md-3">
          <h6 className="me-2 mt-2">Real Time Data</h6>
        </div>
        <div className="col-md-2    d-flex align-items-center border-start pt-2">
          <p className="me-2">
            <FontAwesomeIcon className="me-2" icon={faCalendarDays} />
            {date}
          </p>
        </div>
        <div className="col-md-3 d-flex align-items-center pt-2">
          <p className="me-2">
            <FontAwesomeIcon className="me-2" icon={faClock} />
            {time}
          </p>
        </div>
      </div>
    </div>
  );
}

export default RealTimeData;
