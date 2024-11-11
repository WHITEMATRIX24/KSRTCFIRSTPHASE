import React, { useEffect, useState } from 'react';
import './TripParameter.css';
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBus, faTag, faCalendarAlt, faClock, faRoad, faGasPump, faL } from "@fortawesome/free-solid-svg-icons";
import Header from '../../components/common/Header';
import { addTripApi, getAllVehicles, getConductorsListApi, getDriversListApi } from '../../services/allAPI';

const TripParameters = () => {
  const [vehicle_id,setVehicle_id]=useState("")
  const [outboundTrip,setOutboundTrip]=useState({
    vehicle_id:vehicle_id,
    driver_id:"",
    conductor_id:"",
    start_date:"",
    end_date:"",
    departure_location:{
      city:"",
      address:"",
      lat:"",
      lon:""
    },
    arrival_location:{
      city:"",
      address:"",
      lat:"",
      lon:""
    },
    start_time:"",
    end_time:"",
    trip_type:"outbound"
  })

  const [returnTrip,setReturnTrip]=useState({
    vehicle_id:vehicle_id,
    driver_id:"",
    conductor_id:"",
    start_date:"",
    end_date:"",
    departure_location:{
      city:"",
      address:"",
      lat:"",
      lon:""
    },
    arrival_location:{
      city:"",
      address:"",
      lat:"",
      lon:""
    },
    start_time:"",
    end_time:"",
    trip_type:"return"
  })

  const[vehicles,setVehicles]=useState([])
  const[availableBusOnly,setAvailableBusOnly]=useState(false)
  const[busType,setBusType]=useState("")
  const[drivers,setDrivers]=useState([])
  const[conductors,setConductors]=useState([])
  const[locations,setLocations]=useState([])

  // get all buses
  const getAllBuses = async()=>{
    try{
      const result = await getAllVehicles()
      if(result.status==200){
        setVehicles(result.data)
      }else{
        alert("Failed to load Bus Details")
      }
    }catch(err){
      alert(`Failed to load Bus Details ${err}`)
    }
  }

  // filter buses based on availablility
  useEffect(()=>{
    if(availableBusOnly){
      setVehicles(vehicles.filter(item=>item.status=="available"))
    }else{
      getAllBuses()
    }
  },[availableBusOnly])


  // get All drivers list
  const getAllDriversList = async () =>{
    try{
      const result = await getDriversListApi()
      if(result.status==200){
        setDrivers(result.data)        
      }else{
        alert("Failed to load Drivers Details")
      }
    }catch(err){
      alert(`Failed to load Drivers Details ${err}`)
    }
  }


  // get All Conductors list
  const getAllConductorsList = async () =>{
    try{
      const result = await getConductorsListApi()
      if(result.status==200){
        setConductors(result.data)        
      }else{
        alert("Failed to load Conductors Details")
      }
    }catch(err){
      alert(`Failed to load Conductors Details ${err}`)
    }
  }

  // api calls for fetching data
  useEffect(()=>{
    getAllBuses()
    getAllDriversList()
    getAllConductorsList()
  },[])
  


 // changes vehicle id in outbound and return trip when vehicle id changes
  useEffect(()=>{
    setOutboundTrip({...outboundTrip,vehicle_id:vehicle_id})
    setReturnTrip({...returnTrip,vehicle_id:vehicle_id})
  },[vehicle_id])


  // formats date =>recieve data from date picker and returns formatted date
  function formatDate(dateInput) {
    if(dateInput){
      const date = new Date(dateInput);  
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('en-US', options)
    }else{
      return ""
    }
  }


 // formats time =>recieve time from time picker and returns formatted time
  function formatTime(timeInput) {
    if(timeInput){
      const date = new Date(`1970-01-01T${timeInput}:00`)
      const options = { hour: 'numeric', minute: '2-digit', hour12: true };
      return date.toLocaleTimeString('en-US', options);
    }else{
      return ""
    }
  }

  //Calculate invalid Time Entry
  const checkTimeEntries=(startDate,startTime,endDate,endTime)=>{
      if(!startDate || !startTime || !endDate || !endTime){
        return true
      }else{
        const startDateTime = new Date(`${startDate}T${startTime}`)
        const endDateTime = new Date(`${endDate}T${endTime}`)
        const diffInMs = endDateTime - startDateTime
        
        if(diffInMs<0){
          return false
        }else{
          return diffInMs
        }
      }
  }

  // calculate trip duration
  const tripDuration=()=>{
      if(!checkTimeEntries(outboundTrip.start_date,outboundTrip.start_time,outboundTrip.end_date,outboundTrip.end_time)){
        return <span className='text-danger'>Invalid Time Entry</span>
      }else if(!checkTimeEntries(outboundTrip.end_date,outboundTrip.end_time,returnTrip.start_date,returnTrip.start_time)){
        return <span className='text-danger'>Invalid Time Entry</span>
      }
      else if(!checkTimeEntries(returnTrip.start_date,returnTrip.start_time,returnTrip.end_date,returnTrip.end_time)){
        return <span className='text-danger'>Invalid Time Entry</span>
      }else{
        const diffInMs = checkTimeEntries(outboundTrip.start_date,outboundTrip.start_time,returnTrip.end_date,returnTrip.end_time)

        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const days = Math.floor(diffInMinutes / (24 * 60));
        const hours = Math.floor((diffInMinutes % (24 * 60)) / 60);
        const minutes = diffInMinutes % 60;

      return days==0?hours==0?`${minutes}min`:`${hours}h ${minutes}min`:`${days}d ${hours}h ${minutes}min`
      }
  }


  // add trips
  const handleSchedule = async () => {
    if(!outboundTrip.vehicle_id || !outboundTrip.driver_id || !outboundTrip.conductor_id || !outboundTrip.start_date || !outboundTrip.end_date || !outboundTrip.departure_location.city || !outboundTrip.arrival_location.city || !outboundTrip.start_time || !outboundTrip.end_time){
      alert("Fill All Fields")
    }else if(!returnTrip.vehicle_id || !returnTrip.driver_id || !returnTrip.conductor_id || !returnTrip.start_date || !returnTrip.end_date || !returnTrip.departure_location.city || !returnTrip.arrival_location.city || !returnTrip.start_time || !returnTrip.end_time){
      alert("Fill All Fields")
    }else if(
      !checkTimeEntries(outboundTrip.start_date,outboundTrip.start_time,outboundTrip.end_date,outboundTrip.end_time) ||
      !checkTimeEntries(outboundTrip.end_date,outboundTrip.end_time,returnTrip.start_date,returnTrip.start_time) ||
      !checkTimeEntries(returnTrip.start_date,returnTrip.start_time,returnTrip.end_date,returnTrip.end_time) ||
      !checkTimeEntries(outboundTrip.start_date,outboundTrip.start_time,returnTrip.end_date,returnTrip.end_time)
      ){
        alert("Invalid Time Entry")
    }
    else{

      const numbers = "0123456789";
      const length = 8
      let trip_id = "#";

      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * numbers.length);
        trip_id += numbers[randomIndex];
      }

      addTripApiFunction({...outboundTrip,trip_id})
      addTripApiFunction({...returnTrip,trip_id})
      handleCancel()
    }
  }

  // add Trip Api call
  const addTripApiFunction = async (trip) =>{
    try{
      const result = await addTripApi(trip.vehicle_id,trip.driver_id,trip.conductor_id,trip)
      console.log(result);
      
      if(result.status==201){
        alert("Trip Successfully Added")
      }else{
        alert("Failed To Add Trip")
      }
    }catch(err){
      alert(`Failed to Schedule Trip ${err}`)
    }
  }

// clear all fields
const handleCancel = () => {
  setVehicle_id("")
  setOutboundTrip({
    vehicle_id:vehicle_id,
    driver_id:"",
    conductor_id:"",
    start_date:"",
    end_date:"",
    departure_location:{
      city:"",
      address:"",
      lat:"",
      lon:""
    },
    arrival_location:{
      city:"",
      address:"",
      lat:"",
      lon:""
    },
    start_time:"",
    end_time:"",
    trip_type:"outbound"
  })
  setReturnTrip({
    vehicle_id:vehicle_id,
    driver_id:"",
    conductor_id:"",
    start_date:"",
    end_date:"",
    departure_location:{
      city:"",
      address:"",
      lat:"",
      lon:""
    },
    arrival_location:{
      city:"",
      address:"",
      lat:"",
      lon:""
    },
    start_time:"",
    end_time:"",
    trip_type:"return"
  })
  setAvailableBusOnly(false)
  setBusType("")
}


  return (
    <div> <Header />
      <div style={{ backgroundColor: "#f1f1f1", padding: "20px" }}>

        <Container fluid className='TripParameters'>
          <Row>
            <Col xs={2}>
            </Col>
            <Col xs={6} className='mt-3'>
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <Card.Title className="d-flex align-items-center">
                    <FontAwesomeIcon icon={faBus} className="me-2 text-primary" />
                    Trip Parameters
                  </Card.Title>

                  <hr className="mb-4 align-hr" />

                  {/* Form Section */}
                  <Form>
                    {/* Outbound Section */}
                    <Form.Group className="mt-4">
                      <h6 className="mb-1">1. Outbound</h6>

                      <Row className="mt-3">
                        <Col>
                          <Form.Label className="mb-1" style={{ fontSize: "14px" }}>Driver</Form.Label>
                          <Form.Control as="select"  value={outboundTrip.driver_id} onChange={(e)=>setOutboundTrip({...outboundTrip,driver_id:e.target.value})}>
                            <option disabled value={""}>
                              Select Driver
                            </option>
                            {
                              drivers.length>0?
                              drivers.map((item,index)=>(
                                <option key={index} value={item._id}>{item.first_name} {item.last_name}</option>
                              ))
                              :<></>
                            }
                          </Form.Control>
                        </Col>
                        <Col>
                          <Form.Label className="mb-1" style={{ fontSize: "14px" }}>Conductor</Form.Label>
                          <Form.Control as="select"  value={outboundTrip.conductor_id} onChange={(e)=>setOutboundTrip({...outboundTrip,conductor_id:e.target.value})}>
                            <option disabled value="">
                              Select Conductor
                            </option>
                            {
                              conductors.length>0?
                              conductors.map((item,index)=>(
                                <option key={index} value={item._id}>{item.first_name} {item.last_name}</option>
                              ))
                              :<></>
                            }
                          </Form.Control>
                        </Col>
                      </Row>

                      {/* location  */}
                      <Row className="mt-3">
                        <Col>
                          <Form.Label className="mb-1" style={{ fontSize: "14px" }}>Start Location</Form.Label>
                          <Form.Control as="select" value={outboundTrip.departure_location.city} onChange={(e)=>setOutboundTrip({...outboundTrip,departure_location:{...outboundTrip.departure_location,city:e.target.value}})}>
                            <option disabled value="">
                              Select Location
                            </option>
                            <option value={'loc1'}>Location 1</option>
                            <option value={'loc2'}>Location 2</option>
                            <option value={'loc3'}>Location 3</option>
                          </Form.Control>
                        </Col>
                        <Col>
                          <Form.Label className="mb-1" style={{ fontSize: "14px" }}>End Location</Form.Label>
                          <Form.Control as="select" value={outboundTrip.arrival_location.city} onChange={(e)=>setOutboundTrip({...outboundTrip,arrival_location:{...outboundTrip.arrival_location,city:e.target.value}})}>
                            <option disabled value="">
                              Select Location
                            </option>
                            <option value={'loc1'}>Location 1</option>
                            <option value={'loc2'}>Location 2</option>
                            <option value={'loc3'}>Location 3</option>
                          </Form.Control>
                        </Col>
                      </Row>

                      {/* Date and Time Selection */}
                      <Row className='mt-3'>
                        <Col>
                          <Form.Label className="mb-1" style={{ fontSize: "14px" }}>Start Date</Form.Label>
                          <Form.Control type="date" placeholder="Select Date" value={outboundTrip.start_date} onChange={(e)=>setOutboundTrip({...outboundTrip,start_date:e.target.value})} />
                        </Col>
                        <Col>
                          <Form.Label className="mb-1" style={{ fontSize: "14px" }}>End Date</Form.Label>
                          <Form.Control type="date" placeholder="Select Date" value={outboundTrip.end_date} onChange={(e)=>setOutboundTrip({...outboundTrip,end_date:e.target.value})}/>
                        </Col>
                      </Row>
                      <Row className="mt-2">
                        <Col>
                          <Form.Label className="mb-1" style={{ fontSize: "14px" }}>Start Time</Form.Label>
                          <input type="time" className='form-control' value={outboundTrip.start_time} onChange={(e)=>setOutboundTrip({...outboundTrip,start_time:e.target.value})}/>
                        </Col>
                        <Col>
                          <Form.Label className="mb-1" style={{ fontSize: "14px" }}>End Time</Form.Label>
                          <input type="time" className='form-control' value={outboundTrip.end_time} onChange={(e)=>setOutboundTrip({...outboundTrip,end_time:e.target.value})}/>
                        </Col>
                      </Row>
                    </Form.Group>

                    {/* Return Section */}
                    <Form.Group className="mt-4">
                      <h6 className="mb-1">2. Return</h6>

                      <Row className="mt-3">
                        <Col>
                          <Form.Label className="mb-1" style={{ fontSize: "14px" }}>Driver</Form.Label>
                          <Form.Control as="select" value={returnTrip.driver_id} onChange={(e)=>setReturnTrip({...returnTrip,driver_id:e.target.value})}>
                            <option disabled value={""}>
                              Select Driver
                            </option>
                            {
                              drivers.length>0?
                              drivers.map((item,index)=>(
                                <option key={index} value={item._id}>{item.first_name} {item.last_name}</option>
                              ))
                              :<></>
                            }
                          </Form.Control>
                        </Col>
                        <Col>
                          <Form.Label className="mb-1" style={{ fontSize: "14px" }}>Conductor</Form.Label>
                          <Form.Control as="select" value={returnTrip.conductor_id} onChange={(e)=>setReturnTrip({...returnTrip,conductor_id:e.target.value})}>
                            <option disabled value="">
                              Select Conductor
                            </option>
                            {
                              conductors.length>0?
                              conductors.map((item,index)=>(
                                <option key={index} value={item._id}>{item.first_name} {item.last_name}</option>
                              ))
                              :<></>
                            }
                          </Form.Control>
                        </Col>
                      </Row>


                      {/* location  */}
                      <Row className="mt-3">
                        <Col>
                          <Form.Label className="mb-1" style={{ fontSize: "14px" }}>Start Location</Form.Label>
                          <Form.Control as="select" value={returnTrip.departure_location.city} onChange={(e)=>setReturnTrip({...returnTrip,departure_location:{...returnTrip.departure_location,city:e.target.value}})}>
                            <option disabled value="">
                              Select Location
                            </option>
                            <option value={'loc1'}>Location 1</option>
                            <option value={'loc2'}>Location 2</option>
                            <option value={'loc3'}>Location 3</option>
                          </Form.Control>
                        </Col>
                        <Col>
                          <Form.Label className="mb-1" style={{ fontSize: "14px" }}>End Location</Form.Label>
                          <Form.Control as="select" value={returnTrip.arrival_location.city} onChange={(e)=>setReturnTrip({...returnTrip,arrival_location:{...returnTrip.arrival_location,city:e.target.value}})}>
                            <option disabled value="">
                              Select Location
                            </option>
                            <option value={'loc1'}>Location 1</option>
                            <option value={'loc2'}>Location 2</option>
                            <option value={'loc3'}>Location 3</option>
                          </Form.Control>
                        </Col>
                      </Row>

                      <Row className='mt-3'>
                        <Col>
                          <Form.Label className="mb-1" style={{ fontSize: "14px" }}>Start Date</Form.Label>
                          <Form.Control type="date" placeholder="Select Date" value={returnTrip.start_date} onChange={(e)=>setReturnTrip({...returnTrip,start_date:e.target.value})} />
                        </Col>
                        <Col>
                          <Form.Label className="mb-1" style={{ fontSize: "14px" }}>End Date</Form.Label>
                          <Form.Control type="date" placeholder="Select Date" value={returnTrip.end_date} onChange={(e)=>setReturnTrip({...returnTrip,end_date:e.target.value})}/>
                        </Col>
                      </Row>
                      <Row className="mt-2">
                        <Col>
                          <Form.Label className="mb-1" style={{ fontSize: "14px" }}>Start Time</Form.Label>
                          <input type="time" className='form-control' value={returnTrip.start_time} onChange={(e)=>setReturnTrip({...returnTrip,start_time:e.target.value})}/>
                        </Col>
                        <Col>
                          <Form.Label className="mb-1" style={{ fontSize: "14px" }}>End Time</Form.Label>
                          <input type="time" className='form-control' value={returnTrip.end_time} onChange={(e)=>setReturnTrip({...returnTrip,end_time:e.target.value})}/>
                        </Col>
                      </Row>
                    </Form.Group>

                    {/* Vehicle Section */}
                    <Form.Group className="mt-4">
                      <h6 className="mb-1">3. Vehicle</h6>
                      <Row className='mt-3'>
                        <Col>
                          <Form.Check type="radio" label="deluxe" name="vehicleType" value={"deluxe"} onChange={(e)=>setBusType(e.target.value)}/>
                          <Form.Check type="radio" label="super" name="vehicleType" value={"super"} onChange={(e)=>setBusType(e.target.value)}/>
                          <Form.Check type="radio" label="superfast" name="vehicleType" value={"superfast"} onChange={(e)=>setBusType(e.target.value)}/>
                        </Col>
                        <Col>
                          <Form.Label className="mb-1">Select Vehicle</Form.Label>
                          <Form.Control as="select" value={vehicle_id} onChange={(e)=>setVehicle_id(e.target.value)}>
                            <option disabled value="">
                              Select Bus
                            </option>
                            {
                              vehicles.length>0?vehicles.filter((item)=>!busType?true:item.transport_type==busType).map((item,index)=>(
                                <option key={index} value={item?._id}>{item?.number}</option>
                              ))
                              :<></>
                            }
                          </Form.Control>

                          <Form.Check type="checkbox" label="Only Available" className="mt-2" checked={availableBusOnly} onChange={(e)=>setAvailableBusOnly(e.target.checked)}  />
                        </Col>
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

            {/* Trip Cost Sidebar */}
            <Col xs={3} className='mt-3'>
              <Card className="trip-cost-card shadow-sm border-0 p-0">
                <Card.Body>
                  <Card.Title className="d-flex align-items-center">
                    <FontAwesomeIcon icon={faTag} className="me-2 text-secondary" />
                    <span>Trip Cost</span>
                  </Card.Title>

                  <hr className="mb-4 align-hr" />

                  <p><FontAwesomeIcon icon={faCalendarAlt} /> <strong>Dates:</strong> {`${formatDate(outboundTrip.start_date)}`} {`${formatTime(outboundTrip.start_time)}`} - {`${formatDate(returnTrip.end_date)}`} {`${formatTime(returnTrip.end_time)}`}</p>
                  <p><FontAwesomeIcon icon={faClock} /> <strong>Trip Time:</strong> {tripDuration()}</p>
                  {/* <p><FontAwesomeIcon icon={faRoad} /> <strong>Distance:</strong> 4,239mi</p>
                  <p><FontAwesomeIcon icon={faGasPump} /> <strong>Fuel Consumption:</strong> 6.15 MPG</p> */}

                  <hr />
                  {/* <h5 className="text-muted">Approx. Cost <span className="text-success total-cost ms-5">INR: 1,241.14</span></h5> */}

                  <Row className="mt-2">
                    <Col>
                      <Button variant="outline-secondary" className="w-100" onClick={handleCancel}>Cancel</Button>
                    </Col>
                    <Col>
                      <Button variant="success" className="w-100" onClick={handleSchedule}>Schedule Trip</Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            <Col xs={1}></Col>
          </Row>
        </Container>
      </div></div>
  );
};

export default TripParameters;
