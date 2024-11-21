import {
  faBan,
  faChevronLeft,
  faChevronRight,
  faCircleCheck,
  faEllipsisVertical,
  faGear,
  faLocationDot,
  faPlus,
  faTrashCan,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import Header from "../../components/common/Header";
import { useNavigate } from "react-router-dom";
import {
  deleteMultipleDriversAPI,
  deleteSingleDriverAPI,
  editLeaveStatusDriver,
  getAllDrivers,
} from "../../services/allAPI";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import ReactPaginate from "react-paginate";

const Drivers = () => {
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [leaveStatus, setLeaveStatus] = useState("allstatus");
  const [searchDriver, setSearchDriver] = useState("");
  const [showDeleteId, setShowDeleteId] = useState(null);
  const [activeStatus, setActiveStatus] = useState("ALL STATUSES");
  const [employmentType, setEmploymentType] = useState("Employment Type");
  const [status, setStatus] = useState("Status");
  const [driverData, setDriverData] = useState([]);
  const [editleave, setEditLeave] = useState({ on_leave: "" });
  const [show, setShow] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // console.log(activeStatus);

  const handleClose = () => setShow(false);
  const handleShow = (driver) => {
    setCurrentId(driver.driver_id);
    setEditLeave({ on_leave: driver.on_leave || "" });
    setShow(true);
  };

  const handleLeaveStatus = async (on_leave) => {
    const reqBody = { on_leave };
    console.log("reqBody", reqBody);

    try {
      const editStatus = await editLeaveStatusDriver(currentId, reqBody);

      if (editStatus.status === 200) {
        setEditLeave(editStatus.data);
        await handleAllDriverData();
        handleClose();
      } else {
        console.log("Error at EditLeaveStatus:::::", editStatus);
      }
    } catch (err) {
      console.log("Error during the request:", err);
    }
  };

  const handleAllDriverData = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };
  // ------------------------------------------- Delete single driver -------------------------------------------
  const handleShowDeleteOptions = (id) => {
    setShowDeleteId((prevId) => (prevId === id ? null : id));
  };

  const handleDeleteSingleDriver = async (driverId, EmployeeName) => {
    try {
      const result = await deleteSingleDriverAPI(driverId);
      if (result) {
        alert(`${EmployeeName} deleted`);
        setDriverData((prevData) =>
          prevData.filter((driver) => driver.driverId !== driverId)
        );
      }
    } catch (error) {
      console.error("Error deleting driver:", error);
      alert("Error deleting driver. Please try again.");
    }
  };

  //checkbox
  const handleCheckboxChange = (driverId) => {
    setChecked((prevChecked) => {
      if (prevChecked.includes(driverId)) {
        return prevChecked.filter((id) => id !== driverId);
      } else {
        return [...prevChecked, driverId];
      }
    });
  };
  console.log(checked);

  // apicall to delete checked drivers
  const handleDeleteSelectedDrivers = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete the selected driver?"
    );
    if (!confirmDelete) {
      setChecked([]);
      return;
    }
    try {
      const result = await deleteMultipleDriversAPI(checked);
      // console.log(result);
      if (result.status == 200) {
        setDriverData((prevData) =>
          prevData.filter((driver) => !checked.includes(driver._id))
        );
        setChecked([]);
        alert("Selected drivers deleted successfully.");
      } else {
        alert("error");
      }
    } catch (error) {
      console.error("Error deleting drivers:", error);
      alert("Error deleting drivers. Please try again.");
    }
  };
  // ---------------------- pagination ----------------------
  const displayedDrivers = filteredDrivers.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(0);
  };

  const handlePageClick = (data) => {
    // console.log(data.selected);
    setCurrentPage(data.selected);
  };

  useEffect(() => {
    const updatedFilteredDrivers = driverData
      .filter((driver) => {
        const statusMatch =
          activeStatus === "ALL STATUSES" ||
          (activeStatus === "LEAVE STATUS" && driver.on_leave === status) ||
          (activeStatus === "PERMANENT" &&
            driver.is_Permanent === "Permanent") ||
          (activeStatus === "BADALI" && driver.is_Permanent === "Badali");

        const employmentMatch =
          employmentType === "Employment Type" ||
          driver.is_Permanent === employmentType;
        const leaveStatusMatch =
          status === "Status" || driver.on_leave === status;

        return statusMatch && employmentMatch && leaveStatusMatch;
      })
      .filter((driver) =>
        leaveStatus === "allstatus" ? true : leaveStatus === driver.on_leave
      )
      .filter(
        (driver) =>
          driver.EmployeeName.toLowerCase().includes(
            searchDriver.toLowerCase()
          ) || driver.PEN.toLowerCase().includes(searchDriver.toLowerCase())
      );
    setFilteredDrivers(updatedFilteredDrivers);
  }, [
    driverData,
    activeStatus,
    employmentType,
    status,
    leaveStatus,
    searchDriver,
  ]);

  useEffect(() => {
    handleAllDriverData();
  }, []);

  const navigate = useNavigate();
  const handleAddDriver = () => {
    navigate("/add-driver");
  };
  const filter = (status) => {
    if (status === "LEAVE STATUS") {
      setActiveStatus("ALL STATUSES");
      setLeaveStatus("allstatus");
    } else {
      setActiveStatus(status);
      setLeaveStatus("allstatus");
    }
  };
  return (
    <>
      <Header />
      <div className="row">
        <div className="col-md-2"></div>
        <div className="col-md-9">
          <div className="d-flex justify-content-between my-1 mx-3">
            <h4>Drivers</h4>

            <button
              className="btn btn-success"
              onClick={handleAddDriver}
              style={{ backgroundColor: "#0d8a72", color: "white" }}
            >
              {" "}
              <FontAwesomeIcon className="me-2" icon={faPlus} />
              ADD DRIVERS
            </button>
          </div>

          <hr className="vehicle-horizontal-line" />

          <div className="d-flex">
            {["ALL STATUSES", "PERMANENT", "BADALI"].map((status, index) => (
              <button
                key={index}
                className="btn me-md-2"
                style={{
                  borderBottom:
                    activeStatus === status ? "3px solid green" : "none",
                }}
                onClick={() => filter(status)}
              >
                {status}
              </button>
            ))}
          </div>

          <hr className="vehicle-horizontal-line" />

          <div className="container-fluid">
            {/* filter */}
            <div className="d-flex justify-content-between py-2">
              <div className="d-flex gap-2">
                {/* All driver search by entering no or name */}
                <div className="btn-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search Driver by Name or No"
                    style={{ width: "270px" }}
                    value={searchDriver}
                    onChange={(e) => setSearchDriver(e.target.value)}
                  />
                </div>

                <Form.Control
                  as="select"
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                >
                  <option disabled value="">
                    Select Employment Type
                  </option>
                  <option value="Employment Type">Employment Type</option>
                  <option value="Permanent">Permanent</option>
                  <option value="Badali">Badali</option>
                </Form.Control>

                <Form.Control
                  as="select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option disabled value="">
                    Select Status
                  </option>
                  <option value="Status">All Status</option>
                  <option value="Available">Available</option>
                  <option value="Leave">On Leave</option>
                </Form.Control>
              </div>
              <div>
                <button
                  className="btn btn-light border-dark rounded"
                  onClick={() => {
                    setActiveStatus("ALL STATUSES");
                    setEmploymentType("Employment Type");
                    setStatus("Status");
                    // setSelectedDriver("All Drivers");
                  }}
                >
                  {" "}
                  <FontAwesomeIcon className="me-2" icon={faXmark} />
                  CLEAR
                </button>
              </div>
            </div>

            <hr className="vehicle-horizontal-line" />
            <div className="d-flex justify-content-between align-items-center mt-3">
              {/* Left - gear and trash icons */}
              <div className="d-flex gap-5 ms-5">
                {/* <FontAwesomeIcon icon={faGear} />
                <FontAwesomeIcon icon={faTrashCan} /> */}
                <FontAwesomeIcon
                  icon={faTrashCan}
                  onClick={
                    checked.length > 0 ? handleDeleteSelectedDrivers : null
                  }
                  className={checked.length === 0 ? "text-muted" : ""}
                  style={{
                    cursor: checked.length > 0 ? "pointer" : "not-allowed",
                  }}
                />
              </div>

              {/* Right - Items on page, dropdown, pagination */}
              <div className="d-flex gap-4 align-items-center me-5">
                <p className="mb-0">Items on page</p>
                <div>
                  <select
                    className="form-select form-select-sm"
                    value={itemsPerPage}
                    onChange={(e) =>
                      handleItemsPerPageChange(Number(e.target.value))
                    }
                  >
                    <option disabled value="">
                      Items per Page
                    </option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>
            </div>

            {loading ? (
              <div
                className="text-center text-danger d-flex align-items-center justify-content-center"
                style={{ height: "50vh" }}
              >
                <h4>
                  Loading
                  <Spinner
                    className="ms-2"
                    animation="border"
                    variant="danger"
                  />
                </h4>
              </div>
            ) : (
              <div>
                <table className="vehicle-table table w-100">
                  <thead>
                    <tr>
                      <th> {/*checkbox */}</th>
                      <th>S.No</th>
                      <th> {/*image */}</th>
                      <th>DRIVER NAME</th>
                      <th>DESIGNATION</th>
                      <th>EMPLOYMENT TYPE</th>
                      <th>STATUS</th>
                      {/* <th>SALARY</th> */}
                      {/* <th>PHONE NUMBER</th> */}
                      <th> {/*for map */} </th>
                      <th> {/*for delete option */}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedDrivers.map((driver, index) => (
                      <tr key={driver._id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={checked.includes(driver._id)}
                            onChange={() => handleCheckboxChange(driver._id)} // Handle checkbox change
                          />
                        </td>
                        <td>{currentPage * itemsPerPage + index + 1}</td>
                        <td>
                          <img
                            src="https://english.mathrubhumi.com/image/contentid/policy:1.5293129:1644566410/image.jpg?$p=0f6e831&f=4x3&w=1080&q=0.8"
                            alt=""
                            height={"50px"}
                            width={"50px"}
                          />
                        </td>
                        <td>
                          <strong>{driver.EmployeeName}</strong>

                          <br />
                          <span>{driver.PEN}</span>
                        </td>
                        <td>{driver["Designation "]}</td>

                        <td>{driver.is_Permanent}</td>

                        <td>
                          <div
                            className="bg-light p-2 rounded"
                            style={{
                              borderRadius: "8px",
                              display: "inline-block",
                            }}
                          >
                            {driver.on_leave == "Available" ? (
                              <FontAwesomeIcon
                                icon={faCircleCheck}
                                style={{ color: "#189be3" }}
                              />
                            ) : (
                              <FontAwesomeIcon
                                icon={faBan}
                                style={{ color: "#db5c4d" }}
                              />
                            )}
                            {driver.on_leave}

                            <span className="ms-2">{driver.status}</span>
                          </div>
                        </td>
                        <td>
                          <button
                            className="btn-primary rounded p-1 px-3"
                            style={{
                              backgroundColor: "#0d8a72",
                              color: "white",
                              border: "none",
                            }}
                            onClick={() =>
                              handleShow({ driver_id: driver._id })
                            }
                          >
                            Edit
                          </button>
                        </td>

                        {/* ::::::::::::Modal Section:::::::: */}
                        <Modal
                          show={show}
                          onHide={handleClose}
                          animation={false}
                        >
                          <Modal.Header closeButton>
                            <Modal.Title>Edit Leave Status</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <Form.Control
                              as="select"
                              value={editleave.on_leave}
                              onChange={(e) =>
                                setEditLeave({
                                  ...editleave,
                                  on_leave: e.target.value,
                                })
                              }
                            >
                              <option disabled value="">
                                Select Status
                              </option>
                              <option value={"Leave"}>Leave</option>
                              <option value={"Available"}>Available</option>
                            </Form.Control>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                              Close
                            </Button>
                            <Button
                              variant="primary"
                              onClick={() =>
                                handleLeaveStatus(editleave.on_leave)
                              }
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
                              onClick={() =>
                                handleShowDeleteOptions(driver._id)
                              }
                            />
                            {showDeleteId === driver._id && (
                              <button
                                className="btn btn-danger"
                                style={{
                                  position: "absolute",
                                  top: 10,
                                  right: 10,
                                  zIndex: 10,
                                }}
                                onClick={() =>
                                  handleDeleteSingleDriver(
                                    driver._id,
                                    driver.EmployeeName
                                  )
                                }
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
                  previousLabel={"Previous"}
                  nextLabel={"Next"}
                  breakLabel={"..."}
                  pageCount={Math.ceil(filteredDrivers.length / itemsPerPage)}
                  marginPagesDisplayed={3}
                  pageRangeDisplayed={3}
                  onPageChange={handlePageClick}
                  containerClassName={"pagination justify-content-center"}
                  pageClassName={"page-item"}
                  pageLinkClassName={"page-link"}
                  previousClassName={"page-item"}
                  previousLinkClassName={"page-link"}
                  nextClassName={"page-item"}
                  nextLinkClassName={"page-link"}
                  breakClassName={"page-item"}
                  breakLinkClassName={"page-link"}
                  activeClassName={"active"}
                />
              </div>
            )}
          </div>
        </div>
        <div className="col-md-1"></div>
      </div>
    </>
  );
};

export default Drivers;
