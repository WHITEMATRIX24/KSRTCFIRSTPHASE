import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog,
  faTrash,
  faCalendar,
  faBus,
  faClock,
  faUser,
  faEllipsisV,
  faL,
} from "@fortawesome/free-solid-svg-icons";
import Header from "../../components/common/Header";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { TextField } from "@mui/material";
import {
  getAllTripApi,
  updateTripApi,
  getAllVehicles,
  getDriversListApi,
  updateTripApiNew,
  updateVehicleStatus,
} from "../../services/allAPI";

export default function OnGoingTrips() {
  const depoList = [
    { code: "ADR", name: "Adoor" },
    { code: "ALP", name: "Alappuzha" },
    { code: "ALY", name: "Aluva" },
    { code: "ANK", name: "Angamaly" },
    { code: "ARD", name: "Aryanad" },
    { code: "ARK", name: "Aryankavu" },
    { code: "ATL", name: "Attingal" },
    { code: "CDM", name: "Chadayamangalam" },
    { code: "CGR", name: "Chengannur" },
    { code: "CHT", name: "Chathannur" },
    { code: "CHY", name: "Changanacherry" },
    { code: "CLD", name: "Chalakudy" },
    { code: "CTL", name: "Cherthala" },
    { code: "CTR", name: "Chittoor" },
    { code: "EDT", name: "Edathuva" },
    { code: "EKM", name: "Ernakulam" },
    { code: "EMY", name: "Erumely" },
    { code: "ETP", name: "Erattupetta" },
    { code: "GVR", name: "Guruvayoor" },
    { code: "HPD", name: "Harippad" },
    { code: "IJK", name: "Irinjalakuda" },
    { code: "KDR", name: "Kodungallur" },
    { code: "KGD", name: "Kasargod" },
    { code: "KHD", name: "Kanhangad" },
    { code: "KKD", name: "Kozhikode" },
    { code: "KKM", name: "Koothattukulam" },
    { code: "KLM", name: "Kollam" },
    { code: "KLP", name: "Kulathupuzha" },
    { code: "KMG", name: "Kothamangalam" },
    { code: "KMR", name: "Kilimanoor" },
    { code: "KMY", name: "Kumily" },
    { code: "KNI", name: "Konni" },
    { code: "KNP", name: "Karunagappally" },
    { code: "KNR", name: "Kannur" },
    { code: "KPM", name: "Kaniyapuram" },
    { code: "KPT", name: "Kalpetta" },
    { code: "KTD", name: "Kattakkada" },
    { code: "KTM", name: "Kottayam" },
    { code: "KTP", name: "Kattappana" },
    { code: "KTR", name: "Kottarakkara" },
    { code: "KYM", name: "Kayamkulam" },
    { code: "MKD", name: "Mannarkkad" },
    { code: "MLA", name: "Mala" },
    { code: "MLP", name: "Malappuram" },
    { code: "MLT", name: "Moolamattom" },
    { code: "MND", name: "Mananthavady" },
    { code: "MNR", name: "Munnar" },
    { code: "MPY", name: "Mallappally" },
    { code: "MVK", name: "Mavelikkara" },
    { code: "MVP", name: "Moovattupuzha" },
    { code: "NBR", name: "Nilambur" },
    { code: "NDD", name: "Nedumangad" },
    { code: "NDM", name: "Nedumkandam" },
    { code: "NPR", name: "North Paravoor" },
    { code: "NTA", name: "Neyyattinkara" },
    { code: "PBR", name: "Perumbavoor" },
    { code: "PDK", name: "Puthukad" },
    { code: "PDM", name: "Pandalam" },
    { code: "PLA", name: "Pala" },
    { code: "PLD", name: "Palode" },
    { code: "PLK", name: "Palakkad" },
    { code: "PLR", name: "Punalur" },
    { code: "PMN", name: "Perinthalmanna" },
    { code: "PNI", name: "Ponnani" },
    { code: "PNK", name: "Ponkunnam" },
    { code: "PNR", name: "Payyannur" },
    { code: "PPD", name: "Pappanamcode" },
    { code: "PPM", name: "Pathanapuram" },
    { code: "PRK", name: "Peroorkada" },
    { code: "PSL", name: "Parassala" },
    { code: "PTA", name: "Pathanamthitta" },
    { code: "PVM", name: "Piravom" },
    { code: "PVR", name: "Poovar" },
    { code: "RNI", name: "Ranni" },
    { code: "SBY", name: "Sulthan Bathery" },
    { code: "TDP", name: "Thodupuzha" },
    { code: "TDY", name: "Thiruvambady" },
    { code: "TLY", name: "Thalassery" },
    { code: "TMY", name: "Thamarasery" },
    { code: "TPM", name: "Thottilpalam" },
    { code: "TSR", name: "Thrissur" },
    { code: "TVL", name: "Thiruvalla" },
    { code: "TVM CL", name: "Thiruvananthapuram Central" },
    { code: "TVM CTY", name: "Thiruvananthapuram City" },
    { code: "TVRA", name: "" },
    { code: "VDA", name: "Vadakara" },
    { code: "VDY", name: "vadakkancherry" },
    { code: "VJD", name: "Venjaramoodu" },
    { code: "VKB", name: "Vikas Bhavan" },
    { code: "VKM", name: "Vaikom" },
    { code: "VLD", name: "" },
    { code: "VLD", name: "" },
    { code: "VRD", name: "Vellarada" },
    { code: "VTR", name: "Vithura" },
    { code: "VZM", name: "Vizhinjam" },
  ];

  //state to store trip data

  const [tripData, setNewTripData] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [modifiedTrips, setModifiedTrips] = useState([]);
  const [drivers, setDrivers] = useState([]);

  //state to store trip colleftion and fuel cost
  const [tripCost, setTripCost] = useState({
    collection: 0,
    Cost: 0,
  });

  //state to validate whether data entered is number
  const [tripCostValidation, setTripCostValidation] = useState({
    collectionValid: false,
  });

  const [vehicleFilter, setVehicleFilter] = useState("");
  const [tripFilter, setTripFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [filteredTrips, setFilteredTrips] = useState([]);
  console.log(modifiedTrips);

  useEffect(() => {
    // Filtered trips based on vehicle number and date
    if (!modifiedTrips) return;
    const filtered = modifiedTrips.filter((trip) => {
      const matchesVehicle =
        trip.BUSNO &&
        trip.BUSNO.toLowerCase().includes(vehicleFilter.toLowerCase());
      // const matchesTrips =
      //   trip.trip_id &&
      //   trip.trip_id.toLowerCase().includes(tripFilter.toLowerCase());
      const matchesDate = dateFilter
        ? trip.startDate && trip.startDate.startsWith(dateFilter)
        : true;
      const liveVehicle =
        trip.status && trip.status.toLowerCase().includes("live");
      console.log({ matchesVehicle, matchesDate, liveVehicle });
      return matchesVehicle && matchesDate && liveVehicle;
    });
    setFilteredTrips([...filtered]);
  }, [modifiedTrips]);

  console.log(`filtered trips: ${filteredTrips}`);

  //modal

  const [show, setShow] = useState(false);
  const [editTrip, seteditTrip] = useState({});
  // State to track the list of input pairs (two separate inputs)
  const [inputPairs, setInputPairs] = useState([]);
  const [fuel, setFuel] = useState([]);
  const [fuelCost, setFuelCost] = useState(0);
  const [outBound, setOutBound] = useState(false);

  /* Function to close modal */
  const handleClose = () => {
    seteditTrip({});
    setInputPairs([]);
    setFuel([]);
    setFuelCost("");
    setShow(false);
  };
  /* Function to open modal */

  const addCollectionModal = (tripEditing) => {
    console.log(tripEditing);

    setShow(true);
    setInputPairs([]);
    setFuel([]);
    setFuelCost(0);
    seteditTrip({
      ...tripEditing,
      fuelCost: "0",
      status: "completed",
      collection_amount: "0",
    });
    /* seteditTrip({
      _id:tripEditing._id,
      vehicle_id: tripEditing.vehicle_id,
    driver_id: tripEditing.driver_id,
    conductor_id:tripEditing.conductor_id,
    start_date:tripEditing.start_date,
    end_date:tripEditing.end_date,
    departure_location: tripEditing.departure_location,
    arrival_location: tripEditing.arrival_location,
    start_time: tripEditing.start_time,
    end_time: tripEditing.end_time,
    status: tripEditing.status,
    distance_traveled:tripEditing.distance_traveled,
    revenue_generated:tripEditing.revenue_generated,
    issues_reported: tripEditing.issues_reported,
    trip_id: tripEditing.trip_id,
    trip_type:tripEditing.trip_type,
    created_at: tripEditing.created_at,
    updated_at: tripEditing.updated_at,
    fuelCost: tripEditing.fuelCost,
    collection_amount:tripEditing.collection_amount
      }) */
    //console.log(editTrip);

    if (tripEditing.trip_type === "outbound") {
      setOutBound(true);
    } else {
      setOutBound(false);
    }
  };

  //function to validate collection amount
  const valiadateCollection = (amount) => {
    setTripCost({ ...tripCost, collection: amount });
    seteditTrip({ ...editTrip, collection_amount: amount });
    setTripCostValidation({ ...tripCostValidation, collectionValid: false });
  };

  /* Function to add input boxes for entering fuel charge */
  const handleButtonClick = () => {
    // Add a new pair of input fields, each with its own state for the values
    setInputPairs([...inputPairs, { liter: "", rate: "", total: "" }]);
  };

  /* Function to save fuel charge */
  const handleInputChange = (index, field, event) => {
    // Update the value of either input1 or input2 for a specific input pair
    const newInputPairs = [...inputPairs];
    let newFuel = fuel;
    let fuelCharge = 0;
    newInputPairs[index][field] = event.target.value;
    newInputPairs[index]["total"] =
      newInputPairs[index]["liter"] * newInputPairs[index]["rate"];
    fuel[index] = newInputPairs[index]["total"];
    setInputPairs(newInputPairs);
    setFuel(newFuel);
    fuelCharge = newFuel.reduce((a, b) => a + b);

    setFuelCost(fuelCharge);
    setTripCost({ ...tripCost, Cost: fuelCost });
    seteditTrip({ ...editTrip, fuelCost: fuelCharge });
  };

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [password, setPassword] = useState("");

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setPassword("");
  };
  const handleOpeneConfirmation = () => {
    console.log("open");

    console.log(editTrip);

    setShowConfirmation(true);
    setShow(false);
    7;
  };
  const ConfirmSave = () => {
    if (password === "1234") {
      UpdateTripDetails();

      handleCloseConfirmation();
    } else {
      alert("Wrong Password");
    }
  };

  /* <<<<<  Cancel  >>>>> */
  const [cancelDepo, setCancelDepo] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [cancelTrip, setCancelTrip] = useState({});

  const [showCancelModal, setShowCancelModal] = useState(false);

  const cancelCollectionModal = (tripEditing) => {
    setCancelTrip(tripEditing);
    handleShowCancelModal();
  };

  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
    setCancelDepo("");
    setCancelReason("");
  };
  const handleShowCancelModal = () => setShowCancelModal(true);

  const handlecancelTrip = async () => {
    if (!cancelDepo || !cancelReason) {
      alert("Fill The Empty Fields");
    } else {
      try {
        const updatedTrip = { ...cancelTrip, status: "failed" };

        const vehicle = vehicles.find(
          (item) => item._id == cancelTrip.vehicle_id
        );
        const updatedVehicle = {
          ...vehicle,
          status: "dock",
          dock_reason: cancelReason,
          dock_depot: cancelDepo.split(" ")[0],
        };

        const result = await updateTripApiNew(
          cancelTrip._id,
          cancelTrip.vehicle_id,
          cancelTrip.driver_id,
          cancelTrip.conductor_id,
          updatedTrip
        );
        //console.log(result)
        const result2 = await updateVehicleStatus(
          updatedVehicle._id,
          updatedVehicle
        );

        if (result.status == 200 && result2.status == 200) {
          handleCloseCancelModal();
        } else {
          alert("Error in Updating Status");
        }

        //console.log(result2);
      } catch (err) {
        console.log("failed to cancel trip", err);
      }
      handleCloseCancelModal();
    }
  };

  const getAllTrips = async () => {
    const result = await getAllTripApi();
    console.log(result.data);

    if (result.status == 200) {
      setNewTripData(result.data);
    } else {
      console.log(result);
    }
  };
  const [busLoading,setBusLoading ] = useState(false)
  const getAllBuses = async () => {
    try {
      
      const result = await getAllVehicles();
      //console.log(result.data);

      if (result.status == 200) {
        setBusLoading(true);
        setVehicles(result.data);
      } else {
        alert("Failed to load Bus Details");
      }
    } catch (err) {
      alert(`Failed to load Bus Details ${err}`);
    }
  };

  const UpdateTripDetails = async () => {
    seteditTrip({ ...editTrip, collection_amount: tripCost.collection });
    seteditTrip({ ...editTrip, fuelCost: tripCost.Cost });
    seteditTrip({ ...editTrip, status: "completed" });
    //api to update trip details
    const result = await updateTripApi(editTrip, editTrip._id);
    // console.log(result);

    if (result.status == 200) {
      handleClose();
      Filter();
    } else {
      alert(result);
    }
  };
  const [loading, setLoading] = useState(false)

  const getAllDriversList = async () => {
    try {
      const result = await getDriversListApi();
      //console.log(result.data);

      if (result.status == 200) {
        setLoading(true)
        setDrivers(result.data);
      } else {
        alert("Failed to load Drivers Details");
      }
    } catch (err) {
      alert(`Failed to load Drivers Details ${err}`);
    }
  };
  useEffect(() => {
    getAllTrips();
    getAllBuses();
    getAllDriversList();
  }, []);
  useEffect(() => {
    if (tripData.length > 0 && vehicles.length > 0 && drivers.length > 0) {
      let arr = tripData.map((item) => ({
        ...item,
        BUSNO: vehicles.find((item2) => item2._id == item.vehicle_id)?.BUSNO,
        EmployeeName: drivers.find((item2) => item2._id == item.driver_id)
          ?.EmployeeName,
      }));
      setModifiedTrips(arr);
    }
  }, [tripData, vehicles, vehicleFilter, dateFilter, tripFilter, drivers]);

  return (
    <div>
      <Header />
      <div className="">
        <Container fluid className="p-4" style={{ backgroundColor: "#f8f9fa" }}>
          <Row className="">
            <Col md={2}></Col>
            <Col md={9}>
              <h1 className=" h5 mb-5">Live Trips</h1>

              {/* Filters */}
              <Row className="mb-3 align-items-center">
                <Col md={3}>
                  <Form.Control
                    type="text"
                    placeholder="Filter by Vehicle"
                    value={vehicleFilter}
                    onChange={(e) => setVehicleFilter(e.target.value)}
                  />
                </Col>

                <Col md={3}>
                  <Form.Control
                    type="date"
                    placeholder="Enter Date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  />
                </Col>
                <Col md={3} className="text-end">
                  <Button
                    variant="link"
                    className="text-muted"
                    onClick={() => {
                      setVehicleFilter("");
                      setDateFilter("");
                    }}
                  >
                    CLEAR
                  </Button>
                </Col>
              </Row>

              <hr className="my-3" />

              {/* Toolbar with count of items */}
              <Row className="align-items-center mb-3">
                {loading && <Col className="text-end">
                  {/* Displaying the count of filtered items */}
                  <span>Total Live Trips:</span>
                  <span className="text-info ms-2 me-5">
                    {filteredTrips.length}
                  </span>
                </Col>}
                {!loading && <Col className="text-end">
                  {/* Displaying the count of filtered items */}
                  <span>Total Live Trips:</span>
                  <span className="text-danger   ms-2 me-5">
                    loading...
                  </span>
                </Col>}

              </Row>

              {/* Table */}

              {loading && busLoading && <div>
                {filteredTrips?.length > 0 && (
                  <Row>
                    <Col>
                      <Table
                        hover
                        responsive
                        className="align-middle"
                        style={{ borderSpacing: "0 10px" }}
                      >
                        <thead>
                          <tr className="bg-light">
                            <th>TRIPID</th>
                            <th>VEHICLE</th>
                            <th>DRIVER</th>
                            <th>START DATE</th>
                            <th>END DATE</th>
                            <th></th>
                            <th></th>
                          </tr>
                        </thead>
  
                        <tbody>
                          {filteredTrips.map((trip) => (
                            <tr key={trip.trip_id} className="bg-white">
                              <td>
                                {trip.trip_id}{" "}
                                <span className="text-primary ms-1">
                                  {trip?.trip_type.toUpperCase()}
                                </span>{" "}
                              </td>
                              <td>
                                <div className="d-flex align-items-center gap-2">
                                  <FontAwesomeIcon
                                    icon={faBus}
                                    className="text-muted me-2"
                                  />
                                  <div>
                                    <div>{trip.BUSNO}</div>
                                    <small className="text-muted">BUS</small>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <FontAwesomeIcon
                                  icon={faUser}
                                  className="text-muted me-2"
                                />
                                {trip.EmployeeName}
                              </td>
  
                              <td>
                                {new Date(trip.start_date).toLocaleDateString()}
                                <br />
                                <small className="text-muted">
                                  {new Date(trip.start_date).toLocaleTimeString()}
                                </small>
                              </td>
                              <td>
                                {new Date(trip.end_date).toLocaleDateString()}
                                <br />
                                <small className="text-muted">
                                  {new Date(trip.end_date).toLocaleTimeString()}
                                </small>
                              </td>
  
                              <td>
                                <button
                                  className="btn btn-outline-success"
                                  onClick={() => addCollectionModal(trip)}
                                >
                                  End Trip
                                </button>
                              </td>
                              <td>
                                <button
                                  className="btn btn-outline-danger"
                                  onClick={() => {
                                    cancelCollectionModal(trip);
                                  }}
                                >
                                  Cancel
                                </button>
                              </td>
                              {/* <td>
                              <Button variant="link" className="p-0">
                                <FontAwesomeIcon className='text-danger' onClick={() => showDeleteModal(trip.id)} icon={faTrash} />
                              </Button>
                            </td> */}
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                )}
                { filteredTrips?.length == 0 && (
                      <h6 className="text-danger text-center m-3">No Live Trips</h6>

                )}
              </div>}
              {!loading   && (
                <h6 className="text-danger text-center m-3">Loading Live Trips... Please Wait</h6>
              )}
            </Col>

            <Col md={1}></Col>
          </Row>
        </Container>

        {/* modal for adding collection details */}
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Collection</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {!outBound && (
              <Form className="m-3">
                <TextField
                  required
                  id="outlined-required"
                  name="collection"
                  label="Collection amount "
                  className="w-100 mb-3"
                  onChange={(e) => {
                    valiadateCollection(e.target.value);
                  }}
                />
                {tripCostValidation.collectionValid && (
                  <p className="text-danger">Please enter valid amount</p>
                )}
                <>
                  <button
                    className="btn btn-outline-warning m-3"
                    onClick={handleButtonClick}
                  >
                    Add Fuel Cost
                  </button>
                  {/* Render each input pair */}
                  {inputPairs.map((pair, index) => (
                    <div
                      key={index}
                      className="d-flex"
                      style={{ marginBottom: "10px" }}
                    >
                      <TextField
                        required
                        id="outlined-required"
                        name="liter"
                        label="Fuel in Liter "
                        className="w-25     me-3"
                        value={pair.input1}
                        onChange={(e) => handleInputChange(index, "liter", e)}
                        placeholder={`Liters`}
                      />

                      <TextField
                        required
                        id="outlined-required"
                        name="liter"
                        label="Fuel Rate "
                        className="w-25     me-3"
                        value={pair.input2}
                        onChange={(e) => handleInputChange(index, "rate", e)}
                        placeholder={`₹ 0`}
                      />

                      <TextField
                        readOnly
                        label="Total "
                        id="outlined-required"
                        name="Total"
                        className="w-25     me-3"
                        value={pair.total}
                        placeholder={`₹ 0`}
                      />
                    </div>
                  ))}
                  <h6 className="text-danger">Total Fuel Cost</h6>
                  <input
                    className="form-control w-100 text-danger fs-3"
                    type="text"
                    value={`₹ ${fuelCost} `}
                    placeholder="₹ 0"
                  />{" "}
                </>
              </Form>
            )}
            {outBound && (
              <div>
                <h5>Do You Want to Add Collection and Fuel Cost Details?</h5>
                <button
                  className="btn btn-outline-success m-3"
                  onClick={() => setOutBound(false)}
                >
                  Yes
                </button>
                <button
                  className=" btn btn-danger"
                  onClick={handleOpeneConfirmation}
                >
                  Save Without Collection{" "}
                </button>{" "}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>

            {!outBound && (
              <div>
                <Button variant="primary" onClick={handleOpeneConfirmation}>
                  Save Changes
                </Button>
              </div>
            )}
          </Modal.Footer>
        </Modal>

        {/* Modal for confirm trip collection a trip */}
        <Modal show={showConfirmation} onHide={handleCloseConfirmation}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Changes</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <TextField
              required
              id="outlined-required"
              name="password"
              label="Enter Password "
              type="password"
              className="w-100 mb-3"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseConfirmation}>
              Close
            </Button>
            <Button variant="danger" onClick={ConfirmSave}>
              Confirm Update
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showCancelModal} onHide={handleCloseCancelModal}>
          <Modal.Header closeButton>
            <Modal.Title>Cancelling Trip</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <label htmlFor="">Reason for cancelling</label>
            <input
              type="text"
              placeholder="Reason"
              className="form-control m-1 mb-3"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />

            <div className="position-relative w-100 p-1">
              <label htmlFor="cancelDepo">Bus Docked At</label>
              <input
                id="cancelDepo"
                type="search"
                className="form-control"
                placeholder="Enter Depo"
                value={cancelDepo}
                onChange={(e) => setCancelDepo(e.target.value)}
              />
              <ul
                className="position-absolute"
                style={{ width: "100%", left: "-30px" }}
              >
                {
                  // Filter depo List

                  depoList
                    .filter((item) => {
                      if (!cancelDepo) return false;
                      const depoLower = cancelDepo.toLowerCase();
                      return (
                        item.code.toLowerCase().includes(depoLower) ||
                        item.name.toLowerCase().includes(depoLower)
                      );
                    })
                    .slice(0, 5)
                    .map((item, index) => (
                      <li
                        key={index}
                        className="form-control pointer"
                        onClick={() =>
                          setCancelDepo(item.code + " " + item.name)
                        }
                      >
                        {item.code} {item.name}
                      </li>
                    ))
                }
              </ul>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseCancelModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handlecancelTrip}>
              Cancel Trip
            </Button>
          </Modal.Footer>
                
        </Modal>
      </div>
    </div>
  );
}
