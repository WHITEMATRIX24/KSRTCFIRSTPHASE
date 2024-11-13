import React, { useState } from 'react';
import { Button, Card, Col, Row, Table } from 'react-bootstrap';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Header from '../../components/common/Header.jsx';
import './VehicleDetails.css';
import VehicleNav from './VehicleNav.jsx';

import vehicleImg from '../../assets/vehicleImg.jpg';

import BatteryImg from '../../assets/batteryImg.png';
import engineImg from '../../assets/engineImg.png';
import gasImg from '../../assets/gasImg.png';
import oilCheck from '../../assets/oilImg.png';

import brakeImg from '../../assets/brakeImg.png';
import filterImg from '../../assets/filterImg.png';
import plImg from '../../assets/plImg.png';
import tyreImg from '../../assets/tyreImg.png';

import available from '../../assets/blueTick.png';


const VehicleDetails = () => {
  const [vinNumber, setVinNumber] = useState('JTDKBRFU9J30593O7');
  const [licenceNumber, setLicenceNumber] = useState('232456');

  // vehicle
  const [vehicleInfo, setVehicleInfo] = useState({
    name: "Type Someting",
    year: 2015,
    model: "Crafter",
    odometer: 20.99
  })

  // vehicle
  const [vehicle, setVehicle] = useState({
    status: 'true',
    vehicleImage: vehicleImg,
    type: "TRUCK",
    fuelConsumption: "5.99",
    domain: "RETAIL",
    driver: "John Doe",
    vehicleCondition: "70",
    color: 'silver',
    vinNumber: "1G1ZT51806F128009"
  });

  // maintaince
  const [maintenance, setMaintaince] = useState({
    overdue: 5,
    dueSoon: 3,
    maintainceReport: {
      breakchangeDue: 1,
      filterReplacementDue: 1,
      plannedInspectionDue: 4,
      rotateTyreDue: 3
    }
  })

  // key indicators
  const [keyIndicators, setKeyIndicators] = useState({
    vinNumber: 1,
    engine: "OK",
    battery: "Low",
    oil: 35,
    gas: 1,
  });

  const [tripInfo, setTripInfo] = useState({
    tripLive: {
      startDate: "May 14 / 2:35 AM",
      endDate: "May 14 / 12:40 PM",
      distance: "501.4 mi",
      duration: "10h 5min"
    },
    tripNext: {
      startDate: "May 20 / 8:00 AM",
      endDate: "May 20 / 6:00 PM",
      distance: "350.7 mi",
      duration: "8h 0min"
    }
  })

  return (
    <>
      <Row lg={12}>
        <Col lg={12}>
          <Header />
        </Col>
      </Row>

      <div className="container-fluid mt-0 main-container">
        <Row className="justify-content-center gap-1 ms-0">
          {/* Dashboard */}
          <VehicleNav />
          <Col xs={12} lg={1}></Col>
          {/* Vehicle Info Section */}
          <Col xs={12} lg={4} className="vehicle-card border-1 rounded m-1 ms-3" style={{ backgroundColor: '#FBFDFF' }}>
            <div className="d-flex align-items-center mt-0 p-1">
              <img src={vehicle.vehicleImage} alt="Vehicle-Image" className=' img-fluid ' />
              <p className="ms-3">Vehicle Name</p>
              <div className=' ms-2 mb-2 p-1 rounded border d-flex'>
                <img src={available} className='p-1 mb-0' alt="Available" />
                <span>Available</span>
              </div>
            </div>
            <div className="vehicle-info d-flex">
              <span className='me-1'>
                vin : <span className='vehicle-info-vin'>{vinNumber}</span>
              </span>
              <span>
                Licence Plate : <span className='vehicle-info-lp'>{licenceNumber}</span>
              </span>
            </div>
            <div className="row border-top p-1">
              <Col xs={6} md={4} className="mb-0">
                <p className='fw-bold' style={{ fontSize: '12px' }}>Status</p>
                {vehicle.status === 'true' ? (
                  <p><i className="fa-solid fa-location-arrow text-success border px-4 rounded fs-3"></i></p>
                ) : (
                  <p><i className="fa-solid fa-xmark text-danger ps-2 fs-3"></i></p>
                )}
              </Col>
              <Col xs={6} md={4} className="rounded">
                <p className='fw-bold p-0' style={{ fontSize: '12px' }}>Type</p>
                <p>{vehicle.type}</p>
              </Col>
              <Col xs={12} md={4} className="fuel-usage d-flex flex-column justify-content-center align-items-center w-25 rounded mb-1">
                <div className="gas-icon text-center">
                  <i className="fa-solid fa-gas-pump text-secondary"></i>
                </div>
                <div >
                  <p className='fuel-text mb-1'>Fuel Consumption</p>
                  <p className='fuel-text text-center m-0 fw-bold'>{vehicle.fuelConsumption}</p>
                  <p className='fuel-text text-center m-0'>MPG</p>
                </div>
              </Col>
            </div>
            <Row className='m-0'>
              <Col xs={6} sm={4}>
                <div className="grid">
                  <div className="grid-items">
                    <p className='mb-1 fw-bold' style={{ fontSize: '12px' }}>Domain</p>
                  </div>
                  <div className="grid-items">
                    <p>{vehicle.domain}</p>
                  </div>
                </div>
              </Col>
              <Col xs={6} sm={4}>
                <div className="grid">
                  <div className="grid-items">
                    <p className='fw-bold' style={{ fontSize: '12px' }}>Driver</p>
                  </div>
                  <div className="grid-items">
                    <p>{vehicle.driver}</p>
                  </div>
                </div>
              </Col>
              <Col xs={12} sm={4} className="avgSpeed-main d-flex flex-column justify-content-center align-items-center rounded w-25 m-2 ms-1">
                <div className="text-center">
                  <i className="fa-solid fa-gauge text-secondary"></i>
                </div>
                <div className="grid-items text-center">
                  <p className="avg-speed-text mb-0">Average Speed</p>
                </div>
                <div className="grid-items text-center">
                  <p className="fw-bold mb-0" style={{ fontSize: '10px' }}>56</p>
                </div>
              </Col>
            </Row>
          </Col>

          {/* Vehicle Condition */}
          <Col
            xs={12}
            lg={2}
            className="d-flex justify-content-center align-items-center border rounded m-2 p-3 position-relative"
            style={{ backgroundColor: '#FBFDFF' }}
          >
            <h2 className="vehicle-condi-title position-absolute top-0 start-0  mb-0 p-3">Vehicle Condition</h2>

            {/* Progress Bar */}
            <div className="c-progress d-flex justify-content-center align-items-center" style={{ width: 150 }}>
              <CircularProgressbar
                value={parseInt(vehicle.vehicleCondition)}
                text={`${vehicle.vehicleCondition}%`}
                styles={buildStyles({
                  pathColor: vehicle.vehicleCondition < 50 ? 'red' : '#6ccf6c',
                  textColor: '#333',
                  trailColor: '#d6d6d6',
                  strokeWidth: 10,
                  strokeLinecap: 'butt',
                })}
              />
            </div>
          </Col>


          {/* Key Indicators */}
          <Col xs={12} lg={3} className="d-flex flex-column border rounded mt-2  p-0 align-items-center" style={{ backgroundColor: '#FBFDFF' }}>
            <Row className="w-100">
              <Col>
                <h2 className="key-title p-2">Key Indicators</h2>
              </Col>
            </Row>
            <Row className="w-100 justify-content-center">
              <Col xs={5} className="d-flex align-items-center border rounded me-3 mt-3 p-2">
                <img src={engineImg} alt="Engine" className="img-fluid" style={{ width: '40px', height: '40px' }} />
                <div className="ms-3 d-flex flex-column align-items-start">
                  <span className="text-muted">{keyIndicators.engine}</span>
                  <p className="mb-0">Engine</p>
                </div>
              </Col>
              <Col xs={5} className="d-flex align-items-center border rounded me-3 mt-3 p-2">
                <img src={BatteryImg} alt="Battery" className="img-fluid" style={{ width: '40px', height: '40px' }} />
                <div className="ms-3 d-flex flex-column align-items-start">
                  <span className="text-muted">{keyIndicators.battery}</span>
                  <p className="mb-0">Battery</p>
                </div>
              </Col>
            </Row>
            <Row className="mt-3 p-3 w-100 justify-content-center">
              <Col xs={5} className="d-flex align-items-center border rounded me-3 p-2">
                <img src={oilCheck} alt="Oil" className="img-fluid" style={{ width: '40px', height: '40px' }} />
                <div className="ms-3 d-flex flex-column align-items-start">
                  <span className="text-muted">{keyIndicators.oil}%</span>
                  <p className="mb-0">Oil</p>
                </div>
              </Col>
              <Col xs={5} className="d-flex align-items-center border rounded me-3 p-2">
                <img src={gasImg} alt="Gas" className="img-fluid" style={{ width: '40px', height: '40px' }} />
                <div className="ms-3 d-flex flex-column align-items-start">
                  <span className="text-muted">{keyIndicators.gas}G</span>
                  <p className="mb-0">Gas</p>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row className="justify-content-center gap-1 mt-1 ms-1">
          {/* Dashboard */}

          <Col xs={12} lg={1}></Col>
          {/* Vehicle Details */}
          <Col className='mt-0 border rounded p-1 m-0' xs={12} lg={3} style={{ backgroundColor: '#FBFDFF' }}>
            <div className='p-2 rounded' style={{ backgroundColor: '#FBFDFF' }}>
              <div className='v-details-head mb-1'>
                <h4 style={{ fontSize: '1rem' }}>Vehicle Details</h4>
                <button className='btn border vd-edit-btn'><i class="vd-pen-icon fa-solid fa-pen pe-3 text-secondary"></i>Edit</button>
              </div>
              <Table striped bordered hover className='text-end m-0 p-0'>
                <tbody>
                  <tr>
                    <td>Name</td>
                    <td>{vehicleInfo.name}</td>
                  </tr>
                  <tr>
                    <td>Year</td>
                    <td>{vehicleInfo.year}</td>
                  </tr>
                  <tr>
                    <td>Model</td>
                    <td>{vehicleInfo.model}</td>
                  </tr>
                  <tr>
                    <td>Odometer</td>
                    <td>{vehicleInfo.odometer}</td>
                  </tr>
                  <tr>
                    <td>Color</td>
                    <td>{vehicle.color}</td>
                  </tr>
                  <tr>
                    <td>Vin</td>
                    <td>{vehicle.vinNumber}</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Col>

          {/* Maintenance Section */}
          <Col className='mt-0' xs={12} lg={3}>
            <Card className='p-0' style={{ backgroundColor: '#FBFDFF' }}>
              <Card.Header>
                <h5 style={{ fontSize: '14px' }}>Maintenance</h5>
              </Card.Header>
              <Card.Body className='p-1'>
                <Row className="mb-1">
                  <Col xs={6}>
                    <div style={{ backgroundColor: '#FFFAF1' }} className="text-center p-1 rounded">
                      <h4 className='mb-0'>{maintenance.overdue}</h4>
                      <p className='mb-0'>Overdue</p>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="text-center bg-light p-1 rounded">
                      <h4 className='mb-1'>{maintenance.dueSoon}</h4>
                      <p className='mb-0'>Due Soon</p>
                    </div>
                  </Col>
                </Row>
                <div>
                  <Card className="mb-1">
                    <Card.Body className="d-flex justify-content-between p-1">
                      <div className='d-flex flex-grow-1'>
                        <img src={brakeImg} className='img-fluid me-2' style={{ width: '30px', height: '30px' }} alt="break" />
                        <div className='d-grid ms-4'>
                          <strong>Brakes Repair</strong>
                          <p className='mb-0'>{maintenance.maintainceReport.breakchangeDue} month overdue</p>
                        </div>
                      </div>

                      <i className="bi bi-wrench"></i>
                    </Card.Body>
                  </Card>
                  <Card className="mb-2">
                    <Card.Body className="d-flex justify-content-between p-1">
                      <div className='d-flex flex-grow-1'>
                        <img src={filterImg} className='img-fluid me-2' style={{ width: '30px' }} alt="break" />
                        <div className='d-grid ms-4'>
                          <strong>Filter Replacement</strong>
                          <p className='mb-0'>{maintenance.maintainceReport.filterReplacementDue} month overdue</p>
                        </div>
                      </div>
                      <i className="bi bi-funnel"></i>
                    </Card.Body>
                  </Card>
                  <Card className="mb-2">
                    <Card.Body className="d-flex justify-content-between p-1">
                      <div className='d-flex flex-grow-1'>
                        <img src={plImg} className='img-fluid me-2' style={{ width: '30px', height: '30px' }} alt="break" />
                        <div className='d-grid ms-4'>
                          <strong>Planned Inspectin</strong>
                          <p className='mb-0'>{maintenance.maintainceReport.plannedInspectionDue} month overdue</p>
                        </div>
                      </div>
                      <i className="bi bi-clipboard-check"></i>
                    </Card.Body>
                  </Card>
                  <Card className="mb-2">
                    <Card.Body className="d-flex justify-content-between p-1">
                      <div className='d-flex flex-grow-1'>
                        <img src={tyreImg} className='img-fluid me-2' style={{ width: '30px', height: '30px' }} alt="break" />
                        <div className='d-grid ms-4'>
                          <strong>Rotate Tyres</strong>
                          <p className='mb-0'>{maintenance.maintainceReport.rotateTyreDue} month overdue</p>
                        </div>
                      </div>
                      <i className="bi bi-arrow-repeat"></i>
                    </Card.Body>
                  </Card>
                </div>
              </Card.Body>
            </Card>
          </Col>


          {/* Trip */}
          <Col xs={12} lg={3} className='mt-0 p-1'>

            {/* Trip Live */}
            <Card className='m-0 p-0'>
              <Card.Header className='d-flex align-items-center justify-content-between m-0 p-2'>
                <h5 className='m-0 p-1'>Trip <span className="text-success" style={{ fontSize: '1rem' }}>LIVE</span></h5>
                <Button className="float-end trip-button text-success btn-outline-success"><i className="fa-solid fa-star me-2"></i>MAP</Button>
              </Card.Header>
              <Card.Body className='m-0 p-0'>
                <Row>
                  <Col xs={12} className='d-flex align-items-center justify-content-around'>
                    <p className='m-0 p-0'>Start Date:<p className='trip-start-date mt-2 mb-1 fw-bold'>{tripInfo.tripLive.startDate}</p></p>
                    <p className='m-0 p-0'>End Date:<p className='trip-end-date mt-2  mb-1 fw-bold'>{tripInfo.tripLive.endDate}</p></p>
                  </Col>
                  <Col xs={12} className='d-flex align-items-center justify-content-around'>
                    <p className='m-0 pe-3'>Distance Covered<p className='trip-distance mt-2 fw-bold'> {tripInfo.tripLive.distance}</p></p>
                    <p className='m-0 p-0'>Duration<p className='trip-duration mt-2 fw-bold'> {tripInfo.tripLive.duration}</p></p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Trip Upcoming */}
            <Card className='mt-0'>
              <Card.Header className='d-flex align-items-center justify-content-between m-0 p-2'>
                <h5 className='m-0 p-1'>Trip <span className="text-success" style={{ fontSize: '1rem' }}>Upcoming</span></h5>
                <Button className="float-end trip-button text-success btn-outline-success"><i className="fa-solid fa-star me-2"></i>MAP</Button>
              </Card.Header>
              <Card.Body className='m-0 p-0'>
                <Row className='m-0 p-0'>
                  <Col xs={12} className='d-flex align-items-center justify-content-around m-0 p-0'>
                    <p className='m-0 p-0'>Start Date:<p className='trip-start-date mt-2 fw-bold'> {tripInfo.tripNext.startDate}</p></p>
                    <p className='m-0 p-0'>End Date:<p className='trip-end-date mt-2 fw-bold'> {tripInfo.tripNext.endDate}</p></p>
                  </Col>
                  <Col xs={12} className='d-flex align-items-center justify-content-around m-0 p-0'>
                    <p className='m-0 p-0'>Distance Covered<p className='trip-distance mt-2 fw-bold'> {tripInfo.tripNext.distance}</p></p>
                    <p className='m-0 p-0'>Duration<p className='trip-duration mt-2 fw-bold'> {tripInfo.tripNext.duration}</p></p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default VehicleDetails;
