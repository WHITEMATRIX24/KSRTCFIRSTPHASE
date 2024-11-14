import React, { useEffect, useState } from "react";
import "./vehicles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import {
    faBan,
    faChevronLeft,
    faChevronRight,
    faCircleCheck,
    faEllipsisVertical,
    faGear,
    faLocationArrow,
    faLocationDot,
    faPlus,
    faTrashCan,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Header from "../../components/common/Header";
import { deleteSingleVehicleAPI, getAllVehicles, updateVehicleStatus } from "../../services/allAPI";
import { Button, Form, Modal } from "react-bootstrap";
import ReactPaginate from "react-paginate";

const Vehicles = () => {
    // const [showDocModal, setShowDocModal] = useState(false);

    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [filteredVehicles, setFilteredVehicles] = useState([]);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [searchVehicle, setSearchVehicle] = useState("")
    const [showDeleteId, setShowDeleteId] = useState(null);
    const [vehiclesData, setVehiclesData] = useState([]);
    const [activeStatus, setActiveStatus] = useState("ALL STATUSES");
    const [vehicleType, setVehicleType] = useState("All Types");
    const navigate = useNavigate();

    const getAllVehiclesData = async () => {
        try {
            const allVehicles = await getAllVehicles();
            console.log(allVehicles.data);

            if (allVehicles.status == 200) {
                setVehiclesData(allVehicles.data);
            } else {
                console.log("Something went wrong");
            }
        } catch (err) {
            console.log(err);
        }
    };
    console.log(vehiclesData);


    const handleAddVehicle = () => {
        navigate('/add-vehicle')
    }


    //   vehicle status changer
    const handleChangeVehicleStatus = async (vehicleData, updatedStatusValue) => {
        if (updatedStatusValue === "dock") {
            // Showing the modal if DOCK is selected
            setShow(true)
        } else {

            const vehicleFormData = new FormData();

            vehicleFormData.append("number", vehicleData.number);
            vehicleFormData.append("model", vehicleData.model);
            vehicleFormData.append("status", updatedStatusValue);
            vehicleFormData.append("CLASS", vehicleData.CLASS);
            vehicleFormData.append("odometer", vehicleData.odometer);

            try {
                const res = await updateVehicleStatus(vehicleData._id, vehicleFormData);
                if (res.status === 200) {
                    alert("vehicle status update successfull");
                }
            } catch (error) {
                console.log(`error in updating vehicle status erro: ${error}`);
            }
        }
    };



    // ------------------------------------------- Delete single vehicle -------------------------------------------
    const handleShowDeleteOptions = (id) => {
        setShowDeleteId((prevId) => (prevId === id ? null : id));
    };


    const handleDeleteSingleVehicle = async (vehicleId, BUSNO) => {
        try {
            const result = await deleteSingleVehicleAPI(vehicleId)
            if (result) {
                alert(`Vehicle ${BUSNO} deleted`);
                setVehiclesData((prevData) => prevData.filter(vehicle => vehicle.vehicleId !== vehicleId));
            }

            // Refresh or update list after deletion
        } catch (error) {
            console.error("Error deleting vehicle:", error);
            alert("Error deleting vehicle. Please try again.");
        }
    };

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
        // console.log(data.selected);
        setCurrentPage(data.selected);

    }

    useEffect(() => {
        const updatedFilteredVehicles = vehiclesData
            .filter(vehicle => vehicleType === "All Types" || vehicle.CLASS === vehicleType)
            .filter(vehicle => activeStatus === "ALL STATUSES" || activeStatus === vehicle.status)
            .filter(vehicle =>
                vehicle.BUSNO.toLowerCase().includes(searchVehicle.toLowerCase()) ||
                vehicle.REGNO.toLowerCase().includes(searchVehicle.toLowerCase())
            );

        setFilteredVehicles(updatedFilteredVehicles);
        setCurrentPage(0);
        getAllVehiclesData();
    }, [vehiclesData, activeStatus, vehicleType, searchVehicle]);

    return (
        <>
            <div className="row">
                <Header />
                <div className="col-md-2">

                </div>
                <div className="col-md-9">
                    <div className="d-flex justify-content-between my-1 mx-3">
                        <h4>Vehicles</h4>
                        <button
                            className="btn"
                            style={{ backgroundColor: "#0d8a72", color: "white" }}
                            onClick={handleAddVehicle}
                        >
                            {" "}
                            <FontAwesomeIcon className="me-2" icon={faPlus} />
                            ADD VEHICLE
                        </button>
                    </div>

                    <hr className="vehicle-horizontal-line" />

                    <div className="d-flex">
                        {["ALL STATUSES", "en_route", "in_service", "dock"].map(
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
                        {/* filter */}
                        <div className="d-flex justify-content-between py-2">
                            <div>
                                {/* <div className="btn-group">
                                    <button type="button" className="btn btn-light border-dark border-1 dropdown-toggle rounded px-4 me-2" data-bs-toggle="dropdown" aria-expanded="false" >All Vehicles</button>
                                    <ul className="dropdown-menu">
                                        <li><a className="dropdown-item" href="#">All Vehicles</a></li>
                                        <li><a className="dropdown-item" href="#">All Vehicles</a></li>
                                    </ul>
                                </div> */}
                                <div className="btn-group">
                                    <button
                                        className="btn btn-light border-dark dropdown-toggle px-4 me-2"
                                        data-bs-toggle="dropdown"
                                    >
                                        {vehicleType}
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li>
                                            <a
                                                className="dropdown-item"
                                                onClick={() => setVehicleType("All Types")}
                                            >
                                                All Types
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                className="dropdown-item"
                                                onClick={() => setVehicleType("FP")}
                                            >
                                                FP
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                className="dropdown-item"
                                                onClick={() => setVehicleType("ORD")}
                                            >
                                                ORD
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                className="dropdown-item"
                                                onClick={() => setVehicleType("JN AC")}
                                            >
                                                JN AC
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                className="dropdown-item"
                                                onClick={() => setVehicleType("JN NAC")}
                                            >
                                                JN NAC
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                className="dropdown-item"
                                                onClick={() => setVehicleType("SFP")}
                                            >
                                                SFP
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                className="dropdown-item"
                                                onClick={() => setVehicleType("S/DLX")}
                                            >
                                                S/DLX
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                className="dropdown-item"
                                                onClick={() => setVehicleType("S/EXP")}
                                            >
                                                S/EXP
                                            </a>
                                        </li>

                                        <li>
                                            <a
                                                className="dropdown-item"
                                                onClick={() => setVehicleType("SEMI SLEEPER")}
                                            >
                                                SEMI SLEEPER
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                className="dropdown-item"
                                                onClick={() => setVehicleType("SWIFT AC SEATER")}
                                            >
                                                SWIFT AC SEATER
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                className="dropdown-item"
                                                onClick={() => setVehicleType("SWIFT SLEEPER")}
                                            >
                                                SWIFT SLEEPER
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                className="dropdown-item"
                                                onClick={() => setVehicleType("SWIFT DLX")}
                                            >
                                                SWIFT DLX
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                className="dropdown-item"
                                                onClick={() => setVehicleType("SS")}
                                            >
                                                SS
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                className="dropdown-item"
                                                onClick={() => setVehicleType("SEATER CUM SLEEPER NON AC")}
                                            >
                                                SEATER CUM SLEEPER NON AC
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                className="dropdown-item"
                                                onClick={() => setVehicleType("SEATER CUM SLEEPER AC")}
                                            >
                                                SEATER CUM SLEEPER AC
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                className="dropdown-item"
                                                onClick={() => setVehicleType("S")}
                                            >
                                                S
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                className="dropdown-item"
                                                onClick={() => setVehicleType("ELECTRIC")}
                                            >
                                                ELECTRIC
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                className="dropdown-item"
                                                onClick={() => setVehicleType("EL DD")}
                                            >
                                                EL DD
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                className="dropdown-item"
                                                onClick={() => setVehicleType("BB AC SEATER")}
                                            >
                                                BB AC SEATER
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                className="dropdown-item"
                                                onClick={() => setVehicleType("AC PREMIUM SF")}
                                            >
                                                AC PREMIUM SF
                                            </a>
                                        </li>
                                    </ul>
                                </div>

                                <div className="btn-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search Vehicle"
                                        value={searchVehicle}
                                        onChange={(e) => setSearchVehicle(e.target.value)}
                                    />

                                </div>


                            </div>
                            <div>
                                <button
                                    className="btn btn-light border-dark rounded"
                                    onClick={() => {
                                        setActiveStatus("ALL STATUSES");
                                        setVehicleType("All Types");
                                    }}
                                >
                                    <FontAwesomeIcon className="me-2" icon={faXmark} />
                                    CLEAR
                                </button>
                            </div>
                        </div>

                        <hr className="vehicle-horizontal-line" />

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
                                        {[10, 20, 30].map(size => (
                                            <li key={size}>
                                                <a className="dropdown-item" onClick={() => handleItemsPerPageChange(size)}>
                                                    {size}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <FontAwesomeIcon icon={faChevronLeft} />
                                <FontAwesomeIcon icon={faChevronRight} />
                            </div>
                        </div>

                        {/* table */}
                        <div>
                            <table className="vehicle-table table w-100 ">
                                <thead className="vehicle-thead ">
                                    <tr>
                                        <th> {/*checkbox */}</th>
                                        <th> {/*image */}</th>
                                        <th>VEHICLE</th>
                                        <th>TYPE</th>
                                        <th>STATUS</th>

                                        <th> {/*for update */} </th>
                                        <th>REMARKS</th>
                                        <th> {/*for delete option */}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* {vehiclesData.length>0 && vehiclesData.map(vehicle => (
                                        <tr key={vehicle.id}> */}
                                    {displayedVehicles
                                        .map((vehicle) => (
                                            <tr key={vehicle.id}>
                                                <td>
                                                    <input type="checkbox" />
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
                                                    <div
                                                        className="p-2 rounded"
                                                        style={{
                                                            border: "1px solid black",
                                                            borderRadius: "8px",
                                                            display: "inline-block",
                                                        }}
                                                    >
                                                        {vehicle.status === "in_service" && (
                                                            <>
                                                                <FontAwesomeIcon
                                                                    icon={faCircleCheck}
                                                                    style={{ color: "#189be3" }}
                                                                />
                                                                <span className="ms-2">In Service</span>
                                                            </>
                                                        )}
                                                        {vehicle.status === "en_route" && (
                                                            <>
                                                                <FontAwesomeIcon
                                                                    icon={faLocationArrow}
                                                                    style={{ color: "#0d8a72" }}
                                                                />
                                                                <span className="ms-2">Enroute</span>
                                                            </>
                                                        )}
                                                        {vehicle.status === "dock" && (
                                                            <>
                                                                <FontAwesomeIcon
                                                                    icon={faBan}
                                                                    style={{ color: "#db5c4d" }}
                                                                />
                                                                <span className="ms-2">Dock</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>


                                                <td>
                                                    <div className="btn-group">
                                                        <button
                                                            type="button"
                                                            className="btn btn-light border-dark border-1 dropdown-toggle rounded px-4 me-2"
                                                            data-bs-toggle="dropdown"
                                                            aria-expanded="false"
                                                            style={{ backgroundColor: "#0d8a72", color: "white" }}
                                                        >
                                                            Update Status
                                                        </button>
                                                        <ul className="dropdown-menu">
                                                            <li
                                                                className="dropdown-item"
                                                                role="button"
                                                                onClick={() =>
                                                                    handleChangeVehicleStatus(vehicle, "en_route")
                                                                }
                                                            >
                                                                Enroute
                                                            </li>
                                                            <li
                                                                className="dropdown-item"
                                                                role="button"
                                                                onClick={() =>
                                                                    handleChangeVehicleStatus(
                                                                        vehicle,
                                                                        "in_service"
                                                                    )
                                                                }
                                                            >
                                                                In Service
                                                            </li>
                                                            <li
                                                                className="dropdown-item"
                                                                role="button"
                                                                onClick={() =>
                                                                    handleChangeVehicleStatus(
                                                                        vehicle,
                                                                        "dock"
                                                                    )
                                                                }
                                                            >
                                                                ock
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </td>

                                                <td>{vehicle.dock_reason} {vehicle.dock_depot}</td>
                                                <td>
                                                    <div style={{ position: "relative", width: "100px" }}>
                                                        <FontAwesomeIcon
                                                            icon={faEllipsisVertical}
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => handleShowDeleteOptions(vehicle._id)}
                                                        />
                                                        {showDeleteId === vehicle._id && (
                                                            <button
                                                                className="btn btn-danger"
                                                                style={{ position: "absolute", top: 10, right: 10, zIndex: 10 }}
                                                                onClick={() => handleDeleteSingleVehicle(vehicle._id, vehicle.BUSNO)}
                                                            >
                                                                Delete
                                                            </button>
                                                        )}
                                                    </div>{" "}
                                                </td>

                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>


                        {/* pagination */}
                        <ReactPaginate
                            previousLabel={'Previous'}
                            nextLabel={'Next'}
                            breakLabel={'...'}
                            pageCount={Math.ceil(filteredVehicles.length / itemsPerPage)}
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

                    </div>
                </div>
                <div className="col-md-1"></div>
            </div>




            {/* Modal for DOCK details updation */}
            <Modal size="lg"
                centered
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Confirm DOCK Status Change</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Label className="mb-1" style={{ fontSize: "14px" }}>DOCK DEPOT </Form.Label>
                        <Form.Control type="text" name="firstName" placeholder='Enter the Depot'
                            onChange={e => setConductorData({ ...conductorData, first_name: e.target.value })} />

                        <Form.Label className="mb-1" style={{ fontSize: "14px" }}>Description </Form.Label>
                        <Form.Control as="textarea" name="firstName" placeholder='Enter the Description' rows={4}
                            onChange={e => setConductorData({ ...conductorData, first_name: e.target.value })} />
                    </Form>
                </Modal.Body>
                <Modal.Footer>

                    <Button className="btn" style={{ backgroundColor: "#0d8a72", color: "white" }} onClick={() => {
                        // Confirm DOC status change here
                        setShowDockModal(false);
                        handleChangeVehicleStatus(vehicleData, "dock");
                    }} >Confirm</Button>
                    <Button className="btn btn-danger" onClick={handleClose}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>


            {/* --------------------test------------------ */}





        </>
    );
};

export default Vehicles;
