import React, { useEffect, useState } from "react";
import "./vehicles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { faBan, faChevronLeft, faChevronRight, faCircleCheck, faEllipsisVertical, faGear, faLocationArrow, faLocationDot, faPlus, faTrashCan, faXmark } from "@fortawesome/free-solid-svg-icons";
import Header from "../../components/common/Header";
import { deleteMultipleVehiclesAPI, deleteSingleVehicleAPI, editStatus, getAllVehicles, updateVehicleStatus } from "../../services/allAPI";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import ReactPaginate from "react-paginate";

const Vehicles = () => {
    const [loading, setLoading] = useState(false);
    const [checked, setChecked] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [filteredDepots, setFilteredDepots] = useState([]);
    const depotList = [
        "ADR", "ALP", "ALY", "ANK", "ARD", "ARK", "ATL", "CDM", "CGR", "CHT", "CHY", "CLD", "CTL",
        "CTR", "EDT", "EKM", "EMY", "ETP", "GVR", "HPD", "IJK", "KDR", "KGD", "KHD", "KKD", "KKM",
        "KLM", "KLP", "KMG", "KMR", "KMY", "KNI", "KNP", "KNR", "KPM", "KPT", "KTD", "KTM", "KTP",
        "KTR", "KYM", "MKD", "MLA", "MLP", "MLT", "MND", "MNR", "MPY", "MVK", "MVP", "NBR", "NDD",
        "NDM", "NPR", "NTA", "PBR", "PDK", "PDM", "PLA", "PLD", "PLK", "PLR", "PMN", "PNI", "PNK",
        "PNR", "PPD", "PPM", "PRK", "PSL", "PTA", "PVM", "PVR", "RNI", "SBY", "TDP", "TDY", "TLY",
        "TMY", "TPM", "TSR", "TVL", "TVM CL", "TVM CTY", "TVRA", "VDA", "VDY", "VJD", "VKB", "VKM",
        "VLD", "VRD", "VTR", "VZM"
    ]


    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [searchVehicle, setSearchVehicle] = useState("")
    const [showDeleteId, setShowDeleteId] = useState(null);
    const [vehiclesData, setVehiclesData] = useState([]);
    const [activeStatus, setActiveStatus] = useState("ALL STATUSES");
    const [vehicleType, setVehicleType] = useState("All Types");
    const [dockDetails, setDockDetails] = useState({
        dock_depot: "", dock_reason: "", status: "dock"
    })
    const navigate = useNavigate();

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = (vehicle) => {
        setSelectedVehicle(vehicle);
        setDockDetails({ dock_depot: "", dock_reason: "", status: "dock" });
        setShow(true)
    };

    // api to get all vechicles
    const getAllVehiclesData = async () => {
        try {
            const allVehicles = await getAllVehicles();
            // console.log(allVehicles.data);
            if (allVehicles.status == 200) {
                setLoading(true)
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

    const handleAddVehicle = () => {
        navigate('/add-vehicle')
    }


    const handleChangeVehicleStatus = async (vehicleData, updatedStatusValue) => {
        const vehicle_id = vehicleData._id;
        const reqbody = { status: updatedStatusValue };

        try {
            if (updatedStatusValue === "dock") {
                handleShow(vehicleData);
                setShow(true);
                return;
            }
            const updatedStatus = await editStatus(vehicle_id, reqbody);
            if (updatedStatus.status === 200) {
                getAllVehiclesData();
                alert("Updated Successfully!");
            } else {
                alert("Error in Updating Status.");
            }

        } catch (err) {
            console.error("Error in updating vehicle status:", err);
            alert("An unexpected error occurred. Please try again.");
        }
    };

    // console.log("vehicleData",vehiclesData);

    // Confirming the dock status change
    const confirmDockStatusChange = async () => {
        if (!selectedVehicle) return;
        const vehicle_id = selectedVehicle._id;
        const reqBody = {
            status: "dock",
            dock_depot: dockDetails.dock_depot,
            dock_reason: dockDetails.dock_reason
        };
        console.log("VehicleId", vehicle_id);
        console.log(reqBody);


        try {
            const dockStatus = await editStatus(vehicle_id, reqBody);
            if (dockStatus.status === 200) {
                console.log("Change Status Successfully");
                getAllVehiclesData();
            } else {
                alert("Error in Updating Status.");
            }
            handleClose()
        } catch (err) {
            console.log(err);
        }
    };

    //api to Delete single vehicle
    const handleDeleteSingleVehicle = async (vehicleId, BUSNO) => {
        try {
            const result = await deleteSingleVehicleAPI(vehicleId)
            if (result.status == 200) {
                alert(`Vehicle ${BUSNO} deleted`);
                setVehiclesData((prevData) => prevData.filter(vehicle => vehicle.vehicleId !== vehicleId));
            }
            // Refresh or update list after deletion
        } catch (error) {
            console.error("Error deleting vehicle:", error);
            alert("Error deleting vehicle. Please try again.");
        }
    };

    const handleShowDeleteOptions = (id) => {
        setShowDeleteId((prevId) => (prevId === id ? null : id));
    };



    //checkbox
    const handleCheckboxChange = (vehicleId) => {
        setChecked((prevChecked) => {
            if (prevChecked.includes(vehicleId)) {
                // If the vehicle ID is already checked, remove it
                return prevChecked.filter(id => id !== vehicleId);
            } else {
                // If the vehicle ID is not checked, add it
                return [...prevChecked, vehicleId];
            }
        });
    };
    // console.log(checked);


    // apicall to delete checked vehicles
    const handleDeleteSelectedVehicles = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete the selected vehicles?");
        if (!confirmDelete) {
            setChecked([])
            return;
        }
        try {
            const result = await deleteMultipleVehiclesAPI(checked)
            // console.log(result);
            if (result.status == 200) {
                setVehiclesData((prevData) => prevData.filter(vehicle => !checked.includes(vehicle._id)));
                setChecked([]);
                alert("Selected vehicles deleted successfully.");
            } else {
                alert("error")
            }
        } catch (error) {
            console.error("Error deleting vehicles:", error);
            alert("Error deleting vehicles. Please try again.");
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
        setCurrentPage(data.selected);

    }
    const handleDepotInputChange = (e) => {
        const value = e.target.value;
        setDockDetails({ ...dockDetails, dock_depot: value });
        const filtered = depotList.filter(depot =>
            depot.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredDepots(filtered);
    };

    // handle depot selection
    const handleDepotSelect = (depot) => {
        setDockDetails({ ...dockDetails, dock_depot: depot });
        setFilteredDepots([]);
    };
    useEffect(() => {
        const fetchData = async () => {
            await getAllVehiclesData();
        };
        fetchData();
    }, []);

    useEffect(() => {
        const updatedFilteredVehicles = vehiclesData
            .filter(vehicle => vehicleType === "All Types" || vehicle.CLASS === vehicleType)
            .filter(vehicle => activeStatus === "ALL STATUSES" || activeStatus === vehicle.status)
            .filter(vehicle =>
                !searchVehicle ||
                (vehicle.BUSNO && vehicle.BUSNO.toLowerCase().includes(searchVehicle.toLowerCase())) ||
                (vehicle.REGNO && vehicle.REGNO.toLowerCase().includes(searchVehicle.toLowerCase()))
            );
        setFilteredVehicles(updatedFilteredVehicles);
        setCurrentPage(0);
    }, [vehiclesData, activeStatus, vehicleType, searchVehicle]);


    return (
        <>
            <div className="row">
                <Header />
                <div className="col-md-2"></div>
                <div className="col-md-9">
                    <div className="d-flex justify-content-between my-1 mx-3">
                        <h4>Vehicles</h4>
                        <button className="btn" style={{ backgroundColor: "#0d8a72", color: "white" }} onClick={handleAddVehicle} >
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
                            <div className="d-flex gap-3">
                                <Form.Control as="select" value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
                                    <option disabled value="">
                                        Select Vehicle Type
                                    </option>
                                    <option value="All Types">All Types</option>
                                    <option value="FP">FP</option>
                                    <option value="ORD">ORD</option>
                                    <option value="JN AC">JN AC</option>
                                    <option value="JN NAC">JN NAC</option>
                                    <option value="SFP">SFP</option>
                                    <option value="S/DLX">S/DLX</option>
                                    <option value="S/EXP">S/EXP</option>
                                    <option value="SEMI SLEEPER">SEMI SLEEPER</option>
                                    <option value="SWIFT AC SEATER">SWIFT AC SEATER</option>
                                    <option value="SWIFT SLEEPER">SWIFT SLEEPER</option>
                                    <option value="SWIFT DLX">SWIFT DLX</option>
                                    <option value="SS">SS</option>
                                    <option value="SEATER CUM SLEEPER NON AC">SEATER CUM SLEEPER NON AC</option>
                                    <option value="SEATER CUM SLEEPER AC">SEATER CUM SLEEPER AC</option>
                                    <option value="S">S</option>
                                    <option value="ELECTRIC">ELECTRIC</option>
                                    <option value="EL DD">EL DD</option>
                                    <option value="BB AC SEATER">BB AC SEATER</option>
                                    <option value="AC PREMIUM SF">AC PREMIUM SF</option>
                                </Form.Control>


                                <div className="btn-group">
                                    <input type="text" className="form-control" placeholder="Search Vehicle" value={searchVehicle} onChange={(e) => setSearchVehicle(e.target.value)} />
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
                            <div className="d-flex gap-5 ms-5">
                                {/* <FontAwesomeIcon icon={faGear} /> */}
                                {/* <FontAwesomeIcon icon={faTrashCan} onClick={handleDeleteSelectedVehicles} /> */}
                                <FontAwesomeIcon
                                    icon={faTrashCan}
                                    onClick={checked.length > 0 ? handleDeleteSelectedVehicles : null}
                                    className={checked.length === 0 ? "text-muted" : ""}
                                    style={{ cursor: checked.length > 0 ? "pointer" : "not-allowed" }}
                                />
                            </div>

                            {/* Right - Items on page, dropdown, pagination */}
                            <div className="d-flex gap-2 align-items-center me-5">
                                <p className="mb-0">Items on page</p>
                                <div >
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

                        {/* table */}
                        {loading ? (
                            <div className="text-center text-danger d-flex align-items-center justify-content-center" style={{height:'50vh'}}>
                            <h4>Loading<Spinner className='ms-2' animation="border" variant="danger" /></h4>
                          </div>
                        ) : (
                            <div>
                                <table className="vehicle-table table w-100 ">
                                    <thead className="vehicle-thead ">
                                        <tr>
                                            <th>  {/*  checkbox */}</th>
                                            <th>S.No</th>
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

                                        {displayedVehicles
                                            .map((vehicle,index) => (
                                                <tr key={vehicle._id}>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={checked.includes(vehicle._id)} // Check if the vehicle ID is in the checked state
                                                            onChange={() => handleCheckboxChange(vehicle._id)} // Handle checkbox change
                                                        />
                                                    </td>
                                                    <td>{currentPage* itemsPerPage +index+1}</td>
                                                    <td>
                                                        <img src="https://english.mathrubhumi.com/image/contentid/policy:1.5293129:1644566410/image.jpg?$p=0f6e831&f=4x3&w=1080&q=0.8" alt="" height={"50px"} width={"50px"} />
                                                    </td>
                                                    <td>
                                                        <strong>{vehicle.BUSNO}</strong>
                                                        <br />
                                                        <span>{vehicle.REGNO}</span>
                                                    </td>
                                                    <td>{vehicle.CLASS}</td>
                                                    <td>
                                                        <div className="p-2 rounded" style={{ border: "1px solid black", borderRadius: "8px", display: "inline-block", }} >
                                                            {vehicle.status === "in_service" && (
                                                                <>
                                                                    <FontAwesomeIcon icon={faCircleCheck} style={{ color: "#189be3" }} />
                                                                    <span className="ms-2">In Service</span>
                                                                </>
                                                            )}
                                                            {vehicle.status === "en_route" && (
                                                                <>
                                                                    <FontAwesomeIcon icon={faLocationArrow} style={{ color: "#0d8a72" }} />
                                                                    <span className="ms-2">Enroute</span>
                                                                </>
                                                            )}
                                                            {vehicle.status === "dock" && (
                                                                <>
                                                                    <FontAwesomeIcon icon={faBan} style={{ color: "#db5c4d" }} />
                                                                    <span className="ms-2">Dock</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {/* <div className="btn-group">
                                                        <button type="button" className="btn btn-light border-dark border-1 dropdown-toggle rounded px-4 me-2" data-bs-toggle="dropdown" aria-expanded="false" style={{ backgroundColor: "#0d8a72", color: "white" }} > Update Status </button>
                                                        <ul className="dropdown-menu">
                                                            <li className="dropdown-item" role="button"
                                                                onClick={() => handleChangeVehicleStatus(vehicle, "en_route")} > Enroute </li>
                                                            <li className="dropdown-item" role="button"
                                                                onClick={() => handleChangeVehicleStatus(vehicle, "in_service")} > In Service </li>
                                                            <li className="dropdown-item" role="button"
                                                                onClick={() => handleChangeVehicleStatus(vehicle, "dock")} > Dock </li>
                                                        </ul>
                                                    </div> */}
                                                        <Form.Control
                                                            as="select"
                                                            value=""
                                                            onChange={(e) => handleChangeVehicleStatus(vehicle, e.target.value)}
                                                            className="rounded px-4 me-2"
                                                            style={{ backgroundColor: "#0d8a72", color: "white", border: "1px solid #000", width: "170px" }}
                                                        >
                                                            <option className="bg-light" disabled value="">
                                                                Update Status
                                                            </option>
                                                            <option style={{ color: "black" }} className="bg-light" value="en_route">Enroute</option>
                                                            <option style={{ color: "black" }} className="bg-light" value="in_service">In Service</option>
                                                            <option style={{ color: "black" }} className="bg-light" value="dock">Dock</option>
                                                        </Form.Control>

                                                        {/* Modal for DOCK details updation */}
                                                        <Modal size="lg" centered show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                                                            <Modal.Header closeButton>
                                                                <Modal.Title>Confirm DOCK Status Change</Modal.Title>
                                                            </Modal.Header>
                                                            <Modal.Body>
                                                                <Form>
                                                                    <Form.Label className="mb-1" style={{ fontSize: "14px" }}>Dock Depot</Form.Label>
                                                                    <Form.Control
                                                                        type="text"
                                                                        placeholder='Type to search depot'
                                                                        value={dockDetails.dock_depot}
                                                                        onChange={handleDepotInputChange}
                                                                    />
                                                                    {filteredDepots.length > 0 && (
                                                                        <ul className="list-group">
                                                                            {filteredDepots.map((depot, index) => (
                                                                                <li
                                                                                    key={index}
                                                                                    className="list-group-item"
                                                                                    style={{ cursor: "pointer" }}
                                                                                    onClick={() => handleDepotSelect(depot)}
                                                                                >
                                                                                    {depot}
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    )}
                                                                    <Form.Label className="mb-1" style={{ fontSize: "14px" }}>Description</Form.Label>
                                                                    <Form.Control
                                                                        as="textarea"
                                                                        name="description"
                                                                        placeholder='Enter the Description'
                                                                        rows={4}
                                                                        value={dockDetails.dock_reason}
                                                                        onChange={(e) => setDockDetails({ ...dockDetails, dock_reason: e.target.value })}
                                                                    />
                                                                </Form>
                                                            </Modal.Body>
                                                            <Modal.Footer>
                                                                <Button className="btn" style={{ backgroundColor: "#0d8a72", color: "white" }}
                                                                    onClick={confirmDockStatusChange}>
                                                                    Confirm
                                                                </Button>
                                                                <Button className="btn btn-danger" onClick={handleClose}> Cancel </Button>
                                                            </Modal.Footer>
                                                        </Modal>
                                                    </td>
                                                    <td>
                                                        {vehicle.status === 'dock' && vehicle.dock_depot && (
                                                            <p>
                                                                Docked at {vehicle.dock_depot} <br />
                                                                {vehicle.dock_reason}
                                                            </p>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <div style={{ position: "relative", width: "100px" }}>
                                                            <FontAwesomeIcon icon={faEllipsisVertical} style={{ cursor: "pointer" }} onClick={() => handleShowDeleteOptions(vehicle._id)} />
                                                            {showDeleteId === vehicle._id && (
                                                                <button className="btn btn-danger" style={{ position: "absolute", top: 10, right: 10, zIndex: 10 }} onClick={() => handleDeleteSingleVehicle(vehicle._id, vehicle.BUSNO)} > Delete </button>
                                                            )}
                                                        </div>{" "}
                                                    </td>

                                                </tr>
                                            ))
                                        }

                                    </tbody>
                                </table>

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
                        )}
                    </div>
                </div>
                <div className="col-md-1"></div>
            </div>
        </>
    );
};

export default Vehicles;