import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCog, faTrash, faCalendar, faBus, faClock, faUser, faEllipsisV,
  faCircleCheck
} from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/common/Header';
import { useNavigate } from 'react-router-dom';
import { getAllTripApi, getAllVehicles, getDriversListApi, updateTripApiNew } from '../../services/allAPI';

export default function ScheduleTrip() {

  const [trips, setTrips] = useState([])
  const [date, setDate] = useState("")
  const [vehicleSearch, setVehicleSearch] = useState("")
  const [vehicles, setVehicles] = useState([])
  const [drivers, setDrivers] = useState([])
  const [modifiedTrips, setModifiedTrips] = useState([])


  // get all trips
  const getTrips = async () => {
    try {
      const result = await getAllTripApi()
      if (result.status == 200) {
        setTrips(result.data)
      } else {
        alert("Failed to fetch Trips data")
      }
    } catch (err) {
      alert(`Failed to load trips ${err}`)
    }
  }

  // get drivers list
  const getAllDriversList = async () => {
    try {
      const result = await getDriversListApi()
      if (result.status == 200) {
        setDrivers(result.data)
      } else {
        alert("Failed to load Drivers Details")
      }
    } catch (err) {
      alert(`Failed to load Drivers Details ${err}`)
    }
  }

  // get all buses
  const getAllBuses = async () => {
    try {
      const result = await getAllVehicles()
      if (result.status == 200) {
        setVehicles(result.data)
      } else {
        alert("Failed to load Bus Details")
      }
    } catch (err) {
      alert(`Failed to load Bus Details ${err}`)
    }
  }

  // api call
  useEffect(() => {
    getTrips()
    getAllDriversList()
    getAllBuses()
  }, [])


  // mdofied trip data
  useEffect(() => {
    if (trips.length > 0 && vehicles.length > 0 && drivers.length > 0) {
      let arr = trips.map(item =>
        ({ ...item, vehicleNumber: vehicles.find(item2 => item2._id == item.vehicle_id)?.number, driverName: drivers.find(item2 => item2._id == item.driver_id)?.first_name + " " + drivers.find(item2 => item2._id == item.driver_id)?.last_name })
      )
      setModifiedTrips(arr)
    }
  }, [trips, vehicles, drivers])


  // formats time =>recieve time from time picker and returns formatted time
  const formatTime = (timeInput) => {
    if (timeInput) {
      const date = new Date(`1970-01-01T${timeInput}:00`)
      const options = { hour: 'numeric', minute: '2-digit', hour12: true };
      return date.toLocaleTimeString('en-US', options);
    } else {
      return ""
    }
  }

  // calculate trip duration
  const tripDuration = (start_date, start_time, end_date, end_time) => {
    if (!start_date || !start_time || !end_date || !end_time) {
      return ""
    } else {
      const startDateTime = new Date(`${start_date.split("T")[0]}T${start_time}`)
      const endDateTime = new Date(`${end_date.split("T")[0]}T${end_time}`)
      const diffInMs = endDateTime - startDateTime

      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const days = Math.floor(diffInMinutes / (24 * 60));
      const hours = Math.floor((diffInMinutes % (24 * 60)) / 60);
      const minutes = diffInMinutes % 60;

      return days == 0 ? hours == 0 ? `${minutes}min` : `${hours}h ${minutes}min` : `${days}d ${hours}h ${minutes}min`
    }
  }



  const navigate = useNavigate();
  const handleScheduleButton = () => {
    navigate("/add-trip")
  }

  const handleLive = async (id) => {
    const trip = trips.find(item => item._id == id)

    if (trip.status != "live") {
      let obj = { ...trip, status: "live" }
      console.log(obj);
      const result = await updateTripApiNew(obj._id, obj.vehicle_id, obj.driver_id, obj.conductor_id, obj)
      getTrips()
    }
  }


  // console.log(modifiedTrips);



  return (
    <div>
      <Header />
      <Container fluid className="p-4" style={{ backgroundColor: '#f8f9fa' }}>
        <Row>
          <Col md={2}></Col>

          <Col md={9}>
            <Row className="mb-4">
              <Col className="d-flex justify-content-between align-items-center">
                <h1 className="h5 mb-0">Upcoming Trips</h1>
                <Button variant="success" onClick={handleScheduleButton} className="d-flex align-items-center gap-2">
                  <FontAwesomeIcon icon={faCalendar} width="18" height="18" />
                  <span>SCHEDULE TRIP</span>
                </Button>
              </Col>
            </Row>

            {/* Filters */}
            <Row className="mb-3 align-items-center">
              <Col md={4}>
                <Form.Control
                  type="text"
                  placeholder="Filter by Vehicle"
                  value={vehicleSearch}
                  onChange={(e) => setVehicleSearch(e.target.value)}
                />
              </Col>
              <Col md={4}>
                <Form.Control
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </Col>
              <Col md={4} className="text-end">
                <Button variant="link" className="text-muted" onClick={() => { setDate(''); setVehicleSearch(''); }}>CLEAR</Button>
              </Col>
            </Row>

            <hr className="my-3" />

            {/* Toolbar with count of items */}
            <Row className="align-items-center mb-3">
              <Col xs="auto">
                {/* <FontAwesomeIcon icon={faCog} className="text-muted me-3" />
                <FontAwesomeIcon icon={faTrash} className="text-muted" /> */}
              </Col>
              <Col className="text-end">
                {/* Displaying the count of filtered items */}
                <span>Items in the table:</span>
                <span className='text-info ms-2 me-5'>
                  {
                    modifiedTrips
                      .filter(item => !date ? true : (date == item.start_date.split("T")[0] || date == item.end_date.split("T")[0]))
                      .filter(item => !vehicleSearch ? true : item.vehicleNumber.search(vehicleSearch) == -1 ? false : true)
                      .filter(item => item.status == "upcoming")
                      .length
                  }
                </span>
              </Col>
            </Row>

            {/* Table */}
            <Row>
              <Col>
                <Table hover responsive className="align-middle" style={{ borderSpacing: '0 10px' }}>
                  <thead>
                    <tr className="bg-light">
                      <th></th>
                      <th>TRIP</th>
                      <th>VEHICLE</th>
                      <th>DRIVER</th>
                      <th>START DATE</th>
                      <th>END DATE</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {
                      modifiedTrips.length > 0 ?
                        modifiedTrips
                          .filter(item => !date ? true : (date == item.start_date.split("T")[0] || date == item.end_date.split("T")[0]))
                          .filter(item => !vehicleSearch ? true : item.vehicleNumber.search(vehicleSearch) == -1 ? false : true)
                          .filter(item => item.status == "upcoming")
                          .map((item, index) => (
                            <tr key={index} className="bg-white">
                              <td>
                                {/* <Form.Check type="checkbox" /> */}
                              </td>
                              <td>{item.trip_id} <span className="text-primary ms-1">{item?.trip_type.toUpperCase()}</span></td>
                              <td>
                                <div className="d-flex align-items-center gap-2">
                                  <FontAwesomeIcon icon={faBus} className="text-muted me-2" />
                                  <div>
                                    <div>{item.vehicleNumber}</div>
                                    <small className="text-muted">BUS</small>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <FontAwesomeIcon icon={faUser} className="text-muted me-2" />
                                {item.driverName}
                              </td>
                              <td>{new Date(item.start_date).toLocaleDateString()}<br /><small className="text-muted">{formatTime(item.start_time)}</small></td>
                              <td>{new Date(item.end_date).toLocaleDateString()}<br /><small className="text-muted">{formatTime(item.end_time)}</small></td>
                              <td>
                                {/* <FontAwesomeIcon icon={faClock} className="text-muted me-2" />
                          {tripDuration(item.start_date,item.start_time,item.end_date,item.end_time)} */}
                                <button className={item.status == "live" ? "text-success btn" : "text-secondary btn"} onClick={() => handleLive(item._id)}>
                                  <FontAwesomeIcon icon={faCircleCheck} />
                                  <span className='ms-2'>{item.status == "live" ? "Live" : "Make Live"}</span>
                                </button>
                              </td>
                              <td>
                                {/* <Button variant="link" className="p-0">
                            <FontAwesomeIcon icon={faEllipsisV} />
                          </Button> */}
                              </td>
                            </tr>
                          ))
                        : <></>
                    }
                  </tbody>

                </Table>
              </Col>
            </Row>
          </Col>

          <Col md={1}></Col>
        </Row>
      </Container>
    </div>
  );
}
