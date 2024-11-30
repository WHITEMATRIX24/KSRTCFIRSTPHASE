import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import {
  searchCounductorDriverVehicle,
  updateTripApiNew,
} from "../services/allAPI";
import { grey } from "@mui/material/colors";
import { toast } from "react-toastify";

const ScheduleTripEditModal = ({ show, handleClose, tripData, refreshApi }) => {
  if (!tripData) return;
  const [tripDataToEdit, setTripDataToEdit] = useState({
    waybill_Number: tripData.waybill_Number || "",
    trip_type: tripData.trip_type || "",
    vehicleNo: tripData.vechileDetails.BUSNO || "",
    driverPen: tripData.driverDetails.PEN || "",
    conductorPen: tripData.conductorDetails.PEN || "",
    startDate: tripData.start_date || "",
    endDate: tripData.end_date || "",
    vehicle_id: tripData.vehicle_id || "",
    conductor_id: tripData.conductor_id || "",
    driver_id: tripData.driver_id || "",
    conductorName: tripData.conductorDetails.EmployeeName || "",
    driverName: tripData.driverDetails.EmployeeName || "",
  });
  const [searchData, setSearchData] = useState({
    vehicle: [],
    driver: [],
    conductor: [],
  });
  const [hasInteracted, setHasInteracted] = useState({
    vehicle: false,
    conductor: false,
    driver: false,
  });
  const [editIsLoading, setEditIsLoading] = useState(false);

  //   convert date from string to iso
  const convertDateStringToIso = (dateString, keyName) => {
    const newDate = new Date(dateString).toISOString();
    setTripDataToEdit({ ...tripDataToEdit, [keyName]: newDate });
  };
  // console.log(tripDataToEdit);

  //   api handler for searching counductor, driver and vehicle
  const handleSearchApi = async (
    searchVehicleData,
    searchConductorData,
    searchDriverData
  ) => {
    const response = await searchCounductorDriverVehicle(
      searchVehicleData,
      searchDriverData,
      searchConductorData
    );
    if (response.status != 200) return;

    setSearchData({
      vehicle: [...response.data.allSearchedData.allVehicleData],
      driver: [...response.data.allSearchedData.allDriverData],
      conductor: [...response.data.allSearchedData.allConductor],
    });
  };

  const handleVehicleSelect = (vehicleValue) => {
    setHasInteracted({ ...hasInteracted, vehicle: false });
    setTripDataToEdit({
      ...tripDataToEdit,
      vehicle_id: vehicleValue._id,
      vehicleNo: vehicleValue.BUSNO,
    });
  };

  const handleDriverSelect = (driverValue) => {
    setHasInteracted({ ...hasInteracted, driver: false });
    setTripDataToEdit({
      ...tripDataToEdit,
      driver_id: driverValue._id,
      driverPen: driverValue.PEN,
      driverName: driverValue.EmployeeName,
    });
  };

  const handleConductorSelect = (conductorValue) => {
    setHasInteracted({ ...hasInteracted, conductor: false });
    setTripDataToEdit({
      ...tripDataToEdit,
      conductor_id: conductorValue._id,
      conductorPen: conductorValue.PEN,
      conductorName: conductorValue.EmployeeName,
    });
  };

  const handleEditSubmit = async () => {
    try {
      const {
        waybill_Number,
        vehicle_id,
        driver_id,
        conductor_id,
        startDate,
        endDate,
      } = tripDataToEdit;

      if (!vehicle_id || !driver_id || !conductor_id || !startDate) {
        return alert("fill the form completly");
      }
      setEditIsLoading(true);

      const editTripDetailsToSend = {
        waybill_Number,
        start_date: startDate,
        end_date: endDate,
        start_time: tripData.start_time,
        end_time: tripData.end_time,
        status: tripData.status,
        departure_location: tripData.departure_location,
        arrival_location: tripData.arrival_location,
      };

      const response = await updateTripApiNew(
        tripData._id,
        vehicle_id,
        driver_id,
        conductor_id,
        editTripDetailsToSend
      );

      if (response.status != 200) {
        return toast.error("error in editing the trip");
      }
      toast.success("trip edit successfull");
      refreshApi();
      handleClose();
    } catch (error) {
      console.log(`error in submitting edited tripDetails error: ${error}`);
    } finally {
      setEditIsLoading(false);
    }
  };

  useEffect(() => {
    if (
      hasInteracted.conductor ||
      hasInteracted.driver ||
      hasInteracted.vehicle
    ) {
      handleSearchApi(
        tripDataToEdit.vehicleNo,
        tripDataToEdit.conductorPen,
        tripDataToEdit.driverPen
      );
    }
  }, [
    tripDataToEdit.vehicleNo,
    tripDataToEdit.conductorPen,
    tripDataToEdit.driverPen,
    hasInteracted.conductor,
    hasInteracted.driver,
    hasInteracted.vehicle,
  ]);

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column gap-4 w-full ">
            <div className="d-flex gap-3">
              <div>
                <p className="mb-1">Waybill</p>
                <input
                  type="text"
                  className="form-control"
                  placeholder="waybill"
                  value={tripDataToEdit.waybill_Number}
                  onChange={(e) =>
                    setTripDataToEdit({
                      ...tripDataToEdit,
                      waybill_Number: e.target.value,
                    })
                  }
                />
              </div>
              {/* <div>
                <p className="mb-1">Trip Type</p>
                <select
                  className="form-control"
                  placeholder="Trip type"
                  value={tripDataToEdit.trip_type}
                  onChange={(e) =>
                    setTripDataToEdit({
                      ...tripDataToEdit,
                      trip_type: e.target.value,
                    })
                  }
                >
                  <option value="return">Return</option>
                  <option value="outbound">Outbound</option>
                </select>
              </div> */}
            </div>
            <div className="d-flex gap-3">
              <div className="position-relative">
                <p className="mb-1">Vehicle</p>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Vehicle"
                  value={tripDataToEdit.vehicleNo}
                  onChange={(e) => {
                    setTripDataToEdit({
                      ...tripDataToEdit,
                      vehicleNo: e.target.value,
                    });
                    setHasInteracted({ ...hasInteracted, vehicle: true });
                  }}
                />
                {searchData.vehicle && hasInteracted.vehicle && (
                  <div
                    className="position-absolute d-flex flex-column gap-1 py-2 overflow-y-scroll"
                    style={{
                      backgroundColor: "white",
                      height: "10rem",
                      width: "100%",
                    }}
                  >
                    {searchData.vehicle.length > 0 &&
                      searchData.vehicle.map((vehicle, index) => (
                        <p
                          key={index}
                          className="mb-0 py-2"
                          style={{
                            cursor: "pointer",
                            backgroundColor: "#ebe8e8",
                          }}
                          onClick={() => handleVehicleSelect(vehicle)}
                        >
                          {vehicle.BUSNO}
                        </p>
                      ))}
                  </div>
                )}
              </div>
              <div>
                <p className="mb-1">Driver</p>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Driver"
                  value={tripDataToEdit.driverPen}
                  onChange={(e) => {
                    setTripDataToEdit({
                      ...tripDataToEdit,
                      driverPen: e.target.value,
                    });
                    setHasInteracted({ ...hasInteracted, driver: true });
                  }}
                />
                {searchData.driver && hasInteracted.driver && (
                  <div
                    className="position-absolute d-flex flex-column gap-1 py-2 overflow-y-scroll"
                    style={{
                      backgroundColor: "white",
                      height: "10rem",
                      width: "100%",
                    }}
                  >
                    {searchData.driver.length > 0 &&
                      searchData.driver.map((driver, index) => (
                        <p
                          key={index}
                          className="mb-0 py-2"
                          style={{
                            cursor: "pointer",
                            backgroundColor: "#ebe8e8",
                          }}
                          onClick={() => handleDriverSelect(driver)}
                        >
                          {driver.PEN}
                        </p>
                      ))}
                  </div>
                )}
                <p>{tripDataToEdit.driverName}</p>
              </div>
            </div>
            <div className="d-flex gap-3">
              <div>
                <p className="mb-1">Conductor</p>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Conductor"
                  value={tripDataToEdit.conductorPen}
                  onChange={(e) => {
                    setTripDataToEdit({
                      ...tripDataToEdit,
                      conductorPen: e.target.value,
                    });
                    setHasInteracted({ ...hasInteracted, conductor: true });
                  }}
                />
                {searchData.conductor && hasInteracted.conductor && (
                  <div
                    className="position-absolute d-flex flex-column gap-1 py-2 overflow-y-scroll"
                    style={{
                      backgroundColor: "white",
                      height: "10rem",
                      width: "100%",
                    }}
                  >
                    {searchData.conductor.length > 0 &&
                      searchData.conductor.map((conductor, index) => (
                        <p
                          key={index}
                          className="mb-0 py-2"
                          style={{
                            cursor: "pointer",
                            backgroundColor: "#ebe8e8",
                          }}
                          onClick={() => handleConductorSelect(conductor)}
                        >
                          {conductor.PEN}
                        </p>
                      ))}
                  </div>
                )}
                <p>{tripDataToEdit.conductorName}</p>
              </div>
              <div>
                <p className="mb-1">Start Date</p>
                <input
                  type="date"
                  className="form-control"
                  placeholder="Start Date"
                  value={tripDataToEdit.startDate.split("T")[0]}
                  onChange={(e) =>
                    convertDateStringToIso(e.target.value, "startDate")
                  }
                />
              </div>
            </div>
            <div className="d-flex gap-3">
              <div>
                <p className="mb-1">End Date</p>
                <input
                  type="date"
                  className="form-control"
                  placeholder="End Date"
                  value={tripDataToEdit.endDate.split("T")[0]}
                  onChange={(e) =>
                    convertDateStringToIso(e.target.value, "endDate")
                  }
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={editIsLoading}
            onClick={handleEditSubmit}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ScheduleTripEditModal;
