import { faBan, faChevronLeft, faChevronRight, faCircleCheck, faEllipsisVertical, faGear, faLocationDot, faPlus, faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react'
import Header from '../../components/common/Header';
import { useNavigate } from 'react-router-dom';
import { deleteMultipleConductorsAPI, deleteSingleConductorAPI, editLeaveStatusConductor, getAllConductor } from '../../services/allAPI';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';

const Conductors = () => {

  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filteredConductors, setFilteredConductors] = useState([]);
  const [leaveStatus, setLeaveStatus] = useState("allstatus");
  const [searchConductor, setSearchConductor] = useState("")
  const [showDeleteId, setShowDeleteId] = useState(null);
  const [activeStatus, setActiveStatus] = useState('ALL STATUSES');
  const [employmentType, setEmploymentType] = useState('Employment Type');
  const [status, setStatus] = useState('Status');
  const [conductorData, setConductorData] = useState([]);
  const [editleave, setEditLeave] = useState({ on_leave: "" });
  const [show, setShow] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // console.log(activeStatus);

  const handleClose = () => setShow(false);
  const handleShow = (conductor) => {
    setCurrentId(conductor.conductor_id);
    setEditLeave({ on_leave: conductor.on_leave || "" }); 
    setShow(true);
  };

  const handleLeaveStatus = async (on_leave) => {
    const reqBody = { on_leave };
    console.log("reqBody", reqBody);


    try {
      const editStatus = await editLeaveStatusConductor(currentId, reqBody); 

      if (editStatus.status === 200) {
        setEditLeave(editStatus.data);
        await handleAllConductorData(); 
        handleClose();
      } else {
        console.log("Error at EditLeaveStatus:::::", editStatus);
      }
    } catch (err) {
      console.log("Error during the request:", err);
    }
  };

  const handleAllConductorData = async () => {
    setLoading(true)
    try {
      const allConductor = await getAllConductor();
      if (allConductor.status == 200) {

        console.log(allConductor.data);
        setConductorData(allConductor.data);
      } else {
        console.log("Error in fetching Conductor Details:::::");

      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false)
    }
  }
  // ------------------------------------------- Delete single Conductor -------------------------------------------
  const handleShowDeleteOptions = (id) => {
    setShowDeleteId((prevId) => (prevId === id ? null : id));
  };

  const handleDeleteSingleConductor = async (conductorId, EmployeeName) => {
    try {
      const result = await deleteSingleConductorAPI(conductorId)
      if (result) {
        alert(`${EmployeeName} deleted`);
        setConductorData((prevData) => prevData.filter(conductor => conductor.conductorId !== conductorId));
      }
    } catch (error) {
      console.error("Error deleting conductor:", error);
      alert("Error deleting conductor. Please try again.");
    }
  };
  //checkbox
  const handleCheckboxChange = (conductorId) => {
    setChecked((prevChecked) => {
      if (prevChecked.includes(conductorId)) {
        // If the conductor ID is already checked, remove it
        return prevChecked.filter(id => id !== conductorId);
      } else {
        // If the conductor ID is not checked, add it
        return [...prevChecked, conductorId];
      }
    });
  };
  console.log(checked);


  // apicall to delete checked conductors
  const handleDeleteSelectedConductors = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete the selected conductors?");
    if (!confirmDelete) {
      setChecked([])
      return;
    }
    try {
      const result = await deleteMultipleConductorsAPI(checked)
      // console.log(result);
      if (result.status == 200) {
        setConductorData((prevData) => prevData.filter(conductor => !checked.includes(conductor._id)));
        setChecked([]);
        alert("Selected conductors deleted successfully.");
      } else {
        alert("error")
      }
    } catch (error) {
      console.error("Error deleting conductors:", error);
      alert("Error deleting conductors. Please try again.");
    }
  };

  // ---------------------- pagination ----------------------
  const displayedConductors = filteredConductors
    .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(0);
  };

  const handlePageClick = (data) => {
    // console.log(data.selected);
    setCurrentPage(data.selected);

  }


  useEffect(() => {
    const updatedFilteredConductors = conductorData
      .filter((conductor) => {
        const statusMatch =
          activeStatus === "ALL STATUSES" ||
          (activeStatus === "LEAVE STATUS" && conductor.on_leave === status) ||
          (activeStatus === "PERMANENT" && conductor.is_Permanent === "Permanent") ||
          (activeStatus === "BADALI" && conductor.is_Permanent === "Badali");

        const employmentMatch = employmentType === "Employment Type" || conductor.is_Permanent === employmentType;
        const leaveStatusMatch = status === "Status" || conductor.on_leave === status;

        return statusMatch && employmentMatch && leaveStatusMatch;
      })
      .filter((conductor) => leaveStatus === 'allstatus' ? true : leaveStatus === conductor.on_leave)
      .filter(
        (conductor) =>
          conductor.EmployeeName.toLowerCase().includes(searchConductor.toLowerCase()) ||
          conductor.PEN.toLowerCase().includes(searchConductor.toLowerCase())
      );
    setFilteredConductors(updatedFilteredConductors);
  }, [conductorData, activeStatus, employmentType, status, leaveStatus, searchConductor]);

  useEffect(() => {
    handleAllConductorData();
  }, []);


  const navigate = useNavigate();
  const handleAddConductor = () => {
    navigate("/add-conductor")
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

        </div>
        <div className="col-md-9">
          <div className='d-flex justify-content-between my-1 mx-3'>
            <h4>Conductors</h4>

            <button className='btn btn-success' onClick={handleAddConductor} style={{ backgroundColor: '#0d8a72', color: 'white' }}> <FontAwesomeIcon className='me-2' icon={faPlus} />ADD CONDUCTORS</button>

          </div>

          <hr className='vehicle-horizontal-line' />

          
          <div className="d-flex">
            {['ALL STATUSES', 'PERMANENT', 'BADALI'].map((status, index) => (

              <button
                key={index}
                className="btn me-md-2"
                style={{ borderBottom: activeStatus === status ? '3px solid green' : 'none' }}
                onClick={() => filter(status)}
              >
                {status.toUpperCase()}
              </button>

            ))}
          </div>
          <hr className='vehicle-horizontal-line' />

          <div className='container-fluid'>

            {/* filter */}
            <div className='d-flex justify-content-between py-2'>
              <div className='d-flex gap-2'>
                
                {/* All conductor search by entering no or name */}
                <div className="btn-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search Conductor by Name or No"
                    style={{ width: '300px' }}
                    value={searchConductor}
                    onChange={(e) => setSearchConductor(e.target.value)}
                  />

                </div>

                
                {/* All conductor search by entering no or name */}
                <Form.Control as="select" value={employmentType} onChange={(e) => setEmploymentType(e.target.value)}>
                  <option disabled value="">
                    Select Employment Type
                  </option>
                  <option value="Employment Type">Employment Type</option>
                  <option value="Permanent">Permanent</option>
                  <option value="Badali">Badali</option>

                </Form.Control>

                <Form.Control as="select" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option disabled value="">
                    Select Status
                  </option>
                  <option value="Status">All Status</option>
                  <option value="Available">Available</option>
                  <option value="Leave">On Leave</option>

                </Form.Control>
                
              </div>
              <div>
                <button className="btn btn-light border-dark rounded" onClick={() => {
                  setActiveStatus('ALL STATUSES');
                  setEmploymentType('Employment Type');
                  setStatus('Status');
                  // setSelectedConductor("All Conductors");
                }}> <FontAwesomeIcon className='me-2' icon={faXmark} />CLEAR</button>
              </div>
            </div>

            <hr className='vehicle-horizontal-line' />
            <div className="d-flex justify-content-between align-items-center mt-3">
              {/* Left - gear and trash icons */}
              <div className="d-flex gap-5 ms-5">
                {/* <FontAwesomeIcon icon={faGear} />
                <FontAwesomeIcon icon={faTrashCan} /> */}
                <FontAwesomeIcon
                  icon={faTrashCan}
                  onClick={checked.length > 0 ? handleDeleteSelectedConductors : null}
                  className={checked.length === 0 ? "text-muted" : ""}
                  style={{ cursor: checked.length > 0 ? "pointer" : "not-allowed" }}
                />
              </div>

              {/* Right - Items on page, dropdown, pagination */}
              <div className="d-flex gap-4 align-items-center me-5">
                <p className="mb-0">Items on page</p>
                <div>
                  <select
                    className="form-select form-select-sm"
                    value={itemsPerPage}
                    onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                  >
                    <option disabled value="">
                      Items per Page
                    </option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={30}>30</option>
                  </select>
                </div>

              </div>
            </div>


            {loading ? (
              <div className="text-center text-danger d-flex align-items-center justify-content-center" style={{height:'50vh'}}>
                <h4>Loading<Spinner className='ms-2' animation="border" variant="danger" /></h4>
              </div>
            ) : (

              <div>
                <table className="vehicle-table table w-100">
                  <thead>
                    <tr>
                      <th> {/*checkbox */}</th>
                      <th>S.No</th>
                      <th> {/*image */}</th>
                      <th>CONDUCTOR NAME</th>
                      <th>DESIGNATION</th>
                      <th>EMPLOYMENT TYPE</th>
                      <th>STATUS</th>
                      <th> {/*for map */} </th>
                      <th> {/*for delete option */}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedConductors

                      .map((conductor, index) => (
                        <tr key={conductor._id}>
                          <td>
                            <input
                              type="checkbox"
                              checked={checked.includes(conductor._id)}
                              onChange={() => handleCheckboxChange(conductor._id)} // Handle checkbox change
                            />
                          </td>
                          <td>{currentPage * itemsPerPage + index + 1}</td>
                          <td>
                            <img src="https://english.mathrubhumi.com/image/contentid/policy:1.5293129:1644566410/image.jpg?$p=0f6e831&f=4x3&w=1080&q=0.8" alt="" height={'50px'} width={'50px'} />
                          </td>
                          <td>
                            <strong>{conductor.EmployeeName}</strong>

                            <br />
                            <span>{conductor.PEN}</span>
                          </td>
                          <td>
                            {conductor["Designation "]}

                          </td>

                          <td>
                            {conductor.is_Permanent}
                          </td>

                          <td>
                            <div className='bg-light p-2 rounded' style={{ borderRadius: '8px', display: 'inline-block' }}>
                              {conductor.on_leave == "Available" ?
                                (
                                  <FontAwesomeIcon icon={faCircleCheck} style={{ color: '#189be3' }} />
                                )
                                :
                                (
                                  <FontAwesomeIcon icon={faBan} style={{ color: '#db5c4d' }} />
                                )
                              }
                              {conductor.on_leave}


                              <span className="ms-2">{conductor.status}</span>
                            </div>
                          </td>

                        
                          <td>
                            <button className='btn-primary rounded p-1 px-3' style={{ backgroundColor: '#0d8a72', color: 'white', border: 'none' }}
                              onClick={() => handleShow({ conductor_id: conductor._id })}>Edit</button>
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
                            <div style={{ position: "relative", width: "100px" }}>
                              <FontAwesomeIcon
                                icon={faEllipsisVertical}
                                style={{ cursor: "pointer" }}
                                onClick={() => handleShowDeleteOptions(conductor._id)}
                              />
                              {showDeleteId === conductor._id && (
                                <button
                                  className="btn btn-danger"
                                  style={{ position: "absolute", top: 10, right: 10, zIndex: 10 }}
                                  onClick={() => handleDeleteSingleConductor(conductor._id, conductor.EmployeeName)}
                                >
                                  Delete
                                </button>
                              )}
                            </div>{" "}
                          </td>

                        </tr>
                      ))}
                    {/* )) : <div><p>Nothing to Display</p></div>} */}

                  </tbody>
                </table>




                {/* pagination */}
                <ReactPaginate
                  previousLabel={'Previous'}
                  nextLabel={'Next'}
                  breakLabel={'...'}
                  pageCount={Math.ceil(filteredConductors.length / itemsPerPage)}
                  marginPagesDisplayed={3}

                  pageRangeDisplayed={3}
                  onPageChange={handlePageClick}
                  containerClassName={'pagination justify-content-center'}
                  pageClassName={'page-item'}
                  pageLinkClassName={'page-link'}
                  previousClassName={'page-item'}
                  previousLinkClassName={'page-link'}
                  nextClassName={'page-item'}
                  nextLinkClassName={'page-link'}
                  breakClassName={'page-item'}
                  breakLinkClassName={'page-link'}
                  activeClassName={"active"}
                />
              </div>)}
          </div>
        </div>
        <div className="col-md-1"></div>
      </div>
    </>
  )
}

export default Conductors