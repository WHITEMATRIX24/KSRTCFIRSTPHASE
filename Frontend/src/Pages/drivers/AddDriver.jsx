import React, { useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBus, faCreditCard, faXmark } from '@fortawesome/free-solid-svg-icons'
import Header from '../../components/common/Header'
import NavSidebar from '../../components/common/Sidebar/NavSidebar'
import { addNewDriver } from '../../services/allAPI'

const AddDriver = () => {
  const [driverData, setDriverData] = useState({
    first_name: "", last_name: "", gender: "", dob: "",
    is_permanent: "", contact_info: { phone: "" },
    license_number: "", emergency_contact: ""
  });


  const handleAddnewDriver = async () => {
    if (!driverData) {
      console.error("driverData is undefined");
      return;
    }
    const { first_name, last_name, gender, dob, license_number, is_permanent, contact_info: { phone }, emergency_contact } = driverData;

    if (!first_name || !last_name || !gender || !dob || !phone || !license_number || !is_permanent || !emergency_contact) {
      alert("Please fill the Empty fields");
    } else {
      try {
        const newDriver = await addNewDriver(driverData);
        if (newDriver.status == 201) {
          console.log(newDriver.data);
          setDriverData(newDriver.data);
          alert("New Conductor Added SuccessFully:::::");
        } else if (newDriver.status == 406) {
          alert(" Conductor Already Existing:::::")

        }
        else {
          console.log("Error in Adding new Driver:::::::");
        }
      } catch (err) {
        console.log(err);
      }
    }

  }
  return (
    <>
      <Row>
        <Header />
        <Col md={2}><NavSidebar /></Col>
        <Col md={9}><div >
          <Row>
            <Col md={2}></Col>
            <Col md={12} >
              <h6 className='fw-bold'>Add Drivers</h6>
              <hr className='vehicle-horizontal-line' />
              <div className='m-3 p-2' style={{ backgroundColor: 'white' }}>
                <h6><FontAwesomeIcon icon={faBus} />Driver Details</h6>
                <hr className='vehicle-horizontal-line' />
                <Form>
                  {/* --------------------- section 1 ---------------------*/}
                  <Form.Group className="my-4">
                    <h6 className='fw-bold'>1.Personal Informations</h6>
                    <Row className="mt-2">
                      <Col>
                        <Form.Label className="mb-1" style={{ fontSize: "14px" }}>First Name </Form.Label>
                        <Form.Control type="text" name="firstName" placeholder='Enter First Name'
                          onChange={e => setDriverData({ ...driverData, first_name: e.target.value })}
                          value={driverData.first_name} />
                      </Col>
                      <Col>
                        <Form.Label className="mb-1" style={{ fontSize: "14px" }}> Last Name</Form.Label>
                        <Form.Control type="text" name="lastName" placeholder='Enter Last Name'
                          onChange={e => setDriverData({ ...driverData, last_name: e.target.value })}
                          value={driverData.last_name} />
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col>
                        <Form.Label className="mb-1" style={{ fontSize: "14px" }}>Gender</Form.Label>
                        <Form.Control as="select"
                          value={driverData.gender || ""}
                          onChange={e => setDriverData({ ...driverData, gender: e.target.value })}>
                          <option disabled value="">
                            Select Gender
                          </option>
                          <option value={"Male"}>Male</option>
                          <option value={"Female"}>Female</option>
                        </Form.Control>
                      </Col>
                      <Col>
                        <Form.Label className="mb-1" style={{ fontSize: "14px" }}>DOB</Form.Label>
                        <Form.Control type="date" placeholder="DOB"
                          onChange={e => setDriverData({ ...driverData, dob: e.target.value })}
                          value={driverData.dob} />
                      </Col>
                    </Row>
                    {/* ----------------section 2---------------- */}
                    <Row className='mt-2'>
                      <h6 className='fw-bold mt-2'> 2.Contact Informations</h6>
                      <Col>
                        <Form.Label className="mb-1" style={{ fontSize: "14px" }}>Mobile No </Form.Label>
                        <Form.Control type="text" name="mobileNo"
                          onChange={e => setDriverData({
                            ...driverData, contact_info: {
                              ...driverData.contact_info, phone: e.target.value
                            }
                          })}
                          value={driverData.contact_info.phone} />
                      </Col>
                      <Col>
                        <Form.Label className="mb-1" style={{ fontSize: "14px" }}>Employement Type</Form.Label>
                        <Form.Control as="select"
                          onChange={e => setDriverData({ ...driverData, is_permanent: e.target.value })}
                          value={driverData.is_permanent}>
                          <option disabled value="">
                            Select
                          </option>
                          <option value={"Permanent"}>Permanent</option>
                          <option value={"Temporary"}>Temporary</option>
                        </Form.Control>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col>
                        <Form.Label className="mb-1" style={{ fontSize: "14px" }}>Emergency Contact No </Form.Label>
                        <Form.Control type="text" name="emergencyNo"
                          onChange={e => setDriverData({ ...driverData, emergency_contact: e.target.value })}
                          value={driverData.emergency_contact} />
                      </Col>
                      <Col>
                        <Form.Label className="mb-1" style={{ fontSize: "14px" }}>License No </Form.Label>
                        <Form.Control type="text" name="licenseNo"
                          onChange={e => setDriverData({ ...driverData, license_number: e.target.value })} />
                      </Col>
                    </Row>
                    {/* ---------------- section 3-------------------- */}
                    <Row className='mt-2'>
                      <Col>

                      </Col>
                      <Col>
                        <Form.Label className="mb-1" style={{ fontSize: "14px" }}> </Form.Label>
                        {/* <Form.Control type="text" name="firstName" />
                        <Form.Check type="checkbox" label="Only Available" className="mt-2" /> */}
                      </Col>
                    </Row>
                  </Form.Group>
                  <hr className='vehicle-horizontal-line' />
                  <div className="mt-4 text-end">
                    <Button className='btn tbn rounded me-2' style={{ backgroundColor: '#f8f9fa', color: 'black' }}><FontAwesomeIcon className='me-2' icon={faXmark} />Cancel</Button>
                    <Button className='btn tbn rounded ' style={{ backgroundColor: '#0d8a72' }}
                      onClick={handleAddnewDriver}>
                      Add Driver</Button>
                  </div>
                </Form>
              </div>
            </Col>
            <Col md={1}>
            </Col>
          </Row>
        </div></Col>
        <Col md={1}></Col>
      </Row>

    </>
  )
}

export default AddDriver

