import React from 'react'
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import {
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import Header from "../../components/common/Header";
import {
getAllVehicles,
} from "../../services/allAPI";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ReactPaginate from "react-paginate";


export default function Maintenance() {
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [loading, setLoading] = useState(false);
    // const [show, setShow] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    // const [searchVehicle, setSearchVehicle] = useState("");
    const [vehiclesData, setVehiclesData] = useState([]);
    const [activeStatus, setActiveStatus] = useState("Daily Maintenance");
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    // const [vehicleType, setVehicleType] = useState("All Types");
    // const [dockDetails, setDockDetails] = useState({
    //   dock_depot: "",
    //   dock_reason: "",
    //   status: "dock",
    // });
   
    // api to get all vechicles
    const getAllVehiclesData = async () => {
      setLoading(true);
      try {
        const allVehicles = await getAllVehicles();
        // console.log(allVehicles.data);
        if (allVehicles.status == 200) {
          setVehiclesData(allVehicles.data);
        } else {
          console.log("Something went wrong");
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    // console.log(vehiclesData);
  
   
  
    // console.log("vehicleData",vehiclesData);
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
  
    useEffect(() => {
      const fetchData = async () => {
        await getAllVehiclesData();
      };
      fetchData();
    }, []);
  
    useEffect(() => {
      const updatedFilteredVehicles = vehiclesData
        .filter(
          (vehicle) =>
            activeStatus === "Daily Maintenance" || vehicle.maintenance_data.weekleyMaintenanceUpdateStatus
        )
       
        // console.log(activeStatus);
        console.log(updatedFilteredVehicles);
        
      setFilteredVehicles(updatedFilteredVehicles);
      setCurrentPage(0);
    }, [vehiclesData, activeStatus]);

    // console.log(vehiclesData);
    

  return (
   <>
 <div className="row">
        <Header />
        <div className="col-md-2"></div>
        <div className="col-md-9">
          <div className="d-flex justify-content-between my-3 mx-3">
            <h4>Maintenance</h4>
            { 
               activeStatus=="Daily Maintenance"?
                        
            <button
              className="btn"
              style={{ backgroundColor: "#0d8a72", color: "white" }}
              onClick={handleShow}
            >
              {" "}
              <FontAwesomeIcon className="me-2" icon={faPlus} />
              Add Daily Maintenance Details
            </button>:
              <button
              className="btn"
              style={{ backgroundColor: "#0d8a72", color: "white" }}
              onClick={handleShow}
            >
              {" "}
              <FontAwesomeIcon className="me-2" icon={faPlus} />
            Add Weekly Maintenance Details
            </button>
            }
          </div>

          <hr className="vehicle-horizontal-line" />

          <div className="d-flex">
            {["Daily Maintenance","Weekly Maintenance"].map(
              (status) => (
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
              )
            )}
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
                    {[10, 20, 30].map((size) => (
                      <li key={size}>
                        <a
                          className="dropdown-item"
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
                    <th> {/*checkbox */}</th>
                    <th> {/*image */}</th>
                    <th>VEHICLE</th>
                    <th>TYPE</th>
                    {/* <th>STATUS</th> */}
                    <th>
                        {
                            activeStatus=="Daily Maintenance"?`DAILY MAINTENANCE  SATUS`:`WEEKLY MAINTENANCE SATUS`
                        }
                    </th>
                    {
                        activeStatus=="Daily Maintenance"?
                        <></>:
                        <th>Due Date</th>
                     }
                    <th> {/*for update */} </th>
                    {/* <th>REMARKS</th> */}
                    <th> {/*for delete option */}</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedVehicles.map((vehicle) => (
                    <tr key={vehicle._id}>
                      <td>
                        {" "}
                        <input type="checkbox" />{" "}
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
                        {
                            activeStatus=="Daily Maintenance"?
                            vehicle.maintenance_data.dailyMaintenanceUpdateStatus?"maintained":"require maintenance"
                            :vehicle.maintenance_data.weekleyMaintenanceUpdateStatus?"maintained":"require maintenance"
                        }
                     </td>
                     {
                        activeStatus=="Daily Maintenance"?
                        <></>:
                        <td>{vehicle.maintenance_data.weeklyMaintenanceDueDate?.split("T")[0]}</td>
                     }
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
      <Modal show={show} onHide={handleClose} size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>{activeStatus=="Daily Maintenance"?' Examination for Daily Maintenance Details':' Examination for Weekly Maintenance Details'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
   </>
  )
}
