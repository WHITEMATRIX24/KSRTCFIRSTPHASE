import React, { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBus, faXmark } from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/common/Header';
import NavSidebar from '../../components/common/Sidebar/NavSidebar';
import { addNewDriver } from '../../services/allAPI';

const AddDriver = () => {
  const [driverData, setDriverData] = useState({
    EmployeeName: "",
    PEN: "",
    Designation: "",
    UNIT: "",
    is_Permanent: "",
    on_leave: "Available", // Default value
    phone: "",
  });

  // cleaar filed
  const handleCancel = () => {
    setDriverData({
      EmployeeName: "",
      PEN: "",
      Designation: "",
      UNIT: "",
      is_Permanent: "",
      on_leave: "Available",
      phone: "",
    });
  };

  const handleAddnewDriver = async () => {
    if (!driverData) {
      console.error("driverData is undefined");
      return;
    }

    const { EmployeeName, PEN, Designation, UNIT, is_Permanent, on_leave, phone } = driverData;

    if (!EmployeeName || !PEN || !Designation || !UNIT || !is_Permanent || !phone) {
      alert("Please fill all required fields");
    } else {
      try {
        const newDriver = await addNewDriver(driverData);
        if (newDriver.status === 201) {
          console.log(newDriver.data);
          setDriverData(newDriver.data);
          alert("New Driver Added Successfully");
          setDriverData({
            EmployeeName: "",
            PEN: "",
            Designation: "",
            UNIT: "",
            is_Permanent: "",
            on_leave: "Available",
            phone: "",
          })
        } else if (newDriver.status === 406) {
          alert("Driver Already Exists");
        } else {
          console.log("Error in Adding New Driver");
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <>
      <Row>
        <Header />
        <Col md={2}><NavSidebar /></Col>
        <Col md={9}>
          <div>
            <Row>
              <Col md={2}></Col>
              <Col md={12}>
                <h6 className="fw-bold">Add Driver</h6>
                <hr className="vehicle-horizontal-line" />
                <div className="m-3 p-2" style={{ backgroundColor: 'white' }}>
                  <h6><FontAwesomeIcon icon={faBus} /> Driver Details</h6>
                  <hr className="vehicle-horizontal-line" />
                  <Form>
                    {/* --------------------- section 1 ---------------------*/}
                    <Form.Group className="my-4">
                      <h6 className="fw-bold">1. Personal Information</h6>
                      <Row className="mt-2">
                        <Col>
                          <Form.Label className="mb-1" style={{ fontSize: "14px" }}>Employee Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="EmployeeName"
                            placeholder="Enter Employee Name"
                            onChange={e => setDriverData({ ...driverData, EmployeeName: e.target.value })}
                            value={driverData.EmployeeName}
                          />
                        </Col>
                        <Col>
                          <Form.Label className="mb-1" style={{ fontSize: "14px" }}>G- Number</Form.Label>
                          <Form.Control
                            type="text"
                            name="PEN"
                            placeholder="Enter PEN"
                            onChange={e => setDriverData({ ...driverData, PEN: e.target.value })}
                            value={driverData.PEN}
                          />
                        </Col>
                      </Row>
                      <Row className="mt-2">
                        <Col>
                          <Form.Label className="mb-1" style={{ fontSize: "14px" }}>Designation</Form.Label>
                          <Form.Control
                            type="text"
                            name="Designation"
                            placeholder="Enter Designation"
                            onChange={e => setDriverData({ ...driverData, Designation: e.target.value })}
                            value={driverData.Designation}
                          />
                        </Col>
                        <Col>
                          <Form.Label className="mb-1" style={{ fontSize: "14px" }}>UNIT</Form.Label>
                          <Form.Control
                            type="text"
                            name="UNIT"
                            placeholder="Enter Unit"
                            onChange={e => setDriverData({ ...driverData, UNIT: e.target.value })}
                            value={driverData.UNIT}
                          />
                        </Col>
                      </Row>
                    </Form.Group>

                    {/* --------------------- section 2 ---------------------*/}
                    <Form.Group className="my-4">
                      <h6 className="fw-bold">2. Employment Information</h6>
                      <Row className="mt-2">
                        <Col>
                          <Form.Label className="mb-1" style={{ fontSize: "14px" }}>Employment Type</Form.Label>
                          <Form.Control
                            as="select"
                            onChange={e => setDriverData({ ...driverData, is_Permanent: e.target.value })}
                            value={driverData.is_Permanent}>
                            <option disabled value="">Select Employment Type</option>
                            <option value="Permanent">Permanent</option>
                            <option value="Badli">Badli</option>
                          </Form.Control>
                        </Col>
                        <Col>
                          <Form.Label className="mb-1" style={{ fontSize: "14px" }}>Leave Status</Form.Label>
                          <Form.Control
                            as="select"
                            onChange={e => setDriverData({ ...driverData, on_leave: e.target.value })}
                            value={driverData.on_leave}>
                            <option value="Available">Available</option>
                            <option value="Leave">Leave</option>
                          </Form.Control>
                        </Col>
                      </Row>
                    </Form.Group>

                    {/* --------------------- section 3 ---------------------*/}
                    <Form.Group className="my-4">
                      <h6 className="fw-bold">3. Contact Information</h6>
                      <Row className="mt-2">
                        <Col>
                          <Form.Label className="mb-1" style={{ fontSize: "14px" }}>Phone Number</Form.Label>
                          <Form.Control
                            type="text"
                            className='w-50'
                            name="phone"
                            placeholder="Enter Phone Number"
                            onChange={e => setDriverData({ ...driverData, phone: e.target.value })}
                            value={driverData.phone}
                          />
                        </Col>
                      </Row>
                    </Form.Group>

                    <hr className="vehicle-horizontal-line" />
                    <div className="mt-4 text-end">
                      <Button className="btn tbn rounded me-2" onClick={handleCancel} style={{ backgroundColor: '#f8f9fa', color: 'black' }}>
                        <FontAwesomeIcon className="me-2" icon={faXmark} />Cancel
                      </Button>
                      <Button
                        className="btn tbn rounded"
                        style={{ backgroundColor: '#0d8a72' }}
                        onClick={handleAddnewDriver}>
                        Add Driver
                      </Button>
                    </div>
                  </Form>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
        <Col md={1}></Col>
      </Row>
    </>
  );
};

export default AddDriver;
