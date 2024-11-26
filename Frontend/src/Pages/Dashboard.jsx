import React, { useEffect, useState } from "react";
import Header from "../components/common/Header";
import RealTimeData from "../components/RealTimeData/RealTimeData";
import "./Dashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faBus,
  faIndianRupee,
  faCarBurst,
  faCarSide,
  faChevronRight,
  faCircleExclamation,
  faFan,
  faGasPump,
  faGauge,
  faHandHoldingDollar,
  faLocationDot,
  faOilCan,
  faScrewdriverWrench,
  faTowerBroadcast,
  faTriangleExclamation,
  faVanShuttle,
} from "@fortawesome/free-solid-svg-icons";
import ChartPie from "../components/ChartPie";
import ChartBar from "../components/ChartBar";
import { faServicestack } from "@fortawesome/free-brands-svg-icons";
import {
  getAllTripApi,
  getAllVehiclesApi,
  getOnRouteServicesApi,
  getAvilableServicesApi,
  getAllCollectionAPi,
  getAllOutofServicesApi,
  getAllAlottedDepoVehicleApi,
  getTripOfDepotApi,
  getAllUpcomingTripApi,
  getAllLiveTripApi,
  getAllConductor,
  getAllDrivers,
  getOnRouteServicesByDepoApi,
  getAllOutofServicesByDepoApi,
  getCollectionByDepoAPi,
} from "../services/allAPI";
import ExcelExport from "../components/ExcelExport ";

function Dashboard() {
  const [AllvehicleData, setAllVehicleData] = useState([]);
  const [AllTripDetails, setAllTripDetails] = useState([]);
  const [AllUpcomingTDByDepo, setAllUpcomingTDByDepo] = useState([]);
  const [AllLiveTripdetails, setAllLiveTripDetails] = useState([]);
  // const [AllLiveTripdetailsbyDepo, setAllLiveTripDetailsbyDepo] = useState([])
  const [ConductorDetails, setConductorDetails] = useState([]);
  const [DriverDetails, setDriverDetails] = useState([]);
  const [AllTripDataCount, setAllTripDataCount] = useState(0);
  const [AllOnRouteBusesCount, setAllOnRouteBusesCount] = useState(0);
  const [AllBusesInServiceCount, setAllBusesInServiceCount] = useState(0);
  const [TotalCollection, setTotalcollection] = useState(0);
  const [TotalFuelConsumption, setTotalFuelComsumption] = useState(0);
  const [outOfServicesCount, setOutOfServicesCount] = useState(0);
  const [CompletedTripDetails, setCompletedTripDetails] = useState([]);
  // states for filtering
  const [depoList, setDepoList] = useState([
    "ADR",
    "ALP",
    "ALY",
    "ANK",
    "ARD",
    "ARK",
    "ATL",
    "CDM",
    "CGR",
    "CHT",
    "CHY",
    "CLD",
    "CTL",
    "CTR",
    "EDT",
    "EKM",
    "EMY",
    "ETP",
    "GVR",
    "HPD",
    "IJK",
    "KDR",
    "KGD",
    "KHD",
    "KKD",
    "KKM",
    "KLM",
    "KLP",
    "KMG",
    "KMR",
    "KMY",
    "KNI",
    "KNP",
    "KNR",
    "KPM",
    "KPT",
    "KTD",
    "KTM",
    "KTP",
    "KTR",
    "KYM",
    "MKD",
    "MLA",
    "MLP",
    "MLT",
    "MND",
    "MNR",
    "MPY",
    "MVK",
    "MVP",
    "NBR",
    "NDD",
    "NDM",
    "NPR",
    "NTA",
    "PBA",
    "PBR",
    "PDK",
    "PDM",
    "PLA",
    "PLD",
    "PLK",
    "PLR",
    "PMN",
    "PNI",
    "PNK",
    "PNR",
    "PPD",
    "PPM",
    "PRK",
    "PSL",
    "PTA",
    "PVM",
    "PVR",
    "RNI",
    "SBY",
    "TDP",
    "TDY",
    "TLY",
    "TMY",
    "TPM",
    "TSR",
    "TVL",
    "TVM CL",
    "TVM CTY",
    "TVRA",
    "VDA",
    "VDY",
    "VJD",
    "VKB",
    "VKM",
    "VLD",
    "VRD",
    "VTR",
    "VZM",
  ]);
  const [selectedDepoForFiltering, setSelectedDepoForFiltering] =
    useState("full-data");

  // session data
  const sessionDataValue = JSON.parse(sessionStorage.getItem("user"));

  // Function to format date without time (YYYY-MM-DD)
  const formatDateWithoutTime = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are zero-based
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // Format as YYYY-MM-DD
  };

  // get all Vehicle details
  const getAllVehicleDetails = async () => {
    const userDetails = JSON.parse(sessionStorage.getItem("user"));
    if (userDetails.depoName == "Admin") {
      const result = await getAllVehiclesApi();
      // console.log(result.data);
      if (result.status == 200) {
        setAllVehicleData(result.data);
      }
    } else {
      // get all Vehicle details by depoName
      getAllVehiclesDataFilteredByDepo(userDetails.depoName);
    }
  };

  // get all trip details
  const getAllTripDetails = async () => {
    const userDetails = JSON.parse(sessionStorage.getItem("user"));
    if (userDetails.depoName == "Admin") {
      const result = await getAllTripApi();
      // console.log(result.data);
      if (result.status == 200) {
        setAllTripDetails(result.data);
        const count = result.data.length;
        setAllTripDataCount(count);
      }
    } else {
      //get all trip by DepoName
      getAllTripsDataFilteredByDepo(userDetails.depoName);
    }
  };
  // console.log(AllTripDetails);

  //trip Upcomming departure_location == depoName
  const getUpComingTripDetailsByDepo = async () => {
    const userDetails = JSON.parse(sessionStorage.getItem("user"));
    const result = await getAllUpcomingTripApi(userDetails.depoName);
    if (result.status == 200) {
      setAllUpcomingTDByDepo(result.data);
    }
  };
  // console.log(AllUpcomingTDByDepo);

  // to get all live trip details based upon depo
  const getAllLiveTripByDepo = async () => {
    const userDetails = JSON.parse(sessionStorage.getItem("user"));
    const result = await getAllLiveTripApi(userDetails.depoName);
    if (result.status == 200) {
      setAllLiveTripDetails(result.data);
    }
  };
  // console.log(AllLiveTripdetails);

  //get total number of bussess in route
  const getAllOnRouteDetails = async () => {
    const userDetails = JSON.parse(sessionStorage.getItem("user"));
    if (userDetails.depoName == "Admin") {
      const result = await getOnRouteServicesApi();
      // console.log(result);
      if (result.status == 200) {
        const count = result.data.length;
        setAllOnRouteBusesCount(count);
      }
    } else {
      //get total number of bussess in route by depo
      getAllOnRouteDetailsFilteredByDepo(userDetails.depoName);
    }
  };

  //get total number of out of services bussess in route
  const getOutOfServicesCount = async () => {
    const userDetails = JSON.parse(sessionStorage.getItem("user"));
    if (userDetails.depoName == "Admin") {
      const result = await getAllOutofServicesApi();
      // console.log(result);
      if (result.status == 200) {
        const count = result.data.length;
        setOutOfServicesCount(count);
      }
    } else {
      getOutServicesCountFilteredbyDepo(userDetails.depoName);
    }
  };

  //get All buses in servises
  const getAllBusesInServices = async () => {
    const result = await getAvilableServicesApi();
    const count = result.data.length;
    setAllBusesInServiceCount(count);
  };

  // get All completed Trip details
  const getAllCompletedTripDetails = async () => {
    const userDetails = JSON.parse(sessionStorage.getItem("user"));

    if (userDetails.depoName == "Admin") {
      const result = await getAllCollectionAPi();
      // Fuel Consumption total
      const ftotal = result.data.reduce((total, item) => {
        return total + item.fuelCost;
      }, 0);
      setTotalFuelComsumption(ftotal);
      // Total Collection total
      const ctotal = result.data.reduce((total, item) => {
        return total + item.Tripcollection;
      }, 0);
      setTotalcollection(ctotal);
      console.log(ctotal);
      setCompletedTripDetails(result.data);
    } else {
      getAllCompletedTripsFilteredByDepo(userDetails.depoName);
    }
  };

  //get all conductor details
  const getAllConductordetails = async () => {
    const result = await getAllConductor();
    // console.log(result.data);
    setConductorDetails(result.data);
  };

  //get all driver details
  const getAllDriverdetails = async () => {
    const result = await getAllDrivers();
    // console.log(result.data);
    setDriverDetails(result.data);
  };

  // Function to map conductorId to conductorName
  const getConductorName = (conductorId) => {
    const conductor = ConductorDetails.find(
      (conductor) => conductor._id === conductorId
    );
    return conductor ? conductor.EmployeeName : "Unknown";
  };

  // Function to map driverId to DriverName
  const getDriverName = (driverId) => {
    const driver = DriverDetails.find((driver) => driver._id === driverId);
    return driver ? driver.EmployeeName : "Unknown";
  };

  // // Function to map vehicleId to BusNumber
  const getBusNumber = (vehicleId) => {
    const vehicle = AllvehicleData.find((vehicle) => vehicle._id === vehicleId);
    return vehicle ? vehicle.BUSNO : "Unknown";
  };

  // Function to map driverId to Driver Pen number
  const getDriverPen = (driverId) => {
    const driver = DriverDetails.find((driver) => driver._id === driverId);
    return driver ? driver.PEN : "Unknown";
  };

  //Function to map driverId to Driver Pen number
  const getConductorPen = (conductorId) => {
    const conductor = ConductorDetails.find(
      (conductor) => conductor._id === conductorId
    );
    return conductor ? conductor.PEN : "Unknown";
  };

  // console.log(AllTripDetails);
  // Update AllTripdetals by replacing conductorId with conductorName
  // Reusable transformation function
  // Reusable transformation function
  function transformTripDetails(tripDetails) {
    return tripDetails.map((trip) => {
      const transformedTrip = {
        ...trip, // Spread the original object properties
        // Replace IDs with corresponding values
        conductorName: getConductorName(trip.conductor_id),
        driverName: getDriverName(trip.driver_id),
        busNo: getBusNumber(trip.vehicle_id),
        driverPenNumber: getDriverPen(trip.driver_id),
        conductorPenNumber: getConductorPen(trip.conductor_id),

        arrivalDate: formatDateWithoutTime(trip.end_date),
        departureDate: formatDateWithoutTime(trip.start_date),

        // Flatten location properties
        "arrival_location.depo": trip.arrival_location.depo,
        "departure_location.depo": trip.departure_location.depo,

        // // Remove original location properties
        // departure_location: undefined,
        // arrival_location: undefined,
      };

      // Remove the id fields after transforming them
      delete transformedTrip._id;
      delete transformedTrip.conductor_id;
      delete transformedTrip.driver_id;
      delete transformedTrip.vehicle_id;
      delete transformedTrip.start_date;
      delete transformedTrip.end_date;
      delete transformedTrip.trip_id;
      delete transformedTrip.updated_at;
      delete transformedTrip.__v;
      delete transformedTrip.departure_location;
      delete transformedTrip.arrival_location;
      delete transformedTrip.collection;
      delete transformedTrip.fuelCost;
      return transformedTrip;
    });
  }

  //Arrange the TripCollection Details
  const TripCollectionDetails = CompletedTripDetails.map((obj) => {
    const TripCollectionObj = {
      ...obj,
      collectionDate: formatDateWithoutTime(obj.date),
    };
    delete TripCollectionObj._id;
    delete TripCollectionObj.date;
    delete TripCollectionObj.__v;
    return TripCollectionObj;
  });

  // Apply the transformation to AllTripDetails
  const updatedTripDetails = transformTripDetails(AllTripDetails);
  // console.log(updatedTripDetails);

  // Apply the transformation to AllUpcomingTDByDepo
  const AllUpcomingTDByDepoUpdated = transformTripDetails(AllUpcomingTDByDepo);
  // console.log(AllUpcomingTDByDepoUpdated);

  // Apply the transformation to AllLiveTripdetails
  const AllLiveTDByDepoUpdated = transformTripDetails(AllLiveTripdetails);
  // console.log(AllLiveTDByDepoUpdated);

  // console.log(AllLiveTDByDepoUpdatedflatten);

  //Array of Objects flat() function
  const AllvehicleDataFlatten = AllvehicleData.map((obj) => {
    // Create a new object based on the original object
    const newObj = {
      ...obj, // Spread the original object properties

      // Flattening the 'maintenance_data' fields
      lastWeekelyMaintenanceUpdateDate: formatDateWithoutTime(
        obj.maintenance_data.lastWeekelyMaintenanceUpdateDate
      ),
      // 'weeklyMaintenanceDueDate':formatDateWithoutTime(obj.maintenance_data.weeklyMaintenanceDueDate),
      lastdailyMaintenanceUpdateDate: formatDateWithoutTime(
        obj.maintenance_data.lastdailyMaintenanceUpdateDate
      ),
      // 'weekleyMaintenanceUpdateStatus': obj.maintenance_data.weekleyMaintenanceUpdateStatus,
      // 'dailyMaintenanceUpdateStatus': obj.maintenance_data.dailyMaintenanceUpdateStatus,

      // Add the 'maintenanceStatus' field with Yes/No value based on the statuses
      maintenanceStatusWeekly:
        obj.maintenance_data.weekleyMaintenanceUpdateStatus === "true"
          ? "Yes"
          : "No",
      maintenanceStatusDaily:
        obj.maintenance_data.dailyMaintenanceUpdateStatus === "true"
          ? "Yes"
          : "No",

      // Optionally remove the 'maintenance_data' property
      // maintenance_data: undefined
    };

    // Remove the '_id' property from the object
    delete newObj._id;
    delete newObj.updatedAt;
    delete newObj.maintenance_data;
    delete newObj.weekleyMaintenanceUpdateStatus;
    delete newObj.dailyMaintenanceUpdateStatus;

    // Return the modified object
    return newObj;
  });

  // getFullData for dashboard api handler
  const getInitialFullData = () => {
    getAllVehicleDetails();
    getAllTripDetails();
    getAllOnRouteDetails();
    getAllBusesInServices();
    getAllCompletedTripDetails();
    getOutOfServicesCount();
    getUpComingTripDetailsByDepo();
    getAllLiveTripByDepo();
    getAllConductordetails();
    getAllDriverdetails();
  };

  // console.log(AllvehicleDataFlatten);
  useEffect(() => {
    getInitialFullData();
  }, []);

  ////////////////////////////////////// filter by depo data api handler
  const getAllTripsDataFilteredByDepo = async (depoName) => {
    const result = await getTripOfDepotApi(depoName);
    // console.log(result);
    if (result.status == 200) {
      setAllTripDetails(result.data);
      const count = result.data.length;
      setAllTripDataCount(count);
    } else {
      setAllTripDetails([]);
      setAllTripDataCount(0);
    }
  };

  const getAllVehiclesDataFilteredByDepo = async (depoName) => {
    const result = await getAllAlottedDepoVehicleApi(depoName);
    if (result.status == 200) {
      setAllVehicleData(result.data);
    } else {
      setAllVehicleData([]);
    }
  };

  const getAllOnRouteDetailsFilteredByDepo = async (depoName) => {
    const result = await getOnRouteServicesByDepoApi(depoName);
    if (result.status == 200) {
      const count = result.data.length;
      setAllOnRouteBusesCount(count);
    } else {
      setAllOnRouteBusesCount(0);
    }
  };

  const getAllCompletedTripsFilteredByDepo = async (depoName) => {
    const result = await getCollectionByDepoAPi(depoName);
    if (result.status === 200) {
      // Fuel Consumption total
      const ftotal = result.data.reduce((total, item) => {
        return total + item.fuelCost;
      }, 0);
      setTotalFuelComsumption(ftotal);
      console.log(ftotal);

      // Total Collection total
      const ctotal = result.data.reduce((total, item) => {
        return total + item.Tripcollection;
      }, 0);
      setTotalcollection(ctotal);
      console.log(ctotal);
      setCompletedTripDetails(result.data);
    } else {
      setTotalFuelComsumption(0);
      setTotalcollection(0);
      setCompletedTripDetails([]);
    }
  };

  const getOutServicesCountFilteredbyDepo = async (depoName) => {
    const result = await getAllOutofServicesByDepoApi(depoName);
    // console.log(result.data);
    if (result.status == 200) {
      const count = result.data.length;
      setOutOfServicesCount(count);
    } else {
      setOutOfServicesCount(0);
    }
  };

  // use Effect for filtering
  useEffect(() => {
    if (selectedDepoForFiltering) {
      if (selectedDepoForFiltering === "full-data") {
        getInitialFullData();
      } else {
        getAllTripsDataFilteredByDepo(selectedDepoForFiltering);
        getAllVehiclesDataFilteredByDepo(selectedDepoForFiltering);
        getAllOnRouteDetailsFilteredByDepo(selectedDepoForFiltering);
        getAllCompletedTripsFilteredByDepo(selectedDepoForFiltering);
        getOutServicesCountFilteredbyDepo(selectedDepoForFiltering);
        getUpComingTripDetailsByDepo();
        getAllLiveTripByDepo();
        getAllConductordetails();
        getAllDriverdetails();
      }
    }
  }, [selectedDepoForFiltering]);

  return (
    <>
      <Header />
      <div className="container-fluid w-100 dashboard-container">
        <div className="row">
          <div className="col-md-2"></div>
          <div className="col-md-10">
            <div className="d-flex align-items-center w-full">
              {sessionDataValue && sessionDataValue.depoName == "Admin" && (
                <div className="d-flex gap-2 align-items-center w-50">
                  <p className="mb-0">Filter by depo: </p>
                  <select
                    value={selectedDepoForFiltering}
                    onChange={(e) =>
                      setSelectedDepoForFiltering(e.target.value)
                    }
                    className="dashboard-filter-selectBox shadow-sm"
                  >
                    <option value="full-data" selected>
                      Full Data
                    </option>
                    {depoList &&
                      depoList.map((depo) => (
                        <option value={depo}>{depo}</option>
                      ))}
                  </select>
                </div>
              )}
              <ExcelExport
                data={TripCollectionDetails}
                data1={AllvehicleDataFlatten}
                data2={updatedTripDetails}
                data3={AllUpcomingTDByDepoUpdated}
                data4={AllLiveTDByDepoUpdated}
                fileName="Report"
              />
            </div>
            <RealTimeData />

            {/* section1 */}
            {/* Dashboard Content */}

            <div className="row mt-2 ">
              <div className="col-md-3">
                <div
                  style={{ backgroundColor: "white" }}
                  className="vehicle-data shadow w-100"
                >
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    style={{ color: "#f73b3b", fontSize: "20px" }}
                    className="ms-3 mt-2"
                  />
                  <div className="d-flex align-items-center justify-content-center flex-column vehicle-data-text">
                    <p className="fw-bold fs-4 mt-3">{AllTripDataCount}</p>
                    <h6
                      className="text-secondary"
                      style={{ fontSize: "13px", fontWeight: "normal" }}
                    >
                      Total number of trips
                    </h6>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div
                  style={{ backgroundColor: "white" }}
                  className="vehicle-data shadow  w-100"
                >
                  <FontAwesomeIcon
                    icon={faIndianRupee}
                    style={{ color: "#f73b3b", fontSize: "25px" }}
                    className="ms-3 mt-1"
                  />
                  <div className="d-flex align-items-center justify-content-center flex-column vehicle-data-text ">
                    <p className="fw-bold fs-4 mt-3">
                      {parseFloat(
                        TotalCollection - TotalFuelConsumption
                      ).toFixed(2)}
                    </p>
                    <h6
                      className="text-secondary"
                      style={{ fontSize: "13px", fontWeight: "normal" }}
                    >
                      Total Revenue
                    </h6>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div
                  style={{ backgroundColor: "white" }}
                  className="vehicle-data shadow  w-100"
                >
                  <FontAwesomeIcon
                    icon={faBus}
                    style={{ color: "#f73b3b", fontSize: "20px" }}
                    className="ms-3 mt-2"
                  />
                  <div className="d-flex align-items-center justify-content-center flex-column vehicle-data-text ">
                    {" "}
                    <p className="fw-bold fs-4 mt-3">{AllOnRouteBusesCount}</p>
                    <h6
                      className="text-secondary"
                      style={{ fontSize: "13px", fontWeight: "normal" }}
                    >
                      Total number of buses in route
                    </h6>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div
                  style={{ backgroundColor: "white" }}
                  className="vehicle-data  shadow  w-100 "
                >
                  <FontAwesomeIcon
                    icon={faServicestack}
                    style={{ color: "#f73b3b", fontSize: "25px" }}
                    className="ms-3 mt-1"
                  />
                  <div className="d-flex align-items-center justify-content-center flex-column vehicle-data-text ">
                    {" "}
                    <p className="fw-bold fs-4 mt-3">{outOfServicesCount}</p>
                    <h6
                      className="text-secondary"
                      style={{ fontSize: "13px", fontWeight: "normal" }}
                    >
                      Total number of buses in dock
                    </h6>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="row mt-2">
              <div className="col-md-6 ">
                <div
                  className="p-3 shadow"
                  style={{ backgroundColor: "white" }}
                >
                  {/* Pie Chart */}
                  <h4
                    className="mt-2"
                    style={{ color: "#737373", fontWeight: "600" }}
                  >
                    FLEET OVERVIEW
                  </h4>
                  <ChartPie data={AllvehicleData} />
                </div>
              </div>
              <div className="col-md-6">
                <div
                  className="p-3 shadow"
                  style={{ backgroundColor: "white" }}
                >
                  <h4
                    className="mt-2"
                    style={{ color: "#737373", fontWeight: "600" }}
                  >
                    REVENUE OVERVIEW
                  </h4>

                  {/* Bar Chart */}
                  <ChartBar
                    collection={TotalCollection}
                    fuelconsumtion={TotalFuelConsumption}
                    revenew={TotalCollection - TotalFuelConsumption}
                  />
                  {/* <div style={{ padding: "25px" }}></div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
