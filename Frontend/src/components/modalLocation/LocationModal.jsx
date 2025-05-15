import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./locationModal.css";

// map components
// import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Customize the Leaflet icon options
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export const LocationModal = ({ handleClose, show }) => {
  const stops = ["Chengannur", "Kollam", "Pathanamthitta", "Pamba"];
  const updatedStop = "Kollam";

  // finding stops index behind current stop
  const currentStopIndex = () => {
    const stopIndex = stops.findIndex((stop) => stop === updatedStop);
    return stopIndex;
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Running Status</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="locationDetailsContainer">
          <div className="locationModalContainer">
            {stops.map((stopValue, index) => (
              <div key={index} className="locationStopsContainer">
                <div className="location-timeline-wrapper">
                  <div
                    className="timeLine"
                    style={{
                      backgroundColor: `${
                        index <= currentStopIndex() ? "blue" : "gray"
                      }`,
                    }}
                  ></div>
                  {index != stops.length - 1 && (
                    <div
                      className="location-stop-line"
                      style={{
                        backgroundColor: `${
                          index <= currentStopIndex() ? "blue" : "gray"
                        }`,
                      }}
                    ></div>
                  )}
                </div>
                <div className="locationStops">
                  <h4>{stopValue}</h4>
                </div>
              </div>
            ))}
          </div>
          <div className="locationTripDetails">
            <div className="locationMOdalStartDetailsConatainer">
              <h4>Start Depo:</h4>
              <h5>CGR</h5>
            </div>
            <div className="locationMOdalStartDetailsConatainer">
              <h4>Start Date:</h4>
              <h5>25/11/2024</h5>
            </div>
            <div className="locationMOdalStartDetailsConatainer">
              <h4>End Depo:</h4>
              <h5>PBA</h5>
            </div>
            <div className="locationMOdalStartDetailsConatainer">
              <h4>End Date:</h4>
              <h5>25/11/2024</h5>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        {/* <Button variant="primary" onClick={handleClose}>
          Save Changes
        </Button> */}
      </Modal.Footer>
    </Modal>
  );
};

export const LocationModalLatAndLong = ({ handleClose, show }) => {
  const position = [9.581778, 76.521126];

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Running Status</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="locaton-map-container">
          <img src="/demo.png" alt="" />
          <div>
            <h4>Current Location:</h4>
            <h5>Kollam</h5>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        {/* <Button variant="primary" onClick={handleClose}>
          Save Changes
        </Button> */}
      </Modal.Footer>
    </Modal>
  );
};
