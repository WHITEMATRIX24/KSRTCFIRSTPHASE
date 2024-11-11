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
import NavSidebar from "../../components/common/Sidebar/NavSidebar";
import { getAllVehicles, updateVehicleStatus } from "../../services/allApi";

const Vehicles = () => {
    const [vehiclesData, setVehiclesData] = useState([]);
    const [activeStatus, setActiveStatus] = useState("ALL STATUSES");
    const [vehicleType, setVehicleType] = useState("All Types");
    const [showEditOptions, setShowEditOptions] = useState({});
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
    // console.log(activeStatus)
    // console.log(vehiclesData);

    const toggleEditOptions = (vehicleId) => {
        setShowEditOptions((prev) => ({
            ...prev,
            [vehicleId]: !prev[vehicleId],
        }));
    };
    const handleAddVehicle = () => {
        navigate('/add-vehicle')
    }
    // const handleEdit = (vehicleId) => {
    //     // Open edit modal or take any other action
    //     console.log("Edit vehicle with ID:", vehicleId);
    // };

    //   vehicle status changer
    const handleChangeVehicleStatus = async (vehicleData, updatedStatusValue) => {
        const vehicleFormData = new FormData();

        vehicleFormData.append("number", vehicleData.number);
        vehicleFormData.append("model", vehicleData.model);
        vehicleFormData.append("status", updatedStatusValue);
        vehicleFormData.append("transport_type", vehicleData.transport_type);
        vehicleFormData.append("odometer", vehicleData.odometer);

        try {
            const res = await updateVehicleStatus(vehicleData._id, vehicleFormData);
            if (res.status === 200) {
                alert("vehicle status update successfull");
            }
        } catch (error) {
            console.log(`error in updating vehicle status erro: ${error}`);
        }
    };

    useEffect(() => {
        getAllVehiclesData();
    }, []);

    return (
        <>
            <div className="row">
                <Header />
                <div className="col-md-2">
                    <NavSidebar />
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
                        {["ALL STATUSES", "enroute", "available", "out_of_services"].map(
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
                                                onClick={() => setVehicleType("deluxe")}
                                            >
                                                Super Deluxe
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                className="dropdown-item"
                                                onClick={() => setVehicleType("super")}
                                            >
                                                Fast Passenger
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                className="dropdown-item"
                                                onClick={() => setVehicleType("superfast")}
                                            >
                                                Super Fast
                                            </a>
                                        </li>
                                    </ul>
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
                                <FontAwesomeIcon icon={faGear} />
                                <FontAwesomeIcon icon={faTrashCan} />
                            </div>

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
                                        10
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li>
                                            <a className="dropdown-item" href="#">
                                                20
                                            </a>
                                        </li>
                                        <li>
                                            <a className="dropdown-item" href="#">
                                                30
                                            </a>
                                        </li>
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

                                        <th> {/*update */} </th>
                                        <th> {/*for delete option */}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* {vehiclesData.length>0 && vehiclesData.map(vehicle => (
                                        <tr key={vehicle.id}> */}
                                    {vehiclesData
                                        .filter(
                                            (vehicle) =>
                                                vehicleType === "All Types" ||
                                                vehicle.transport_type === vehicleType
                                        )
                                        .filter((vehicle) =>
                                            activeStatus == "ALL STATUSES"
                                                ? true
                                                : activeStatus == vehicle.status
                                        )
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
                                                    <strong>{vehicle.number}</strong>
                                                    <br />
                                                    <span>{vehicle.model}</span>
                                                </td>

                                                <td>{vehicle.transport_type}</td>

                                                <td>
                                                    <div
                                                        className=" p-2 rounded"
                                                        style={{
                                                            border: "1px solid black",
                                                            borderRadius: "8px",
                                                            display: "inline-block",
                                                        }}
                                                    >
                                                        {vehicle.status === "available" && (
                                                            <FontAwesomeIcon
                                                                icon={faCircleCheck}
                                                                style={{ color: "#189be3" }}
                                                            />
                                                        )}
                                                        {vehicle.status === "enroute" && (
                                                            <FontAwesomeIcon
                                                                icon={faLocationArrow}
                                                                style={{ color: "#0d8a72" }}
                                                            />
                                                        )}
                                                        {vehicle.status === "out_of_services" && (
                                                            <FontAwesomeIcon
                                                                icon={faBan}
                                                                style={{ color: "#db5c4d" }}
                                                            />
                                                        )}
                                                        <span className="ms-2">{vehicle.status}</span>
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
                                                                    handleChangeVehicleStatus(vehicle, "enroute")
                                                                }
                                                            >
                                                                enroute
                                                            </li>
                                                            <li
                                                                className="dropdown-item"
                                                                role="button"
                                                                onClick={() =>
                                                                    handleChangeVehicleStatus(
                                                                        vehicle,
                                                                        "available"
                                                                    )
                                                                }
                                                            >
                                                                available
                                                            </li>
                                                            <li
                                                                className="dropdown-item"
                                                                role="button"
                                                                onClick={() =>
                                                                    handleChangeVehicleStatus(
                                                                        vehicle,
                                                                        "out_of_service"
                                                                    )
                                                                }
                                                            >
                                                                out of service
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </td>

                                                <td>
                                                    <div style={{ position: "relative", width: "50px" }}>
                                                        <FontAwesomeIcon
                                                            icon={faEllipsisVertical}
                                                            onClick={() => toggleEditOptions(vehicle.id)}
                                                            style={{ cursor: "pointer" }}
                                                        />
                                                        {showEditOptions[vehicle.id] && (
                                                            <div
                                                                className="edit-options-dropdown"
                                                                style={{
                                                                    position: "absolute",
                                                                    top: "100%",
                                                                    right: 0,
                                                                    background: "white",
                                                                    border: "1px solid #ddd",
                                                                    padding: "5px",

                                                                    zIndex: 10,
                                                                    borderRadius: "4px",
                                                                }}
                                                            >
                                                                <button
                                                                    onClick={() => handleEdit(vehicle.id)}
                                                                    className="dropdown-item"
                                                                >
                                                                    Edit
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>{" "}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="col-md-1"></div>
            </div>
        </>
    );
};

export default Vehicles;
