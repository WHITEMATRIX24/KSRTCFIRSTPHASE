import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCog, faTrash, faCalendar, faBus, faClock, faUser, faEllipsisV,
  faL
} from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/common/Header';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { TextField }
  from '@mui/material';
import { getAllTripApi, updateTripApi, getAllVehicles } from '../../services/allAPI';

export default function OnGoingTrips() {


  //state to store trip data

  const [tripData, setNewTripData] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [modifiedTrips, setModifiedTrips] = useState([])


  //state to store trip colleftion and fuel cost
  const [tripCost, setTripCost] = useState({
    "collection": 0,
    "Cost": 0
  })

  //state to validate whether data entered is number
  const [tripCostValidation, setTripCostValidation] = useState({
    "collectionValid": false,
  })


  const [vehicleFilter, setVehicleFilter] = useState('');
  const [tripFilter, setTripFilter] = useState('');

  const [dateFilter, setDateFilter] = useState('');

  // Filtered trips based on vehicle number and date
  const filteredTrips = modifiedTrips.filter(trip => {
    const matchesVehicle = trip.vehicle_id.toLowerCase().includes(vehicleFilter.toLowerCase());
    const matchesTrips = trip.trip_id.toLowerCase().includes(tripFilter.toLowerCase());
    const matchesDate = dateFilter ? trip.startDate.startsWith(dateFilter) : true;
    const liveVehicle = trip.status.toLowerCase().includes('live');

    return matchesVehicle && matchesDate && liveVehicle && matchesTrips;
  });

  //modal

  const [show, setShow] = useState(false);
  const [editTrip, seteditTrip] = useState({
    vehicle_id: "",
    driver_id: "",
    conductor_id: "",
    start_date: "",
    end_date: "",
    departure_location: "",
    arrival_location: "",
    start_time: "",
    end_time: "",
    status: "",
    revenue_generated: "",
    collection_amount: "",
    fuelCost: '', _id: ""
  });

  /* Function to close modal */
  const handleClose = () => {
    setShow(false)
    seteditTrip({
      _id,
      vehicle_id: "",
      driver_id: "",
      conductor_id: "",
      start_date: "",
      end_date: "",
      departure_location: "",
      arrival_location: "",
      start_time: "",
      end_time: "",
      status: "",
      revenue_generated: "",
      collection_amount: "",
      fuelCost: ''
    })
    setInputPairs([])
    setFuel([])
    setFuelCost(0)
  };
  /* Function to open modal */

  const addCollectionModal = (tripEditing) => {
    console.log(tripEditing);

    setShow(true)
    seteditTrip({
      vehicle_id: tripEditing.vehicle_id,
      driver_id: tripEditing.driver_id,
      conductor_id: tripEditing.conductor_id,
      start_date: tripEditing.start_date,
      end_date: tripEditing.end_date,
      departure_location: tripEditing.departure_location,
      arrival_location: tripEditing.arrival_location,
      start_time: tripEditing.start_time,
      end_time: tripEditing.end_time,
      status: tripEditing.status,
      revenue_generated: tripEditing.revenue_generated,
      collection_amount: tripEditing.collection_amount,
      fuelCost: tripEditing.fuelCost,
      _id: tripEditing._id
    })
    //console.log(editTrip);

  };



  //function to validate collection amount
  const valiadateCollection = (amount) => {
    setTripCost({ ...tripCost, collection: amount })
    seteditTrip({ ...editTrip, collection_amount: amount })
    setTripCostValidation({ ...tripCostValidation, collectionValid: false })

  }

  // State to track the list of input pairs (two separate inputs)
  const [inputPairs, setInputPairs] = useState([]);
  const [fuel, setFuel] = useState([])


  const [fuelCost, setFuelCost] = useState(0)

  const handleButtonClick = () => {
    // Add a new pair of input fields, each with its own state for the values
    setInputPairs([...inputPairs, { liter: '', rate: '', total: '' }]);
  };

  const handleInputChange = (index, field, event) => {
    // Update the value of either input1 or input2 for a specific input pair
    const newInputPairs = [...inputPairs];
    let newFuel = fuel
    let fuelCharge = 0
    newInputPairs[index][field] = event.target.value;
    newInputPairs[index]['total'] = newInputPairs[index]['liter'] * newInputPairs[index]['rate']
    fuel[index] = newInputPairs[index]['total']
    setInputPairs(newInputPairs);
    setFuel(newFuel)
    fuelCharge = newFuel.reduce((a, b) => a + b)

    setFuelCost(fuelCharge)
    setTripCost({ ...tripCost, Cost: fuelCost })
    seteditTrip({ ...editTrip, fuelCost: fuelCharge })

  };



  const [showConfirmation, setShowConfirmation] = useState(false)
  const [password, setPassword] = useState("")

  const handleCloseConfirmation = () => {
    setShowConfirmation(false)
    setPassword("")
  };
  const handleOpeneConfirmation = () => {
    setShowConfirmation(true)
    setShow(false)

  };
  const ConfirmSave = () => {

    if (password === "1234") {
      UpdateTripDetails()

      handleCloseConfirmation()
    }
    else {
      alert('Wrong Password')
    }
  }

  const getAllTrips = async () => {
    const result = await getAllTripApi();
    console.log(result.data);
    console.log(result.status);

    if (result.status == 200) {
      setNewTripData(result.data);
    }
    else {
      console.log(result);

    }

  }
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

  const UpdateTripDetails = async () => {
    seteditTrip({ ...editTrip, collection_amount: tripCost.collection })
    seteditTrip({ ...editTrip, fuelCost: tripCost.Cost })
    seteditTrip({ ...editTrip, status: "completed" })
    //api to update trip details
    const result = await updateTripApi(editTrip, editTrip._id)
    if (result.status == 200) {
      handleClose();
    }
    else {
      alert(result)
    }
  }

  useEffect(() => {
    getAllTrips();
    getAllBuses()
  }, [])
  useEffect(() => {
    if (tripData.length > 0 && vehicles.length > 0) {
      let arr = tripData.map(item =>
        ({ ...item, vehicleNumber: vehicles.find(item2 => item2._id == item.vehicle_id)?.number })
      )
      setModifiedTrips(arr)
    }
  }, [tripData, vehicles])




  return (
    <div>
      <Header />
      <div className='m-3' style={{ marginTop: '250px' }}>

        <Container fluid className="p-4" style={{ backgroundColor: '#f8f9fa' }}>
          <Row style={{ marginTop: '50px' }}>
            <Col md={2}></Col>
            <Col md={9}>
              <h3 className='mb-5'>Live Trips</h3>

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
                    type="text"
                    placeholder="Filter by TripId"
                    value={tripFilter}
                    onChange={(e) => setTripFilter(e.target.value)}
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
                  <Button variant="link" className="text-muted" onClick={() => { setVehicleFilter(''); setDateFilter(''); }}>CLEAR</Button>
                </Col>
              </Row>

              <hr className="my-3" />

              {/* Toolbar with count of items */}
              <Row className="align-items-center mb-3">

                <Col className="text-end">
                  {/* Displaying the count of filtered items */}
                  <span>Total Live Trips:</span>
                  <span className='text-info ms-2 me-5'>{filteredTrips.length}</span>
                </Col>
              </Row>

              {/* Table */}
              {(filteredTrips.length > 0) && <Row>
                <Col>
                  <Table hover responsive className="align-middle" style={{ borderSpacing: '0 10px' }}>
                    <thead>
                      <tr className="bg-light">
                        <th></th>
                        <th>TRIPID</th>
                        <th>STATUS</th>
                        <th>VEHICLE</th>
                        <th>START DATE</th>
                        <th>END DATE</th>
                        <th>DURATION</th>
                        <th></th>
                        <th></th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredTrips.map(trip => (
                        <tr key={trip.trip_id} className="bg-white">
                          <td><Form.Check type="checkbox" /></td>
                          <td>{trip.trip_id} </td>
                          <td>{trip.status} </td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <FontAwesomeIcon icon={faBus} className="text-muted me-2" />
                              <div>
                                <div>{trip.vehicleNumber}</div>
                                <small className="text-muted">BUS</small>
                              </div>
                            </div>
                          </td>

                          <td>{new Date(trip.start_date).toLocaleDateString()}<br /><small className="text-muted">{new Date(trip.start_date).toLocaleTimeString()}</small></td>
                          <td>{new Date(trip.end_date).toLocaleDateString()}<br /><small className="text-muted">{new Date(trip.end_date).toLocaleTimeString()}</small></td>

                          <td>
                            <button className='btn btn-outline-success' onClick={() => addCollectionModal(trip)} >Add Collection</button>
                          </td  >
                          {/* <td>
                        <button className='btn btn-outline-success' onClick={()=>addFuelCostModal(trip)} >Add Fuel Cost</button>
                      </td> */}
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
              </Row>}
              {(filteredTrips.length == 0) && <h6 className='text-danger'>No Live Trips</h6>}
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
            <Form className='m-3'>

              <TextField
                required
                id="outlined-required" name="collection"
                label="Collection amount "
                className='w-100 mb-3'
                onChange={(e) => { valiadateCollection(e.target.value) }}
              />
              {tripCostValidation.collectionValid && <p className='text-danger'>Please enter valid amount</p>}
              <>
                <button className='btn btn-outline-warning m-3' onClick={handleButtonClick}>Add Fuel Cost</button>
                {/* Render each input pair */}
                {inputPairs.map((pair, index) => (
                  <div key={index} className='d-flex' style={{ marginBottom: '10px' }}>
                    <TextField
                      required
                      id="outlined-required" name="liter"
                      label="Fuel in Liter "
                      className='w-25     me-3'
                      value={pair.input1}
                      onChange={(e) => handleInputChange(index, 'liter', e)}
                      placeholder={`Liters`} />

                    <TextField
                      required
                      id="outlined-required" name="liter"
                      label="Fuel Rate "
                      className='w-25     me-3'
                      value={pair.input2}
                      onChange={(e) => handleInputChange(index, 'rate', e)}
                      placeholder={`₹ 0`} />

                    <TextField
                      readOnly
                      label="Total "

                      id="outlined-required" name="Total"
                      className='w-25     me-3'
                      value={pair.total}
                      placeholder={`₹ 0`} />

                  </div>
                ))}
                <h6 className='text-danger'>Total Fuel Cost</h6>
                <input
                  className='form-control w-100 text-danger fs-3'

                  type="text"
                  value={`₹ ${fuelCost}`}
                  placeholder='₹ 0'
                />    </>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleOpeneConfirmation}>
              Save Changes
            </Button>
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
              id="outlined-required" name="password"
              label="Enter Password "
              type='password'
              className='w-100 mb-3'
              onChange={(e) => { setPassword(e.target.value) }}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseConfirmation}>
              Close
            </Button>
            <Button variant="danger" onClick={ConfirmSave} >
              Confirm Update
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
