import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBus, faTimes } from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/common/Header';
import { addvehicleAPI } from '../../services/allAPI';

const AddVehicle = () => {
  const [vehicleData, setVehicleData] = useState({
    transport_type: '',
    number: '',
    model: '',
    driver: '',
    status: '',
    fuelconsumption: '',
    odometer: '',

  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicleData({
      ...vehicleData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(vehicleData);
    // You would add API logic here to save the vehicle data
    const { transport_type, number, model, status, fuelconsumption, odometer } = vehicleData
    if (!transport_type || !number || !model || !status) {
      alert("please fill the field")
    } else {
      try {
        const result = await addvehicleAPI(vehicleData)
        console.log(result);
        if (result.status === 406) {
          alert("Vehicle is already exist")
        }
        if (result.status === 201) {
          alert("successfully added")
          setVehicleData({ number: "", model: "", status: "", transport_type: "", odometer: "", fuelconsumption: "" })

        } else {
          alert(result.data.message)
        }

      } catch (error) {
        console.log(error);

      }
    }

  };

  return (
    <div>
      <Header />
      <div style={{ backgroundColor: "#f1f1f1", padding: "20px" }}>
        <Container fluid>
          <Row>
            <Col xs={2}></Col>

            <Col xs={9}>
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <Card.Title className="d-flex align-items-center">
                    <FontAwesomeIcon icon={faBus} className="me-2 text-primary" />
                    Vehicle Details
                  </Card.Title>

                  <hr className="mb-4" />
                  <h5 className="text-start">1. VEHICLE INFORMATION</h5>

                  <Form onSubmit={handleSubmit}>
                    <Form.Group>
                      <Row className="mt-3">
                        <Col md={6}>
                          <Form.Label style={{ color: "#333", fontWeight: "500" }}>VEHICLE TYPE</Form.Label>
                          <Form.Check
                            type="radio"
                            label="Super Deluxe"
                            name="transport_type"
                            value="deluxe"
                            onChange={handleChange}
                          />
                          <Form.Check
                            type="radio"
                            label="Fast Passenger"
                            name="transport_type"
                            value="super"
                            onChange={handleChange}
                          />
                          <Form.Check
                            type="radio"
                            label="Super Fast"
                            name="transport_type"
                            value="superfast"
                            onChange={handleChange}
                          />
                        </Col>
                        <Col></Col>
                      </Row>

                      <Row className="mt-3">
                        <Col md={6}>
                          <Form.Label style={{ color: "#333", fontWeight: "500" }}>VEHICLE NO</Form.Label>
                          <Form.Control
                            value={vehicleData.number}
                            type="text"
                            name="number"
                            onChange={handleChange}
                          />
                        </Col>
                      </Row>

                      <Row className="mt-3">
                        <Col md={6}>
                          <Form.Label style={{ color: "#333", fontWeight: "500" }}>VEHICLE MODEL</Form.Label>
                          <Form.Control value={vehicleData.model} as="select" name="model" onChange={handleChange}>
                            <option value="" disabled>select model</option>
                            <option value="Ashok Leyland">Asok Leyland</option>
                            <option value="Bharath Benzs">Bharath Benzs</option>

                          </Form.Control>
                        </Col>
                        <Col md={6}>
                          <Form.Label style={{ color: "#333", fontWeight: "500" }}>VEHICLE STATUS</Form.Label>
                          <Form.Control value={vehicleData.status} as="select" name="status" onChange={handleChange} >
                            <option value="" disabled>Select status</option>
                            <option value="available">Available</option>
                            <option value="enroute">Enroute</option>

                            <option value="out_of_services">Out of Services</option>
                          </Form.Control>
                        </Col>
                        {/* <Col md={6}>

                        
                          <Form.Label style={{ color: "#333", fontWeight: "500" }}>ASSIGN DRIVER</Form.Label>
                          <Form.Control value={vehicleData.driver} as="select" name="driver" onChange={handleChange}>
                            <option value="" disabled> Select Driver</option>
                            <option>driver 1</option>
                            <option>driver 2</option>
                            
                          </Form.Control>
                        </Col> */}
                      </Row>

                      <Row className="mt-3">

                        {/* *******************vehicle condition******************* */}

                        {/* <Col md={6}>
                          <Form.Label style={{ color: "#333", fontWeight: "500" }}>VEHICLE CONDITION</Form.Label>
                          <Form.Control value={vehicleData.condition} as="select" name="condition" onChange={handleChange}>
                            <option value="" disabled> Select condition</option>
                            <option value="Good">Good</option>
                            <option value="Bad">Bad</option>

                          </Form.Control>
                        </Col> */}

                      </Row>

                      <Row className="mt-3">
                        <Col md={6}>
                          <Form.Label style={{ color: "#333", fontWeight: "500" }}>FUEL CONSUMPTION</Form.Label>
                          <Form.Control
                            value={vehicleData.fuelconsumption}
                            type="text"
                            name="fuelconsumption"
                            onChange={handleChange}
                          />
                        </Col>
                        <Col md={6}>
                          <Form.Label style={{ color: "#333", fontWeight: "500" }}>ODOMETER READING</Form.Label>
                          <Form.Control
                            value={vehicleData.odometer}
                            type="text"
                            name="odometer"
                            onChange={handleChange}
                          />
                        </Col>
                      </Row>

                      <Row className="mt-4">
                        <Col className="d-flex justify-content-end">
                          <Button variant="outline-secondary" size="sm" className="me-2">
                            <FontAwesomeIcon icon={faTimes} className="me-1" /> Cancel
                          </Button>
                          <Button type="submit" variant="success" size="sm">Add</Button>
                        </Col>
                      </Row>
                    </Form.Group>
                  </Form>
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

export default AddVehicle;
