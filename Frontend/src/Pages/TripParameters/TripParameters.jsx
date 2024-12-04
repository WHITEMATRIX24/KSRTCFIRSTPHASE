import React, { useEffect, useState } from "react";
import "./TripParameter.css";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBus,
  faTag,
  faCalendarAlt,
  faClock,
  faCircleCheck,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import Header from "../../components/common/Header";
import {
  addTripApi,
  getFilteredConductorsForTripApi,
  getFilteredDCEmployeesForTripApi,
  getFilteredDriversForTripApi,
  getFilteredVehiclesForTripApi,
} from "../../services/allAPI";
import { Autocomplete, TextField } from "@mui/material";



const TripParameters = () => {
  //for managing depo
  const [startDepo, setStartDepo] = useState("");
  const [endDepo, setEndDepo] = useState("");

  //
  const [searchDriver, setsearchDriver] = useState("");
  const [selectedDriver,setselectedDriver]=useState("")
  const [searchConductor, setsearchConductor] = useState("");
  const [selectedConductor, setselectedConductor] = useState("");
  const [searchBus, setsearchBus] = useState("");
  const [selectedBus,setSelectedBus]=useState("")
  const [loadingCond, setLoadingCond] = useState(false);
  const [loadingDriv, setLoadingDriv] = useState(false);
  const [loadingVeh, setLoadingVeh] = useState(false);
  const [outboundTrip, setOutboundTrip] = useState({
    waybill_Number:"",
    duty_Number:"",
    vehicle_id: "",
    driver_id: "",
    driver_type:"",
    conductor_id: "",
    conductor_type:"",
    start_date: "",
    end_date: "",
    departure_location: {
      depo: "",
    },
    arrival_location: {
      depo: "",
    },
    start_time: "",
    end_time: "",
    trip_type: "",
  });

  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [conductors, setConductors] = useState([]);

  // get all buses
  const getAllBuses = async () => {
    setLoadingVeh(true);
    try {
      const result = await getFilteredVehiclesForTripApi(searchBus);
      if (result.status == 200) {
        setVehicles(result.data);
      } else {
        console.log("Failed to load Bus Details");
      }
    } catch (err) {
      console.log(`Failed to load Bus Details ${err}`);
    }
    setLoadingVeh(false);
  };

  useEffect(()=>{
    getAllBuses();
  },[])


  // get All drivers list
  const getAllDriversList = async () => {
    setLoadingDriv(true);
    try {
      const result = await getFilteredDriversForTripApi(searchDriver);
      const result2 = await getFilteredDCEmployeesForTripApi(searchDriver) 

      if (result.status == 200 && result2.status==200) {
        setDrivers([...result.data.map(item=>({...item,driver_type:"drivers"})),...result2.data.map(item=>({...item,driver_type:"dcemployees"}))])      
      } else {
        console.log("Failed to load Drivers Details");
      }
    } catch (err) {
      console.log(`Failed to load Drivers Details ${err}`);
    }
    setLoadingDriv(false);
  };

  useEffect(()=>{
    getAllDriversList()
  },[])

  // get All Conductors list
  const getAllConductorsList = async () => {
    setLoadingCond(true);
    try {
      const result = await getFilteredConductorsForTripApi(searchConductor);
      const result2 = await getFilteredDCEmployeesForTripApi(searchConductor)   

      if (result.status == 200 && result2.status==200) {
        setConductors([...result.data.map(item=>({...item,conductor_type:"conductors"})),...result2.data.map(item=>({...item,conductor_type:"dcemployees"}))])
      } else {
        console.log("Failed to load Conductors Details")
      }
    } catch (err) {
      console.log(`Failed to load Conductors Details ${err}`)
    }
    setLoadingCond(false);
  };

  useEffect(()=>{
    getAllConductorsList()
  },[])
  
  // formats date =>recieve data from date picker and returns formatted date
  function formatDate(dateInput) {
    if (dateInput) {
      const date = new Date(dateInput);
      const options = { year: "numeric", month: "long", day: "numeric" };
      return date.toLocaleDateString("en-US", options);
    } else {
      return "";
    }
  }

  // formats time =>recieve time from time picker and returns formatted time
  function formatTime(timeInput) {
    if (timeInput) {
      const date = new Date(`1970-01-01T${timeInput}:00`);
      const options = { hour: "numeric", minute: "2-digit", hour12: false };
      return date.toLocaleTimeString("en-US", options);
    } else {
      return "";
    }
  }

  //Calculate invalid Time Entry
  const checkTimeEntries = (startDate, startTime, endDate, endTime) => {
    if (!startDate || !startTime || !endDate || !endTime) {
      return true;
    } else {
      const startDateTime = new Date(`${startDate}T${startTime}`);
      const endDateTime = new Date(`${endDate}T${endTime}`);
      const diffInMs = endDateTime - startDateTime;

      if (diffInMs < 0) {
        return false;
      } else {
        return diffInMs;
      }
    }
  };

  // calculate trip duration
  const tripDuration = () => {
    if (
      !checkTimeEntries(
        outboundTrip.start_date,
        outboundTrip.start_time,
        outboundTrip.end_date,
        outboundTrip.end_time
      )
    ) {
      return <span className="text-danger">Invalid Time Entry</span>;
    }
    else {
      const diffInMs = checkTimeEntries(
        outboundTrip.start_date,
        outboundTrip.start_time,
        outboundTrip.end_date,
        outboundTrip.end_time
      );

      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const days = Math.floor(diffInMinutes / (24 * 60));
      const hours = Math.floor((diffInMinutes % (24 * 60)) / 60);
      const minutes = diffInMinutes % 60;

      return days == 0
        ? hours == 0
          ? `${minutes}min`
          : `${hours}h ${minutes}min`
        : `${days}d ${hours}h ${minutes}min`;
    }
  };

  // add trips
  const handleSchedule = async () => {

     if(!outboundTrip.vehicle_id){
      alert("Choose Vehicle")
      return
    }else if(!outboundTrip.driver_id){
      alert("Choose Driver")
      return
    }else if(!outboundTrip.conductor_id){
      alert("Choose Conductor")
      return
    }else if(!outboundTrip.start_date){
      alert("Select Trip Start Date")
      return
    }else if(!outboundTrip.departure_location.depo){
      alert("Select Departure Depot")
      return
    }else if(!outboundTrip.arrival_location.depo){
      alert("Select Arrival Depot")
      return
    }else if(!outboundTrip.start_time){
      alert("Select Trip Start Time")
      return
    }else if(!outboundTrip.trip_type){
      alert("Choose Trip Type Outbound/Return")
      return
    }
    else if (
      !checkTimeEntries(
        outboundTrip.start_date,
        outboundTrip.start_time,
        outboundTrip.end_date,
        outboundTrip.end_time
      )
    ) {
      alert("Invalid Time Entry");
      return;
    } else {
      const numbers = "0123456789";
      const length = 8;
      let trip_id = "#";

      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * numbers.length);
        trip_id += numbers[randomIndex];
      }

      addTripApiFunction({ ...outboundTrip, trip_id });
      handleCancel();
    }
  };


  //////////////////////////////////////////////////////////////////
  // add Trip Api call
  const addTripApiFunction = async (trip) => {
    try {
      const result = await addTripApi(
        trip.vehicle_id,
        trip.driver_id,
        trip.conductor_id,
        trip
      );
      console.log(result);
      

      if (result.status == 201) {
        alert("Trip Successfully Added");
      } else {
        alert("Failed To Add Trip");
      }
    } catch (err) {
      alert(`Failed to Schedule Trip ${err}`);
    }
  };


  
    
    

  // depo collection
  const depoList = [
    "ADR",
    "ALP",
    "ALY",
    "ANK",
    "ARD",
    "ARK",
    "ATL",
    "CDM",
    "CGR",
    "CHT",
    "CHY",
    "CLD",
    "CTL",
    "CTR",
    "EDT",
    "EKM",
    "EMY",
    "ETP",
    "GVR",
    "HPD",
    "IJK",
    "KDR",
    "KGD",
    "KHD",
    "KKD",
    "KKM",
    "KLM",
    "KLP",
    "KMG",
    "KMR",
    "KMY",
    "KNI",
    "KNP",
    "KNR",
    "KPM",
    "KPT",
    "KTD",
    "KTM",
    "KTP",
    "KTR",
    "KYM",
    "MKD",
    "MLA",
    "MLP",
    "MLT",
    "MND",
    "MNR",
    "MPY",
    "MVK",
    "MVP",
    "NBR",
    "NDD",
    "NDM",
    "NPR",
    "NTA",
    "PBA",
    "PBR",
    "PDK",
    "PDM",
    "PLA",
    "PLD",
    "PLK",
    "PLR",
    "PMN",
    "PNI",
    "PNK",
    "PNR",
    "PPD",
    "PPM",
    "PRK",
    "PSL",
    "PTA",
    "PVM",
    "PVR",
    "RNI",
    "SBY",
    "TDP",
    "TDY",
    "TLY",
    "TMY",
    "TPM",
    "TSR",
    "TVL",
    "TVM CL",
    "TVM CTY",
    "TVRA",
    "VDA",
    "VDY",
    "VJD",
    "VKB",
    "VKM",
    "VLD",
    "VRD",
    "VTR",
    "VZM",
  ];

  // clear all fields
  const handleCancel = () => {
    setOutboundTrip({
      waybill_Number:"",
      duty_Number:"",
      vehicle_id: "",
      driver_id: "",
      driver_type:"",
      conductor_id: "",
      conductor_type:"",
      start_date: "",
      end_date: "",
      departure_location: {
        depo: "",
      },
      arrival_location: {
        depo: "",
      },
      start_time: "",
      end_time: "",
      trip_type: "",
    });
    setStartDepo("");
    setEndDepo("");
    setsearchBus("");
    setSelectedBus("")
    setsearchConductor("");
    setselectedConductor('')
    setsearchDriver("");
    setselectedDriver("")
  };

  const handleChangeDriver = (event, newValue) => {
    setselectedDriver(newValue)
    newValue?.id?setOutboundTrip({...outboundTrip,driver_id:newValue.id,driver_type:newValue.type}):setOutboundTrip({...outboundTrip,driver_id:"",driver_type:""})
  }

  const handleChangeConductor = (event, newValue) => {
    setselectedConductor(newValue)
    newValue?.id?setOutboundTrip({...outboundTrip,conductor_id:newValue.id,conductor_type:newValue.type}):setOutboundTrip({...outboundTrip,conductor_id:"",conductor_type:""})
  }

  const handleChangeVehicle = (event, newValue) => {    
    setSelectedBus(newValue)
    newValue?.id?setOutboundTrip({...outboundTrip,vehicle_id:newValue.id}):setOutboundTrip({...outboundTrip,vehicle_id:""})
  }

  useEffect(()=>{
    console.log(outboundTrip);
    
  },[outboundTrip])

  return (
    <div>
      {" "}
      <Header />
      <div style={{ backgroundColor: "#f1f1f1", padding: "20px" }}>
        <Container fluid className="TripParameters">
          <Row>
            <Col xs={2}></Col>
              {
                (loadingCond || loadingDriv || loadingVeh)?
                <Col xs={6} className="mt-3">
                  <Card className="shadow-sm border-0 d-flex justify-content-center align-items-center flex-column p-5 gap-3" style={{height:"50vh"}}>
                    <span className="fw-bold text-info fs-5">Please Hold On...</span>
                    <span className="fs-6">Content is Loading <FontAwesomeIcon icon={faSpinner} spinPulse /></span>
                  </Card>
                </Col>:
                <Col xs={6} className="mt-3">
                <Card className="shadow-sm border-0">
                  <Card.Body>
                    <Card.Title className="d-flex align-items-center">
                      <FontAwesomeIcon
                        icon={faBus}
                        className="me-2 text-primary"
                      />
                      Trip Parameters
                    </Card.Title>

                    <hr className="mb-4 align-hr" />

                    {/* Form Section */}
                    <Form>
                      <Row>
                        <Col>
                          <Form.Label className="mb-1" style={{ fontSize: "14px" }} > WayBill No </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter WayBill Number"
                            value={outboundTrip.waybill_Number}
                            onChange={(e) =>
                              setOutboundTrip({
                                ...outboundTrip,
                                waybill_Number: e.target.value,
                              })
                            }
                          />
                        </Col>
                        <Col>
                          <Form.Label className="mb-1" style={{ fontSize: "14px" }} > Duty No </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Duty Number"
                            value={outboundTrip.duty_Number}
                            onChange={(e) =>
                              setOutboundTrip({
                                ...outboundTrip,
                                duty_Number: e.target.value,
                              })
                            }
                          />
                        </Col>
                      </Row>


                      
                      {/* Outbound Section */}
                      <Form.Group className="mt-4">
                        <h6 className="mb-1">1. Trip Details</h6>


                        {/* location  */}
                        <Row className="mt-3">
                          <Col>
                            <Form.Label
                              className="mb-1"
                              style={{ fontSize: "14px" }}
                            >
                              Start Depo
                            </Form.Label>
                            <div className="postion-relative  w-100 p-1">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Filter By Start Depo"
                                value={startDepo}
                                onChange={(e) => setStartDepo(e.target.value)}
                              />
                              <ul
                                className="position-absolute"
                                style={{ width: "45%" }}
                              >
                                {depoList
                                  .filter((item) =>
                                    !startDepo
                                      ? false
                                      : item
                                        .toLowerCase()
                                        .search(startDepo.toLowerCase()) ===
                                        -1
                                        ? false
                                        : true
                                  )
                                  .slice(0, 5)
                                  .map((item, index) => (
                                    <li
                                      key={index}
                                      className="form-control"
                                      style={{
                                        opacity: item === startDepo ? "0" : "1",
                                      }}
                                      onClick={() => {
                                        setStartDepo(item);
                                        setOutboundTrip({
                                          ...outboundTrip,
                                          departure_location: {
                                            ...outboundTrip.departure_location,
                                            depo: item,
                                          },
                                        });
                                      }}
                                    >
                                      {item}
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          </Col>
                          <Col>
                            <Form.Label
                              className="mb-1"
                              style={{ fontSize: "14px" }}
                            >
                              End Depo
                            </Form.Label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Filter By End Depo"
                              value={endDepo} // Bind the value to the endDepo state
                              onChange={(e) => setEndDepo(e.target.value)} // Use setEndDepo to update the state
                            />
                            <ul
                              className="position-absolute"
                              style={{ width: "45%" }}
                            >
                              {depoList
                                .filter((item) =>
                                  !endDepo
                                    ? false
                                    : item
                                      .toLowerCase()
                                      .search(endDepo.toLowerCase()) === -1
                                      ? false
                                      : true
                                ) // Filter based on endDepo
                                .slice(0, 5)
                                .map((item, index) => (
                                  <li
                                    key={index}
                                    className="form-control"
                                    style={{
                                      opacity: item === endDepo ? "0" : "1",
                                    }} // Hide the item that matches the input value
                                    onClick={() => {
                                      setEndDepo(item);
                                      setOutboundTrip({
                                        ...outboundTrip,
                                        arrival_location: {
                                          ...outboundTrip.arrival_location,
                                          depo: item,
                                        },
                                      });
                                    }}
                                  >
                                    {item}
                                  </li>
                                ))}
                            </ul>
                          </Col>
                        </Row>

                        {/* Date and Time Selection */}
                        <Row className="mt-3">
                          <Col>
                            <Form.Label
                              className="mb-1"
                              style={{ fontSize: "14px" }}
                            >
                              Start Date
                            </Form.Label>
                            <Form.Control
                              type="date"
                              placeholder="Select Date"
                              value={outboundTrip.start_date}
                              onChange={(e) =>
                                setOutboundTrip({
                                  ...outboundTrip,
                                  start_date: e.target.value,
                                })
                              }
                            />
                          </Col>
                          <Col>
                            <Form.Label
                              className="mb-1"
                              style={{ fontSize: "14px" }}
                            >
                              End Date
                            </Form.Label>
                            <Form.Control
                              type="date"
                              placeholder="Select Date"
                              value={outboundTrip.end_date}
                              onChange={(e) =>
                                setOutboundTrip({
                                  ...outboundTrip,
                                  end_date: e.target.value,
                                })
                              }
                            />
                          </Col>
                        </Row>
                        <Row className="mt-2">
                          <Col>
                            <Form.Label
                              className="mb-1"
                              style={{ fontSize: "14px" }}
                            >
                              Start Time
                            </Form.Label>
                            <input
                              type="time"
                              className="form-control"
                              value={outboundTrip.start_time}
                              onChange={(e) =>
                                setOutboundTrip({
                                  ...outboundTrip,
                                  start_time: e.target.value,
                                })
                              }
                            />
                          </Col>
                          <Col>
                            <Form.Label
                              className="mb-1"
                              style={{ fontSize: "14px" }}
                            >
                              End Time
                            </Form.Label>
                            <input
                              type="time"
                              className="form-control"
                              value={outboundTrip.end_time}
                              onChange={(e) =>
                                setOutboundTrip({
                                  ...outboundTrip,
                                  end_time: e.target.value,
                                })
                              }
                            />
                          </Col>
                        </Row>
                        <Row className="mt-2">
                          <Col>
                            <Form.Label
                              className="mb-1"
                              style={{ fontSize: "14px" }}
                            >
                              Outbound/Return Trip
                            </Form.Label>
                            <select
                              name=""
                              id=""
                              className="form-control"
                              value={outboundTrip.trip_type}
                              onChange={(e) =>
                                setOutboundTrip({
                                  ...outboundTrip,
                                  trip_type: e.target.value,
                                })
                              }
                            >
                              <option
                                value=""
                                disabled
                                className="form-control"
                              >
                                Select Trip
                              </option>
                              <option value="outbound">Outbound Trip</option>
                              <option value="return">Return Trip</option>
                            </select>
                          </Col>
                          <Col></Col>
                        </Row>
                      </Form.Group>

                     

                      {/* staff Section */}
                      <Form.Group className="mt-4">
                        <h6 className="mb-1 mt-5">3. Staff</h6>
                        <Row>
                          <Row className="mt-3">
                            <Col>
                              {/* <Form.Label
                                className="mb-1"
                                style={{ fontSize: "14px" }}
                              >
                                Driver
                              </Form.Label> */}
                              <Autocomplete
                                className="mt-1"
                                value={selectedDriver}
                                inputValue={searchDriver}
                                onInputChange={(event, newInputValue) =>setsearchDriver(newInputValue)}
                                onChange={handleChangeDriver}
                                options={drivers.map(item=>({ label: item.PEN+" "+item.EmployeeName, value: item.PEN, id:item._id, type:item.driver_type }))}
                                getOptionLabel={(option) => (option?.value ? option.value : "")}
                                renderInput={(params) => <TextField {...params} label="Choose Driver" />}
                              />
                              {
                                selectedDriver?
                                <div className="mt-1 position-absolute"><FontAwesomeIcon icon={faCircleCheck} className="text-success"/>{selectedDriver?.label}</div>
                                :<></>
                              }
                            </Col>
                            <Col>
                              {/* <Form.Label
                                className="mb-1"
                                style={{ fontSize: "14px" }}
                              >
                                Conductor
                              </Form.Label> */}
                              <Autocomplete
                                className="mt-1"
                                value={selectedConductor}
                                inputValue={searchConductor}
                                onInputChange={(event, newInputValue) =>setsearchConductor(newInputValue)}
                                onChange={handleChangeConductor}
                                options={conductors.map(item=>({ label: item.PEN+" "+item.EmployeeName, value: item.PEN, id:item._id, type:item.conductor_type }))}
                                getOptionLabel={(option) => (option?.value ? option.value : "")}
                                renderInput={(params) => <TextField {...params} label="Choose Conductor" />}
                              />
                              {
                                selectedConductor?
                                <div className="mt-1 position-absolute"><FontAwesomeIcon icon={faCircleCheck} className="text-success"/>{selectedConductor?.label}</div>
                                :<></>
                              }
                            </Col>
          
                          </Row>
                        </Row>
                      </Form.Group>
                      <Form.Group className="mt-4">
                        <h6 className="mb-1 mt-5">4. Vehicle</h6>
                        <Row className="mt-3">
                          <Col>
                            {/* <Form.Label className="mb-1">
                              Vehicle
                            </Form.Label> */}
                            <Autocomplete
                              className="mt-1"
                              value={selectedBus}
                              inputValue={searchBus}
                              onInputChange={(event, newInputValue) =>setsearchBus(newInputValue)}
                              onChange={handleChangeVehicle}
                              options={vehicles.map(item=>({ label: item.BUSNO+" "+item.CLASS, value: item.BUSNO, id:item._id }))}
                              getOptionLabel={(option) => (option?.value ? option.value : "")}
                              renderInput={(params) => <TextField {...params} label="Choose Vehicle" />}
                            />
                            {
                              selectedBus?
                              <div className="mt-1"><FontAwesomeIcon icon={faCircleCheck} className="text-success"/>{selectedBus?.label}</div>
                              :<></>
                            }
                          </Col>
                          <Col>

                          </Col>
                        </Row>
                      </Form.Group>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
              }
            {/* Trip Cost Sidebar */}
            <Col xs={3} className="mt-3">
              <Card className="trip-cost-card shadow-sm border-0 p-0">
                <Card.Body>
                  <Card.Title className="d-flex align-items-center">
                    <FontAwesomeIcon
                      icon={faTag}
                      className="me-2 text-secondary"
                    />
                    <span>Trip Cost</span>
                  </Card.Title>

                  <hr className="mb-4 align-hr" />

                  <p>
                    <FontAwesomeIcon icon={faCalendarAlt} />{" "}
                    <strong>Dates:</strong>{" "}
                    {`${formatDate(outboundTrip.start_date)}`}{" "}
                    {`${formatTime(outboundTrip.start_time)}`} -{" "}
                    {`${formatDate(outboundTrip.end_date)}`}{" "}
                    {`${formatTime(outboundTrip.end_time)}`}
                  </p>
                  <p>
                    <FontAwesomeIcon icon={faClock} />{" "}
                    <strong>Trip Duration:</strong> {tripDuration()}
                  </p>
                  {/* <p><FontAwesomeIcon icon={faRoad} /> <strong>Distance:</strong> 4,239mi</p>
                  <p><FontAwesomeIcon icon={faGasPump} /> <strong>Fuel Consumption:</strong> 6.15 MPG</p> */}

                  <hr />
                  {/* <h5 className="text-muted">Approx. Cost <span className="text-success total-cost ms-5">INR: 1,241.14</span></h5> */}

                  <Row className="mt-2">
                    <Col>
                      <Button
                        variant="outline-secondary"
                        className="w-100"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                    </Col>
                    <Col>
                      <Button
                        variant="success"
                        className="w-100"
                        onClick={handleSchedule}
                      >
                        Schedule Trip
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={1}></Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default TripParameters;
