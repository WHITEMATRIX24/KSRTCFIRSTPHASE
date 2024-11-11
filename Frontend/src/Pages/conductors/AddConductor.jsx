import React, { useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBus, faCreditCard, faXmark } from '@fortawesome/free-solid-svg-icons'
import Header from '../../components/common/Header'
import NavSidebar from '../../components/common/Sidebar/NavSidebar'
import { addNewConductor } from '../../services/allAPI'

const AddConductor = () => {
  const [conductorData, setConductorData] = useState({
    first_name: "", last_name: "", gender: "", dob: "",
    is_permanent:"",contact_info: { phone: ""},
  });

  
  const handleAddnewConductor = async () => {
    if (!conductorData) {
      console.error("conductorData is undefined");
      return;
    }
    const { first_name, last_name, gender, dob,is_permanent, contact_info:{phone}} = conductorData;
    console.log("Data:",conductorData);

    if (!first_name || !last_name || !gender || !dob || !phone ||!is_permanent) {
      alert("Please fill the Empty fields");
    } else {
      const newConductor = await addNewConductor(conductorData);
      console.log("newConductoe:",newConductor.data);
      
      if (newConductor.status==201) {
        setConductorData(newConductor.data);
        alert("New Conductor Added SuccessFully:::::");
      } else if(newConductor.status==406){
        alert("Conductor Already Existing:::::");
      }else{
        console.log("Error in Adding new Conductor::::");
      }
    }

  }
  return (
    <>
      <Row>
        <Header />
        <Col md={2}>
          <NavSidebar />
        </Col>
        <Col md={9}>
          <div >
            <Row>
              <Col md={2}></Col>
              <Col md={12} >
                <h6 className='fw-bold'>Add Conductors</h6>
                <hr className='vehicle-horizontal-line' />
                <div className='m-3 p-2' style={{ backgroundColor: 'white' }}>
                  <h6><FontAwesomeIcon icon={faBus} />Conductor Details</h6>
                  <hr className='vehicle-horizontal-line' />
                  <Form>
                    {/* --------------------- section 1 ---------------------*/}
                    <Form.Group className="my-4">
                      <h6 className='fw-bold'>1.Personal Informations</h6>
                      <Row className="mt-2">
                        <Col>
                          <Form.Label className="mb-1" style={{ fontSize: "14px" }}>First Name </Form.Label>
                          <Form.Control type="text" name="firstName" placeholder='Enter First Name'
                            onChange={e => setConductorData({ ...conductorData, first_name: e.target.value })} />
                        </Col>
                        <Col>
                          <Form.Label className="mb-1" style={{ fontSize: "14px" }}> Last Name</Form.Label>
                          <Form.Control type="text" name="lastName" placeholder='Enter Last Name'
                            onChange={e => setConductorData({ ...conductorData, last_name: e.target.value })} />
                        </Col>
                      </Row>
                      <Row className="mt-2">
                        <Col>
                          <Form.Label className="mb-1" style={{ fontSize: "14px" }}>Gender</Form.Label>
                          <Form.Control as="select"
                            value={conductorData.gender || ""}
                            onChange={e => setConductorData({ ...conductorData, gender: e.target.value })}>
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
                            onChange={e => setConductorData({ ...conductorData, dob: e.target.value })} />
                        </Col>
                      </Row>
                      {/* ----------------section 2---------------- */}
                      <Row className='mt-2'>
                        <h6 className='fw-bold mt-2'> 2.Contact Informations</h6>
                        <Col>
                          <Form.Label className="mb-1" style={{ fontSize: "14px" }}>Mobile No </Form.Label>
                          <Form.Control type="text" name="mobileNo"
                            onChange={e=>setConductorData({...conductorData,contact_info:{
                              ...conductorData.contact_info,phone:e.target.value}})} />
                        </Col>
                        <Col>
                        <Form.Label className="mb-1" style={{ fontSize: "14px" }}>Employement Type</Form.Label>
                          <Form.Control as="select"
                            onChange={e => setConductorData({ ...conductorData, is_permanent: e.target.value })}
                            value={conductorData.is_permanent}>
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
                          <Form.Control type="text" name="emergencyNo" />
                        </Col>
                        <Col>
                        {/* <Form.Label className="mb-1" style={{ fontSize: "14px" }}>Vehicle No Plate </Form.Label>
                          <Form.Control type="text" name="firstName" />
                          <Form.Check type="checkbox" label="Only Available" className="mt-2" /> */}
                        </Col>
                      </Row>
                      {/* ---------------- section 3-------------------- */}
                      <Row className='mt-2'>
                        <Col>
                          
                        </Col>
                        <Col>
                         
                        </Col>
                      </Row>
                    </Form.Group>
                    <hr className='vehicle-horizontal-line' />
                    <div className="mt-4 text-end">
                      <Button className='btn tbn rounded me-2' style={{ backgroundColor: '#f8f9fa', color: 'black' }}><FontAwesomeIcon className='me-2' icon={faXmark} />Cancel</Button>
                      <Button className='btn tbn rounded ' style={{ backgroundColor: '#0d8a72' }}
                        onClick={handleAddnewConductor}>
                        Add Conductor</Button>
                    </div>
                  </Form>
                </div>
              </Col>
              <Col md={1}>
              </Col>
            </Row>
          </div>
        </Col>
        <Col md={1}></Col>
      </Row>

    </>
  )
}

export default AddConductor

