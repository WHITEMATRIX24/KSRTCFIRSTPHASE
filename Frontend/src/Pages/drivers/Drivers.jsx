import { faBan, faChevronLeft, faChevronRight, faCircleCheck, faEllipsisVertical, faGear, faLocationDot, faPlus, faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react'
import Header from '../../components/common/Header';
import NavSidebar from '../../components/common/Sidebar/NavSidebar';
import { useNavigate } from 'react-router-dom';
import { editLeaveStatusDriver, getAllDrivers } from '../../services/allAPI';
import { Button, Form, Modal } from 'react-bootstrap';

const Drivers = () => {
  const [selectedDriver, setSelectedDriver] = useState("All Drivers");
  const [leaveStatus, setLeaveStatus] = useState("allstatus");

  const [activeStatus, setActiveStatus] = useState('ALL STATUSES');
  const [employmentType, setEmploymentType] = useState('Employment Type');
  const [status, setStatus] = useState('Status');
  const [driverData, setDriverData] = useState([]);
  const [editleave, setEditLeave] = useState({ on_leave: "" });
  const [show, setShow] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // console.log(activeStatus);

  const handleClose = () => setShow(false);
  const handleShow = (driver) => {
    setCurrentId(driver.driver_id);
    setEditLeave({ on_leave: driver.on_leave || "" }); // Initialize with current status
    setShow(true);
  };

  const handleLeaveStatus = async (on_leave) => {
    const reqBody = { on_leave };
    console.log("reqBody", reqBody);


    try {
      const editStatus = await editLeaveStatusDriver(currentId, reqBody); // Use currentId directly

      if (editStatus.status === 200) {
        setEditLeave(editStatus.data);
        await handleAllDriverData(); // Refresh the conductor data
        handleClose();
      } else {
        console.log("Error at EditLeaveStatus:::::", editStatus);
      }
    } catch (err) {
      console.log("Error during the request:", err);
    }
  };

  const handleAllDriverData = async () => {
    try {
      const allDriver = await getAllDrivers();
      if (allDriver.status == 200) {
        console.log(allDriver.data);
        setDriverData(allDriver.data);
      } else {
        console.log("Error in fetching Driver Details:::::");

      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    handleAllDriverData();
  }, [])




  const navigate = useNavigate();
  const handleAddDriver = () => {
    navigate("/add-driver")
  }
  const filter = (status) => {
    setActiveStatus(status)
    setLeaveStatus('allstatus')
  }
  return (
    <>
      <div className="row">
        <Header />
        <div className="col-md-2">
          <NavSidebar />
        </div>
        <div className="col-md-9">
          <div className='d-flex justify-content-between my-1 mx-3'>
            <h4>Drivers</h4>

            <button className='btn btn-success' onClick={handleAddDriver} style={{ backgroundColor: '#0d8a72', color: 'white' }}> <FontAwesomeIcon className='me-2' icon={faPlus} />ADD DRIVERS</button>

          </div>

          <hr className='vehicle-horizontal-line' />

          <div className='d-flex'>
            {['ALL STATUSES', 'LEAVE STATUS', 'PERMANENT', 'TEMPORARY'].map((status, index) => (
              status === 'LEAVE STATUS' ? (
                <div key={status} className="btn-group me-2">
                  <button
                    className="btn dropdown-toggle"
                    style={{ borderBottom: activeStatus === status ? '3px solid green' : 'none' }}
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {status.toUpperCase()}
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <button className="dropdown-item" onClick={() => setLeaveStatus('allstatus')} >Leave Status</button>
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={() => setLeaveStatus('Available')} >Available</button>
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={() => setLeaveStatus('Leave')}>On Leave</button>
                    </li>

                  </ul>

                </div>
              ) : (
                <button
                  key={index}
                  className="btn me-md-2"
                  style={{ borderBottom: activeStatus === status ? '3px solid green' : 'none' }}
                  onClick={() => filter(status)}
                >
                  {status}
                </button>
              )
            ))}
          </div>


          <hr className='vehicle-horizontal-line' />

          <div className='container-fluid'>

            {/* filter */}
            <div className='d-flex justify-content-between py-2'>
              <div>
                <div className="btn-group">
                  <button
                    type="button"
                    className="btn btn-light border-dark border-1 dropdown-toggle rounded px-4 me-2"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {selectedDriver}
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => setSelectedDriver("All Drivers")}
                      >
                        All Drivers
                      </button>
                    </li>
                    {driverData.map((driver) => (
                      <li key={driver._id}>
                        <button
                          className="dropdown-item"
                          onClick={() => setSelectedDriver(`${driver.first_name} ${driver.last_name}`)}
                        >
                          {driver.first_name} {driver.last_name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="btn-group">
                  <button type="button" className="btn btn-light border-dark border-1 dropdown-toggle rounded px-4 me-2" data-bs-toggle="dropdown" aria-expanded="false" >{employmentType}</button>
                  <ul className="dropdown-menu">
                    <li><a className="dropdown-item" onClick={() => setEmploymentType('Employment Type')}>Employment Type</a></li>
                    <li><a className="dropdown-item" onClick={() => setEmploymentType('Permanent')}>Permanent</a></li>
                    <li><a className="dropdown-item" onClick={() => setEmploymentType('Temporary')}>Temporary</a></li>

                  </ul>
                </div>
                <div className="btn-group">
                  <button type="button" className="btn btn-light border-dark border-1 dropdown-toggle rounded px-4" data-bs-toggle="dropdown" aria-expanded="false" >{status}</button>

                  <ul className="dropdown-menu">
                    <li><a className="dropdown-item" onClick={() => setStatus('Status')}>Status</a></li>
                    <li><a className="dropdown-item" onClick={() => setStatus('Available')}>Available</a></li>
                    <li><a className="dropdown-item" onClick={() => setStatus('Leave')}>On Leave</a></li>

                  </ul>
                </div>
              </div>
              <div>
                <button className="btn btn-light border-dark rounded" onClick={() => {
                  setActiveStatus('ALL STATUSES');
                  setEmploymentType('Employment Type');
                  setStatus('Status');
                  setSelectedDriver("All Drivers");
                }}> <FontAwesomeIcon className='me-2' icon={faXmark} />CLEAR</button>
              </div>
            </div>

            <hr className='vehicle-horizontal-line' />
            <div className="d-flex justify-content-between align-items-center mt-3">
              {/* Left - gear and trash icons */}
              <div className="d-flex gap-5 ms-5">
                {/* <FontAwesomeIcon icon={faGear} />
                <FontAwesomeIcon icon={faTrashCan} /> */}
              </div>

              {/* Right - Items on page, dropdown, pagination */}
              <div className="d-flex gap-4 align-items-center me-5">
                <p className="mb-0">Items on page</p>
                <div className="btn-group">
                  <button type="button" className="btn btn-light dropdown-toggle rounded px-4" data-bs-toggle="dropdown" aria-expanded="false" >10</button>
                  <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="#">20</a></li>
                    <li><a className="dropdown-item" href="#">30</a></li>
                  </ul>
                </div>
                <FontAwesomeIcon icon={faChevronLeft} />
                <FontAwesomeIcon icon={faChevronRight} />
              </div>
            </div>

            <div>
              <table className="vehicle-table table w-100">
                <thead>
                  <tr>
                    <th> {/*checkbox */}</th>
                    <th> {/*image */}</th>
                    <th>DRIVER NAME</th>
                    <th>EMPLOYMENT TYPE</th>
                    <th>STATUS</th>
                    <th>SALARY</th>
                    <th>PHONE NUMBER</th>
                    <th> {/*for map */} </th>
                    <th> {/*for delete option */}</th>
                  </tr>
                </thead>
                <tbody>
                  {driverData
                    .filter((driver) => {
                      const nameMatch =
                        selectedDriver === "All Drivers" ||
                        `${driver.first_name} ${driver.last_name}` === selectedDriver;

                      const statusMatch = activeStatus === "ALL STATUSES" ||
                        (activeStatus === "LEAVE STATUS" && driver.on_leave === status) ||
                        (activeStatus === "PERMANENT" && driver.is_permanent === "Permanent") ||
                        (activeStatus === "TEMPORARY" && driver.is_permanent === "Temporary");

                      const employmentMatch = employmentType === "Employment Type" || driver.is_permanent === employmentType;
                      const leaveStatusMatch = status === "Status" || driver.on_leave === status;

                      return nameMatch && statusMatch && employmentMatch && leaveStatusMatch;
                    })
                    .filter((driver) => leaveStatus == 'allstatus' ? true : leaveStatus == driver.on_leave)
                    .map((driver) => (
                      <tr key={driver._id}>
                        <td>
                          <input type="checkbox" />
                        </td>
                        <td>
                          <img src="https://english.mathrubhumi.com/image/contentid/policy:1.5293129:1644566410/image.jpg?$p=0f6e831&f=4x3&w=1080&q=0.8" alt="" height={'50px'} width={'50px'} />
                        </td>
                        <td>
                          <strong>{driver.first_name} {driver.last_name}</strong>
                          <br />
                          <span>{driver.license_number}</span>
                        </td>

                        <td>
                          {driver.is_permanent}
                        </td>

                        <td>
                          <div className='bg-light p-2 rounded' style={{ borderRadius: '8px', display: 'inline-block' }}>
                            {driver.on_leave == "Available" ?
                              (
                                <FontAwesomeIcon icon={faCircleCheck} style={{ color: '#189be3' }} />
                              )
                              :
                              (
                                <FontAwesomeIcon icon={faBan} style={{ color: '#db5c4d' }} />
                              )
                            }
                            {driver.on_leave}


                            <span className="ms-2">{driver.status}</span>
                          </div>
                        </td>

                        <td>
                          <div className=' p-2' style={{ borderRadius: '8px', display: 'inline-block' }}>
                            ₹ INR 22,000
                          </div>
                        </td>

                        <td>
                          {driver.contact_info.phone}
                        </td>

                        <td>
                          <button className='btn-primary rounded p-1 px-3' style={{ backgroundColor: '#0d8a72', color: 'white', border: 'none' }}
                            onClick={() => handleShow({ driver_id: driver._id })}>Edit</button>
                        </td>

                        {/* ::::::::::::Modal Section:::::::: */}
                        <Modal show={show} onHide={handleClose} animation={false} >
                          <Modal.Header closeButton>
                            <Modal.Title>Edit Leave Status</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <Form.Control as="select"
                              value={editleave.on_leave}
                              onChange={e => setEditLeave({ ...editleave, on_leave: e.target.value })} >
                              <option disabled value="">
                                Select Status
                              </option>
                              <option value={'Leave'}>Leave</option>
                              <option value={'Available'}>Available</option>
                            </Form.Control>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                              Close
                            </Button>
                            <Button variant="primary"
                              onClick={() => handleLeaveStatus(editleave.on_leave)}
                            >
                              Save Changes
                            </Button>
                          </Modal.Footer>
                        </Modal>



                        <td>
                          <FontAwesomeIcon icon={faEllipsisVertical} />
                        </td>

                      </tr>
                    ))}
                  {/* )) : <div><p>Nothing to Display</p></div>} */}

                </tbody>
              </table>

            </div>
          </div>
        </div>
        <div className="col-md-1"></div>
      </div>
    </>
  )
}

export default Drivers