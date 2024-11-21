import React from "react";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { faCircleCheck, faPlus } from "@fortawesome/free-solid-svg-icons";
import Header from "../../components/common/Header";
import {
  getAllDailyMaintenanceApi,
  getAllWeeklyMaintenanceApi,
  updateDailyMaintenanceApi,
  updateWeeklyMaintenanceApi,
} from "../../services/allAPI";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ReactPaginate from "react-paginate";
import "./Maintenance.css";
import { dailyMaintenanceChecklist } from "../../assets/weeklyCheckLists";
import { WeeklyMaintenanceChecklist } from "../../assets/dailyCheckLists";

export default function Maintenance() {
  const [userRole, setUserRole] = useState("");
  const [maintenanceDepotName, setMaintenanceDepotName] = useState("");
  const [weeklyData, setWeeklyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [searchBus, setSearchBus] = useState("");
  const [vehicle, setVehicle] = useState({});
  const [weekCheckList, setWeekCheckList] = useState(
    WeeklyMaintenanceChecklist
  );
  const [dailyCheckList, setDailyCheckList] = useState(
    dailyMaintenanceChecklist
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [checkedBy,setCheckedBy]=useState("")
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [show, setShow] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  // const [searchVehicle, setSearchVehicle] = useState("");
  const [activeStatus, setActiveStatus] = useState("Daily Maintenance");
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setSearchBus("");
    setVehicle({});
    setShow(false);
    setDailyCheckList(dailyMaintenanceChecklist);
    setWeekCheckList(WeeklyMaintenanceChecklist);
    setCheckedBy("")
  };
  const handleShow = () => setShow(true);
  // const [vehicleType, setVehicleType] = useState("All Types");
  // const [dockDetails, setDockDetails] = useState({
  //   dock_depot: "",
  //   dock_reason: "",
  //   status: "dock",
  // });

  // ---------------------- pagination ----------------------
  const displayedVehicles = filteredVehicles.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(0);
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const dueOn = (inputDate) => {
    if (!inputDate) {
      return "";
    }
    const targetDate = new Date(inputDate);
    const currentDate = new Date();
    const diffInMS = targetDate - currentDate;
    if (diffInMS < 0) {
      const days = Math.floor(diffInMS / (1000 * 60 * 60 * 24)) * -1;
      return <span className="text-danger">{`${days} days overdue`}</span>;
    } else {
      const days = Math.floor(diffInMS / (1000 * 60 * 60 * 24));
      return <span>{`${days} days left`}</span>;
    }
  };
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
      setUserRole(user.role); 
      setMaintenanceDepotName(user.depoName); 
    }
  }, []);

  useEffect(() => {
    getAllWeaklyData();
    getAllDailyData();
  }, []);

  useEffect(() => {
    let vehiclesToFilter = activeStatus === "Daily Maintenance" ? dailyData : weeklyData;

    if (userRole === "Admin") {
      setFilteredVehicles(vehiclesToFilter);
    } else if (userRole === "Maintenance" || userRole==="Supervisor") {
      const filtered = vehiclesToFilter.filter(vehicle => vehicle.ALLOTEDDEPOT === maintenanceDepotName);
      setFilteredVehicles(filtered);
    }
  }, [activeStatus, dailyData, weeklyData, userRole, maintenanceDepotName]);

  const getAllWeaklyData = async () => {
    try {
      const result = await getAllWeeklyMaintenanceApi();
      if (result.status == 200) {
        setWeeklyData(result.data.allVehicleMaintanenceData);
      } else {
        console.log("Failed to fetch weekly data", result.message);
      }
    } catch (err) {
      console.log("Failed to fetch weekly data", err);
    }
  };

  const getAllDailyData = async () => {
    try {
      const result = await getAllDailyMaintenanceApi();
      if (result.status == 200) {
        setDailyData(result.data.allVehicleMaintanenceData);
      } else {
        console.log("Failed to fetch daily data", result.message);
      }
    } catch (err) {
      console.log("Failed to fetch daily data", err);
    }
  };

  const setBus = async (item) => {
    setSearchBus(item.BUSNO);
    setVehicle(item);
  };

  const handleSubmit = async () => {
    if (!vehicle.BUSNO || !checkedBy) {
      alert("Please Choose Vehicle And Enter the Names of Mechanics");
    } else {
      try {
        const date = new Date().getTime() + 1000 * 60 * 60 * 5.5;
        const dateIst = new Date(date).toISOString();
        if (activeStatus == "Daily Maintenance") {
          const result = await updateDailyMaintenanceApi(dateIst, vehicle._id, checkedBy);
          getAllDailyData();
        } else {
          const result = await updateWeeklyMaintenanceApi(dateIst, vehicle._id, checkedBy);
          getAllWeaklyData();
        }
        handleClose();
      } catch (err) {
        console.log("Failed to update maintenance", err);
      }
    }
  };

  return (
    <>
      <div className="row Maintenance">
        <Header />
        <div className="col-md-2"></div>
        <div className="col-md-9">
          <div className="d-flex justify-content-between my-3 mx-3">
            <h4>Maintenance</h4>
            {activeStatus == "Daily Maintenance" ? (
              <button
                className="btn"
                style={{ backgroundColor: "#0d8a72", color: "white" }}
                onClick={handleShow}
              >
                {" "}
                <FontAwesomeIcon className="me-2" icon={faPlus} />
                Add Daily Maintenance Details
              </button>
            ) : (
              <button
                className="btn"
                style={{ backgroundColor: "#0d8a72", color: "white" }}
                onClick={handleShow}
              >
                {" "}
                <FontAwesomeIcon className="me-2" icon={faPlus} />
                Add Weekly Maintenance Details
              </button>
            )}
          </div>

          <hr className="vehicle-horizontal-line" />

          <div className="d-flex">
            {["Daily Maintenance", "Weekly Maintenance"].map((status) => (
              <button
                key={status}
                className="btn me-md-2"
                style={{
                  borderBottom:
                    activeStatus === status ? "3px solid green" : "none",
                }}
                onClick={() => setActiveStatus(status)}
              >
                {status.toUpperCase()}
              </button>
            ))}
          </div>

          <hr className="vehicle-horizontal-line" />

          <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mt-3">
              {/* Left - gear and trash icons */}
              {/* <div className="d-flex gap-5 ms-5">
                                <FontAwesomeIcon icon={faGear} />
                                <FontAwesomeIcon icon={faTrashCan} />
                            </div> */}

              {/* Right - Items on page, dropdown, pagination */}
              <div className="d-flex gap-4 align-items-center me-5">
                <p className="mb-0">Items on page</p>
                <div className="btn-group">
                  <button
                    type="button"
                    className="btn btn-light dropdown-toggle rounded px-4"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {itemsPerPage}
                  </button>
                  <ul className="dropdown-menu">
                    {[50, 100].map((size) => (
                      <li key={size}>
                        <a
                          className="dropdown-item pointer"
                          onClick={() => handleItemsPerPageChange(size)}
                        >
                          {size}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* <FontAwesomeIcon icon={faChevronLeft} />
                                <FontAwesomeIcon icon={faChevronRight} /> */}
              </div>
            </div>

            {/* filter */}
            <hr className="vehicle-horizontal-line mt-2" />
            {/* table */}
            <div>
              <table className="vehicle-table table w-100 ">
                <thead className="vehicle-thead ">
                  <tr>
                    <th>#</th>
                    <th> {/*image */}</th>
                    <th>VEHICLE</th>
                    <th>TYPE</th>
                    {/* <th>STATUS</th> */}
                    <th>
                      {activeStatus == "Daily Maintenance"
                        ? `DAILY MAINTENANCE  SATUS`
                        : `WEEKLY MAINTENANCE SATUS`}
                    </th>
                    <th>Last Maintained On</th>
                    {activeStatus == "Daily Maintenance" ? (
                      <></>
                    ) : (
                      <th>Due Date</th>
                    )}
                    <th>Checked By</th>
                    <th> {/*for update */} </th>
                    {/* <th>REMARKS</th> */}
                    <th> {/*for delete option */}</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedVehicles.map((vehicle, index) => (
                    <tr key={vehicle._id}>
                      <td>
                        {currentPage * itemsPerPage + index + 1}
                        {/* {" "}
                        <input type="checkbox" />{" "} */}
                      </td>
                      <td>
                        <img
                          src="https://english.mathrubhumi.com/image/contentid/policy:1.5293129:1644566410/image.jpg?$p=0f6e831&f=4x3&w=1080&q=0.8"
                          alt=""
                          height={"50px"}
                          width={"50px"}
                        />
                      </td>
                      <td>
                        <strong>{vehicle.BUSNO}</strong>
                        <br />
                        <span>{vehicle.REGNO}</span>
                      </td>
                      <td>{vehicle.CLASS}</td>
                      <td>
                        {activeStatus == "Daily Maintenance"
                          ? vehicle.maintenance_data
                              .dailyMaintenanceUpdateStatus
                            ? "Maintained"
                            : "Require maintenance"
                          : vehicle.maintenance_data
                              .weekleyMaintenanceUpdateStatus
                          ? "Maintained"
                          : "Require maintenance"}
                      </td>
                      <td>
                        {activeStatus == "Daily Maintenance" ? (
                          <div className="d-flex flex-column">
                            {vehicle.maintenance_data
                              .lastdailyMaintenanceUpdateDate ? (
                              <>
                                <span>
                                  {
                                    vehicle.maintenance_data.lastdailyMaintenanceUpdateDate?.split(
                                      "T"
                                    )[0]
                                  }
                                </span>
                                <span>
                                  {vehicle.maintenance_data.lastdailyMaintenanceUpdateDate
                                    ?.split("T")[1]
                                    .slice(0, 5)}
                                </span>
                              </>
                            ) : (
                              <span>Not yet start maintenance</span>
                            )}
                          </div>
                        ) : (
                          <div className="d-flex flex-column">
                            {vehicle.maintenance_data
                              .lastWeekelyMaintenanceUpdateDate ? (
                              <>
                                <span>
                                  {
                                    vehicle.maintenance_data.lastWeekelyMaintenanceUpdateDate?.split(
                                      "T"
                                    )[0]
                                  }
                                </span>
                                <span>
                                  {vehicle.maintenance_data.lastWeekelyMaintenanceUpdateDate
                                    ?.split("T")[1]
                                    .slice(0, 5)}
                                </span>
                              </>
                            ) : (
                              <span>Not yet start maintenance</span>
                            )}
                          </div>
                        )}
                      </td>
                      {activeStatus == "Daily Maintenance" ? (
                        <></>
                      ) : (
                        <td>
                          {dueOn(
                            vehicle.maintenance_data.weeklyMaintenanceDueDate
                          )}
                        </td>
                      )}
                      {activeStatus == "Daily Maintenance" ? (
                        <td>
                        {
                          vehicle.maintenance_data?.dailyCheckedBY
                        }
                      </td>
                      ) : (
                        <td>
                          {
                            vehicle.maintenance_data.weeklyCheckedBy
                          }
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* pagination */}
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              breakLabel={"..."}
              pageCount={Math.ceil(filteredVehicles.length / itemsPerPage)}
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
        </div>
        <div className="col-md-1"></div>
      </div>

      {/* maitenance details modal */}
      <Modal show={show} className="Maintenance" onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {activeStatus == "Daily Maintenance"
              ? " Examination for Daily Maintenance Details"
              : " Examination for Weekly Maintenance Details"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Vehicle Number"
                value={searchBus}
                onChange={(e) => setSearchBus(e.target.value)}
              />
              <div className="position-absolute w-50 pe-4">
                {filteredVehicles
                  .filter((item) =>
                    !searchBus
                      ? false
                      : item.BUSNO?.toUpperCase().includes(
                          searchBus.toUpperCase()
                        )
                  )
                  .slice(0, 5)
                  .map((item, index) =>
                    searchBus == item.BUSNO ? (
                      <></>
                    ) : (
                      <div
                        key={index}
                        className="form-control pointer"
                        onClick={() => setBus(item)}
                      >
                        {item.BUSNO}
                      </div>
                    )
                  )}
              </div>
            </div>
            <div className="col a-center">
              {vehicle?.BUSNO ? (
                <>
                  {" "}
                  <FontAwesomeIcon
                    className="text-success me-2"
                    icon={faCircleCheck}
                  />{" "}
                  {vehicle.BUSNO}
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
          <h5 className="mt-4">
            {activeStatus == "Daily Maintenance" ? "Daily" : "Weakly"}{" "}
            Maintenace Check List
          </h5>
          <div className="row j-center gap-1 mt-3">
            {activeStatus == "Daily Maintenance"
              ? Object.keys(dailyCheckList).map((item, index) => (
                  <label
                    key={index}
                    htmlFor={item}
                    className="col-4 d-flex j-between form-control w-30 text-greenish pointer a-center h-30"
                  >
                    <span>{item} :</span>
                    <input
                      className="checkBox"
                      id={item}
                      type="checkbox"
                      checked={dailyCheckList[item]}
                      onChange={(e) =>
                        setDailyCheckList({
                          ...dailyCheckList,
                          [item]: e.target.checked,
                        })
                      }
                    />
                  </label>
                ))
              : Object.keys(weekCheckList).map((item, index) => (
                  <label
                    key={index}
                    htmlFor={item}
                    className="col-4 d-flex j-between align-items-center form-control w-30 text-greenish pointer"
                  >
                    <span>{item} </span>
                    <input
                      className="checkBox"
                      id={item}
                      type="checkbox"
                      checked={weekCheckList[item]}
                      onChange={(e) =>
                        setWeekCheckList({
                          ...weekCheckList,
                          [item]: e.target.checked,
                        })
                      }
                    />
                  </label>
                ))}
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <input type="text" className="form-control w-50" placeholder="Checked By" value={checkedBy} onChange={(e)=>setCheckedBy(e.target.value)}/>
          <div className="buttons">
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button
              className="ms-3"
              variant="primary"
              onClick={handleSubmit}
              disabled={
                activeStatus == "Daily Maintenance"
                  ? !Object.values(dailyCheckList).every((item) => item == true)
                  : !Object.values(weekCheckList).every((item) => item == true)
              }
            >
              Update
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}
