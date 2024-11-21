import React, { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBus, faXmark } from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/common/Header';
import NavSidebar from '../../components/common/Sidebar/NavSidebar';
import { addNewConductor } from '../../services/allAPI';

const AddConductor = () => {
  const [conductorData, setConductorData] = useState({
    EmployeeName: "",
    PEN: "",
    Designation: "",
    UNIT: "",
    is_permanent: "", // Employment Type
    contact_info: { phone: "" },
    on_leave: "Available", // default value
  });

  const handleAddnewConductor = async () => {
    const { EmployeeName, PEN, Designation, UNIT, is_permanent, contact_info: { phone }, on_leave } = conductorData;

    if (!EmployeeName || !PEN || !Designation || !UNIT || !phone || !is_permanent) {
      alert("Please fill the empty fields");
    } else {
      const newConductor = await addNewConductor(conductorData);
      if (newConductor.status === 201) {
        alert("New Conductor Added Successfully");
        // Reset conductorData after successful addition, except is_permanent
        setConductorData(prevState => ({
          EmployeeName: "",
          PEN: "",
          Designation: "",
          UNIT: "",
          is_permanent: prevState.is_permanent, // Keep Employment Type
          contact_info: { phone: "" },
          on_leave: "Available",
        }));
      } else if (newConductor.status === 406) {
        alert("Conductor Already Exists");
      } else {
        console.log("Error in Adding new Conductor");
      }
    }
  };

  const handleCancel = () => {
    // Preserve is_permanent and reset other fields
    setConductorData(prevState => ({
      EmployeeName: "",
      PEN: "",
      Designation: "",
      UNIT: "",
      is_permanent: prevState.is_permanent, // Keep Employment Type
      contact_info: { phone: "" },
      on_leave: "Available",
    }));
  };
  
  return (
    <>
      <Row>
        <Header />
        <Col md={2}>
          <NavSidebar />
        </Col>
        <Col md={9}>
          <div>
            <Row>
              <Col md={2}></Col>
              <Col md={12}>
                <h6 className='fw-bold'>Add Conductors</h6>
                <hr className='vehicle-horizontal-line' />
                <div className='m-3 p-2' style={{ backgroundColor: 'white' }}>
                  <h6><FontAwesomeIcon icon={faBus} /> Conductor Details</h6>
                  <hr className='vehicle-horizontal-line' />
                  <Form>
                    {/* --------------------- section 1 ---------------------*/}
                    <Form.Group className="my-4">
                      <h6 className='fw-bold'>1. Personal Information</h6>
                      <Row className="mt-2">
                        <Col>
                          <Form.Label className="mb-1" style={{ fontSize: "14px" }}>Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder='Enter Name'
                            value={conductorData.EmployeeName}
                            onChange={e => setConductorData({ ...conductorData, EmployeeName: e.target.value })}
                          />
                        </Col>
                        <Col>
                          <Form.Label className="mb-1" style={{ fontSize: "14px" }}>G- Number</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder='Enter PEN'
                            value={conductorData.PEN}
                            onChange={e => setConductorData({ ...conductorData, PEN: e.target.value })}
                          />
                        </Col>
                      </Row>
                      <Row className="mt-2">
                        <Col>
                          <Form.Label className="mb-1" style={{ fontSize: "14px" }}>Designation</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder='Enter Designation'
                            value={conductorData.Designation}
                            onChange={e => setConductorData({ ...conductorData, Designation: e.target.value })}
                          />
                        </Col>
                        <Col>
                          <Form.Label className="mb-1" style={{ fontSize: "14px" }}>UNIT</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder='Enter UNIT'
                            value={conductorData.UNIT}
                            onChange={e => setConductorData({ ...conductorData, UNIT: e.target.value })}
                          />
                        </Col>
                      </Row>
                    </Form.Group>

                    {/* ----------------section 2---------------- */}
                    <Row className='mt-2 mb-4'>
                      <h6 className='fw-bold mt-2'>2. Contact Information</h6>
                      <Col>
                        <Form.Label className="mb-1" style={{ fontSize: "14px" }}>Mobile No</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder='Enter Mobile No'
                          value={conductorData.contact_info.phone}
                          onChange={e => setConductorData({
                            ...conductorData,
                            contact_info: { phone: e.target.value }
                          })}
                        />
                      </Col>
                      <Col>
                        <Col>
                          <Form.Label className="mb-1" style={{ fontSize: "14px" }}>Employment Type</Form.Label>
                          <Form.Control
                            as="select"
                            value={conductorData.is_permanent}
                            onChange={e => setConductorData({ ...conductorData, is_permanent: e.target.value })}
                          >
                            <option value="" disabled>Select Employment Type</option>
                            <option value="Permanent">Permanent</option>
                            <option value="Badli">Badli</option>
                          </Form.Control>
                        </Col>
                      </Col>
                    </Row>

                    {/* ----------------section 3-------------------- */}
                    <Row className="mt-2">
                    </Row>

                    <hr className='vehicle-horizontal-line' />
                    <div className="mt-4 text-end">
                      <Button
                        type='button'
                        className='btn tbn rounded me-2'
                        style={{ backgroundColor: '#f8f9fa', color: 'black' }}
                        onClick={handleCancel}  // Clears the form but keeps is_permanent
                      >
                        <FontAwesomeIcon className='me-2' icon={faXmark} />Cancel
                      </Button>
                      <Button
                        className='btn tbn rounded'
                        style={{ backgroundColor: '#0d8a72' }}
                        onClick={handleAddnewConductor}
                      >
                        Add Conductor
                      </Button>
                    </div>
                  </Form>
                </div>
              </Col>
              <Col md={1}></Col>
            </Row>
          </div>
        </Col>
        <Col md={1}></Col>
      </Row>
    </>
  );
};

export default AddConductor;
