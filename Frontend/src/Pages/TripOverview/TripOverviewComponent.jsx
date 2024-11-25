import {
  faCalendarDays,
  faCarSide,
  faLocationDot,
  faWallet,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { getAllTripApi, getAllVehiclesApi, getConductorsListApi, getDriversListApi, getTripOfDepotApi } from "../../services/allAPI";
import { depoList } from "../../assets/depoList";
import Table from 'react-bootstrap/Table';

function TripOverviewComponent() {
  let dateToday = new Date(new Date().getTime() + 5.5 * 60 * 60 * 1000)
  dateToday = dateToday.toISOString().split("T")[0]

  const [datePick, setDatePick] = useState(dateToday);
  const [chosenTrip, setChosenTrip] = useState(0);
  const [depo, setDepo] = useState("");
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [Conductors, setConductors] = useState([]);
  const [status,setStatus]=useState("")

  useEffect(() => {
    getTripInitialData();
    getAllVehicles();
    getAllConductors()
    getAllDrivers()
  }, []);
  

  useEffect(() => {
    setFilteredTrips(
      trips
        .filter((item) => {
          const startDate = item?.start_date?.split("T")[0];
          return startDate === datePick;
        })
        .filter(item=>!status?true:item.status==status)
        .filter((item) => {
          if (!depo) return true;
          const depoKeyword = depo.split(" ")[0].toLowerCase();
          return (
            item?.departure_location?.depo?.toLowerCase().includes(depoKeyword) ||
            item?.arrival_location?.depo?.toLowerCase().includes(depoKeyword)
          );
        })
    );
  }, [datePick, trips, depo,status]);

  useEffect(() => {
    setChosenTrip(0);
  }, [filteredTrips]);

  const getTripInitialData = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user"))
      const res = user.role === "Admin" ? await getAllTripApi() : await getTripOfDepotApi(user.depoName);
      setTrips(res.data);
    } catch (error) {
      console.log(`Error fetching trip data: ${error}`);
    }
  };

  const getAllVehicles = async () => {
    try {
      const result = await getAllVehiclesApi()
      if (result.status === 200) {
        setVehicles(result.data)
      } else {
        console.log("Failed to fetch all vehicles", result.message);
      }
    } catch (err) {
      console.log("Failed to fetch all vehicles", err);
    }
  }
  const getAllDrivers = async () => {
    try {
      const result = await getDriversListApi()
      if (result.status === 200) {
        setDrivers(result.data)
      } else {
        console.log("Failed to fetch all drivers", result.message);
      }
    } catch (err) {
      console.log("Failed to fetch all drivers", err);
    }
  }
  const getAllConductors = async () => {
    try {
      const result = await getConductorsListApi()
      if (result.status === 200) {
        setConductors(result.data)
      } else {
        console.log("Failed to fetch all Conductors", result.message);
      }
    } catch (err) {
      console.log("Failed to fetch all Conductors", err);
    }
  }

  console.log(filteredTrips[chosenTrip]);
  

  const tripStatusColor = (status) => {
    if (status === "completed") return "text-success";
    if (status === "live") return "text-info";
    if (status === "upcoming") return "text-dark";
    if (status === "with delay") return "text-warning";
    return "text-danger";
  };

  return (
    <div className="TripOverview border ms-3" style={{ width: "100%" }}>
      <div className="d-flex justify-content-between align-items-center border-bottom p-2">
        <h5 className="m-0">Trips</h5>
        <div className="d-flex gap-5 w-50">
        <div className="d-flex align-items-center gap-2 w-50">
          <div className="position-relative p-1 w-100">
            <input
              type="search"
              className="form-control"
              placeholder="Filter By Depo"
              value={depo}
              onChange={(e) => setDepo(e.target.value)}
            />
            <ul className="position-absolute bg-light" style={{ width: "100%" }}>
              {depoList
                .filter(item => {
                  if (!depo) return false;
                  const depoLower = depo.toLowerCase();
                  return item.code.toLowerCase().includes(depoLower) || item.name.toLowerCase().includes(depoLower);
                })
                .slice(0, 5)
                .map((item, index) => (
                  <li key={index} className="form-control pointer" onClick={() => setDepo(item.code + " " + item.name)}>
                    {item.code} {item.name}
                  </li>
                ))}
            </ul>
          </div>
          <label htmlFor="date" onClick={() => document.getElementById("date").showPicker()}>
            <FontAwesomeIcon icon={faCalendarDays} className="pointer" />
          </label>
          <input
            type="date"
            style={{ opacity: "0", width: "0", height: "0" }}
            id="date"
            value={datePick}
            onChange={(e) => setDatePick(e.target.value)}
          />
        </div>
        <div className="p-1 d-flex align-items-center gap-2 w-50 pe-3">
          <select className="form-control" value={status} onChange={(e)=>setStatus(e.target.value)}>
            <option value="" disabled>Filter By Status</option>
            <option value="live">Live</option>
            <option value="completed">Completed</option>
            <option value="delayed">Delayed</option>
            <option value="failed">Failed</option>
            <option value="upcoming">Upcoming</option>
          </select>
          <FontAwesomeIcon icon={faXmark} onClick={()=>setStatus("")} className="pointer"/>
        </div>
        </div>
      </div>

      {filteredTrips[chosenTrip] && (
        <div className="border p-3">
          <h5 className="mb-3 text-success">
            <span style={{ borderBottom: "green 3px solid" }}>DETAILS</span>
          </h5>
          <div className="row">
            <div className="col">
              <p className="text-secondary m-0">
              <FontAwesomeIcon icon={faWallet} /> Waybill Number
              </p>
              <span className="fw-semibold">{filteredTrips[chosenTrip]?.waybill_Number}</span>
            </div>
            <div className="col">
              <p className="text-secondary m-0">
                <FontAwesomeIcon icon={faCalendarDays} /> Start Time
              </p>
              <span className="fw-semibold">{filteredTrips[chosenTrip]?.start_time}</span>
            </div>
            <div className="col">
              <p className="m-0 text-secondary">
                <FontAwesomeIcon icon={faCalendarDays} /> End Time
              </p>
              <span className="fw-semibold">{filteredTrips[chosenTrip]?.end_time}</span>
            </div>
          </div>
        </div>
      )}


      {/* table start here */}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Bus No.</th>
            <th>Status</th>
            <th>Trip Type</th>
            <th>Departure</th>
            <th>Arrival</th>
            <th>Driver</th>
            <th>Conductor</th>
          </tr>
        </thead>
        <tbody>
          {filteredTrips.map((item, index) => (
            <tr key={index} style={index === chosenTrip ? { backgroundColor: '#f0f0f0' } : {}} onClick={() => setChosenTrip(index)}>
              <td>
                <div className="d-flex align-items-center">
                  <div className={`circle p-1 me-2 ${index === chosenTrip ? "circlePick" : ""}`}>
                    <FontAwesomeIcon icon={faCarSide} />
                  </div>
                  <span>
                    {vehicles.length > 0
                      ? vehicles.find(v => v._id === item.vehicle_id)?.BUSNO
                      : "N/A"}
                  </span>
                </div>
              </td>
              <td className={`${tripStatusColor(item?.status)} ${index === chosenTrip ? "text-primary" : ""}`}>
                {item.status.toUpperCase()}
              </td>
              <td>{item?.trip_type.toUpperCase()}</td>
              <td>
                <div>
                  <FontAwesomeIcon icon={faLocationDot} className="me-2" />
                  <span className="fw-semibold">
                    {item?.departure_location.depo} {depoList.find(d => d.code === item?.departure_location.depo)?.name}
                  </span>
                </div>
                <div className="ms-4">
                  {`${item?.start_date.split("T")[0]} , ${item?.start_time}`}
                </div>
              </td>
              <td>
                <div>
                  <FontAwesomeIcon icon={faLocationDot} className="me-2" />
                  <span className="fw-semibold">
                    {item?.arrival_location.depo} {depoList.find(d => d.code === item?.arrival_location.depo)?.name}
                  </span>
                </div>
                <div className="ms-4">
                  {`${item?.end_date?.split("T")[0] ? item?.end_date?.split("T")[0] : ""} , ${item?.end_time}`}
                </div>
              </td>
              <td>{drivers.find(item2=>item2._id==item?.driver_id)?.EmployeeName || "NA"}</td>
              <td>{Conductors.find(item2=>item2._id==item?.conductor_id)?.EmployeeName || "NA"}</td>
            </tr>
          ))}
        </tbody>
      </Table>

     
    </div>
  );
}

export default TripOverviewComponent;

