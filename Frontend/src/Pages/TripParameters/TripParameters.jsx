import React, { useEffect, useState } from "react";
import "./TripParameter.css";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBus,
  faTag,
  faCalendarAlt,
  faClock,
  faRoad,
  faGasPump,
  faL,
  faCircleNotch,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import Header from "../../components/common/Header";
import {
  addTripApi,
  getAllVehicles,
  getConductorsListApi,
  getDriversListApi,
  getVechileByIdVD,
  updateVehicleStatus,
} from "../../services/allAPI";

const TripParameters = () => {
  //for managing depo
  const [startDepo, setStartDepo] = useState("");
  const [endDepo, setEndDepo] = useState("");
  const [returnStartDepo, setRetStartDepo] = useState("");
  const [returnEndDepo, setReturnEndDepo] = useState("");

  //
  const [searchDriver, setsearchDriver] = useState("");
  const [searchConductor, setsearchConductor] = useState("");
  const [searchBus, setsearchBus] = useState("");
  const [loadingCond, setLoadingCond] = useState(false);
  const [loadingDriv, setLoadingDriv] = useState(false);
  const [loadingVeh, setLoadingVeh] = useState(false);

  console.log(loadingCond, loadingDriv, loadingVeh);

  const [vehicle_id, setVehicle_id] = useState("");
  const [outboundTrip, setOutboundTrip] = useState({
    waybill_Number:"",
    vehicle_id: vehicle_id,
    driver_id: "",
    conductor_id: "",
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

  const [returnTrip, setReturnTrip] = useState({
    waybill_Number:"",
    vehicle_id: vehicle_id,
    driver_id: "",
    conductor_id: "",
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
    trip_type: "return",
  });

  const [vehicles, setVehicles] = useState([]);
  const [availableBusOnly, setAvailableBusOnly] = useState(false);
  const [busType, setBusType] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [conductors, setConductors] = useState([]);

  // get all buses
  const getAllBuses = async () => {
    setLoadingVeh(true);
    try {
      const result = await getAllVehicles();
      if (result.status == 200) {
        setVehicles(result.data);
      } else {
        alert("Failed to load Bus Details");
      }
    } catch (err) {
      alert(`Failed to load Bus Details ${err}`);
    }
    setLoadingVeh(false);
  };

  // filter buses based on availablility
  useEffect(() => {
    if (availableBusOnly) {
      setVehicles(vehicles.filter((item) => item.status == "available"));
    } else {
      getAllBuses();
    }
  }, [availableBusOnly]);

  // get All drivers list
  const getAllDriversList = async () => {
    setLoadingDriv(true);
    try {
      const result = await getDriversListApi();
      console.log(result);

      if (result.status == 200) {
        const filteredDrivers = result.data.filter(
          (driver) => driver.on_leave === "Available"
        );
        setDrivers(filteredDrivers);
      } else {
        alert("Failed to load Drivers Details");
      }
    } catch (err) {
      alert(`Failed to load Drivers Details ${err}`);
    }
    setLoadingDriv(false);
  };

  // get All Conductors list
  const getAllConductorsList = async () => {
    setLoadingCond(true);
    try {
      const result = await getConductorsListApi();
      console.log(result);

      if (result.status == 200) {
        const filteredConductors = result.data.filter(
          (conductor) => conductor.on_leave === "Available"
        );
        setConductors(filteredConductors);
      } else {
        alert("Failed to load Conductors Details");
      }
    } catch (err) {
      alert(`Failed to load Conductors Details ${err}`);
    }
    setLoadingCond(false);
  };

  // api calls for fetching data
  useEffect(() => {
    getAllBuses();
    getAllDriversList();
    getAllConductorsList();
  }, []);

  // changes vehicle id in outbound and return trip when vehicle id changes
  useEffect(() => {
    setOutboundTrip({ ...outboundTrip, vehicle_id: vehicle_id });
    setReturnTrip({ ...returnTrip, vehicle_id: vehicle_id });
  }, [vehicle_id]);

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
    // else if (
    //   !checkTimeEntries(
    //     outboundTrip.end_date,
    //     outboundTrip.end_time,
    //     returnTrip.start_date,
    //     returnTrip.start_time
    //   )
    // ) {
    //   return <span className="text-danger">Invalid Time Entry</span>;
    // } else if (
    //   !checkTimeEntries(
    //     returnTrip.start_date,
    //     returnTrip.start_time,
    //     returnTrip.end_date,
    //     returnTrip.end_time
    //   )
    // ) {
    //   return <span className="text-danger">Invalid Time Entry</span>;
    // }
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
    // else if (
    //   !returnTrip.vehicle_id ||
    //   !returnTrip.driver_id ||
    //   !returnTrip.conductor_id ||
    //   !returnTrip.start_date ||
    //   // !returnTrip.end_date ||
    //   !returnTrip.departure_location.depo ||
    //   !returnTrip.arrival_location.depo
    //   // !returnTrip.start_time //||
    //   // !returnTrip.end_time
    // ) {
    //   alert("Fill All Fields");
    //   return;
    // }
    else if (
      !checkTimeEntries(
        outboundTrip.start_date,
        outboundTrip.start_time,
        outboundTrip.end_date,
        outboundTrip.end_time
      ) ||
      !checkTimeEntries(
        outboundTrip.end_date,
        outboundTrip.end_time,
        returnTrip.start_date,
        returnTrip.start_time
      ) ||
      !checkTimeEntries(
        returnTrip.start_date,
        returnTrip.start_time,
        returnTrip.end_date,
        returnTrip.end_time
      ) ||
      !checkTimeEntries(
        outboundTrip.start_date,
        outboundTrip.start_time,
        returnTrip.end_date,
        returnTrip.end_time
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
      // addTripApiFunction({ ...returnTrip, trip_id });
      // hansleupdatevehiclestatus();
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
    setVehicle_id("");
    setOutboundTrip({
      waybill_Number:"",
      vehicle_id: vehicle_id,
      driver_id: "",
      conductor_id: "",
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
    setReturnTrip({
      waybill_Number:"",
      vehicle_id: vehicle_id,
      driver_id: "",
      conductor_id: "",
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
      trip_type: "return",
    });
    setAvailableBusOnly(false);
    setStartDepo("");
    setEndDepo("");
    setsearchBus("");
    setsearchConductor("");
    setVehicle_id("");
    setsearchDriver("");
  };

  const handlechangedriver = (id, searchvalue) => {
    setsearchDriver(searchvalue);
    setOutboundTrip({ ...outboundTrip, driver_id: id });
    setReturnTrip({ ...returnTrip, driver_id: id });
  };
  const handlechangeconductor = (id, searchvalue) => {
    setsearchConductor(searchvalue);
    setOutboundTrip({ ...outboundTrip, conductor_id: id });
    setReturnTrip({ ...returnTrip, conductor_id: id });
  };
  const handlechangebus = (id, searchvalue) => {
    setsearchBus(searchvalue);
    setOutboundTrip({ ...outboundTrip, vehicle_id: id });
    setReturnTrip({ ...returnTrip, vehicle_id: id });
  };

  // const hansleupdatevehiclestatus = async () => {
  //   try {
  //     const timeinms =
  //       checkTimeEntries(
  //         outboundTrip.start_date,
  //         outboundTrip.start_time,
  //         returnTrip.end_date,
  //         returnTrip.end_time
  //       ) /
  //       (1000 * 60 * 60 * 24);

  //     console.log(timeinms);
  //     if (timeinms >= 1) {
  //       console.log(outboundTrip.vehicle_id);

  //       const vehiclestat = vehicles.find(
  //         (item) => item._id == outboundTrip.vehicle_id
  //       );
  //       const newvehiclestat = { ...vehiclestat, status: "en_route" };
  //       const result = await updateVehicleStatus(
  //         outboundTrip.vehicle_id,
  //         newvehiclestat
  //       );
  //       console.log(result);
  //     }
  //   } catch (err) {
  //     console.log("error in updating vehicle status", err);
  //   }
  // };

  useEffect(() => {
    if (conductors) {
      const newConductor = conductors.filter((val) => val.PEN === "G36443");
      console.log(newConductor);
    }
  }, [conductors]);

  return (
    <div>
      {" "}
      <Header />
      <div style={{ backgroundColor: "#f1f1f1", padding: "20px" }}>
        <Container fluid className="TripParameters">
          <Row>
            <Col xs={2}></Col>
            {loadingCond || loadingDriv || loadingVeh ? (
              <Col xs={6} className="mt-3">
                <Card
                  className="shadow-sm border-0 d-flex justify-content-center align-items-center p-5 flex-row"
                  style={{ height: "600px" }}
                >
                  <p>
                    <FontAwesomeIcon
                      icon={faCircleNotch}
                      className="fs-4"
                      spin
                    />
                  </p>
                </Card>
              </Col>
            ) : (
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


                      {/* waybill */}
                      <Form.Label className="mb-1" style={{ fontSize: "14px" }} > WayBill No </Form.Label>
                      


                      <Form.Control className="w-50"
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



                      {/* Outbound Section */}
                      <Form.Group className="mt-4">
                        <h6 className="mb-1">1. Trip Details</h6>

                        {/* <Row className="mt-3">
                        <Col>
                          <Form.Label className="mb-1" style={{ fontSize: "14px" }}>Driver</Form.Label>
                          <Form.Control as="select" value={outboundTrip.driver_id} onChange={(e) => setOutboundTrip({ ...outboundTrip, driver_id: e.target.value })}>
                            <option disabled value={""}>
                              Select Driver
                            </option>
                            {
                              drivers.length > 0 ?
                                drivers.map((item, index) => (
                                  <option key={index} value={item._id}>{item.PEN} {item.EmployeeName}</option>
                                ))
                                : <></>
                            }
                          </Form.Control>
                        </Col>
                        <Col>
                          <Form.Label className="mb-1" style={{ fontSize: "14px" }}>Conductor</Form.Label>
                          <Form.Control as="select" value={outboundTrip.conductor_id} onChange={(e) => setOutboundTrip({ ...outboundTrip, conductor_id: e.target.value })}>
                            <option disabled value="">
                              Select Conductor
                            </option>
                            {
                              conductors.length > 0 ?
                                conductors.map((item, index) => (
                                  <option key={index} value={item._id}>{item.PEN} {item.EmployeeName}</option>
                                ))
                                : <></>
                            }
                          </Form.Control>
                        </Col>
                      </Row> */}

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

                      {
                        // {/* Return Section */}
                        // <Form.Group className="mt-4">
                        //   <h6 className="mb-1">2. Return</h6>
                        //   {/* <Row className="mt-3">
                        //     <Col>
                        //       <Form.Label className="mb-1" style={{ fontSize: "14px" }}>Driver</Form.Label>
                        //       <Form.Control as="select" value={returnTrip.driver_id} onChange={(e) => setReturnTrip({ ...returnTrip, driver_id: e.target.value })}>
                        //         <option disabled value={""}>
                        //           Select Driver
                        //         </option>
                        //         {
                        //           drivers.length > 0 ?
                        //             drivers.map((item, index) => (
                        //               <option key={index} value={item._id}>{item.PEN} {EmployeeName}</option>
                        //             ))
                        //             : <></>
                        //         }
                        //       </Form.Control>
                        //     </Col>
                        //     <Col>
                        //       <Form.Label className="mb-1" style={{ fontSize: "14px" }}>Conductor</Form.Label>
                        //       <Form.Control as="select" value={returnTrip.conductor_id} onChange={(e) => setReturnTrip({ ...returnTrip, conductor_id: e.target.value })}>
                        //         <option disabled value="">
                        //           Select Conductor
                        //         </option>
                        //         {
                        //           conductors.length > 0 ?
                        //             conductors.map((item, index) => (
                        //               <option key={index} value={item._id}>{item.PEN} {item.EmployeeName}</option>
                        //             ))
                        //             : <></>
                        //         }
                        //       </Form.Control>
                        //     </Col>
                        //   </Row> */}
                        //   {/* location  */}
                        //   <Row className="mt-3">
                        //     <Col>
                        //       <Form.Label
                        //         className="mb-1"
                        //         style={{ fontSize: "14px" }}
                        //       >
                        //         Start Depo
                        //       </Form.Label>
                        //       <input
                        //         type="text"
                        //         className="form-control"
                        //         placeholder="Filter By Start Depo"
                        //         value={returnStartDepo}
                        //         onChange={(e) => setRetStartDepo(e.target.value)}
                        //       />
                        //       <ul
                        //         className="position-absolute"
                        //         style={{ width: "45%" }}
                        //       >
                        //         {depoList
                        //           .filter((item) =>
                        //             !returnStartDepo
                        //               ? false
                        //               : item
                        //                   .toLowerCase()
                        //                   .includes(returnStartDepo.toLowerCase())
                        //           )
                        //           .slice(0, 5)
                        //           .map((item, index) => (
                        //             <li
                        //               key={index}
                        //               className="form-control"
                        //               style={{
                        //                 opacity:
                        //                   item === returnStartDepo ? "0" : "1",
                        //               }}
                        //               onClick={() => {
                        //                 setRetStartDepo(item);
                        //                 setReturnTrip({
                        //                   ...returnTrip,
                        //                   departure_location: {
                        //                     ...returnTrip.departure_location,
                        //                     depo: item,
                        //                   },
                        //                 });
                        //               }}
                        //             >
                        //               {item}
                        //             </li>
                        //           ))}
                        //       </ul>
                        //     </Col>
                        //     <Col>
                        //       <Form.Label
                        //         className="mb-1"
                        //         style={{ fontSize: "14px" }}
                        //       >
                        //         End Depo
                        //       </Form.Label>
                        //       <input
                        //         type="text"
                        //         className="form-control"
                        //         placeholder="Filter By End Depo"
                        //         value={returnEndDepo}
                        //         onChange={(e) => setReturnEndDepo(e.target.value)}
                        //       />
                        //       <ul
                        //         className="position-absolute"
                        //         style={{ width: "45%" }}
                        //       >
                        //         {depoList
                        //           .filter((item) =>
                        //             !returnEndDepo
                        //               ? false
                        //               : item
                        //                   .toLowerCase()
                        //                   .includes(returnEndDepo.toLowerCase())
                        //           )
                        //           .slice(0, 5)
                        //           .map((item, index) => (
                        //             <li
                        //               key={index}
                        //               className="form-control"
                        //               style={{
                        //                 opacity: item === returnEndDepo ? "0" : "1",
                        //               }}
                        //               onClick={() => {
                        //                 setReturnEndDepo(item);
                        //                 setReturnTrip({
                        //                   ...returnTrip,
                        //                   arrival_location: {
                        //                     ...returnTrip.arrival_location,
                        //                     depo: item,
                        //                   },
                        //                 });
                        //               }}
                        //             >
                        //               {item}
                        //             </li>
                        //           ))}
                        //       </ul>
                        //     </Col>
                        //   </Row>
                        //   <Row className="mt-3">
                        //     <Col>
                        //       <Form.Label
                        //         className="mb-1"
                        //         style={{ fontSize: "14px" }}
                        //       >
                        //         Start Date
                        //       </Form.Label>
                        //       <Form.Control
                        //         type="date"
                        //         placeholder="Select Date"
                        //         value={returnTrip.start_date}
                        //         onChange={(e) =>
                        //           setReturnTrip({
                        //             ...returnTrip,
                        //             start_date: e.target.value,
                        //           })
                        //         }
                        //       />
                        //     </Col>
                        //     <Col>
                        //       <Form.Label
                        //         className="mb-1"
                        //         style={{ fontSize: "14px" }}
                        //       >
                        //         End Date
                        //       </Form.Label>
                        //       <Form.Control
                        //         type="date"
                        //         placeholder="Select Date"
                        //         value={returnTrip.end_date}
                        //         onChange={(e) =>
                        //           setReturnTrip({
                        //             ...returnTrip,
                        //             end_date: e.target.value,
                        //           })
                        //         }
                        //       />
                        //     </Col>
                        //   </Row>
                        //   <Row className="mt-2">
                        //     <Col>
                        //       <Form.Label
                        //         className="mb-1"
                        //         style={{ fontSize: "14px" }}
                        //       >
                        //         Start Time
                        //       </Form.Label>
                        //       <input
                        //         type="time"
                        //         className="form-control"
                        //         value={returnTrip.start_time}
                        //         onChange={(e) =>
                        //           setReturnTrip({
                        //             ...returnTrip,
                        //             start_time: e.target.value,
                        //           })
                        //         }
                        //       />
                        //     </Col>
                        //     <Col>
                        //       <Form.Label
                        //         className="mb-1"
                        //         style={{ fontSize: "14px" }}
                        //       >
                        //         End Time
                        //       </Form.Label>
                        //       <input
                        //         type="time"
                        //         className="form-control"
                        //         value={returnTrip.end_time}
                        //         onChange={(e) =>
                        //           setReturnTrip({
                        //             ...returnTrip,
                        //             end_time: e.target.value,
                        //           })
                        //         }
                        //       />
                        //     </Col>
                        //   </Row>
                        // </Form.Group>
                      }

                      {/* staff Section */}
                      <Form.Group className="mt-4">
                        <h6 className="mb-1">3. Staff</h6>
                        <Row className="mt-3">
                          <Row className="mt-3">
                            <Col>
                              <Form.Label
                                className="mb-1"
                                style={{ fontSize: "14px" }}
                              >
                                Driver
                              </Form.Label>
                              {/* <Form.Control as="select" value={outboundTrip.driver_id} onChange={(e) => setOutboundTrip({ ...outboundTrip, driver_id: e.target.value })}>
                            <option disabled value={""}>
                              Select Driver
                            </option>
                            {
                              drivers.length > 0 ?
                                drivers.map((item, index) => (
                                  <option key={index} value={item._id}>{item.PEN} {item.EmployeeName}</option>
                                ))
                                : <></>
                            }
                          </Form.Control> */}

                              <input
                                type="text"
                                className="form-control"
                                placeholder="Search GNumber"
                                value={searchDriver}
                                onChange={(e) =>
                                  setsearchDriver(e.target.value)
                                }
                              />


                            {
                              outboundTrip?.driver_id?
                              <div className="mt-1"><FontAwesomeIcon icon={faCircleCheck} className="text-success"/>{drivers.find(item=>item._id==outboundTrip.driver_id).PEN} {drivers.find(item=>item._id==outboundTrip.driver_id).EmployeeName}</div>:
                              <></>
                            }
                              <ul
                                className="position-absolute"
                                style={{ width: "45%" }}
                              >
                                {drivers.length > 0 ? (
                                  drivers
                                    .filter((item) =>
                                      !searchDriver
                                        ? false
                                        : item.PEN.toLowerCase().includes(
                                          searchDriver.toLowerCase()
                                        )
                                    )
                                    // .slice(0, 5)
                                    .map((item, index) => (
                                      <li
                                        key={index}
                                        className="form-control"
                                        style={{
                                          opacity:
                                            item.PEN === drivers.find(item=>item._id==outboundTrip.driver_id)?.PEN
                                              ? "0"
                                              : "1",
                                        }}
                                        onClick={() =>
                                          handlechangedriver(item._id, item.PEN)
                                        }
                                      >
                                        {item.PEN} {item.EmployeeName}
                                      </li>
                                    ))
                                ) : (
                                  <></>
                                )}
                              </ul>
                            </Col>
                            <Col>
                              <Form.Label
                                className="mb-1"
                                style={{ fontSize: "14px" }}
                              >
                                Conductor
                              </Form.Label>
                              {/* <Form.Control as="select" value={outboundTrip.conductor_id} onChange={(e) => setOutboundTrip({ ...outboundTrip, conductor_id: e.target.value })}>
                              <option disabled value="">
                                Select Conductor
                              </option>
                              {
                                conductors.length > 0 ?
                                  conductors.map((item, index) => (
                                    <option key={index} value={item._id}>{item.first_name} {item.last_name}</option>
                                  ))
                                  : <></>
                              }
                            </Form.Control> */}

                              <input
                                type="text"
                                className="form-control"
                                placeholder="Search GNumber"
                                value={searchConductor}
                                onChange={(e) =>
                                  setsearchConductor(e.target.value)
                                }
                              />

                            {
                              outboundTrip?.conductor_id?
                              <div className="mt-1 position-absolute"><FontAwesomeIcon icon={faCircleCheck} className="text-success"/>{conductors.find(item=>item._id==outboundTrip.conductor_id).PEN} {conductors.find(item=>item._id==outboundTrip.conductor_id).EmployeeName}</div>:
                              <></>
                            }



                              <ul
                                className="position-absolute"
                                style={{ width: "45%" }}
                              >
                                {conductors.length > 0 ? (
                                  conductors
                                    .filter((item) =>
                                      !searchConductor
                                        ? false
                                        :item.PEN.toLowerCase().includes(
                                          searchConductor.toLowerCase()
                                        )
                                    )
                                    // .slice(0, 5)
                                    .map((item, index) => (
                                      <li
                                        key={index}
                                        className="form-control"
                                        style={{
                                          opacity:
                                            item.PEN === conductors.find(item=>item._id==outboundTrip.conductor_id)?.PEN
                                              ? "0"
                                              : "1",
                                        }}
                                        onClick={() =>
                                          handlechangeconductor(
                                            item._id,
                                            item.PEN
                                          )
                                        }
                                      >
                                        {item.PEN} {item.EmployeeName}
                                      </li>
                                    ))
                                ) : (
                                  <></>
                                )}
                              </ul>
                            </Col>
                          </Row>
                        </Row>
                      </Form.Group>
                      <Form.Group className="mt-4">
                        <h6 className="mb-1">4. Vehicle</h6>
                        <Row className="mt-3">
                          {/* <Col>
                          <Form.Check type="radio" label="deluxe" name="vehicleType" value={"deluxe"} onChange={(e) => setBusType(e.target.value)} />
                          <Form.Check type="radio" label="super" name="vehicleType" value={"super"} onChange={(e) => setBusType(e.target.value)} />
                          <Form.Check type="radio" label="superfast" name="vehicleType" value={"superfast"} onChange={(e) => setBusType(e.target.value)} />
                        </Col> */}
                          <Col>
                            <Form.Label className="mb-1">
                              Select Vehicle
                            </Form.Label>
                            {/* <Form.Control as="select" value={vehicle_id} onChange={(e) => setVehicle_id(e.target.value)}>
                            <option disabled value="">
                              Select Bus
                            </option>
                            {
                              vehicles.length > 0 ? vehicles
                              // .filter((item) => !busType ? true : item.CLASS == busType)
                              .map((item, index) => (
                                <option key={index} value={item?._id}>{item?.BUSNO}</option>
                              ))
                                : <></>
                            }
                          </Form.Control> */}

                            <input
                              type="text"
                              className="form-control"
                              placeholder="Search Bus"
                              value={searchBus}
                              onChange={(e) => setsearchBus(e.target.value)}
                            />

                            {
                              outboundTrip?.vehicle_id?
                              <div className="mt-1"><FontAwesomeIcon icon={faCircleCheck} className="text-success"/>{vehicles.find(item=>item._id==outboundTrip.vehicle_id).BUSNO} {vehicles.find(item=>item._id==outboundTrip.vehicle_id).CLASS}</div>:
                              <></>
                            }
                            
                            <ul
                              className="position-absolute"
                              style={{ width: "45%" }}
                            >
                              {vehicles.length > 0 ? (
                                vehicles
                                  .filter((item) =>
                                    !availableBusOnly
                                      ? true
                                      : item.status == "in_service"
                                        ? true
                                        : false
                                  )
                                  .filter((item) =>
                                    !searchBus
                                      ? false
                                      : item.BUSNO &&
                                      item.BUSNO.toLowerCase().includes(
                                        searchBus && searchBus.toLowerCase()
                                      )
                                  )
                                  .slice(0, 5)
                                  .map((item, index) => (
                                    <li
                                      key={index}
                                      className="form-control"
                                      style={{
                                        opacity:
                                          item.BUSNO === vehicles.find(item=>item._id==outboundTrip.vehicle_id)?.BUSNO ? "0" : "1",
                                        height:
                                          item.BUSNO === vehicles.find(item=>item._id==outboundTrip.vehicle_id)?.BUSNO ? "0" : "",
                                      }}
                                      onClick={() =>
                                        handlechangebus(item._id, item.BUSNO)
                                      }
                                    >
                                      {item.BUSNO} {item.CLASS}
                                    </li>
                                  ))
                              ) : (
                                <></>
                              )}
                            </ul>

                            {/* <Form.Check
                              type="checkbox"
                              label="Only Available"
                              className="mt-2"
                              checked={availableBusOnly}
                              onChange={(e) =>
                                setAvailableBusOnly(e.target.checked)
                              }
                            /> */}
                          </Col>
                          <Col></Col>
                        </Row>
                      </Form.Group>

                      {/* Action Buttons */}
                      {/* <Row className="mt-4">
                      <Col>
                        <Button variant="outline-secondary" className="w-100" onClick={handleCancel}>Cancel</Button>
                      </Col>
                      <Col>
                        <Button variant="success" className="w-100">Calculate</Button>
                      </Col>
                    </Row> */}
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            )}

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
                    <strong>Trip Time:</strong> {tripDuration()}
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
